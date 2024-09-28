package com.ssafy.kickcap.cctv.repository;

import com.querydsl.core.Tuple;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.querydsl.core.types.dsl.DateTemplate;
import com.querydsl.core.types.dsl.Expressions;
import com.ssafy.kickcap.cctv.entity.CCTVInfo;
import com.ssafy.kickcap.cctv.entity.Crackdown;
import com.ssafy.kickcap.cctv.entity.QCCTVInfo;
import com.ssafy.kickcap.cctv.entity.QCrackdown;
import com.ssafy.kickcap.dashboard.dto.CamDataResponse;
import com.ssafy.kickcap.dashboard.dto.TimeIndex;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import com.querydsl.core.types.dsl.DateTimeExpression;

import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class CrackdownRepositoryImpl {

    private final JPAQueryFactory queryFactory;
    private final QCrackdown crackdown = QCrackdown.crackdown;
    private final QCCTVInfo cctvInfo = QCCTVInfo.cCTVInfo;

    // 수정된 쿼리 메서드들 (Map<LocalDate, Long> 반환)
    public Map<LocalDate, Long> countCrackdownsByDateRangeAndRegion(List<Long> stationIdxList, ZonedDateTime startDate, ZonedDateTime endDate) {
        // java.sql.Date 사용
        DateTemplate<java.sql.Date> crackdownDate = Expressions.dateTemplate(java.sql.Date.class, "DATE({0})", crackdown.crackdownTime);

        List<Tuple> results = queryFactory
                .select(crackdownDate, crackdown.count())
                .from(crackdown)
                .join(crackdown.cctvInfo, cctvInfo)
                .where(cctvInfo.policeId.in(stationIdxList)
                        .and(crackdown.crackdownTime.between(startDate, endDate)))
                .groupBy(crackdownDate)
                .orderBy(crackdownDate.asc())
                .fetch();

        return results.stream()
                .collect(Collectors.toMap(
                        tuple -> tuple.get(crackdownDate).toLocalDate(), // java.sql.Date를 LocalDate로 변환
                        tuple -> tuple.get(crackdown.count())
                ));
    }



    // 특정 지역(stationIdxList) 내에서 주어진 시간대(startHour~endHour) 동안 발생한 단속 건수를 집계합니다.
    public Long countCrackdownsByTimeRangeAndRegion(List<Long> stationIdxList, ZonedDateTime startDate, ZonedDateTime endDate, int startHour, int endHour) {

        return queryFactory
                .select(crackdown.count())
                .from(crackdown)
                .join(crackdown.cctvInfo, cctvInfo) // Crackdown 엔티티와 CCTVInfo 엔티티를 조인합니다.
                .where(cctvInfo.policeId.in(stationIdxList) // 해당 stationIdxList에 포함된 경찰서 ID와 일치하는 CCTV 정보를 필터링합니다.
                        .and(crackdown.crackdownTime.between(startDate, endDate)) // 주어진 날짜 범위 내에서 발생한 단속을 필터링합니다.
                        .and(crackdown.crackdownTime.hour().goe(startHour)) // 시작 시간 이후 발생한 단속을 필터링합니다.
                        .and(crackdown.crackdownTime.hour().loe(endHour))) // 종료 시간 이전에 발생한 단속을 필터링합니다.
                .fetchOne(); // 단일 값(Long)을 반환합니다.
    }

    // 특정 시도 및 구군의 특정 타입별 단속 건수를 조회합니다.
    public Long getCrackdownCountByViolationType(List<Long> stationIdxList, ZonedDateTime startDate, ZonedDateTime endDate, Long n) {

        return queryFactory
                .select(crackdown.count())
                .from(crackdown)
                .join(crackdown.cctvInfo, cctvInfo)
                .where(crackdown.violationType.id.eq(n) // violation_type이 1인 경우 (동승), violation_type이 3인 경우 (Helmet 미착용)
                        .and(cctvInfo.policeId.in(stationIdxList))
                        .and(crackdown.crackdownTime.between(startDate, endDate)))
                .fetchOne();
    }

    public Long getCrackdownCountOfDay(List<Long> stationIdxList, ZonedDateTime startDay, ZonedDateTime endDay) {

        return queryFactory
                .select(crackdown.count())
                .from(crackdown)
                .join(crackdown.cctvInfo, cctvInfo)
                .where(cctvInfo.policeId.in(stationIdxList)
                        .and(crackdown.crackdownTime.between(startDay, endDay)))
                .fetchOne();
    }


    public List<CCTVInfo> findCCTVsByStationIdx(List<Long> stationIdxList) {

        return queryFactory.selectFrom(cctvInfo)
                .where(cctvInfo.policeId.in(stationIdxList))
                .fetch();
    }

    public Long[] countCrackdownsByCCTVAndTimeRange(Long cctvIdx, ZonedDateTime startDate, ZonedDateTime endDate) {
        Long[] counts = new Long[8];

        for (TimeIndex timeIndex : TimeIndex.values()) {
            counts[timeIndex.getIndex()] = queryFactory.select(crackdown.count())
                    .from(crackdown)
                    .where(crackdown.cctvInfo.id.eq(cctvIdx)
                            .and(crackdown.crackdownTime.between(startDate, endDate)) // LocalDate 비교를 사용
                            .and(crackdown.crackdownTime.hour().goe(Integer.parseInt(timeIndex.getStartTime().split(":")[0])))
                            .and(crackdown.crackdownTime.hour().lt(Integer.parseInt(timeIndex.getEndTime().split(":")[0]) + 1)))
                    .fetchOne();
        }

        return counts;
    }
}
