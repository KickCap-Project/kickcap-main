package com.ssafy.kickcap.report.service;

import com.ssafy.kickcap.exception.ErrorCode;
import com.ssafy.kickcap.exception.RestApiException;
import com.ssafy.kickcap.region.repository.RegionCodeRepository;
import com.ssafy.kickcap.report.dto.AccidentReportRequestDto;
import com.ssafy.kickcap.report.entity.AccidentReport;
import com.ssafy.kickcap.report.repository.AccidentReportRepository;
import com.ssafy.kickcap.user.entity.Member;
import com.ssafy.kickcap.user.entity.Police;
import com.ssafy.kickcap.user.repository.MemberRepository;
import com.ssafy.kickcap.user.repository.PoliceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;

@Service
@RequiredArgsConstructor
public class AccidentReportService {

    private final AccidentReportRepository accidentReportRepository;
    private final MemberRepository memberRepository;
    private final RegionCodeRepository regionCodeRepository;
    private final PoliceRepository policeRepository;

    public void saveAccidentReport(Long memberId, AccidentReportRequestDto requestDto) {

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RestApiException(ErrorCode.UNAUTHORIZED_REQUEST));

        Long stationId = regionCodeRepository.findStationIdByCode(requestDto.getCode());

        Police police = policeRepository.findById(stationId).orElseThrow(() -> new RestApiException(ErrorCode.NOT_FOUND));

        AccidentReport accidentReport = AccidentReport.builder()
                .address(requestDto.getAddr())
                .latitude(requestDto.getLat())
                .longitude(requestDto.getLng())
                .reportTime(LocalDateTime.now().atZone(ZoneId.of("Asia/Seoul")))
                .member(member)
                .police(police)
                .build();

        accidentReportRepository.save(accidentReport);
    }
}
