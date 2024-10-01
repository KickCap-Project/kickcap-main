package com.ssafy.kickcap.objection.repository;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.DateTemplate;
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

    public List<ObjectionListResponse> findObjections(Long policeId, int status, String name, Pageable pageable) {


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

    public List<ObjectionUserListDto> findUserObjections(Long memberId, int status, Pageable pageable) {
        BooleanExpression condition = objection.member.id.eq(memberId);

        if (status == 0) {
            condition = condition.and(objection.answer.isNull());
        } else if (status == 1) {
            condition = condition.and(objection.answer.isNotNull());
        }

        return queryFactory
                .select(new QObjectionUserListDto(
                        objection.id,
                        objection.createdAt.stringValue(), // 날짜를 문자열로 변환
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

    public ObjectionDetailResponse findObjectionUserDetail(Long id, Long objectionId) {
        return queryFactory
                .select(new QObjectionDetailResponse(
                        objection.id,
                        bill.reportId.as("crackDownIdx"), // crackDownIdx는 bill의 reportId
                        member.name,
                        // reportType이 CCTV인 경우 crackdown.violationType.id, USER인 경우 report.violationType.id
                        bill.reportType
                                .when(ReportType.CCTV).then(crackdown.violationType.id)
                                .otherwise(report.violationType.id).intValue(),
                        objection.createdAt.stringValue(), // 접수 날짜
                        objection.title,
                        objection.content,
                        answer.content,
                        answer.createdAt.stringValue() // 답변 날짜
                ))
                .from(objection)
                .leftJoin(objection.answer, answer)
                .leftJoin(objection.bill, bill)
                .leftJoin(objection.member, member)
                .leftJoin(crackdown).on(bill.reportType.eq(ReportType.CCTV))
                .leftJoin(report).on(bill.reportType.eq(ReportType.USER))
                .where(objection.id.eq(objectionId), objection.member.id.eq(id))
                .fetchOne();
    }

}