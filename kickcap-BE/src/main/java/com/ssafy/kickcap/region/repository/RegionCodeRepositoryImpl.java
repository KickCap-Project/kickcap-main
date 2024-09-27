package com.ssafy.kickcap.region.repository;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.kickcap.region.entity.QRegionCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class RegionCodeRepositoryImpl {

    private final JPAQueryFactory queryFactory;

    // 해당 시도와 구군에 속한 고유 stationIdx 목록을 조회합니다.
    public List<Long> findStationIdxByRegion(String si, String gugun) {
        QRegionCode regionCode = QRegionCode.regionCode;

        BooleanExpression condition = null;

        // 시도 조건이 비어있지 않으면 추가합니다.
        if (si != null && !si.isEmpty()) {
            condition = regionCode.si.eq(si.replace("\"", "")); // .trim()을 사용해 문자열 양 끝의 공백 제거
        }

        // 구군 조건이 비어있지 않으면 추가합니다.
        if (gugun != null && !gugun.isEmpty()) {
            condition = (condition == null) ? regionCode.gugun.eq(gugun.replace("\"", "")) : condition.and(regionCode.gugun.eq(gugun.replace("\"", "")));
        }

        return queryFactory
                .select(regionCode.stationIdx)
                .from(regionCode)
                .where(condition)
                .distinct()
                .fetch();
    }
}
