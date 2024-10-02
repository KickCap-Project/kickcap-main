import React, { useState, useEffect, useRef } from 'react';
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
  ObserveArea: styled.div`
    width: 100%;
    height: 1px;
    margin-bottom: 1px;
  `,
};

const ObjectionListPage = () => {
  sessionStorage.removeItem('objectionId');
  const [objectionList, setObjectionList] = useState([]);
  const [status, setStatus] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef(null);

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    console.log(`현재 status 값: ${newStatus}`);
  };

  // status가 변할 때 상태들을 초기화하는 함수
  const setMultipleStates = () => {
    setObjectionList([]);
    setPage(1);
    setHasMoreData(true);
  };

  // 데이터 로드 함수
  const loadMoreData = async () => {
    if (isLoading || !hasMoreData) return;

    setIsLoading(true);
    try {
      const newList = await getObjectionList(status, page);

      if (newList && newList.length > 0) {
        setObjectionList((prevPage) => [...prevPage, ...newList]);
        setPage((prevPage) => prevPage + 1);
      } else {
        console.log('더 이상 불러올 데이터가 없습니다.');
        setHasMoreData(false);
      }
    } catch (err) {
      console.error('데이터를 불러오는 중 문제가 발생했습니다: ', err);
    } finally {
      setIsLoading(false);
    }
  };

  // status가 0에서 1로, 1에서 0으로 변할 때마다 변수 초기화 후 API 요청을 실행하는 부분
  useEffect(() => {
    setMultipleStates();
  }, [status]);

  useEffect(() => {
    if (page === 1) {
      loadMoreData();
    }
  }, [objectionList, page, hasMoreData]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && hasMoreData) {
          loadMoreData();
        }
      },
      { threshold: 1.0 },
    );

    const currentObserverRef = observerRef.current;
    if (currentObserverRef) {
      observer.observe(currentObserverRef);
    }

    return () => {
      if (currentObserverRef) {
        observer.unobserve(currentObserverRef);
      }
    };
  }, [isLoading, hasMoreData]);

  return (
    <s.Container>
      <Header title="나의 이의 내역" />
      <s.ControlBar>
        <s.ControlItem isSelected={status === 0} onClick={() => handleStatusChange(0)}>
          접수 내역
        </s.ControlItem>
        <s.ControlItem isSelected={status === 1} onClick={() => handleStatusChange(1)}>
          완료 내역
        </s.ControlItem>
      </s.ControlBar>
      {objectionList.length !== 0 ? (
        <s.MainArea>
          <ObjectionList objectionList={objectionList} />
          <s.ObserveArea ref={observerRef} />
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
