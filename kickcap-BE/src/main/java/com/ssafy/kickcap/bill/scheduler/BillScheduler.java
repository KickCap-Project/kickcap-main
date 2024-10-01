package com.ssafy.kickcap.bill.scheduler;

import com.ssafy.kickcap.bill.entity.Bill;
import com.ssafy.kickcap.bill.entity.PaidStatus;
import com.ssafy.kickcap.bill.repository.BillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class BillScheduler {

    private final BillRepository billRepository;

    // 매일 자정에 실행되는 스케줄러 설정 (매일 00:00:00 실행)
//    @Scheduled(cron = "0 0 0 * * *")
//    @Transactional
//    public void updateUnpaidBill() {
//        // 오늘 자정 0시 0분 0초 시간하고 비교하기 위해 now 설정
//        ZonedDateTime now = ZonedDateTime.now(ZoneId.of("Asia/Seoul"))
//                .withHour(0).withMinute(0).withSecond(0).withNano(0);
//
//        // 테스트를 위한 특정 시간
//        //ZonedDateTime testNow = ZonedDateTime.parse("2024-10-10T04:07:59.848344+00:00");
//
//        // 납부 기한이 지나고 미납 상태인 고지서들 조회
//        List<Bill> uppaidBillList = billRepository.findByDeadlineBeforeAndPaidStatus(now, PaidStatus.UNPAID);
//
//        for (Bill bill : uppaidBillList) {
//            double increasedFine = bill.getTotalBill() * 0.20; // 20% 가산된 금액
//            // 총 금액을 int로 변환 (소수점 버림, 또는 반올림 선택 가능)
//            int updatedTotalBill = (int) (bill.getTotalBill() + increasedFine);  // 소수점 버림
//            Bill updateBill = Bill.builder()
//                    .id(bill.getId())
//                    .reportId(bill.getReportId())
//                    .fine(bill.getFine())
//                    .totalBill(updatedTotalBill)
//                    .deadline(ZonedDateTime.now(ZoneId.of("Asia/Seoul"))
//                            .plusDays(20)
//                            .withHour(23)
//                            .withMinute(59)
//                            .withSecond(59))  // 20일 후 23:59:59로 설정
//                    .paidStatus(PaidStatus.UNPAID)
//                    .reportType(bill.getReportType())
//                    .isObjection(bill.getIsObjection())
//                    .createdAt(bill.getCreatedAt()) // 생성시간은 그대로 두겠습니다.
//                    .build();
//
//            billRepository.save(updateBill);
//        }
//    }
}
