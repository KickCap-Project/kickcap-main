package com.ssafy.kickcap.report.repository;

import com.querydsl.core.Tuple;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.querydsl.core.types.dsl.DateTemplate;
import com.querydsl.core.types.dsl.Expressions;
import com.ssafy.kickcap.report.entity.AccidentReport;
import com.ssafy.kickcap.report.entity.QAccidentReport;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class AccidentReportRepositoryImpl {

    private final JPAQueryFactory queryFactory;
    private final QAccidentReport accidentReport = QAccidentReport.accidentReport;

    // 특정 지역(stationIdxList) 내에서 주어진 날짜 범위(startDate~endDate) 동안 발생한 사고 건수를 날짜별로 집계합니다.
    public Map<LocalDate, Long> countAccidentsByDateRangeAndRegion(List<Long> stationIdxList, ZonedDateTime startDate, ZonedDateTime endDate) {
        DateTemplate<java.sql.Date> accidentReportDate = Expressions.dateTemplate(java.sql.Date.class, "DATE({0})", accidentReport.reportTime);

        List<Tuple> results = queryFactory
                .select(accidentReportDate, accidentReport.count())
                .from(accidentReport)
                .where(accidentReport.police.id.in(stationIdxList)
                        .and(accidentReport.reportTime.between(startDate, endDate)))
                .groupBy(accidentReportDate)
                .orderBy(accidentReportDate.asc())
                .fetch();

        return results.stream()
                .collect(Collectors.toMap(
                        tuple -> tuple.get(accidentReportDate).toLocalDate(),
                        tuple -> tuple.get(accidentReport.count())
                ));
    }


    public Long getAccidentCountOfDay(List<Long> stationIdxList, ZonedDateTime startDate, ZonedDateTime endDate) {
        return queryFactory
                .select(accidentReport.count())
                .from(accidentReport)
                .where(accidentReport.police.id.in(stationIdxList)
                        .and(accidentReport.reportTime.between(startDate, endDate)))
                .fetchOne();
    }

    public List<AccidentReport> findReportsByStationIdxAndDateRange(List<Long> stationIdxList, ZonedDateTime startOfLastWeek, ZonedDateTime startOfToday) {

        return queryFactory.selectFrom(accidentReport)
                .where(accidentReport.police.id.in(stationIdxList)
                        .and(accidentReport.reportTime.between(startOfLastWeek, startOfToday)))
                .fetch();
    }
}
