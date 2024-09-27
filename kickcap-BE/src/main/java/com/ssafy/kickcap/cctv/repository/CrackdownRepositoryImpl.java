package com.ssafy.kickcap.cctv.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.querydsl.core.types.dsl.DateTemplate;
import com.querydsl.core.types.dsl.Expressions;
import com.ssafy.kickcap.cctv.entity.QCCTVInfo;
import com.ssafy.kickcap.cctv.entity.QCrackdown;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import com.querydsl.core.types.dsl.DateTimeExpression;

import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class CrackdownRepositoryImpl {

    private final JPAQueryFactory queryFactory;
    private final QCrackdown crackdown = QCrackdown.crackdown;
    private final QCCTVInfo cctvInfo = QCCTVInfo.cCTVInfo;

    public List<Long> countCrackdownsByDateRangeAndRegion(List<Long> stationIdxList, ZonedDateTime startDate, ZonedDateTime endDate) {

        // DATE() 함수로 변환한 crackdownTime을 사용하여 LocalDate로 비교합니다.
        DateTemplate<LocalDate> crackdownDate = Expressions.dateTemplate(LocalDate.class, "DATE({0})", crackdown.crackdownTime);

        // 실제 쿼리 실행 부분
        return queryFactory
                .select(crackdown.count())
                .from(crackdown)
                .join(crackdown.cctvInfo, cctvInfo)
                .where(cctvInfo.policeId.in(stationIdxList)
                        .and(crackdown.crackdownTime.between(startDate, endDate))) // LocalDate 비교를 사용
                .groupBy(crackdownDate)
                .orderBy(crackdownDate.asc())
                .fetch();
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
}
