import React from 'react';
import styled from 'styled-components';

import Header from '../../components/Header';
import Footer from '../../components/Footer';

import ViolationObjectionForm from '../../components/Violation/ViolationObjectionForm';

const s = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    min-height: 100vh;
    background-color: ${(props) => props.theme.bgColor};
  `,
  MainArea: styled.div`
    flex: 1;
    width: 90%;
    height: 80%;
    padding-top: 5vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  `,
};

const ViolationObjectionPage = () => {
  return (
    <s.Container>
      <Header title="단속 이의제기 신청" />
      <s.MainArea>
        <ViolationObjectionForm />
      </s.MainArea>
      <Footer />
    </s.Container>
  );
};

export default ViolationObjectionPage;
