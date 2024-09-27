package com.ssafy.kickcap.report.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.querydsl.core.types.dsl.DateTemplate;
import com.querydsl.core.types.dsl.Expressions;
import com.ssafy.kickcap.report.entity.QAccidentReport;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class AccidentReportRepositoryImpl {

    private final JPAQueryFactory queryFactory;

    // 특정 지역(stationIdxList) 내에서 주어진 날짜 범위(startDate~endDate) 동안 발생한 사고 건수를 날짜별로 집계합니다.
    public List<Long> countAccidentsByDateRangeAndRegion(List<Long> stationIdxList, ZonedDateTime startDate, ZonedDateTime endDate) {
        QAccidentReport accidentReport = QAccidentReport.accidentReport;

        // DATE() 함수로 날짜 부분만 추출
        DateTemplate<LocalDate> accidentDate = Expressions.dateTemplate(LocalDate.class, "DATE({0})", accidentReport.reportTime);

        return queryFactory
                .select(accidentReport.count())
                .from(accidentReport)
                .where(accidentReport.police.id.in(stationIdxList) // 해당 stationIdxList에 포함된 경찰서 ID와 일치하는 사고를 필터링합니다.
                        .and(accidentReport.reportTime.between(startDate, endDate))) // 주어진 날짜 범위 내에서 발생한 사고를 필터링합니다.
                .groupBy(accidentDate) // DATE(report_time)으로 그룹화
                .fetch(); // 결과를 리스트로 반환합니다.
    }
}
