import React from 'react';
import styled from 'styled-components';

import { ViolationType, isFlagType } from '../../lib/data/Violation';

const s = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    background-color: ${(props) => props.theme.bgColor};
  `,
  Index: styled.div`
    display: flex;
    justify-content: center;
    padding: 3%;
    gap: 4%;
  `,
  IndexContent: styled.div`
    width: fit-content;
    display: flex;
    justify-content: center;
    align-items: center;
  `,
  IndexColor: styled.div`
    width: 25px;
    height: 15px;
    background-color: ${(props) => props.color};
    margin-right: 3px;
  `,
  IndexTag: styled.div`
    white-space: nowrap;
    font-size: 10px;
    font-weight: 800;
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
    display: flex;
    flex-direction: column;
    justify-content: center;
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

const IndexComponent = ({ color, title }) => {
  return (
    <s.IndexContent>
      <s.IndexColor color={color} />
      <s.IndexTag>{title}</s.IndexTag>
    </s.IndexContent>
  );
};

const ViolationList = ({ violationList }) => {
  // onClick event handler function
  const onClickCardFunction = (violation) => {
    console.log(`onClick: ${violation.idx}`);
  };

  return (
    <s.Container>
      <s.Index>
        {Array.from({ length: 4 }, (_, idx) => (
          <IndexComponent key={idx} color={isFlagType[idx].color} title={isFlagType[idx].status} />
        ))}
      </s.Index>

      {violationList.map((violation) => (
        <s.Card
          key={violation.idx}
          color={isFlagType[violation.isFlag].color}
          onClick={() => onClickCardFunction(violation)}
        >
          <s.CardRow>
            <s.CardRowTitle>위반일시</s.CardRowTitle>
            <s.CardRowContent>{violation.date}</s.CardRowContent>
          </s.CardRow>
          <s.CardRow>
            <s.CardRowTitle>위반내용</s.CardRowTitle>
            <s.CardRowContent>{ViolationType[violation.type].type}</s.CardRowContent>
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
