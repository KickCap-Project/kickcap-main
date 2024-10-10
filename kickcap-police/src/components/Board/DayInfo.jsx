import React from 'react';
import styled from 'styled-components';
import Text from '../Common/Text';

const s = {
  Container: styled.div`
    background-color: ${(props) => props.theme.dark};
    border-radius: 10px;
    width: 190px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  `,
};

const DayInfo = ({ title, data }) => {
  return (
    <s.Container>
      <Text
        children={title}
        size={'20px'}
        bold={'600'}
        textalian={'center'}
        width={'100%'}
        color={'textBasic'}
        display={'block'}
      />
      <Text
        children={data + ' 건'}
        size={'30px'}
        bold={'600'}
        textalian={'center'}
        width={'100%'}
        color={'textBasic'}
        display={'block'}
        margin={'5px auto'}
      />
    </s.Container>
  );
};

export default DayInfo;
