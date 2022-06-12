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
  Modal,
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

const Icon = styled(Wrapper)`
  height: 1px;
  background: ${Theme.darkGrey_C};
  position: relative;

  &:before {
    content: "";
    position: absolute;
    bottom: -2px;
    right: 4px;
    width: 1px;
    height: 10px;
    background: ${Theme.darkGrey_C};
    transform: rotate(-60deg);
  }
`;

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

  const {
    communityDetail,
    communityComment,
    communityCommentDetail,
    st_communityCommentCreateDone,
    st_communityCommentCreateError,
    communityCommentsLen,
  } = useSelector((state) => state.community);

  ////// HOOKS //////

  const width = useWidth();
  const dispatch = useDispatch();
  const router = useRouter();

  const [commentForm] = Form.useForm();
  const [childCommentForm] = Form.useForm();

  const [currentComment, setCurrentComment] = useState(null);

  const [repleToggle, setRepleToggle] = useState(false); // 댓글쓰기 모달 토글
  const [currentData, setCurrentData] = useState(null); // 댓글의 정보 보관

  ////// REDUX //////

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
    if (st_communityCommentCreateDone) {
      commentForm.resetFields();
      childCommentForm.resetFields();

      dispatch({
        type: COMMUNITY_COMMENT_DETAIL_REQUEST,
        data: {
          communityId: router.query.id,
          commentId: currentData && currentData.id,
        },
      });

      dispatch({
        type: COMMUNITY_DETAIL_REQUEST,
        data: {
          communityId: router.query.id,
        },
      });

      openRecommentToggle(null);

      return message.success("댓글이 등록되었습니다.");
    }
  }, [st_communityCommentCreateDone]);

  useEffect(() => {
    if (st_communityCommentCreateError) {
      return message.error(st_communityCommentCreateError);
    }
  }, [st_communityCommentCreateError]);

  ////// TOGGLE //////

  const commentSubmit = useCallback(
    (data) => {
      dispatch({
        type: COMMUNITY_COMMENT_CREATE_REQUEST,
        data: {
          content: data.comment,
          communityId: router.query.id,
          parentId: null,
        },
      });
    },
    [router.query]
  );

  const childCommentSubmit = useCallback(
    (data) => {
      if (currentData) {
        dispatch({
          type: COMMUNITY_COMMENT_CREATE_REQUEST,
          data: {
            content: data.comment,
            communityId: router.query.id,
            parentId: currentData.id,
          },
        });
      }
    },
    [router.query, currentData]
  );

  const openRecommentToggle = useCallback(
    (data) => {
      console.log(data);
      if (data === null) {
        setRepleToggle(false);
      } else {
        setRepleToggle(!repleToggle);
      }
      setCurrentData(data);
    },
    [repleToggle]
  );

  ////// HANDLER //////

  const moveLinkHandler = useCallback((link) => {
    router.push(link);
  }, []);

  const getCommentHandler = useCallback(
    (id) => {
      dispatch({
        type: COMMUNITY_COMMENT_DETAIL_REQUEST,
        data: {
          communityId: router.query.id,
          commentId: id,
        },
      });
    },
    [router.query]
  );

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
                {communityDetail && communityDetail.title}
              </Text>
              <Wrapper
                dr={`row`}
                fontSize={`16px`}
                color={Theme.subTheme11_C}
                ju={`flex-start`}
              >
                <Text margin={`0 20px 0 0`}>
                  Writer :&nbsp;{communityDetail && communityDetail.username}
                </Text>
                <Text margin={`0 20px 0 0`}>
                  Date time :&nbsp;
                  {communityDetail &&
                    moment(communityDetail.createdAt).format("YYYY-MM-DD")}
                </Text>
                <Text>
                  View :&nbsp;{communityDetail && communityDetail.hit}
                </Text>
              </Wrapper>
            </Wrapper>
            <Wrapper>
              {communityDetail &&
                communityDetail.file &&
                communityDetail.file !== "" && (
                  <Image src={communityDetail.file} />
                )}
              <Wrapper
                margin={
                  communityDetail &&
                  communityDetail.file &&
                  communityDetail.file !== ""
                    ? `60px 0 80px`
                    : `0px 0 80px`
                }
                al={`flex-start`}
                ju={`flex-start`}
                color={Theme.black_2C}
                minHeight={`120px`}
              >
                {communityDetail &&
                  communityDetail.content.split(`\n`).map((data) => {
                    return (
                      <SpanText>
                        {data}
                        <br />
                      </SpanText>
                    );
                  })}
              </Wrapper>
            </Wrapper>
            <CommonButton
              kindOf={`subTheme12`}
              width={`140px`}
              height={`50px`}
              fontSize={`18px`}
              onClick={() => moveLinkHandler(`/`)}
            >
              Go back
            </CommonButton>
            <FormTag form={commentForm} onFinish={commentSubmit}>
              <Wrapper al={`flex-start`} ju={`flex-start`} margin={`0 0 50px`}>
                <Text
                  fontSize={width < 900 ? `15px` : `18px`}
                  color={Theme.red_C}
                  fontWeight={`700`}
                  margin={`0 0 10px`}
                >
                  Comments&nbsp;{communityCommentsLen}
                </Text>
                <FormItem name={`comment`}>
                  <TextArea
                    width={`100%`}
                    height={`115px`}
                    margin={`0 0 20px`}
                    placeholder={`Please write a comment.`}
                  />
                </FormItem>
                <Wrapper al={`flex-end`}>
                  <CommonButton
                    htmlType={`submit`}
                    width={`140px`}
                    height={`50px`}
                  >
                    Write
                  </CommonButton>
                </Wrapper>
              </Wrapper>
            </FormTag>
            {/* 댓글 */}

            {communityComment && communityComment.length === 0 ? (
              <Wrapper>
                <Empty description={`No comment`} />
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
                      key={data.id}
                    >
                      <Wrapper
                        dr={`row`}
                        ju={`space-between`}
                        margin={`0 0 13px`}
                      >
                        <Text fontSize={`18px`} fontWeight={`700`}>
                          {data.username}
                          <SpanText
                            fontSize={`16px`}
                            fontWeight={`400`}
                            color={Theme.grey2_C}
                            margin={`0 0 0 15px`}
                          >
                            {moment(data.createdAt).format("YYYY-MM-DD")}
                          </SpanText>
                        </Text>
                        <Wrapper dr={`row`} width={`auto`}>
                          <HoverText onClick={() => openRecommentToggle(data)}>
                            Reple
                          </HoverText>
                          &nbsp;|&nbsp;
                          <HoverText onClick={() => getCommentHandler(data.id)}>
                            More comments +
                          </HoverText>
                        </Wrapper>
                      </Wrapper>
                      {data.content}
                    </Wrapper>

                    {/* 대댓글 영역 */}

                    {communityCommentDetail &&
                      communityCommentDetail.length !== 0 &&
                      communityCommentDetail[0].id === data.id &&
                      communityCommentDetail.slice(1).map((v) => {
                        return (
                          <Wrapper
                            key={v.id}
                            padding={
                              width < 900
                                ? `10px 0 10px ${v.lev * 10}px`
                                : `10px 0 10px ${v.lev * 20}px`
                            }
                            al={`flex-start`}
                            borderTop={`1px solid ${Theme.lightGrey_C}`}
                          >
                            <Wrapper
                              dr={`row`}
                              ju={`space-between`}
                              margin={`0 0 10px`}
                              width={`calc(100% - 15px)`}
                            >
                              <Wrapper
                                dr={`row`}
                                ju={`flex-start`}
                                width={`auto`}
                              >
                                <Wrapper
                                  width={`auto`}
                                  margin={`0 10px 0 0`}
                                  al={`flex-start`}
                                >
                                  <Wrapper
                                    width={`1px`}
                                    height={`15px`}
                                    bgColor={Theme.darkGrey_C}
                                  ></Wrapper>
                                  <Icon width={`${v.lev * 10}px`}></Icon>
                                </Wrapper>
                                <Text fontSize={`18px`} fontWeight={`700`}>
                                  {v.username}
                                </Text>
                                <Text
                                  fontSize={`16px`}
                                  margin={`0 15px`}
                                  color={Theme.grey2_C}
                                >
                                  {moment(v.createdAt).format("YYYY-MM-DD")}
                                </Text>
                              </Wrapper>
                              <HoverText onClick={() => openRecommentToggle(v)}>
                                Reple
                              </HoverText>
                            </Wrapper>

                            <Wrapper al={`flex-start`} margin={`0 0 15px`}>
                              <Text>{v.content.split("ㄴ")[1]}</Text>
                            </Wrapper>
                          </Wrapper>
                        );
                      })}
                  </>
                );
              })
            )}
          </RsWrapper>

          <Modal
            width={`800px`}
            title="Reple"
            footer={null}
            visible={repleToggle}
            onCancel={() => openRecommentToggle(null)}
            onOk={() => openRecommentToggle(null)}
          >
            {currentData && (
              <Wrapper padding={`10px`}>
                <FormItem label="comment">
                  <Text>
                    {currentData.parent === 0
                      ? currentData.content
                      : currentData.content.split("ㄴ")[1]}
                  </Text>
                </FormItem>

                <FormTag form={childCommentForm} onFinish={childCommentSubmit}>
                  <FormItem label="reple" name={`comment`}>
                    <TextArea
                      width={`100%`}
                      height={`115px`}
                      placeholder="Please write a comment."
                    />
                  </FormItem>
                  <Wrapper al={`flex-end`}>
                    <CommonButton
                      htmlType={`submit`}
                      width={`140px`}
                      height={`50px`}
                    >
                      Write
                    </CommonButton>
                  </Wrapper>
                </FormTag>
              </Wrapper>
            )}
          </Modal>
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
