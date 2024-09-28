package com.ssafy.kickcap.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@AllArgsConstructor
@Getter
@Builder
public class MarkersDataReponse {
    private List<CamDataResponse> camDataResponses;
    private List<PointDataResponse> pointDataResponses;
}
