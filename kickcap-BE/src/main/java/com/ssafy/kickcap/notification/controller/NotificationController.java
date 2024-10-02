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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
