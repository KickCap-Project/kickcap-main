import React, { useState } from 'react';
import styled from 'styled-components';

import Button from '../Common/Button';
import Input from '../Common/Input';
import TextArea from '../Common/TextArea';

import { ViolationType } from '../../lib/data/Violation';
import UploadImgButton from '../../components/Report/UploadImgButtom';

import ReportGetPositionModal from '../Modal/ReportGetPositionModal';
import { useAppDispatch, useAppSelector } from '../../lib/hook/useReduxHook';
import { selectIsMap, modalActions } from '../../store/modal';
import { selectLatitude, selectLongitude, selectAddress, selectCode } from '../../store/location';

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
    height: ${(props) => props.height};
    flex-wrap: wrap;
    display: flex;
    justify-content: space-between;
  `,
  LocationArea: styled.div`
    width: 100%;
    height: fit-content;
  `,
  CheckboxArea: styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
  `,
  CheckboxWrapper: styled.div`
    width: 25%;
    height: fit-content;
    display: flex;
    justify-content: center;
    align-items: center;
  `,
  Checkbox: styled.input`
    margin-right: 5px;
  `,
  CheckboxLabel: styled.label`
    font-size: 12px;
    font-weight: 500;
    word-break: keep-all;
    overflow-wrap: break-word;
  `,
  ButtonArea: styled.div`
    width: 100%;
    padding-top: 5vh;
    padding-bottom: 5vh;
    display: flex;
    justify-content: center;
  `,
};

const ReportMisuseForm = () => {
  const violationTypeIdx = [3, 1, 2, 5];

  const [image, setImage] = useState('');
  const [kickboardNumber, setKickboardNumber] = useState('');
  const [violations, setViolations] = useState(() => {
    const initialState = {};
    violationTypeIdx.forEach((idx) => {
      initialState[ViolationType[idx].type] = false;
    });
    return initialState;
  });
  const [description, setDescription] = useState('');

  const isMap = useAppSelector(selectIsMap);
  const latitude = useAppSelector(selectLatitude) || null;
  const longitude = useAppSelector(selectLongitude) || null;
  const address = useAppSelector(selectAddress) || '';
  const code = useAppSelector(selectCode) || '';
  const dispatch = useAppDispatch();

  const handleOpenMapModal = (isFlag) => {
    dispatch(modalActions.ChangeIsMap(isFlag));
  };

  return (
    <s.Form>
      {image ? <s.ImageArea></s.ImageArea> : <UploadImgButton paddingY={'1vh'} />}
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
        <s.InputArea height={'10px'} />
        <s.LocationArea onClick={() => handleOpenMapModal(true)}>
          <Input
            mode={'read'}
            id={'location'}
            name={'location'}
            width={'100%'}
            height={'40px'}
            bold={'500'}
            size={'15px'}
            InputColor="AreaColor"
            placeholder={address ? address : '클릭하여 위치정보를 입력해주세요.'}
            value={address}
          />
        </s.LocationArea>
      </s.InputArea>
      <s.CheckboxArea>
        {violationTypeIdx.map((value, idx) => (
          <s.CheckboxWrapper key={idx}>
            <s.Checkbox type="checkbox" id={`checkbox-${idx}`} name={ViolationType[value].type} />
            <s.CheckboxLabel htmlFor={`checkbox-${idx}`}>{ViolationType[value].type}</s.CheckboxLabel>
          </s.CheckboxWrapper>
        ))}
      </s.CheckboxArea>
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
        {image && kickboardNumber && address && latitude && longitude && code && description ? (
          <Button width={'90%'} height={'40px'} bold={'700'} size={'24px'}>
            작성 완료
          </Button>
        ) : (
          <Button type={'sub'} width={'90%'} height={'40px'} bold={'700'} size={'24px'}>
            작성 완료
          </Button>
        )}
      </s.ButtonArea>

      <ReportGetPositionModal open={isMap} toggleModal={handleOpenMapModal} />
    </s.Form>
  );
};

export default ReportMisuseForm;
