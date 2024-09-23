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
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final CompanyRepository companyRepository;
    private final MemberRepository memberRepository;
    private final InformerRepository informerRepository;
    private final ObjectMapper objectMapper;

    public Company fetchUserData(String kickboardNumber, ZonedDateTime reportTime) {
        return companyRepository.findByKickboardNumberAndReportTime(kickboardNumber, reportTime)
                .orElseThrow(() -> new RestApiException(ErrorCode.NOT_FOUND));
    }
    public Member findMember(String name, String phone) {
        return memberRepository.findMemberByNameAndPhone(name, phone)
                .orElseThrow(() -> new RestApiException(ErrorCode.NOT_FOUND));
    }

    private Informer saveInformer(Long memberId, Member accusedMember, String kickboardNumber) {
        Member informerMember = memberRepository.findById(memberId)
                .orElseThrow(() -> new RestApiException(ErrorCode.NOT_FOUND));

        Informer informer = Informer.builder()
                .accusedId(accusedMember.getId())
                .member(informerMember)
                .isSent("N")
                .kickboardNumber(kickboardNumber)
                .build();

        return informerRepository.save(informer);
    }


    public void saveReportToRedis(Long memberId, RealTimeReportRequestDto requestDto) {
        // 킥보드 업체에 킥보드 번호로 사용자 데이터 요청 - 촬영 시간이 해당 번호판 사용시간 between 인 것.
        Company userData = fetchUserData(requestDto.getKickboardNumber(), requestDto.getReportTime());

        // member 테이블에 이름과 번호가 같은 유저 찾기
        Member member = findMember(userData.getName(), userData.getPhone());

        // 신고자 테이블에 신고자 데이터 저장
        saveInformer(memberId, member, requestDto.getKickboardNumber());

        // redis key 만들기 R + memberIdx + 킥보드 번호, ttl : 1시간
        createRedisData(memberId, requestDto.getKickboardNumber(), requestDto);
//         최종적으로는 스케줄러로 Lua 스크립트 확인 - 1분마다 확인해서 key 수명이 1분 남은거 신고테이블에 저장
//         이 때 지역 코드랑 dto의 법정동 코드 조회해서 관할 경찰서 번호 찾은다음에 조회해야함.
    }

    public void createRedisData(Long memberId, String kickboardNumber, RealTimeReportRequestDto newReportDto) {
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

            // 변환된 DTO 출력
            System.out.println("기존 데이터: " + existingReportDto);
        }

        // 기존에 Redis에 저장된 데이터가 있는지 확인
        if (existingReportDto == null || newReportDto.getViolationType() < existingReportDto.getViolationType()) {
            // 새로운 데이터의 violationType이 더 낮으면 덮어쓰기
            valueOps.set(redisKey, newReportDto, 1, TimeUnit.HOURS); // 1시간 TTL
            // 덮어쓰기가 완료된 후 Redis에서 값을 다시 조회하여 출력
            RealTimeReportRequestDto savedReportDto = objectMapper.convertValue(valueOps.get(redisKey), RealTimeReportRequestDto.class);
            System.out.println("덮어쓰기 완료된 후 조회한 데이터: " + savedReportDto);
        }
        // 기존 데이터의 violationType이 더 낮으면 저장하지 않음
    }
}