import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../lib/hook/useReduxHook';
import { pageActions, selectReportNav } from '../../store/page';
import { useNavigate } from 'react-router';
import Input from './../Common/Input';
import { getReportEndList, getReportEndTotalCount, getReportList, getReportTotalCount } from '../../lib/api/report-api';
import moment from 'moment';
import Pagination from 'react-js-pagination';
import { useSearchParams } from 'react-router-dom';
import '../../styles/Pagination.css';
import { useQuery } from '@tanstack/react-query';
import 'moment/locale/ko';

const s = {
  Container: styled.div`
    width: 90%;
    margin: 0 auto;
  `,
  TypeArea: styled.div`
    width: 80%;
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
    font-size: ${(props) => props.size || '20px'};
    color: ${(props) => props.color || props.theme.textBasic2};
    cursor: pointer;
    &:hover {
      font-size: 25px;
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
    max-width: 700px;
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
  PageFooter: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 90%;
    margin: 0 auto;
  `,
  Label: styled.label`
    font-weight: 700;
    font-size: 15px;
    cursor: pointer;
  `,
  BtnArea: styled.div`
    width: 150px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
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

const ReportList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const type = useAppSelector(selectReportNav);
  const dispatch = useAppDispatch();
  const [violationType, setViolationType] = useState(searchParams.get('violationType'));
  const [pageNo, setPageNo] = useState(Number(searchParams.get('pageNo')));
  const [isEnd, setIsEnd] = useState(false);

  const handleClickIcon = (mode) => {
    dispatch(pageActions.changeReportType(mode));
    const newViolationType =
      mode === 'park' ? 4 : mode === 'helmet' ? 3 : mode === 'peoples' ? 1 : mode === 'sideWalk' ? 2 : 5;
    setSearchParams({ violationType: newViolationType, pageNo: 1 });
  };

  const getColor = (mode) => {
    return type === mode ? '#0054A6' : undefined;
  };
  const getSize = (mode) => {
    return type === mode ? '25px' : undefined;
  };

  const {
    data: totalPage,
    error: totalPageError,
    refetch: refetchTotalPage,
  } = useQuery({
    queryKey: ['reportTotalPage', searchParams.get('violationType')],
    queryFn: () => {
      return isEnd
        ? getReportEndTotalCount(searchParams.get('violationType'))
        : getReportTotalCount(searchParams.get('violationType'));
    },
    enabled: false,
  });

  const {
    data: reportData = [],
    error: reportDataError,
    refetch: refetchReportData,
  } = useQuery({
    queryKey: ['reportData', searchParams.get('violationType'), searchParams.get('pageNo')],
    queryFn: () => {
      return isEnd
        ? getReportEndList(searchParams.get('violationType'), searchParams.get('pageNo'))
        : getReportList(searchParams.get('violationType'), searchParams.get('pageNo'));
    },
    enabled: false,
  });

  if (totalPageError || reportDataError) {
    alert('데이터를 불러오는 도중 에러가 발생했습니다.');
  }

  useEffect(() => {
    setViolationType(searchParams.get('violationType'));
    setPageNo(Number(searchParams.get('pageNo')));
    const newViolationType =
      searchParams.get('violationType') === '4'
        ? 'park'
        : searchParams.get('violationType') === '3'
        ? 'helmet'
        : searchParams.get('violationType') === '1'
        ? 'peoples'
        : searchParams.get('violationType') === '2'
        ? 'sideWalk'
        : 'road';
    dispatch(pageActions.changeReportType(newViolationType));
    refetchTotalPage();
    refetchReportData();
  }, [searchParams, isEnd]);

  const navigate = useNavigate();
  const handleMovePage = (reportId) => {
    navigate(`read?violationType=${violationType}&detail=${reportId}`, { state: { pageNo } });
  };

  const handleClickPage = (pageNo) => {
    setPageNo(pageNo);
    setSearchParams({ violationType, pageNo });
  };
  return (
    <s.Container>
      <s.TypeArea>
        <s.TypeText onClick={() => handleClickIcon('helmet')} color={getColor('helmet')} size={getSize('helmet')}>
          안전모 미착용
        </s.TypeText>
        <s.TypeText onClick={() => handleClickIcon('peoples')} color={getColor('peoples')} size={getSize('peoples')}>
          다인 승차
        </s.TypeText>
        <s.TypeText onClick={() => handleClickIcon('park')} color={getColor('park')} size={getSize('park')}>
          불법 주차
        </s.TypeText>
        <s.TypeText onClick={() => handleClickIcon('sideWalk')} color={getColor('sideWalk')} size={getSize('sideWalk')}>
          보도 주행
        </s.TypeText>
        <s.TypeText onClick={() => handleClickIcon('road')} color={getColor('road')} size={getSize('road')}>
          지정차로 위반
        </s.TypeText>
      </s.TypeArea>
      <s.TableArea>
        <s.Table>
          <s.Thead>
            <s.Tr>
              <s.Th style={{ width: '10%' }}>신고 번호</s.Th>
              <s.Th style={{ width: '50%' }}>단속 주소</s.Th>
              <s.Th style={{ width: '20%' }}>날 짜</s.Th>
            </s.Tr>
          </s.Thead>
          <s.Tbody>
            {reportData.length !== 0 ? (
              reportData.map((d, index) => (
                <s.Tr key={index} cursor={'pointer'} onClick={() => handleMovePage(d.idx)}>
                  <s.Td>{d.idx}</s.Td>
                  <s.Td>{d.addr}</s.Td>
                  <s.Td>{moment(d.createTime).format('YY.MM.DD A hh:mm')}</s.Td>
                </s.Tr>
              ))
            ) : (
              <s.Tr cursor={'deafault'}>
                <s.noData colSpan={3}>내역이 존재하지 않습니다.</s.noData>
              </s.Tr>
            )}
          </s.Tbody>
        </s.Table>
      </s.TableArea>
      <s.PageFooter>
        <s.BtnArea></s.BtnArea>
        <s.pageArea>
          <Pagination
            activePage={Number(pageNo)} // 현재 페이지
            itemsCountPerPage={10} // 한 페이지랑 보여줄 아이템 갯수
            totalItemsCount={Number(totalPage)} // 총 아이템 갯수
            pageRangeDisplayed={10} // paginator의 페이지 범위
            prevPageText={'‹'} // "이전"을 나타낼 텍스트
            nextPageText={'›'} // "다음"을 나타낼 텍스트
            onChange={handleClickPage} // 페이지 변경을 핸들링하는 함수
          />
        </s.pageArea>
        <s.BtnArea>
          <Input
            type={'checkBox'}
            bold={'700'}
            size={'20px'}
            margin={'0 5px'}
            id={'ok'}
            width={'20px'}
            height={'20px'}
            checked={isEnd}
            onChange={() => setIsEnd(!isEnd)}
          />
          <s.Label htmlFor="ok">처리완료건 조회</s.Label>
        </s.BtnArea>
      </s.PageFooter>
    </s.Container>
  );
};

export default ReportList;
