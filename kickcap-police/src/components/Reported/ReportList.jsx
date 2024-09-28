import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../lib/hook/useReduxHook';
import { pageActions, selectReportNav } from '../../store/page';
import { useNavigate } from 'react-router';
import Button from './../Common/Button';
import Input from './../Common/Input';
import {
  getListDetail,
  getReportEndList,
  getReportEndTotalCount,
  getReportList,
  getReportTotalCount,
} from '../../lib/api/report-api';
import moment from 'moment';
import Pagination from 'react-js-pagination';
import ReactPaginate from 'react-paginate';
import { useSearchParams } from 'react-router-dom';
import '../../styles/Pagination.css';

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
    font-size: 20px;
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
    border: 1px solid red;
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
  const [test, setTest] = useState(1);
  const [violationType, setViolationType] = useState(searchParams.get('violationType'));
  const [totalPage, setTotalPage] = useState(0);
  const [pageNo, setPageNo] = useState(Number(searchParams.get('pageNo')));
  const [isEnd, setIsEnd] = useState(false);
  const [data, setData] = useState([]);
  const handleClickIcon = (mode) => {
    dispatch(pageActions.changeReportType(mode));
    const newViolationType =
      mode === 'park' ? 4 : mode === 'helmet' ? 3 : mode === 'peoples' ? 1 : mode === 'sideWalk' ? 2 : 5;
    setSearchParams({ violationType: newViolationType, pageNo: 1 });
  };

  useEffect(() => {
    // alert(pageNo);
    setViolationType(searchParams.get('violationType'));
    setPageNo(Number(searchParams.get('pageNo')));
    const newViolationType =
      searchParams.get('violationType') == 4
        ? 'park'
        : searchParams.get('violationType') == 3
        ? 'helmet'
        : searchParams.get('violationType') == 1
        ? 'peoples'
        : searchParams.get('violationType') == 2
        ? 'sideWalk'
        : 'read';
    dispatch(pageActions.changeReportType(newViolationType));
  }, [searchParams]);

  const getColor = (mode) => {
    return type === mode ? '#0054A6' : undefined;
  };
  const getSize = (mode) => {
    return type === mode ? '30px' : undefined;
  };

  const navigate = useNavigate();
  const handleMovePage = (reportId) => {
    navigate(`read?violationType=${violationType}&detail=${reportId}`, { state: { pageNo } });
  };

  const handleClickPage = (pageNo) => {
    setPageNo(pageNo);
    setTest(pageNo);
    setSearchParams({ violationType, pageNo });
  };

  useEffect(() => {
    if (isEnd) {
      // 완료
      getReportEndTotalCount(
        violationType,
        (resp) => {
          setTotalPage(resp.data);
        },
        (error) => {
          alert('잠시 후 다시 시도해주세요.');
        },
      );
      getReportEndList(
        violationType,
        pageNo,
        (resp) => {
          setData(resp.data);
        },
        (error) => {
          alert('잠시 후 다시 시도해주세요.');
        },
      );
    } else {
      // 일반
      getReportTotalCount(
        violationType,
        (resp) => {
          setTotalPage(resp.data);
        },
        (error) => {
          alert('잠시 후 다시 시도해주세요.');
        },
      );
      getReportList(
        violationType,
        pageNo,
        (resp) => {
          setData(resp.data);
        },
        (error) => {
          alert('잠시 후 다시 시도해주세요.');
        },
      );
    }
  }, [violationType, isEnd, pageNo]);
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
              <s.Th style={{ width: '55%' }}>단속 주소</s.Th>
              <s.Th style={{ width: '10%' }}>날 짜</s.Th>
            </s.Tr>
          </s.Thead>
          <s.Tbody>
            {data.map((d, index) => (
              <s.Tr key={index} onClick={() => handleMovePage(d.idx)}>
                <s.Td>{d.idx}</s.Td>
                <s.Td>{d.addr}</s.Td>
                <s.Td>{moment(d.reportTime).format('YY-MM-DD')}</s.Td>
              </s.Tr>
            ))}
          </s.Tbody>
        </s.Table>
      </s.TableArea>
      <s.PageFooter>
        <s.BtnArea></s.BtnArea>
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
          {/* <ReactPaginate
            pageCount={totalPage}
            previousLabel={'<'}
            nextLabel={'>'}
            onPageChange={handleClickPage}
            pageRangeDisplayed={10}
            renderOnZeroPageCount={null}
          /> */}
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
          <s.Label htmlFor="ok">완료 건 조회</s.Label>
        </s.BtnArea>
      </s.PageFooter>
    </s.Container>
  );
};

export default ReportList;
