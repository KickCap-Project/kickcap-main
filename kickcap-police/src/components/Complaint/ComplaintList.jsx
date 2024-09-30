import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../lib/hook/useReduxHook';
import { pageActions, selectComplaintNav } from '../../store/page';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import '../../styles/Pagination.css';
import Pagination from 'react-js-pagination';

const s = {
  Container: styled.div`
    width: 90%;
    margin: 0 auto;
  `,
  TypeArea: styled.div`
    width: 500px;
    margin: 20px auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,
  TypeText: styled.div`
    width: 200px;
    height: 30px;
    text-align: center;
    font-weight: 700;
    font-size: ${(props) => props.size || '25px'};
    color: ${(props) => props.color || props.theme.textBasic2};
    cursor: pointer;
    &:hover {
      font-size: 30px;
    }
  `,
  TableArea: styled.div`
    width: 100%;
    height: 480px;
    border-radius: 10px;
    border-left: 4px solid rgba(0, 0, 0, 0.2);
    border-right: 4px solid rgba(0, 0, 0, 0.2);
    box-shadow: inset -5px 0 5px -5px #333, inset 5px 0 5px -5px #333;
    padding: 10px 0 10px 0;
  `,
  Table: styled.table`
    width: 90%;
    margin: 0 auto;
  `,
  Thead: styled.thead``,
  Tbody: styled.tbody`
    text-align: center;
  `,
  Tr: styled.tr`
    width: 100%;
    height: 40px;
    cursor: pointer;
  `,
  Td: styled.td`
    vertical-align: middle;
    border-bottom: 1px solid ${(props) => props.theme.btnOff};
  `,
  noData: styled.td`
    vertical-align: middle;
  `,
  Th: styled.th`
    font-weight: 700;
    color: ${(props) => props.theme.mainColor};
    vertical-align: middle;
  `,
  pageArea: styled.div`
    width: 500px;
    height: 40px;
    border: 1px solid red;
    margin: 20px auto;
    display: flex;
    align-items: center;
    justify-content: center;
  `,
};

const ComplaintList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const type = useAppSelector(selectComplaintNav);
  const dispatch = useAppDispatch();
  const [state, setState] = useState(searchParams.get('state'));
  const [totalPage, setTotalPage] = useState(0);
  const [pageNo, setPageNo] = useState(searchParams.get('pageNo'));
  const [data, setData] = useState([]);

  const handleClickIcon = (mode) => {
    dispatch(pageActions.changeComplaintType(mode));
    const newViolationType = mode === 'progress' ? 'receipt' : 'end';
    setSearchParams({ state: newViolationType, pageNo: 1 });
  };

  const getColor = (mode) => {
    return type === mode ? '#0054A6' : undefined;
  };
  const getSize = (mode) => {
    return type === mode ? '30px' : undefined;
  };

  useEffect(() => {
    setState(searchParams.get('state'));
    setPageNo(Number(pageNo));
    const newViolationType = searchParams.get('state') === 'receipt' ? 'progress' : 'finish';
    dispatch(pageActions.changeComplaintType(newViolationType));
  }, [searchParams]);

  const navigate = useNavigate();
  const handleMovePage = (complaintId) => {
    navigate(`read?state=${state}&detail=${complaintId}`, { state: { pageNo } });
  };

  const handleClickPage = (pageNo) => {
    setPageNo(pageNo);
    setSearchParams({ state, pageNo });
  };

  useEffect(() => {}, [state, pageNo]);

  return (
    <s.Container>
      <s.TypeArea>
        <s.TypeText onClick={() => handleClickIcon('progress')} color={getColor('progress')} size={getSize('progress')}>
          접수 내역
        </s.TypeText>
        <s.TypeText onClick={() => handleClickIcon('finish')} color={getColor('finish')} size={getSize('finish')}>
          완료 내역
        </s.TypeText>
      </s.TypeArea>
      <s.TableArea>
        <s.Table>
          <s.Thead>
            <s.Tr>
              <s.Th style={{ width: '10%' }}>문의 번호</s.Th>
              <s.Th style={{ width: '40%' }}>제목</s.Th>
              <s.Th style={{ width: '15%' }}>작성자</s.Th>
              <s.Th style={{ width: '10%' }}>날 짜</s.Th>
            </s.Tr>
          </s.Thead>
          <s.Tbody>
            <s.Tr onClick={() => handleMovePage()}>
              <s.Td>1</s.Td>
              <s.Td>대전 유성구 학하북로 75-21</s.Td>
              <s.Td>안전모 미착용</s.Td>
              <s.Td>24.09.01</s.Td>
            </s.Tr>
            <s.Tr>
              <s.Td>1</s.Td>
              <s.Td>대전 유성구 학하북로 75-21</s.Td>
              <s.Td>안전모 미착용</s.Td>
              <s.Td>24.09.01</s.Td>
            </s.Tr>
            <s.Tr>
              <s.Td>1</s.Td>
              <s.Td>대전 유성구 학하북로 75-21</s.Td>
              <s.Td>안전모 미착용</s.Td>
              <s.Td>24.09.01</s.Td>
            </s.Tr>
          </s.Tbody>
        </s.Table>
      </s.TableArea>
      <s.pageArea>
        <Pagination
          activePage={pageNo} // 현재 페이지
          itemsCountPerPage={10} // 한 페이지랑 보여줄 아이템 갯수
          totalItemsCount={totalPage} // 총 아이템 갯수
          pageRangeDisplayed={10} // paginator의 페이지 범위
          prevPageText={'‹'} // "이전"을 나타낼 텍스트
          nextPageText={'›'} // "다음"을 나타낼 텍스트
          onChange={handleClickPage} // 페이지 변경을 핸들링하는 함수
        />
      </s.pageArea>
    </s.Container>
  );
};

export default ComplaintList;
