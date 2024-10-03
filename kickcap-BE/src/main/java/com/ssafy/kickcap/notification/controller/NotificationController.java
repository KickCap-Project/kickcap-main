package com.ssafy.kickcap.notification.controller;

import com.ssafy.kickcap.config.oauth.CustomOAuth2User;
import com.ssafy.kickcap.notification.dto.NotificationListResponseDto;
import com.ssafy.kickcap.notification.service.NotificationService;
import com.ssafy.kickcap.report.dto.ReportListResponseDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Slf4j
@RequiredArgsConstructor
@Tag(name = "알림 컨트롤러", description = "알림 관련 API")
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping()
    @Operation(summary = "알림 목록 조회")
    public ResponseEntity<List<NotificationListResponseDto>> getNotifications(@AuthenticationPrincipal CustomOAuth2User principal) {
        List<NotificationListResponseDto> notifications = notificationService.getNotifications(principal.getId());
        return ResponseEntity.ok(notifications);
    }

    @PostMapping("/read")
    @Operation(summary = "알림 읽음 처리")
    public ResponseEntity<Void> updateIsRead(@AuthenticationPrincipal CustomOAuth2User principal, @RequestParam Long nid) {
        notificationService.updateIsRead(principal.getId(), nid);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/check")
    @Operation(summary = "메인 페이지에서 새로운 알림 확인")
    public ResponseEntity<Boolean> checkNotRead(@AuthenticationPrincipal CustomOAuth2User principal) {
        boolean notRead = notificationService.isNotRead(principal.getId());
        return ResponseEntity.ok(notRead);
    }
}
