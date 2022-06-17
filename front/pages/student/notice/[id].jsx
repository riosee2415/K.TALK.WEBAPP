import React, { useEffect, useCallback, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import Head from "next/head";
import { useRouter } from "next/router";
import axios from "axios";
import { END } from "redux-saga";
import wrapper from "../../../store/configureStore";
import { LOAD_MY_INFO_REQUEST } from "../../../reducers/user";
import {
  Button,
  Empty,
  Form,
  Input,
  message,
  Modal,
  Pagination,
  Select,
  Slider,
  Table,
} from "antd";
import styled from "styled-components";
import useWidth from "../../../hooks/useWidth";
import ClientLayout from "../../../components/ClientLayout";
import {
  CommonButton,
  CommonTitle,
  Image,
  RsWrapper,
  SpanText,
  Text,
  TextArea,
  TextInput,
  WholeWrapper,
  Wrapper,
} from "../../../components/commonComponents";
import Theme from "../../../components/Theme";

const CustomTableHoverWrapper = styled(Wrapper)`
  flex-direction: row;
  text-align: center;
  height: 80px;
  font-size: 16px;
  border-bottom: 1px solid ${Theme.grey_C};
  background-color: ${Theme.white_C};
  cursor: pointer;
  &:hover {
    background-color: ${Theme.lightGrey_C};
  }

  @media (max-width: 800px) {
    font-size: 14px;
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

const Notice = () => {
  ////// GLOBAL STATE //////

  const { seo_keywords, seo_desc, seo_ogImage, seo_title } = useSelector(
    (state) => state.seo
  );
  const { me } = useSelector((state) => state.user);

  ////// HOOKS //////
  const width = useWidth();

  const router = useRouter();

  const dispatch = useDispatch();

  ////// USEEFFECT //////

  ////// TOGGLE //////

  ////// HANDLER //////

  ////// DATAVIEW //////

  return (
    <>
      <Head>
        <title>
          {seo_title.length < 1 ? "K-talk Live" : seo_title[0].content}
        </title>

        <meta
          name="subject"
          content={seo_title.length < 1 ? "K-talk Live" : seo_title[0].content}
        />
        <meta
          name="title"
          content={seo_title.length < 1 ? "K-talk Live" : seo_title[0].content}
        />
        <meta name="keywords" content={seo_keywords} />
        <meta
          name="description"
          content={
            seo_desc.length < 1
              ? "REAL-TIME ONLINE KOREAN LESSONS"
              : seo_desc[0].content
          }
        />
        {/* <!-- OG tag  --> */}
        <meta
          property="og:title"
          content={seo_title.length < 1 ? "K-talk Live" : seo_title[0].content}
        />
        <meta
          property="og:site_name"
          content={seo_title.length < 1 ? "K-talk Live" : seo_title[0].content}
        />
        <meta
          property="og:description"
          content={
            seo_desc.length < 1
              ? "REAL-TIME ONLINE KOREAN LESSONS"
              : seo_desc[0].content
          }
        />
        <meta property="og:keywords" content={seo_keywords} />
        <meta
          property="og:image"
          content={seo_ogImage.length < 1 ? "" : seo_ogImage[0].content}
        />
      </Head>
      <ClientLayout>
        <WholeWrapper margin={width < 900 ? `52px 0 0` : `100px 0 0`}>
          {/* 상단배너 */}

          <Wrapper
            bgImg={`url("https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/student/subBanner.png")`}
            padding={width < 700 ? `30px 0` : `60px 0 140px 0`}
            color={Theme.white_C}
          >
            <RsWrapper dr={`row`} ju={width < 900 ? `center` : `flex-start`}>
              <Wrapper width={`auto`} dr={`row`} ju={`flex-start`}>
                <Image
                  width={width < 700 ? `65px` : `95px`}
                  height={width < 700 ? `65px` : `95px`}
                  border={
                    width < 900
                      ? `5px solid ${Theme.white_C}`
                      : `15px solid ${Theme.white_C}`
                  }
                  radius={`100px`}
                  src={
                    me && me.profileImage
                      ? me.profileImage
                      : "https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/img_default-profile.png"
                  }
                  alt="teacher_thumbnail"
                />
                <Text
                  fontSize={width < 700 ? `20px` : `28px`}
                  fontWeight={`bold`}
                  padding={`0 0 0 15px`}
                >
                  안녕하세요,&nbsp;
                  <SpanText color={Theme.subTheme9_C} wordBreak={`break-all`}>
                    {me && me.username}&nbsp;
                  </SpanText>
                  님!
                </Text>
              </Wrapper>
            </RsWrapper>
          </Wrapper>

          <RsWrapper>
            <Wrapper
              dr={width < 700 ? ` column` : `row`}
              ju={width < 700 ? `center` : `space-between`}
              al={`flex-start`}
              margin={`50px 0 20px 0`}
            >
              <CommonTitle>Class / Bulletin Board</CommonTitle>
            </Wrapper>

            <Wrapper
              dr={`row`}
              textAlign={`center`}
              padding={`20px 0`}
              bgColor={Theme.subTheme9_C}
              borderBottom={`1px solid ${Theme.grey_C}`}
            >
              <Text
                fontSize={width < 700 ? `14px` : `18px`}
                fontWeight={`Bold`}
                width={width < 800 ? `15%` : `10%`}
              >
                No
              </Text>
              <Text
                fontSize={width < 700 ? `14px` : `18px`}
                fontWeight={`Bold`}
                width={width < 800 ? `25%` : `10%`}
              >
                Date
              </Text>
              <Text
                fontSize={width < 700 ? `14px` : `18px`}
                fontWeight={`Bold`}
                width={width < 800 ? `45%` : `70%`}
              >
                Subject
              </Text>
              <Text
                fontSize={width < 700 ? `14px` : `18px`}
                fontWeight={`Bold`}
                width={width < 800 ? `15%` : `10%`}
              >
                Writer
              </Text>
            </Wrapper>

            <CustomTableHoverWrapper>
              <Wrapper width={width < 800 ? `15%` : `10%`}>1</Wrapper>
              <Wrapper width={width < 800 ? `25%` : `10%`}>2022-06-16</Wrapper>
              <Wrapper
                width={width < 800 ? `45%` : `70%`}
                al={`flex-start`}
                padding={`0 0 0 10px`}
              >
                hi
              </Wrapper>
              <Wrapper width={width < 800 ? `15%` : `10%`}>작성자</Wrapper>
            </CustomTableHoverWrapper>

            <Wrapper margin={`50px 0`}>
              <CustomPage
                size="small"
                current={1}
                total={1 * 10}
                //   onChange={(page) => noticeLectureChangePage(page)}
              />
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

    // 구현부 종료
    context.store.dispatch(END);
    console.log("🍀 SERVER SIDE PROPS END");
    await context.store.sagaTask.toPromise();
  }
);

export default Notice;
