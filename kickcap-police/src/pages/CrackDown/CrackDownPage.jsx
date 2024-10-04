import React from 'react';
import styled from 'styled-components';
import Header from '../../components/Common/Header';
import { Outlet } from 'react-router';
import { usePageNavHook } from '../../lib/hook/usePageNavHook';
import { usePageTypeHook } from '../../lib/hook/usePageTypeHook';

const s = {
  Container: styled.div`
    height: 100%;
    background-color: ${(props) => props.theme.bgColor};
    overflow-y: auto;
  `,
  mainArea: styled.main``,
};

const CrackDownPage = () => {
  usePageNavHook('crackdown');
  usePageTypeHook('crackdown');
  return (
    <s.Container>
      <Header title={'단속 리스트'} subTitle={'AI 모델이 탑재된 카메라에  단속된 내역입니다.'} />
      <s.mainArea>
        <Outlet />
      </s.mainArea>
    </s.Container>
  );
};

export default CrackDownPage;
