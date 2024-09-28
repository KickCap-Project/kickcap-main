package com.ssafy.kickcap.parkingdata.service;

import com.ssafy.kickcap.parkingdata.dto.ParkingDataResponseDto;
import com.ssafy.kickcap.parkingdata.entity.ParkingData;
import com.ssafy.kickcap.parkingdata.repository.ParkingDataRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ParkingDataService {

    private final ParkingDataRepository parkingDataRepository;

    public List<ParkingDataResponseDto> getParkingData(float lat, float lng) {
        List<ParkingData> parkingDataList = parkingDataRepository.findAllWithin1Km(lat, lng);

        return parkingDataList.stream()
                .map(ParkingDataResponseDto::fromEntity)
                .collect(Collectors.toList());
    }
}
