import React, { useRef, useEffect, useState } from "react";

const MonitoringApp = () => {
    const [annotatedImage, setAnnotatedImage] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef(null);
    const cameraIdx = 2;
    const reconnectTimeoutRef = useRef(null);

    const connectWebSocket = () => {
        // WebSocket 서버에 연결
        socketRef.current = new WebSocket(`wss://j11b102.p.ssafy.io/cctv/video?role=client&camera_idx=${cameraIdx}`);

        socketRef.current.binaryType = "arraybuffer"; // 이진 데이터 수신을 위해 설정

        socketRef.current.onopen = () => {
            console.log("WebSocket 연결 성공");
            setIsConnected(true); // 연결 상태를 true로 설정
        };

        socketRef.current.onmessage = (event) => {
            const arrayBuffer = event.data;
            const blob = new Blob([arrayBuffer], { type: "image/jpeg" });
            const imageUrl = URL.createObjectURL(blob);
            setAnnotatedImage(imageUrl);
        };

        socketRef.current.onclose = () => {
            console.log("WebSocket 연결 종료");
            setIsConnected(false); // 연결 상태를 false로 설정
            setAnnotatedImage(null); // 연결이 끊어지면 이미지 초기화

            // 10초 후에 재연결 시도
            reconnectTimeoutRef.current = setTimeout(() => {
                console.log("WebSocket 재연결 시도");
                connectWebSocket();
            }, 10000);
        };

        socketRef.current.onerror = (error) => {
            console.error("WebSocket 오류:", error);
        };
    };

    useEffect(() => {
        connectWebSocket();

        return () => {
            // 컴포넌트 언마운트 시 WebSocket 연결 해제 및 타임아웃 클리어
            if (socketRef.current) {
                socketRef.current.close();
                clearTimeout(reconnectTimeoutRef.current);
            }
        };
    }, []);

    return (
        <div>
            {isConnected && annotatedImage ? (
                <img src={annotatedImage} alt="Received Frame" style={{ width: "640px", height: "360px" }} />
            ) : (
                <p>영상 수신 중...</p>
            )}
        </div>
    );
};

export default MonitoringApp;