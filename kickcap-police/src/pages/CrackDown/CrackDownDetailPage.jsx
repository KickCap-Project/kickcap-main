import React from 'react';
import styled from 'styled-components';
import Header from '../../components/Common/Header';
import CrackDownDetail from '../../components/CrackDown/CrackDownDetail';

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

const CrackDownDetailPage = () => {
  return (
    <s.Container>
      <Header title={'단속 리스트'} subTitle={'AI 모델이 탑재된 카메라에  단속된 내역입니다.'} />
      <s.mainArea>
        <CrackDownDetail />
      </s.mainArea>
    </s.Container>
  );
};

export default CrackDownDetailPage;
