import React, { useEffect, useCallback } from "react";
import {
  ColWrapper,
  RowWrapper,
  Wrapper,
  CommonButton,
  RsWrapper,
  Text,
} from "../commonComponents";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { MAIN_BANNER_REQUEST } from "../../reducers/banner";
import Theme from "../Theme";
import { Carousel } from "antd";
import useWidth from "../../hooks/useWidth";
import { useRouter } from "next/router";

const MainSliderWrapper = styled(RowWrapper)`
  & .ant-carousel {
    width: 100%;
  }
`;

const MainSlider = () => {
  const width = useWidth();

  const dispatch = useDispatch();
  const { banners } = useSelector((state) => state.banner);
  const { me } = useSelector((state) => state.user);

  const router = useRouter();

  useEffect(() => {
    dispatch({
      type: MAIN_BANNER_REQUEST,
    });
  }, [me]);

  const moveLinkHandler = useCallback((link) => {
    window.open(link);
  }, []);
  return (
    <MainSliderWrapper>
      <Carousel autoplay={true} speed={3000}>
        {banners &&
          banners.map((data, idx) => {
            return (
              <ColWrapper
                key={idx}
                span={24}
                height={width < 800 ? `500px` : `720px`}
                padding={width < 800 ? `59px 0 0` : `110px 0 0`}
                bgImg={`url(${data.imagePath})`}
                position={`relative`}
                display={`flex !important`}
              >
                <RsWrapper height={`100%`}>
                  <Wrapper al={`flex-start`}>
                    <Wrapper
                      al={`flex-start`}
                      color={Theme.basicTheme_C}
                      fontSize={width < 700 ? `22px` : `40px`}
                      lineHeight={`1.3`}
                    >
                      <Text>{data.title}</Text>
                    </Wrapper>
                    <ColWrapper
                      color={Theme.basicTheme_C}
                      lineHeight={`1.5`}
                      margin={`20px 0`}
                    >
                      <Text fontSize={`1.125rem`}>{data.content}</Text>
                    </ColWrapper>
                  </Wrapper>
                </RsWrapper>
              </ColWrapper>
            );
          })}
      </Carousel>
    </MainSliderWrapper>
  );
};

export default MainSlider;
