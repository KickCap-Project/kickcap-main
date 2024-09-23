package com.ssafy.kickcap.config.redis;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.kickcap.exception.ErrorCode;
import com.ssafy.kickcap.exception.RestApiException;
import com.ssafy.kickcap.region.repository.RegionCodeRepository;
import com.ssafy.kickcap.report.dto.RealTimeReportRequestDto;
import com.ssafy.kickcap.report.entity.ApproveStatus;
import com.ssafy.kickcap.report.entity.Report;
import com.ssafy.kickcap.report.repository.ReportRepository;
import com.ssafy.kickcap.user.entity.Member;
import com.ssafy.kickcap.user.entity.Police;
import com.ssafy.kickcap.user.repository.MemberRepository;
import com.ssafy.kickcap.user.repository.PoliceRepository;
import com.ssafy.kickcap.violationtype.entity.ViolationType;
import com.ssafy.kickcap.violationtype.repository.ViolationTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ReportMessageListener {

    private final RedisTemplate<String, Object> redisTemplate;
    private final RegionCodeRepository regionCodeRepository;
    private final MemberRepository memberRepository;
    private final PoliceRepository policeRepository;
    private final ReportRepository reportRepository;
    private final ViolationTypeRepository violationTypeRepository;
    private final ObjectMapper objectMapper;

    public void onMessage(String message) {
        // 해당 키에 대한 DB 작업 처리
        System.out.println("onMessage 시작");
        handleDatabaseOperations(message);
    }

    private void handleDatabaseOperations(String key) {
        // Redis에서 해당 키를 사용하여 DB 작업 수행
        System.out.println("handleDatabaseOperations 시작");
        System.out.println("key : " + key);

        ValueOperations<String, Object> valueOps = redisTemplate.opsForValue();
        // Redis에서 DTO 가져오기
        Object data = valueOps.get(key);
        RealTimeReportRequestDto reportDto = objectMapper.convertValue(data, RealTimeReportRequestDto.class);
        System.out.println("reportDto: " + reportDto);

        Long stationIdx = findStationIdByCode(reportDto.getCode());
        Police police = policeRepository.findById(stationIdx).orElseThrow(() -> new RestApiException(ErrorCode.NOT_FOUND));

        // ':'를 기준으로 split하여 앞의 숫자 부분을 memberId로 추출
        String[] keyParts = key.split(":");
        Long memberId = Long.parseLong(keyParts[0]); // "123"을 memberId로 변환
        System.out.println("memberId: " + memberId); // 출력: 123
        Member member = memberRepository.findById(memberId).orElseThrow(() -> new RestApiException(ErrorCode.NOT_FOUND));

        ViolationType violationType = violationTypeRepository.findById(reportDto.getViolationType()).orElseThrow(() -> new RestApiException(ErrorCode.NOT_FOUND));

        // Report 엔티티 생성
        Report report = Report.builder()
                .imageSrc(reportDto.getImage())
                .address(reportDto.getAddr())
                .latitude(Float.parseFloat(reportDto.getLat()))
                .longitude(Float.parseFloat(reportDto.getLng()))
                .kickboardNumber(reportDto.getKickboardNumber())
                .reportTime(reportDto.getReportTime())
                .description(reportDto.getDescription())
                .approveStatus(ApproveStatus.UNAPPROVED)
                .member(member) // Member 객체 설정
                .police(police) // 경찰 객체
                .violationType(violationType)
                .build();

        // Report 엔티티 저장
        reportRepository.save(report);
        System.out.println("Report 저장 완료: " + report);

        // Redis에서 키 삭제
        redisTemplate.delete(key);
        System.out.println("Redis에서 키 삭제 완료: " + key);
    }

    // 지역 코드와 법정동 코드로 경찰서 ID 찾기
    private Long findStationIdByCode(String code) {
        return regionCodeRepository.findStationIdByCode(code);
    }

}
