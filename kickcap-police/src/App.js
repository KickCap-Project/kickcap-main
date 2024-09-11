import React from 'react';
import logo from './logo.svg';
import './App.css';
import styled, { ThemeProvider } from 'styled-components';
import { basicTheme } from './styles/theme';
import GlobalStyle from './styles/global-styles';
import LoginPage from './pages/LoginPage';
import CrackDownListPage from './pages/CrackDown/CrackDownListPage';

const s = {
  Container: styled.div`
    height: 100vh;
    position: relative;
    margin: 0 auto;
    border: 3px solid black;
    background-color: ${(props) => props.theme.bgColor};
    overflow: auto;
  `,
};
function App() {
  return (
    <ThemeProvider theme={basicTheme}>
      <GlobalStyle />
      <s.Container>
        {/* <LoginPage /> */}
        <CrackDownListPage />
      </s.Container>
    </ThemeProvider>
  );
}

export default App;
