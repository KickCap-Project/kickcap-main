import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../lib/hook/useReduxHook';
import { pageActions, selectComplaintNav } from '../../store/page';
import { useNavigate, useOutletContext } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import '../../styles/Pagination.css';
import Pagination from 'react-js-pagination';
import { getComplaintList, getComplaintTotalCount } from '../../lib/api/complaint-api';
import 'moment/locale/ko';
import moment from 'moment';

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
    cursor: ${(props) => props.cursor};
  `,
  Td: styled.td`
    vertical-align: middle;
    border-bottom: 1px solid ${(props) => props.theme.btnOff};
    max-width: 500px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `,
  noData: styled.td`
    vertical-align: middle;
    cursor: default;
  `,
  Th: styled.th`
    font-weight: 700;
    color: ${(props) => props.theme.mainColor};
    vertical-align: middle;
  `,
  pageArea: styled.div`
    width: 500px;
    height: 40px;
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
  const [pageNo, setPageNo] = useState(searchParams.get('pageNo'));
  const [render, setRender] = useState(false);
  const { phone, data, setData, totalPage, setTotalPage } = useOutletContext();

  useEffect(() => {
    setState(searchParams.get('state'));
    setPageNo(Number(searchParams.get('pageNo')));
    const newViolationType = searchParams.get('state') === '0' ? 'progress' : 'finish';
    dispatch(pageActions.changeComplaintType(newViolationType));
  }, [searchParams]);

  const handleClickIcon = (mode) => {
    dispatch(pageActions.changeComplaintType(mode));
    const newViolationType = mode === 'progress' ? '0' : '1';
    setSearchParams({ state: newViolationType, pageNo: 1 });
  };

  const getColor = (mode) => {
    return type === mode ? '#0054A6' : undefined;
  };
  const getSize = (mode) => {
    return type === mode ? '30px' : undefined;
  };

  const navigate = useNavigate();
  const handleMovePage = (complaintId) => {
    navigate(`read?state=${state}&detail=${complaintId}`, { state: { pageNo } });
  };

  const handleClickPage = (pageNo) => {
    setPageNo(pageNo);
    setSearchParams({ state, pageNo });
  };

  useEffect(() => {
    if (!render) {
      setRender(true);
      return;
    }
    getComplaintTotalCount(
      state,
      phone ? phone : null,
      (resp) => {
        setTotalPage(resp.data);
      },
      (error) => {
        alert('잠시 후 다시 시도해주세요.');
      },
    );
    getComplaintList(
      state,
      pageNo,
      phone ? phone : null,
      (resp) => {
        setData(resp.data);
      },
      (error) => {
        alert('잠시 후 다시 시도해주세요.');
      },
    );
  }, [state, pageNo]);

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
              <s.Th style={{ width: '30%' }}>제목</s.Th>
              <s.Th style={{ width: '10%' }}>작성자</s.Th>
              <s.Th style={{ width: '15%' }}>날 짜</s.Th>
            </s.Tr>
          </s.Thead>
          <s.Tbody>
            {data.length !== 0 ? (
              data.map((d, index) => (
                <s.Tr key={index} cursor={'pointer'} onClick={() => handleMovePage(d.idx)}>
                  <s.Td>{d.idx}</s.Td>
                  <s.Td>{d.title}</s.Td>
                  <s.Td>{d.name}</s.Td>
                  <s.Td>{moment(d.date).format('YY.MM.DD A hh:mm')}</s.Td>
                </s.Tr>
              ))
            ) : (
              <s.Tr cursor={'deafault'}>
                <s.noData colSpan={4}>내역이 존재하지 않습니다.</s.noData>
              </s.Tr>
            )}
          </s.Tbody>
        </s.Table>
      </s.TableArea>
      <s.pageArea>
        <Pagination
          activePage={Number(pageNo)}
          itemsCountPerPage={10}
          totalItemsCount={Number(totalPage)}
          pageRangeDisplayed={10}
          prevPageText={'‹'}
          nextPageText={'›'}
          onChange={handleClickPage}
        />
      </s.pageArea>
    </s.Container>
  );
};

export default ComplaintList;
