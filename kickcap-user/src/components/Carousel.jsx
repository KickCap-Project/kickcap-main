import React from 'react';
import Slider from 'react-slick';
import styled from 'styled-components';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Guide from '../asset/img/svg/guide.svg';
import Money from '../asset/img/svg/money.svg';

const s = {
  CarouselContainer: styled.div`
    position: relative;
    width: 90%;

    & .slick-dots {
      position: absolute;
      bottom: 1rem;
      left: 50%;
      transform: translateX(-50%);
      z-index: 1;
    }

    & .slick-dots li {
      margin: 0 1px;
    }

    & .slick-dots li button:before {
      color: black;
    }

    @media (min-width: 768px) { // 태블릿
      & .slick-dots {
        bottom: 1.5rem; // 태블릿 화면에서 더 위로 이동
      }
    }
`,
  SlideItem: styled.div`
    background-color: ${(props) => props.theme.AreaColor};
    border: 1px solid #d3d3d3;
    box-shadow: 0px 4px 5px rgba(0, 0, 0, 0.2);
    text-align: center;
    border-radius: 1rem;
    margin-top: 4%;
    margin-bottom: 4%;
    width: 100%;
    height: 6rem;
    position: relative;
  `,
  Title: styled.div`
    font-size: 20px;
    font-weight: 900;
    padding: 10px 0 0 10px;
    text-align: left;
  `,
  Description: styled.div`
    text-align: left;
    padding: 10px 0 0 10px;
  `,
  Text: styled.div`
    font-size: 10px;
    font-weight: 700;
    margin-bottom: 2px;
  `,
  Br: styled.div`
    margin-bottom: 10px;
  `,
  Img: styled.img`
    height: 2rem;
    position: absolute;
    top: 50%;
    right: 5%;
  `,
};

const Carousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500, // 슬라이드 전환 속도
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true, // 자동 재생
    autoplaySpeed: 3000, // 자동으로 슬라이드 전환하는 time interval
    swipe: true,
    touchMove: true,
  };

  return (
    <s.CarouselContainer>
      <Slider {...settings}>
        <s.SlideItem>
          <s.Title>단속내역 확인 및 간편 납부</s.Title>
          <s.Description>
            <s.Text>이용자의 단속 이력과 상세정보를 간편하게 조회하고</s.Text>
            <s.Text>서비스 내에서 납부할 수 있습니다.</s.Text>
          </s.Description>
          <s.Img src={Guide} />
        </s.SlideItem>
        <s.SlideItem>
          <s.Title>제보하기 & 이의 제기</s.Title>
          <s.Description>
            <s.Text>거리를 활보하는 범법 킥보드를 신고할 수 있습니다.</s.Text>
            <s.Text>[불법주차, 안전모 미착용, 다인승차, 보도주행, 지정차로 위반]</s.Text>
            <s.Br />
            <s.Text>단속 사항에 문제가 있을 경우 이의 신청을 할 수 있습니다.</s.Text>
          </s.Description>
          <s.Img src={Guide} />
        </s.SlideItem>
        <s.SlideItem>
          <s.Title>PM 관련 법률 챗봇 지원</s.Title>
          <s.Description>
            <s.Text>이동형 전동장치(PM)에 관한 궁금한 법률 정보를 챗봇이 제공!</s.Text>
            <s.Text>법을 잘 몰라도 챗봇이 친절히 알려줘요~</s.Text>
          </s.Description>
          <s.Img src={Guide} />
        </s.SlideItem>
        <s.SlideItem>
          <s.Title>범칙금 안내 1</s.Title>
          <s.Description>
            <s.Text>· 불법 주차 : 범칙금 2만원 + 벌점 2점</s.Text>
            <s.Text>· 안전모 미착용 : 범칙금 2만원 + 벌점 2점</s.Text>
            <s.Text>· 다인 승차 : 범칙금 4만원 + 벌점 5점</s.Text>
          </s.Description>
          <s.Img src={Money} />
        </s.SlideItem>
        <s.SlideItem>
          <s.Title>범칙금 안내 2</s.Title>
          <s.Description>
            <s.Text>· 보도 주행 : 범칙금 3만원 + 벌점 3점</s.Text>
            <s.Text>· 지정 차로 위반 : 범칙금 1만원 + 벌점 1점</s.Text>
          </s.Description>
          <s.Img src={Money} />
        </s.SlideItem>
      </Slider>
    </s.CarouselContainer>
  );
};

export default Carousel;
