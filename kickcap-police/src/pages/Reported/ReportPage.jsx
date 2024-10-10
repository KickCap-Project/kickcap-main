import React from 'react';
import styled from 'styled-components';
import Header from '../../components/Common/Header';
import { Outlet } from 'react-router';
import { usePageNavHook } from '../../lib/hook/usePageNavHook';
import { usePageTypeHook } from './../../lib/hook/usePageTypeHook';

const s = {
  Container: styled.div`
    height: 100%;
    background-color: ${(props) => props.theme.bgColor};
  `,
  mainArea: styled.main``,
};

const ReportPage = () => {
  usePageNavHook('report');
  usePageTypeHook('report');
  return (
    <s.Container>
      <Header title={'국민 신고함'} subTitle={'국민들의 자발적 킥보드 신고 내역입니다.'} />
      <s.mainArea>
        <Outlet />
      </s.mainArea>
    </s.Container>
  );
};

export default ReportPage;
