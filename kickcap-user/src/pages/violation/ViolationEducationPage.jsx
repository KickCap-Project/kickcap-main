import React, { useState } from 'react';
import styled from 'styled-components';

import Header from './../../components/Header';
import Footer from './../../components/Footer';
import Button from './../../components/Common/Button';
import EduVideo from '../../components/violation/EduVideo';

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
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    white-space: pre-line;
    overflow: auto;
    border: 1px solid red;
  `,
  VideoArea: styled.div`
    width: 95%;
    margin: 20px auto;
    border: 1px solid red;
  `,
  TextArea: styled.div`
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: -0.075rem;
    text-align: center;
  `,
  BtnARea: styled.div`
    width: 90%;
    border: 1px solid blue;
  `,
};

const ViolationEducationPage = () => {
  const [played, setPlayed] = useState(false);
  const description =
    '벌점 기준을 초과하여 교육 영상을 수강하셔야 합니다.\n영상 재생 완료 후 납부를 진행해주세요.\n\n10점 단위 초과 시 교육 이수 필수';

  return (
    <s.Container>
      <Header title={'나의 단속 내역'} />
      <s.MainArea>
        <s.VideoArea>
          <EduVideo />
        </s.VideoArea>
        <s.TextArea>{description}</s.TextArea>
      </s.MainArea>
      <s.BtnARea>
        <Button type={played ? '' : 'sub'} width={'100%'} height={'40px'} display={'block'} margin={'20px auto'}>
          납부하기
        </Button>
      </s.BtnARea>
      <Footer />
    </s.Container>
  );
};

export default ViolationEducationPage;
