package com.ssafy.kickcap.user.controller;

import com.ssafy.kickcap.user.dto.CreateAccessTokenRequest;
import com.ssafy.kickcap.user.dto.CreateAccessTokenResponse;
import com.ssafy.kickcap.user.service.TokenService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "Token API", description = "토큰 관련 API")
public class TokenApiController {
    private final TokenService tokenService;

    @PostMapping("/token/refresh")
    @Operation(summary = "액세스 토큰 재발급", description = "토큰 서비스에서 리프레시 토큰을 기반으로 새로운 액세스 토큰을 만들어줍니다.")
    public ResponseEntity<CreateAccessTokenResponse> refreshAccessToken(@RequestBody CreateAccessTokenRequest request) {
        // 토큰 서비스에서 리프레시 토큰을 기반으로 새로운 액세스 토큰 만들어주게하기
        String newAccessToken = tokenService.createNewAccessToken(request.getRefreshToken());
        return ResponseEntity.ok(new CreateAccessTokenResponse(newAccessToken));
    }
}
