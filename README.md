# KICKCAP 킥보드 단속 플랫폼

### ✍🏻 프로젝트 설명:

- 현재 사회에서는 개인형 이동장치(PM)와 관련된 안전사고가 많이 대두되고 있습니다. 이에 수동적으로 이루어지는 킥보드 단속환경을 개선하고자 카메라에 학습된 AI모델을 연결하여 자동 단속시스템을 개발하였습니다.

- 저희 프로젝트는 킥보드 번호판을 통해 자동 단속의 가능성과 벌점 제도를 바탕으로 킥보드 단속의 개선방향을 제시하여 보다 나은 이용 문화를 도모하고 있습니다.

### 개발기간 :
- 2024.08.26 ~ 2024.10.11(7주)

### 개발환경 : 
- 배포 환경 : EC2 ubuntu(20.04.6)
- GPU 서버 : Ubuntu(20.04), Python3.9

### 기술스택 :
- 백엔드 : <img src="https://img.shields.io/badge/springboot-6DB33F?style=for-the-badge&logo=html5&logoColor=white"> <img src="https://img.shields.io/badge/spring%20security-6DB33F?style=for-the-badge&logo=spring-security&logoColor=white"> <img src="https://img.shields.io/badge/JPA%20(Hibernate)-00485B?style=for-the-badge&logo=Hibernate&logoColor=white"> <img src="https://img.shields.io/badge/PostgreSQL-00485B?style=for-the-badge&logo=PostgreSQL&logoColor=white"> <img src="https://img.shields.io/badge/redis-00485B?style=for-the-badge&logo=redis&logoColor=white"> <img src="https://img.shields.io/badge/AIOHTTP-00485B?style=for-the-badge&logo=AIOHTTP&logoColor=white"> <img src="https://img.shields.io/badge/fastapi-00485B?style=for-the-badge&logo=fastapi&logoColor=white"> 
- 프론트엔드 : <img src="https://img.shields.io/badge/React-6DB33F?style=for-the-badge&logo=React&logoColor=white"> <img src="https://img.shields.io/badge/javascript-00485B?style=for-the-badge&logo=javascript&logoColor=white"> <img src="https://img.shields.io/badge/ReduxToolKit-00485B?style=for-the-badge&logo=Redux&logoColor=white"> <img src="https://img.shields.io/badge/TanstackQuery-00485B?style=for-the-badge&logo=Tanstack&logoColor=white"> <img src="https://img.shields.io/badge/styledcomponents-00485B?style=for-the-badge&logo=styled-components&logoColor=white"> <img src="https://img.shields.io/badge/PWA-00485B?style=for-the-badge&logo=PWA&logoColor=white">
- DevOps : <img src="https://img.shields.io/badge/Docker-6DB33F?style=for-the-badge&logo=Docker&logoColor=white"> <img src="https://img.shields.io/badge/Jenkins-6DB33F?style=for-the-badge&logo=Jenkins&logoColor=white"> <img src="https://img.shields.io/badge/nginx-6DB33F?style=for-the-badge&logo=nginx&logoColor=white"> <img src="https://img.shields.io/badge/haproxy-6DB33F?style=for-the-badge&logo=HaProxy&logoColor=white">
- tool : <img src="https://img.shields.io/badge/notion-6DB33F?style=for-the-badge&logo=notion&logoColor=white"> <img src="https://img.shields.io/badge/gitlab-6DB33F?style=for-the-badge&logo=gitlab&logoColor=white"> <img src="https://img.shields.io/badge/jira-6DB33F?style=for-the-badge&logo=jira&logoColor=white"> <img src="https://img.shields.io/badge/mattermost-6DB33F?style=for-the-badge&logo=mattermost&logoColor=white">

### 아키텍쳐 : 
![캡처](./imgs/architecture.png)

### 주요기능

- 일반 사용자(시민) :
    - 단속 내역(고지서) 목록 및 상세 정보 조회, 범칙금 간편 납부
    - 킥보드 불법주차 및 불량 이용 실시간 제보
    - 실시간 사고 신고
    - 단속 이의제기
    - 인공지능 챗봇 법률지원 서비스

- 경찰 :
    - 킥보드 대시보드 현황판
    - 단속 내역 확인
    - 국민 제보 확인 (주차장 정보 및 단속자 정보 확인 가능)
    - 이의제기 내역 확인 (단속 내역 확인 가능)

- CCTV :
    - YOLO로 킥보드 객체 탐지
    - OCR로 번호판 확인
    

### 팀원소개 : 

|                      이름                      |      역할       | 소감                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| :--------------------------------------------: | :-------------: | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|  ![박민지](./imgs/박민지.jpg) <br>박민지  |    팀장(BE)     | 팀장 겸 백엔드 개발자로 참여하여 RAG 챗봇, 시민·경찰 로그인 기능 구현, AES-256 암호화 처리, 이의제기 CRUD 및 대시보드 기능을 JPA와 QueryDSL로 개발하며 공공안전을 위한 기술적 해결책을 마련했습니다. 이를 통해 실제 서비스에서의 보안과 효율성의 중요성을 깊이 느꼈습니다. 특히, 민감한 정보를 안전하게 처리하고, 사용자 경험을 고려한 시스템 설계를 통해 기술적 성장뿐만 아니라 문제 해결 능력을 키울 수 있었습니다. 협업 과정에서 다양한 기술을 접목하며 프로젝트의 완성도를 높인 점이 보람 있었습니다.                                                                                                                  |
| ![오진영](./imgs/오진영.jpg) <br> 오진영 |     FE 리더     | 처음 프로젝틀 기획할 때 대학 졸업작품으로 하고싶었던 주제를 장난 반, 진심 반으로 아이디어를 냈는데 이게 프로젝트 주제로 진행될 줄은 꿈에도 몰랐습니다. 그래서 그런지 어려움이 많은 프로젝트임에도 불구하고 팀원분들이 적극적으로 임해주어서 대단히 고마웠고 FE 개발을 하면서 데이터 시각화를 보다 심도있게 해보고 Tanstack Query를 활용해서 동적 할당도 해보는 등 많은 경험을 할 수 있어서 참 의미있는 프로젝트였던 것 같습니다.<br> 또한 처음으로 렌더링 및 성능 최적화도 해보았는데 렌더링은 눈에 띄게 줄었지만 성능 측면에서 많이 최적화 하지 못한 점이 아쉬움에 남습니다.<br>다음 프로젝트에서는 이 점을 보완하여 조금 더 발전할 수 있는 프로젝트가 되었으면 좋겠습니다. <br>모두 고생했고 감사합니다~                                                                                                                                      |
| ![유현진](./imgs/유현진.jpg) <br>유현진  | BE  | PostgreSQL과 Redis를 사용하여 대량 데이터 처리 경험을 할 수 있었습니다. 이 과정을 통해서 Redis에 대해 자세히 학습할 수 있는 기회를 가지게 되었습니다. 또한 백엔드 코드 컨벤션을 통해 exception Handler를 만들어 사용함으로써 코드의 일관성을 유지할 수 있었고 해당 프로젝트를 통해 새로운 기술을 배우고 학습할 수 있어서 좋았습니다.                                                                                                                                                                                                                                                                                                   |
| ![정동찬](./imgs/정동찬.jpg) <br> 정동찬 |     FE      | 첫 번째 프로젝트 때와 달리 프론트엔드 개발의 기본적인 요소인 화면 설계 및 구현 역할에 좀더 치중했습니다. 이전 프로젝트에서 부족했던 부분을 이번에 보완해 보자고 생각해, Redux Toolkit과 같은 본격적인 상태관리 라이브러리를 적용하고, 컴포넌트의 역할에 따라 충분히 나누어 구현하는 데 중점을 두었습니다. 특히 PWA 서비스의 기능 대부분을 구현하는 과정에서 API를 설계하고 연결하는 작업 중 백엔드 담당과 많은 이야기를 하며 소통의 중요성을 깊이 느꼈습니다.                                                                                                                                                       |
| ![박병준](./imgs/박병준.jpg) <br>박병준  |       인프라        | 이번 프로젝트에서 인프라를 담당하며 평소 해보고 싶었던 것들을 많이 해보았습니다. Blue-Green 배포를 구현하거나 HaProxy를 사용하여 로드밸런싱을 하는 등 실제 배포환경에서 신경 쓸 부분에 대해서 많이 배워간다는 생각이 듭니다. 특히 신경 썼던 부분중 하나가 .env파일이나 properties의 key값 등을 공개되지 않도록 신경쓰는 부분이었는데, 프로젝트 내내 지켜진 것 같아 조금은 뿌듯하게 느껴집니다.  |
| ![김종원](./imgs/김종원.jpg) <br>김종원  |       AI        | 이번 프로젝트를 통해 다양한 AI 기술을 접할 수 있었고, 문제를 해결하는 방식에서 큰 변화를 경험했습니다. 문제를 바라보는 관점을 새롭게 바꾸는 것이 중요하다는 것을 깨달았으며 다양한 시각으로 문제를 분석하고 해결하는 과정을 통해, 문제 해결의 깊이와 폭이 늘어난 것 같습니다. 앞으로도 프로젝트를 진행하며 여러 관점에서 문제를 바라보며 더 나은 해결책을 찾기 위해 노력하겠습니다.                                                                                                                                                                                                                                                             |                                                                                                                                                      |

## 참고 및 출처

- AI데이터 : https://www.aihub.or.kr/aihubdata/data/view.do?currMenu=&topMenu=&aihubDataSe=data&dataSetSn=614
- 대한민국 행정경계 GeoJSON 및 SVG **:** https://github.com/statgarten/maps
