package com.ssafy.kickcap.report.repository;

import com.ssafy.kickcap.report.entity.AccidentReport;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccidentReportRepository extends JpaRepository<AccidentReport, Long> {
}
