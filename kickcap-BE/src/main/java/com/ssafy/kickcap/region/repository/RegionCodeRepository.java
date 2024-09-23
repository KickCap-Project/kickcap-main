package com.ssafy.kickcap.region.repository;

import com.ssafy.kickcap.region.entity.RegionCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface RegionCodeRepository extends JpaRepository<RegionCode, Long> {

    @Query("SELECT r.stationIdx FROM RegionCode r WHERE r.code = :code")
    Long findStationIdByCode(@Param("code") String code);
}
