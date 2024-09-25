package com.ssafy.kickcap.report.service;

import com.ssafy.kickcap.exception.ErrorCode;
import com.ssafy.kickcap.exception.RestApiException;
import com.ssafy.kickcap.report.dto.ReportListResponseDto;
import com.ssafy.kickcap.report.entity.ApproveStatus;
import com.ssafy.kickcap.report.entity.Report;
import com.ssafy.kickcap.report.repository.ReportRepository;
import com.ssafy.kickcap.user.entity.Police;
import com.ssafy.kickcap.violationtype.entity.ViolationType;
import com.ssafy.kickcap.violationtype.repository.ViolationTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;
    private final ViolationTypeRepository violationTypeRepository;
    private static final int DEFAULT_PAGE_SIZE = 10;
    private static final List<ApproveStatus> COMPLETED_STATUSES = Arrays.asList(ApproveStatus.APPROVED, ApproveStatus.REJECTED);

    public Long getUnApprovedReportCount(Long violationTypeId, Police police) {
        ViolationType violationType = violationTypeRepository.findById(violationTypeId).orElseThrow(() -> new RestApiException(ErrorCode.NOT_FOUND));
        return reportRepository.countByViolationTypeAndApproveStatusAndPolice(violationType, ApproveStatus.UNAPPROVED, police);
    }

    public Long getCompletedReportCount(Long violationTypeId, Police police) {
        ViolationType violationType = violationTypeRepository.findById(violationTypeId).orElseThrow(() -> new RestApiException(ErrorCode.NOT_FOUND));
        return reportRepository.countCompletedReports(violationType, COMPLETED_STATUSES, police);
    }

    public List<ReportListResponseDto> getUnApprovedReports(Long violationTypeId, Police police, int pageNo) {
        // 페이지 요청 객체 생성 (첫 페이지는 0부터 시작)
        Pageable pageable = PageRequest.of(pageNo - 1, DEFAULT_PAGE_SIZE); // 페이지 크기: 10

        ViolationType violationType = violationTypeRepository.findById(violationTypeId).orElseThrow(() -> new RestApiException(ErrorCode.NOT_FOUND));

        // 리포트를 페이지네이션하여 조회
        Page<Report> reportPage = reportRepository.findByViolationTypeAndApproveStatusAndPoliceOrderByIdDesc(violationType, ApproveStatus.UNAPPROVED, police, pageable);

        return reportPage.getContent().stream()
                .map(ReportListResponseDto::fromEntity)
                .collect(Collectors.toList()); // DTO 리스트 반환
    }

    public List<ReportListResponseDto> getCompletedReports(Long violationTypeId, Police police, int pageNo) {
        // 페이지 요청 객체 생성 (첫 페이지는 0부터 시작)
        Pageable pageable = PageRequest.of(pageNo - 1, DEFAULT_PAGE_SIZE); // 페이지 크기: 10

        ViolationType violationType = violationTypeRepository.findById(violationTypeId).orElseThrow(() -> new RestApiException(ErrorCode.NOT_FOUND));

        Page<Report> reportPage = reportRepository.findByViolationTypeAndApproveStatusInAndPoliceOrderByIdDesc(violationType, COMPLETED_STATUSES, police, pageable);

        return reportPage.getContent().stream()
                .map(ReportListResponseDto::fromEntity)
                .collect(Collectors.toList()); // DTO 리스트 반환
    }
}
