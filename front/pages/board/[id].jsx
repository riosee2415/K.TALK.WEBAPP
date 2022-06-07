import React, { useState, useCallback, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import {
  Calendar,
  Checkbox,
  Empty,
  Form,
  InputNumber,
  message,
  Select,
} from "antd";
import { CalendarOutlined, CaretDownOutlined } from "@ant-design/icons";

import { END } from "redux-saga";
import Head from "next/head";
import axios from "axios";
import wrapper from "../../store/configureStore";

import ClientLayout from "../../components/ClientLayout";
import {
  RsWrapper,
  WholeWrapper,
  Wrapper,
  Text,
  TextInput,
  TextArea,
  CommonButton,
  SpanText,
  ATag,
  Image,
} from "../../components/commonComponents";

import Theme from "../../components/Theme";
import useWidth from "../../hooks/useWidth";
import moment from "moment";
import { useRouter } from "next/router";

import { SEO_LIST_REQUEST } from "../../reducers/seo";
import { LOAD_MY_INFO_REQUEST } from "../../reducers/user";
import { APP_CREATE_REQUEST } from "../../reducers/application";
import {
  COMMUNITY_COMMENT_CREATE_REQUEST,
  COMMUNITY_COMMENT_DETAIL_REQUEST,
  COMMUNITY_DETAIL_REQUEST,
} from "../../reducers/community";

const HoverText = styled(Text)`
  cursor: pointer;
  &:hover {
    font-weight: 700;
  }
  transition: 0.2s;
`;

const CustomForm = styled(Form)`
  width: 718px;

  & .ant-form-item {
    width: 100%;
    margin: 0 0 48px;
  }

  @media (max-width: 700px) {
    width: 100%;

    & .ant-form-item {
      margin: 0 0 28px;
    }
  }
`;

const CustomInputNumber = styled(InputNumber)`
  width: 100%;
  height: 40px;
  border: none;
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.16);
  border-radius: 5px;

  .ant-input-number-input {
    height: 40px;
  }

  .ant-input-number-handler-wrap {
    display: none;
  }

  &::placeholder {
    color: ${Theme.grey2_C};
  }
`;

const CustomCheckBox2 = styled(Checkbox)`
  & .ant-checkbox + span {
    font-size: 18px !important;
  }

  & .ant-checkbox-inner {
    width: 20px;
    height: 20px;
  }

  & .ant-checkbox-checked .ant-checkbox-inner {
    background-color: ${Theme.white_C} !important;
    border-color: ${Theme.grey_C} !important;
  }

  & .ant-checkbox-checked .ant-checkbox-inner::after {
    border: 2px solid ${Theme.red_C};
    border-top: 0;
    border-left: 0;
  }

  @media (max-width: 700px) {
    & .ant-checkbox + span {
      font-size: 14px !important;
    }
  }
`;

const CustomSelect = styled(Select)`
  width: 100%;
  margin: ${(props) => props.margin};

  &:not(.ant-select-customize-input) .ant-select-selector {
    border-radius: 5px;
    box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.16);
  }

  & .ant-select-selector {
    width: 100% !important;
    height: 40px !important;
    padding: 5px 0 0 10px !important;
  }

  & .ant-select-arrow span svg {
    color: ${Theme.black_C};
  }

  & .ant-select-selection-placeholder {
    color: ${Theme.grey2_C};
  }
`;

const CusotmInput = styled(TextInput)`
  border: none;
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.16);
  border-radius: 5px;
  width: ${(props) => props.width};

  &::placeholder {
    color: ${Theme.grey2_C};
  }
`;

const CusotmArea = styled(TextArea)`
  border: none;
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.16);
`;

const FormTag = styled(Form)`
  width: 100%;
`;

const FormItem = styled(Form.Item)`
  width: 100%;
`;

const BoardDetail = () => {
  ////// GLOBAL STATE //////
  const { seo_keywords, seo_desc, seo_ogImage, seo_title } = useSelector(
    (state) => state.seo
  );

  const { st_appCreateDone, st_appCreateError } = useSelector(
    (state) => state.app
  );

  const { communityComment } = useSelector((state) => state.community);

  ////// HOOKS //////

  const width = useWidth();
  const dispatch = useDispatch();
  const router = useRouter();

  const [commentForm] = Form.useForm();
  const [childCommentForm] = Form.useForm();

  const [currentComment, setCurrentComment] = useState(null);
  const [currentShow, setCurrentShow] = useState(null);

  ////// REDUX //////

  const CommentTree = () => {
    return (
      <>
        {communityComment && communityComment.length === 0 ? (
          <Wrapper>
            <Empty description={`댓글이 없습니다.`} />
          </Wrapper>
        ) : (
          communityComment &&
          communityComment.map((data) => {
            return (
              <>
                <Wrapper
                  al={`flex-start`}
                  padding={`30px 10px`}
                  borderTop={`1px solid ${Theme.lightGrey3_C}`}
                  borderBottom={`1px solid ${Theme.lightGrey3_C}`}
                  cursor={`pointer`}
                >
                  <Wrapper dr={`row`} ju={`space-between`} margin={`0 0 13px`}>
                    <Text fontSize={`18px`} fontWeight={`700`}>
                      {data.username}
                      <SpanText
                        fontSize={`16px`}
                        fontWeight={`400`}
                        color={Theme.grey2_C}
                        margin={`0 0 0 15px`}
                      >
                        {data.createdAt}
                      </SpanText>
                    </Text>
                    <Wrapper dr={`row`} width={`auto`}>
                      <HoverText
                        onClick={() =>
                          setCurrentComment((prev) => (prev ? null : data.id))
                        }
                      >
                        답글 쓰기
                      </HoverText>
                      &nbsp;|&nbsp;
                      <HoverText
                        onClick={() =>
                          setCurrentShow((prev) => (prev ? null : data.id))
                        }
                      >
                        대댓글 보기
                      </HoverText>
                    </Wrapper>
                  </Wrapper>
                  {data.content}
                </Wrapper>
                {currentShow === data.id && <Wrapper>asdasdasd</Wrapper>}
                {currentComment === data.id && (
                  <Wrapper>
                    <FormTag
                      form={childCommentForm}
                      onFinish={childCommentSubmit}
                    >
                      <Wrapper
                        al={`flex-start`}
                        ju={`flex-start`}
                        margin={`0 0 50px`}
                      >
                        <FormItem name={`comment`}>
                          <TextArea width={`100%`} height={`80px`} />
                        </FormItem>
                        <Wrapper al={`flex-end`}>
                          <CommonButton
                            htmlType={`submit`}
                            width={`100px`}
                            height={`40px`}
                          >
                            작성하기
                          </CommonButton>
                        </Wrapper>
                      </Wrapper>
                    </FormTag>
                  </Wrapper>
                )}
              </>
            );
          })
        )}
      </>
    );
  };
  ////// USEEFFECT //////
  //   useEffect(() => {
  //     window.scrollTo(0, 0);
  //   }, [router.query]);

  useEffect(() => {
    dispatch({
      type: COMMUNITY_DETAIL_REQUEST,
      data: {
        communityId: router.query.id,
      },
    });
  }, [router.query]);

  useEffect(() => {
    if (currentShow) {
      dispatch({
        type: COMMUNITY_COMMENT_DETAIL_REQUEST,
        data: {
          parentId: currentShow,
        },
      });
    }
  }, [currentShow]);

  ////// TOGGLE //////

  const commentSubmit = useCallback(
    (data) => {
      dispatch({
        type: COMMUNITY_COMMENT_CREATE_REQUEST,
        data: {
          content: data.comment,
          communityId: router.query.id,
          parent: 0,
          parentId: null,
        },
      });
    },
    [router.query]
  );

  const childCommentSubmit = useCallback(
    (data) => {
      dispatch({
        type: COMMUNITY_COMMENT_CREATE_REQUEST,
        data: {
          content: data.comment,
          communityId: router.query.id,
          parentId: currentComment,
        },
      });
    },
    [router.query, currentComment]
  );

  ////// HANDLER //////

  const moveLinkHandler = useCallback((link) => {
    router.push(link);
  }, []);

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
        <WholeWrapper
          bgColor={Theme.subTheme_C}
          padding={`80px 0`}
          margin={width < 700 ? `50px 0 0` : `100px 0 0`}
        >
          <RsWrapper>
            <Wrapper
              al={`flex-start`}
              bgColor={Theme.lightGrey2_C}
              borderTop={`2px solid ${Theme.black_4C} `}
              padding={`0 0 0 30px`}
              margin={`0 0 40px`}
              height={`140px`}
            >
              <Text
                margin={`0 0 20px`}
                fontSize={`24px`}
                fontWeight={`700`}
                color={Theme.subTheme11_C}
              >
                제목
              </Text>
              <Wrapper
                dr={`row`}
                fontSize={`16px`}
                color={Theme.subTheme11_C}
                ju={`flex-start`}
              >
                <Text margin={`0 20px 0 0`}>작성자 : 케이톡</Text>
                <Text margin={`0 20px 0 0`}>작성일 : 2022-03-12</Text>
                <Text>조회수 : 35</Text>
              </Wrapper>
            </Wrapper>
            <Wrapper>
              <Image src={`https://via.placeholder.com/1350x476`} />
              <Wrapper
                margin={`60px 0 80px`}
                al={`flex-start`}
                ju={`flex-start`}
                color={Theme.black_2C}
                minHeight={`120px`}
              >
                asdasdasdasjhcgasdfjsdjfhbasdlf asfkjhgf{" "}
              </Wrapper>
            </Wrapper>
            <CommonButton
              kindOf={`subTheme12`}
              width={`140px`}
              height={`50px`}
              fontSize={`18px`}
              onClick={() => moveLinkHandler(`/`)}
            >
              목록
            </CommonButton>
            <FormTag form={commentForm} onFinish={commentSubmit}>
              <Wrapper al={`flex-start`} ju={`flex-start`} margin={`0 0 50px`}>
                <Text>댓글 86개</Text>
                <FormItem name={`comment`}>
                  <TextArea
                    width={`100%`}
                    height={`115px`}
                    margin={`0 0 20px`}
                  />
                </FormItem>
                <Wrapper al={`flex-end`}>
                  <CommonButton
                    htmlType={`submit`}
                    width={`140px`}
                    height={`50px`}
                  >
                    작성하기
                  </CommonButton>
                </Wrapper>
              </Wrapper>
            </FormTag>
            {/* 댓글 */}
            <CommentTree />

            {/*  */}
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

export default BoardDetail;
