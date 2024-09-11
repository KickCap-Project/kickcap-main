import React from 'react';
import styled from 'styled-components';

import Text from '../Common/Text';

const s = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    min-height: 100vh;
    background-color: ${(props) => props.theme.bgColor};
  `,
  Index: styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
    height: 10%;
  `,
  IndexColor: styled.div`
    width: 10px;
    height: 5px;
    background-color: ${(props) => props.color};
  `,
  IndexTag: styled(Text)``,
};

const IndexComponent = ({ color, title }) => {
  return (
    <div>
      <s.IndexColor color={color} />
      <s.IndexTag>{title}</s.IndexTag>
    </div>
  );
};

const ViolenceList = () => {
  return (
    <s.Container>
      <s.Index>
        <IndexComponent color="#f5f7fa" title="미납" />
        <IndexComponent color="#d3d3d3" title="완납" />
        <IndexComponent color="#0054A6" title="이의 중" />
        <IndexComponent color="#FF6E65" title="마감 2일 전" />
      </s.Index>
    </s.Container>
  );
};

export default ViolenceList;
