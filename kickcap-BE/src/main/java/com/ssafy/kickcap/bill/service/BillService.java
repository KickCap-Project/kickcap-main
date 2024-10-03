package com.ssafy.kickcap.bill.service;

import com.ssafy.kickcap.bill.dto.BillListResponseDto;
import com.ssafy.kickcap.bill.dto.BillObjectionDto;
import com.ssafy.kickcap.bill.dto.BillResponseDto;
import com.ssafy.kickcap.bill.dto.EduRequestDto;
import com.ssafy.kickcap.bill.entity.Bill;
import com.ssafy.kickcap.bill.entity.PaidStatus;
import com.ssafy.kickcap.bill.entity.ReportType;
import com.ssafy.kickcap.bill.repository.BillRepository;
import com.ssafy.kickcap.cctv.entity.CCTVInfo;
import com.ssafy.kickcap.cctv.entity.Crackdown;
import com.ssafy.kickcap.cctv.repository.CrackdownRepository;
import com.ssafy.kickcap.exception.ErrorCode;
import com.ssafy.kickcap.exception.RestApiException;
import com.ssafy.kickcap.objection.entity.Objection;
import com.ssafy.kickcap.objection.repository.ObjectionRepository;
import com.ssafy.kickcap.report.entity.Report;
import com.ssafy.kickcap.report.repository.ReportRepository;
import com.ssafy.kickcap.user.entity.Member;
import com.ssafy.kickcap.user.entity.Police;
import com.ssafy.kickcap.user.repository.MemberRepository;
import com.ssafy.kickcap.user.repository.PoliceRepository;
import com.ssafy.kickcap.violationtype.entity.ViolationType;
import com.ssafy.kickcap.violationtype.repository.ViolationTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BillService {

    private static final int DEFAULT_PAGE_SIZE = 10;
    private final MemberRepository memberRepository;
    private final BillRepository billRepository;
    private final ReportRepository reportRepository;
    private final ViolationTypeRepository violationTypeRepository;
    private final PoliceRepository policeRepository;
    private final CrackdownRepository crackdownRepository;
    private final ObjectionRepository objectionRepository;

    public List<BillListResponseDto> getBillList(Long memberId, int pageNo) {
        // 페이지 요청 객체 생성 (첫 페이지는 0부터 시작)
        Pageable pageable = PageRequest.of(pageNo - 1, DEFAULT_PAGE_SIZE);

        Member member = memberRepository.findById(memberId).orElseThrow(() -> new RestApiException(ErrorCode.NOT_FOUND));

//        Page<Bill> billPage = billRepository.findByMemberOrderByDeadlineDesc(member, pageable);
        Page<Bill> billPage = billRepository.findByMemberAndPaidStatusNotOrderByDeadlineAsc(member, PaidStatus.CANCEL, pageable);

        // Bill -> BillListResponseDto 변환
        return billPage.stream()
                .map(bill -> {
                    String violationTypeName = null;
                    if (bill.getReportType().equals(ReportType.USER)) {
                        // Report 조회
                        Report report = reportRepository.findById(bill.getReportId())
                                .orElseThrow(() -> new RestApiException(ErrorCode.NOT_FOUND));

                        // Bill -> BillListResponseDto 변환
                        return BillListResponseDto.builder()
                                .idx(bill.getId())
                                .date(report.getReportTime().toString())
                                .violationType(report.getViolationType().getName())
                                .deadLine(bill.getDeadline().toString()) // 마감일
                                .isFlag(setFlag(bill)) // 상태 플래그 설정
                                .build();
                    } else {
                        Crackdown crackdown = crackdownRepository.findById(bill.getReportId())
                                .orElseThrow(() -> new RestApiException(ErrorCode.NOT_FOUND));
                        // Bill -> BillListResponseDto 변환
                        return BillListResponseDto.builder()
                                .idx(bill.getId())
                                .date(crackdown.getCrackdownTime().toString())
                                .violationType(crackdown.getViolationType().getName())
                                .deadLine(bill.getDeadline().toString()) // 마감일
                                .isFlag(setFlag(bill)) // 상태 플래그 설정
                                .build();
                    }
                })
                .toList();
    }

    private int setFlag(Bill bill) {
        if (bill.getPaidStatus() == PaidStatus.PAID) {
            return 1; // 납부
        } else if (bill.getIsObjection().equals("Y") && bill.getPaidStatus() == PaidStatus.UNPAID) {
            return 2; // 이의중
        } else if (bill.getDeadline().isBefore(ZonedDateTime.now().plusDays(2))) {
            return 3; // 마감 2일전
        } else if (bill.getIsObjection().equals("N") && bill.getPaidStatus() == PaidStatus.UNPAID) {
            return 0; // 미납
        }
        return 0; // 기본적으로 미납 상태 처리
    }

    public BillResponseDto getBill(Long memberId, Long billId) {

        Bill bill = billRepository.findById(billId).orElseThrow(() -> new RestApiException(ErrorCode.NOT_FOUND));

        Police police = policeRepository.findById(bill.getPolice().getId()).orElseThrow(() -> new RestApiException(ErrorCode.NOT_FOUND));

        if (bill.getReportType().equals(ReportType.USER)) {

            Report report = reportRepository.findById(bill.getReportId()).orElseThrow(() -> new RestApiException(ErrorCode.NOT_FOUND));

            ViolationType violationType = violationTypeRepository.findById(report.getViolationType().getId()).orElseThrow(() -> new RestApiException(ErrorCode.NOT_FOUND));

            return BillResponseDto.builder()
                    .idx(bill.getId())
                    .kickboardNumber(report.getKickboardNumber())
                    .date(report.getReportTime().toString())
                    .address(report.getAddress())
                    .violationType(violationType.getName())
                    .demerit(violationType.getScore())
                    .fine(bill.getFine())
                    .totalBill(bill.getTotalBill())
                    .deadLine(bill.getDeadline().toString())
                    .police(police.getName())
                    .isFlag(bill.getPaidStatus().toString())
                    .isObjection(setObjection(bill))
                    .imageSrc(report.getImageSrc())
                    .billTime(bill.getCreatedAt().toString())
                    .build();
        } else {
            Crackdown crackdown = crackdownRepository.findById(bill.getReportId()).orElseThrow(() -> new RestApiException(ErrorCode.NOT_FOUND));

            ViolationType violationType = violationTypeRepository.findById(crackdown.getViolationType().getId()).orElseThrow(() -> new RestApiException(ErrorCode.NOT_FOUND));
            return BillResponseDto.builder()
                    .idx(bill.getId())
                    .kickboardNumber(crackdown.getKickboardNumber())
                    .date(crackdown.getCrackdownTime().toString())
                    .address(crackdown.getCctvInfo().getLocation())
                    .violationType(violationType.getName())
                    .demerit(violationType.getScore())
                    .fine(bill.getFine())
                    .totalBill(bill.getTotalBill())
                    .deadLine(bill.getDeadline().toString())
                    .police(police.getName())
                    .isFlag(bill.getPaidStatus().toString())
                    .isObjection(setObjection(bill))
                    .imageSrc(crackdown.getImageSrc())
                    .billTime(bill.getCreatedAt().toString())
                    .build();
        }
    }

    private int setObjection(Bill bill) {
        if (bill.getIsObjection().equals("N")) {
            return 0;
        }
        return 1;
    }

    // USER 신고를 통한 고지서 생성
    public Bill createBillFromReport(Report report, Police police) {
        // Bill 엔티티 생성
        Bill bill = Bill.builder()
                .reportId(report.getId())
                .police(police)
                .member(report.getMember())
                .fine(report.getViolationType().getFine())
                .totalBill(report.getViolationType().getFine()) // 처음 고지서가 만들어질 때 벌금 금액이 기본값으로 들어감
                .deadline(ZonedDateTime.now().plusDays(10)
                        .withHour(23)
                        .withMinute(59)
                        .withSecond(59)) // 납부 기한을 현재로부터 10일 후 11시 59분 59초로 설정
                .paidStatus(PaidStatus.UNPAID)
                .reportType(ReportType.USER)
                .isObjection("N")
                .build();

        // Bill 엔티티 저장 후 return
        return billRepository.save(bill);
    }

    // CCTV 단속을 통한 고지서 생성
    public void createBillFromCrackdown(Long crackdownId) {
        Crackdown crackdown = crackdownRepository.findById(crackdownId)
                .orElseThrow(() -> new RestApiException(ErrorCode.NOT_FOUND));

        CCTVInfo cctvInfo = crackdown.getCctvInfo();

        Police police = policeRepository.findById(cctvInfo.getPoliceId())
                .orElseThrow(() -> new RestApiException(ErrorCode.NOT_FOUND));

        // Bill 엔티티 생성
        Bill bill = Bill.builder()
                .reportId(crackdown.getId())
                .police(police)
                .member(crackdown.getMember())
                .fine(crackdown.getViolationType().getFine())
                .totalBill(crackdown.getViolationType().getFine()) // 처음 고지서가 만들어질 때 벌금 금액이 기본값으로 들어감
                .deadline(ZonedDateTime.now().plusDays(10)
                        .withHour(23)
                        .withMinute(59)
                        .withSecond(59)) // 납부 기한을 현재로부터 10일 후 11시 59분 59초로 설정
                .paidStatus(PaidStatus.UNPAID)
                .reportType(ReportType.CCTV)
                .isObjection("N")
                .build();

        // 벌점 업데이트
        Member member = crackdown.getMember();
        member.updateDemerit(member.getDemerit() + crackdown.getViolationType().getScore());
        memberRepository.save(member);

        // Bill 엔티티 저장
        billRepository.save(bill);

    }

    public void updatePaidStatus(Long billId, EduRequestDto requestDto) {
        Bill bill = billRepository.findById(billId).orElseThrow(() -> new RestApiException(ErrorCode.NOT_FOUND));
        bill.updatePaidStatus(PaidStatus.PAID);
        billRepository.save(bill);

        // 영상 시청 시 벌점 차감하는 로직
        if (requestDto.getIsEdu() == 1) {
            Member member = memberRepository.findById(bill.getMember().getId()).orElseThrow(() -> new RestApiException(ErrorCode.NOT_FOUND));
            int demerit = member.getDemerit();

            // 벌점이 10 이하면 0으로 초기화
            // 벌점이 10 초과라면 현재 벌점에서 -10 한 값을 넣어주기
            if (demerit <= 10) {
                member.updateDemerit(0);
            } else {
                member.updateDemerit(demerit - 10);
            }
            memberRepository.save(member);
        }
    }

    public void createObjectionFromBill(Member member, Long billId, BillObjectionDto billObjectionDto) {
        Bill bill = billRepository.findById(billId).orElseThrow(() -> new RestApiException(ErrorCode.NOT_FOUND));

        if (bill.getObjection()!=null)
            throw new RestApiException(ErrorCode.METHOD_NOT_ALLOWED);

        objectionRepository.save(Objection.builder()
                        .policeIdx(bill.getPolice().getId())
                        .title(billObjectionDto.getTitle())
                        .content(billObjectionDto.getContent())
                        .member(member)
                        .bill(bill)
                .build());

        bill.updateIsObjection();
        billRepository.save(bill);
    }
}
