package com.ssafy.kickcap.parkingdata.dto;

import com.ssafy.kickcap.parkingdata.entity.ParkingData;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@AllArgsConstructor
@Builder
@Getter
public class ParkingDataResponseDto {

    private double lat;

    private double lng;

    private String detailAddress;

    public static ParkingDataResponseDto fromEntity(ParkingData parkingData) {
        return ParkingDataResponseDto.builder()
                .lat(parkingData.getLatitude())
                .lng(parkingData.getLongitude())
                .detailAddress(parkingData.getDetailAddress())
                .build();
    }
}
