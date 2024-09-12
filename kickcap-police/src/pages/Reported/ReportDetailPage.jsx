import React from 'react';
import styled from 'styled-components';
import Header from '../../components/Common/Header';
import ReportDetail from '../../components/Reported/ReportDetail';

const s = {
  Container: styled.div`
    height: 100%;
    background-color: ${(props) => props.theme.bgColor};
    /* border: 3px solid orange; */
    overflow-y: auto;
  `,
  mainArea: styled.main`
    border: 3px solid red;
  `,
};

const ReportDetailPage = () => {
  return (
    <s.Container>
      <Header title={'국민 신고함'} subTitle={'국민들의 자발적 킥보드 신고 내역입니다.'} />
      <s.mainArea>
        <ReportDetail />
      </s.mainArea>
    </s.Container>
  );
};

export default ReportDetailPage;
