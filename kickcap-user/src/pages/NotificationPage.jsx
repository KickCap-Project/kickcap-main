import React from 'react';
import styled from 'styled-components';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Notification from './../components/Notification/Notification';

const s = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    min-height: 100vh;
    background-color: ${(props) => props.theme.bgColor};
  `,
  MainArea: styled.div`
    width: 90%;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;
  `,
  NotificationArea: styled.div`
    flex: 1;
    flex-basis: 0;
    width: 100%;
    overflow-y: auto;
  `,
};

const NotificationPage = () => {
  return (
    <s.Container>
      <Header title={'알 림'} />
      <s.MainArea>
        <s.NotificationArea>
          <Notification />
          <Notification />
          <Notification />
          <Notification />
          <Notification />
          <Notification />
          <Notification />
          <Notification />
          <Notification />
          <Notification />
          <Notification />
          <Notification />
          <Notification />
          <Notification />
          <Notification />
          <Notification />
          <Notification />
          <Notification />
          <Notification />
          <Notification />
          <Notification />
          <Notification />
          <Notification />
          <Notification />
        </s.NotificationArea>
      </s.MainArea>
      <Footer />
    </s.Container>
  );
};

export default NotificationPage;
