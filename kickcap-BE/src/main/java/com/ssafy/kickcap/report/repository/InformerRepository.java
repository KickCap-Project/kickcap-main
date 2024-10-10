package com.ssafy.kickcap.report.repository;

import com.ssafy.kickcap.report.entity.Informer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InformerRepository extends JpaRepository<Informer, Long> {

    @Query("SELECT i FROM Informer i WHERE i.accusedId = :memberIdx AND i.kickboardNumber = :kickboardNumber AND i.isSent = 'N'")
    List<Informer> findByAccusedIdxAndKickboardNumberAndIsSent(@Param("memberIdx") Long memberIdx, @Param("kickboardNumber") String kickboardNumber);

}
