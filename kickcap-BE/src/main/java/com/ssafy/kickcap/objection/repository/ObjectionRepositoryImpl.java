package com.ssafy.kickcap.objection.repository;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.DateTemplate;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.kickcap.bill.entity.ReportType;
import com.ssafy.kickcap.objection.dto.ObjectionDetailResponse;
import com.ssafy.kickcap.objection.dto.ObjectionListResponse;
import com.ssafy.kickcap.objection.entity.QAnswer;
import com.ssafy.kickcap.objection.entity.QObjection;
import com.ssafy.kickcap.user.entity.QMember;
import jakarta.persistence.EntityManager;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import com.ssafy.kickcap.objection.dto.QObjectionListResponse;
import com.ssafy.kickcap.objection.dto.QObjectionDetailResponse;

import java.util.List;

import static com.querydsl.core.types.dsl.Expressions.dateTemplate;
import static com.ssafy.kickcap.bill.entity.QBill.bill;
import static com.ssafy.kickcap.cctv.entity.QCrackdown.crackdown;
import static com.ssafy.kickcap.objection.entity.QAnswer.answer;
import static com.ssafy.kickcap.objection.entity.QObjection.objection;
import static com.ssafy.kickcap.report.entity.QReport.report;
import static com.ssafy.kickcap.user.entity.QMember.member;

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

    public ObjectionDetailResponse findObjectionDetail(Long objectionId) {
        // Postgres TO_CHAR 사용하여 날짜 형식을 'yyyy.MM.dd'로 변환
        DateTemplate<String> formattedObjectionDate = dateTemplate(String.class, "TO_CHAR({0}, 'YYYY.MM.DD')", objection.createdAt);
        DateTemplate<String> formattedAnswerDate = dateTemplate(String.class, "TO_CHAR({0}, 'YYYY.MM.DD')", answer.createdAt);

        // 이의제기 상세 조회 로직
        return queryFactory
                .select(new QObjectionDetailResponse(
                        objection.id,
                        bill.reportId.as("crackDownIdx"), // crackDownIdx는 bill의 reportId
                        member.name,
                        // reportType이 CCTV인 경우 crackdown.violationType.id, USER인 경우 report.violationType.id
                        bill.reportType
                                .when(ReportType.CCTV).then(crackdown.violationType.id)
                                .otherwise(report.violationType.id).intValue(),
                        formattedObjectionDate, // 접수 날짜
                        objection.title,
                        objection.content,
                        answer.content,
                        formattedAnswerDate // 답변 날짜
                ))
                .from(objection)
                .leftJoin(objection.answer, answer)
                .leftJoin(objection.bill, bill)
                .leftJoin(objection.member, member)
                .leftJoin(crackdown).on(bill.reportType.eq(ReportType.CCTV))
                .leftJoin(report).on(bill.reportType.eq(ReportType.USER))
                .where(objection.id.eq(objectionId))
                .fetchOne();
    }
}
