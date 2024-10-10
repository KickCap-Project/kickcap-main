import React from 'react';
import styled from 'styled-components';
import Logo from '../asset/policeLogo.png';
import Text from '../components/Common/Text';
import Image from './../components/Common/Image';
const s = {
  Container: styled.section`
    height: 100%;
    background-color: ${(props) => props.theme.bgColor};
    overflow: auto;
  `,
  MainArea: styled.div`
    width: fit-content;
    margin: 0 auto;
    position: relative;
    bottom: 50%;
    top: 50%;
    transform: translate(0, -50%);
    text-align: center;
  `,
};

const SizeGuidePage = () => {
  return (
    <s.Container>
      <s.MainArea>
        <Image src={Logo} width="200px" type="rect" margin="40px auto" />
        <Text
          children="최소 1080 X 600 이상의 해상도를 이용해주세요."
          color="textColor"
          size="20px"
          bold="700"
          display="block"
          width="100%"
          textalian="center"
        />
      </s.MainArea>
    </s.Container>
  );
};

export default SizeGuidePage;
