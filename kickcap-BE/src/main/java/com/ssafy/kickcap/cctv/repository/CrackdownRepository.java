package com.ssafy.kickcap.cctv.repository;

import com.ssafy.kickcap.cctv.entity.Crackdown;
import com.ssafy.kickcap.violationtype.entity.ViolationType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.ZonedDateTime;
import java.util.List;

public interface CrackdownRepository extends JpaRepository<Crackdown, Long> {

    @Query("SELECT COUNT(c) FROM Crackdown c WHERE c.crackdownTime BETWEEN :startDate AND :endDate GROUP BY DATE(c.crackdownTime)")
    List<Long> countCrackdownsByDateRange(ZonedDateTime startDate, ZonedDateTime endDate);

    @Query("SELECT COUNT(c) FROM Crackdown c WHERE c.crackdownTime BETWEEN :startDate AND :endDate AND " +
            "EXTRACT(HOUR FROM c.crackdownTime) BETWEEN :startHour AND :endHour")
    Long countCrackdownsByTimeRange(ZonedDateTime startDate, ZonedDateTime endDate, int startHour, int endHour);

    @Query("SELECT cr FROM Crackdown cr JOIN cr.cctvInfo ci WHERE ci.policeId = :policeId AND cr.violationType = :violationType ORDER BY cr.id DESC")
    Page<Crackdown> findCrackdownsByPoliceIdAndViolationType( Long policeId, ViolationType violationType,  Pageable pageable);

    @Query("SELECT COUNT(c) FROM Crackdown c JOIN c.cctvInfo ci WHERE ci.policeId = :policeId AND c.violationType = :violationType")
    long countByPoliceAndViolationType(Long policeId, ViolationType violationType);
}
