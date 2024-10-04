package com.ssafy.kickcap.objection.repository;

import com.ssafy.kickcap.objection.entity.Answer;
import com.ssafy.kickcap.objection.entity.Objection;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface AnswerRepository extends CrudRepository<Answer, Long> {
    Answer findByObjection(Objection objection);
}
