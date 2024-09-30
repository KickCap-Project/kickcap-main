package com.ssafy.kickcap.objection.service;

import com.ssafy.kickcap.bill.dto.BillObjectionDto;
import com.ssafy.kickcap.objection.entity.Answer;
import com.ssafy.kickcap.objection.entity.Objection;
import com.ssafy.kickcap.objection.repository.AnswerRepository;
import com.ssafy.kickcap.objection.repository.ObjectionRepository;
import com.ssafy.kickcap.user.entity.Member;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Objects;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class ObjectionService {

    private final ObjectionRepository objectionRepository;
    private final AnswerRepository answerRepository;

    public void modifyObjectionByObjectionId(Member member, Long objectionId, BillObjectionDto objectionDto) {
        // Objection 조회
        Objection objection = objectionRepository.findById(objectionId)
                .orElseThrow(() -> new IllegalArgumentException("Cannot find objection"));

        // Objection 작성자가 요청한 Member와 동일한지 확인
        if (!member.equals(objection.getMember())) {
            throw new IllegalArgumentException("Cannot modify objection");
        }

        // 해당 Objection에 대한 Answer가 존재하는지 확인
        if (objection.getAnswer() != null) {
            throw new IllegalArgumentException("Cannot modify objection that has an answer");
        }

        // Objection 수정 로직 구현 (수정하려는 내용에 따라 추가)
         objection.updateObjection(objectionDto.getTitle(), objectionDto.getContent());
        // Objection 저장
        objectionRepository.save(objection);
    }

    public void deleteObjectionByObjectionId(Member member, Long objectionId) {
        // Objection 조회
        Objection objection = objectionRepository.findById(objectionId)
                .orElseThrow(() -> new IllegalArgumentException("Cannot find objection"));

        // Objection 작성자가 요청한 Member와 동일한지 확인
        if (!member.equals(objection.getMember())) {
            throw new IllegalArgumentException("Cannot modify objection");
        }

        // 해당 Objection에 대한 Answer가 존재하는지 확인
        if (objection.getAnswer() != null) {
            throw new IllegalArgumentException("Cannot modify objection that has an answer");
        }

        objectionRepository.delete(objection);
    }
}
