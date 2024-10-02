package com.ssafy.kickcap.notification.service;

import com.ssafy.kickcap.bill.entity.Bill;
import com.ssafy.kickcap.bill.repository.BillRepository;
import com.ssafy.kickcap.exception.ErrorCode;
import com.ssafy.kickcap.exception.RestApiException;
import com.ssafy.kickcap.notification.dto.NotificationListResponseDto;
import com.ssafy.kickcap.notification.entity.Notification;
import com.ssafy.kickcap.notification.entity.NotificationType;
import com.ssafy.kickcap.notification.repository.NotificationRepository;
import com.ssafy.kickcap.objection.entity.Objection;
import com.ssafy.kickcap.objection.repository.ObjectionRepository;
import com.ssafy.kickcap.user.entity.Member;
import com.ssafy.kickcap.user.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final BillRepository billRepository;
    private final ObjectionRepository objectionRepository;
    private final MemberRepository memberRepository;

    public List<NotificationListResponseDto> getNotifications(Long memberId) {

        Member member = memberRepository.findById(memberId).orElseThrow(() -> new RestApiException(ErrorCode.FORBIDDEN_ACCESS));

        ZonedDateTime sevenDaysAgo = ZonedDateTime.now().minusDays(7);
        List<Notification> notifications = notificationRepository.findNotificationsExcludingOldRead(member, sevenDaysAgo);

        return notifications.stream()
                .map(notification -> {
                    String value = "";
                    // REPLY 타입일 때 추가 로직
                    if (notification.getType() == NotificationType.REPLY) {
                        Bill bill = billRepository.findById(notification.getBillId()).orElseThrow(() -> new RestApiException(ErrorCode.NOT_FOUND));
                        Objection objection = objectionRepository.findByBill(bill).orElseThrow(() -> new RestApiException(ErrorCode.NOT_FOUND));

                        value = objection.getId().toString();
                    } else if (notification.getType() == NotificationType.BILL || notification.getType() == NotificationType.DEADLINE) {
                        Bill bill = billRepository.findById(notification.getBillId()).orElseThrow(() -> new RestApiException(ErrorCode.NOT_FOUND));
                        value = bill.getId().toString();
                    }

                    // NotificationListResponseDto 빌더 생성
                    NotificationListResponseDto.NotificationListResponseDtoBuilder builder = NotificationListResponseDto.builder()
                            .idx(notification.getId())
                            .type(notification.getType().toString())
                            .value(value) // 설정한 value 사용
                            .content(notification.getContent())
                            .isRead(notification.getIsRead())
                            .date(notification.getCreatedAt().toString()); // 필요 시 날짜 포맷 변경 가능

                    return builder.build();
                })
                .collect(Collectors.toList());
    }
}
