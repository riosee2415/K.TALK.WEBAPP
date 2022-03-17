import React, { useEffect } from "react";
import ClientLayout from "../../components/ClientLayout";
import { useDispatch, useSelector } from "react-redux";
import wrapper from "../../store/configureStore";
import { END } from "redux-saga";
import useWidth from "../../hooks/useWidth";
import useInput from "../../hooks/useInput";
import Theme from "../../components/Theme";
import styled from "styled-components";
import axios from "axios";

import { LOAD_MY_INFO_REQUEST } from "../../reducers/user";
import { SEO_LIST_REQUEST } from "../../reducers/seo";
import {
  CalendarOutlined,
  CarryOutOutlined,
  FieldTimeOutlined,
  FolderFilled,
} from "@ant-design/icons";

import Head from "next/head";
import {
  RsWrapper,
  WholeWrapper,
  Wrapper,
  Image,
  Text,
  SpanText,
  CommonButton,
} from "../../components/commonComponents";
import { message, Pagination } from "antd";

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

const Button = styled.button`
  width: calc(100% / 5 - 30px);
  color: ${Theme.black_3C};
  font-size: 18px;
  margin: 0 30px 0 0;
  height: 70px;
  border: none;
  background-color: ${Theme.white_C};
  box-shadow: 0px 5px 15px rgb(0, 0, 0, 0.1);
  cursor: pointer;

  &:hover {
    transition: all 0.2s;
    border: 1px solid ${Theme.basicTheme_C};
    background-color: ${Theme.basicTheme_C};
    color: ${Theme.white_C};
  }

  @media (max-width: 700px) {
    font-size: 14px;
    width: calc(100% / 2 - 10px);
    margin: 10px 10px 0 0;
  }
`;

const CustomText = styled(Text)`
  font-size: 18px;
  font-weight: Bold;
  color: ${Theme.black_2C};

  &::after {
    content: "|";
    padding: 0 10px;
    color: ${Theme.grey_C};
  }

  @media (max-width: 700px) {
    font-size: 14px;
    &::after {
      content: "|";
      padding: 0 5px;
      color: ${Theme.grey_C};
    }
  }
`;

const CustomText2 = styled(Text)`
  font-size: 18px;
  font-weight: ${(props) => props.fontWeight || `Bold`};
  color: ${Theme.black_2C};
  margin: 0;

  &::after {
    content: "";
    margin: ${(props) => props.margin || `0 20px`};
    border-right: 1px dashed ${Theme.grey_C};
  }

  @media (max-width: 700px) {
    font-size: 14px;
    &::after {
      border-right: ${(props) => props.borderRightBool && `0px`};
      margin: ${(props) => props.margin || `0 5px`};
    }
  }
`;

const CustomText3 = styled(Text)`
  font-size: 18px;
  font-weight: Bold;

  &::before {
    content: "";
    margin: 0 20px 0 0;
    border-right: 1px dashed ${Theme.grey_C};
    color: ${Theme.grey_C};
  }

  @media (max-width: 700px) {
    font-size: 14px;
    &::before {
      margin: 0 10px;
    }
  }
`;

const Index = () => {
  ////// GLOBAL STATE //////
  const { seo_keywords, seo_desc, seo_ogImage, seo_title } = useSelector(
    (state) => state.seo
  );

  const { me } = useSelector((state) => state.seo);

  ////// HOOKS //////

  const width = useWidth();

  ////// REDUX //////
  ////// USEEFFECT //////

  useEffect(() => {
    if (!me) {
      message.error("로그인 후 이용해주세요.");
      // return router.push(`/`);
    }
  }, [me]);

  ////// TOGGLE //////
  ////// HANDLER //////
  ////// DATAVIEW //////

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
              dr={`row`}
              margin={width < 700 ? `30px 0` : `60px 0`}
              ju={`flex-start`}>
              <Wrapper width={`auto`} padding={`9px`} bgColor={Theme.white_C}>
                <Image
                  width={width < 700 ? `65px` : `75px`}
                  height={width < 700 ? `65px` : `75px`}
                  radius={`50%`}
                  src={`https://via.placeholder.com/75x75`}
                />
              </Wrapper>

              <Wrapper
                dr={`row`}
                width={`auto`}
                fontSize={width < 700 ? `20px` : `28px`}
                padding={`0 0 0 15px`}
                color={Theme.black_2C}>
                <Text fontWeight={`bold`}>안녕하세요,</Text>&nbsp;
                <Text color={Theme.basicTheme_C}>000</Text>&nbsp;
                <Text fontWeight={`bold`}>강사님!</Text>
              </Wrapper>
            </Wrapper>

            <Wrapper al={`flex-start`}>
              <Text
                color={Theme.black_2C}
                fontSize={width < 700 ? `18px` : `22px`}
                fontWeight={`Bold`}
                margin={`0 0 20px`}>
                공지사항
              </Text>

              <Wrapper shadow={`0px 5px 15px rgb(0,0,0,0.1)`} radius={`10px`}>
                <Wrapper dr={`row`} textAlign={`center`} padding={`20px 0`}>
                  <Text
                    fontSize={width < 700 ? `14px` : `18px`}
                    fontWeight={`Bold`}
                    width={`15%`}>
                    글 번호
                  </Text>
                  <Text
                    fontSize={width < 700 ? `14px` : `18px`}
                    fontWeight={`Bold`}
                    width={`45%`}>
                    제목
                  </Text>
                  <Text
                    fontSize={width < 700 ? `14px` : `18px`}
                    fontWeight={`Bold`}
                    width={`15%`}>
                    작성자
                  </Text>

                  <Text
                    fontSize={width < 700 ? `14px` : `18px`}
                    fontWeight={`Bold`}
                    width={`25%`}>
                    날짜
                  </Text>
                </Wrapper>

                <Wrapper
                  dr={`row`}
                  textAlign={`center`}
                  ju={`flex-start`}
                  padding={`25px 0 20px`}
                  cursor={`pointer`}
                  bgColor={Theme.lightGrey_C}
                  // bgColor={idx % 2 === 1 && Theme.lightGrey_C}
                >
                  <Text
                    fontSize={width < 700 ? `14px` : `16px`}
                    width={`15%`}
                    wordBreak={`break-word`}>
                    15
                  </Text>
                  <Text
                    fontSize={width < 700 ? `14px` : `16px`}
                    width={`45%`}
                    textAlign={`left`}>
                    안녕하세요. 강사 여러분께 공지사항 알립니다.
                  </Text>
                  <Text fontSize={width < 700 ? `14px` : `16px`} width={`15%`}>
                    케이톡 라이브
                  </Text>
                  <Text fontSize={width < 700 ? `14px` : `16px`} width={`25%`}>
                    2022/01/22
                  </Text>
                </Wrapper>
              </Wrapper>

              <Wrapper margin={`65px 0 85px`}>
                <CustomPage defaultCurrent={6} total={40}></CustomPage>
              </Wrapper>
            </Wrapper>

            <Wrapper al={`flex-start`}>
              <Text
                color={Theme.black_2C}
                fontSize={width < 700 ? `18px` : `22px`}
                fontWeight={`Bold`}
                margin={`0 0 20px`}>
                내 수업
              </Text>

              <Wrapper
                dr={`row`}
                ju={`flex-start`}
                shadow={`0px 5px 15px rgb(0,0,0,0.1)`}
                padding={width < 700 ? `15px 10px 10px` : `35px 30px`}
                radius={`10px`}>
                <Wrapper
                  dr={`row`}
                  width={width < 1400 ? `auto` : `38%`}
                  ju={`flex-start`}>
                  <Image
                    width={`22px`}
                    height={`22px`}
                    src="https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_clock.png"
                    alt="clock_icon"
                    margin={`0 5px 0 0`}
                  />

                  <CustomText>화요일</CustomText>
                  <CustomText2 color={Theme.black_2C}>7PM</CustomText2>

                  <CustomText>수요일</CustomText>
                  <CustomText2 color={Theme.black_2C}>9PM</CustomText2>

                  <CustomText>금요일</CustomText>
                  <CustomText2 color={Theme.black_2C} borderRightBool={true}>
                    9PM
                  </CustomText2>
                </Wrapper>

                <Wrapper
                  dr={`row`}
                  ju={`space-between`}
                  width={width < 1400 ? `100%` : `62%`}
                  margin={width < 700 ? `10px 0 0 0` : `0`}>
                  <Wrapper dr={`row`} width={`auto`}>
                    <Image
                      width={`22px`}
                      height={`22px`}
                      src="https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_calender_y.png"
                      alt="calender_icon"
                      margin={`0 5px 0 0`}
                    />
                    <CustomText2
                      color={Theme.black_2C}
                      fontWeight={`normal`}
                      width={width < 700 ? `auto` : `140px`}>
                      2022-01-28
                    </CustomText2>

                    <Image
                      width={`22px`}
                      height={`22px`}
                      src="https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_number.png"
                      alt="calender_icon"
                      margin={`0 5px 0 0`}
                    />
                    <Text
                      color={Theme.black_2C}
                      fontSize={width < 700 ? `12px` : `18px`}
                      width={width < 700 ? `auto` : `140px`}>
                      NO.12384
                    </Text>
                  </Wrapper>

                  <Wrapper width={`auto`}>
                    <CustomText3 color={Theme.black_2C} cursor={`pointer`}>
                      수업 일지 보러가기
                    </CustomText3>
                  </Wrapper>
                </Wrapper>
              </Wrapper>

              <Wrapper margin={`65px 0 0`}>
                <CustomPage defaultCurrent={6} total={40}></CustomPage>
              </Wrapper>
            </Wrapper>

            <Wrapper
              dr={`row`}
              margin={`100px 0`}
              ju={width < 700 ? `flex-start` : "center"}>
              <Button>교재 찾기</Button>
              <Button>교재 올리기</Button>
              <Button>복무 규정</Button>
              <Button>강사 계약서</Button>
              <Button>강의 산정료</Button>
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
