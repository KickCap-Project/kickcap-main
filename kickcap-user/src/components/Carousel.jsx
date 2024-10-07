import React from 'react';
import Slider from 'react-slick';
import styled from 'styled-components';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { BannerContent } from '../lib/data/BannerContent';

import { useAppSelector, useAppDispatch } from '../lib/hook/useReduxHook';
import { ChangeIsBanner, setBannerType, selectIsBanner } from '../store/carouselModal';
import BannerModal from './Modal/BannerModal';

const s = {
  CarouselContainer: styled.div`
    position: relative;
    width: 90%;
    padding-bottom: 2rem;

    & .slick-dots {
      /* border: 2px solid black; */
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
      font-size: 9px;
    }

    @media (min-width: 768px) {
      // 태블릿
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
    color: ${(props) => props.theme.mainColor};
    font-size: 20px;
    font-weight: 900;
    padding: 15px 0 0 15px;
    text-align: left;
  `,
  Description: styled.div`
    color: ${(props) => props.theme.mainColor};
    text-align: left;
    padding: 10px 0 0 15px;
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
    height: 50%;
    position: absolute;
    top: 45%;
    right: 2%;
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

  const isBanner = useAppSelector(selectIsBanner);
  const dispatch = useAppDispatch();
  const handleOpenBannerModal = (isFlag, type) => {
    dispatch(ChangeIsBanner(isFlag));
    dispatch(setBannerType(type));
  };

  return (
    <s.CarouselContainer>
      <Slider {...settings}>
        {Object.entries(BannerContent).map(([key, value]) => (
          <s.SlideItem key={key} onClick={() => handleOpenBannerModal(true, key)}>
            <s.Title>{value.banner.title}</s.Title>
            <s.Description>
              <s.Text>{value.banner.contentA}</s.Text>
              <s.Text>{value.banner.contentB}</s.Text>
            </s.Description>
            <s.Img src={value.banner.imgSrc} />
          </s.SlideItem>
        ))}
      </Slider>

      <BannerModal open={isBanner} toggleModal={handleOpenBannerModal} />
    </s.CarouselContainer>
  );
};

export default Carousel;
