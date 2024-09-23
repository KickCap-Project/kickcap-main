import React from 'react';
import styled from 'styled-components';

import Header from '../../components/Header';
import Footer from '../../components/Footer';

import ReportIllegalParkingForm from '../../components/Report/ReportIllegalParkingForm';

const ReportIllegalParkingPage = () => {
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
      flex: 1;
      width: 90%;
      height: 80%;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
    `,
  };

  return (
    <s.Container>
      <Header title="불법주차 신고" />
      <s.MainArea>
        <ReportIllegalParkingForm />
      </s.MainArea>
      <Footer />
    </s.Container>
  );
};

export default ReportIllegalParkingPage;
