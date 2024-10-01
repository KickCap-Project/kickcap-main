import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import Input from './../Common/Input';
import Text from './../Common/Text';
import TextArea from './../Common/TextArea';
import Button from './../Common/Button';
import { useLocation, useNavigate } from 'react-router';

import { deleteObjectionDetail, putObjectionDetail } from '../../lib/api/objection-api';

const s = {
  Container: styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  `,
  Form: styled.form`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  `,
  ButtonContainer: styled.div`
    width: 100%;
    margin: 8vh;
    gap: 5%;
    display: flex;
    justify-content: center;
    align-items: center;
  `,
  Input: styled.input`
    width: 100%;
    height: 40px;
    border: 1px solid #d3d3d3;
    background-color: ${({ InputColor, theme }) => (InputColor ? theme[InputColor] : theme['WriteInput'])};
    color: ${(props) => props.theme.textColor};
    font-weight: ${(props) => props.bold || '500'};
  `,
  TextArea: styled.textarea`
    background-color: ${(props) => props.theme.WriteInput};
    color: ${(props) => props.theme.textColor};
    width: 100%;
    height: ${(props) => props.height};
    font-weight: ${(props) => props.bold || '500'};
    font-size: ${(props) => props.size || '15px'};
    border-radius: 10px;
    border: 1px solid #d3d3d3;
    resize: none;
    padding: 10px;
    white-space: pre-line;
    outline: none;
  `,
  Response: styled.div`
    width: 100%;
  `,
  ResponseHeader: styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    margin-bottom: 10px;
    padding-left: 3%;
    padding-right: 3%;
  `,
  HorizontalLine: styled.div`
    width: 100%;
    border: 2px solid ${(props) => props.theme.mainColor};
    margin-top: 15px;
  `,
};

const ObjectionDetailForm = ({ objectionDetail }) => {
  // 상태관리 추후 변경
  const [modifyMode, setModifyMode] = useState(false);
  const [title, setTitle] = useState(objectionDetail.title);
  const [content, setContent] = useState(objectionDetail.content);
  const [responseContent, setResponseContent] = useState(objectionDetail.responseContent);
  const [responseDate, setResponseDate] = useState(objectionDetail.responseDate);

  const id = useLocation().state?.idx || null;

  const inputProps = (type) => {
    const setValue = (type, value) => {
      type === 'title' ? setTitle(value) : setContent(value);
    };

    return modifyMode
      ? {
          defaultValue: type,
          mode: '',
          readOnly: false,
          onChange: (e) => setValue(type, e.target.value),
        }
      : {
          defaultValue: type,
          mode: 'read',
          readOnly: true,
        };
  };

  const navigate = useNavigate();

  // 삭제 요청
  const toDelete = async (objectionId) => {
    try {
      const response = await deleteObjectionDetail(objectionId);

      console.log(`response.status: ${response.status}`);

      if (response.status === 204) {
        alert('삭제되었습니다.');
        navigate('/objection');
      } else {
        console.log(`response.status: ${response.status}`);
        alert(`이의제기 삭제 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.`);
      }
    } catch (err) {
      console.log(`이의제기 삭제 중 문제 발생: ${err}`);
      alert(`이의제기 삭제 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.`);
    }
  };

  // 수정 후 put 요청
  const toModifyComplete = async (objectionId, title, content) => {
    try {
      const response = await putObjectionDetail(objectionId, title, content);

      console.log(`response.status: ${response.status}`);

      if (response.status === 200) {
        alert('수정이 정상적으로 완료되었습니다.');

        // 수정 완료 후 objectionId를 sessionStorage에 저장
        sessionStorage.setItem('objectionId', objectionId);
        window.location.reload();
      }
    } catch (err) {
      console.log(`이의제기 삭제 중 문제 발생: ${err}`);
      alert(`이의제기 수정 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.`);
    }
  };

  const onClickButton = (type) => {
    console.log(type);
    // axios
    switch (type) {
      case 'delete':
        // 경고창 띄운 후 delete 요청
        if (window.confirm('정말 삭제하시겠습니까?')) {
          toDelete(id);
        }
        break;
      case 'modify':
        // 수정 모드로 변경
        setModifyMode(true);
        break;
      case 'complete':
        // 수정 내용 put 요청 후 get 요청을 보내 response를 modifyMode false로 페이지 다시 받기
        if (window.confirm('수정하시겠습니까?')) {
          setModifyMode(false);
          toModifyComplete(id, title, content);
        }
        break;
      default:
        break;
    }
  };

  return (
    <s.Container>
      <s.Form>
        <s.Input type="text" {...inputProps(title)} />
        <br />
        <s.TextArea type="text" height={'35vh'} {...inputProps(content)} />
        {responseContent ? (
          <>
            <s.Response>
              <s.HorizontalLine />
              <s.ResponseHeader>
                <Text size={'15px'} bold={'700'}>
                  기관 답변
                </Text>
                <Text size={'15px'} bold={'700'}>
                  {responseDate}
                </Text>
              </s.ResponseHeader>
              <s.TextArea type="text" height={'15vh'} defaultValue={responseContent} mode={'read'} readOnly={true} />
            </s.Response>
          </>
        ) : (
          <>
            <s.ButtonContainer>
              {modifyMode ? (
                <>
                  <Button width={'30%'} height={'40px'} onClick={() => onClickButton('complete')}>
                    완료
                  </Button>
                </>
              ) : (
                <>
                  <Button width={'30%'} height={'40px'} onClick={() => onClickButton('modify')}>
                    수정
                  </Button>
                  <Button width={'30%'} height={'40px'} onClick={() => onClickButton('delete')}>
                    삭제
                  </Button>
                </>
              )}
            </s.ButtonContainer>
          </>
        )}
      </s.Form>
    </s.Container>
  );
};

export default ObjectionDetailForm;
