package com.ssafy.kickcap.bill.repository;

import com.ssafy.kickcap.bill.entity.Bill;
import com.ssafy.kickcap.bill.entity.PaidStatus;
import com.ssafy.kickcap.user.entity.Member;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;

public interface BillRepository extends JpaRepository<Bill, Long> {

   // member의 고지서 내역 조회하기
    @Query("SELECT b FROM Bill b WHERE b.member = :member AND b.paidStatus <> :paidStatus ORDER BY " +
        "CASE WHEN b.paidStatus = 'UNPAID' THEN 0 ELSE 1 END , b.deadline ASC") // deadline 기준으로 오름차순 정렬
    Page<Bill> findByMemberAndPaidStatusNotOrderByDeadlineAsc(Member member, PaidStatus paidStatus, Pageable pageable);

    Optional<Bill> findFirstByMemberIdOrderByCreatedAtDesc(Long memberId);

    // JPQL로 납부 기한이 지나고 미납 상태 + 이의제기 안한 고지서 조회
    @Query("SELECT b FROM Bill b WHERE b.deadline < :now AND b.paidStatus = :status AND b.isObjection <> 'Y' ")
    List<Bill> findByDeadlineBeforeAndPaidStatus(@Param("now") ZonedDateTime now, @Param("status") PaidStatus status);
}
