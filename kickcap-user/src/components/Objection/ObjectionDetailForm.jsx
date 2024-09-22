import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import Input from './../Common/Input';
import Text from './../Common/Text';
import TextArea from './../Common/TextArea';
import Button from './../Common/Button';
import { useLocation, useNavigate } from 'react-router';

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

  const inputProps = (type) => {
    return modifyMode
      ? {
          defaultValue: type,
          mode: '',
          readOnly: false,
        }
      : {
          defaultValue: type,
          mode: 'read',
          readOnly: true,
        };
  };

  const navigate = useNavigate();

  const onClickButton = (type) => {
    // axios
    switch (type) {
      case 'delete':
        // 경고창 띄운 후 delete 요청
        if (window.confirm('정말 삭제하시겠습니까?')) {
          alert('삭제되었습니다.');
          navigate('/objection');
        }
        break;
      case 'modify':
        console.log('modify');
        setModifyMode(true);
        break;
      case 'complete':
        // 수정 내용 put 요청 후 get 요청을 보내 response를 modifyMode false로 페이지 다시 받기
        console.log('complete');
        setModifyMode(false);
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
