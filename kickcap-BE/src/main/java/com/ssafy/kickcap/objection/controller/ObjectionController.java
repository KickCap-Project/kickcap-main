package com.ssafy.kickcap.objection.controller;

import com.ssafy.kickcap.bill.dto.BillObjectionDto;
import com.ssafy.kickcap.config.oauth.CustomOAuth2User;
import com.ssafy.kickcap.objection.service.ObjectionService;
import com.ssafy.kickcap.user.entity.Member;
import com.ssafy.kickcap.user.service.MemberService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/objections")
@Tag(name = "Objection API", description = "이의제기 관련 API")
public class ObjectionController {

    private final MemberService memberService;
    private final ObjectionService objectionService;

    @PostMapping("/{objectionId}")
    @Operation(summary = "이의제기 수정 기능")
    public ResponseEntity<Void> modifyObjection(@AuthenticationPrincipal CustomOAuth2User principal, @PathVariable Long objectionId, @RequestBody BillObjectionDto billObjectionDto) {
        Member member = memberService.findById(principal.getId());
        objectionService.modifyObjectionByObjectionId(member, objectionId, billObjectionDto);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @DeleteMapping("/{objectionId}")
    @Operation(summary = "이의제기 삭제 기능")
    public ResponseEntity<Void> deleteObjection(@AuthenticationPrincipal CustomOAuth2User principal, @PathVariable Long objectionId) {
        Member member = memberService.findById(principal.getId());
        objectionService.deleteObjectionByObjectionId(member, objectionId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
