package com.ssafy.kickcap.cctv.controller;

import com.ssafy.kickcap.cctv.dto.CrackdownListResponseDto;
import com.ssafy.kickcap.cctv.service.CrackdownService;
import com.ssafy.kickcap.user.entity.Police;
import com.ssafy.kickcap.user.service.PoliceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "cctv 단속 컨트롤러", description = "cctv 단속 관련 API")
@RequestMapping("/crackdowns")
public class CrackdownController {

    private final CrackdownService crackdownService;
    private final PoliceService policeService;

    @GetMapping()
    @Operation(summary = "cctv 단속 목록 조회", description = "관할 경찰서 cctv 단속 목록을 조회합니다. type = 0(안전모), 1(다인) ")
    public ResponseEntity<List<CrackdownListResponseDto>> getCrackdownList(@AuthenticationPrincipal User user, @RequestParam int pageNo, @RequestParam int type) {
        Police police = policeService.findByPoliceId(user.getUsername());

        List<CrackdownListResponseDto> crackdownList = crackdownService.getCrackdownList(police, pageNo, type);
        return ResponseEntity.ok(crackdownList);
    }

}
