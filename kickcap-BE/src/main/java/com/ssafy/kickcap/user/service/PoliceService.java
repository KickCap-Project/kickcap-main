package com.ssafy.kickcap.user.service;

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
                .orElseThrow(() -> new IllegalArgumentException("Unexpected police"));
    }

    public Police findByEmail(String email) {
        return policeRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Unexpected police"));
    }
}
