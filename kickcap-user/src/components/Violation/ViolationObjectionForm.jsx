import React, { useState } from 'react';
import styled from 'styled-components';

import Input from '../Common/Input';
import Text from '../Common/Text';
import TextArea from '../Common/TextArea';
import Button from '../Common/Button';
import LoadingSpinner from '../Common/LoadingSpinner';
import { useNavigate } from 'react-router';

import { submitObjection } from '../../lib/api/violation-api';

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
  LoadingText: styled.div`
    color: ${(props) => (props.color ? props.color : props.theme.mainColor)};
    font-size: ${(props) => props.size};
    font-weight: 600;
    white-space: pre-line;
    text-align: center;
    margin: ${(props) => props.margin};
  `,
};

const ViolationObjectionForm = ({ id }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const loadingText = '이의 제기 중입니다.\n\n잠시만 기다려주세요...';

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
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

    try {
      setIsLoading(true);
      const response = await submitObjection(id, title, content);

      if (response && response.status === 201) {
        navigate('/violation/objection/success');
      }
    } catch (err) {
      setError('이의제기 제출에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <s.Container>
      {isLoading ? (
        <>
          <s.LoadingText size={'20px'} margin={'5vh'}>
            {loadingText}
          </s.LoadingText>
          <LoadingSpinner />
        </>
      ) : (
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
          <Button type={isLoading ? 'sub' : ''} width={'90%'} height={'40px'} margin={'8vh'}>
            작성 완료
          </Button>
        </s.Form>
      )}
    </s.Container>
  );
};

export default ViolationObjectionForm;
