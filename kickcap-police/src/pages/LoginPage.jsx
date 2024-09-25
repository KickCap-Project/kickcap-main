import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ReactComponent as logo } from '../asset/svg/logo.svg';
import { ReactComponent as police } from '../asset/svg/police.svg';
import IconSvg from './../components/Common/IconSvg';
import Input from './../components/Common/Input';
import Button from './../components/Common/Button';
import Text from './../components/Common/Text';
import { useNavigate } from 'react-router';
import { requestPermission } from '../firebaseCloudMessaging';
import { policeLogin } from './../lib/api/main-api';

const s = {
  Container: styled.main`
    height: 100%;
    background-color: ${(props) => props.theme.bgColor};
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow-y: auto;
  `,
  LoginArea: styled.div`
    width: 50%;
    margin: 0 auto;
    padding: 10px;
  `,
  FormArea: styled.div`
    width: 70%;
    margin: 30px auto;
  `,
  FooterArea: styled.footer`
    background-color: ${(props) => props.theme.AreaColor};
    height: 20%;
    max-height: 100px;
    display: flex;
    justify-content: space-around;
    align-items: center;
  `,
  IconArea: styled.div`
    width: 200px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  `,
  TextArea: styled.div`
    width: 400px;
  `,
};

const LoginPage = () => {
  const navigate = useNavigate();
  const fcmToken = sessionStorage.getItem('fcmToken');
  const [login, setLogin] = useState({
    policeId: '',
    password: '',
    fcmToken,
  });

  // const setFcmToken = async () => {
  //   const fcmToken = await requestPermission();
  //   sessionStorage.setItem('fcmToken', fcmToken);
  //   setLogin({ ...login, fcmToken });
  // };
  // useEffect(() => {
  //   setFcmToken();
  // }, []);

  const handleChangeLogin = (e) => {
    setLogin({
      ...login,
      [e.target.name]: e.target.value,
    });
  };
  const handleLogin = async () => {
    // localStorage.setItem('accessToken', 'test');
    // console.log(login);

    await policeLogin(
      login,
      (resp) => {
        sessionStorage.setItem('police', resp.data.name);
        sessionStorage.setItem('accessToken', resp.data.accessToken);
        sessionStorage.setItem('refreshToken', resp.data.refreshToken);
        navigate('/');
      },
      (error) => {
        alert('아이디, 비밀번호를 확인해주세요.');
      },
    );
  };
  return (
    <>
      <s.Container>
        <s.LoginArea>
          <IconSvg Ico={logo} width={'250px'} display={'block'} margin={'0 auto'} />
          <s.FormArea>
            <Input
              width={'100%'}
              height={'40px'}
              placeholder={'아이디를 입력해주세요.'}
              display={'block'}
              name={'policeId'}
              onChange={handleChangeLogin}
              value={login.policeId}
            />
            <Input
              type={'password'}
              width={'100%'}
              height={'40px'}
              placeholder={'비밀번호를 입력해주세요.'}
              display={'block'}
              margin={'10px auto 30px'}
              name={'password'}
              onChange={handleChangeLogin}
              value={login.password}
            />
            <Button width={'100%'} height={'40px'} display={'block'} onClick={handleLogin}>
              로 그 인
            </Button>
          </s.FormArea>
        </s.LoginArea>

        <s.FooterArea>
          <s.IconArea>
            <IconSvg Ico={police} width={'60px'} display={'block'} margin={'0 auto'} />
          </s.IconArea>
          <s.TextArea>
            <Text
              children={'킥보드 자동화 단속 시스템'}
              textalian={'center'}
              margin={'0 auto 20px'}
              display={'block'}
              size={'20px'}
              bold={'700'}
              color={'mainColor'}
            />
            <Text
              children={'ⓒ 2024. KickCap All rights reserved.'}
              textalian={'center'}
              margin={'0 auto'}
              display={'block'}
              size={'10px'}
              bold={'700'}
              color={'mainColor'}
            />
          </s.TextArea>
          <s.IconArea></s.IconArea>
        </s.FooterArea>
      </s.Container>
    </>
  );
};

export default LoginPage;
