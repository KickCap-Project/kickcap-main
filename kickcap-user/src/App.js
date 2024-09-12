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

import ViolationListPage from './pages/violation/ViolationListPage';
import ViolationDetailPage from './pages/violation/ViolationDetailPage';
import SuccessPage from './pages/SuccessPage';

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
        <ViolationDetailPage />
      </s.Container>
    </ThemeProvider>
  );
}

export default App;
