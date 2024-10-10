import React, { useState } from 'react';
import styled from 'styled-components';
import Text from '../Common/Text';
import Button from '../Common/Button';
import { useNavigate } from 'react-router';

const s = {
  Container: styled.section`
    width: 100%;
    background-color: #242239;
    border-radius: 10px;
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
  `,
  ImgArea: styled.div`
    width: 80%;
    height: 300px;
    margin: 10px auto;
    background-image: url(${(props) => props.img});
  `,
  BtnArea: styled.div`
    width: 80%;
    margin: 10px auto;
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

  const navigate = useNavigate();
  const handleMovePage = (crackId, violationType) => {
    navigate(`/crackdown/read?violationType=${violationType}&detail=${crackId}`);
  };
  return (
    <s.Container onClick={() => toggleDetail(data.idx)}>
      <s.TopArea>
        <Text
          bold={'500'}
          display={'block'}
          size={'20px'}
          children={data.type === 3 ? '안전모 미착용' : '다인 승차'}
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
          <s.ImgArea img={data.img} />
          <s.BtnArea>
            <Button
              bold={'700'}
              children={'상세정보'}
              height={'40px'}
              width={'120px'}
              size={'20px'}
              display={'block'}
              margin={'10px 0'}
              onClick={() => {
                handleMovePage(data.idx, data.type);
              }}
            />
          </s.BtnArea>
        </>
      ) : null}
    </s.Container>
  );
};

export default CameraCrackList;
