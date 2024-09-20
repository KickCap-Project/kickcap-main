import React, { useRef, useState, useEffect } from 'react';
import videData from '../../asset/edu.mp4';
import '../../styles/VideoCustomCss.css';

const EduVideo = ({ onFinish }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 비디오 재생/일시정지 토글 함수
  const handlePlayPause = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      videoRef.current.playbackRate = 1.2; // 속도 설정
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // 비디오 종료 시 알림
  const handleEndVideo = () => {
    onFinish(true);
  };

  // 비디오 현재 시간 업데이트
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  // 비디오 전체 시간 설정
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  // 진행 바 변경 함수
  const handleProgressChange = (event) => {
    const newTime = (event.target.value / 100) * duration;
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  // 전체 화면 토글 함수
  const handleFullscreen = () => {
    if (videoRef.current) {
      if (!document.fullscreenElement) {
        videoRef.current.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }
  };

  // 전체 화면 상태 변경에 따른 처리
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);

      // 전체 화면 모드에서 기본 컨트롤 숨기기
      if (isFullscreen && videoRef.current) {
        videoRef.current.style.webkitAppearance = 'none'; // Chrome/Safari
        videoRef.current.style.msAppearance = 'none'; // IE
        videoRef.current.style.appearance = 'none'; // Other browsers
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [isFullscreen]);

  // 포커스를 제거하는 함수
  const removeFocus = () => {
    if (videoRef.current) {
      videoRef.current.blur(); // 포커스를 제거합니다.
    }
  };

  // // 터치 이벤트 처리 함수
  // const handleTouchStart = (event) => {
  //   if (videoRef.current) {
  //     event.preventDefault(); // 터치 이벤트 방지
  //   }
  // };

  useEffect(() => {
    // 비디오 요소에 포커스 이벤트 리스너 추가
    const videoElement = videoRef.current;

    if (videoElement) {
      videoElement.addEventListener('focus', removeFocus);
      // videoElement.addEventListener("touchstart", handleTouchStart);

      // 컴포넌트 언마운트 시 이벤트 리스너 제거
      return () => {
        videoElement.removeEventListener('focus', removeFocus);
        // videoElement.removeEventListener("touchstart", handleTouchStart);
      };
    }
  }, []);

  return (
    <div className={`video-container ${isFullscreen ? 'fullscreen' : ''}`}>
      <video
        ref={videoRef}
        id="myVideo"
        src={videData}
        width="50%"
        onEnded={handleEndVideo}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        controls={false} // 기본 컨트롤 숨기기
      />
      <div className="custom-controls">
        <button onClick={handlePlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
        <input
          className="videoBar"
          type="range"
          min="0"
          max="100"
          value={(currentTime / duration) * 100 || 0}
          onChange={handleProgressChange}
        />
        <button onClick={handleFullscreen}>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</button>
      </div>
    </div>
  );
};

export default EduVideo;
