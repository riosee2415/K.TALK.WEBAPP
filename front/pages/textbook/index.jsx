import React, { useEffect, useState } from "react";
import ClientLayout from "../../components/ClientLayout";
import { useDispatch, useSelector } from "react-redux";

import wrapper from "../../store/configureStore";
import { END } from "redux-saga";
import useWidth from "../../hooks/useWidth";
import Theme from "../../components/Theme";
import styled from "styled-components";
import axios from "axios";

import { LOAD_MY_INFO_REQUEST } from "../../reducers/user";
import { SEO_LIST_REQUEST } from "../../reducers/seo";

import Head from "next/head";
import {
  RsWrapper,
  WholeWrapper,
  Wrapper,
  Text,
  CommonButton,
  TextInput,
  Image,
  ProductWrapper,
} from "../../components/commonComponents";
import { CloseOutlined, SearchOutlined } from "@ant-design/icons";
import {
  BOOK_FOLDER_LIST_REQUEST,
  BOOK_LIST_REQUEST,
} from "../../reducers/book";
import { Empty } from "antd";

const TabWrapper = styled(Wrapper)`
  width: calc(100% / 5 - 13px);
  margin: 0 13px 10px 0;
  height: 50px;
  border: 1px solid ${Theme.grey_C};
  border-radius: 10px;
  flex-direction: row;
  justify-content: flex-start;
  padding: 0 5px;
  &:hover {
    border: 1px solid ${Theme.basicTheme_C};
  }
  &.current {
    border: 1px solid ${Theme.basicTheme_C};
  }
  @media (max-width: 700px) {
    width: 110px;
  }
`;
const CusotmInput = styled(TextInput)`
  border: none;
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.16);

  padding: 0 0 0 55px;
  border-radius: 25px;
  width: 100%;
  height: 50px;
  background-color: ${Theme.lightGrey_C};

  &::placeholder {
    color: ${Theme.grey2_C};
  }

  &:focus {
    border: 1px solid ${Theme.basicTheme_C};
  }
`;

const ProductMenu = styled(Wrapper)`
  bottom: -80px;
  transition: 0.5s;

  @media (max-width: 1100px) {
    bottom: 0;
    width: 100%;
    height: 100%;
    border-radius: 0;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  }

  & .menu {
    transition: 0.5s;
    &:hover {
      background-color: ${Theme.lightGrey_C};
    }
  }
`;

const Index = () => {
  ////// GLOBAL STATE //////
  const { seo_keywords, seo_desc, seo_ogImage, seo_title } = useSelector(
    (state) => state.seo
  );

  ////// HOOKS //////

  const width = useWidth();
  const [currentTab, setCurrentTab] = useState(0);
  const [currentMenu, setCurrentMenu] = useState(null);
  ////// REDUX //////
  const dispatch = useDispatch();
  const { bookFolderList, bookList } = useSelector((state) => state.book);
  ////// USEEFFECT //////

  useEffect(() => {
    dispatch({
      type: BOOK_FOLDER_LIST_REQUEST,
    });
  }, []);

  useEffect(() => {
    dispatch({
      type: BOOK_LIST_REQUEST,
    });
  }, []);
  ////// TOGGLE //////
  ////// HANDLER //////
  ////// DATAVIEW //////

  const testData = [
    { id: "1", imagePath: "https://via.placeholder.com/203x258" },
    { id: "2", imagePath: "https://via.placeholder.com/203x258" },
    { id: "3", imagePath: "https://via.placeholder.com/203x258" },
    { id: "4", imagePath: "https://via.placeholder.com/203x258" },
    { id: "5", imagePath: "https://via.placeholder.com/203x258" },
    { id: "6", imagePath: "https://via.placeholder.com/203x258" },
    { id: "7", imagePath: "https://via.placeholder.com/203x258" },
  ];

  return (
    <>
      <Head>
        <title>
          {seo_title.length < 1 ? "K-Talk Live" : seo_title[0].content}
        </title>

        <meta
          name="subject"
          content={seo_title.length < 1 ? "K-Talk Live" : seo_title[0].content}
        />
        <meta
          name="title"
          content={seo_title.length < 1 ? "K-Talk Live" : seo_title[0].content}
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
          content={seo_title.length < 1 ? "K-Talk Live" : seo_title[0].content}
        />
        <meta
          property="og:site_name"
          content={seo_title.length < 1 ? "K-Talk Live" : seo_title[0].content}
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
        <WholeWrapper margin={`100px 0 0`}>
          <RsWrapper>
            <Wrapper al={`flex-start`} margin={`70px 0 30px`}>
              <Text
                color={Theme.black_2C}
                fontSize={width < 800 ? `18px` : `22px`}
                fontWeight={`Bold`}
              >
                교재 목록
              </Text>
            </Wrapper>

            <Wrapper dr={`row`} ju={`space-between`} margin={`0 0 40px`}>
              <Wrapper
                position={`relative`}
                width={width < 800 ? `calc(100% - 100px - 20px)` : `500px`}
              >
                <SearchOutlined
                  style={{
                    color: Theme.grey2_C,
                    fontSize: `20px`,
                    position: "absolute",
                    left: `15px`,
                  }}
                />
                <CusotmInput placeholder="학생명으로 검색" />
              </Wrapper>

              <CommonButton
                kindOf={`white2`}
                width={width < 800 ? `100px` : `160px`}
                height={`50px`}
                shadow={`0 2px 10px rgba(0,0,0,0.16)`}
              >
                자료 올리기
              </CommonButton>
            </Wrapper>
            <Wrapper dr={`row`} ju={`flex-start`} margin={`0 0 20px 0`}>
              {bookFolderList &&
                bookFolderList.map((data) => {
                  return (
                    <TabWrapper
                      onClick={() => setCurrentTab(data.id)}
                      className={currentTab === data.id && `current`}
                    >
                      <Wrapper
                        width={`17px`}
                        margin={width < 800 ? `0 5px 0 0` : `0 20px 0 0`}
                      >
                        <Image
                          src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_folder.png`}
                          // alt={`file_icon`}
                        />
                      </Wrapper>
                      <Text
                        maxWidth={
                          width < 800
                            ? `calc(100% - 17px - 5px)`
                            : `calc(100% - 17px - 20px)`
                        }
                        fontSize={width < 800 ? `10px` : `16px`}
                      >
                        {data.value}
                      </Text>
                    </TabWrapper>
                  );
                })}
            </Wrapper>

            <Wrapper
              dr={`row`}
              al={`flex-start`}
              ju={`flex-start`}
              minHeight={`680px`}
            >
              {bookList && bookList.length === 0 ? (
                <Wrapper>
                  <Empty description={`조회된 데이터가 없습니다.`} />
                </Wrapper>
              ) : (
                bookList &&
                bookList.map((data, idx) => {
                  return (
                    <ProductWrapper>
                      <ProductMenu
                        display={currentMenu === data.id ? `flex` : `none`}
                        width={`280px`}
                        bgColor={Theme.white_C}
                        position={`absolute`}
                        zIndex={`999`}
                        ju={`flex-start`}
                        radius={`10px`}
                        shadow={`0 5px 15px rgba(0,0,0,0.16)`}
                        right={
                          width < 1280
                            ? width < 1100
                              ? `0`
                              : (idx + 1) % 4 === 0
                              ? ``
                              : `-100px`
                            : (idx + 1) % 6 === 0
                            ? ``
                            : `-100px`
                        }
                        left={
                          width < 1280
                            ? width < 1100
                              ? `0`
                              : (idx + 1) % 4 === 0
                              ? `-100px`
                              : ``
                            : (idx + 1) % 6 === 0
                            ? `-100px`
                            : ``
                        }
                      >
                        <Wrapper
                          height={`20px`}
                          al={`flex-end`}
                          padding={`20px 20px 0 0`}
                          margin={`0 0 10px`}
                        >
                          <CloseOutlined
                            onClick={() => {
                              setCurrentMenu(null);
                            }}
                          />
                        </Wrapper>

                        <Wrapper
                          className={`menu`}
                          color={Theme.grey2_C}
                          fontSize={`16px`}
                          dr={`row`}
                          ju={`flex-start`}
                          height={`40px`}
                          padding={width < 1100 ? `0 0 0 10px` : `0 0 0 30px`}
                        >
                          <Wrapper width={`22px`} margin={`0 20px 0 0`}>
                            <Image
                              src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_change.png`}
                              alt={`menu_icon`}
                            />
                          </Wrapper>
                          <Text>이름 바꾸기</Text>
                        </Wrapper>
                        <Wrapper
                          className={`menu`}
                          color={Theme.grey2_C}
                          fontSize={`16px`}
                          dr={`row`}
                          ju={`flex-start`}
                          height={`40px`}
                          padding={width < 1100 ? `0 0 0 10px` : `0 0 0 30px`}
                        >
                          <Wrapper width={`22px`} margin={`0 20px 0 0`}>
                            <Image
                              src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_move.png`}
                              alt={`menu_icon`}
                            />
                          </Wrapper>
                          <Text>이동</Text>
                        </Wrapper>
                        <Wrapper
                          className={`menu`}
                          color={Theme.grey2_C}
                          fontSize={`16px`}
                          dr={`row`}
                          ju={`flex-start`}
                          height={`40px`}
                          padding={width < 1100 ? `0 0 0 10px` : `0 0 0 30px`}
                        >
                          <Wrapper width={`22px`} margin={`0 20px 0 0`}>
                            <Image
                              src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_download_gray.png`}
                              alt={`menu_icon`}
                            />
                          </Wrapper>
                          <Text>다운로드</Text>
                        </Wrapper>
                        <Wrapper
                          className={`menu`}
                          color={Theme.grey2_C}
                          fontSize={`16px`}
                          dr={`row`}
                          ju={`flex-start`}
                          height={`40px`}
                          padding={width < 1100 ? `0 0 0 10px` : `0 0 0 30px`}
                          margin={`0 0 20px 0`}
                        >
                          <Wrapper width={`22px`} margin={`0 20px 0 0`}>
                            <Image
                              src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_delet.png`}
                              alt={`menu_icon`}
                            />
                          </Wrapper>
                          <Text>삭제</Text>
                        </Wrapper>
                      </ProductMenu>

                      <Wrapper onClick={() => setCurrentMenu(data.id)}>
                        <Image src={data.imagePath} />
                      </Wrapper>
                    </ProductWrapper>
                  );
                })
              )}
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
