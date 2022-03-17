import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { END } from "redux-saga";
import axios from "axios";
import wrapper from "../../store/configureStore";
import { SEO_LIST_REQUEST } from "../../reducers/seo";
import { LOAD_MY_INFO_REQUEST } from "../../reducers/user";

import { useRouter } from "next/router";
import Head from "next/head";

import { Empty, message, Pagination, Slider } from "antd";
import styled from "styled-components";
import useWidth from "../../hooks/useWidth";
import ClientLayout from "../../components/ClientLayout";
import {
  CommonButton,
  Image,
  RsWrapper,
  SpanText,
  Text,
  WholeWrapper,
  Wrapper,
} from "../../components/commonComponents";
import Theme from "../../components/Theme";
import { RightOutlined } from "@ant-design/icons";

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

const CustomTableHoverWrapper = styled(Wrapper)`
  flex-direction: row;
  padding: 25px 0 20px;
  background-color: ${Theme.lightGrey_C};
  cursor: pointer;
  &:hover {
    background-color: ${Theme.white_C};
  }
`;

const DashBorder = styled(Wrapper)`
  width: 1px;
  height: ${(props) => props.height || `34px`};
  border-right: 1px dashed ${Theme.grey_C};
  margin: ${(props) => props.margin || `0 8px`};
  @media (max-width: 430px) {
    margin: 0 5px;
  }
`;

const CustomPage = styled(Pagination)`
  & .ant-pagination-next > button {
    border: none;
  }

  & .ant-pagination-prev > button {
    border: none;
  }
  & .ant-pagination-item {
    border: none;
  }

  & .ant-pagination-item-active a {
    color: ${Theme.subTheme2_C};
  }

  & .ant-pagination-item:focus-visible a,
  .ant-pagination-item:hover a {
    color: ${Theme.subTheme2_C};
  }

  & .ant-pagination-item-link svg {
    font-weight: bold;
    color: ${Theme.black_2C};
  }
`;

const Index = () => {
  ////// GLOBAL STATE //////
  const { seo_keywords, seo_desc, seo_ogImage, seo_title } = useSelector(
    (state) => state.seo
  );
  const { me } = useSelector((state) => state.user);

  ////// HOOKS //////
  const router = useRouter();
  const width = useWidth();

  ////// USEEFFECT //////
  useEffect(() => {
    if (!me) {
      message.error("로그인 후 이용해주세요.");
      // return router.push(`/`);
    }
  }, [me]);

  ////// DATAVIEW //////

  const testArr = [
    {
      id: 1,
      lessons: [
        {
          id: 1,
          time: `0PM`,
          day: `목요일`,
        },
        {
          id: 1,
          time: `0PM`,
          day: `목요일`,
        },
        {
          id: 1,
          time: `0PM`,
          day: `목요일`,
        },
        {
          id: 1,
          time: `0PM`,
          day: `목요일`,
        },
        {
          id: 1,
          time: `0PM`,
          day: `목요일`,
        },
      ],

      period: "2022/01/01 ~ 2022/01/28",
      name: "오민형",
      type1: "공지사항 확인",
      type2: "ZOOM ID PW 확인",
    },
    {
      id: 2,
      time1: "12PM",
      lessons: [
        {
          id: 1,
          time: `0PM`,
          day: `목요일`,
        },
        {
          id: 1,
          time: `0PM`,
          day: `목요일`,
        },
        {
          id: 1,
          time: `0PM`,
          day: `목요일`,
        },
        {
          id: 1,
          time: `0PM`,
          day: `목요일`,
        },
        {
          id: 1,
          time: `0PM`,
          day: `목요일`,
        },
      ],
      period: "2022/01/01 ~ 2022/01/28",
      name: "오민형",
      type1: "공지사항 확인",
      type2: "ZOOM ID PW 확인",
    },
    {
      id: 3,
      time1: "12PM",
      lessons: [
        {
          id: 1,
          time: `0PM`,
          day: `목요일`,
        },
        {
          id: 1,
          time: `0PM`,
          day: `목요일`,
        },
        {
          id: 1,
          time: `0PM`,
          day: `목요일`,
        },
        {
          id: 1,
          time: `0PM`,
          day: `목요일`,
        },
        {
          id: 1,
          time: `0PM`,
          day: `목요일`,
        },
      ],
      period: "2022/01/01 ~ 2022/01/28",
      name: "오민형",
      type1: "공지사항 확인",
      type2: "ZOOM ID PW 확인",
    },
    {
      id: 4,
      time1: "12PM",
      lessons: [
        {
          id: 1,
          time: `0PM`,
          day: `목요일`,
        },
        {
          id: 1,
          time: `0PM`,
          day: `목요일`,
        },
        {
          id: 1,
          time: `0PM`,
          day: `목요일`,
        },
        {
          id: 1,
          time: `0PM`,
          day: `목요일`,
        },
        {
          id: 1,
          time: `0PM`,
          day: `목요일`,
        },
      ],
      period: "2022/01/01 ~ 2022/01/28",
      name: "오민형",
      type1: "공지사항 확인",
      type2: "ZOOM ID PW 확인",
    },
    {
      id: 5,
      time1: "12PM",
      lessons: [
        {
          id: 1,
          time: `0PM`,
          day: `목요일`,
        },
        {
          id: 1,
          time: `0PM`,
          day: `목요일`,
        },
        {
          id: 1,
          time: `0PM`,
          day: `목요일`,
        },
        {
          id: 1,
          time: `0PM`,
          day: `목요일`,
        },
        {
          id: 1,
          time: `0PM`,
          day: `목요일`,
        },
      ],
      period: "2022/01/01 ~ 2022/01/28",
      name: "오민형",
      type1: "공지사항 확인",
      type2: "ZOOM ID PW 확인",
    },
  ];

  const clockArr = [
    {
      name: "월요일",
      time: "7PM",
    },
    {
      name: "화요일",
      time: "7PM",
    },
    {
      name: "수요일",
      time: "7PM",
    },
    {
      name: "금요일",
      time: "7PM",
    },
  ];

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
            <Wrapper
              margin={width < 1100 ? `30px 0` : `60px 0`}
              dr={`row`}
              ju={`flex-start`}
            >
              <Wrapper width={`auto`} padding={`9px`} bgColor={Theme.white_C}>
                <Image
                  width={width < 1100 ? `50px` : `75px`}
                  height={width < 1100 ? `50px` : `75px`}
                  radius={`100px`}
                  src="https://t1.daumcdn.net/thumb/R720x0.fjpg/?fname=http://t1.daumcdn.net/brunch/service/user/1UzB/image/paEOLJhjPWh-CW7c2KoUJ-tKWs4.jpg"
                  alt="student_thumbnail"
                />
              </Wrapper>
              <Text
                fontSize={width < 800 ? `20px` : `28px`}
                fontWeight={`bold`}
                padding={`0 0 0 15px`}
              >
                안녕하세요, Aaliyah님!
              </Text>
            </Wrapper>

            <Wrapper al={`flex-start`} margin={`0 0 20px`}>
              <Text
                fontSize={width < 800 ? `18px` : `22px`}
                fontWeight={`bold`}
              >
                무료수업 안내 / 수업스케쥴
              </Text>
            </Wrapper>

            <Wrapper
              padding={width < 700 ? `15px 10px 10px` : `40px 30px 35px`}
              dr={`row`}
              ju={`flex-start`}
              bgColor={Theme.white_C}
              radius={`10px`}
              shadow={`0px 5px 15px rgba(0, 0, 0, 0.16)`}
              margin={`0 0 86px`}
              al={`flex-start`}
            >
              <Wrapper
                width={width < 1280 ? (width < 800 ? `100%` : `60%`) : `37%`}
                dr={`row`}
                ju={`flex-start`}
                al={`flex-start`}
              >
                <Wrapper
                  width={`auto`}
                  padding={width < 700 ? `0` : `5px`}
                  margin={`0 10px 0 0`}
                >
                  <Image
                    width={`22px`}
                    height={`22px`}
                    src="https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_clock.png"
                    alt="clock_icon"
                  />
                </Wrapper>
                <Wrapper
                  width={`calc(100% - 42px)`}
                  dr={`row`}
                  ju={`flex-start`}
                >
                  {clockArr &&
                    clockArr.length > 0 &&
                    clockArr.map((data, idx) => {
                      return (
                        <>
                          <Text
                            fontSize={width < 800 ? `14px` : `18px`}
                            fontWeight={`bold`}
                            lineHeight={`1.22`}
                          >
                            {data.name}&nbsp;&nbsp;|&nbsp;&nbsp;{data.time}
                          </Text>
                          <Wrapper
                            display={
                              width < 1280
                                ? `flex`
                                : (idx + 1) % 3 === 0 && `none`
                            }
                            width={`1px`}
                            height={width < 800 ? `20px` : `34px`}
                            borderLeft={`1px dashed ${Theme.grey_C}`}
                            margin={
                              width < 1350
                                ? width < 800
                                  ? `0 4px`
                                  : `0 10px`
                                : `0 20px`
                            }
                          />
                        </>
                      );
                    })}
                </Wrapper>
              </Wrapper>

              <Wrapper
                width={width < 1280 ? (width < 800 ? `100%` : `40%`) : `230px`}
                dr={`row`}
                ju={`flex-start`}
                margin={
                  width < 1280 ? (width < 800 ? `5px 0` : `0`) : `0 30px 0 0`
                }
              >
                <Wrapper width={`auto`} margin={`0 10px 0 0`}>
                  <Image
                    width={`22px`}
                    height={`22px`}
                    src="https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_calender_y.png"
                    alt="clender_icon"
                  />
                </Wrapper>
                <Text fontSize={width < 700 ? `14px` : `18px`}>
                  2022/01/01 ~ 2022/01/28
                </Text>
              </Wrapper>
              <Wrapper
                width={
                  width < 1280 ? `100%` : `calc(100% - 37% - 230px - 30px)`
                }
                dr={`row`}
                ju={`flex-start`}
                al={`flex-start`}
              >
                <Wrapper
                  maxWidth={width < 800 ? `100%` : `25%`}
                  width={`auto`}
                  dr={`row`}
                  ju={`flex-start`}
                  margin={width < 800 ? `0 0 10px` : `0 20px 0 0`}
                >
                  <Image
                    margin={`0 10px 0 0`}
                    width={`22px`}
                    height={`22px`}
                    src="https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_name.png"
                    alt="clender_icon"
                  />
                  <Text
                    fontSize={width < 700 ? `14px` : `18px`}
                    width={`calc(100% - 22px - 10px)`}
                    isEllipsis
                  >
                    오민형 오민형 오민형 오민형 오민형 오민형
                  </Text>
                </Wrapper>

                <Wrapper
                  width={width < 800 ? `100%` : `calc(75% - 20px)`}
                  dr={`row`}
                  ju={`flex-start`}
                  fontSize={width < 700 ? `12px` : `16px`}
                >
                  {width > 800 && (
                    <DashBorder
                      height={width < 800 ? `20px` : `34px`}
                      margin={
                        width < 1350
                          ? width < 800
                            ? `0 4px 0 0`
                            : `0 10px 0 0`
                          : `0 20px 0 0`
                      }
                    />
                  )}
                  <Text fontSize={width < 700 ? `14px` : `18px`}>
                    공지사항 확인
                  </Text>
                  <DashBorder
                    height={width < 800 ? `20px` : `34px`}
                    margin={
                      width < 1350
                        ? width < 800
                          ? `0 4px`
                          : `0 10px`
                        : `0 20px`
                    }
                  />
                  <Text fontSize={width < 700 ? `14px` : `18px`}>
                    ZOOM ID PW 확인
                  </Text>
                </Wrapper>
              </Wrapper>
            </Wrapper>

            <CustomPage />

            <Wrapper al={`flex-start`} margin={`80px 0 20px`}>
              <Text
                fontSize={width < 800 ? `18px` : `22px`}
                fontWeight={`bold`}
                margin={`0 0 20px`}
              >
                정규과정 안내 (K-talk Live regular paid lessons)
              </Text>

              <Wrapper
                radius={`10px`}
                padding={width < 800 ? `15px` : `30px 40px`}
                bgColor={Theme.white_C}
                shadow={`0 5px 15px rgba(0,0,0,0.05)`}
                dr={width < 1100 ? `column` : `row`}
                ju={width < 1100 ? `center` : `flex-start`}
                al={width < 1100 ? `flex-start` : `center`}
                margin={`0 0 60px`}
              >
                <Text
                  fontSize={width < 1100 ? `12px` : `17px`}
                  margin={width < 1100 ? `0 0 10px` : `0`}
                >
                  Starts every Monday
                </Text>
                {width > 1100 && (
                  <Wrapper
                    width={`1px`}
                    height={`13px`}
                    bgColor={Theme.grey2_C}
                    margin={`0 20px`}
                  ></Wrapper>
                )}
                <Text
                  fontSize={width < 1100 ? `12px` : `17px`}
                  margin={width < 1100 ? `0 0 10px` : `0`}
                >
                  Suitable for beginner to advanced
                </Text>
                {width > 1100 && (
                  <Wrapper
                    width={`1px`}
                    height={`13px`}
                    bgColor={Theme.grey2_C}
                    margin={`0 20px`}
                  ></Wrapper>
                )}
                <Text
                  fontSize={width < 1100 ? `12px` : `17px`}
                  margin={width < 1100 ? `0 0 10px` : `0`}
                >
                  Live online group class by Native Korean teachers
                </Text>
                {width > 1100 && (
                  <Wrapper
                    width={`1px`}
                    height={`13px`}
                    bgColor={Theme.grey2_C}
                    margin={`0 20px`}
                  ></Wrapper>
                )}
                <Text
                  fontSize={width < 1100 ? `12px` : `17px`}
                  margin={width < 1100 ? `0 0 10px` : `0`}
                >
                  Not more than 7 learners in a class
                </Text>
                {width > 1100 && (
                  <Wrapper
                    width={`1px`}
                    height={`13px`}
                    bgColor={Theme.grey2_C}
                    margin={`0 20px`}
                  ></Wrapper>
                )}
                <Text
                  fontSize={width < 1100 ? `12px` : `17px`}
                  margin={width < 1100 ? `0 0 10px` : `0`}
                >
                  3 sessions a week (1 session = 50 minutes)
                </Text>
                {width > 1100 && (
                  <Wrapper
                    width={`1px`}
                    height={`13px`}
                    bgColor={Theme.grey2_C}
                    margin={`0 20px`}
                  ></Wrapper>
                )}
                <Text
                  fontSize={width < 1100 ? `12px` : `17px`}
                  margin={width < 1100 ? `0 0 10px` : `0`}
                >
                  U$162 / 4 weeks (12 sessions over 4 weeks)
                </Text>
                {width > 1100 && (
                  <Wrapper
                    width={`1px`}
                    height={`13px`}
                    bgColor={Theme.grey2_C}
                    margin={`0 20px`}
                  ></Wrapper>
                )}
                <Text
                  fontSize={width < 1100 ? `12px` : `17px`}
                  margin={width < 1100 ? `0 0 10px` : `0`}
                >
                  Money-back guarantee for all lesson
                </Text>
                {width > 1100 && (
                  <Wrapper
                    width={`1px`}
                    height={`13px`}
                    bgColor={Theme.grey2_C}
                    margin={`0 20px`}
                  ></Wrapper>
                )}
                <Text
                  fontSize={width < 1100 ? `12px` : `17px`}
                  margin={width < 1100 ? `0 0 10px` : `0`}
                >
                  Lessons by Zoom
                </Text>
                <Text
                  fontSize={width < 1100 ? `12px` : `17px`}
                  margin={width < 1100 ? `0 0 10px` : `0`}
                >
                  Payment through Paypal
                </Text>
              </Wrapper>
            </Wrapper>

            <CommonButton
              kindOf={`subTheme2`}
              padding={`0`}
              width={`315px`}
              height={`50px`}
              margin={`0 0 85px`}
            >
              <Wrapper dr={`row`} ju={`space-between`} padding={`0 5px 0 15px`}>
                apply regular paid lessons
                <Wrapper
                  width={`38px`}
                  height={`38px`}
                  bgColor={Theme.white_C}
                  radius={`50%`}
                  color={`${Theme.subTheme2_C} !important`}
                >
                  <RightOutlined />
                </Wrapper>
              </Wrapper>
            </CommonButton>

            <Wrapper al={`flex-start`} margin={`0 0 90px`}>
              <Text
                fontSize={width < 800 ? `18px` : `22px`}
                fontWeight={`bold`}
                margin={`0 0 20px`}
              >
                줌미팅 신청
              </Text>

              <Wrapper
                radius={`10px`}
                padding={
                  width < 1100 ? (width < 800 ? `15px` : `20px`) : `0 40px`
                }
                bgColor={Theme.white_C}
                shadow={`0 5px 15px rgba(0,0,0,0.05)`}
                dr={`row`}
                ju={`flex-start`}
                margin={`0 0 60px`}
                minHeight={`95px`}
              >
                <Wrapper dr={`row`} width={width < 1100 ? `100%` : `auto`}>
                  <Wrapper
                    width={
                      width < 1100
                        ? width < 800
                          ? `100%`
                          : `calc(50% - 31px)`
                        : `auto`
                    }
                    dr={`row`}
                    ju={`flex-start`}
                    margin={width < 800 ? `0 0 10px` : `0`}
                  >
                    <Text
                      fontSize={width < 1100 ? `14px` : `18px`}
                      fontWeight={`bold`}
                    >
                      줌미팅 신청
                    </Text>
                    <Wrapper
                      width={`1px`}
                      height={`13px`}
                      bgColor={Theme.grey2_C}
                      margin={`0 10px`}
                    ></Wrapper>
                    <Text>신청하기</Text>
                  </Wrapper>

                  {width > 800 && <DashBorder margin={`0 30px`} />}

                  <Wrapper
                    width={
                      width < 1100
                        ? width < 800
                          ? `100%`
                          : `calc(50% - 31px)`
                        : `auto`
                    }
                    dr={`row`}
                    ju={`flex-start`}
                    margin={width < 800 ? `0 0 10px` : `0`}
                  >
                    <Text
                      fontSize={width < 1100 ? `14px` : `18px`}
                      fontWeight={`bold`}
                    >
                      예정 미팅 시간
                    </Text>
                    <Wrapper
                      width={`1px`}
                      height={`13px`}
                      bgColor={Theme.grey2_C}
                      margin={`0 10px`}
                    ></Wrapper>
                    <Text margin={`0 20px 0 0`}>2022/01/25</Text>
                    <Text>오후 12시</Text>
                  </Wrapper>
                </Wrapper>

                {width > 1100 && <DashBorder margin={`0 30px`} />}

                <Wrapper dr={`row`} width={width < 1100 ? `100%` : `auto`}>
                  <Wrapper
                    width={
                      width < 1100
                        ? width < 800
                          ? `100%`
                          : `calc(50% - 31px)`
                        : `auto`
                    }
                    dr={`row`}
                    ju={`flex-start`}
                    margin={width < 800 ? `0 0 10px` : `0`}
                  >
                    <Text
                      fontSize={width < 1100 ? `14px` : `18px`}
                      fontWeight={`bold`}
                    >
                      최종 미팅약속
                    </Text>
                    <Wrapper
                      width={`1px`}
                      height={`13px`}
                      bgColor={Theme.grey2_C}
                      margin={`0 10px`}
                    ></Wrapper>
                    <Text>신청내역 없음</Text>
                  </Wrapper>

                  {width > 800 && <DashBorder margin={`0 30px`} />}

                  <Wrapper
                    width={
                      width < 1100
                        ? width < 800
                          ? `100%`
                          : `calc(50% - 31px)`
                        : `auto`
                    }
                  >
                    <Wrapper
                      dr={`row`}
                      ju={`flex-start`}
                      margin={width < 800 ? `0 0 10px` : `0`}
                    >
                      <Text
                        fontWeight={`700`}
                        fontSize={width < 1100 ? `14px` : `16px`}
                        width={`80px`}
                        margin={`0 10px 0 0`}
                      >
                        ZOOM ID
                      </Text>
                      <Text fotnSize={`16px`} color={Theme.grey2_C}>
                        신청내역 없음
                      </Text>
                    </Wrapper>
                    <Wrapper
                      dr={`row`}
                      ju={`flex-start`}
                      margin={width < 800 ? `0 0 10px` : `0`}
                    >
                      <Text
                        fontWeight={`700`}
                        fontSize={width < 1100 ? `14px` : `16px`}
                        width={`80px`}
                        margin={`0 10px 0 0`}
                      >
                        Password
                      </Text>
                      <Text fotnSize={`16px`} color={Theme.grey2_C}>
                        신청내역 없음
                      </Text>
                    </Wrapper>
                  </Wrapper>
                </Wrapper>
              </Wrapper>
            </Wrapper>
            <Wrapper al={`flex-start`} margin={`0 0 90px`}>
              <Text
                fontSize={width < 800 ? `18px` : `22px`}
                fontWeight={`bold`}
                margin={`0 0 20px`}
              >
                최종 등록
              </Text>

              <Wrapper
                radius={`10px`}
                padding={
                  width < 1100 ? (width < 800 ? `15px` : `20px`) : `0 40px`
                }
                bgColor={Theme.white_C}
                shadow={`0 5px 15px rgba(0,0,0,0.05)`}
                dr={`row`}
                ju={`flex-start`}
                margin={`0 0 60px`}
                minHeight={`95px`}
              >
                <Wrapper width={width < 1100 ? `100%` : `auto`} dr={`row`}>
                  <Wrapper
                    dr={`row`}
                    width={
                      width < 1100 ? (width < 800 ? `100%` : `50%`) : `auto`
                    }
                    ju={`flex-start`}
                    margin={
                      width < 1100
                        ? width < 800
                          ? `0 0 10px`
                          : `0`
                        : `0 50px 0 0`
                    }
                  >
                    <Wrapper
                      padding={`5px`}
                      width={`35px`}
                      margin={`0 10px 0 0`}
                    >
                      <Image
                        src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_clock.png`}
                        alt={`icon`}
                      />
                    </Wrapper>
                    <Text
                      fontSize={width < 1100 ? `14px` : `18px`}
                      fontWeight={`700`}
                    >
                      오후 7시
                    </Text>
                    <Wrapper
                      width={`1px`}
                      height={`13px`}
                      margin={`0 10px`}
                      bgColor={Theme.grey2_C}
                    ></Wrapper>
                    <Text
                      fontSize={width < 1100 ? `14px` : `18px`}
                      fontWeight={`700`}
                    >
                      화요일
                    </Text>
                  </Wrapper>
                  <Wrapper
                    dr={`row`}
                    width={
                      width < 1100 ? (width < 800 ? `100%` : `50%`) : `auto`
                    }
                    ju={`flex-start`}
                    margin={
                      width < 1100
                        ? width < 800
                          ? `0 0 10px`
                          : `0`
                        : `0 50px 0 0`
                    }
                  >
                    <Wrapper
                      padding={`5px`}
                      width={`35px`}
                      margin={`0 10px 0 0`}
                    >
                      <Image
                        src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_calender_b.png`}
                        alt={`icon`}
                      />
                    </Wrapper>
                    <Text fontSize={width < 1100 ? `14px` : `18px`}>
                      2022/01/01 ~ 2022/01/28
                    </Text>
                  </Wrapper>
                </Wrapper>

                <Wrapper width={width < 1100 ? `100%` : `auto`} dr={`row`}>
                  <Wrapper
                    dr={`row`}
                    width={
                      width < 1100 ? (width < 800 ? `100%` : `50%`) : `auto`
                    }
                    ju={`flex-start`}
                    margin={width < 800 ? `0 0 10px` : `0`}
                  >
                    <Wrapper
                      padding={`5px`}
                      width={`35px`}
                      margin={`0 10px 0 0`}
                    >
                      <Image
                        src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_name.png`}
                        alt={`icon`}
                      />
                    </Wrapper>
                    <Text fontSize={width < 1100 ? `14px` : `18px`}>
                      오민형
                    </Text>
                  </Wrapper>

                  {width > 1100 && <DashBorder margin={`0 50px`} />}

                  <Wrapper
                    dr={`row`}
                    width={
                      width < 1100 ? (width < 800 ? `100%` : `50%`) : `auto`
                    }
                    ju={`flex-start`}
                  >
                    <Text
                      fontSize={width < 1100 ? `14px` : `18px`}
                      fontWeight={`700`}
                    >
                      학비입금안내
                    </Text>
                    <Wrapper
                      width={`1px`}
                      height={`13px`}
                      margin={`0 10px`}
                      bgColor={Theme.grey2_C}
                    ></Wrapper>
                    <Text fontSize={width < 1100 ? `14px` : `18px`}>
                      Paypal 송금
                    </Text>
                  </Wrapper>
                </Wrapper>
              </Wrapper>
            </Wrapper>

            <Wrapper al={`flex-start`} margin={`0 0 60px`}>
              <Text
                fontSize={width < 800 ? `18px` : `22px`}
                fontWeight={`bold`}
                margin={`0 0 20px`}
              >
                혼자 한국어 공부하기
              </Text>

              <Wrapper dr={`row`} ju={`space-between`}>
                <Wrapper
                  width={width < 1100 ? `100%` : `calc(100% / 2 - 17px)`}
                  minHeight={`75px`}
                  bgColor={Theme.white_C}
                  shadow={`0px 5px 15px rgba(0, 0, 0, 0.05)`}
                  radius={`10px`}
                  margin={`0 0 30px`}
                  dr={`row`}
                  ju={`space-between`}
                  padding={width < 800 ? `15px` : `20px`}
                >
                  <Wrapper dr={`row`} ju={`flex-start`} width={`auto`}>
                    <Wrapper
                      width={`35px`}
                      padding={`5px`}
                      margin={`0 10px 0 0`}
                    >
                      <Image
                        src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_lecture.png`}
                        alt={`icon_lecture`}
                      />
                    </Wrapper>
                    <Text
                      fontsize={`16px`}
                      fontWeight={`700`}
                      margin={width < 800 ? `0` : `0 25px 0 0`}
                    >
                      컨텐츠명
                    </Text>
                  </Wrapper>
                  <Text fontsize={`16px`}>오민형 강사님</Text>

                  {width > 800 && <DashBorder margin={`0`} />}

                  <Wrapper dr={`row`} ju={`flex-start`} width={`auto`}>
                    <Wrapper
                      width={`35px`}
                      padding={`5px`}
                      margin={`0 10px 0 0`}
                    >
                      <Image
                        src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_download.png`}
                        alt={`icon_lecture`}
                      />
                    </Wrapper>
                    {width > 800 && (
                      <Text
                        fontsize={`16px`}
                        margin={width < 800 ? `0 15px 0 0` : `0 25px 0 0`}
                      >
                        파일 다운로드
                      </Text>
                    )}
                  </Wrapper>

                  {width > 800 && <DashBorder margin={`0`} />}

                  <Text fontsize={`16px`} fontWeight={`700`}>
                    학습하기
                  </Text>
                </Wrapper>
              </Wrapper>
            </Wrapper>
            <CustomPage />
            <Wrapper al={`flex-start`} margin={`130px 0 110px`}>
              <Text
                fontSize={width < 800 ? `18px` : `22px`}
                fontWeight={`bold`}
                margin={`0 0 20px`}
              >
                SNS
              </Text>

              <Wrapper
                minHeight={`75px`}
                bgColor={Theme.white_C}
                shadow={`0px 5px 15px rgba(0, 0, 0, 0.05)`}
                radius={`10px`}
                margin={`0 0 30px`}
                padding={width < 1100 ? `20px 10px` : `0 5px`}
                dr={`row`}
                ju={`space-between`}
              >
                <Wrapper
                  width={width < 1100 ? `100%` : `auto`}
                  margin={width < 1100 ? `0 0 10px` : `0`}
                  dr={`row`}
                  ju={`flex-start`}
                >
                  <Wrapper
                    width={width < 1280 ? `30px` : `40px`}
                    height={width < 1280 ? `30px` : `40px`}
                    padding={`5px`}
                    margin={width < 800 ? `0 10px 0 0` : `0 20px 0 0`}
                  >
                    <Image
                      src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_face-book.png`}
                      alt={`sns_icon`}
                    />
                  </Wrapper>

                  <Text fontSize={width < 1280 ? `16px` : `18px`}>
                    https://www.facebook.com/KtalkLive/
                  </Text>
                </Wrapper>

                <Wrapper
                  width={width < 1100 ? `100%` : `auto`}
                  margin={width < 1100 ? `0 0 10px` : `0`}
                  dr={`row`}
                  ju={`flex-start`}
                >
                  <Wrapper
                    width={width < 1280 ? `30px` : `40px`}
                    height={width < 1280 ? `30px` : `40px`}
                    padding={`5px`}
                    margin={width < 800 ? `0 10px 0 0` : `0 20px 0 0`}
                  >
                    <Image
                      src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_insta.png`}
                      alt={`sns_icon`}
                    />
                  </Wrapper>

                  <Text fontSize={width < 1280 ? `16px` : `18px`}>
                    https://www.instagram.com/ktalk_live/
                  </Text>
                </Wrapper>
                <Wrapper
                  width={width < 1100 ? `100%` : `auto`}
                  margin={width < 1100 ? `0 0 10px` : `0`}
                  dr={`row`}
                  ju={`flex-start`}
                >
                  <Wrapper
                    width={width < 1280 ? `30px` : `40px`}
                    height={width < 1280 ? `30px` : `40px`}
                    padding={`5px`}
                    margin={width < 800 ? `0 10px 0 0` : `0 20px 0 0`}
                  >
                    <Image
                      src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_youtube.png`}
                      alt={`sns_icon`}
                    />
                  </Wrapper>

                  <Text fontSize={width < 1280 ? `16px` : `18px`}>
                    https://www.youtube.com/ktalk_live/
                  </Text>
                </Wrapper>
              </Wrapper>
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

export default Index;
