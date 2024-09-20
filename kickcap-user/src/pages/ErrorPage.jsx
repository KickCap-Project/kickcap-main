import React from 'react';
import styled from 'styled-components';
import Text from './../components/Common/Text';

import ErrorLogo from './../asset/img/svg/error.svg';
import { useNavigate } from 'react-router';
import Button from './../components/Common/Button';

const s = {
  Container: styled.div`
    height: 100%;
    background-color: ${(props) => props.theme.bgColor};
  `,
  MainArea: styled.div`
    width: 100%;
    height: 100%;
    margin: 0 auto;
    position: relative;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  `,
  LoadingLogoImg: styled.img`
    width: 60%;
    max-width: 300px;
    margin: 0 auto;
  `,
  LogoImg: styled.img`
    width: 64%;
    margin-bottom: 10%;
  `,
};

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <s.Container>
      <s.MainArea>
        <s.LoadingLogoImg src={ErrorLogo} />
        <Text size={'20px'} bold={'700'} margin={'10px auto'} display={'block'}>
          잘못된 접근입니다.
        </Text>
        <Button
          bold={'700'}
          children={'홈으로'}
          size={'20px'}
          width={'80%'}
          height={'40px'}
          display={'block'}
          margin={'30px auto'}
          onClick={() => navigate('/')}
        />
      </s.MainArea>
    </s.Container>
  );
};

export default ErrorPage;
