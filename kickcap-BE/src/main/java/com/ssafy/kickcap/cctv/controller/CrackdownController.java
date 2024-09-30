package com.ssafy.kickcap.cctv.controller;

import com.ssafy.kickcap.cctv.dto.CrackdownListResponseDto;
import com.ssafy.kickcap.cctv.dto.CrackdownResponseDto;
import com.ssafy.kickcap.cctv.service.CrackdownService;
import com.ssafy.kickcap.user.entity.Police;
import com.ssafy.kickcap.user.service.PoliceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "cctv 단속 컨트롤러", description = "cctv 단속 관련 API")
@RequestMapping("/crackdowns")
public class CrackdownController {

    private final CrackdownService crackdownService;
    private final PoliceService policeService;

    @GetMapping("/count")
    @Operation(summary = "관할 경찰서 cctv 단속 데이터 개수 조회",  description = "관할 경찰서 cctv 단속 데이터 개수를 조회합니다. violationType = 1(다인), 2(안전모)")
    public ResponseEntity<Long> getCrackdownCount(@AuthenticationPrincipal User user, @RequestParam Long violationType) {
        Police police = policeService.findByPoliceId(user.getUsername());
        Long count = crackdownService.getCrackdownCount(police, violationType);
        return ResponseEntity.ok(count);
    }

    @GetMapping()
    @Operation(summary = "cctv 단속 목록 조회", description = "관할 경찰서 cctv 단속 목록을 조회합니다. violationType = 1(다인), 2(안전모)")
    public ResponseEntity<List<CrackdownListResponseDto>> getCrackdownList(@AuthenticationPrincipal User user, @RequestParam int pageNo, @RequestParam Long violationType) {
        Police police = policeService.findByPoliceId(user.getUsername());

        List<CrackdownListResponseDto> crackdownList = crackdownService.getCrackdownList(police, pageNo, violationType);
        return ResponseEntity.ok(crackdownList);
    }

    @GetMapping("/{crackdownId}")
    @Operation(summary = "cctv 단속 상세정보 조회", description = "관할 경찰서 cctv 단속 상세정보를 조회")
    public ResponseEntity<CrackdownResponseDto> getCrackdown(@AuthenticationPrincipal User user, @PathVariable Long crackdownId) {
        Police police = policeService.findByPoliceId(user.getUsername());
        CrackdownResponseDto crackdown = crackdownService.getCrackdown(police, crackdownId);
        return ResponseEntity.ok(crackdown);
    }
}
