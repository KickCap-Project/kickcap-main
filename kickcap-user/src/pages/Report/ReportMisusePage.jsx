import React, { useEffect } from 'react';
import styled from 'styled-components';

import Header from '../../components/Header';
import Footer from '../../components/Footer';

import ReportMisuseForm from '../../components/Report/ReportMisuseForm';

import { useAppDispatch } from '../../lib/hook/useReduxHook';
import { clearLocation } from '../../store/location';

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
    height: 80%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
  `,
};

const ReportMisusePage = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(clearLocation());
  }, []);

  return (
    <s.Container>
      <Header title="킥보드 국민 제보" />
      <s.MainArea>
        <ReportMisuseForm />
      </s.MainArea>
      <Footer />
    </s.Container>
  );
};

export default ReportMisusePage;
