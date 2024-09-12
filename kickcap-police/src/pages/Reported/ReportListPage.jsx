import React from 'react';
import styled from 'styled-components';
import Header from '../../components/Common/Header';
import ReportList from '../../components/Reported/ReportList';
import { ReactComponent as search } from '../../asset/svg/search.svg';
import IconSvg from '../../components/Common/IconSvg';

const s = {
  Container: styled.div`
    height: 100%;
    background-color: ${(props) => props.theme.bgColor};

    overflow-y: auto;
  `,
  mainArea: styled.main``,
};

const ReportListPage = () => {
  return (
    <s.Container>
      <Header title={'국민 신고함'} subTitle={'국민들의 자발적 킥보드 신고 내역입니다.'} />
      <s.mainArea>
        <ReportList />
      </s.mainArea>
    </s.Container>
  );
};

export default ReportListPage;
