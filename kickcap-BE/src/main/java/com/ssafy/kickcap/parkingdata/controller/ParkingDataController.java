package com.ssafy.kickcap.parkingdata.controller;

import com.ssafy.kickcap.parkingdata.dto.ParkingDataRequestDto;
import com.ssafy.kickcap.parkingdata.dto.ParkingDataResponseDto;
import com.ssafy.kickcap.parkingdata.service.ParkingDataService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@Slf4j
@RequiredArgsConstructor
@Tag(name = "주차장 컨트롤러", description = "주차장 관련 API")
@RequestMapping("/parking-data")
public class ParkingDataController {

    private final ParkingDataService parkingDataService;

    @GetMapping()
    @Operation(summary = "주차장 조회", description = "킥보드 주변 1km 반경의 주차장을 조회합니다..")
    public ResponseEntity<List<ParkingDataResponseDto>> getParkingData(@RequestBody ParkingDataRequestDto requestDto) {
        List<ParkingDataResponseDto> parkingDataList = parkingDataService.getParkingData(requestDto);
        return ResponseEntity.ok(parkingDataList);
    }
}
