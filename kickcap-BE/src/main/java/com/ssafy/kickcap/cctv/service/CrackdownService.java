package com.ssafy.kickcap.cctv.service;

import com.ssafy.kickcap.cctv.dto.CrackdownListResponseDto;
import com.ssafy.kickcap.cctv.entity.CCTVInfo;
import com.ssafy.kickcap.cctv.entity.Crackdown;
import com.ssafy.kickcap.cctv.repository.CrackdownRepository;
import com.ssafy.kickcap.exception.ErrorCode;
import com.ssafy.kickcap.exception.RestApiException;
import com.ssafy.kickcap.user.entity.Police;
import com.ssafy.kickcap.violationtype.entity.ViolationType;
import com.ssafy.kickcap.violationtype.repository.ViolationTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CrackdownService {

    private final CrackdownRepository crackdownRepository;
    private final ViolationTypeRepository violationTypeRepository;

    private static final int DEFAULT_PAGE_SIZE = 10;

    public List<CrackdownListResponseDto> getCrackdownList(Police police, int pageNo, Long violationTypeId) {
        // 페이지 요청 객체 생성 (첫 페이지는 0부터 시작)
        Pageable pageable = PageRequest.of(pageNo - 1, DEFAULT_PAGE_SIZE); // 페이지 크기: 10

        ViolationType type = violationTypeRepository.findById(violationTypeId)
                .orElseThrow(() -> new RestApiException(ErrorCode.NOT_FOUND));

        Page<Crackdown> crackdownPage = crackdownRepository.findCrackdownsByPoliceIdAndViolationType(police.getId(), type, pageable);

        // Crackdown 데이터를 DTO로 변환
        return crackdownPage.stream()
                .map(crackdown -> {
                    CCTVInfo cctvInfo = crackdown.getCctvInfo(); // CCTV 정보 가져오기
                    ViolationType violationType = crackdown.getViolationType(); // 위반 유형 가져오기

                    return CrackdownListResponseDto.builder()
                            .idx(crackdown.getId())
                            .addr(cctvInfo.getLocation()) // CCTV 주소
                            .type(violationType.getName()) // 위반 유형 이름
                            .date(crackdown.getCreatedAt().toString()) // 단속 일자
                            .build();

                })
                .collect(Collectors.toList());
    }

    public Long getCrackdownCount(Police police, Long violationTypeId) {
        ViolationType violationType = violationTypeRepository.findById(violationTypeId).orElseThrow(() -> new RestApiException(ErrorCode.NOT_FOUND));
        return crackdownRepository.countByPoliceAndViolationType(police.getId(), violationType);
    }
}
