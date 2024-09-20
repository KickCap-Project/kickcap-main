import React from 'react';
import styled from 'styled-components';
import { ThemeProvider } from 'styled-components';
import { basicTheme } from './styles/theme';
import GlobalStyle from './styles/global-styles';
import Button from './components/Common/Button';
import { ReactComponent as test } from './asset/img/svg/noPark.svg';

import SplashPage from './pages/SplashPage';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';

import ViolationListPage from './pages/Violation/ViolationListPage';
import ViolationDetailPage from './pages/Violation/ViolationDetailPage';
import ViolationEducationPage from './pages/Violation/ViolationEducationPage';
import ViolationObjectionPage from './pages/Violation/ViolationObjectionPage';

import ObjectionListPage from './pages/Objection/ObjectionListPage';
import ObjectionDetailPage from './pages/Objection/ObjectionDetailPage';

import OneClickReportPage from './pages/OneClickReport/OneClickReportPage';
import SuccessPage from './pages/SuccessPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { PrivateRoute, PublicRoute } from './pages/IsLoginPage';
import NotificationPage from './pages/NotificationPage';
import ChatPage from './pages/ChatPage';

const s = {
  Background: styled.section`
    width: 100vw;
    height: 100%;
    background-color: #f1f3f5;
    position: absolute;
    font-size: 80px;
    line-height: 70px;
  `,
  Container: styled.div`
    max-width: 800px;
    height: 100vh;
    position: relative;
    margin: 0 auto;
    background-color: ${(props) => props.theme.bgColor};
    overflow: auto;
  `,
  test: styled.div`
    width: 100%;
    height: 100%;
    background-color: yellow;
    border: 1px solid red;
    display: flex;
  `,
  text: styled.div`
    font-size: 30px;
    font-weight: 700;
    border: 1px solid red;
    text-align: right;
  `,
  subText: styled.div`
    font-size: 15px;
    font-weight: 600;
    border: 1px solid red;
    text-align: right;
  `,
};

function App() {
  return (
    <ThemeProvider theme={basicTheme}>
      <GlobalStyle />
      <s.Background />
      <s.Container>
        <BrowserRouter>
          <Routes>
            <Route element={<PublicRoute />}>
              <Route path="/" element={<SplashPage />} />
              <Route path="/login" element={<LoginPage />} />
            </Route>
            <Route element={<PrivateRoute />}>
              <Route path="/main">
                <Route index element={<MainPage />} />
                <Route path="notification" element={<NotificationPage />} />
                <Route path="chat" element={<ChatPage />} />
              </Route>
              <Route path="/violation">
                <Route index element={<ViolationListPage />} />
                <Route path="detail" element={<ViolationDetailPage />} />
                <Route path="objection">
                  <Route index element={<ViolationObjectionPage />} />
                  <Route path="success" element={<SuccessPage message="objection" />} />
                </Route>
              </Route>
              <Route path="/sos" element={<OneClickReportPage />} />
              <Route path="/report" />
              <Route path="/objection">
                <Route index element={<ObjectionListPage />} />
                <Route path="detail" element={<ObjectionDetailPage />} />
              </Route>
            </Route>
            <Route />
          </Routes>
        </BrowserRouter>
      </s.Container>
    </ThemeProvider>
  );
}

export default App;
