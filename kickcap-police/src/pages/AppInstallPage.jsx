import React from 'react';
import styled from 'styled-components';
import Logo from '../asset/policeLogo.png';
import Text from '../components/Common/Text';
import { useNavigate } from 'react-router';
import Button from '../components/Common/Button';
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

const AppInstallPage = () => {
  return (
    <s.Container>
      <s.MainArea>
        <Image src={Logo} width="200px" type="rect" margin="40px auto" />
        <Text
          children="앱을 설치해주세요!"
          color="textColor"
          size="20px"
          bold="700"
          display="block"
          width="100%"
          textalian="center"
        />
        <Text
          children="PC는 우측상단 앱설치 버튼을, 모바일은 바로가기 추가 탭에서 확인가능합니다."
          color="textColor"
          size="15px"
          bold="700"
          display="block"
          width="100%"
          textalian="center"
          margin={'20px auto'}
        />
        <Text
          children="본 서비스는 Mobile, PC 모두 Chrome 브라우저에 최적화되어 있습니다."
          color="textColor"
          size="15px"
          bold="700"
          display="block"
          width="100%"
          textalian="center"
        />
      </s.MainArea>
    </s.Container>
  );
};

export default AppInstallPage;
