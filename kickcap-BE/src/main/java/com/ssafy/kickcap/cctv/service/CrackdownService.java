package com.ssafy.kickcap.cctv.service;

import com.ssafy.kickcap.bill.entity.Bill;
import com.ssafy.kickcap.bill.entity.ReportType;
import com.ssafy.kickcap.bill.repository.BillRepository;
import com.ssafy.kickcap.cctv.dto.CrackdownListResponseDto;
import com.ssafy.kickcap.cctv.dto.CrackdownResponseDto;
import com.ssafy.kickcap.cctv.entity.CCTVInfo;
import com.ssafy.kickcap.cctv.entity.Crackdown;
import com.ssafy.kickcap.cctv.repository.CctvInfoRepository;
import com.ssafy.kickcap.cctv.repository.CrackdownRepository;
import com.ssafy.kickcap.exception.ErrorCode;
import com.ssafy.kickcap.exception.RestApiException;
import com.ssafy.kickcap.report.entity.Report;
import com.ssafy.kickcap.report.repository.ReportRepository;
import com.ssafy.kickcap.user.entity.Member;
import com.ssafy.kickcap.user.entity.Police;
import com.ssafy.kickcap.user.repository.MemberRepository;
import com.ssafy.kickcap.user.repository.PoliceRepository;
import com.ssafy.kickcap.violationtype.entity.ViolationType;
import com.ssafy.kickcap.violationtype.repository.ViolationTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CrackdownService {

    private final CrackdownRepository crackdownRepository;
    private final ViolationTypeRepository violationTypeRepository;
    private final CctvInfoRepository cctvInfoRepository;
    private final BillRepository billRepository;
    private final MemberRepository memberRepository;
    private final ReportRepository reportRepository;

    private static final int DEFAULT_PAGE_SIZE = 10;
    private final PoliceRepository policeRepository;

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

    public CrackdownResponseDto getCrackdown(Police police, Long crackdownId) {

        Crackdown crackdown = crackdownRepository.findById(crackdownId)
                .orElseThrow(() -> new RestApiException(ErrorCode.NOT_FOUND));

        CCTVInfo cctvInfo = cctvInfoRepository.findById(crackdown.getCctvInfo().getId())
                .orElseThrow(() -> new RestApiException(ErrorCode.NOT_FOUND));


        Member member = memberRepository.findById(crackdown.getMember().getId())
                .orElseThrow(() -> new RestApiException(ErrorCode.NOT_FOUND));

        // 최근 member의 고지서 조회
        Optional<Bill> optionalBill = billRepository.findFirstByMemberIdOrderByCreatedAtDesc(member.getId());

        String history;
        String image = "";

        // 고지서가 존재하는 경우
        if (optionalBill.isPresent()) {
            Bill bill = optionalBill.get();
            history = getHistory(bill);

            if (bill.getReportType().equals(ReportType.USER)) {
                Report billReport = reportRepository.findById(bill.getReportId()).orElseThrow(() -> new RestApiException(ErrorCode.NOT_FOUND));
                image = billReport.getImageSrc();
            }
            else {
                Crackdown billCrackdown = crackdownRepository.findById(bill.getReportId()).orElseThrow(() -> new RestApiException(ErrorCode.NOT_FOUND));
                image = billCrackdown.getImageSrc();
            }

        } else {
            // 고지서 조회안될 경우
            history = ""; // 빈 문자열로 초기화
        }

        return CrackdownResponseDto.builder()
                .idx(crackdownId)
                .crackAddr(cctvInfo.getLocation())
                .violationType(crackdown.getViolationType().getName())
                .date(crackdown.getCreatedAt().toString())
                .cctvIdx(cctvInfo.getId())
                .img(image)
                .kick(crackdown.getKickboardNumber())
                .name(member.getName())
                .phone(member.getPhone())
                .demerit(member.getDemerit())
                .history(history)
                .build();
    }

    private String getHistory(Bill bill) {
        if (bill.getReportType().equals(ReportType.USER)) {
            Report billReport = reportRepository.findById(bill.getReportId())
                    .orElseThrow(() -> new RestApiException(ErrorCode.NOT_FOUND));

            return formatHistory(billReport.getReportTime(), billReport.getViolationType().getName());
        } else {
            Crackdown billCrackdown = crackdownRepository.findById(bill.getReportId())
                    .orElseThrow(() -> new RestApiException(ErrorCode.NOT_FOUND));

            return formatHistory(billCrackdown.getCrackdownTime(), billCrackdown.getViolationType().getName());
        }
    }

    private String formatHistory(ZonedDateTime reportTime, String violationTypeName) {
        // 원하는 형식으로 포맷팅
        System.out.println("reportTime: " + reportTime);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy.MM.dd");
        String formattedDate = reportTime.format(formatter);
        return formattedDate + " / " + violationTypeName;
    }
}
