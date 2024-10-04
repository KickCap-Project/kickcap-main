import React, { useRef, useEffect, useState } from 'react';
import Text from '../Common/Text';
import styled from 'styled-components';

const s = {
  Container: styled.div`
    width: 400px;
    display: flex;
    flex-direction: column;
    justify-content: start;
  `,
};
const MonitoringApp = () => {
  const [annotatedImage, setAnnotatedImage] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    // WebSocket 서버에 연결
    socketRef.current = new WebSocket('wss://j11b102.p.ssafy.io/cctv/video');

    socketRef.current.binaryType = 'arraybuffer'; // 이진 데이터 수신을 위해 설정

    socketRef.current.onmessage = (event) => {
      const arrayBuffer = event.data;
      const blob = new Blob([arrayBuffer], { type: 'image/jpeg' });
      const imageUrl = URL.createObjectURL(blob);
      setAnnotatedImage(imageUrl);
    };

    socketRef.current.onopen = () => {
      console.log('WebSocket 연결 성공');
    };

    socketRef.current.onclose = () => {
      console.log('WebSocket 연결 종료');
    };

    socketRef.current.onerror = (error) => {
      console.error('WebSocket 오류:', error);
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  return (
    <>
      {annotatedImage ? (
        <s.Container>
          <img src={annotatedImage} alt="Received Frame" style={{ width: '400px', height: '400px' }} />
          <Text
            children={'CCTV 영상 정보입니다.'}
            textalian={'center'}
            display={'block'}
            size={'15px'}
            bold={'700'}
            color={'textBasic'}
            margin={'10px auto'}
          />
        </s.Container>
      ) : (
        <Text
          children={'영상 수신 중...'}
          textalian={'center'}
          display={'block'}
          size={'15px'}
          bold={'700'}
          color={'textBasic'}
          margin={'10px auto'}
        />
      )}
    </>
  );
};

export default MonitoringApp;
