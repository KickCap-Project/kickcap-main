import React, { useEffect } from 'react';
import styled from 'styled-components';
import Text from '../components/Common/Text';
import { useNavigate, useParams } from 'react-router';
import { socialLogin } from '../lib/api/main-api';
const s = {
  Container: styled.section`
    height: 100%;
    background-color: ${(props) => props.theme.bgColor};
    overflow: auto;
  `,
  MainArea: styled.div`
    width: fit-content;
    margin: 0 auto;
    position: relative;
    bottom: 50%;
    top: 50%;
    transform: translate(0, -50%);
    text-align: center;
  `,
};

const SocialLoginPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  // const code = new URL(window.location.href).searchParams.get('code');
  useEffect(() => {
    const accessToken = new URL(window.location.href).searchParams.get('accessToken');
    const refreshToken = new URL(window.location.href).searchParams.get('refreshToken');
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    const fcmToken = localStorage.getItem('fcmToken');
    socialLogin(
      { fcmToken, refreshToken },
      (resp) => {
        localStorage.setItem('Info', JSON.stringify({ name: resp.data.name, demerit: resp.data.demerit }));
        navigate('/main');
      },
      (error) => {
        alert('잠시 후 다시 시도해주세요.');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate('/');
      },
    );
  }, []);
  return (
    <s.Container>
      <s.MainArea>
        <Text
          children="로그인 중 입니다."
          color="textColor"
          size="20px"
          bold="700"
          display="block"
          width="100%"
          textalian="center"
        />
      </s.MainArea>
    </s.Container>
  );
};

export default SocialLoginPage;
