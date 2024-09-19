import React from 'react';
import styled from 'styled-components';
import LogoSvg from './../asset/img/svg/Logo.svg';
import NotificationOffSvg from './../asset/img/svg/notificationOff.svg';
import NotificationOnSvg from './../asset/img/svg/notificationOn.svg';
import SettingSvg from './../asset/img/svg/setting.svg';
import { useAppDispatch } from '../lib/hook/useReduxHook';
import { modalActions } from '../store/modal';

const notification = false;

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
  `,
  ButtonSetting: styled.img`
    height: 60%;
  `,
};

const Header = () => {
  const dispatch = useAppDispatch();
  const handleOpenMainModal = (isFlag) => {
    dispatch(modalActions.ChangeIsMain(isFlag));
  };
  return (
    <s.HeaderArea>
      <s.Logo src={LogoSvg} />
      <s.ButtonArea>
        {notification ? (
          <s.ButtonNotification src={NotificationOnSvg} />
        ) : (
          <s.ButtonNotification src={NotificationOffSvg} />
        )}
        <s.ButtonSetting src={SettingSvg} onClick={() => handleOpenMainModal(true)} />
      </s.ButtonArea>
    </s.HeaderArea>
  );
};

export default Header;
