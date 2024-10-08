import React, { useRef, useEffect, useState } from "react";

const MonitoringApp = () => {
    const [annotatedImage, setAnnotatedImage] = useState(null);
    const socketRef = useRef(null);
    const cameraIdx = 2;

    useEffect(() => {
        // WebSocket 서버에 연결
        socketRef.current = new WebSocket(`wss://j11b102.p.ssafy.io/cctv/video?camera_idx=${cameraIdx}`);

        socketRef.current.binaryType = "arraybuffer"; // 이진 데이터 수신을 위해 설정

        socketRef.current.onmessage = (event) => {
            const arrayBuffer = event.data;
            const blob = new Blob([arrayBuffer], { type: "image/jpeg" });
            const imageUrl = URL.createObjectURL(blob);
            setAnnotatedImage(imageUrl);
        };

        socketRef.current.onopen = () => {
            console.log("WebSocket 연결 성공");
        };

        socketRef.current.onclose = () => {
            console.log("WebSocket 연결 종료");
        };

        socketRef.current.onerror = (error) => {
            console.error("WebSocket 오류:", error);
        };

        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, []);

    return (
        <div>
            {annotatedImage ? (
                <img src={annotatedImage} alt="Received Frame" style={{ width: "640px", height: "360px" }} />
            ) : (
                <p>영상 수신 중...</p>
            )}
        </div>
    );
};

export default MonitoringApp;
