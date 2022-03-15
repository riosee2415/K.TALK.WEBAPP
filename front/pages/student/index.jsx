import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { END } from "redux-saga";
import axios from "axios";
import wrapper from "../../store/configureStore";
import { SEO_LIST_REQUEST } from "../../reducers/seo";
import { LOAD_MY_INFO_REQUEST } from "../../reducers/user";

import { useRouter } from "next/router";
import Head from "next/head";

import { message, Slider } from "antd";
import styled from "styled-components";
import useWidth from "../../hooks/useWidth";
import ClientLayout from "../../components/ClientLayout";
import {
  Image,
  RsWrapper,
  Text,
  WholeWrapper,
  Wrapper,
} from "../../components/commonComponents";
import Theme from "../../components/Theme";

const CustomSlide = styled(Slider)`
  width: 100%;
  margin: 0 0 8px;
  & .ant-slider-track,
  & .ant-slider-rail {
    height: 12px;
    border-radius: 10px;
  }

  & .ant-slider-track {
    background-color: ${(props) => props.bgColor} !important;
  }

  & .ant-slider-handle {
    display: none;
  }
`;

const Student = () => {
  ////// GLOBAL STATE //////
  const { seo_keywords, seo_desc, seo_ogImage, seo_title } = useSelector(
    (state) => state.seo
  );
  const { me } = useSelector((state) => state.user);

  ////// HOOKS //////
  const router = useRouter();

  ////// USEEFFECT //////
  useEffect(() => {
    if (!me) {
      message.error("로그인 후 이용해주세요.");
      // return router.push(`/`);
    }
  }, [me]);
  return (
    <>
      <Head>
        <title>{seo_title.length < 1 ? "ALAL" : seo_title[0].content}</title>

        <meta
          name="subject"
          content={seo_title.length < 1 ? "ALAL" : seo_title[0].content}
        />
        <meta
          name="title"
          content={seo_title.length < 1 ? "ALAL" : seo_title[0].content}
        />
        <meta name="keywords" content={seo_keywords} />
        <meta
          name="description"
          content={
            seo_desc.length < 1 ? "undefined description" : seo_desc[0].content
          }
        />
        {/* <!-- OG tag  --> */}
        <meta
          property="og:title"
          content={seo_title.length < 1 ? "ALAL" : seo_title[0].content}
        />
        <meta
          property="og:site_name"
          content={seo_title.length < 1 ? "ALAL" : seo_title[0].content}
        />
        <meta
          property="og:description"
          content={
            seo_desc.length < 1 ? "undefined description" : seo_desc[0].content
          }
        />
        <meta property="og:keywords" content={seo_keywords} />
        <meta
          property="og:image"
          content={seo_ogImage.length < 1 ? "" : seo_ogImage[0].content}
        />
      </Head>
      <ClientLayout>
        <WholeWrapper margin={`100px 0 0`} bgColor={Theme.subTheme_C}>
          <RsWrapper>
            <Wrapper margin={`60px 0`} dr={`row`} ju={`flex-start`}>
              <Wrapper width={`auto`} padding={`9px`} bgColor={Theme.white_C}>
                <Image
                  width={`75px`}
                  height={`75px`}
                  radius={`100px`}
                  src="https://t1.daumcdn.net/thumb/R720x0.fjpg/?fname=http://t1.daumcdn.net/brunch/service/user/1UzB/image/paEOLJhjPWh-CW7c2KoUJ-tKWs4.jpg"
                  alt="student_thumbnail"
                />
              </Wrapper>
              <Text
                fontSize={`28px`}
                fontWeight={`bold`}
                padding={`0 0 0 15px`}
              >
                안녕하세요, Aaliyah님!
              </Text>
            </Wrapper>

            <Wrapper al={`flex-start`}>
              <Text fontSize={`22px`} fontWeight={`bold`}>
                내 시간표
              </Text>
            </Wrapper>

            <Wrapper
              padding={`40px 30px 35px`}
              dr={`row`}
              ju={`flex-start`}
              bgColor={Theme.white_C}
              radius={`10px`}
            >
              <Wrapper width={`auto`} padding={`5px`}>
                <Image
                  width={`22px`}
                  height={`22px`}
                  src="https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_clock.png"
                  alt="clock_icon"
                />
              </Wrapper>
              <Text fontSize={`18px`} fontWeight={`bold`} lineHeight={`1.22`}>
                화요일 | 7PM
              </Text>
              <Text fontSize={`18px`} fontWeight={`bold`} lineHeight={`1.22`}>
                수요일 | 9AM
              </Text>
            </Wrapper>

            <Wrapper al={`flex-start`}>
              <Text fontSize={`22px`} fontWeight={`bold`}>
                내 강의정보
              </Text>
            </Wrapper>

            <Wrapper
              dr={`row`}
              padding={`30px`}
              bgColor={Theme.white_C}
              radius={`10px`}
              ju={`space-between`}
            >
              <Image
                width={`184px`}
                height={`190px`}
                radius={`5px`}
                src="https://t1.daumcdn.net/thumb/R720x0.fjpg/?fname=http://t1.daumcdn.net/brunch/service/user/1UzB/image/paEOLJhjPWh-CW7c2KoUJ-tKWs4.jpg"
                alt="student_thumbnail"
              />

              <Wrapper width={`calc(100% - 204px)`}>
                <Wrapper dr={`row`}>
                  <Wrapper width={`calc(60% - 1px)`} padding={`0 40px 0 0`}>
                    <Wrapper dr={`row`} ju={`flex-start`}>
                      <Text
                        margin={`0 10px 0 0`}
                        fontSize={`18px`}
                        fontWeight={`bold`}
                      >
                        강의명
                      </Text>
                      <Text>한국어 초급/중급반</Text>
                    </Wrapper>
                    <Wrapper dr={`row`} ju={`flex-start`} color={Theme.grey2_C}>
                      <Text>강사 이름</Text>
                      <Text margin={`0 10px`}>|</Text>
                      <Text>강의 수 : 5/30</Text>
                      <Text margin={`0 10px`}>|</Text>
                      <Text>등록상황 : 수료중</Text>
                    </Wrapper>

                    <Wrapper>
                      <Wrapper dr={`row`} ju={`flex-start`}>
                        <Text width={`15%`}>● 출석 상황</Text>
                        <Wrapper width={`80%`}>
                          <CustomSlide
                            defaultValue={100}
                            disabled={true}
                            draggableTrack={true}
                            bgColor={Theme.subTheme2_C}
                          />
                        </Wrapper>
                      </Wrapper>
                      <Wrapper dr={`row`} ju={`flex-start`} margin={`15px 0`}>
                        <Text width={`15%`}>● 수업 진도</Text>
                        <Wrapper width={`80%`}>
                          <CustomSlide
                            defaultValue={55}
                            disabled={true}
                            draggableTrack={true}
                            bgColor={Theme.basicTheme_C}
                          />
                        </Wrapper>
                      </Wrapper>
                      <Wrapper dr={`row`} ju={`flex-start`}>
                        <Text width={`15%`}>● 성취도</Text>
                        <Wrapper width={`80%`}>
                          <CustomSlide
                            defaultValue={100}
                            disabled={true}
                            draggableTrack={true}
                            bgColor={Theme.subTheme6_C}
                          />
                        </Wrapper>
                      </Wrapper>
                    </Wrapper>
                  </Wrapper>

                  <Wrapper
                    width={`1px`}
                    height={`190px`}
                    borderRight={`1px dashed ${Theme.grey_C}`}
                  />
                  <Wrapper width={`40%`}></Wrapper>
                </Wrapper>
              </Wrapper>
              {/** */}
            </Wrapper>
          </RsWrapper>
        </WholeWrapper>
      </ClientLayout>
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  async (context) => {
    // SSR Cookie Settings For Data Load/////////////////////////////////////
    const cookie = context.req ? context.req.headers.cookie : "";
    axios.defaults.headers.Cookie = "";
    if (context.req && cookie) {
      axios.defaults.headers.Cookie = cookie;
    }
    ////////////////////////////////////////////////////////////////////////
    // 구현부

    context.store.dispatch({
      type: LOAD_MY_INFO_REQUEST,
    });

    context.store.dispatch({
      type: SEO_LIST_REQUEST,
    });

    // 구현부 종료
    context.store.dispatch(END);
    console.log("🍀 SERVER SIDE PROPS END");
    await context.store.sagaTask.toPromise();
  }
);

export default Student;
