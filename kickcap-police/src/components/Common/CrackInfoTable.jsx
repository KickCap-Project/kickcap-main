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

const CrackInfoTable = () => {
  return (
    <s.Table>
      <s.Tbody>
        <s.Tr>
          <s.Th>CCTV 번호</s.Th>
          <s.Td>1111</s.Td>
        </s.Tr>
        <s.Tr>
          <s.Th>킥보드 번호</s.Th>
          <s.Td>000-D0000</s.Td>
        </s.Tr>
        <s.Tr>
          <s.Th>사용자 이름</s.Th>
          <s.Td>홍길동</s.Td>
        </s.Tr>
        <s.Tr>
          <s.Th>연락처</s.Th>
          <s.Td>010-1111-1111</s.Td>
        </s.Tr>
        <s.Tr>
          <s.Th>사용자 벌점</s.Th>
          <s.Td>5점</s.Td>
        </s.Tr>
        <s.Tr>
          <s.Th>최근 단속 정보</s.Th>
          <s.Td>2024. 09. 02 / 안전모 미착용</s.Td>
        </s.Tr>
      </s.Tbody>
    </s.Table>
  );
};

export default CrackInfoTable;
