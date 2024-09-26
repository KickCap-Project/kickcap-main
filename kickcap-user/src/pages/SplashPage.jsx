import React, { useEffect } from 'react';
import styled from 'styled-components';
import Text from './../components/Common/Text';

import LoadingLogo from './../asset/img/splashLogo.gif';
import Logo from './../asset/img/svg/Logo.svg';
import { useNavigate } from 'react-router';
import { requestPermission } from '../firebaseCloudMessaging';

const s = {
  Container: styled.div`
    height: 100%;
    background-color: ${(props) => props.theme.bgColor};
  `,
  MainArea: styled.div`
    width: 100%;
    height: 100%;
    margin: 0 auto;
    position: relative;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  `,
  LoadingLogoImg: styled.img`
    width: 80%;
    max-width: 400px;
  `,
  LogoImg: styled.img`
    width: 64%;
    margin-bottom: 10%;
  `,
};

const SplashPage = () => {
  const navigate = useNavigate();

  const setFcmToken = async () => {
    const fcmToken = await requestPermission();
    localStorage.setItem('fcmToken', fcmToken);
    navigate('/login');
  };
  useEffect(() => {
    setFcmToken();
  }, []);
  return (
    <s.Container>
      <s.MainArea>
        <s.LoadingLogoImg src={LoadingLogo} />
        <Text size={'20px'} bold={'800'} margin={'10px auto'}>
          로딩 중...
        </Text>
        <Text size={'20px'} bold={'800'}>
          잠시만 기다려 주세요.
        </Text>
      </s.MainArea>
    </s.Container>
  );
};

export default SplashPage;
