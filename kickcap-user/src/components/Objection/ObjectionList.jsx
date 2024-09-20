import React from 'react';
import styled from 'styled-components';

const s = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: fit-content;
    background-color: ${(props) => props.theme.bgColor};
  `,
  Card: styled.div`
    background-color: ${(props) => props.theme.AreaColor};
    width: 100%;
    height: 80px;
    flex-shrink: 0;
    border-radius: 1rem;
    display: flex;
    box-shadow: 0px 4px 5px rgba(0, 0, 0, 0.2);
    margin-bottom: 10px;
  `,
  CardColumn: styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: ${(props) => (props.type === 'title' ? '35%' : '65%')};
  `,
  CardTitle: styled.div`
    font-size: 15px;
    font-weight: 700;
    margin-bottom: ${(props) => (props.margin ? props.margin : '')};
  `,
  CardContent: styled.div`
    font-size: 15px;
    font-weight: 400;
    margin-bottom: ${(props) => (props.margin ? props.margin : '')};
  `,
};

const ObjectionList = ({ objectionList }) => {
  const TEXTLINE_MARGIN = '12px';

  const onClickCardFunction = (objection) => {
    console.log(`onClick: ${objection.idx}`);

    // navigate
  };

  return (
    <s.Container>
      {objectionList.map((objection) => (
        <s.Card key={objection.idx} onClick={() => onClickCardFunction(objection)}>
          <s.CardColumn type="title">
            <s.CardTitle margin={TEXTLINE_MARGIN}>접수 날짜</s.CardTitle>
            <s.CardTitle>제 목</s.CardTitle>
          </s.CardColumn>
          <s.CardColumn type="content">
            <s.CardContent margin={TEXTLINE_MARGIN}>{objection.date}</s.CardContent>
            <s.CardContent>{objection.title}</s.CardContent>
          </s.CardColumn>
        </s.Card>
      ))}
    </s.Container>
  );
};

export default ObjectionList;
