package com.ssafy.kickcap.config.jwt;

import com.ssafy.kickcap.user.entity.Member;
import com.ssafy.kickcap.user.entity.Police;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Header;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Collections;
import java.util.Date;
import java.util.Set;

@RequiredArgsConstructor
@Service
public class TokenProvider {
    // 토큰을 생성하고 올바른 토큰인지 유효성을 검사하고, 토큰에서 필요한 정보를 가져오는 클래스
    private final JwtProperties jwtProperties;

    public String generatePoliceToken(Police police, Duration expiredAt) {
        Date now = new Date();
        return makeToken(new Date(now.getTime()+expiredAt.toMillis()), police.getPoliceId(), police.getId());
    }

    public String generateMemberToken(Member member, Duration expiredAt) {
        Date now = new Date();
        return makeToken(new Date(now.getTime()+expiredAt.toMillis()), member.getEmail(), member.getId());
    }

    // JWT 토큰 생성 메서드
    private String makeToken(Date expiry, String email, Long id) { // 인자는 만료 시간, 유저 정보 받음
        Date now = new Date();

        return Jwts.builder()
                .setHeaderParam(Header.TYPE, Header.JWT_TYPE) // 헤더 typ 타입 : JWT
                // 내용 iss 발급자 : minipeach0923@gmail.com (propertise 파일에서 설정한 값)
                .setIssuer(jwtProperties.getIssuer())
                .setIssuedAt(now) // 내용 iat 발급일시 : 현재 시간
                .setExpiration(expiry) // 내용 exp 만료 일시 : expiry 멤버 변숫값
                .setSubject(email) // 내용 sub 토큰 제목 : 유저의 이메일
                .claim("id",id) // 클레임 id : 유저 ID
                // 서명 : 비밀값과 함께 해시값을 HS256 방식으로 암호화
                .signWith(SignatureAlgorithm.HS256, jwtProperties.getSecretKey())
                .compact();
    }

    // JWT 토큰 유효성 검증 메서드
    public boolean validToken(String token) {
        try{
            // 프로퍼티즈 파일에 선언한 비밀값과 함께 토큰 복호화 진행
            Jwts.parser()
                    .setSigningKey(jwtProperties.getSecretKey()) // 비밀값으로 복호화
                    .parseClaimsJws(token);

            return true;
        } catch (Exception e) { // 복호화 과정에서 에러가 나면 유효하지 않은 토큰
            return false;
        }
    }

    // 토큰 기반으로 인증 정보를 가져오는 메서드
    public Authentication getAuthentication(String token) {
        Claims claims = getClaims(token);
        Set<SimpleGrantedAuthority> authorities = Collections.singleton(new SimpleGrantedAuthority("ROLE_USER"));

        // 클레임 정보를 반환받아 사용자 이메일이 들어 있는 토큰 제목 sub와 토큰 기반으로 인증 정보 생성
        return new UsernamePasswordAuthenticationToken(new org.springframework.
                security.core.userdetails.User(claims.getSubject
                (), "", authorities),token, authorities);
    }

    // 토큰 기반으로 유저 ID를 가져오는 메서드
    public Long getUserId(String token) {
        Claims claims = getClaims(token);
        return claims.get("id",Long.class);
    }

    // 비밀값으로 토큰을 복호화한 다음 클레임을 가져오는 메서드
    private Claims getClaims(String token) {
        return Jwts.parser() // 클레임 조회
                .setSigningKey(jwtProperties.getSecretKey())
                .parseClaimsJws(token)
                .getBody();
    }
}
