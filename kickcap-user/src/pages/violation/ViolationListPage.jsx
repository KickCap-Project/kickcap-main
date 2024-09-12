import React from 'react';
import styled from 'styled-components';

import Header from './../../components/Header';
import Footer from './../../components/Footer';
import ViolationEmpty from './../../components/violation/ViolationEmpty';
import ViolationList from './../../components/violation/ViolationList';

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
    flex: 1;
    width: 90%;
    height: 80%;
  `,
};

const ViolationListPage = () => {
  // dummy data
  const violationList = [
    {
      idx: 1,
      date: '2024-08-03 오후 12:12:12',
      type: 1,
      deadLine: '2024-09-02 오후 23:59:59',
      isFlag: 3,
    },
    {
      idx: 2,
      date: '2024-08-03 오후 12:12:12',
      type: 2,
      deadLine: '2024-09-02 오후 23:59:59',
      isFlag: 2,
    },
    {
      idx: 3,
      date: '2024-08-03 오후 12:12:12',
      type: 3,
      deadLine: '2024-09-02 오후 23:59:59',
      isFlag: 1,
    },
    {
      idx: 4,
      date: '2024-08-03 오후 12:12:12',
      type: 4,
      deadLine: '2024-09-02 오후 23:59:59',
      isFlag: 0,
    },
    {
      idx: 5,
      date: '2024-08-03 오후 12:12:12',
      type: 5,
      deadLine: '2024-09-02 오후 23:59:59',
      isFlag: 0,
    },
    {
      idx: 6,
      date: '2024-08-03 오후 12:12:12',
      type: 1,
      deadLine: '2024-09-02 오후 23:59:59',
      isFlag: 0,
    },
    {
      idx: 7,
      date: '2024-08-03 오후 12:12:12',
      type: 1,
      deadLine: '2024-09-02 오후 23:59:59',
      isFlag: 0,
    },
    {
      idx: 8,
      date: '2024-08-03 오후 12:12:12',
      type: 1,
      deadLine: '2024-09-02 오후 23:59:59',
      isFlag: 0,
    },
    {
      idx: 9,
      date: '2024-08-03 오후 12:12:12',
      type: 1,
      deadLine: '2024-09-02 오후 23:59:59',
      isFlag: 0,
    },
  ];

  return (
    <s.Container>
      <Header title={'나의 단속 내역'} />

      {violationList.length === 0 ? (
        <s.MainAreaEmpty>
          <ViolationEmpty />
        </s.MainAreaEmpty>
      ) : (
        <s.MainArea>
          <ViolationList violationList={violationList} />
        </s.MainArea>
      )}

      <Footer />
    </s.Container>
  );
};

export default ViolationListPage;
