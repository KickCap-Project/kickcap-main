package com.ssafy.kickcap.user.repository;

import com.ssafy.kickcap.user.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {
    Optional<Member> findByEmail(String email);
    // email로 사용자 정보를 가져옴


    Optional<Member> findMemberByNameAndPhone(String name, String phone);
}
