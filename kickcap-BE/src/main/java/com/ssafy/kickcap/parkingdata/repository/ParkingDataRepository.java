package com.ssafy.kickcap.parkingdata.repository;

import com.ssafy.kickcap.parkingdata.entity.ParkingData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ParkingDataRepository extends JpaRepository<ParkingData, Long> {

    // 킥보드 위치 반경 1km 이내 데이터 조회 (하버사인 공식)
    @Query(value = "SELECT * FROM parking_data p WHERE (6371 * acos(cos(radians(:lat)) * cos(radians(p.lat)) * cos(radians(p.lng) - radians(:lng)) + sin(radians(:lat)) * sin(radians(p.lat)))) < 1", nativeQuery = true)
    List<ParkingData> findAllWithin1Km(@Param("lat") double lat, @Param("lng") double lng);

}
