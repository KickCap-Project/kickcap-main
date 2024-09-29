import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import { localAxios } from '../../util/axios-setting';
import EXIF from 'exif-js';
import { uploadImg } from '../../lib/api/report-api';

import Button from '../Common/Button';
import Input from '../Common/Input';
import TextArea from '../Common/TextArea';

import { ViolationType } from '../../lib/data/Violation';
import UploadImgButton from '../../components/Report/UploadImgButtom';

import ReportGetPositionModal from '../Modal/ReportGetPositionModal';
import { useAppDispatch, useAppSelector } from '../../lib/hook/useReduxHook';
import { selectIsMap, modalActions } from '../../store/modal';
import { selectLatitude, selectLongitude, selectAddress, selectCode } from '../../store/location';

import { convertExifToISO } from '../../lib/data/ConvertTime';

const s = {
  Form: styled.form`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  `,
  ImageArea: styled.div`
    width: 70%;
    /* height: fit-content; */
    position: relative;
    margin: 20px auto;
  `,
  Image: styled.img`
    width: 100%;
    max-height: 300px;
  `,
  ImageBtn: styled.button`
    width: 30px;
    height: 30px;
    border-radius: 50%;
    position: absolute;
    background-color: ${(props) => props.theme.AreaColor};
    color: ${(props) => props.theme.textBasic2};
    font-weight: 900;
    margin: 10px;
    right: 0;
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
  const axiosInstance = localAxios();
  const navigate = useNavigate();
  const typeIdx = [3, 1, 2, 5]; // 순서: 안전모 미착용, 다인 승차, 보도 주행, 지정 차로 위반

  const [imgFile, setImgFile] = useState('');
  const [selectedImage, setSelectedImage] = useState('');

  const [description, setDescription] = useState('');
  const [kickboardNumber, setKickboardNumber] = useState('');
  const [date, setDate] = useState(null);

  const [typeRequest, setTypeRequest] = useState(null);

  const [typeCheck, setTypeCheck] = useState(() => {
    const initialState = {};
    typeIdx.forEach((idx) => {
      initialState[ViolationType[idx].type] = false;
    });
    return initialState;
  });

  const isMap = useAppSelector(selectIsMap);
  const latitude = useAppSelector(selectLatitude) || null;
  const longitude = useAppSelector(selectLongitude) || null;
  const address = useAppSelector(selectAddress) || '';
  const code = useAppSelector(selectCode) || '';
  const dispatch = useAppDispatch();

  const handleOpenMapModal = (isFlag) => {
    dispatch(modalActions.ChangeIsMap(isFlag));
  };

  const fileInputRef = useRef(null);

  const handleChangeKickNumber = (e) => {
    setKickboardNumber(e.target.value);
  };

  const handleChangeDescription = (e) => {
    setDescription(e.target.value);
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDeleteClick = () => {
    setSelectedImage('');
    setImgFile('');
    setDate('');
    fileInputRef.current.value = '';
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImgFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);

        const image = new Image();
        image.src = e.target.result;
        image.onload = () => {
          EXIF.getData(image, function () {
            const allMetaData = EXIF.getAllTags(this);
            // setDate(allMetaData.DateTimeOriginal || '정보 없음');

            const convertDate = convertExifToISO(allMetaData.DateTimeOriginal);
            setDate(convertDate || '정보 없음');
          });
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setTypeCheck((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  useEffect(() => {
    let maxFine = 0;

    // 선택된 값이 없다면 typeRequest null 설정
    // 선택된 값이 있다면 벌금이 가장 높은 typeRequest 값 설정
    let flag = false;

    typeIdx.forEach((value) => {
      const { type, fine } = ViolationType[value];

      if (typeCheck[type]) {
        flag = true;

        if (fine > maxFine) {
          setTypeRequest(value);
          maxFine = fine;
        }
      }
    });

    if (!flag) {
      setTypeRequest(null);
    }
  }, [typeCheck]);

  useEffect(() => {
    if (typeRequest) {
      console.log(`최대 벌금 항목: ${ViolationType[typeRequest].type}`);
      console.log(`index: ${typeRequest}`);
      console.log(`벌금: ${ViolationType[typeRequest].fine}`);
    }
  }, [typeRequest]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 이미지 파일을 이미지 서버에 업로드하고 주소 반환
    const imgUrl = await uploadImg(imgFile, typeRequest);

    if (!imgUrl) {
      alert('이미지 업로드에 실패했습니다.');
      return;
    }

    // 신고 - 실시간 이용 신고
    // axios.post
    try {
      const response = await axiosInstance.post('/reports/real-time', {
        violationType: typeRequest,
        image: `${process.env.REACT_APP_IMG_SERVER_BASE_URL}/image/type${typeRequest}/${imgUrl}`,
        description: description,
        kickboardNumber: kickboardNumber,
        lat: latitude,
        lng: longitude,
        addr: address,
        code: code,
        reportTime: date,
      });

      if (response.status === 201) {
        navigate('/report/real-time/success');
      } else {
        alert('신고 제출에 실패했습니다.');
      }
    } catch (error) {
      // 신고 제출 오류
      console.log('신고 제출 중 오류 발생: ' + error);
      alert('입력 정보를 다시 한 번 확인해주세요.');
    }
  };

  return (
    <s.Form>
      {selectedImage ? (
        <s.ImageArea>
          <s.ImageBtn onClick={handleDeleteClick}>X</s.ImageBtn>
          <s.Image src={selectedImage}></s.Image>
        </s.ImageArea>
      ) : (
        <UploadImgButton paddingY={'1vh'} onClick={handleUploadClick} />
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        onChange={handleImageChange}
      />
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
          value={kickboardNumber}
          onChange={handleChangeKickNumber}
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
          value={date}
        />
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
        {typeIdx.map((value, idx) => (
          <s.CheckboxWrapper key={idx}>
            <s.Checkbox
              type="checkbox"
              id={`checkbox-${idx}`}
              name={ViolationType[value].type}
              checked={typeCheck[ViolationType[value].type]}
              onChange={handleCheckboxChange}
            />
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
        value={description}
        onChange={handleChangeDescription}
      />
      <s.ButtonArea>
        {imgFile && kickboardNumber && address && latitude && longitude && code && description && typeRequest ? (
          <Button width={'90%'} height={'40px'} bold={'700'} size={'24px'} onClick={handleSubmit}>
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
