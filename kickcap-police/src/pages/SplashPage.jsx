import React from 'react';
import styled from 'styled-components';
import LodingLogo from '../asset/img/splashLogo.gif';
import Text from './../components/Common/Text';

const s = {
  Container: styled.div`
    height: 100%;
    background-color: ${(props) => props.theme.bgColor};
  `,
  MainArea: styled.div`
    width: fit-content;
    margin: 0 auto;
    position: relative;
    bottom: 50%;
    top: 50%;
    transform: translate(0, -50%);
    text-align: center;
    display: flex;
    flex-direction: column;
  `,
  Img: styled.img`
    width: 100%;
  `,
};

const SplashPage = () => {
  return (
    <s.Container>
      <s.MainArea>
        <s.Img src={LodingLogo} />
        <Text size={'20px'} bold={'800'}>
          로딩 중 입니다.
        </Text>
        <Text size={'20px'} bold={'800'}>
          잠시만 기다려 주세요.
        </Text>
      </s.MainArea>
    </s.Container>
  );
};

export default SplashPage;
