import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

import Header from '../../components/Header';
import Footer from '../../components/Footer';

import ObjectionList from '../../components/Objection/ObjectionList';
import ObjectionEmpty from '../../components/Objection/ObjectionEmpty';

import { getObjectionList } from '../../lib/api/objection-api';

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
  // const [objectionList, setObjectionList] = useState([
  //   {
  //     idx: 0,
  //     date: '2024-08-03 오후 12:12:12',
  //     title: '다시 검토해주세요',
  //   },
  //   {
  //     idx: 1,
  //     date: '2024-08-03 오후 12:12:12',
  //     title: '다시 검토해주세요',
  //   },
  //   {
  //     idx: 2,
  //     date: '2024-08-03 오후 12:12:12',
  //     title: '다시 검토해주세요',
  //   },
  //   {
  //     idx: 3,
  //     date: '2024-08-03 오후 12:12:12',
  //     title: '다시 검토해주세요',
  //   },
  //   {
  //     idx: 4,
  //     date: '2024-08-03 오후 12:12:12',
  //     title: '다시 검토해주세요',
  //   },
  //   {
  //     idx: 5,
  //     date: '2024-08-03 오후 12:12:12',
  //     title: '다시 검토해주세요',
  //   },
  //   {
  //     idx: 6,
  //     date: '2024-08-03 오후 12:12:12',
  //     title: '다시 검토해주세요',
  //   },
  //   {
  //     idx: 7,
  //     date: '2024-08-03 오후 12:12:12',
  //     title: '다시 검토해주세요',
  //   },
  //   {
  //     idx: 8,
  //     date: '2024-08-03 오후 12:12:12',
  //     title: '다시 검토해주세요',
  //   },
  //   {
  //     idx: 9,
  //     date: '2024-08-03 오후 12:12:12',
  //     title: '다시 검토해주세요',
  //   },
  // ]);
  
  sessionStorage.removeItem('objectionId');
  const [objectionList, setObjectionList] = useState([]);

  // 접수완료 : status = 0
  // 답변완료 : status = 1
  const [status, setStatus] = useState(0);

  // 접수완료, 답변완료 버튼 클릭 시 isSelected 변경 및 axios 요청
  const onClickControl = (item) => {
    setStatus(item);
  };
  
  const loadData = async (status) => {
    const response = await getObjectionList(status);
    setObjectionList(response)
  }
  
  // 페이지 진입 시 접수완료 목록 보이기
  // status에 따라 API 요청을 보내 목록 받기
  useEffect(() => {
    loadData(status);
  }, [status]);

  return (
    <s.Container>
      <Header title="나의 이의 내역" />
      <s.ControlBar>
        <s.ControlItem isSelected={status === 0} onClick={() => onClickControl(0)}>
          접수 내역
        </s.ControlItem>
        <s.ControlItem isSelected={status === 1} onClick={() => onClickControl(1)}>완료 내역</s.ControlItem>
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