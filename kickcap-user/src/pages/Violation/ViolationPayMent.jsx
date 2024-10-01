import React from 'react';
import styled from 'styled-components';

import Button from '../../components/Common/Button';
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
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  `,
  Wrapper: styled.div`
    width: 90%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  `,
  Title: styled.div`
    font-size: 2rem;
    font-weight: 800;
    letter-spacing: -0.2rem;
    color: ${(props) => props.theme.mainColor};
    margin-bottom: 30px;
    cursor: default;
  `,
  Img: styled.img`
    margin-bottom: 50px;
  `,
  Description: styled.div`
    text-align: center;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: -0.05rem;
    white-space: pre-line;
    margin-bottom: 40px;
    line-height: 20px;
    cursor: default;
  `,
};

const ViolationPayMent = () => {
  const navigate = useNavigate();
  const handleMovePage = (path) => {
    navigate(path);
  };

  return (
    <s.Container>
      <s.MainArea>
        <s.Wrapper>
          <s.Description>납부 중 입니다. 잠시만 기다려주세요.</s.Description>
        </s.Wrapper>
      </s.MainArea>
    </s.Container>
  );
};

export default ViolationPayMent;
