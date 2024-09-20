import React from 'react';
import styled from 'styled-components';

import Header from '../../components/Header';
import Footer from '../../components/Footer';

import ReportButton from '../../components/Report/ReportButton';

import noPark from '../../asset/img/svg/noPark.svg';
import report from '../../asset/img/svg/report.svg';

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
  ButtonArea: styled.div`
    width: 100%;
  `,
  AlertDescription: styled.div`
    white-space: pre-line;
    font-weight: 600;
    width: 100%;
    text-align: center;
    color: ${(props) => props.theme.mainColor};
    position: relative;
    margin-top: 10vh;
    margin-bottom: 5vh;
  `,
};

const ReportMainPage = () => {
  const alert_description = '허위, 장난성 제보는 112신고처리법에 따라\n형사 처벌을 받을 수 있습니다.';

  return (
    <s.Container>
      <Header title="제 보 하 기" />
      <s.MainArea>
        <s.ButtonArea>
          <ReportButton title="불법 주차 신고" description="불법 주차된 킥보드를 잡아주세요!" imgSrc={noPark} />
          <ReportButton title="킥보드 국민 제보" description="불량 이용자를 잡아주세요!" imgSrc={report} />
        </s.ButtonArea>
        <s.AlertDescription>{alert_description}</s.AlertDescription>
      </s.MainArea>
      <Footer />
    </s.Container>
  );
};

export default ReportMainPage;
