import React from 'react';
import styled from 'styled-components';

import Header from '../../components/Header';
import Footer from '../../components/Footer';

import ObjectionList from '../../components/Objection/ObjectionList';
import ObjectionEmpty from '../../components/Objection/ObjectionEmpty';

const s = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    min-height: 100vh;
    background-color: ${(props) => props.theme.bgColor};
  `,
  ControlBar: styled.div`
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: center;
    flex-shrink: 0;
  `,
  ControlItem: styled.div`
    width: 50%;
    height: 100%;
    color: ${(props) => (props.isSelected ? props.theme.mainColor : 'black')};
    font-size: ${(props) => (props.isSelected ? '20px' : '15px')};
    font-weight: 600;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
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
    overflow: auto;
    flex-basis: 0;
  `,
};

const ObjectionListPage = () => {
  // dummy data
  const objectionList = [
    {
      idx: 0,
      date: '2024-08-03 오후 12:12:12',
      title: '다시 검토해주세요',
    },
    {
      idx: 1,
      date: '2024-08-03 오후 12:12:12',
      title: '다시 검토해주세요',
    },
    {
      idx: 2,
      date: '2024-08-03 오후 12:12:12',
      title: '다시 검토해주세요',
    },
    {
      idx: 3,
      date: '2024-08-03 오후 12:12:12',
      title: '다시 검토해주세요',
    },
    {
      idx: 4,
      date: '2024-08-03 오후 12:12:12',
      title: '다시 검토해주세요',
    },
    {
      idx: 5,
      date: '2024-08-03 오후 12:12:12',
      title: '다시 검토해주세요',
    },
    {
      idx: 6,
      date: '2024-08-03 오후 12:12:12',
      title: '다시 검토해주세요',
    },
    {
      idx: 7,
      date: '2024-08-03 오후 12:12:12',
      title: '다시 검토해주세요',
    },
    {
      idx: 8,
      date: '2024-08-03 오후 12:12:12',
      title: '다시 검토해주세요',
    },
    {
      idx: 9,
      date: '2024-08-03 오후 12:12:12',
      title: '다시 검토해주세요',
    },
  ];

  const onClickControl = (item) => {
    console.log(item);

    // axios get
  };

  return (
    <s.Container>
      <Header title="나의 이의 내역" />
      <s.ControlBar>
        <s.ControlItem isSelected={'true'} onClick={() => onClickControl('ProcessingList')}>
          접수 내역
        </s.ControlItem>
        <s.ControlItem onClick={() => onClickControl('CompletedList')}>완료 내역</s.ControlItem>
      </s.ControlBar>
      {objectionList.length !== 0 ? (
        <s.MainArea>
          <ObjectionList objectionList={objectionList} />
        </s.MainArea>
      ) : (
        <s.MainAreaEmpty>
          <ObjectionEmpty />
        </s.MainAreaEmpty>
      )}
      <Footer />
    </s.Container>
  );
};

export default ObjectionListPage;
