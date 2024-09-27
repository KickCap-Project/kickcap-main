package com.ssafy.kickcap.bill.service;

import com.ssafy.kickcap.bill.dto.BillListResponseDto;
import com.ssafy.kickcap.bill.dto.BillResponseDto;
import com.ssafy.kickcap.bill.entity.Bill;
import com.ssafy.kickcap.bill.entity.PaidStatus;
import com.ssafy.kickcap.bill.repository.BillRepository;
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
}
