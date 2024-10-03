package com.ssafy.kickcap.fcm.service;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import com.ssafy.kickcap.exception.ErrorCode;
import com.ssafy.kickcap.exception.RestApiException;
import com.ssafy.kickcap.fcm.dto.NotificationRequestDto;
import com.ssafy.kickcap.notification.entity.NotificationType;
import com.ssafy.kickcap.notification.repository.NotificationRepository;
import com.ssafy.kickcap.user.entity.DeviceInfo;
import com.ssafy.kickcap.user.entity.Member;
import com.ssafy.kickcap.user.repository.DeviceInfoRepository;
import com.ssafy.kickcap.user.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FirebaseMessageService {

    private final DeviceInfoRepository deviceInfoRepository;
    private final MemberRepository memberRepository;
    private final NotificationRepository notificationRepository;

    public void sendMessage(Long memberId, NotificationType type, Long billId) {
        // 알림 제목, 내용, URL 템플릿 가져오기
        NotificationRequestDto notificationRequestDto = getTemplate(type);

        // device_info 조회
        List<DeviceInfo> deviceInfoList = deviceInfoRepository.findByMember(memberId);

        if(!deviceInfoList.isEmpty()) {
            for (DeviceInfo deviceInfo : deviceInfoList) {
                // member  찾기
                Member member = memberRepository.findById(memberId).orElseThrow(() -> new RestApiException(ErrorCode.NOT_FOUND));

                // Notification 객체를 Builder를 사용하여 생성
                Notification notification = Notification.builder()
                        .setTitle(notificationRequestDto.getTitle()) // 알림 제목
                        .setBody(notificationRequestDto.getBody()) // 알림 내용
                        .build();

                Message message = Message.builder()
                        .setNotification(notification) // notification 필드 설정
                        .putData("url", notificationRequestDto.getUrl()) // data 필드 설정
                        .setToken(deviceInfo.getFcmToken()) // 조회한 토큰 값을 사용
                        .build();
                try {
                    // 메시지 전송
                    String response = FirebaseMessaging.getInstance().send(message);
                    System.out.println("Message sent successfully");

                    // 알림 저장
                    saveNotification(member, notificationRequestDto.getBody(), billId, type);

                } catch (FirebaseMessagingException e) {
                    e.printStackTrace();
                    System.out.println("Failed to send message");
                }
            }
        }
    }

    // 알림 내용 템플릿 설정
    private NotificationRequestDto getTemplate(NotificationType type) {
        String url = "/main/notification";
        switch (type) {
            case BILL:
                return new NotificationRequestDto("단속 안내", "단속 고지서가 도착했습니다.", url);
            case DEADLINE:
                return new NotificationRequestDto("납부기한 안내", "범칙금 납부 기한이 임박한 단속 내역이 있습니다.", url);
            case REPLY:
                return new NotificationRequestDto("문의 답변 안내", "이의제기 답변이 작성되었습니다.", url);
            case APPROVE:
                return new NotificationRequestDto("신고 처리", "신고하신 사항이 단속 처리되었습니다.", url);
            case REJECT:
                return new NotificationRequestDto("신고 반려", "신고하신 사항이 반려되었습니다.", url);
            default:
                throw new RestApiException(ErrorCode.NOT_FOUND);
        }
    }

    // Notification 테이블에 데이터 저장
    private void saveNotification(Member member, String content, Long billId, NotificationType type) {
        com.ssafy.kickcap.notification.entity.Notification notification = com.ssafy.kickcap.notification.entity.Notification.builder()
                .member(member)
                .billId(billId)
                .content(content)
                .isRead("N")
                .type(type)
                .build();
        notificationRepository.save(notification);
    }
}
