package com.ssafy.kickcap.bill.scheduler;

import com.ssafy.kickcap.bill.entity.Bill;
import com.ssafy.kickcap.bill.repository.BillRepository;
import com.ssafy.kickcap.fcm.service.FirebaseMessageService;
import com.ssafy.kickcap.notification.entity.NotificationType;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DueDateAlertScheduler {

    private final BillRepository billRepository;
    private final FirebaseMessageService messageService;

    // 매일 오전 9시마다 돌아가는 스케줄러.
    @Scheduled(cron = "0 0 9 * * ?")
    @Transactional
    public void alertDueDate() {

        // 현재 날짜에서 2일 후의 날짜 계산
        String formattedDate = ZonedDateTime.now().plusDays(2)
                .format(DateTimeFormatter.ofPattern("yyyyMMdd"));

        // 2일 후의 만기일을 조회하는 쿼리를 실행
        List<Bill> billsDueInTwoDays = billRepository.findUnpaidBillsDueInTwoDays(formattedDate);

        // 알림 처리 로직 추가
        for (Bill bill : billsDueInTwoDays) {
            messageService.sendMessage(bill.getMember().getId(), NotificationType.DEADLINE, bill.getId());
        }
    }
}
