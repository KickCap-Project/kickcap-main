import React from 'react';
import styled from 'styled-components';

import { ViolationType, isFlagType } from '../../lib/data/Violation';
import { useNavigate } from 'react-router';
import { convertToKoreanTimeString } from '../../lib/data/ConvertTime';

const s = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    background-color: ${(props) => props.theme.bgColor};
  `,
  Card: styled.div`
    background-color: ${(props) => props.color};
    border-radius: 0.5rem;
    width: 100%;
    height: 100px;
    padding-left: 5%;
    margin-bottom: 2%;
    color: ${(props) =>
      props.color === isFlagType[0].color || props.color === isFlagType[1].color ? '#000000' : '#FFFFFF'};
    box-shadow: 0px 4px 5px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    justify-content: center;
    cursor: pointer;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 5px 2px, rgba(0, 0, 0, 0.3) 0px 3px 3px;
  `,
  CardRow: styled.div`
    display: flex;
    gap: 3%;
    margin-top: 1%;
    margin-bottom: 1%;
  `,
  CardRowTitle: styled.div`
    font-size: 15px;
    font-weight: 700;
  `,
  CardRowContent: styled.div`
    font-size: 15px;
    font-weight: 400;
  `,
};

const ViolationList = ({ vList }) => {
  // onClick event handler function
  const onClickCardFunction = (violation) => {
    console.log(`onClick: ${violation.idx}`);
  };

  const navigate = useNavigate();
  const handleMovePage = (idx) => {
    navigate('detail', { state: { idx } });
  };

  return (
    <s.Container>
      {vList.map((violation) => (
        <s.Card
          key={violation.idx}
          color={isFlagType[violation.isFlag].color}
          onClick={() => handleMovePage(violation.idx)}
        >
          <s.CardRow>
            <s.CardRowTitle>위반일시</s.CardRowTitle>
            <s.CardRowContent>{convertToKoreanTimeString(violation.date)}</s.CardRowContent>
          </s.CardRow>
          <s.CardRow>
            <s.CardRowTitle>위반내용</s.CardRowTitle>
            <s.CardRowContent>{ViolationType[violation.violationType].type}</s.CardRowContent>
          </s.CardRow>
          <s.CardRow>
            <s.CardRowTitle>납부기한</s.CardRowTitle>
            <s.CardRowContent>{violation.deadLine}</s.CardRowContent>
          </s.CardRow>
        </s.Card>
      ))}
    </s.Container>
  );
};

export default ViolationList;
