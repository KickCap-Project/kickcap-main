import React from 'react';
import styled from 'styled-components';

import Header from './../Header';
import Footer from './../Footer';

import Image from './../Common/Image';
import SOS from './../../asset/img/svg/sos.svg';

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
    justify-content: center;
    align-items: center;
    margin: 5vh;
  `,
  Text: styled.div`
    color: ${(props) => (props.color ? props.color : props.theme.mainColor)};
    font-size: ${(props) => props.size};
    font-weight: 600;
    white-space: pre-line;
    text-align: center;
  `,
};

const OneClickReportPage = () => {
  const topText =
    '킥보드 이용 중 긴급 상황 발생 시\n 가까운 관할 경찰서로 신고가 접수됩니다.\n\n[제공 정보]\n신고자 정보 및 GPS 위치';
  const bottomText = '허위 신고 적발 시 112신고처리법에 따라\n형사처벌을 받을 수 있습니다.';
  const onClickSOS = () => {
    // 클릭 시 이벤트
    console.log(1234);
  };

  return (
    <s.Container>
      <Header title="원 클릭 신고" />
      <s.MainArea>
        <s.Text size={'15px'} color={'black'} font-weight={'600'}>
          {topText}
        </s.Text>
        <Image src={SOS} margin={'3vh'} onClick={() => onClickSOS()} />
        <s.Text size={'20px'} font-weight={'60'}>
          {bottomText}
        </s.Text>
      </s.MainArea>
      <Footer />
    </s.Container>
  );
};
export default OneClickReportPage;
