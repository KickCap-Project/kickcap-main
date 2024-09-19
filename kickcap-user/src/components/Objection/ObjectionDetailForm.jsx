import React, { useState } from 'react';
import styled from 'styled-components';

import Input from './../Common/Input';
import TextArea from './../Common/TextArea';
import Button from './../Common/Button';

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
};

const ObjectionDetailForm = ({ objectionDetail }) => {
  const [modify, setModify] = useState(true);
  const [title, setTitle] = useState(objectionDetail.title);
  const [content, setContent] = useState(objectionDetail.content);

  const inputProps = modify
    ? { value: title, mode: '', readOnly: false }
    : { value: title, mode: 'read', readOnly: true };

  return (
    <s.Container>
      <s.Form>
        <Input type="text" width={'100%'} height={'40px'} {...inputProps} />
        <br />
        <TextArea type="text" width={'100%'} height={'40vh'} mode={modify ? '' : 'read'} value={content} />
        <s.ButtonContainer>
          <Button width={'30%'} height={'40px'}>
            수정
          </Button>
          <Button width={'30%'} height={'40px'}>
            삭제
          </Button>
        </s.ButtonContainer>
      </s.Form>
    </s.Container>
  );
};

export default ObjectionDetailForm;
