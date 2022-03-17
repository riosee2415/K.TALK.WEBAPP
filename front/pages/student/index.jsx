import React, { useEffect } from "react";
import { useSelector } from "react-redux";

import { END } from "redux-saga";
import axios from "axios";
import wrapper from "../../store/configureStore";
import { SEO_LIST_REQUEST } from "../../reducers/seo";
import { LOAD_MY_INFO_REQUEST } from "../../reducers/user";

import { useRouter } from "next/router";
import Head from "next/head";

import { Empty, Form, Input, message, Modal, Pagination, Slider } from "antd";
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

const CustomPage = styled(Pagination)`
  & .ant-pagination-next > button {
    border: none;
  }

  & .ant-pagination-prev > button {
    border: none;
  }

  & {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  & .ant-pagination-item,
  & .ant-pagination-next,
  & .ant-pagination-prev {
    border: none;
    width: 28px;
    height: 28px !important;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${Theme.white_C} !important;
    margin: 0 5px !important;
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

  @media (max-width: 800px) {
    width: 18px;
    height: 18px !important;
  }
`;

const CustomTableHoverWrapper = styled(Wrapper)`
  flex-direction: row;
  padding: 25px 0 20px;
  font-size: 16px;
  background-color: ${(props) =>
    props.bgColor ? Theme.lightGrey_C : Theme.white_C};
  cursor: pointer;
  &:hover {
    background-color: ${(props) =>
      props.bgColor ? Theme.white_C : Theme.lightGrey_C};
  }

  @media (max-width: 800px) {
    font-size: 14px;
  }
`;

const WordbreakText = styled(Text)`
  width: 100%;
  word-wrap: break-all;
`;

const CustomModal = styled(Modal)`
  & .ant-modal-header,
  & .ant-modal-content {
    border-radius: 5px;
  }
`;

const CustomForm = styled(Form)`
  width: 100%;

  & .ant-form-item {
    width: 100%;
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
      name: "강의명",
      teacher: "강사명",
      content: "한국어로 편지 쓰기",
      createdAt: "2022/01/03",
    },
    {
      id: 2,
      name: "강의명",
      teacher: "강사명",
      content: "한국어로 편지 쓰기",
      createdAt: "2022/01/03",
    },
    {
      id: 3,
      name: "강의명",
      teacher: "강사명",
      content: "한국어로 편지 쓰기",
      createdAt: "2022/01/03",
    },
    {
      id: 4,
      name: "강의명",
      teacher: "강사명",
      content: "한국어로 편지 쓰기",
      createdAt: "2022/01/03",
    },
    {
      id: 5,
      name: "강의명",
      teacher: "강사명",
      content: "한국어로 편지 쓰기",
      createdAt: "2022/01/03",
    },
  ];

  const noticeArr = [
    {
      id: 1,
      type: "공지사항",
      title: "안녕하세요. 강의 공지입니다.",
      author: "강사명",
      createdAt: "2022/01/22",
    },
    {
      id: 2,
      type: "공지사항",
      title: "안녕하세요. 강의 공지입니다.",
      author: "강사명",
      createdAt: "2022/01/22",
    },
    {
      id: 3,
      type: "공지사항",
      title: "안녕하세요. 강의 공지입니다.",
      author: "강사명",
      createdAt: "2022/01/22",
    },
    {
      id: 4,
      type: "공지사항",
      title: "안녕하세요. 강의 공지입니다.",
      author: "강사명",
      createdAt: "2022/01/22",
    },
    {
      id: 5,
      type: "공지사항",
      title: "안녕하세요. 강의 공지입니다.",
      author: "강사명",
      createdAt: "2022/01/22",
    },
  ];

  const preparationArr = [
    {
      id: 1,
      title: "자료명",
      createdAt: "2022/01/22",
    },
    {
      id: 2,
      title: "자료명",
      createdAt: "2022/01/22",
    },
    {
      id: 3,
      title: "자료명",
      createdAt: "2022/01/22",
    },
    {
      id: 4,
      title: "자료명",
      createdAt: "2022/01/22",
    },
    {
      id: 5,
      title: "자료명",
      createdAt: "2022/01/22",
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
    // {
    //   name: "금요일",
    //   time: "7PM",
    // },
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
              margin={width < 700 ? `30px 0` : `60px 0`}
              dr={`row`}
              ju={`flex-start`}
            >
              <Wrapper width={`auto`} padding={`9px`} bgColor={Theme.white_C}>
                <Image
                  width={width < 700 ? `65px` : `75px`}
                  height={width < 700 ? `65px` : `75px`}
                  radius={`100px`}
                  src="https://t1.daumcdn.net/thumb/R720x0.fjpg/?fname=http://t1.daumcdn.net/brunch/service/user/1UzB/image/paEOLJhjPWh-CW7c2KoUJ-tKWs4.jpg"
                  alt="student_thumbnail"
                />
              </Wrapper>
              <Text
                fontSize={width < 700 ? `20px` : `28px`}
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
                내 시간표
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
                width={width < 1280 ? (width < 800 ? `100%` : `40%`) : `25%`}
                dr={`row`}
                ju={`flex-start`}
                margin={width < 800 && `5px 0`}
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
                  <SpanText
                    fontWeight={`bold`}
                    color={Theme.red_C}
                    margin={`0 0 0 15px`}
                  >
                    D-5
                  </SpanText>
                </Text>
              </Wrapper>
              <Wrapper
                width={width < 1280 ? `100%` : `38%`}
                dr={`row`}
                ju={`flex-start`}
                al={`flex-start`}
              >
                <Wrapper
                  width={`25%`}
                  dr={`row`}
                  ju={`flex-start`}
                  margin={`0 20px 0 0`}
                >
                  <Image
                    margin={`0 10px 0 0`}
                    width={`22px`}
                    height={`22px`}
                    src="https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_name.png"
                    alt="clender_icon"
                  />
                  <Text fontSize={width < 700 ? `14px` : `18px`}>강사명</Text>
                </Wrapper>

                <Wrapper
                  width={`calc(75% - 20px)`}
                  al={`flex-start`}
                  fontSize={width < 700 ? `12px` : `16px`}
                >
                  <Text color={Theme.grey2_C}>
                    <SpanText
                      fontWeight={`bold`}
                      margin={`0 16px 0 0`}
                      color={Theme.black_C}
                    >
                      ZOOM ID
                    </SpanText>
                    4leafsoftware@gmail.com
                  </Text>
                  <Text color={Theme.grey2_C}>
                    <SpanText
                      fontWeight={`bold`}
                      margin={`0 14px 0 0`}
                      color={Theme.black_C}
                    >
                      Password
                    </SpanText>
                    12345687
                  </Text>
                </Wrapper>
              </Wrapper>
            </Wrapper>

            <Wrapper al={`flex-start`} margin={`0 0 20px`}>
              <Text
                fontSize={width < 800 ? `18px` : `22px`}
                fontWeight={`bold`}
              >
                내 강의정보
              </Text>
            </Wrapper>

            <Wrapper
              dr={`row`}
              padding={width < 800 ? `10px` : `30px`}
              bgColor={Theme.white_C}
              radius={`10px`}
              ju={`space-between`}
              shadow={`0px 5px 15px rgba(0, 0, 0, 0.16)`}
              margin={`0 0 86px`}
              al={width < 1100 && `flex-start`}
            >
              <Wrapper
                width={width < 800 ? `calc(100%)` : `calc(100%)`}
                position={`relative`}
              >
                <Wrapper dr={`row`}>
                  <Wrapper width={width < 1100 ? `100%` : `calc(70% - 1px)`}>
                    <Wrapper
                      width={`100%`}
                      dr={`row`}
                      al={width < 800 && `flex-start`}
                    >
                      <Image
                        position={`absolute`}
                        top={`0`}
                        left={`0`}
                        width={width < 800 ? `80px` : `184px`}
                        height={width < 800 ? `80px` : `190px`}
                        radius={`5px`}
                        src="https://t1.daumcdn.net/thumb/R720x0.fjpg/?fname=http://t1.daumcdn.net/brunch/service/user/1UzB/image/paEOLJhjPWh-CW7c2KoUJ-tKWs4.jpg"
                        alt="student_thumbnail"
                      />
                      <Wrapper
                        margin={width < 800 ? `0 0 0 100px` : `0 0 0 204px`}
                      >
                        <Wrapper dr={`row`} ju={`flex-start`}>
                          <Text
                            margin={`0 10px 0 0`}
                            fontSize={width < 800 ? `16px` : `18px`}
                            fontWeight={`bold`}
                          >
                            강의명
                          </Text>
                          <Text>한국어 초급/중급반</Text>
                        </Wrapper>
                        <Wrapper
                          dr={`row`}
                          ju={`flex-start`}
                          color={Theme.grey2_C}
                          fontSize={width < 800 ? `12px` : `16px`}
                        >
                          <Text lineHeight={`1.19`}>강사 이름</Text>
                          <Text
                            lineHeight={`1.19`}
                            margin={width < 800 ? `5px` : `0 10px`}
                          >
                            |
                          </Text>
                          <Text lineHeight={`1.19`}>강의 수 : 5/30</Text>
                          <Text
                            lineHeight={`1.19`}
                            margin={width < 800 ? `5px` : `0 10px`}
                          >
                            |
                          </Text>
                          <Text lineHeight={`1.19`}>등록상황 : 수료중</Text>
                        </Wrapper>
                      </Wrapper>
                      <Wrapper
                        margin={width < 800 ? `40px 0 0` : `35px 0 0  204px`}
                      >
                        <Wrapper dr={`row`} ju={`flex-start`}>
                          <Text width={width < 800 ? `100%` : `15%`}>
                            <SpanText color={Theme.subTheme2_C}>●</SpanText>
                            &nbsp; 출석 상황
                          </Text>
                          <Wrapper width={width < 800 ? `80%` : `75%`}>
                            <CustomSlide
                              defaultValue={100}
                              disabled={true}
                              draggableTrack={true}
                              bgColor={Theme.subTheme2_C}
                            />
                          </Wrapper>
                          <Text
                            width={`10%`}
                            color={Theme.grey2_C}
                            padding={`0 0 0 10px`}
                          >
                            (100%)
                          </Text>
                        </Wrapper>
                        <Wrapper dr={`row`} ju={`flex-start`} margin={`10px 0`}>
                          <Text width={width < 800 ? `100%` : `15%`}>
                            <SpanText color={Theme.basicTheme_C}>●</SpanText>
                            &nbsp; 수업 진도
                          </Text>
                          <Wrapper width={width < 800 ? `80%` : `75%`}>
                            <CustomSlide
                              defaultValue={55}
                              disabled={true}
                              draggableTrack={true}
                              bgColor={Theme.basicTheme_C}
                            />
                          </Wrapper>
                          <Text
                            width={`10%`}
                            color={Theme.grey2_C}
                            padding={`0 0 0 10px`}
                          >
                            (55%)
                          </Text>
                        </Wrapper>
                        <Wrapper dr={`row`} ju={`flex-start`}>
                          <Text width={width < 800 ? `100%` : `15%`}>
                            <SpanText color={Theme.subTheme6_C}>●</SpanText>
                            &nbsp; 성취도
                          </Text>
                          <Wrapper width={width < 800 ? `80%` : `75%`}>
                            <CustomSlide
                              defaultValue={100}
                              disabled={true}
                              draggableTrack={true}
                              bgColor={Theme.subTheme6_C}
                            />
                          </Wrapper>
                          <Text
                            width={`10%`}
                            color={Theme.grey2_C}
                            padding={`0 0 0 10px`}
                          >
                            (100%)
                          </Text>
                        </Wrapper>
                      </Wrapper>
                    </Wrapper>
                  </Wrapper>

                  <Wrapper
                    display={width < 1100 && `none`}
                    width={`1px`}
                    height={`190px`}
                    margin={`0 40px`}
                    borderRight={
                      width < 1100 ? `0` : `1px dashed ${Theme.grey_C}`
                    }
                  />
                  <Wrapper
                    width={width < 1100 ? `100%` : `calc(30% - 80px)`}
                    margin={
                      width < 1100 && width < 800 ? `10px 0 0` : `20px 0 0`
                    }
                  >
                    <Wrapper
                      borderBottom={`1px dashed ${Theme.grey_C}`}
                      al={`flex-start`}
                      ju={`flex-start`}
                    >
                      <Text
                        padding={width < 800 ? `8px 0` : `16px 0`}
                        color={Theme.basicTheme_C}
                      >
                        ZOOM 이동
                      </Text>
                    </Wrapper>
                    <Wrapper
                      borderBottom={`1px dashed ${Theme.grey_C}`}
                      dr={`row`}
                      al={`flex-start`}
                      ju={`flex-start`}
                      padding={width < 800 ? `8px 0` : `16px 0`}
                    >
                      <Text>수료증 신청</Text>
                      <Text> | </Text>
                      <Text>강의수 늘리기 요청</Text>
                    </Wrapper>
                    <Wrapper
                      borderBottom={`1px dashed ${Theme.grey_C}`}
                      al={`flex-start`}
                      ju={`flex-start`}
                      dr={`row`}
                      padding={width < 800 ? `8px 0` : `16px 0`}
                    >
                      <Text>결석 예고</Text>
                      <Text> | </Text>
                      <Text>반이동 요청</Text>
                      <Text> | </Text>
                      <Text>줌 상담신청</Text>
                    </Wrapper>
                  </Wrapper>
                </Wrapper>
              </Wrapper>
              {/** */}
            </Wrapper>
            <Wrapper al={`flex-start`} margin={`0 0 20px`}>
              <Text
                fontSize={width < 800 ? `18px` : `22px`}
                fontWeight={`bold`}
              >
                숙제보기 / 제출하기
              </Text>
            </Wrapper>

            <Wrapper margin={`0 0 60px`}>
              {testArr &&
                (testArr.length === 0 ? (
                  <Wrapper>
                    <Empty description="숙제가 없습니다." />
                  </Wrapper>
                ) : (
                  testArr.map((data) => {
                    return (
                      <Wrapper
                        key={data.id}
                        dr={`row`}
                        shadow={`0px 5px 15px rgba(0, 0, 0, 0.16)`}
                        radius={`10px`}
                        padding={`20px`}
                        margin={`0 0 10px`}
                      >
                        <Wrapper
                          width={width < 900 ? `100%` : `55%`}
                          margin={width < 900 && `0 0 10px`}
                          dr={`row`}
                          ju={`flex-start`}
                        >
                          <Wrapper dr={`row`} width={`25%`} ju={`flex-start`}>
                            <Image
                              width={`22px`}
                              margin={width < 900 ? `0 5px 0 0` : `0 16px 0 0`}
                              src="https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_lecture.png"
                              alt="lecture_icon"
                            />
                            <Text fontWeight={`bold`}>{data.name}</Text>
                          </Wrapper>

                          <Wrapper
                            dr={`row`}
                            width={width < 900 ? `30%` : `25%`}
                            ju={`flex-start`}
                          >
                            <Text fontSize={`14px`}>{data.teacher}강사님</Text>
                          </Wrapper>

                          <Wrapper
                            dr={`row`}
                            width={width < 900 ? `45%` : `50%`}
                            ju={`flex-start`}
                          >
                            <Text fontSize={`14px`}>{data.content}</Text>
                          </Wrapper>
                        </Wrapper>
                        <Wrapper
                          width={width < 900 ? `100%` : `45%`}
                          dr={`row`}
                          ju={`flex-start`}
                        >
                          <Wrapper
                            dr={`row`}
                            width={width < 900 ? `10%` : `35%`}
                            ju={`flex-start`}
                          >
                            <Image
                              width={`22px`}
                              margin={width < 900 ? `0 5px 0 0` : `0 16px 0 0`}
                              src="https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_download.png"
                              alt="lecture_icon"
                            />
                            {width > 900 && <Text>파일다운로드</Text>}
                          </Wrapper>

                          <Wrapper
                            dr={`row`}
                            width={
                              width < 1100 ? `40%` : width < 900 ? `62%` : `35%`
                            }
                            ju={`flex-start`}
                          >
                            <Image
                              width={`22px`}
                              margin={width < 700 ? `0 5px 0 0` : `0 16px 0 0`}
                              src="https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_calender_b.png"
                              alt="lecture_icon"
                            />
                            <Text>{data.createdAt}까지</Text>
                          </Wrapper>

                          <Wrapper
                            dr={`row`}
                            width={
                              width < 1100 ? `25%` : width < 900 ? `28%` : `30%`
                            }
                            cursor={`pointer`}
                          >
                            <Text fontWeight={`bold`}>제출하기</Text>
                          </Wrapper>
                        </Wrapper>
                      </Wrapper>
                    );
                  })
                ))}
            </Wrapper>
            <CustomPage size="small" />

            <Wrapper al={`flex-start`} margin={`86px 0 20px`}>
              <Text
                fontSize={width < 800 ? `18px` : `22px`}
                fontWeight={`bold`}
              >
                공지사항 / 내게 온 쪽지
              </Text>
            </Wrapper>

            <Wrapper radius={`10px`} shadow={`0px 2px 4px rgba(0, 0, 0, 0.16)`}>
              <Wrapper
                dr={`row`}
                fontWeight={`bold`}
                padding={`20px 0`}
                fontSize={width < 800 ? `14px` : `18px`}
              >
                <Wrapper width={width < 800 ? `15%` : `10%`}>구분</Wrapper>
                <Wrapper width={width < 800 ? `45%` : `70%`}>제목</Wrapper>
                <Wrapper width={width < 800 ? `15%` : `10%`}>작성자</Wrapper>
                <Wrapper width={width < 800 ? `25%` : `10%`}>날짜</Wrapper>
              </Wrapper>
              {noticeArr &&
                (noticeArr.length === 0 ? (
                  <Wrapper>
                    <Empty description="공지사항이 없습니다." />
                  </Wrapper>
                ) : (
                  noticeArr.map((data, idx) => {
                    return (
                      <CustomTableHoverWrapper
                        key={data.id}
                        bgColor={idx % 2 === 0}
                      >
                        <Wrapper width={width < 800 ? `15%` : `10%`}>
                          {data.type}
                        </Wrapper>
                        <Wrapper
                          width={width < 800 ? `45%` : `70%`}
                          al={`flex-start`}
                          padding={`0 0 0 10px`}
                        >
                          {data.title}
                        </Wrapper>
                        <Wrapper width={width < 800 ? `15%` : `10%`}>
                          {data.author}
                        </Wrapper>
                        <Wrapper width={width < 800 ? `25%` : `10%`}>
                          {data.createdAt}
                        </Wrapper>
                      </CustomTableHoverWrapper>
                    );
                  })
                ))}
            </Wrapper>
            <Wrapper al={`flex-end`} margin={`20px 0 40px`}>
              <CommonButton radius={`5px`}>쪽지 보내기</CommonButton>
            </Wrapper>
            <CustomPage size="small" />

            <Wrapper al={`flex-start`} margin={`86px 0 20px`}>
              <Text
                fontSize={width < 800 ? `18px` : `22px`}
                fontWeight={`bold`}
              >
                자습하기
              </Text>
            </Wrapper>

            <Wrapper radius={`10px`} shadow={`0px 2px 4px rgba(0, 0, 0, 0.16)`}>
              <Wrapper
                dr={`row`}
                fontWeight={`bold`}
                padding={`20px 0`}
                fontSize={width < 800 ? `14px` : `18px`}
              >
                <Wrapper width={width < 800 ? `15%` : `10%`}>번호</Wrapper>
                <Wrapper width={width < 800 ? `45%` : `70%`}>자료명</Wrapper>
                <Wrapper width={width < 800 ? `15%` : `10%`}>자료</Wrapper>
                <Wrapper width={width < 800 ? `25%` : `10%`}>날짜</Wrapper>
              </Wrapper>
              {preparationArr &&
                (preparationArr.length === 0 ? (
                  <Wrapper>
                    <Empty description="공지사항이 없습니다." />
                  </Wrapper>
                ) : (
                  preparationArr.map((data, idx) => {
                    return (
                      <CustomTableHoverWrapper
                        key={data.id}
                        bgColor={idx % 2 === 0}
                      >
                        <Wrapper width={width < 800 ? `15%` : `10%`}>
                          {data.id}
                        </Wrapper>
                        <Wrapper
                          width={width < 800 ? `45%` : `70%`}
                          al={`flex-start`}
                          padding={`0 0 0 10px`}
                        >
                          {data.title}
                        </Wrapper>
                        <Wrapper width={width < 800 ? `15%` : `10%`}>
                          {width < 800 ? (
                            <Image
                              width={`22px`}
                              margin={width < 700 ? `0 5px 0 0` : `0 16px 0 0`}
                              src="https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_download.png"
                              alt="lecture_icon"
                            />
                          ) : (
                            "자료 다운로드"
                          )}
                        </Wrapper>
                        <Wrapper width={width < 800 ? `25%` : `10%`}>
                          {data.createdAt}
                        </Wrapper>
                      </CustomTableHoverWrapper>
                    );
                  })
                ))}
            </Wrapper>
            <Wrapper al={`flex-end`} margin={`20px 0 40px`}>
              <CommonButton radius={`5px`}>쪽지 보내기</CommonButton>
            </Wrapper>
            <Wrapper margin={`0 0 110px`}>
              <CustomPage size="small" />
            </Wrapper>
          </RsWrapper>

          <CustomModal
            visible={false}
            width={`1350px`}
            title="공지사항"
            footer={null}
            closable={false}
          >
            <Wrapper dr={`row`} ju={`flex-start`} margin={`0 0 35px`}>
              <Text margin={`0 54px 0 0`}>작성자 ooo</Text>
              <Text>날짜 2022/01/22</Text>
            </Wrapper>

            <Text fontSize={`18px`} fontWeight={`bold`}>
              제목
            </Text>
            <Wrapper padding={`10px`}>
              <WordbreakText>오늘 공지사항입니다.</WordbreakText>
            </Wrapper>

            <Text fontSize={`18px`} fontWeight={`bold`}>
              내용
            </Text>
            <Wrapper padding={`10px`}>
              <WordbreakText>오늘 공지사항입니다.</WordbreakText>
            </Wrapper>

            <Wrapper>
              <CommonButton
                kindOf={`grey`}
                color={Theme.darkGrey_C}
                radius={`5px`}
              >
                돌아가기
              </CommonButton>
            </Wrapper>
          </CustomModal>

          <CustomModal
            visible={false}
            width={`1350px`}
            title="쪽지"
            footer={null}
            closable={false}
          >
            <Wrapper dr={`row`} ju={`flex-start`} margin={`0 0 35px`}>
              <Text margin={`0 54px 0 0`}>보낸사람 ooo</Text>
              <Text>날짜 2022/01/22</Text>
            </Wrapper>

            <Text fontSize={`18px`} fontWeight={`bold`}>
              제목
            </Text>
            <Wrapper padding={`10px`}>
              <WordbreakText>안녕하세요.</WordbreakText>
            </Wrapper>

            <Text fontSize={`18px`} fontWeight={`bold`}>
              내용
            </Text>
            <Wrapper padding={`10px`}>
              <WordbreakText>안녕하세요.</WordbreakText>
            </Wrapper>

            <Wrapper dr={`row`}>
              <CommonButton
                margin={`0 5px 0 0`}
                kindOf={`grey`}
                color={Theme.darkGrey_C}
                radius={`5px`}
              >
                돌아가기
              </CommonButton>
              <CommonButton margin={`0 0 0 5px`} radius={`5px`}>
                답변하기
              </CommonButton>
            </Wrapper>
          </CustomModal>

          <CustomModal
            visible={false}
            width={`1350px`}
            title="쪽지 보내기"
            footer={null}
            closable={false}
          >
            <CustomForm>
              <Text fontSize={`18px`} fontWeight={`bold`}>
                받는 사람
              </Text>
              <Form.Item>
                <Input />
              </Form.Item>
              <Text fontSize={`18px`} fontWeight={`bold`}>
                제목
              </Text>
              <Form.Item>
                <Input />
              </Form.Item>
              <Text fontSize={`18px`} fontWeight={`bold`}>
                내용
              </Text>
              <Form.Item>
                <Input.TextArea style={{ height: `360px` }} />
              </Form.Item>
              <Wrapper dr={`row`}>
                <CommonButton
                  margin={`0 5px 0 0`}
                  kindOf={`grey`}
                  color={Theme.darkGrey_C}
                  radius={`5px`}
                >
                  돌아가기
                </CommonButton>
                <CommonButton
                  margin={`0 0 0 5px`}
                  radius={`5px`}
                  htmlType="submit"
                >
                  답변하기
                </CommonButton>
              </Wrapper>
            </CustomForm>
          </CustomModal>
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
