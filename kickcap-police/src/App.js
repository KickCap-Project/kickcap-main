import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { basicTheme } from './styles/theme';
import GlobalStyle from './styles/global-styles';
import LoginPage from './pages/LoginPage';
import PoliceBoardPage from './pages/board/PoliceBoardPage';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AllMap from './pages/board/MapPage/AllMap';
import Seoul from './pages/board/MapPage/Seoul';
import Incheon from './pages/board/MapPage/Incheon';
import Sejong from './pages/board/MapPage/Sejong';
import Daejeon from './pages/board/MapPage/Daejeon';
import Gwangju from './pages/board/MapPage/Gwangju';
import Daegu from './pages/board/MapPage/Daegu';
import Ulsan from './pages/board/MapPage/Ulsan';
import Busan from './pages/board/MapPage/Busan';
import Gyeonggi from './pages/board/MapPage/Gyeonggi';
import Chungnam from './pages/board/MapPage/Chungnam';
import Chungbuk from './pages/board/MapPage/Chungbuk';
import Jeonbuk from './pages/board/MapPage/JeonBuk';
import Jeonnam from './pages/board/MapPage/Jeonnam';
import Gangwon from './pages/board/MapPage/Gangwon';
import Gyeongbuk from './pages/board/MapPage/Gyeongbuk';
import Gyeongnam from './pages/board/MapPage/Gyeongnam';
import Jeju from './pages/board/MapPage/Jeju';
import CrackDownList from './components/CrackDown/CrackDownList';
import CrackDownDetail from './components/CrackDown/CrackDownDetail';
import ReportList from './components/Reported/ReportList';
import ReportDetail from './components/Reported/ReportDetail';
import ComplaintList from './components/Complaint/ComplaintList';
import ComplaintDetail from './components/Complaint/ComplaintDetail';
import ComplaintPage from './pages/Complaint/ComplaintPage';
import ReportPage from './pages/Reported/ReportPage';
import CrackDownPage from './pages/CrackDown/CrackDownPage';
import { PrivateRoute, PublicRoute } from './pages/IsLoginPage';
import ErrorPage from './pages/ErrorPage';
import CameraMap from './components/Board/CameraMap';
import ResponsiveWrapper from './lib/hook/useWindowSizeHook';
import SplashPage from './pages/SplashPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

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
  const queryClient = new QueryClient();
  return (
    <ThemeProvider theme={basicTheme}>
      <GlobalStyle />
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={true} />
        <s.Container>
          <BrowserRouter>
            <Routes>
              <Route
                element={
                  <ResponsiveWrapper>
                    <PublicRoute />
                  </ResponsiveWrapper>
                }
              >
                <Route path="/" element={<SplashPage />} />
                <Route path="/login" element={<LoginPage />} />
              </Route>
              <Route
                element={
                  <ResponsiveWrapper>
                    <PrivateRoute />
                  </ResponsiveWrapper>
                }
              >
                <Route path="/" element={<Navigate replace to="/board" />} />
                <Route path="/board" element={<PoliceBoardPage />}>
                  <Route index element={<AllMap />} />
                  <Route path="seoul" element={<Seoul />} />
                  <Route path="incheon" element={<Incheon />} />
                  <Route path="sejong" element={<Sejong />} />
                  <Route path="daejeon" element={<Daejeon />} />
                  <Route path="gwangju" element={<Gwangju />} />
                  <Route path="daegu" element={<Daegu />} />
                  <Route path="ulsan" element={<Ulsan />} />
                  <Route path="busan" element={<Busan />} />
                  <Route path="gyeonggi" element={<Gyeonggi />} />
                  <Route path="chungnam" element={<Chungnam />} />
                  <Route path="chungbuk" element={<Chungbuk />} />
                  <Route path="jeonbuk" element={<Jeonbuk />} />
                  <Route path="jeonnam" element={<Jeonnam />} />
                  <Route path="gangwon" element={<Gangwon />} />
                  <Route path="gyeongbuk" element={<Gyeongbuk />} />
                  <Route path="gyeongnam" element={<Gyeongnam />} />
                  <Route path="jeju" element={<Jeju />} />
                  <Route path=":location/map" element={<CameraMap />} />
                </Route>
                <Route path="/crackdown" element={<CrackDownPage />}>
                  <Route index element={<CrackDownList />} />
                  <Route path="read" element={<CrackDownDetail />} />
                </Route>
                <Route path="/report" element={<ReportPage />}>
                  <Route index element={<ReportList />} />
                  <Route path="read" element={<ReportDetail />} />
                </Route>
                <Route path="/complaint" element={<ComplaintPage />}>
                  <Route index element={<ComplaintList />} />
                  <Route path="read" element={<ComplaintDetail />} />
                </Route>
              </Route>
              <Route path="*" element={<ErrorPage />} />
            </Routes>
          </BrowserRouter>
        </s.Container>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;

// import React, { useEffect, useState } from 'react';
// import styled, { ThemeProvider } from 'styled-components';
// import { basicTheme } from './styles/theme';
// import GlobalStyle from './styles/global-styles';
// import LoginPage from './pages/LoginPage';
// import PoliceBoardPage from './pages/board/PoliceBoardPage';
// import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
// import AllMap from './pages/board/MapPage/AllMap';
// import Seoul from './pages/board/MapPage/Seoul';
// import Incheon from './pages/board/MapPage/Incheon';
// import Sejong from './pages/board/MapPage/Sejong';
// import Daejeon from './pages/board/MapPage/Daejeon';
// import Gwangju from './pages/board/MapPage/Gwangju';
// import Daegu from './pages/board/MapPage/Daegu';
// import Ulsan from './pages/board/MapPage/Ulsan';
// import Busan from './pages/board/MapPage/Busan';
// import Gyeonggi from './pages/board/MapPage/Gyeonggi';
// import Chungnam from './pages/board/MapPage/Chungnam';
// import Chungbuk from './pages/board/MapPage/Chungbuk';
// import Jeonbuk from './pages/board/MapPage/JeonBuk';
// import Jeonnam from './pages/board/MapPage/Jeonnam';
// import Gangwon from './pages/board/MapPage/Gangwon';
// import Gyeongbuk from './pages/board/MapPage/Gyeongbuk';
// import Gyeongnam from './pages/board/MapPage/Gyeongnam';
// import Jeju from './pages/board/MapPage/Jeju';
// import CrackDownList from './components/CrackDown/CrackDownList';
// import CrackDownDetail from './components/CrackDown/CrackDownDetail';
// import ReportList from './components/Reported/ReportList';
// import ReportDetail from './components/Reported/ReportDetail';
// import ComplaintList from './components/Complaint/ComplaintList';
// import ComplaintDetail from './components/Complaint/ComplaintDetail';
// import ComplaintPage from './pages/Complaint/ComplaintPage';
// import ReportPage from './pages/Reported/ReportPage';
// import CrackDownPage from './pages/CrackDown/CrackDownPage';
// import { PrivateRoute, PublicRoute } from './pages/IsLoginPage';
// import ErrorPage from './pages/ErrorPage';
// import CameraMap from './components/Board/CameraMap';
// import ResponsiveWrapper from './lib/hook/useWindowSizeHook';
// import SplashPage from './pages/SplashPage';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
// import AppInstallPage from './pages/AppInstallPage';

// const s = {
//   Container: styled.div`
//     height: 100vh;
//     position: relative;
//     margin: 0 auto;
//     /* border: 3px solid black; */
//     background-color: ${(props) => props.theme.bgColor};
//     overflow: auto;
//   `,
// };
// function App() {
//   const queryClient = new QueryClient();
//   const [isStandalone, setIsStandalone] = useState(false);
//   useEffect(() => {
//     setIsStandalone(window.matchMedia('(display-mode: standalone)').matches);
//   }, []);
//   return (
//     <ThemeProvider theme={basicTheme}>
//       <GlobalStyle />
//       <QueryClientProvider client={queryClient}>
//         <ReactQueryDevtools initialIsOpen={true} />
//         <s.Container>
//           <BrowserRouter>
//             <Routes>
//               {isStandalone ? (
//                 <>
//                   <Route
//                     element={
//                       <ResponsiveWrapper>
//                         <PublicRoute />
//                       </ResponsiveWrapper>
//                     }
//                   >
//                     <Route path="/" element={<SplashPage />} />
//                     <Route path="/login" element={<LoginPage />} />
//                   </Route>
//                   <Route
//                     element={
//                       <ResponsiveWrapper>
//                         <PrivateRoute />
//                       </ResponsiveWrapper>
//                     }
//                   >
//                     <Route path="/" element={<Navigate replace to="/board" />} />
//                     <Route path="/board" element={<PoliceBoardPage />}>
//                       <Route index element={<AllMap />} />
//                       <Route path="seoul" element={<Seoul />} />
//                       <Route path="incheon" element={<Incheon />} />
//                       <Route path="sejong" element={<Sejong />} />
//                       <Route path="daejeon" element={<Daejeon />} />
//                       <Route path="gwangju" element={<Gwangju />} />
//                       <Route path="daegu" element={<Daegu />} />
//                       <Route path="ulsan" element={<Ulsan />} />
//                       <Route path="busan" element={<Busan />} />
//                       <Route path="gyeonggi" element={<Gyeonggi />} />
//                       <Route path="chungnam" element={<Chungnam />} />
//                       <Route path="chungbuk" element={<Chungbuk />} />
//                       <Route path="jeonbuk" element={<Jeonbuk />} />
//                       <Route path="jeonnam" element={<Jeonnam />} />
//                       <Route path="gangwon" element={<Gangwon />} />
//                       <Route path="gyeongbuk" element={<Gyeongbuk />} />
//                       <Route path="gyeongnam" element={<Gyeongnam />} />
//                       <Route path="jeju" element={<Jeju />} />
//                       <Route path=":location/map" element={<CameraMap />} />
//                     </Route>
//                     <Route path="/crackdown" element={<CrackDownPage />}>
//                       <Route index element={<CrackDownList />} />
//                       <Route path="read" element={<CrackDownDetail />} />
//                     </Route>
//                     <Route path="/report" element={<ReportPage />}>
//                       <Route index element={<ReportList />} />
//                       <Route path="read" element={<ReportDetail />} />
//                     </Route>
//                     <Route path="/complaint" element={<ComplaintPage />}>
//                       <Route index element={<ComplaintList />} />
//                       <Route path="read" element={<ComplaintDetail />} />
//                     </Route>
//                   </Route>
//                   <Route path="*" element={<ErrorPage />} />
//                 </>
//               ) : (
//                 <Route path="*" element={<AppInstallPage />} />
//               )}
//             </Routes>
//           </BrowserRouter>
//         </s.Container>
//       </QueryClientProvider>
//     </ThemeProvider>
//   );
// }

// export default App;
