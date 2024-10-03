import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import LogoSvg from './../asset/img/svg/Logo.svg';
import NotificationOffSvg from './../asset/img/svg/notificationOff.svg';
import NotificationOnSvg from './../asset/img/svg/notificationOn.svg';
import SettingSvg from './../asset/img/svg/setting.svg';
import logoutImg from '../asset/img/svg/logout.svg';
import { useAppDispatch } from '../lib/hook/useReduxHook';
import { modalActions } from '../store/modal';
import { useNavigate } from 'react-router';
import { logout } from '../lib/api/main-api';

import { checkNotification } from '../lib/api/notification-api';

const s = {
  HeaderArea: styled.div`
    width: 100%;
    height: 7vh;
    min-height: 50px;
    border-bottom: 1px solid #d3d3d3;
    background-color: ${(props) => props.theme.AreaColor};
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  `,
  Logo: styled.img`
    position: absolute;
    height: 70%;
    left: 5%;
  `,
  ButtonArea: styled.div`
    position: absolute;
    display: flex;
    justify-content: end;
    align-items: center;
    width: 50%;
    height: 100%;
    right: 5%;
  `,
  ButtonNotification: styled.img`
    height: 60%;
    margin-right: 5%;
    cursor: pointer;
  `,
  ButtonSetting: styled.img`
    height: 60%;
    cursor: pointer;
  `,
};

const Header = () => {
  const [notification, setNotification] = useState(false);

  const dispatch = useAppDispatch();
  const handleOpenMainModal = (isFlag) => {
    dispatch(modalActions.ChangeIsMain(isFlag));
  };
  const navigate = useNavigate();
  const handleMovePage = (path) => {
    navigate(path);
  };

  const handleLogout = async () => {
    const fcmToken = localStorage.getItem('fcmToken');
    await logout(
      fcmToken,
      (resp) => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('Info');
        navigate('/login');
      },
      (error) => {
        alert('잠시 후 다시 시도해주세요.');
      },
    );
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      const data = await checkNotification();

      if (data) {
        setNotification(data);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <s.HeaderArea>
      <s.Logo src={LogoSvg} />
      <s.ButtonArea>
        {notification ? (
          <s.ButtonNotification src={NotificationOnSvg} onClick={() => handleMovePage('notification')} />
        ) : (
          <s.ButtonNotification src={NotificationOffSvg} onClick={() => handleMovePage('notification')} />
        )}
        {/* <s.ButtonSetting src={SettingSvg} onClick={() => handleOpenMainModal(true)} /> */}
        <s.ButtonSetting src={logoutImg} onClick={handleLogout} />
      </s.ButtonArea>
    </s.HeaderArea>
  );
};

export default Header;
