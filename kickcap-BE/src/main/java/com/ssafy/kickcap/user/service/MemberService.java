package com.ssafy.kickcap.user.service;

import com.ssafy.kickcap.bill.entity.Bill;
import com.ssafy.kickcap.bill.repository.BillRepository;
import com.ssafy.kickcap.exception.ErrorCode;
import com.ssafy.kickcap.exception.RestApiException;
import com.ssafy.kickcap.report.entity.Report;
import com.ssafy.kickcap.report.repository.ReportRepository;
import com.ssafy.kickcap.user.dto.MemberInfoResponseDto;
import com.ssafy.kickcap.user.dto.RegisterDto;
import com.ssafy.kickcap.user.entity.Member;
import com.ssafy.kickcap.user.repository.MemberRepository;
import com.ssafy.kickcap.violationtype.entity.ViolationType;
import com.ssafy.kickcap.violationtype.repository.ViolationTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class MemberService {
    private final MemberRepository memberRepository;
    private final ReportRepository reportRepository;
    private final BillRepository billRepository;
    private final ViolationTypeRepository violationTypeRepository;

    public Member findByEmail(String email) {
        return memberRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Unexpected member"));
    }

    public Member findById(Long userId) {
        return memberRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Unexpected member"));
    }

    public void updateNameAndPhone(Long userId, RegisterDto registerDto) {
        Member member = memberRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Unexpected member"));
        member.update(registerDto.getName(), registerDto.getPhone());
        memberRepository.save(member);
    }

    public MemberInfoResponseDto getMemberInfo(Long memberId, Long reportId) {

        Member member = memberRepository.findById(memberId).orElseThrow(() -> new RestApiException(ErrorCode.NOT_FOUND));

        // 킥보드 번호랑 최근 단속 정보- 가장 최근 날라온 고지서의 신고시간? (날짜, violationType 이름)
        Report report = reportRepository.findById(reportId).orElseThrow(() -> new RestApiException(ErrorCode.NOT_FOUND));

        if(report.getMember().getId() != memberId){
            throw new RestApiException(ErrorCode.FORBIDDEN_ACCESS);
        }
        String kickboardNumber = report.getKickboardNumber();

        // 최근 member의 고지서 조회
        Optional<Bill> optionalBill = billRepository.findFirstByMemberIdOrderByCreatedAtDesc(memberId);

        String history;

        // 고지서가 존재하는 경우
        if (optionalBill.isPresent()) {
            Bill bill = optionalBill.get();
            Report billReport = reportRepository.findById(bill.getReportId()).orElseThrow(() -> new RestApiException(ErrorCode.NOT_FOUND));
            ZonedDateTime reportTime = billReport.getReportTime();

            // 원하는 형식으로 포맷팅
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy.MM.dd");
            String formattedDate = reportTime.format(formatter);

            String violationTypeName = billReport.getViolationType().getName();

            // history 문자열 생성
            history = formattedDate + " / " + violationTypeName ;

        } else {
            // 고지서 조회안될경우
            history = ""; // 빈 문자열로 초기화
        }

        return  MemberInfoResponseDto.builder()
                .kick(kickboardNumber)
                .name(member.getName())
                .phone(member.getPhone())
                .demerit(member.getDemerit())
                .history(history)
                .build();
    }

}