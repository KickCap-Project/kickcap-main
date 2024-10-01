package com.ssafy.kickcap.objection.repository;

import com.ssafy.kickcap.objection.dto.ObjectionDetailResponse;
import com.ssafy.kickcap.objection.dto.ObjectionListResponse;
import com.ssafy.kickcap.objection.entity.Objection;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ObjectionRepository extends JpaRepository<Objection, Long> {
}
