import React from 'react';
import styled from 'styled-components';

import camera_upload from '../../asset/img/svg/camera_upload.svg';

const s = {
  Button: styled.div`
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 1vh;
    margin-bottom: 1vh;
    padding-top: ${(props) => props.paddingY};
    padding-bottom: ${(props) => props.paddingY};
  `,
  ImgContainer: styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
  `,
  ImgBox: styled.img``,
  Description: styled.div`
    width: 100%;
    text-align: center;
    color: ${(props) => props.theme.mainColor};
    word-break: keep-all;
    overflow-wrap: break-word;
  `,
};

const UploadImgButton = ({ paddingY }) => {
  const description = '킥보드 번호판이 나온 전체 상황 사진을 첨부해주세요.';
  return (
    <s.Button paddingY={paddingY}>
      <s.ImgContainer>
        <s.ImgBox src={camera_upload} />
      </s.ImgContainer>
      <s.Description>{description}</s.Description>
    </s.Button>
  );
};

export default UploadImgButton;
