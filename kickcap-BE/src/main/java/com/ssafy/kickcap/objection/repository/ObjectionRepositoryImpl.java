package com.ssafy.kickcap.objection.repository;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.DateTemplate;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.kickcap.objection.dto.ObjectionListResponse;
import com.ssafy.kickcap.objection.entity.QAnswer;
import com.ssafy.kickcap.objection.entity.QObjection;
import com.ssafy.kickcap.user.entity.QMember;
import jakarta.persistence.EntityManager;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import com.ssafy.kickcap.objection.dto.QObjectionListResponse;

import java.util.List;

import static com.querydsl.core.types.dsl.Expressions.dateTemplate;

@Repository
public class ObjectionRepositoryImpl {
    private final JPAQueryFactory queryFactory;

    public ObjectionRepositoryImpl(EntityManager em) {
        this.queryFactory = new JPAQueryFactory(em);
    }

    public List<ObjectionListResponse> findObjections(Long policeId, int status, String name, Pageable pageable) {
        QObjection objection = QObjection.objection;
        QAnswer answer = QAnswer.answer;
        QMember member = QMember.member;

        BooleanExpression condition = objection.policeIdx.eq(policeId);

        if (status == 0) {
            condition = condition.and(objection.answer.isNull());
        } else if (status == 1) {
            condition = condition.and(objection.answer.isNotNull());
        }

        if (name != null && !name.isEmpty()) {
            condition = condition.and(objection.member.name.eq(name));
        }

        // Postgres TO_CHAR 사용하여 날짜 형식을 'yyyy.MM.dd'로 변환
        DateTemplate<String> formattedDate = dateTemplate(String.class, "TO_CHAR({0}, 'YYYY.MM.DD')", objection.createdAt);

        return queryFactory
                .select(new QObjectionListResponse(
                        objection.id,
                        formattedDate,  // 'yyyy.MM.dd' 형식으로 변환된 날짜
                        objection.title,
                        objection.member.name
                ))
                .from(objection)
                .leftJoin(objection.answer, answer)
                .leftJoin(objection.member, member)
                .where(condition)
                .orderBy(objection.id.desc())  // id를 기준으로 내림차순 정렬 (최신 순)
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();
    }
}
