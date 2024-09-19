import React, { useState } from 'react';
import styled from 'styled-components';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Button from '../../components/Common/Button';

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
    justify-content: center;
    align-items: center;
    white-space: pre-line;
  `,
  VideoArea: styled.div`
    margin-bottom: 30px;
  `,
  TextArea: styled.div`
    font-size: 0.75rem;
    font-weight: 600;
    text-align: center;
    margin-bottom: 100px;
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
        <s.VideoArea></s.VideoArea>
        <s.TextArea>{description}</s.TextArea>
        <Button type={played ? '' : 'sub'} width={'100%'} height={'40px'}>
          납부하기
        </Button>
      </s.MainArea>

      <Footer />
    </s.Container>
  );
};

export default ViolationEducationPage;
