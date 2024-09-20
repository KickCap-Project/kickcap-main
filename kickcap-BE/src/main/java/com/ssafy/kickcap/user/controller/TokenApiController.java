package com.ssafy.kickcap.user.controller;

import com.ssafy.kickcap.user.dto.CreateAccessTokenRequest;
import com.ssafy.kickcap.user.dto.CreateAccessTokenResponse;
import com.ssafy.kickcap.user.service.TokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/kickcap")
public class TokenApiController {
    // 토큰 서비스에서 리프레시 토큰을 기반으로 새로운 액세스 토큰 만들어주게하기
    private final TokenService tokenService;

    @PostMapping("/token/refresh")
    public ResponseEntity<CreateAccessTokenResponse> refreshAccessToken(@RequestBody CreateAccessTokenRequest request) {
        String newAccessToken = tokenService.createNewAccessToken(request.getRefreshToken());
        return ResponseEntity.ok(new CreateAccessTokenResponse(newAccessToken));
    }
}
