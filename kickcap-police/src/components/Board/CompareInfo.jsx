import React from 'react';
import styled from 'styled-components';
import Text from '../Common/Text';

const s = {
  Container: styled.div`
    background-color: ${(props) => props.theme.dark};
    border-radius: 10px;
    width: 190px;
    height: 100%;
    border: 1px solid red;
    display: flex;
    flex-direction: column;
    justify-content: center;
  `,
};

const CompareInfo = ({ title, data }) => {
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
      {data > 0 ? (
        <Text
          children={data + '%'}
          size={'30px'}
          bold={'600'}
          textalian={'center'}
          width={'100%'}
          color={'positive'}
          display={'block'}
          margin={'5px auto'}
        />
      ) : (
        <Text
          children={data + '%'}
          size={'30px'}
          bold={'600'}
          textalian={'center'}
          width={'100%'}
          color={'negative'}
          display={'block'}
          margin={'5px auto'}
        />
      )}
    </s.Container>
  );
};

export default CompareInfo;
