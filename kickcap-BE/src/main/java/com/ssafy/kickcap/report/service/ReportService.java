package com.ssafy.kickcap.report.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.kickcap.company.entity.Company;
import com.ssafy.kickcap.company.repository.CompanyRepository;
import com.ssafy.kickcap.exception.ErrorCode;
import com.ssafy.kickcap.exception.RestApiException;
import com.ssafy.kickcap.report.dto.RealTimeReportRequestDto;
import com.ssafy.kickcap.report.entity.Informer;
import com.ssafy.kickcap.report.repository.InformerRepository;
import com.ssafy.kickcap.user.entity.Member;
import com.ssafy.kickcap.user.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final CompanyRepository companyRepository;
    private final MemberRepository memberRepository;
    private final InformerRepository informerRepository;
    private final ObjectMapper objectMapper;

    public void saveReportToRedis(Long memberId, RealTimeReportRequestDto requestDto) {
        // 킥보드 업체에 킥보드 번호로 사용자 데이터 요청 - 촬영 시간이 해당 번호판 사용시간 between 인 것.
        // 킥보드 업체 response : 사용자 이름, 번호
        Company userData = companyRepository.findByKickboardNumberAndReportTime(requestDto.getKickboardNumber(), requestDto.getReportTime())
                .orElseThrow(() -> new RestApiException(ErrorCode.NOT_FOUND));

        // member 테이블에 이름과 번호가 같은 유저 찾기 -> return : memberIdx
        Member member = memberRepository.findMemberByNameAndPhone(userData.getName(), userData.getPhone())
                .orElseThrow(() -> new RestApiException(ErrorCode.NOT_FOUND));

        // 신고자 테이블에 신고자 데이터 저장
        Member informerMember = memberRepository.findById(memberId)
                .orElseThrow(() -> new RestApiException(ErrorCode.NOT_FOUND));

        Informer informer = Informer.builder()
                .accusedId(member.getId())
                .member(informerMember)
                .isSent("N")
                .kickboardNumber(requestDto.getKickboardNumber())
                .createdAt(ZonedDateTime.now())
                .build();

        informerRepository.save(informer);
        // redis key 만들기 R + memberIdx + 킥보드 번호, ttl : 1시간
        makeRedisKey(memberId, requestDto.getKickboardNumber(), requestDto);
//         최종적으로는 스케줄러로 Lua 스크립트 확인 - 1분마다 확인해서 key 수명이 1분 남은거 신고테이블에 저장
//         이 때 지역 코드랑 dto의 법정동 코드 조회해서 관할 경찰서 번호 찾은다음에 조회해야함.

    }

//    public void makeRedisKey(Long memberId, String kickboardNumber, RealTimeReportRequestDto newReportDto) {
//        // Redis key 생성
//        String redisKey = memberId.toString() + kickboardNumber;
//        System.out.println("rediskey: " + redisKey);
//
//        ValueOperations<String, Object> valueOps = redisTemplate.opsForValue();
//        RealTimeReportRequestDto existingReportDto = (RealTimeReportRequestDto) valueOps.get(redisKey);
//
//        // 기존에 Redis에 저장된 데이터가 있는지 확인
//        if (existingReportDto == null || newReportDto.getViolationType() < existingReportDto.getViolationType()) {
//            // 새로운 데이터의 violationType이 더 낮으면 덮어쓰기
//            valueOps.set(redisKey, newReportDto, 1, TimeUnit.HOURS); // 1시간 TTL
//            System.out.println("저장완료 제일 낮은 순위로다가 " + newReportDto.getViolationType());
//        } else {
//            // 기존 데이터의 violationType이 더 낮으면 저장하지 않음
//            System.out.println("저장하지않음 낮은 순위가 존재 " + existingReportDto.getViolationType());
//        }
//    }

    public void makeRedisKey(Long memberId, String kickboardNumber, RealTimeReportRequestDto newReportDto) {
        // Redis key 생성
        String redisKey = memberId.toString() + kickboardNumber;
        System.out.println("rediskey: " + redisKey);

        ValueOperations<String, Object> valueOps = redisTemplate.opsForValue();

        // Redis에서 데이터를 가져온 후, LinkedHashMap을 RealTimeReportRequestDto로 변환
        Object existingData = valueOps.get(redisKey);
        RealTimeReportRequestDto existingReportDto = null;

        if (existingData != null) {
            // ObjectMapper를 사용하여 LinkedHashMap을 RealTimeReportRequestDto로 변환
            existingReportDto = objectMapper.convertValue(existingData, RealTimeReportRequestDto.class);
        }

        // 기존에 Redis에 저장된 데이터가 있는지 확인
        if (existingReportDto == null || newReportDto.getViolationType() < existingReportDto.getViolationType()) {
            // 새로운 데이터의 violationType이 더 낮으면 덮어쓰기
            valueOps.set(redisKey, newReportDto, 1, TimeUnit.HOURS); // 1시간 TTL
            System.out.println("저장완료 제일 낮은 순위로다가 " + newReportDto.getViolationType());
        } else {
            // 기존 데이터의 violationType이 더 낮으면 저장하지 않음
            System.out.println("저장하지않음 낮은 순위가 존재 " + existingReportDto.getViolationType());
        }
    }
}