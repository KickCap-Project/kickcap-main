package com.ssafy.kickcap.objection.repository;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.DateTemplate;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.kickcap.bill.entity.QBill;
import com.ssafy.kickcap.bill.entity.ReportType;
import com.ssafy.kickcap.cctv.entity.QCrackdown;
import com.ssafy.kickcap.objection.dto.*;
import com.ssafy.kickcap.objection.entity.QAnswer;
import com.ssafy.kickcap.objection.entity.QObjection;
import com.ssafy.kickcap.report.entity.QReport;
import com.ssafy.kickcap.user.entity.QMember;
import jakarta.persistence.EntityManager;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;

import static com.querydsl.core.types.dsl.Expressions.dateTemplate;

@Repository
public class ObjectionRepositoryImpl {
    private final JPAQueryFactory queryFactory;
    private final QObjection objection = QObjection.objection;
    private final QAnswer answer = QAnswer.answer;
    private final QMember member = QMember.member;
    private final QReport report = QReport.report;
    private final QCrackdown crackdown = QCrackdown.crackdown;
    private final QBill bill = QBill.bill;

    public ObjectionRepositoryImpl(EntityManager em) {
        this.queryFactory = new JPAQueryFactory(em);
    }

    public Long findObjectionsCount(Long policeId, int status, String name) {

        BooleanExpression condition = objection.policeIdx.eq(policeId);

        if (status == 0) {
            condition = condition.and(objection.answer.isNull());
        } else if (status == 1) {
            condition = condition.and(objection.answer.isNotNull());
        }

        if (name != null && !name.isEmpty()) {
            condition = condition.and(objection.member.name.eq(name));
        }

        return queryFactory
                .selectDistinct(objection.count())
                .from(objection)
                .leftJoin(objection.answer, answer)
                .leftJoin(objection.member, member)
                .where(condition)
                .fetchOne();
    }

    public List<ObjectionListResponse> findObjections(Long policeId, int status, String name, Pageable pageable) {


        BooleanExpression condition = objection.policeIdx.eq(policeId);

        if (name != null && !name.isEmpty()) {
            condition = condition.and(objection.member.name.eq(name));
        }

        // Postgres TO_CHAR 사용하여 날짜 형식을 'yyyy.MM.dd'로 변환
        DateTemplate<String> formattedDate = dateTemplate(String.class, "TO_CHAR({0}, 'YYYY.MM.DD')", objection.createdAt);

        if (status == 0) {
            condition = condition.and(objection.answer.isNull());
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
        } else if (status == 1) {
            condition = condition.and(objection.answer.isNotNull());
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
                    .orderBy(answer.createdAt.desc())  // id를 기준으로 내림차순 정렬 (최신 순)
                    .offset(pageable.getOffset())
                    .limit(pageable.getPageSize())
                    .fetch();
        }
        return null;
    }

    public ObjectionDetailResponse findObjectionDetail(Long objectionId, Long violationType) {
        // Postgres TO_CHAR 사용하여 날짜 형식을 'yyyy.MM.dd'로 변환
        DateTemplate<String> formattedObjectionDate = dateTemplate(String.class, "TO_CHAR({0}, 'YYYY.MM.DD')", objection.createdAt);
        DateTemplate<String> formattedAnswerDate = dateTemplate(String.class, "TO_CHAR({0}, 'YYYY.MM.DD')", answer.createdAt);

        return queryFactory
                .select(new QObjectionDetailResponse(
                        objection.id,
                        null,
                        member.name,
                        // reportType에 관계없이 violation_type을 NULL로 반환
                        Expressions.asNumber(violationType),
                        formattedObjectionDate,
                        objection.title,
                        objection.content,
                        answer.content,
                        formattedAnswerDate,
                        bill.id
                ))
                .from(objection)
                .leftJoin(objection.answer, answer)
                .leftJoin(objection.bill, bill)
                .leftJoin(objection.member, member)
                // crackdown과 report와의 조인 제거
                .where(objection.id.eq(objectionId))
                .groupBy(objection.id, bill.reportId, member.name, bill.reportType, formattedObjectionDate, objection.title, objection.content, answer.content, formattedAnswerDate)
                .fetchOne();

    }

    public ObjectionDetailResponse findObjectionCCTVDetail(Long objectionId, Long violationType) {
        // Postgres TO_CHAR 사용하여 날짜 형식을 'yyyy.MM.dd'로 변환
        DateTemplate<String> formattedObjectionDate = dateTemplate(String.class, "TO_CHAR({0}, 'YYYY.MM.DD')", objection.createdAt);
        DateTemplate<String> formattedAnswerDate = dateTemplate(String.class, "TO_CHAR({0}, 'YYYY.MM.DD')", answer.createdAt);

        return queryFactory
                .select(new QObjectionDetailResponse(
                        objection.id,
                        bill.reportId.as("crackDownIdx"),
                        member.name,
                        // reportType에 관계없이 violation_type을 NULL로 반환
                        Expressions.asNumber(violationType),
                        formattedObjectionDate,
                        objection.title,
                        objection.content,
                        answer.content,
                        formattedAnswerDate,
                        bill.id
                ))
                .from(objection)
                .leftJoin(objection.answer, answer)
                .leftJoin(objection.bill, bill)
                .leftJoin(objection.member, member)
                // crackdown과 report와의 조인 제거
                .where(objection.id.eq(objectionId))
                .groupBy(objection.id, bill.reportId, member.name, bill.reportType, formattedObjectionDate, objection.title, objection.content, answer.content, formattedAnswerDate)
                .fetchOne();

    }

    public List<ObjectionUserListDto> findUserObjections(Long memberId, int status, Pageable pageable) {
        BooleanExpression condition = objection.member.id.eq(memberId);

        if (status == 0) {
            condition = condition.and(objection.answer.isNull());
        } else if (status == 1) {
            condition = condition.and(objection.answer.isNotNull());
        }

        DateTemplate<String> formattedDate = Expressions.dateTemplate(
                String.class,
                "TO_CHAR({0}, 'YYYY-MM-DD\"T\"HH24:MI:SS.MS\"Z\"')",
                objection.createdAt
        );

        return queryFactory
                .select(new QObjectionUserListDto(
                        objection.id,
                        formattedDate, // 날짜를 문자열로 변환
                        objection.title
                ))
                .from(objection)
                .leftJoin(objection.answer, answer)
                .where(condition)
                .orderBy(status == 0 ? objection.createdAt.asc() : objection.createdAt.desc()) // status에 따라 정렬 순서 결정
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();
    }

    public ObjectionDetailResponse findObjectionUserDetail(Long id, Long objectionId, Long violationType) {
        DateTemplate<String> formattedDate = Expressions.dateTemplate(
                String.class,
                "TO_CHAR({0}, 'YYYY-MM-DD\"T\"HH24:MI:SS.MS\"Z\"')",
                objection.createdAt
        );

        DateTemplate<String> formattedDate2 = Expressions.dateTemplate(
                String.class,
                "TO_CHAR({0}, 'YYYY-MM-DD\"T\"HH24:MI:SS.MS\"Z\"')",
                answer.createdAt
        );

        return queryFactory
                .select(new QObjectionDetailResponse(
                        objection.id,
                        bill.reportId.as("crackDownIdx"), // crackDownIdx는 bill의 reportId
                        member.name,
                        // reportType이 CCTV인 경우 crackdown.violationType.id, USER인 경우 report.violationType.id
                        Expressions.asNumber(violationType),
                        formattedDate, // 접수 날짜
                        objection.title,
                        objection.content,
                        answer.content,
                        formattedDate2, // 답변 날짜
                        bill.id
                ))
                .from(objection)
                .leftJoin(objection.answer, answer)
                .leftJoin(objection.bill, bill)
                .leftJoin(objection.member, member)
                .where(objection.id.eq(objectionId).and(member.id.eq(id)))
                .groupBy(objection.id, bill.reportId, member.name, bill.reportType, formattedDate, objection.title, objection.content, answer.content, formattedDate2)
                .fetchOne();
    }

}
