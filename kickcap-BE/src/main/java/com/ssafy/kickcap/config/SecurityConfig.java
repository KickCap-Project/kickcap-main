package com.ssafy.kickcap.config;

import com.ssafy.kickcap.config.jwt.TokenProvider;
import com.ssafy.kickcap.config.oauth.OAuth2SuccessHandler;
import com.ssafy.kickcap.config.oauth.OAuth2UserCustomService;
import com.ssafy.kickcap.user.repository.DeviceInfoRepository;
import com.ssafy.kickcap.user.service.MemberService;
import com.ssafy.kickcap.user.service.PoliceService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import static org.springframework.boot.autoconfigure.security.servlet.PathRequest.toH2Console;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig { // 실제 인증을 처리하는 시큐리티 설정 파일

    private final UserDetailsService userService;
    private final OAuth2UserCustomService oAuth2UserCustomService;
    private final TokenProvider tokenProvider;
    private final DeviceInfoRepository deviceInfoRepository;
    private final MemberService memberService;

    // 스프링 시큐리티 기능 비활성화
    // 스프링 시큐리티의 모든 기능을 사용하지 않게 설정 = 인증, 인가 서비스를 모든 곳에 적용하진 않는다
    @Bean
    public WebSecurityCustomizer configure() {
        // 정적 리소스만 스프링 시큐리티 사용을 비활성화
        return (web) -> web.ignoring()
//                .requestMatchers(toH2Console())
                .requestMatchers(new AntPathRequestMatcher("/static/**"));
        // static 하위 경로에 있는 리소스와 h2의 데이터를 확인하는데 사용하는 h2-console 하위 url 대상으로 ignore
    }

    // 특정 HTTP 요청에 대한 웹 기반 보안 구성
    // 인증/인가 및 로그인, 로그아웃 관련 설정 가능
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            // 공통 설정
            .csrf(AbstractHttpConfigurer::disable) // csrf 비활성화 -> csrf 공격 방지하기 위해서는 활성화하는 게 좋지만 실습의 편리를 위해 지금은 비활

            // JWT 필터 추가 (일반 로그인 처리)
            .addFilterBefore(tokenAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class)
            
            // URL 접근 권한 설정
            .authorizeRequests(auth -> auth // 특정 경로에 대한 인증, 인가 액세스 설정
                .requestMatchers( // 특정 요청과 일치하는 url에 대한 액세스 설정
                        new AntPathRequestMatcher("/kickcap/police/login"),
                        new AntPathRequestMatcher("/kickcap/login"),
                        new AntPathRequestMatcher("/token/refresh")
                ).permitAll()  // 누구나 접근이 가능하게 (/login, /police-login로 요청이 오면 인증,인가 없이도 접근 가능)
                .requestMatchers("/swagger-ui/**","/v3/api-docs/**").permitAll()
                .requestMatchers(new AntPathRequestMatcher("/api/**")).authenticated()
                .anyRequest().permitAll())
                // anyRequest()은 위에서 성정한 url 이외의 요청에 대해서 설정
                // authenticated()은 별도의 인가는 필요하지 않지만 인증이 성공된 상태여야 접근 가능

            // OAuth2 로그인 설정 (소셜 로그인 처리)
            .oauth2Login(oauth2 -> oauth2
                .loginPage("/index.html")
                    // Authorization 요청과 관련된 상태 저장
                .userInfoEndpoint(userInfoEndpoint -> userInfoEndpoint.userService(oAuth2UserCustomService))
                    // 인증 성공 시 실행할 핸들러
                    .failureUrl("/login?error=true") // 로그인 실패 시 리디렉션할 URL 설정
                    .defaultSuccessUrl("/home", true) // 로그인 성공 시 리디렉션할 기본 URL 설정
                    .successHandler(oAuth2SuccessHandler()))
                // 인증 성공 시 실행할 핸들러도 설정

                .logout(logout -> logout // 로그아웃 설정
                        .logoutSuccessUrl("/index.html") // 로그아웃 완료되었을 떄 이동할 경로 설정
                        .invalidateHttpSession(true) // 로그아웃 이후에 세션에서 전체 삭제할지 여부 설정
                )


            // 예외 처리
            .exceptionHandling(exceptionHandling -> exceptionHandling
                .defaultAuthenticationEntryPointFor(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED), new AntPathRequestMatcher("/api/**")))
            .build();
    }

    // 인증 관리자 관련 설정
    // 사용자 정보를 가져올 서비스를 재정의하거나 인증 방법, 예를 들어 LDAP, JDBC 기반 인증 등을 설정할 때 사용
    @Bean
    public AuthenticationManager authenticationManager(BCryptPasswordEncoder bCryptPasswordEncoder, UserDetailsService userDetailsService) throws Exception {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userService); // 사용자 정보를 가져올 서비스 설정
        // 반드시 UserDetailsService를 상속받은 클래스여야만 함
        authProvider.setPasswordEncoder(bCryptPasswordEncoder); // 비밀번호를 암호화하기 위한 인코더 설정
        return new ProviderManager(authProvider);
    }

    // JWT 관련 설정
    @Bean
    public TokenAuthenticationFilter tokenAuthenticationFilter() {
        return new TokenAuthenticationFilter(tokenProvider);
    }

    // OAuth2 관련 설정
    @Bean
    public OAuth2SuccessHandler oAuth2SuccessHandler() {
        return new OAuth2SuccessHandler(tokenProvider, deviceInfoRepository, memberService);
    }


    // 패스워드 인코더로 사용할 빈 등록
    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }
}

// 인증은 보호된 리소스에 접근하는 것을 허용하기 이전에 등록된 사용자의 신원을 입증하는 과정
// 인가는 특정 부분에 접근할 수 있는지에 확인하는 작업
