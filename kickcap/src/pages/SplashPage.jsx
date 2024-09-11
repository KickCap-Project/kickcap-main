import React from 'react';
import styled from 'styled-components';
import Text from './../components/Common/Text';

import LoadingLogo from './../asset/img/splashLogo.gif';
import Logo from './../asset/img/svg/Logo.svg';

const s = {
  Container: styled.div`
    height: 100%;
    background-color: ${(props) => props.theme.bgColor};
  `,
  MainArea: styled.div`
    width: fit-content;
    margin: 0 auto;
    position: relative;
    // bottom: 50%;
    // top: 50%;
    // transform: translate(0, -50%);
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  `,
  LoadingLogoImg: styled.img`
    margin-top: 40%;
    width: 80%;
  `,
  LogoImg: styled.img`
    width: 64%;
    margin-bottom: 10%;
  `,
};

const SplashPage = () => {
  return (
    <s.Container>
      <s.MainArea>
        <s.LoadingLogoImg src={LoadingLogo} />
        <s.LogoImg src={Logo} />

        <Text size={'20px'} bold={'800'}>
          로딩 중 입니다.
        </Text>
        <Text size={'20px'} bold={'800'}>
          잠시만 기다려 주세요.
        </Text>
      </s.MainArea>
    </s.Container>
  );
};

export default SplashPage;
