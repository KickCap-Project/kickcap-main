import React from 'react';
import styled from 'styled-components';
import Header from '../../components/Common/Header';
import ComplaintDetail from '../../components/Complaint/ComplaintDetail';
import ComplaintInfoModal from '../../components/Modal/ComplaintInfoModal';
import ComplaintSendModal from '../../components/Modal/ComplaintSendModal';

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

const ComplaintDetailPage = () => {
  return (
    <s.Container>
      <Header title={'이 의 제 기'} subTitle={'단속 사항에 대한 문의 내역입니다.'} />
      <s.mainArea>
        <ComplaintDetail />
      </s.mainArea>
      <ComplaintInfoModal open={true} />
      {/* <ComplaintSendModal open={true} /> */}
    </s.Container>
  );
};

export default ComplaintDetailPage;
