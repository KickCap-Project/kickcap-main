import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import Button from '../Common/Button';
import Input from '../Common/Input';
import TextArea from '../Common/TextArea';
import UploadImgButton from '../../components/Report/UploadImgButtom';
import EXIF from 'exif-js';

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
};

const ReportIllegalParkingForm = () => {
  const [image, setImage] = useState('');
  const [kickboardNumber, setKickboardNumber] = useState('');
  const [description, setDescription] = useState('');

  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [imgFile, setImgFile] = useState('');
  const [date, setDate] = useState(null);

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
            setDate(allMetaData.DateTimeOriginal || '정보 없음');
            console.log(allMetaData);
          });
        };
      };
      reader.readAsDataURL(file);
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
          value={date}
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
        value={description}
        onChange={handleChangeDescription}
      />
      <s.ButtonArea>
        {imgFile && kickboardNumber && description ? (
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
