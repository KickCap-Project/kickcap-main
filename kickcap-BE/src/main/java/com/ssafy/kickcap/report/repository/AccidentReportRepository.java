package com.ssafy.kickcap.report.repository;

import com.ssafy.kickcap.report.entity.AccidentReport;
import com.ssafy.kickcap.user.entity.Police;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface AccidentReportRepository extends JpaRepository<AccidentReport, Long> {

    @Query("SELECT a FROM AccidentReport a where a.police = :police and a.isRead = 'N' ORDER BY a.id ASC LIMIT 1 ")
    AccidentReport findByAccidentReport(Police police);
}
