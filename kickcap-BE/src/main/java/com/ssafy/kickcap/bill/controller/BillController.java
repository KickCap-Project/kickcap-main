package com.ssafy.kickcap.bill.controller;

import com.ssafy.kickcap.bill.dto.BillListResponseDto;
import com.ssafy.kickcap.bill.dto.BillResponseDto;
import com.ssafy.kickcap.bill.service.BillService;
import com.ssafy.kickcap.config.oauth.CustomOAuth2User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "고지서 컨트롤러", description = "고지서 관련 API")
@RequestMapping("/bills")
public class BillController {

    private final BillService billService;

    @GetMapping()
    @Operation(summary = "고지서 목록 조회", description = "isFlag = 0미납(0), 납부(1), 이의 중(2), 마감 2일전(3)")
    public ResponseEntity<List<BillListResponseDto>> getBilList(@AuthenticationPrincipal CustomOAuth2User principal, @RequestParam int pageNo) {
        Long memberId = principal.getId();
        List<BillListResponseDto> billList = billService.getBillList(memberId, pageNo);
        return ResponseEntity.ok(billList);
    }

    @GetMapping("/{billId}")
    @Operation(summary = "고지서 상세 조회")
    public ResponseEntity<BillResponseDto> getBill(@AuthenticationPrincipal CustomOAuth2User principal,  @PathVariable Long billId) {
        Long memberId = principal.getId();
        BillResponseDto bill = billService.getBill(memberId, billId);
        return ResponseEntity.ok(bill);
    }

    @PostMapping("/crackdown/{crackdownId}")
    @Operation(summary = "cctv 단속 정보를 통해 고지서를 생성하는 API")
    public ResponseEntity<Void> createBillFromCrackdown(@PathVariable Long crackdownId) {
        billService.createBillFromCrackdown(crackdownId);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
