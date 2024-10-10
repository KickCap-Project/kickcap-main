package com.ssafy.kickcap.violationtype.repository;

import com.ssafy.kickcap.violationtype.entity.ViolationType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ViolationTypeRepository extends JpaRepository<ViolationType, Long> {
}
