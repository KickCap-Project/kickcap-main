import React from 'react';
import styled from 'styled-components';

import Header from './../../components/Header';
import Footer from './../../components/Footer';
import ViolenceEmpty from './../../components/violence/ViolenceEmpty';
import ViolenceList from './../../components/violence/ViolenceList';

const s = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    min-height: 100vh;
    background-color: ${(props) => props.theme.bgColor};
  `,
  MainAreaEmpty: styled.div`
    flex: 1;
    width: 90%;
    height: 80%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 5%;
  `,
  MainArea: styled.div`
    width: 90%;
    height: 80%;
  `,
};

const ViolenceListPage = () => {
  const violenceList = [
    {
      idx: 1,
      addr: 'asdf',
      type: '0',
      date: '2024-09-02 오후 23:59:59',
    },
  ];

  return (
    <s.Container>
      <Header title={'나의 단속 내역'} />

      {violenceList.length === 0 ? (
        <s.MainAreaEmpty>
          <ViolenceEmpty />
        </s.MainAreaEmpty>
      ) : (
        <s.MainArea>
          <ViolenceList />
        </s.MainArea>
      )}

      <Footer />
    </s.Container>
  );
};

export default ViolenceListPage;
