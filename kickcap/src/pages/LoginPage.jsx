import React from 'react';
import styled from 'styled-components';
import LoginButton from './../components/LoginButton';

import CharacterLogo from './../asset/img/svg/Character.svg';
import Logo from './../asset/img/svg/Logo.svg';
import kakao from './../asset/img/login/kakao.png';
import naver from './../asset/img/login/naver.png';
import google from './../asset/img/login/google.png';

const s = {
  Container: styled.div`
    height: 100%;
    background-color: ${(props) => props.theme.bgColor};
  `,
  MainArea: styled.div`
    width: 100%;
    margin: 0 auto;
    position: relative;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  `,
  CharacterLogoImg: styled.img`
    margin-top: 40%;
    width: 80%;
  `,
  LogoImg: styled.img`
    width: 64%;
    margin-bottom: 10%;
  `,
  ButtonArea: styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  `,
};

const SplashPage = () => {
  return (
    <s.Container>
      <s.MainArea>
        <s.CharacterLogoImg src={CharacterLogo} />
        <s.LogoImg src={Logo} />
        <s.ButtonArea>
          <LoginButton title="카카오 로그인" imgSrc={kakao} color="#000000" bgcolor="#FDE500" />
          <LoginButton title="네이버 로그인" imgSrc={naver} color="#FFFFFF" bgcolor="#03C75A" />
          <LoginButton title="구글 로그인" imgSrc={google} color="#000000" bgcolor="#FFFFFF" />
        </s.ButtonArea>
      </s.MainArea>
    </s.Container>
  );
};

export default SplashPage;
