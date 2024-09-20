import React, { useState } from 'react';
import styled from 'styled-components';

import Input from '../Common/Input';
import Text from '../Common/Text';
import TextArea from '../Common/TextArea';
import Button from '../Common/Button';
import { useNavigate } from 'react-router';

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
};

const ViolationObjectionForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title && !content) {
      setError('제목과 내용을 입력해주세요.');
      return;
    } else if (!title && content) {
      setError('제목을 입력해주세요.');
      return;
    } else if (title && !content) {
      setError('내용을 입력해주세요.');
      return;
    }

    setError('');
    console.log(`title: ${title}`);
    console.log(`content: ${content}`);

    navigate('success');
    // axios post 요청 입력
  };

  return (
    <s.Container>
      <s.Form onSubmit={handleSubmit}>
        <Input
          type="text"
          width={'100%'}
          height={'40px'}
          placeholder="제목을 입력하세요."
          onChange={(e) => setTitle(e.target.value)}
        />
        <br />
        <TextArea
          type="text"
          width={'100%'}
          height={'40vh'}
          placeholder="내용을 입력하세요."
          onChange={(e) => setContent(e.target.value)}
        />
        <Text margin={'4vh'} color={'negative'}>
          {error ? error : ''}
        </Text>
        <Button width={'90%'} height={'40px'} margin={'8vh'}>
          작성 완료
        </Button>
      </s.Form>
    </s.Container>
  );
};

export default ViolationObjectionForm;
