package com.ssafy.kickcap.report.service;

import com.ssafy.kickcap.company.entity.Company;
import com.ssafy.kickcap.company.repository.CompanyRepository;
import com.ssafy.kickcap.exception.ErrorCode;
import com.ssafy.kickcap.exception.RestApiException;
import com.ssafy.kickcap.report.dto.RealTimeReportRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final CompanyRepository companyRepository;

    public void saveReportToRedis(RealTimeReportRequestDto requestDto) {
        // 킥보드 업체에 킥보드 번호로 사용자 데이터 요청 - 촬영 시간이 해당 번호판 사용시간 between 인 것.
        // 킥보드 업체 response : 사용자 이름, 번호
        Company userData = companyRepository.findByKickboardNumberAndReportTime(requestDto.getKickboardNumber(), requestDto.getReportTime())
                .orElseThrow(() -> new RestApiException(ErrorCode.NOT_FOUND));

        // member 테이블에 이름과 번호가 같은 유저 찾기 -> return : memberIdx
        

        // 신고자 테이블에 신고자 데이터 저장
        // 신고자 idx, 피신고자 번호, 킥보드 번호, 알람 전송 유무,  생성시간


        // redis key 만들기 R + memberIdx + 킥보드 번호, ttl : 1시간

        // 최종적으로는 스케줄러로 Lua 스크립트 확인 - 1분마다 확인해서 key 수명이 1분 남은거 신고테이블에 저장
        // 이 때 지역 코드랑 dto의 법정동 코드 조회해서 관할 경찰서 번호 찾은다음에 조회해야함.

    }

//    public void saveReportToRedis(Long userIdx, String kickboardNumber, ReportDto newReportDto) {
//        // Redis에 저장할 Key 값 생성
//        String redisKey = "user:" + userIdx + ":kickboard:" + kickboardNumber;
//
//        ValueOperations<String, Object> valueOps = redisTemplate.opsForValue();
//        ReportDto existingReportDto = (ReportDto) valueOps.get(redisKey);
//
//        // 기존에 Redis에 저장된 데이터가 있는지 확인
//        if (existingReportDto == null || newReportDto.getViolationType() < existingReportDto.getViolationType()) {
//            // 새로운 데이터의 violationType이 더 낮으면 덮어쓰기
//            valueOps.set(redisKey, newReportDto, 1, TimeUnit.HOURS); // 1시간 TTL
//            System.out.println("Report updated in Redis with lower violationType: " + newReportDto.getViolationType());
//        } else {
//            // 기존 데이터의 violationType이 더 낮으면 저장하지 않음
//            System.out.println("No update needed. Existing violationType is lower or equal: " + existingReportDto.getViolationType());
//        }
//    }
}
