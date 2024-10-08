import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

import Input from './../Common/Input';
import Text from './../Common/Text';
import TextArea from './../Common/TextArea';
import Button from './../Common/Button';
import { useLocation, useNavigate } from 'react-router';

import { convertTimeString } from '../../lib/data/ConvertTime';
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
    gap: 20px;
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
    min-height: ${(props) => props.minheight || '100px'};
    font-weight: ${(props) => props.bold || '500'};
    font-size: ${(props) => props.size || '15px'};
    border-radius: 10px;
    border: 1px solid #d3d3d3;
    resize: none;
    padding: 10px;
    white-space: pre-line;
    outline: none;
    overflow-y: hidden;
  `,
  Response: styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
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

const autoResizeTextarea = (textarea) => {
  textarea.style.height = 'auto';
  textarea.style.height = `${textarea.scrollHeight}px`;
};

const ObjectionDetailForm = ({ objectionDetail }) => {
  // 상태관리 추후 변경
  const [modifyMode, setModifyMode] = useState(false);
  const [title, setTitle] = useState(objectionDetail.title);
  const [content, setContent] = useState(objectionDetail.content);

  const responseContent = objectionDetail.responseContent ? objectionDetail.responseContent : null;
  const responseDate = objectionDetail.responseDate ? objectionDetail.responseDate : null;

  const id = useLocation().state?.idx || null;

  const contentAreaRef = useRef(null);
  const responseContentAreaRef = useRef(null);

  useEffect(() => {
    if (contentAreaRef.current) {
      autoResizeTextarea(contentAreaRef.current);
    }
  }, [content]);

  useEffect(() => {
    if (responseContentAreaRef.current) {
      autoResizeTextarea(responseContentAreaRef.current);
    }
  }, [responseContent]);

  const inputProps = (fieldType, contentType) => {
    const setValue = (fieldType, value) => {
      fieldType === 'title' ? setTitle(value) : setContent(value);
    };

    return modifyMode
      ? {
          defaultValue: fieldType === 'title' ? title : content,
          mode: '',
          readOnly: false,
          minheight: '35vh',
          onChange: (e) => setValue(fieldType, e.target.value),
        }
      : {
          defaultValue: fieldType === 'title' ? title : content,
          mode: 'read',
          minheight: '20vh',
          readOnly: true,
          ref: contentType === 'content' ? contentAreaRef : responseContentAreaRef,
        };
  };

  const navigate = useNavigate();

  // 삭제 요청
  const toDelete = async (objectionId) => {
    try {
      const response = await deleteObjectionDetail(objectionId);

      if (response.status === 204) {
        alert('삭제되었습니다.');
        setTimeout(() => {
          navigate('/objection', { replace: true });
        }, 0);
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

  const onClickButton = (type, event) => {
    event.preventDefault();

    switch (type) {
      case 'delete':
        // 경고창 띄운 후 delete 요청
        if (window.confirm('정말 삭제하시겠습니까?')) {
          toDelete(id);
        }
        break;
      case 'modify':
        // 수정/삭제 모드로 변경
        setModifyMode(true);
        break;
      case 'complete':
        // 수정 내용 put 요청 후 get 요청을 보내 response를 modifyMode false로 페이지 다시 받기
        if (window.confirm('수정하시겠습니까?')) {
          setModifyMode(false);
          toModifyComplete(id, title, content);
        }
        break;
      case 'navigate':
        if (objectionDetail.billId) {
          navigate('/violation/detail', { state: { idx: objectionDetail.billId } });
        } else {
          alert('단속 내역을 찾는 중 오류가 발생했습니다.');
        }
        break;
      default:
        break;
    }
  };

  return (
    <s.Container>
      <s.Form>
        <s.Input type="text" {...inputProps('title')} />
        <br />
        <s.TextArea type="text" {...inputProps('content', 'content')} />
        {responseContent ? (
          <>
            <s.Response>
              <s.HorizontalLine />
              <s.ResponseHeader>
                <Text size={'15px'} bold={'700'}>
                  기관 답변
                </Text>
                <Text size={'15px'} bold={'700'}>
                  {convertTimeString(responseDate, 'YMD')}
                </Text>
              </s.ResponseHeader>
              {/* <s.TextArea type="text" defaultValue={responseContent} mode={'read'} readOnly={true} /> */}
              <s.TextArea type="text" defaultValue={responseContent} {...inputProps('content', 'responseContent')} />
              <Button width={'120px'} height={'40px'} onClick={(e) => onClickButton('navigate', e)} margin={'15px'}>
                단속 내역
              </Button>
            </s.Response>
          </>
        ) : (
          <>
            <s.ButtonContainer>
              {modifyMode ? (
                <>
                  <Button width={'120px'} height={'40px'} onClick={(e) => onClickButton('complete', e)}>
                    수정완료
                  </Button>
                  <Button width={'120px'} height={'40px'} onClick={(e) => onClickButton('delete', e)}>
                    삭제하기
                  </Button>
                </>
              ) : (
                <>
                  <Button width={'120px'} height={'40px'} onClick={(e) => onClickButton('modify', e)}>
                    수정 / 삭제
                  </Button>
                  <Button width={'120px'} height={'40px'} onClick={(e) => onClickButton('navigate', e)}>
                    단속 내역
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
