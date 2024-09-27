package com.ssafy.kickcap.bill.repository;

import com.ssafy.kickcap.bill.entity.Bill;
import com.ssafy.kickcap.bill.entity.PaidStatus;
import com.ssafy.kickcap.user.entity.Member;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BillRepository extends JpaRepository<Bill, Long> {

//    // member의 고지서 내역 조회하기
//    Page<Bill> findByMemberOrderByDeadlineDesc(Member member, Pageable pageable);
    Page<Bill> findByMemberAndPaidStatusNotOrderByDeadlineDesc(Member member, PaidStatus paidStatus, Pageable pageable);

    Optional<Bill> findFirstByMemberIdOrderByCreatedAtDesc(Long memberId);
}
