import React, { useEffect, useState } from "react";
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

import { SearchOutlined } from "@ant-design/icons";

const TabWrapper = styled(Wrapper)`
  width: calc(100% / 5 - 11px);
  height: 50px;
  border: 1px solid ${Theme.grey_C};
  border-radius: 10px;
  flex-direction: row;
  padding: 0 5px;
  &:hover {
    border: 1px solid ${Theme.basicTheme_C};
  }
  &.current {
    border: 1px solid ${Theme.basicTheme_C};
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
  ////// REDUX //////
  ////// USEEFFECT //////
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
        <WholeWrapper margin={`100px 0 0`}>
          <RsWrapper>
            <Wrapper al={`flex-start`} margin={`70px 0 30px`}>
              <Text
                color={Theme.black_2C}
                fontSize={width < 700 ? `18px` : `22px`}
                fontWeight={`Bold`}
              >
                교재 목록
              </Text>
            </Wrapper>

            <Wrapper dr={`row`} ju={`space-between`} margin={`0 0 40px`}>
              <TextInput
                placeholder="학생명으로 검색"
                prefix={<SearchOutlined />}
                radius={`25px`}
                width={`500px`}
                height={`50px`}
                bgColor={Theme.lightGrey_C}
              />

              <CommonButton
                kindOf={`white2`}
                width={`160px`}
                height={`50px`}
                shadow={`0 2px 10px rgba(0,0,0,0.05)`}
              >
                자료 올리기
              </CommonButton>
            </Wrapper>
            <Wrapper dr={`row`} ju={`space-between`} margin={`0 0 30px`}>
              <TabWrapper
                onClick={() => setCurrentTab(0)}
                className={currentTab === 0 && `current`}
              >
                <Wrapper width={`17px`}>
                  <Image src={``} alt={`file_icon`} />
                </Wrapper>
                <Text>ILK(아이러브코리아 SB)</Text>
              </TabWrapper>
              <TabWrapper
                onClick={() => setCurrentTab(1)}
                className={currentTab === 1 && `current`}
              >
                <Wrapper width={`17px`}>
                  <Image src={``} alt={`file_icon`} />
                </Wrapper>
                <Text>ILK(아이러브코리아 SB)</Text>
              </TabWrapper>
              <TabWrapper
                onClick={() => setCurrentTab(2)}
                className={currentTab === 2 && `current`}
              >
                <Wrapper width={`17px`}>
                  <Image src={``} alt={`file_icon`} />
                </Wrapper>
                <Text>교재명</Text>
              </TabWrapper>
              <TabWrapper
                onClick={() => setCurrentTab(3)}
                className={currentTab === 3 && `current`}
              >
                <Wrapper width={`17px`}>
                  <Image src={``} alt={`file_icon`} />
                </Wrapper>
                <Text>교재명</Text>
              </TabWrapper>
              <TabWrapper
                onClick={() => setCurrentTab(4)}
                className={currentTab === 4 && `current`}
              >
                <Wrapper width={`17px`}>
                  <Image src={``} alt={`file_icon`} />
                </Wrapper>
                <Text>교재명</Text>
              </TabWrapper>
            </Wrapper>

            <Wrapper dr={`row`} ju={`flex-start`}>
              <ProductWrapper>
                <Wrapper>
                  <Image src={`https://via.placeholder.com/203x258`} />
                </Wrapper>
              </ProductWrapper>
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
