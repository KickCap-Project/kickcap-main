import React, { useState } from 'react';
import styled from 'styled-components';

import Button from '../Common/Button';
import Input from '../Common/Input';
import TextArea from '../Common/TextArea';

import UploadImgButton from '../../components/Report/UploadImgButtom';

const s = {
  Form: styled.form`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  `,
  ImageArea: styled.div`
    width: 100%;
    height: fit-content;
  `,
  InputArea: styled.div`
    width: 100%;
    height: fit-content;
    display: flex;
    justify-content: space-between;
  `,
  ButtonArea: styled.div`
    width: 100%;
    padding-top: 5vh;
    padding-bottom: 5vh;
    display: flex;
    justify-content: center;
  `,
};

const ReportIllegalParkingForm = () => {
  const [image, setImage] = useState('');
  const [kickboardNumber, setKickboardNumber] = useState("'");
  const [description, setDescription] = useState('');

  return (
    <s.Form>
      {image ? <s.ImageArea></s.ImageArea> : <UploadImgButton paddingY={'4vh'} />}
      <s.InputArea>
        <Input
          id={'kickboardNumber'}
          name={'kickboardNumber'}
          width={'33%'}
          height={'40px'}
          bold={'500'}
          size={'12px'}
          placeholder={'킥보드 번호판 입력'}
          text-align={'center'}
        />
        <Input
          mode={'read'}
          id={'image'}
          name={'image'}
          width={'66%'}
          height={'40px'}
          bold={'500'}
          size={'12px'}
          InputColor="AreaColor"
          placeholder={'사진 첨부 시 정보가 입력됩니다.'}
        >
          {image}
        </Input>
      </s.InputArea>
      <TextArea
        id={'desciption'}
        name={'description'}
        width={'100%'}
        height={'35vh'}
        bold={'500'}
        size={'15px'}
        placeholder={'내용을 입력하세요.'}
        margin={'10px'}
      />
      <s.ButtonArea>
        {image && kickboardNumber && description ? (
          <Button width={'90%'} height={'40px'} bold={'700'} size={'24px'}>
            작성 완료
          </Button>
        ) : (
          <Button type={'sub'} width={'90%'} height={'40px'} bold={'700'} size={'24px'}>
            작성 완료
          </Button>
        )}
      </s.ButtonArea>
    </s.Form>
  );
};

export default ReportIllegalParkingForm;
