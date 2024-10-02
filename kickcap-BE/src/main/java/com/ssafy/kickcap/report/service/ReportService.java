package com.ssafy.kickcap.report.service;

import com.ssafy.kickcap.bill.entity.Bill;
import com.ssafy.kickcap.bill.entity.PaidStatus;
import com.ssafy.kickcap.bill.repository.BillRepository;
import com.ssafy.kickcap.bill.service.BillService;
import com.ssafy.kickcap.exception.ErrorCode;
import com.ssafy.kickcap.exception.RestApiException;
import com.ssafy.kickcap.fcm.service.FirebaseMessageService;
import com.ssafy.kickcap.notification.entity.NotificationType;
import com.ssafy.kickcap.report.dto.ReportListResponseDto;
import com.ssafy.kickcap.report.dto.ReportResponseDto;
import com.ssafy.kickcap.report.entity.ApproveStatus;
import com.ssafy.kickcap.report.entity.Informer;
import com.ssafy.kickcap.report.entity.Report;
import com.ssafy.kickcap.report.repository.InformerRepository;
import com.ssafy.kickcap.report.repository.ReportRepository;
import com.ssafy.kickcap.user.entity.Member;
import com.ssafy.kickcap.user.entity.Police;
import com.ssafy.kickcap.user.repository.MemberRepository;
import com.ssafy.kickcap.violationtype.entity.ViolationType;
import com.ssafy.kickcap.violationtype.repository.ViolationTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;
    private final ViolationTypeRepository violationTypeRepository;
    private final BillRepository billRepository;
    private final MemberRepository memberRepository;
    private final InformerRepository informerRepository;
    private final BillService billService;
    private final FirebaseMessageService messageService;

    private static final int DEFAULT_PAGE_SIZE = 10;
    private static final List<ApproveStatus> COMPLETED_STATUSES = Arrays.asList(ApproveStatus.APPROVED, ApproveStatus.REJECTED);

    public Long getUnApprovedReportCount(Long violationTypeId, Police police) {
        ViolationType violationType = violationTypeRepository.findById(violationTypeId).orElseThrow(() -> new RestApiException(ErrorCode.NOT_FOUND));
        return reportRepository.countByViolationTypeAndApproveStatusAndPolice(violationType, ApproveStatus.UNAPPROVED, police);
    }

    public Long getCompletedReportCount(Long violationTypeId, Police police) {
        ViolationType violationType = violationTypeRepository.findById(violationTypeId).orElseThrow(() -> new RestApiException(ErrorCode.NOT_FOUND));
        return reportRepository.countCompletedReports(violationType, COMPLETED_STATUSES, police);
    }

    public List<ReportListResponseDto> getUnApprovedReports(Long violationTypeId, Police police, int pageNo) {
        // 페이지 요청 객체 생성 (첫 페이지는 0부터 시작)
        Pageable pageable = PageRequest.of(pageNo - 1, DEFAULT_PAGE_SIZE); // 페이지 크기: 10

        ViolationType violationType = violationTypeRepository.findById(violationTypeId).orElseThrow(() -> new RestApiException(ErrorCode.NOT_FOUND));

        // 리포트를 페이지네이션하여 조회
        Page<Report> reportPage = reportRepository.findByViolationTypeAndApproveStatusAndPoliceOrderByIdDesc(violationType, ApproveStatus.UNAPPROVED, police, pageable);

        return reportPage.getContent().stream()
                .map(ReportListResponseDto::fromEntity)
                .collect(Collectors.toList()); // DTO 리스트 반환
    }

    public List<ReportListResponseDto> getCompletedReports(Long violationTypeId, Police police, int pageNo) {
        // 페이지 요청 객체 생성 (첫 페이지는 0부터 시작)
        Pageable pageable = PageRequest.of(pageNo - 1, DEFAULT_PAGE_SIZE); // 페이지 크기: 10

        ViolationType violationType = violationTypeRepository.findById(violationTypeId).orElseThrow(() -> new RestApiException(ErrorCode.NOT_FOUND));

        Page<Report> reportPage = reportRepository.findByViolationTypeAndApproveStatusInAndPoliceOrderByIdDesc(violationType, COMPLETED_STATUSES, police, pageable);

        return reportPage.getContent().stream()
                .map(ReportListResponseDto::fromEntity)
                .collect(Collectors.toList()); // DTO 리스트 반환
    }

    public ReportResponseDto getReport(Police police, Long reportId) {

        Report report = reportRepository.findById(reportId).orElseThrow(() -> new RestApiException(ErrorCode.NOT_FOUND));

        if (report.getPolice().getPoliceId() != police.getPoliceId()) {
            throw new RestApiException(ErrorCode.FORBIDDEN_ACCESS);
        }

        ViolationType violationType = violationTypeRepository.findById(report.getViolationType().getId())
                .orElseThrow(() -> new RestApiException(ErrorCode.NOT_FOUND));

        Member member = memberRepository.findById(report.getMember().getId())
                .orElseThrow(() -> new RestApiException(ErrorCode.NOT_FOUND));

        int isEnd;  // 0 = 미완료, 1 = 완료

        if (report.getApproveStatus().equals(ApproveStatus.UNAPPROVED)) {
            isEnd = 0;
        } else {
            isEnd = 1;
        }
        return ReportResponseDto.builder()
                .idx(reportId)
                .memberId(member.getId())
                .violationType(violationType.getName())
                .description(report.getDescription())
                .createTime(report.getCreatedAt().toString())
                .addr(report.getAddress())
                .imageSrc(report.getImageSrc())
                .lat(report.getLatitude())
                .lng(report.getLongitude())
                .isEnd(isEnd)
                .build();
    }

    public void approveReport(Police police, Long reportId) {
        Report report = reportRepository.findById(reportId).orElseThrow(() -> new RestApiException(ErrorCode.NOT_FOUND));
        // 로그인한 경찰 아이디와 신고 담당 경찰서 아이디가 맞는지 확인
        if (report.getPolice().getPoliceId() != police.getPoliceId()) {
            throw new RestApiException(ErrorCode.FORBIDDEN_ACCESS);
        }

        // 신고 상태 업데이트 UPAPPROVED -> APPROVED
        report.updateApproveStatus(ApproveStatus.APPROVED);
        reportRepository.save(report);

        Member member = report.getMember();

        // 단속 유형에 따른 벌점 update , 고지서 생성될 때마다 update
        member.updateDemerit(member.getDemerit() + report.getViolationType().getScore());

        memberRepository.save(member);

        // 고지서 생성
        Bill bill = billService.createBillFromReport(report, police);

        // member에게 푸시 알림
        messageService.sendMessage(member.getId(), NotificationType.BILL, bill.getId());

        // 신고자에게 푸시 알림 (accused_idx가 memberIdx랑 같으면서 report의 kickboardNumber가 같으면서 is_Sent가 N인 컬럼 member
        List<Informer> informerList = informerRepository.findByAccusedIdxAndKickboardNumberAndIsSent(member.getId(), report.getKickboardNumber());
        for (Informer informer : informerList) {
            messageService.sendMessage(informer.getMember().getId(), NotificationType.APPROVE, bill.getId());
            // 알림 보냄 유무 업데이트 N -> Y로
            informer.updateIsSent("Y");
            informerRepository.save(informer);
        }
    }

    public void rejectReport(Police police, Long reportId) {
        Report report = reportRepository.findById(reportId).orElseThrow(() -> new RestApiException(ErrorCode.NOT_FOUND));
        // 로그인한 경찰 아이디와 신고 담당 경찰서 아이디가 맞는지 확인
        if (report.getPolice().getPoliceId() != police.getPoliceId()) {
            throw new RestApiException(ErrorCode.FORBIDDEN_ACCESS);
        }

        // 신고 상태 업데이트 UPAPPROVED -> APPROVED
        report.updateApproveStatus(ApproveStatus.REJECTED);
        reportRepository.save(report);

        // 신고자에게 푸시 알림 (accused_idx가 memberIdx랑 같으면서 report의 kickboardNumber가 같으면서 is_Sent가 N인 컬럼 member
        List<Informer> informerList = informerRepository.findByAccusedIdxAndKickboardNumberAndIsSent(report.getMember().getId(), report.getKickboardNumber());
        for (Informer informer : informerList) {
            messageService.sendMessage(informer.getMember().getId(), NotificationType.REJECT, null);
            // 알림 보냄 유무 업데이트 N -> Y로
            informer.updateIsSent("Y");
            informerRepository.save(informer);
        }
    }
}
