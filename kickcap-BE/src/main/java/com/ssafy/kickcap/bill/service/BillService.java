package com.ssafy.kickcap.bill.service;

import com.ssafy.kickcap.bill.dto.BillListResponseDto;
import com.ssafy.kickcap.bill.dto.BillResponseDto;
import com.ssafy.kickcap.bill.entity.Bill;
import com.ssafy.kickcap.bill.entity.PaidStatus;
import com.ssafy.kickcap.bill.entity.ReportType;
import com.ssafy.kickcap.bill.repository.BillRepository;
import com.ssafy.kickcap.cctv.entity.CCTVInfo;
import com.ssafy.kickcap.cctv.entity.Crackdown;
import com.ssafy.kickcap.cctv.repository.CrackdownRepository;
import com.ssafy.kickcap.exception.ErrorCode;
import com.ssafy.kickcap.exception.RestApiException;
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

    public List<BillListResponseDto> getBillList(Long memberId, int pageNo) {
        // 페이지 요청 객체 생성 (첫 페이지는 0부터 시작)
        Pageable pageable = PageRequest.of(pageNo -1, DEFAULT_PAGE_SIZE);

        Member member = memberRepository.findById(memberId).orElseThrow(() -> new RestApiException(ErrorCode.NOT_FOUND));

//        Page<Bill> billPage = billRepository.findByMemberOrderByDeadlineDesc(member, pageable);
        Page<Bill> billPage = billRepository.findByMemberAndPaidStatusNotOrderByDeadlineDesc(member, PaidStatus.CANCEL, pageable);

        // Bill -> BillListResponseDto 변환
        return billPage.stream()
                .map(bill -> {
                    // Report 조회
                    Report report = reportRepository.findById(bill.getReportId())
                            .orElseThrow(() -> new RestApiException(ErrorCode.NOT_FOUND));

                    // ViolationType 이름 가져오기
                    String violationTypeName = report.getViolationType().getName();

                    // Bill -> BillListResponseDto 변환
                    return BillListResponseDto.builder()
                            .idx(bill.getId())
                            .date(bill.getCreatedAt().toString())
                            .violationType(violationTypeName) // ViolationType 이름 설정
                            .deadLine(bill.getDeadline().toString()) // 마감일
                            .isFlag(setFlag(bill)) // 상태 플래그 설정
                            .build();
                })
                .toList();
    }

    private int setFlag(Bill bill) {
        if (bill.getPaidStatus() == PaidStatus.PAID) {
            return 1; // 납부
        } else if(bill.getIsObjection().equals("Y") && bill.getPaidStatus() == PaidStatus.UNPAID){
            return 2; // 이의중
        }
        else if (bill.getDeadline().isBefore(ZonedDateTime.now().plusDays(2))) {
            return 3; // 마감 2일전
        } else if (bill.getIsObjection().equals("N") && bill.getPaidStatus() == PaidStatus.UNPAID){
            return 0; // 미납
        }
        return 0; // 기본적으로 미납 상태 처리
    }

    public BillResponseDto getBill(Long memberId, Long billId) {

        Member member = memberRepository.findById(memberId).orElseThrow(() -> new RestApiException(ErrorCode.NOT_FOUND));

        Bill bill = billRepository.findById(billId).orElseThrow(() -> new RestApiException(ErrorCode.NOT_FOUND));

        Police police = policeRepository.findById(bill.getPolice().getId()).orElseThrow(() -> new RestApiException(ErrorCode.NOT_FOUND));

        Report report = reportRepository.findById(bill.getReportId()).orElseThrow(() -> new RestApiException(ErrorCode.NOT_FOUND));

        ViolationType violationType = violationTypeRepository.findById(report.getViolationType().getId()).orElseThrow(() -> new RestApiException(ErrorCode.NOT_FOUND));

        return BillResponseDto.builder()
                .idx(bill.getId())
                .kickboardNumber(report.getKickboardNumber())
                .date(report.getReportTime().toString())
                .address(report.getAddress())
                .violationType(violationType.getName())
                .demerit(member.getDemerit())
                .fine(bill.getFine())
                .totalBill(bill.getTotalBill())
                .deadLine(bill.getDeadline().toString())
                .police(police.getName())
                .isFlag(bill.getPaidStatus().toString())
                .isObjection(setObjection(bill))
                .imageSrc(report.getImageSrc())
                .build();
    }

    private int setObjection(Bill bill) {
        if (bill.getIsObjection().equals("N")) {
            return 0;
        }
        return 1;
    }

    // USER 신고를 통한 고지서 생성
    public void createBillFromReport(Report report, Police police) {
        // Bill 엔티티 생성
        Bill bill = Bill.builder()
                .reportId(report.getId())
                .police(police)
                .member(report.getMember())
                .fine(report.getViolationType().getFine())
                .totalBill(report.getViolationType().getFine()) // 처음 고지서가 만들어질 때 벌금 금액이 기본값으로 들어감
                .deadline(ZonedDateTime.now().plusDays(10)) // 납부 기한을 현재로부터 10일 후로 설정
                .paidStatus(PaidStatus.UNPAID)
                .reportType(ReportType.USER)
                .isObjection("N")
                .build();

        // Bill 엔티티 저장
        billRepository.save(bill);
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
                .deadline(ZonedDateTime.now().plusDays(10)) // 납부 기한을 현재로부터 10일 후로 설정
                .paidStatus(PaidStatus.UNPAID)
                .reportType(ReportType.CCTV)
                .isObjection("N")
                .build();

        // Bill 엔티티 저장
        billRepository.save(bill);

    }
}
