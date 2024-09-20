import React from 'react';
import styled from 'styled-components';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ViolationEmpty from '../../components/Violation/ViolationEmpty';
import ViolationList from '../../components/Violation/ViolationList';
import { ViolationType, isFlagType } from '../../lib/data/Violation';

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
  Index: styled.div`
    display: flex;
    justify-content: center;
    height: 50px;
    gap: 4%;
    width: 100%;
    cursor: default;
  `,
  IndexContent: styled.div`
    width: fit-content;
    display: flex;
    justify-content: center;
    align-items: center;
  `,
  IndexColor: styled.div`
    width: 25px;
    height: 15px;
    background-color: ${(props) => props.color};
    margin-right: 3px;
  `,
  IndexTag: styled.div`
    white-space: nowrap;
    font-size: 10px;
    font-weight: 800;
  `,
  MainArea: styled.div`
    flex: 1;
    width: 90%;
    height: 80%;
    flex-basis: 0;
    overflow: auto;
  `,
};

const IndexComponent = ({ color, title }) => {
  return (
    <s.IndexContent>
      <s.IndexColor color={color} />
      <s.IndexTag>{title}</s.IndexTag>
    </s.IndexContent>
  );
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
        <>
          <s.Index>
            {Array.from({ length: 4 }, (_, idx) => (
              <IndexComponent key={idx} color={isFlagType[idx].color} title={isFlagType[idx].status} />
            ))}
          </s.Index>
          <s.MainArea>
            <ViolationList violationList={violationList} />
          </s.MainArea>
        </>
      )}

      <Footer />
    </s.Container>
  );
};

export default ViolationListPage;
