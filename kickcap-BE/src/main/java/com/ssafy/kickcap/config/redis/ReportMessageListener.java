package com.ssafy.kickcap.config.redis;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ReportMessageListener {

    public void onMessage(String message) {
        // 해당 키에 대한 DB 작업 처리
        System.out.println("onMessage 시작");
        handleDatabaseOperations(message);
    }

    private void handleDatabaseOperations(String key) {
        // Redis에서 해당 키를 사용하여 DB 작업 수행
        System.out.println("handleDatabaseOperations 시작");
    }
}
