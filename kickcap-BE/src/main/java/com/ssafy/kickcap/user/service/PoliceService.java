package com.ssafy.kickcap.user.service;

import com.ssafy.kickcap.exception.ErrorCode;
import com.ssafy.kickcap.exception.RestApiException;
import com.ssafy.kickcap.user.entity.Police;
import com.ssafy.kickcap.user.repository.PoliceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class PoliceService {

    private final PoliceRepository policeRepository;

    public Police findById(Long userId) {
        return policeRepository.findById(userId)
                .orElseThrow(() -> new RestApiException(ErrorCode.NOT_FOUND));
    }

    public Police findByPoliceId(String policeId) {
        return policeRepository.findByPoliceId(policeId)
                .orElseThrow(() -> new RestApiException(ErrorCode.NOT_FOUND));
    }
}
