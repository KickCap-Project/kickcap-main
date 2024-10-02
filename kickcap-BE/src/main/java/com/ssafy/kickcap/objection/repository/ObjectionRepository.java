package com.ssafy.kickcap.objection.repository;

import com.ssafy.kickcap.bill.entity.Bill;
import com.ssafy.kickcap.objection.entity.Objection;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ObjectionRepository extends JpaRepository<Objection, Long> {
    Optional<Objection> findByBill(Bill bill);
}
