import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { basicTheme } from './styles/theme';
import GlobalStyle from './styles/global-styles';
import LoginPage from './pages/LoginPage';
import CrackDownListPage from './pages/CrackDown/CrackDownListPage';
import ReportListPage from './pages/Reported/ReportListPage';
import ComplaintListPage from './pages/Complaint/ComplaintListPage';
import CrackDownDetailPage from './pages/CrackDown/CrackDownDetailPage';
import ReportDetailPage from './pages/Reported/ReportDetailPage';
import ComplaintDetailPage from './pages/Complaint/ComplaintDetailPage';
import PoliceBoardPage from './pages/board/PoliceBoardPage';

const s = {
  Container: styled.div`
    height: 100vh;
    position: relative;
    margin: 0 auto;
    /* border: 3px solid black; */
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
        {/* <CrackDownListPage /> */}
        {/* <ReportListPage /> */}
        {/* <ComplaintListPage /> */}
        {/* <CrackDownDetailPage /> */}
        {/* <ReportDetailPage /> */}
        {/* <ComplaintDetailPage /> */}
        <PoliceBoardPage />
      </s.Container>
    </ThemeProvider>
  );
}

export default App;
