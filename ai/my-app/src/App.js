import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const VideoStream = () => {
  const videoRef = useRef(null);
  const socketRef = useRef(null);
  const [annotatedImage, setAnnotatedImage] = useState(null);
  const [labelResult, setLabelResult] = useState('');

  const getCurrentTimeString = () => {
    const now = new Date();
    const pad = (n, width = 2) => n.toString().padStart(width, '0');

    const year = now.getFullYear();
    const month = pad(now.getMonth() + 1);
    const day = pad(now.getDate());
    const hours = pad(now.getHours());
    const minutes = pad(now.getMinutes());
    const seconds = pad(now.getSeconds());
    const milliseconds = pad(now.getMilliseconds(), 3);

    return `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}000`;
  };

  const handleCapture = () => {
    if (videoRef.current) {
      const videoElement = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = 1920;
      canvas.height = 1080;
      const context = canvas.getContext('2d');
      context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          // UUID로 파일 이름 생성
          const fileName = uuidv4() + '.jpg';
          // FormData 준비
          const formData = new FormData();
          formData.append('image', blob, fileName);

          // /image 엔드포인트로 이미지 전송
          axios
            .post('http://localhost:8000/image', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            })
            .then((response) => {
              console.log('/image로 이미지 전송 성공');
              console.log(response)

              // /ocr 엔드포인트에 보낼 데이터 준비
              const ocrData = {
                camera_idx: 1,
                file_name: fileName,
                type: 3,
                time: getCurrentTimeString(),
              };

              // /ocr 엔드포인트로 데이터 전송
              // axios
              //   .post('http://localhost:8000/ocr', ocrData)
              //   .then((response) => {
              //     if (response.status === 200) {
              //       // 결과를 라벨에 표시
              //       setLabelResult(response.data.result);
              //     }
              //   })
              //   .catch((error) => {
              //     console.error('OCR 요청 중 오류 발생:', error);
              //   });
            })
            .catch((error) => {
              console.error('/image로 이미지 전송 중 오류 발생:', error);
            });
        },
        'image/jpeg'
      );
    }
  };

  const handleInsert = () => {
    // Insert 버튼에 대한 기능을 여기에 구현하세요
    console.log('Insert 버튼 클릭됨');
  };

  useEffect(() => {
    // WebSocket 서버에 연결
    socketRef.current = new WebSocket('ws://localhost:8765/video');

    // 유저의 미디어 스트림을 가져오기
    navigator.mediaDevices
      .getUserMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      })
      .then((stream) => {
        const videoElement = videoRef.current;
        videoElement.srcObject = stream;

        videoElement.onloadedmetadata = () => {
          videoElement.play();

          const videoTrack = stream.getVideoTracks()[0];
          const imageCapture = new ImageCapture(videoTrack);

          const sendFrame = () => {
            imageCapture
              .grabFrame()
              .then((imageBitmap) => {
                const canvas = document.createElement('canvas');
                canvas.width = 1920;
                canvas.height = 1080;
                const context = canvas.getContext('2d');
                context.drawImage(imageBitmap, 0, 0, canvas.width, canvas.height);
                canvas.toBlob(
                  (blob) => {
                    socketRef.current.send(blob); // 프레임 전송
                  },
                  'image/jpeg'
                );
              })
              .catch((error) => {
                console.error('프레임 캡처 중 오류 발생:', error);
              });
          };

          setInterval(sendFrame, 333); // 3 FPS로 프레임 전송
        };
      })
      .catch((error) => {
        console.error('웹캠 접근 오류:', error);
      });

    // WebSocket을 통해 수신한 데이터 처리
    socketRef.current.onmessage = (event) => {
      const imageBlob = event.data;
      const imageUrl = URL.createObjectURL(imageBlob);
      setAnnotatedImage(imageUrl); // 수신한 이미지 URL을 상태에 저장
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  return (
    <div>
      <div
        style={{
          position: 'relative',
          width: '640px', // 화면 크기를 800x600으로 조정
          height: '360px',
          backgroundColor: '#000',
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          style={{ width: '100%', height: '100%' }} // 컨테이너에 맞게 조정
        />
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            color: '#fff',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            padding: '5px',
          }}
        >
          Streaming Video
        </div>
        {annotatedImage && (
          <img
            src={annotatedImage}
            alt="Annotated Frame"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%', // 컨테이너에 맞게 조정
            }}
          />
        )}
      </div>
      <div>
        <button onClick={handleInsert}>Insert</button>
        <button onClick={handleCapture}>Capture</button>
        <button onClick={() => setLabelResult('')}>Clear</button>
        <p>{labelResult}</p>
      </div>
    </div>
  );
};

export default VideoStream;
