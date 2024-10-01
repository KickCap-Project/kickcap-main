import React, { useEffect } from "react";
import styled from "styled-components";

import { useLocation, useNavigate } from "react-router";

import Header from "../../components/Header";
import Footer from "../../components/Footer";

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
  `,
};

const ViolationPaymentPage = () => {
  const navigate = useNavigate();
  const id = useLocation().state?.id || null;

  useEffect(() => {
    if (id === null) {
      navigate('*');
      return;
    }
  }, [id]);

  return (
    <s.Container>
      <Header title={'범칙금 납부'} />
      <s.MainArea>

      </s.MainArea>
      <Footer />
    </s.Container>
  )
}

export default ViolationPaymentPage;