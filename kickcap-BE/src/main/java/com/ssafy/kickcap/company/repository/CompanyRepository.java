package com.ssafy.kickcap.company.repository;

import com.ssafy.kickcap.company.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.ZonedDateTime;
import java.util.Optional;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {

    @Query("SELECT c FROM Company c WHERE c.kickboardNumber = :kickboardNumber AND :reportTime BETWEEN c.startTime AND c.endTime")
    Optional<Company> findByKickboardNumberAndReportTime(@Param("kickboardNumber") String kickboardNumber, @Param("reportTime") ZonedDateTime reportTime);

    @Query("SELECT c FROM Company c WHERE c.kickboardNumber = :kickboardNumber ORDER BY c.endTime DESC LIMIT 1")
    Optional<Company> findByKickboardNumber(@Param("kickboardNumber") String kickboardNumber);
}
