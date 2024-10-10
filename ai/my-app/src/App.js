import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const BASE_URL = "https://j11b102.p.ssafy.io/plate";
const INSERT_API_ENDPONT = BASE_URL + "/insert";
const IMAGE_API_ENDPONT = BASE_URL + "/image";
const OCR_API_ENDPONT = BASE_URL + "/capture";

const VideoStream = () => {
    const videoRef = useRef(null);
    const socketRef = useRef(null);
    const [annotatedImage, setAnnotatedImage] = useState(null);
    const [labelResult, setLabelResult] = useState("");
    const [userInfos, setUserInfos] = useState([
        {
            name: "유현진",
            phone: "010-9204-6503",
        },
        {
            name: "김종원",
            phone: "010-6632-7764",
        },
        {
            name: "오진영",
            phone: "010-5056-6221",
        },
        {
            name: "박윤아",
            phone: "010-3011-0568",
        }
    ]);
    const [selectedUserInfo, setSelectedUserInfo] = useState(0);
    const [kickboardNumber, setKickboardNumber] = useState("M8765");
    const [inputMinute, setMinute] = useState("1");
    const [inputCameraIdx, setCameraIdx] = useState("1");

    const handleKickboardNumberChange = (e) => {
        setKickboardNumber(e.target.value);
    };
    const handleUserInfoChange = (index) => {
        setSelectedUserInfo(index);
    };

    const handleInputMinuteChange = (e) => {
        setMinute(e.target.value);
    };
    const handleInputCameraIdxChange = (e) => {
        setCameraIdx(e.target.value);
    };

    const getCurrentTimeString = () => {
        const now = new Date();
        const pad = (n, width = 2) => n.toString().padStart(width, "0");

        const year = now.getFullYear();
        const month = pad(now.getMonth() + 1);
        const day = pad(now.getDate());
        const hours = pad(now.getHours());
        const minutes = pad(now.getMinutes());
        const seconds = pad(now.getSeconds());
        const milliseconds = pad(now.getMilliseconds(), 3);

        return `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}000`;
    };

    const getCanvasBlob = (canvas) => {
        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                resolve(blob);
            }, "image/jpeg");
        });
    };

    const handleCapture = async () => {
        if (videoRef.current) {
            const videoElement = videoRef.current;
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");

            const width = 1920;
            const height = 1080;

            canvas.width = width;
            canvas.height = height;

            const isPortrait = window.innerHeight > window.innerWidth;

            if (isPortrait) {
                context.save();
                context.translate(width / 2, height / 2);
                context.rotate(Math.PI / 2);
                context.drawImage(videoElement, -height / 2, -width / 2, height, width);
                context.restore();
            } else {
                context.drawImage(videoElement, 0, 0, width, height);
            }

            try {
                const blob = await getCanvasBlob(canvas);

                const formData = new FormData();
                formData.append("image", blob, uuidv4() + ".jpg");

                const imageResponse = await axios.post(IMAGE_API_ENDPONT, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

                const fileName = imageResponse.data.image_src;

                const ocrData = {
                    camera_idx: inputCameraIdx,
                    file_name: fileName,
                    type: 3,
                    time: getCurrentTimeString(),
                };

                const ocrResponse = await axios.post(OCR_API_ENDPONT, ocrData);

                if (ocrResponse.status === 200) {
                    console.log(ocrResponse)
                }
            } catch (error) {
                if (error.response) {
                    console.error("요청 중 오류 발생:", error.response.data.detail);
                } else {
                    console.error("요청 중 오류 발생:", error.message);
                }
            }
        }
    };

    const handleInsert = async () => {
        try {
            const response = await axios.post(INSERT_API_ENDPONT, {
                kickboard_number: kickboardNumber,
                phone: userInfos[selectedUserInfo].phone,
                name: userInfos[selectedUserInfo].name,
                minute: inputMinute,
            });

            console.log("Response:", response);
        } catch (error) {
            console.error("Error:", error.response.data.detail);
        }
    };

    // WebSocket 연결을 관리하는 함수 (기존 연결이 있으면 종료 후 새로 연결)
    const reconnectWebSocket = (newCameraIdx) => {
        if (socketRef.current) {
            socketRef.current.close();  // 기존 WebSocket 연결 종료
        }

        // 새로운 WebSocket 연결
        socketRef.current = new WebSocket(`wss://j11b102.p.ssafy.io/cctv/video?role=camera&camera_idx=${newCameraIdx}`);

        socketRef.current.onmessage = (event) => {
            const imageBlob = event.data;
            const imageUrl = URL.createObjectURL(imageBlob);
            setAnnotatedImage(imageUrl);
        };

        socketRef.current.onclose = () => {
            console.log(`WebSocket closed for camera_idx ${newCameraIdx}`);
        };

        socketRef.current.onerror = (error) => {
            console.error("WebSocket error:", error);
        };
    };

    // camera_idx 변경 시 WebSocket 재연결
    const handleCameraChange = (newCameraIdx) => {
        setCameraIdx(newCameraIdx);  // 카메라 ID 상태 업데이트
        reconnectWebSocket(newCameraIdx);  // WebSocket 재연결
    };

    useEffect(() => {
        // 컴포넌트가 마운트될 때 또는 camera_idx 변경될 때 WebSocket 연결
        reconnectWebSocket(inputCameraIdx);

        // 비디오 스트림 설정
        navigator.mediaDevices
            .getUserMedia({
                video: {
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                    facingMode: "environment",
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
                                const canvas = document.createElement("canvas");
                                canvas.width = 1920;
                                canvas.height = 1080;
                                const context = canvas.getContext("2d");
                                context.drawImage(imageBitmap, 0, 0, canvas.width, canvas.height);
                                canvas.toBlob((blob) => {
                                    socketRef.current.send(blob);
                                }, "image/jpeg");
                            })
                            .catch((error) => {
                                console.error("프레임 캡처 중 오류 발생:", error);
                            });
                    };
                    setInterval(sendFrame, 333);  // 매 333ms마다 프레임 전송
                };
            })
            .catch((error) => {
                console.error("웹캠 접근 오류:", error);
            });

        // 컴포넌트 언마운트 시 WebSocket 연결 종료
        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, [inputCameraIdx]);  // camera_idx 변경 시 WebSocket 재연결

    return (
        <div>
            <div
                style={{
                    position: "relative",
                    width: "640px",
                    height: "360px",
                    backgroundColor: "#000",
                }}
            >
                <video
                    ref={videoRef}
                    autoPlay
                    style={{ width: "100%", height: "100%" }}
                />
                <div
                    style={{
                        position: "absolute",
                        bottom: "10px",
                        left: "10px",
                        color: "#fff",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        padding: "5px",
                    }}
                >
                    Streaming Video
                </div>
                {annotatedImage && (
                    <img
                        src={annotatedImage}
                        alt="Annotated Frame"
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                        }}
                    />
                )}
            </div>

            <div>
                <h3>카메라 선택</h3>
                {[1, 2, 3, 4, 5].map((idx) => (
                    <button
                        key={idx}
                        onClick={() => handleCameraChange(idx)}
                        style={{
                            width: "50px",
                            height: "50px",
                            margin: "5px",
                        }}
                    >
                        {idx}
                    </button>
                ))}
            </div>

            <div>
                <div>
                    <label>킥보드 번호: </label>
                    <div>
                        <input
                            type="radio"
                            value="M8765"
                            checked={kickboardNumber === "M8765"}
                            onChange={handleKickboardNumberChange}
                        />
                        M8765
                        <input
                            type="radio"
                            value="A1234"
                            checked={kickboardNumber === "A1234"}
                            onChange={handleKickboardNumberChange}
                        />
                        A1234
                    </div>
                </div>
                <div>
                    <label>camera_idx: </label>
                    <input value={inputCameraIdx} onChange={handleInputCameraIdxChange} />
                </div>
                <div>
                    <label>유지 시간(분): </label>
                    <input value={inputMinute} onChange={handleInputMinuteChange} />
                </div>

                <div>
                    <label>사용자 정보: </label>
                    <div>
                        <input
                            type="radio"
                            value={0}
                            checked={selectedUserInfo === 0}
                            onChange={() => handleUserInfoChange(0)}
                        />
                        유현진 (010-9204-6503)
                        <input
                            type="radio"
                            value={1}
                            checked={selectedUserInfo === 1}
                            onChange={() => handleUserInfoChange(1)}
                        />
                        김종원 (010-6632-7764)
                        <input
                            type="radio"
                            value={2}
                            checked={selectedUserInfo === 2}
                            onChange={() => handleUserInfoChange(2)}
                        />
                        오진영 (010-5056-6221)
                        <input
                            type="radio"
                            value={3}
                            checked={selectedUserInfo === 3}
                            onChange={() => handleUserInfoChange(3)}
                        />
                        박병준 (010-3011-0568)
                    </div>
                </div>

                <button onClick={handleInsert} style={{ width: "150px", height: "50px" }}>
                    Insert
                </button>
                <button onClick={handleCapture} style={{ width: "150px", height: "50px" }}>
                    Capture
                </button>
                <button onClick={() => setLabelResult("")} style={{ width: "150px", height: "50px" }}>
                    Clear
                </button>
                <p>{labelResult}</p>
            </div>
        </div>
    );
};

export default VideoStream;
