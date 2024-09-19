import React, { useRef, useEffect, useState } from 'react';

const VideoStream = () => {
  const videoRef = useRef(null);
  const socketRef = useRef(null);
  const [annotatedImage, setAnnotatedImage] = useState(null); // 추가된 상태

  useEffect(() => {
    // WebSocket 서버에 연결
    socketRef.current = new WebSocket('ws://localhost:8765/video');
    // socketRef.current = new WebSocket('wss://j11b102.p.ssafy.io/cctv/video');

    // 유저의 미디어 스트림을 가져오기
    navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 1920 },
        height: { ideal: 1080 }
      }
    })
      .then(stream => {
        const videoElement = videoRef.current;
        videoElement.srcObject = stream;

        videoElement.onloadedmetadata = () => {
          videoElement.play();

          const videoTrack = stream.getVideoTracks()[0];
          const imageCapture = new ImageCapture(videoTrack);

          const sendFrame = () => {
            imageCapture.grabFrame().then(imageBitmap => {
              const canvas = document.createElement('canvas');
              canvas.width = 1920;
              canvas.height = 1080;
              const context = canvas.getContext('2d');
              context.drawImage(imageBitmap, 0, 0, canvas.width, canvas.height);
              canvas.toBlob(blob => {
                socketRef.current.send(blob); // 프레임 전송
              }, 'image/jpeg');
            }).catch(error => {
              console.error('Error grabbing frame:', error);
            });
          };

          setInterval(sendFrame, 333); // 3 FPS로 프레임 전송
        };
      })
      .catch(error => {
        console.error('웹캠 접근 오류:', error);
      });

    // WebSocket을 통해 수신한 데이터 처리
    socketRef.current.onmessage = (event) => {
      const imageBlob = event.data;
      const imageUrl = URL.createObjectURL(imageBlob);
      setAnnotatedImage(imageUrl);  // 수신한 이미지 URL을 상태에 저장
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '1920px', height: '1080px', backgroundColor: '#000' }}>
      <video ref={videoRef} autoPlay style={{ width: '100%', height: 'auto' }} />
      <div style={{ position: 'absolute', bottom: '10px', left: '10px', color: '#fff', backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: '5px' }}>
        Streaming Video
      </div>
      {annotatedImage && (
        <img src={annotatedImage} alt="Annotated Frame" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 'auto' }} />
      )}
    </div>
  );
};

export default VideoStream;
