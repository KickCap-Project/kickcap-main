import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import Button from '../Common/Button';
import Input from '../Common/Input';
import TextArea from '../Common/TextArea';
import UploadImgButton from '../../components/Report/UploadImgButtom';
import LoadingSpinner from '../Common/LoadingSpinner';

import { localAxios } from '../../util/axios-setting';
import EXIF from 'exif-js';

import { uploadImg } from '../../lib/api/report-api';
import { convertExifToISO } from '../../lib/data/ConvertTime';
import moment from 'moment/moment';
import 'moment/locale/ko';

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
  Image: styled.img`
    width: 100%;
    max-height: 300px;
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
  Text: styled.div`
    color: ${(props) => (props.color ? props.color : props.theme.mainColor)};
    font-size: ${(props) => props.size};
    font-weight: 600;
    white-space: pre-line;
    text-align: center;
    margin: ${(props) => props.margin};
  `,
};

const ReportIllegalParkingForm = () => {
  const navigate = useNavigate();
  const axiosInstance = localAxios();

  const [imgFile, setImgFile] = useState('');
  const [selectedImage, setSelectedImage] = useState('');

  const [description, setDescription] = useState('');
  const [kickboardNumber, setKickboardNumber] = useState('');
  const [date, setDate] = useState('');

  const fileInputRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const loadingText = '제보 중입니다.\n\n잠시만 기다려주세요...';

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
    fileInputRef.current.value = ''; // 여기 추가
  };

  // 이미지 유효성
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImgFile(file);
    if (file) {
      // 선택한 파일을 미리보기로 표시
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);

        const image = new Image();
        image.src = e.target.result;
        image.onload = () => {
          EXIF.getData(image, function () {
            const allMetaData = EXIF.getAllTags(this);

            // setDate(allMetaData.DateTimeOriginal || '정보 없음');
            const convertDate = convertExifToISO(allMetaData.DateTimeOriginal || '');
            setDate(convertDate ? convertDate : '정보 없음');
          });
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!date || date === '정보 없음') {
      alert('사진에서 시각 정보를 찾을 수 없습니다. 다시 한 번 확인해주세요.');
      return;
    }

    setIsLoading(true);

    // 신고 - 불법주차 신고
    // axios.post
    try {
      const imgUrl = await uploadImg(imgFile, 4);

      if (!imgUrl) {
        alert('이미지 업로드에 실패했습니다.');
        setIsLoading(false);
        return;
      }

      const payload = {
        violationType: 4,
        image: `${process.env.REACT_APP_IMG_SERVER_BASE_URL}/image/type4/${imgUrl}`,
        description: description,
        kickboardNumber: kickboardNumber,
        reportTime: date,
      };

      await axiosInstance.post('/reports/parking', payload);

      navigate('/report/parking/success');
    } catch (error) {
      // 신고 제출 오류
      alert('입력 정보를 다시 한 번 확인해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreventDefault = (e) => {
    e.preventDefault();
  };

  return (
    <s.Form>
      {isLoading ? (
        <>
          <s.Text size={'20px'} margin={'5vh'}>
            {loadingText}
          </s.Text>
          <LoadingSpinner />
        </>
      ) : (
        <>
          {selectedImage ? (
            <s.ImageArea>
              <s.ImageBtn onClick={handleDeleteClick}>X</s.ImageBtn>
              <s.Image src={selectedImage}></s.Image>
            </s.ImageArea>
          ) : (
            <UploadImgButton paddingY={'4vh'} onClick={handleUploadClick} />
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
              value={date === '' ? '' : date !== '정보 없음' ? moment(date).format('YYYY.MM.DD A hh:mm') : '정보 없음'}
            />
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
            value={description}
            onChange={handleChangeDescription}
          />

          <s.ButtonArea>
            <Button
              type={imgFile && description && kickboardNumber && date && !isLoading ? '' : 'sub'}
              width={'90%'}
              height={'40px'}
              bold={'700'}
              size={'24px'}
              onClick={
                imgFile && description && kickboardNumber && date && !isLoading ? handleSubmit : handlePreventDefault
              }
            >
              작성 완료
            </Button>
          </s.ButtonArea>
        </>
      )}
    </s.Form>
  );
};

export default ReportIllegalParkingForm;
