package com.ssafy.kickcap.report.service;

import com.ssafy.kickcap.company.entity.Company;
import com.ssafy.kickcap.company.repository.CompanyRepository;
import com.ssafy.kickcap.exception.ErrorCode;
import com.ssafy.kickcap.exception.RestApiException;
import com.ssafy.kickcap.report.dto.ParkingReportRequestDto;
import com.ssafy.kickcap.report.dto.RedisRequestDto;
import com.ssafy.kickcap.report.entity.Informer;
import com.ssafy.kickcap.report.repository.InformerRepository;
import com.ssafy.kickcap.user.entity.Member;
import com.ssafy.kickcap.user.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class ParkingReportService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final CompanyRepository companyRepository;
    private final MemberRepository memberRepository;
    private final InformerRepository informerRepository;

    public Company fetchUserData(String kickboardNumber) {
        return companyRepository.findByKickboardNumber(kickboardNumber)
                .orElseThrow(() -> new RestApiException(ErrorCode.NOT_FOUND));
    }

    public Member findMember(String name, String phone) {
        System.out.println("findMember 시작");
        return memberRepository.findMemberByNameAndPhone(name, phone)
                .orElseThrow(() -> new RestApiException(ErrorCode.NOT_FOUND));
    }

    private void saveInformer(Long memberId, Member accusedMember, String kickboardNumber) {
        System.out.println("saveInformer 시작");
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

    public void saveParkingReportToRedis(Long memberId, ParkingReportRequestDto requestDto) {
        // 킥보드 업체에 킥보드 번호로 사용자 데이터 요청 - 해당 킥보드를 가장 최근에 사용한 데이터 조회
        Company userData = fetchUserData(requestDto.getKickboardNumber());

        // member 테이블에 이름과 번호가 같은 유저 찾기
        Member member = findMember(userData.getName(), userData.getPhone());

        // 신고자 테이블에 신고자 데이터 저장
        saveInformer(memberId, member, requestDto.getKickboardNumber());

        // RedisRequestDto 만들기 (Redis에 value로 저장하기 위해서)
        RedisRequestDto redisDto = RedisRequestDto.builder()
                .violationType(requestDto.getViolationType())
                .image(requestDto.getImage())
                .description(requestDto.getDescription())
                .kickboardNumber(requestDto.getKickboardNumber())
                .reportTime(requestDto.getReportTime())
                .addr(userData.getAddress())
                .lat(String.valueOf(userData.getLatitude()))
                .lng(String.valueOf(userData.getLongitude()))
                .code(userData.getCode())
                .build();

        // redis key 만들기 P + memberIdx + 킥보드 번호 + lat + lng , ttl : 24시간
        createRedisData(member.getId(), redisDto);
    }

    public void createRedisData(Long memberId, RedisRequestDto redisDto) {
        // Redis key 생성
        String redisKey = "P:" + memberId.toString() +":"+ redisDto.getKickboardNumber()+":" + redisDto.getLat() + ":"
                + redisDto.getLng();

        System.out.println("redisKey : " + redisKey);
        ValueOperations<String, Object> valueOps = redisTemplate.opsForValue();

        // 기존에 Redis에 저장된 키가 있는지 확인
        Object existingData = valueOps.get(redisKey);
        if (existingData != null) {
            System.out.println("이미 있는 키");
        }

        if (existingData == null) {
//            valueOps.set(redisKey, redisDto, 24, TimeUnit.HOURS); // 1시간 TTL
            // 2분 TTL로 수정 - test 용
//            valueOps.set(redisKey, redisDto, 1, TimeUnit.MINUTES);
        }
    }
}
