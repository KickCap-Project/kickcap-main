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
    // 상태 관리 묶음
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

    // canvas.toBlob을 Promise로 감싸는 함수
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

            // 캔버스 크기 설정
            canvas.width = width;
            canvas.height = height;

            // 환경 감지하여 가로/세로 모드 회전 조정
            const isPortrait = window.innerHeight > window.innerWidth;

            if (isPortrait) {
                context.save(); // 현재 상태 저장
                context.translate(width / 2, height / 2); // 캔버스의 중앙으로 이동
                context.rotate(Math.PI / 2); // 90도 회전
                context.drawImage(videoElement, -height / 2, -width / 2, height, width); // 세로로 그리기
                context.restore(); // 회전 이전 상태로 복구
            } else {
                context.drawImage(videoElement, 0, 0, width, height);
            }

            try {
                // canvas.toBlob을 비동기로 처리
                const blob = await getCanvasBlob(canvas);

                // FormData 준비
                const formData = new FormData();
                formData.append("image", blob, uuidv4() + ".jpg");

                // /image 엔드포인트로 이미지 전송
                const imageResponse = await axios.post(IMAGE_API_ENDPONT, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

                console.log("/image로 이미지 전송 성공");
                console.log(imageResponse);

                // 서버에서 반환된 파일 이름 사용
                const fileName = imageResponse.data.image_src;

                // /ocr 엔드포인트에 보낼 데이터 준비
                const ocrData = {
                    camera_idx: inputCameraIdx,
                    file_name: fileName, // 응답에서 가져온 파일 이름을 사용
                    type: 3,
                    time: getCurrentTimeString(),
                };

                // /ocr 엔드포인트로 데이터 전송
                console.log("OCR 시작");
                const ocrResponse = await axios.post(OCR_API_ENDPONT, ocrData);

                if (ocrResponse.status === 200) {
                    console.log(ocrResponse)
                }
            } catch (error) {
                // 에러 처리
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

    useEffect(() => {
        // WebSocket 서버에 연결, camera_id를 쿼리 파라미터로 전달
        socketRef.current = new WebSocket(`wss://j11b102.p.ssafy.io/cctv/video?camera_idx=${inputCameraIdx}`);

        // 유저의 미디어 스트림을 가져오기
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
                                    socketRef.current.send(blob); // 프레임 전송
                                }, "image/jpeg");
                            })
                            .catch((error) => {
                                console.error("프레임 캡처 중 오류 발생:", error);
                            });
                    };
                    setInterval(sendFrame, 333); // 3 FPS로 프레임 전송
                };
            })
            .catch((error) => {
                console.error("웹캠 접근 오류:", error);
            });

        // 현재 기기가 모바일이 아닌 경우에만 WebSocket으로 수신한 데이터를 처리
        const isMobile = /Mobi|Android/i.test(navigator.userAgent);

        if (!isMobile) {
            // WebSocket을 통해 수신한 데이터 처리 (모바일이 아닌 경우에만)
            socketRef.current.onmessage = (event) => {
                const imageBlob = event.data;
                const imageUrl = URL.createObjectURL(imageBlob);
                setAnnotatedImage(imageUrl); // 수신한 이미지 URL을 상태에 저장
            };
        }

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
                    position: "relative",
                    width: "640px", // 화면 크기를 800x600으로 조정
                    height: "360px",
                    backgroundColor: "#000",
                }}
            >
                <video
                    ref={videoRef}
                    autoPlay
                    style={{ width: "100%", height: "100%" }} // 컨테이너에 맞게 조정
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
                            height: "100%", // 컨테이너에 맞게 조정
                        }}
                    />
                )}
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
