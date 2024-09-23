package com.ssafy.kickcap.user.service;

import com.ssafy.kickcap.user.entity.Police;
import com.ssafy.kickcap.user.repository.PoliceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class UserDetailService implements UserDetailsService {
    private final PoliceRepository policeRepository;

    // 사용자 이름(email)으로 사용자의 정보를 가져오는 메서드
    @Override
    public Police loadUserByUsername(String email) {
        return policeRepository.findByPoliceId(email)
                .orElseThrow(() -> new IllegalArgumentException((email)));
    }
}
