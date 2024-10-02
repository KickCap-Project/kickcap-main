package com.ssafy.kickcap.notification.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@AllArgsConstructor
@Builder
@Getter
public class NotificationListResponseDto {

    private Long idx;

    private String type;

    private String value;

    private String content;

    private String isRead;

    private String date;
}
