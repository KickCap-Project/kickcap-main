import React, { useEffect } from 'react';
import styled from 'styled-components';
import logo from '../asset/svg/logo.svg';
import Text from './../components/Common/Text';
import { requestPermission } from '../firebaseCloudMessaging';
import { useNavigate } from 'react-router';

const s = {
  Container: styled.div`
    height: 100%;
    background-color: ${(props) => props.theme.bgColor};
  `,
  MainArea: styled.div`
    width: fit-content;
    margin: 0 auto;
    position: relative;
    bottom: 50%;
    top: 50%;
    transform: translate(0, -50%);
    text-align: center;
    display: flex;
    flex-direction: column;
  `,
  Img: styled.img`
    width: 100%;
    margin: 20px auto;
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
        <s.Img src={logo} />
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
