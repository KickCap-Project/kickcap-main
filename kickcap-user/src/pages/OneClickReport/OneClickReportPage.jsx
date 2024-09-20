import React from 'react';
import styled from 'styled-components';

import Header from '../../components/Header';
import Footer from '../../components/Footer';

import Image from '../../components/Common/Image';
import SOS from './../../asset/img/svg/sos.svg';
import { useNavigate } from 'react-router';

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
    cursor: default;
  `,
};

const OneClickReportPage = () => {
  const topText =
    '킥보드 이용 중 긴급 상황 발생 시\n 가까운 관할 경찰서로 신고가 접수됩니다.\n\n[제공 정보]\n신고자 정보 및 GPS 위치';
  const bottomText = '허위 신고 적발 시 112신고처리법에 따라\n형사처벌을 받을 수 있습니다.';
  const navigate = useNavigate();
  const onClickSOS = () => {
    // 클릭 시 이벤트
    if (window.confirm('허위 신고 적발 시 112신고처리법에 따라 형사처벌을 받을 수 있습니다. 신고하시겠습니까?')) {
      alert('신고가 접수되었습니다. 접수된 경찰서에서 유선 연락이 올 수 있으니 참고바랍니다.');
      navigate('/main');
    }
  };

  return (
    <s.Container>
      <Header title="원 클릭 신고" />
      <s.MainArea>
        <s.Text size={'15px'} color={'black'}>
          {topText}
        </s.Text>
        <Image src={SOS} margin={'3vh'} onClick={() => onClickSOS()} cursor="pointer" />
        <s.Text size={'20px'}>{bottomText}</s.Text>
      </s.MainArea>
      <Footer />
    </s.Container>
  );
};
export default OneClickReportPage;
