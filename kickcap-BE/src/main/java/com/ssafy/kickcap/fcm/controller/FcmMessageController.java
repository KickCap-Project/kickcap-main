package com.ssafy.kickcap.fcm.controller;

import com.ssafy.kickcap.fcm.service.FirebaseMessageService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/fcms")
public class FcmMessageController {
    private final FirebaseMessageService firebaseMessageService;

    @PostMapping("/send")
    public ResponseEntity<Void> sendMessage(@RequestParam Long memberId) {
//        firebaseMessageService.sendMessage(memberId);
        return ResponseEntity.ok().build();
    }
}
