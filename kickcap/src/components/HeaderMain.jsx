import React from 'react';
import styled from 'styled-components';
import LogoSvg from './../asset/img/svg/Logo.svg';
import NotificationOffSvg from './../asset/img/svg/notificationOff.svg';
import NotificationOnSvg from './../asset/img/svg/notificationOn.svg';
import SettingSvg from './../asset/img/svg/setting.svg';

const notification = false;

const s = {
  HeaderArea: styled.div`
    width: 100%;
    height: 7%;
    border-bottom: 1px solid #d3d3d3;
    background-color: ${(props) => props.theme.AreaColor};
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  `,
  Logo: styled.img`
    position: absolute;
    height: 75%;
    left: 1rem;
  `,
  ButtonNotification: styled.img`
    position: absolute;
    right: 3rem;
  `,
  ButtonSetting: styled.img`
    position: absolute;
    right: 1rem;
  `,
};

const Header = () => {
  return (
    <s.HeaderArea>
      <s.Logo src={LogoSvg} />
      {notification ? (
        <s.ButtonNotification src={NotificationOnSvg} />
      ) : (
        <s.ButtonNotification src={NotificationOffSvg} />
      )}
      <s.ButtonSetting src={SettingSvg} />
    </s.HeaderArea>
  );
};

export default Header;
