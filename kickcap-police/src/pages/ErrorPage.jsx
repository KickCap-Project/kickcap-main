import React, { useEffect } from 'react';
import styled from 'styled-components';
import IconSvg from '../components/Common/IconSvg';
// import { ReactComponent as Logo } from '../asset/policeLogo.png';
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

const ErrorPage = () => {
  const navigate = useNavigate();
  const handleMovePage = () => {
    navigate('/');
  };
  return (
    <s.Container>
      <s.MainArea>
        <Image src={Logo} width="200px" type="rect" margin="40px auto" />
        <Text
          children="잘못된 접근입니다."
          color="textColor"
          size="20px"
          bold="700"
          display="block"
          width="100%"
          textalian="center"
        />
        <Button
          children="홈으로"
          width="80%"
          height="40px"
          bold="500"
          display="block"
          margin="20px auto"
          onClick={handleMovePage}
        />
      </s.MainArea>
    </s.Container>
  );
};

export default ErrorPage;
