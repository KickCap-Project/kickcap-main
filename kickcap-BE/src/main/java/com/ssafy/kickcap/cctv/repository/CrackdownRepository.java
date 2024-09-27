package com.ssafy.kickcap.cctv.repository;

import com.ssafy.kickcap.report.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.ZonedDateTime;
import java.util.List;

public interface CrackdownRepository extends JpaRepository<Report, Long> {

    @Query("SELECT COUNT(c) FROM Crackdown c WHERE c.crackdownTime BETWEEN :startDate AND :endDate GROUP BY DATE(c.crackdownTime)")
    List<Long> countCrackdownsByDateRange(ZonedDateTime startDate, ZonedDateTime endDate);

    @Query("SELECT COUNT(c) FROM Crackdown c WHERE c.crackdownTime BETWEEN :startDate AND :endDate AND " +
            "EXTRACT(HOUR FROM c.crackdownTime) BETWEEN :startHour AND :endHour")
    Long countCrackdownsByTimeRange(ZonedDateTime startDate, ZonedDateTime endDate, int startHour, int endHour);
}
