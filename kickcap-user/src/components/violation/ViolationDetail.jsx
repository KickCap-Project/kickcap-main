import React from 'react';
import styled from 'styled-components';

import { ViolationType, isFlagType, ViolationDetailType } from '../../lib/data/Violation';

const s = {
  TableWrapper: styled.div`
    margin-top: 10px;
    display: flex;
    justify-content: center;
    width: 100%;
  `,
  Table: styled.table`
    width: 90%;
    font-size: 0.6rem;
    font-weight: 400;
    text-align: center;
  `,
  Tr: styled.tr``,
  Th: styled.th`
    border: 2px solid #d3d3d3;
    background-color: ${(props) => props.theme.AreaColor};
    vertical-align: middle;
    height: 1.5rem;
  `,
  Td: styled.td`
    border: 2px solid #d3d3d3;
    background-color: ${(props) => props.theme.bgColor};
    vertical-align: middle;
    height: 1.5rem;
  `,
};

const ViolationDetail = ({ detail }) => {
  const formatDate = (dateString) => {
    const [datePart, ampmPart, timePart] = dateString.split(' ');
    const [year, month, day] = datePart.split('-');
    return `${year}. ${month}. ${day}`;
  };

  const renderTableData = (key, value) => {
    switch (key) {
      case 'date':
      case 'deadLine':
        return formatDate(value);
      case 'demerit':
        return `${value} 점`;
      case 'type':
        return ViolationType[value].type;
      case 'money':
        return `${value.toLocaleString()} 원`;
      case 'isFlag':
        return isFlagType[value].status;
      default:
        return value;
    }
  };

  return (
    <s.TableWrapper>
      <s.Table>
        <tbody>
          {Object.entries(detail).map(
            ([key, value], idx) =>
              key !== 'isReq' && (
                <s.Tr key={idx}>
                  <s.Th>{ViolationDetailType[key]}</s.Th>
                  <s.Td>{renderTableData(key, value)}</s.Td>
                </s.Tr>
              ),
          )}
        </tbody>
      </s.Table>
    </s.TableWrapper>
  );
};

export default ViolationDetail;
