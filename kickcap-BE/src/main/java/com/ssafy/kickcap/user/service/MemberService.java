package com.ssafy.kickcap.user.service;

import com.ssafy.kickcap.user.dto.RegisterDto;
import com.ssafy.kickcap.user.dto.TokenRequest;
import com.ssafy.kickcap.user.entity.Member;
import com.ssafy.kickcap.user.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class MemberService {
    private final MemberRepository memberRepository;
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

}
