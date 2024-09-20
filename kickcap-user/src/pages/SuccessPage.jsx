import React from 'react';
import styled from 'styled-components';

import OKsvg from './../asset/img/svg/ok.svg';
import Button from './../components/Common/Button';

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

const SuccessPage = ({ message }) => {
  const SuccessMessage = {
    violation: {
      title: '납부 완료',
      description: '해당 범칙금 납부가 완료되었습니다.\n안전한 킥보드 이용 부탁드립니다.',
    },
    objection: {
      title: '신청 완료',
      description: '해당 민원이 접수되었습니다.\n빠른 시일 내 검토하여 안내드리겠습니다.',
    },
    report: {
      title: '신고 완료',
      description: '신고가 완료되었습니다.\n안전한 킥보드 문화를 위해 노력하겠습니다.',
    },
  };

  return (
    <s.Container>
      <s.MainArea>
        <s.Wrapper>
          <s.Title>{SuccessMessage[message].title}</s.Title>
          <s.Img src={OKsvg} />
          <s.Description>{SuccessMessage[message].description}</s.Description>

          <Button width={'100%'} height={'40px'} size={'1rem'} bold={'700'}>
            메인으로
          </Button>
        </s.Wrapper>
      </s.MainArea>
    </s.Container>
  );
};

export default SuccessPage;
