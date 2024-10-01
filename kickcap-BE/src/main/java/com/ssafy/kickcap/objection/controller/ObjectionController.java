package com.ssafy.kickcap.objection.controller;

import com.ssafy.kickcap.bill.dto.BillObjectionDto;
import com.ssafy.kickcap.config.oauth.CustomOAuth2User;
import com.ssafy.kickcap.exception.ErrorCode;
import com.ssafy.kickcap.objection.dto.ObjectionAnswerDto;
import com.ssafy.kickcap.objection.dto.ObjectionDetailResponse;
import com.ssafy.kickcap.objection.dto.ObjectionListResponse;
import com.ssafy.kickcap.objection.dto.ObjectionUserListDto;
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
    public ResponseEntity<List<ObjectionListResponse>> getPoliceObjections(@AuthenticationPrincipal User user, @RequestParam int status,
                                                                     @RequestParam int pageNo, @RequestParam(required = false) String name){
        Police police = policeService.findByPoliceId(user.getUsername());
        List<ObjectionListResponse> objections = objectionService.getObjections(police.getId(), status, pageNo, 10, name);
        return ResponseEntity.ok(objections);
    }

    @GetMapping("/user")
    @Operation(summary = "이의제기 목록 조회 (일반시민용)")
    public ResponseEntity<List<ObjectionUserListDto>> getUserObjections(@AuthenticationPrincipal CustomOAuth2User user,
                                                                        @RequestParam int status, @RequestParam int pageNo) {
        List<ObjectionUserListDto> objections = objectionService.getUserObjections(user.getId(), status, pageNo, 10);
        return ResponseEntity.ok(objections);
    }

    @GetMapping("/{objectionId}")
    @Operation(summary = "이의제기 경찰 상세 정보 조회")
    public ResponseEntity<ObjectionDetailResponse> getObjectionDetail(@AuthenticationPrincipal User user, @PathVariable Long objectionId) {
        Police police = policeService.findByPoliceId(user.getUsername());
        if (police == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }
        ObjectionDetailResponse objectionDetail = objectionService.getObjectionDetail(objectionId);
        if (objectionDetail == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }
        return ResponseEntity.ok(objectionDetail);
    }

    @GetMapping("/user/{objectionId}")
    @Operation(summary = "이의제기 일반 시민 상세 정보 조회")
    public ResponseEntity<ObjectionDetailResponse> getObjectionUserDetail(@AuthenticationPrincipal CustomOAuth2User user, @PathVariable Long objectionId) {
        ObjectionDetailResponse objectionDetail = objectionService.getObjectionUserDetail(user.getId(), objectionId);

        // 만약 조회된 이의제기 정보가 없거나 사용자가 작성자가 아닌 경우
        if (objectionDetail == null) {
            // 403 Forbidden 반환
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }

        return ResponseEntity.ok(objectionDetail);
    }

    @PostMapping("/{objectionId}/answer")
    @Operation(summary = "이의제기 답변 기능")
    public ResponseEntity<Void> answerForObjection(@AuthenticationPrincipal User user, @RequestBody ObjectionAnswerDto objectionAnswerDto, @PathVariable Long objectionId){
        Police police = policeService.findByPoliceId(user.getUsername());
        if (police == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }
        objectionService.answerForObjection(police, objectionAnswerDto.getContent(), objectionId);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
