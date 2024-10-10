import React, { useEffect } from 'react';
import styled from 'styled-components';
import Text from './../components/Common/Text';
import { ReactComponent as police } from '../asset/svg/police.svg';
import { requestPermission } from '../firebaseCloudMessaging';
import { useNavigate } from 'react-router';
import IconSvg from '../components/Common/IconSvg';

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
    if (fcmToken) {
      localStorage.setItem('fcmToken', fcmToken);
      navigate('/login');
    }
  };
  useEffect(() => {
    setFcmToken();
  }, []);
  return (
    <s.Container>
      <s.MainArea>
        <IconSvg Ico={police} width={'250px'} display={'block'} margin={'20px auto'} />
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
