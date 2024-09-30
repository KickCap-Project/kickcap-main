import React from 'react';
import styled from 'styled-components';

const s = {
  Table: styled.table`
    width: 100%;
    margin: 0 auto;
  `,
  Tbody: styled.tbody`
    text-align: center;
  `,
  Tr: styled.tr`
    width: 100%;
    height: 40px;
    cursor: default;
    font-size: 17px;
  `,
  Td: styled.td`
    vertical-align: middle;
    border: 1px solid ${(props) => props.theme.textBasic2};
  `,
  Th: styled.th`
    font-weight: 700;
    color: ${(props) => props.theme.textBasic2};
    vertical-align: middle;
    background-color: ${(props) => props.theme.AreaColor};
    border: 1px solid ${(props) => props.theme.textBasic2};
  `,
};

const CrackInfoTable = ({ data }) => {
  return (
    <s.Table>
      <s.Tbody>
        <s.Tr>
          <s.Th>킥보드 번호</s.Th>
          <s.Td>{data.kick}</s.Td>
        </s.Tr>
        <s.Tr>
          <s.Th>사용자 이름</s.Th>
          <s.Td>{data.name}</s.Td>
        </s.Tr>
        <s.Tr>
          <s.Th>연락처</s.Th>
          <s.Td>{data.phone}</s.Td>
        </s.Tr>
        <s.Tr>
          <s.Th>사용자 벌점</s.Th>
          <s.Td>{data.demerit}점</s.Td>
        </s.Tr>
        <s.Tr>
          <s.Th>최근 단속 정보</s.Th>
          <s.Td>{data.history !== null ? data.history : '없음'}</s.Td>
        </s.Tr>
      </s.Tbody>
    </s.Table>
  );
};

export default CrackInfoTable;
