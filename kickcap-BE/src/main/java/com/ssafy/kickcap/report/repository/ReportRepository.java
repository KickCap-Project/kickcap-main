package com.ssafy.kickcap.report.repository;

import com.ssafy.kickcap.report.entity.ApproveStatus;
import com.ssafy.kickcap.report.entity.Report;
import com.ssafy.kickcap.user.entity.Police;
import com.ssafy.kickcap.violationtype.entity.ViolationType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReportRepository extends JpaRepository<Report, Long> {

    long countByViolationTypeAndApproveStatusAndPolice(ViolationType violationType, ApproveStatus approveStatus, Police police);

    // 완료된 건(APPROVED, REJECTED 상태)의 총 개수를 조회하는 쿼리 메서드
    @Query("SELECT count(r) FROM Report  r WHERE r.violationType = :violationType AND r.approveStatus IN :statuses AND r.police = :police ")
    long countCompletedReports(@Param("violationType") ViolationType violationType, @Param("statuses") List<ApproveStatus> statuses, @Param("police") Police police);

    // 주어진 위반 유형과 승인 상태가 'UNAPPROVED'인 리포트를 페이지네이션하여 조회하는 쿼리
    Page<Report> findByViolationTypeAndApproveStatusAndPoliceOrderByIdDesc(ViolationType violationType, ApproveStatus approveStatus, Police police, Pageable pageable);

    // 주어진 위반 유형과 승인 상태가 'REJECTED, APPROVED'인 리포트를 페이지네이션하여 조회하는 쿼리
    Page<Report> findByViolationTypeAndApproveStatusInAndPoliceOrderByIdDesc(ViolationType violationType, List<ApproveStatus> statuses, Police police, Pageable pageable);

}
