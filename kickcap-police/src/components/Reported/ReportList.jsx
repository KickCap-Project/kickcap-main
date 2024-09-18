import React from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../lib/hook/useReduxHook';
import { pageActions, selectReportNav } from '../../store/page';

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
  pageArea: styled.div`
    width: 500px;
    height: 40px;
    border: 1px solid red;
    margin: 20px auto;
  `,
};

const ReportList = () => {
  const type = useAppSelector(selectReportNav);
  const dispatch = useAppDispatch();
  const handleClickIcon = (mode) => {
    dispatch(pageActions.changeReportType(mode));
  };

  const getColor = (mode) => {
    return type === mode ? '#0054A6' : undefined;
  };
  const getSize = (mode) => {
    return type === mode ? '30px' : undefined;
  };
  return (
    <s.Container>
      <s.TypeArea>
        <s.TypeText onClick={() => handleClickIcon('park')} color={getColor('park')} size={getSize('park')}>
          불법 주차
        </s.TypeText>
        <s.TypeText onClick={() => handleClickIcon('helmet')} color={getColor('helmet')} size={getSize('helmet')}>
          안전모 미착용
        </s.TypeText>
        <s.TypeText onClick={() => handleClickIcon('peoples')} color={getColor('peoples')} size={getSize('peoples')}>
          다인 승차
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
            <s.Tr>
              <s.Td>1</s.Td>
              <s.Td>대전 유성구 학하북로 75-21</s.Td>
              <s.Td>24.09.01</s.Td>
            </s.Tr>
            <s.Tr>
              <s.Td>1</s.Td>
              <s.Td>대전 유성구 학하북로 75-21</s.Td>
              <s.Td>24.09.01</s.Td>
            </s.Tr>
            <s.Tr>
              <s.Td>1</s.Td>
              <s.Td>대전 유성구 학하북로 75-21</s.Td>
              <s.Td>24.09.01</s.Td>
            </s.Tr>
            <s.Tr>
              <s.Td>1</s.Td>
              <s.Td>대전 유성구 학하북로 75-21</s.Td>
              <s.Td>24.09.01</s.Td>
            </s.Tr>
            <s.Tr>
              <s.Td>1</s.Td>
              <s.Td>대전 유성구 학하북로 75-21</s.Td>
              <s.Td>24.09.01</s.Td>
            </s.Tr>
            <s.Tr>
              <s.Td>1</s.Td>
              <s.Td>대전 유성구 학하북로 75-21</s.Td>
              <s.Td>24.09.01</s.Td>
            </s.Tr>
            <s.Tr>
              <s.Td>1</s.Td>
              <s.Td>대전 유성구 학하북로 75-21</s.Td>
              <s.Td>24.09.01</s.Td>
            </s.Tr>
            <s.Tr>
              <s.Td>1</s.Td>
              <s.Td>대전 유성구 학하북로 75-21</s.Td>
              <s.Td>24.09.01</s.Td>
            </s.Tr>
            <s.Tr>
              <s.Td>1</s.Td>
              <s.Td>대전 유성구 학하북로 75-21</s.Td>
              <s.Td>24.09.01</s.Td>
            </s.Tr>
            <s.Tr>
              <s.Td>1</s.Td>
              <s.Td>대전 유성구 학하북로 75-21</s.Td>
              <s.Td>24.09.01</s.Td>
            </s.Tr>
          </s.Tbody>
        </s.Table>
      </s.TableArea>
      <s.pageArea></s.pageArea>
    </s.Container>
  );
};

export default ReportList;
