import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import ViolationEmpty from '../../components/Violation/ViolationEmpty';
import ViolationList from '../../components/Violation/ViolationList';
import { isFlagType } from '../../lib/data/Violation';
import { getBillList } from '../../lib/api/violation-api';

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
  ObserveArea: styled.div`
    width: 100%;
    height: 1px;
    margin-bottom: 1px;
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
  const [vList, setVList] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const observerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  // 데이터 로드 함수
  const loadMoreData = async () => {
    if (isLoading || !hasMoreData) return;

    setIsLoading(true);
    try {
      const newList = await getBillList(page);

      if (newList && newList.length > 0) {
        setVList((prevPage) => [...prevPage, ...newList]);
        setPage((prevPage) => prevPage + 1);
      } else {
        setHasMoreData(false);
      }
    } catch (err) {
      alert('데이터를 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMoreData();
  }, []);

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
      <Header title={'나의 단속 내역'} />

      {isLoading && vList.length === 0 ? ( // 최초 로딩 시 로딩 스피너 표시
        <s.MainAreaEmpty>
          <LoadingSpinner />
        </s.MainAreaEmpty>
      ) : vList.length === 0 ? ( // 데이터가 없을 때 빈 화면 표시
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
            <ViolationList vList={vList} />
            <s.ObserveArea ref={observerRef} />
            {/* 추가 데이터 로딩 중일 때 스피너 표시 */}
            {isLoading && <LoadingSpinner />}
          </s.MainArea>
        </>
      )}

      <Footer />
    </s.Container>
  );
};

export default ViolationListPage;
