package com.ssafy.kickcap.report.repository;

import com.ssafy.kickcap.report.entity.Informer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InformerRepository extends JpaRepository<Informer, Long> {
}
