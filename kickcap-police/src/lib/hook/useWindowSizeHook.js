import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // React Router 사용 시
import SizeGuidePage from '../../pages/SizeGuidePage';

const useWindowSize = () => {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);

    // 초기 해상도 설정
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
};

const ResponsiveWrapper = ({ children }) => {
  const { width, height } = useWindowSize();
  const navigate = useNavigate();

  // 해상도 조건에 따라 안내 페이지로 리디렉션
  if (width <= 1080 || height <= 600) {
    // navigate('/guide'); // 안내 페이지로 이동
    // return null; // 컴포넌트 렌더링을 중지
    return <>{<SizeGuidePage />}</>;
  } else {
    return <>{children}</>; // 조건에 맞을 때만 자식 컴포넌트를 렌더링
  }
};

export default ResponsiveWrapper;
