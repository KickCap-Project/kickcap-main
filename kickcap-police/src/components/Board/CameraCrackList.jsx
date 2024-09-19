import React, { useState } from 'react';
import styled from 'styled-components';
import Text from '../Common/Text';
import Button from '../Common/Button';

const s = {
  Container: styled.section`
    width: 100%;
    background-color: #242239;
    border-radius: 10px;
    border: 1px solid red;
    margin: 0 auto 10px;
    cursor: pointer;
  `,
  TopArea: styled.div`
    width: 90%;
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 auto;
    border: 1px solid wheat;
  `,
  ImgArea: styled.div`
    width: 80%;
    height: 300px;
    margin: 20px auto;
    border: 1px solid red;
  `,
  BtnArea: styled.div`
    width: 80%;
    margin: 20px auto;
    border: 1px solid white;
    display: flex;
    justify-content: end;
    align-items: center;
  `,
};

const CameraCrackList = ({ data }) => {
  const [visibleIndex, setVisibleIndex] = useState(null);
  const toggleDetail = (index) => {
    if (index === visibleIndex) {
      setVisibleIndex(null);
    } else {
      setVisibleIndex(index);
    }
  };
  return (
    <s.Container onClick={() => toggleDetail(data.idx)}>
      <s.TopArea>
        <Text
          bold={'500'}
          display={'block'}
          size={'20px'}
          children={data.type}
          color={'textBasic'}
          cursor={'pointer'}
        />
        <Text
          bold={'500'}
          display={'block'}
          size={'20px'}
          children={data.date}
          color={'textBasic'}
          cursor={'pointer'}
        />
      </s.TopArea>
      {data.idx === visibleIndex ? (
        <>
          <s.ImgArea></s.ImgArea>
          <s.BtnArea>
            <Button bold={'700'} children={'상세정보'} height={'40px'} width={'120px'} size={'20px'} />
          </s.BtnArea>
        </>
      ) : null}
    </s.Container>
  );
};

export default CameraCrackList;
