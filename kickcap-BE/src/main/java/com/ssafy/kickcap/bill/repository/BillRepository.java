package com.ssafy.kickcap.bill.repository;

import com.ssafy.kickcap.bill.entity.Bill;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BillRepository extends JpaRepository<Bill, Long> {
}
