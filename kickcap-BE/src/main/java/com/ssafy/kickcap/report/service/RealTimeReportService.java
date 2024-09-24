package com.ssafy.kickcap.report.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.kickcap.company.entity.Company;
import com.ssafy.kickcap.company.repository.CompanyRepository;
import com.ssafy.kickcap.exception.ErrorCode;
import com.ssafy.kickcap.exception.RestApiException;
import com.ssafy.kickcap.report.dto.RedisRequestDto;
import com.ssafy.kickcap.report.entity.Informer;
import com.ssafy.kickcap.report.repository.InformerRepository;
import com.ssafy.kickcap.user.entity.Member;
import com.ssafy.kickcap.user.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class RealTimeReportService {

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

    private void saveInformer(Long memberId, Member accusedMember, String kickboardNumber) {
        Member informerMember = memberRepository.findById(memberId)
                .orElseThrow(() -> new RestApiException(ErrorCode.NOT_FOUND));

        Informer informer = Informer.builder()
                .accusedId(accusedMember.getId())
                .member(informerMember)
                .isSent("N")
                .kickboardNumber(kickboardNumber)
                .build();

        informerRepository.save(informer);
    }

    public void saveReportToRedis(Long memberId, RedisRequestDto requestDto) {
        // 킥보드 업체에 킥보드 번호로 사용자 데이터 요청 - 촬영 시간이 해당 번호판 사용시간 between 인 것.
        Company userData = fetchUserData(requestDto.getKickboardNumber(), requestDto.getReportTime());

        // member 테이블에 이름과 번호가 같은 유저 찾기
        Member member = findMember(userData.getName(), userData.getPhone());

        // 신고자 테이블에 신고자 데이터 저장
        saveInformer(memberId, member, requestDto.getKickboardNumber());

        // redis key 만들기 R + memberIdx + 킥보드 번호, ttl : 1시간
        createRedisData(memberId, requestDto.getKickboardNumber(), requestDto);
    }

    public void createRedisData(Long memberId, String kickboardNumber, RedisRequestDto newReportDto) {
        // Redis key 생성
        String redisKey = memberId.toString() +":"+ kickboardNumber;
        System.out.println("redisKey : " + redisKey);

        ValueOperations<String, Object> valueOps = redisTemplate.opsForValue();

        // Redis에서 데이터가 있는지 확인
        Object existingData = valueOps.get(redisKey);
        RedisRequestDto existingReportDto = null;

        if (existingData != null) {
            // ObjectMapper를 사용하여 LinkedHashMap을 RedisRequestDto로 변환 - 이유: dto 안의 변수 값을 비교해야해서
            existingReportDto = objectMapper.convertValue(existingData, RedisRequestDto.class);
        }

        // 기존에 Redis에 저장된 데이터가 없거나 단속 유형이 낮은거
        if (existingReportDto == null || newReportDto.getViolationType() < existingReportDto.getViolationType()) {
            // 새로운 데이터의 violationType이 더 낮으면 덮어쓰기
            valueOps.set(redisKey, newReportDto, 1, TimeUnit.HOURS); // 1시간 TTL
            // 2분 TTL로 수정 - test 용
//            valueOps.set(redisKey, newReportDto, 2, TimeUnit.MINUTES);
        }
    }
}