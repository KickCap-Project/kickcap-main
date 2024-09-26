package com.ssafy.kickcap.parkingdata.dto;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ParkingDataRequestDto {

    private float lat;

    private float lng;
}
