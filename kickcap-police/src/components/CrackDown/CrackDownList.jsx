import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../lib/hook/useReduxHook';
import { pageActions, selectCrackNav } from '../../store/page';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import Pagination from 'react-js-pagination';
import '../../styles/Pagination.css';
import { getCrackList, getCrackTotalCount } from './../../lib/api/crack-api';
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

const CrackDownList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const type = useAppSelector(selectCrackNav);
  const dispatch = useAppDispatch();
  const [violationType, setViolationType] = useState(searchParams.get('violationType'));
  const [totalPage, setTotalPage] = useState(0);
  const [pageNo, setPageNo] = useState(searchParams.get('pageNo'));
  const [data, setData] = useState([]);

  useEffect(() => {
    setViolationType(searchParams.get('violationType'));
    setPageNo(Number(pageNo));
    const newViolationType = searchParams.get('violationType') == 3 ? 'helmet' : 'peoples';
    dispatch(pageActions.changeCrackType(newViolationType));
  }, [searchParams]);

  const handleClickIcon = (mode) => {
    dispatch(pageActions.changeCrackType(mode));
    const newViolationType = mode === 'helmet' ? 3 : 1;
    setSearchParams({ violationType: newViolationType, pageNo: 1 });
  };

  const getColor = (mode) => {
    return type === mode ? '#0054A6' : undefined;
  };
  const getSize = (mode) => {
    return type === mode ? '30px' : undefined;
  };

  const navigate = useNavigate();
  const handleMovePage = (crackId) => {
    navigate('read');
    navigate(`read?violationType=${violationType}&detail=${crackId}`, { state: { pageNo } });
  };

  const handleClickPage = (pageNo) => {
    setPageNo(pageNo);
    setSearchParams({ violationType, pageNo });
  };

  useEffect(() => {
    getCrackTotalCount(
      violationType,
      (resp) => {
        setTotalPage(resp.data);
      },
      (error) => {
        alert('잠시 후 다시 시도해주세요.');
      },
    );
    getCrackList(
      violationType,
      pageNo,
      (resp) => {
        setData(resp.data);
      },
      (error) => {
        alert('잠시 후 다시 시도해주세요.');
      },
    );
  }, [violationType, pageNo]);

  return (
    <s.Container>
      <s.TypeArea>
        <s.TypeText onClick={() => handleClickIcon('helmet')} color={getColor('helmet')} size={getSize('helmet')}>
          안전모 미착용
        </s.TypeText>
        <s.TypeText onClick={() => handleClickIcon('peoples')} color={getColor('peoples')} size={getSize('peoples')}>
          다인 승차
        </s.TypeText>
      </s.TypeArea>
      <s.TableArea>
        <s.Table>
          <s.Thead>
            <s.Tr>
              <s.Th style={{ width: '10%' }}>단속 번호</s.Th>
              <s.Th style={{ width: '40%' }}>단속 주소</s.Th>
              <s.Th style={{ width: '15%' }}>단속 종류</s.Th>
              <s.Th style={{ width: '10%' }}>날 짜</s.Th>
            </s.Tr>
          </s.Thead>
          <s.Tbody>
            {data.length !== 0 ? (
              data.map((d, index) => (
                <s.Tr key={index} onClick={() => handleMovePage()}>
                  <s.Td>{d.idx}</s.Td>
                  <s.Td>{d.addr}</s.Td>
                  <s.Td>{d.type}</s.Td>
                  <s.Td>{moment(d.date).format('YY-MM-DD')}</s.Td>
                </s.Tr>
              ))
            ) : (
              <s.Tr>
                <s.noData colSpan={4}>내역이 존재하지 않습니다.</s.noData>
              </s.Tr>
            )}
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

export default CrackDownList;
