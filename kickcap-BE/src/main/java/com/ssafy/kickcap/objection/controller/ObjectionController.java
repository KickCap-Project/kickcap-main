package com.ssafy.kickcap.objection.controller;

import com.ssafy.kickcap.bill.dto.BillObjectionDto;
import com.ssafy.kickcap.config.oauth.CustomOAuth2User;
import com.ssafy.kickcap.objection.dto.ObjectionListResponse;
import com.ssafy.kickcap.objection.service.ObjectionService;
import com.ssafy.kickcap.user.entity.Member;
import com.ssafy.kickcap.user.entity.Police;
import com.ssafy.kickcap.user.service.MemberService;
import com.ssafy.kickcap.user.service.PoliceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/objections")
@Tag(name = "Objection API", description = "이의제기 관련 API")
public class ObjectionController {

    private final MemberService memberService;
    private final ObjectionService objectionService;
    private final PoliceService policeService;

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

    @GetMapping("/police")
    @Operation(summary = "이의제기 목록 조회 (경찰용)")
    public ResponseEntity<List<ObjectionListResponse>> getObjections(@AuthenticationPrincipal User user, @RequestParam int status,
                                                                     @RequestParam int pageNo, @RequestParam int pageSize, @RequestParam(required = false) String name){
        System.out.println("여기!!!!!!!!!!!!!!!1"+user.getUsername());
        Police police = policeService.findByPoliceId(user.getUsername());
        List<ObjectionListResponse> objections = objectionService.getObjections(police.getId(), status, pageNo, pageSize, name);
        return ResponseEntity.ok(objections);
    }

}
