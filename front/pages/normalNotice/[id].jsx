import React, { useState, useCallback, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { Empty, Form, Input, message, Modal, Popconfirm, Select } from "antd";

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

import { LOAD_MY_INFO_REQUEST } from "../../reducers/user";

import {
  NORMAL_COMMENT_CREATE_REQUEST,
  NORMAL_COMMENT_DELETE_REQUEST,
  NORMAL_COMMENT_LIST_REQUEST,
  NORMAL_COMMENT_UPDATE_REQUEST,
  NORMAL_NOTICE_DETAIL_REQUEST,
} from "../../reducers/normalNotice";

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

const FormTag = styled(Form)`
  width: 100%;
`;

const FormItem = styled(Form.Item)`
  width: 100%;
`;

const WordbreakText = styled(Wrapper)`
  width: 100%;
  word-wrap: break-all;
  & img {
    max-width: 100%;
  }
`;

const NormalNoticeDetail = () => {
  ////// GLOBAL STATE //////
  const { seo_keywords, seo_desc, seo_ogImage, seo_title } = useSelector(
    (state) => state.seo
  );
  const { me } = useSelector((state) => state.user);
  //   normalNoticeDetailData
  //   normalComments
  //   normalCommentsLen
  const {
    normalNoticeDetailData,
    normalNoticeDetailReceviers,
    normalComments,
    normalCommentsLen,

    normalCommentList,

    //
    normalNoticeDetailError,
    //
    normalCommentCreateDone,
    normalCommentCreateError,
    //
    normalCommentUpdateDone,
    normalCommentUpdateError,
    //
    normalCommentDeleteDone,
    normalCommentDeleteError,
  } = useSelector((state) => state.normalNotice);

  ////// HOOKS //////
  const width = useWidth();

  const router = useRouter();

  const dispatch = useDispatch();

  const [commentForm] = Form.useForm();
  const [childCommentForm] = Form.useForm();

  const [updateCommentForm] = Form.useForm();

  const [repleToggle, setRepleToggle] = useState(false); // 댓글쓰기 모달 토글
  const [currentData, setCurrentData] = useState(null); // 댓글의 정보 보관

  const [updateModal, setUpdateModal] = useState(false); // 게시물 수정

  const [updateCommentData, setUpdateCommentData] = useState(false);
  const [grandData, setGrandData] = useState(null);
  const [cocommentToggle, setCocommentToggle] = useState(null);

  ////// REDUX //////

  ////// USEEFFECT //////
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [router.query]);

  useEffect(() => {
    if (!me) {
      message.error("Please log in");
      return router.push(`/`);
    }
  }, [me]);

  useEffect(() => {
    if (router.query) {
      dispatch({
        type: NORMAL_NOTICE_DETAIL_REQUEST,
        data: {
          NormalNoticeId: router.query.id,
        },
      });
    }
  }, [router.query]);

  useEffect(() => {
    if (normalCommentCreateDone) {
      commentForm.resetFields();
      childCommentForm.resetFields();

      dispatch({
        type: NORMAL_NOTICE_DETAIL_REQUEST,
        data: {
          NormalNoticeId: router.query.id,
        },
      });

      dispatch({
        type: NORMAL_COMMENT_LIST_REQUEST,
        data: {
          normalNoticeId: router.query.id,
          commentId: currentData && currentData.id,
        },
      });

      //   dispatch({
      //     type: LECNOTICE_COMMENT_LIST_INIT,
      //   });

      openRecommentToggle(null);
      setCocommentToggle(false);

      return message.success("댓글이 등록되었습니다.");
    }
  }, [normalCommentCreateDone]);

  useEffect(() => {
    if (normalCommentUpdateDone) {
      commentForm.resetFields();
      childCommentForm.resetFields();

      dispatch({
        type: NORMAL_NOTICE_DETAIL_REQUEST,
        data: {
          NormalNoticeId: router.query.id,
        },
      });

      dispatch({
        type: NORMAL_COMMENT_LIST_REQUEST,
        data: {
          normalNoticeId: router.query.id,
          commentId: currentData && currentData.id,
        },
      });

      openRecommentToggle(null);
      updateCommentToggle(null);

      return message.success("댓글이 수정되었습니다.");
    }
  }, [normalCommentUpdateDone]);

  useEffect(() => {
    if (normalCommentDeleteDone) {
      commentForm.resetFields();
      childCommentForm.resetFields();

      dispatch({
        type: NORMAL_NOTICE_DETAIL_REQUEST,
        data: {
          NormalNoticeId: router.query.id,
        },
      });

      dispatch({
        type: NORMAL_COMMENT_LIST_REQUEST,
        data: {
          normalNoticeId: router.query.id,
          commentId: currentData && currentData.id,
        },
      });

      openRecommentToggle(null);

      return message.success("댓글이 삭제되었습니다.");
    }
  }, [normalCommentDeleteDone]);

  useEffect(() => {
    if (normalNoticeDetailError) {
      return message.error(normalNoticeDetailError);
    }
  }, [normalNoticeDetailError]);

  useEffect(() => {
    if (normalCommentCreateError) {
      return message.error(normalCommentCreateError);
    }
  }, [normalCommentCreateError]);

  useEffect(() => {
    if (normalCommentUpdateError) {
      return message.error(normalCommentUpdateError);
    }
  }, [normalCommentUpdateError]);

  useEffect(() => {
    if (normalCommentDeleteError) {
      return message.error(normalCommentDeleteError);
    }
  }, [normalCommentDeleteError]);

  ////// TOGGLE //////

  const openRecommentToggle = useCallback(
    (data) => {
      if (data === null) {
        setRepleToggle(false);
      } else {
        setRepleToggle(!repleToggle);
      }
      setCurrentData(data);
    },
    [repleToggle]
  );

  const updateCommentToggle = useCallback(
    (data, isV) => {
      setUpdateModal((prev) => !prev);
      setUpdateCommentData(data);
      if (!updateModal) {
        setTimeout(() => {
          onFill(data, isV);
        }, 500);
      }
    },
    [updateModal]
  );

  ////// HANDLER //////

  const onFill = useCallback((data, isV) => {
    if (isV) {
      updateCommentForm.setFieldsValue({
        content: data.content.split(`ㄴ`)[1],
      });
    } else {
      updateCommentForm.setFieldsValue({
        content: data.content,
      });
    }
  }, []);

  const moveLinkHandler = useCallback((link) => {
    router.push(link);
  }, []);

  const moveBackHandler = useCallback((link) => {
    router.back();
  }, []);

  //   댓글 작성
  const commentSubmit = useCallback(
    (data) => {
      dispatch({
        type: NORMAL_COMMENT_CREATE_REQUEST,
        data: {
          content: data.comment,
          normalNoticeId: router.query.id,
          parentId: null,
          grantparentId: null,
        },
      });
    },
    [router.query]
  );

  //   대댓글 작성

  const childCommentSubmit = useCallback(
    (data) => {
      if (currentData) {
        dispatch({
          type: NORMAL_COMMENT_CREATE_REQUEST,
          data: {
            content: data.comment,
            normalNoticeId: router.query.id,
            parentId: currentData.id,
            grantparentId:
              currentData.parent === 0 ? currentData.id : grandData,
          },
        });
      }
    },
    [router.query, currentData, grandData]
  );

  // 대댓글 뷰

  const getCommentHandler = useCallback(
    (id) => {
      setCocommentToggle(true);
      setGrandData(id);
      dispatch({
        type: NORMAL_COMMENT_LIST_REQUEST,
        data: {
          normalNoticeId: router.query.id,
          commentId: id,
        },
      });
    },
    [router.query]
  );

  const updateCommentFormSubmit = useCallback(() => {
    updateCommentForm.submit();
  }, []);

  const updateCommentFormFinish = useCallback(
    (data) => {
      dispatch({
        type: NORMAL_COMMENT_UPDATE_REQUEST,
        data: {
          id: updateCommentData.id,
          content: data.content,
        },
      });
    },
    [updateCommentData]
  );

  const deleteCommentHandler = useCallback((data) => {
    dispatch({
      type: NORMAL_COMMENT_DELETE_REQUEST,
      data: {
        commentId: data.id,
      },
    });
  }, []);

  ////// DATAVIEW //////

  if (!normalNoticeDetailData) {
    return null;
  }

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
          padding={`80px 0`}
          margin={width < 700 ? `50px 0 0` : `100px 0 0`}
        >
          <RsWrapper>
            <Wrapper
              al={`flex-start`}
              bgColor={Theme.lightGrey2_C}
              borderTop={`2px solid ${Theme.subTheme7_C}`}
            >
              <Wrapper dr={`row`} ju={`space-between`} wrap={`nowrap`}>
                <Text
                  padding={`20px`}
                  fontSize={width < 900 ? `16px` : `24px`}
                  fontWeight={`700`}
                  color={Theme.subTheme11_C}
                >
                  {normalNoticeDetailData && normalNoticeDetailData.noticeTitle}
                </Text>
                <Wrapper width={`auto`} dr={`row`}>
                  {normalNoticeDetailData && normalNoticeDetailData.noticeFile && (
                    <CommonButton
                      kindOf={`black`}
                      fontSize={`14px`}
                      margin={`0 20px 0 0`}
                    >
                      <a href={normalNoticeDetailData.noticeFile}>
                        {router.query && router.query.type === "stu"
                          ? "file download"
                          : "첨부파일 다운로드"}
                      </a>
                    </CommonButton>
                  )}
                </Wrapper>
              </Wrapper>

              <Wrapper dr={`row`} ju={`space-between`}>
                {width > 800 ? (
                  <Wrapper
                    dr={`row`}
                    fontSize={width < 900 ? `13px` : `16px`}
                    color={Theme.subTheme11_C}
                    ju={`flex-start`}
                    borderTop={`1px solid ${Theme.lightGrey3_C}`}
                  >
                    <Wrapper
                      dr={`row`}
                      width={width < 900 ? `100%` : `calc(100% / 3)`}
                    >
                      <Wrapper
                        width={`120px`}
                        padding={width < 900 ? `10px 0` : `15px 0`}
                        bgColor={Theme.lightGrey3_C}
                      >
                        {router.query && router.query.type === "stu"
                          ? "Writer"
                          : "작성자"}
                      </Wrapper>
                      <Text width={`calc(100% - 120px)`} padding={`0 0 0 15px`}>
                        {normalNoticeDetailData &&
                          normalNoticeDetailData.noticeAuthor}
                        {`(${
                          normalNoticeDetailData &&
                          router.query &&
                          router.query.type === "stu"
                            ? normalNoticeDetailData.noticeLevel === 1
                              ? "student"
                              : normalNoticeDetailData.noticeLevel === 2
                              ? "teacher"
                              : "admin"
                            : normalNoticeDetailData.noticeLevel === 1
                            ? "학생"
                            : normalNoticeDetailData.noticeLevel === 2
                            ? "강사"
                            : "관리자"
                        })`}
                      </Text>
                    </Wrapper>

                    <Wrapper
                      dr={`row`}
                      width={width < 900 ? `100%` : `calc(100% / 3)`}
                    >
                      <Wrapper
                        width={`120px`}
                        padding={width < 900 ? `10px 0` : `15px 0`}
                        bgColor={Theme.lightGrey3_C}
                      >
                        {router.query && router.query.type === "stu"
                          ? "Date time"
                          : "작성일"}
                      </Wrapper>
                      <Text width={`calc(100% - 120px)`} padding={`0 0 0 15px`}>
                        {normalNoticeDetailData &&
                          normalNoticeDetailData.noticeCreatedAt}
                      </Text>
                    </Wrapper>

                    <Wrapper
                      dr={`row`}
                      width={width < 900 ? `100%` : `calc(100% / 3)`}
                    >
                      <Wrapper
                        width={`120px`}
                        padding={width < 900 ? `10px 0` : `15px 0`}
                        bgColor={Theme.lightGrey3_C}
                      >
                        {router.query && router.query.type === "stu"
                          ? "View"
                          : "조회수"}
                      </Wrapper>
                      <Text width={`calc(100% - 120px)`} padding={`0 0 0 15px`}>
                        {normalNoticeDetailData &&
                          normalNoticeDetailData.noticeHit}
                      </Text>
                    </Wrapper>
                    <Wrapper
                      dr={`row`}
                      fontSize={width < 900 ? `13px` : `16px`}
                      color={Theme.subTheme11_C}
                      ju={`flex-start`}
                      borderTop={`1px solid ${Theme.lightGrey3_C}`}
                    >
                      <Wrapper dr={`row`}>
                        <Wrapper
                          width={`120px`}
                          padding={width < 900 ? `10px 0` : `15px 0`}
                          bgColor={Theme.lightGrey3_C}
                        >
                          {router.query && router.query.type === "stu"
                            ? "reciver"
                            : "전송된사람"}
                        </Wrapper>
                        <Text
                          width={`calc(100% - 120px)`}
                          padding={`0 0 0 15px`}
                        >
                          {normalNoticeDetailReceviers &&
                            (normalNoticeDetailReceviers.length === 0
                              ? "admin"
                              : normalNoticeDetailReceviers.map(
                                  (data, idx) =>
                                    `${data.username}${
                                      idx !==
                                      normalNoticeDetailReceviers.length - 1
                                        ? ", "
                                        : ""
                                    }`
                                ))}
                        </Text>
                      </Wrapper>
                    </Wrapper>
                  </Wrapper>
                ) : (
                  <Wrapper
                    fontSize={`14px`}
                    color={Theme.subTheme11_C}
                    ju={`flex-start`}
                    borderTop={`1px solid ${Theme.lightGrey3_C}`}
                  >
                    <Wrapper dr={`row`} margin={`0 0 10px`}>
                      <Wrapper
                        dr={`row`}
                        width={width < 900 ? `100%` : `calc(100% / 3)`}
                      >
                        <Wrapper
                          width={`120px`}
                          padding={width < 900 ? `10px 0` : `15px 0`}
                          bgColor={Theme.lightGrey3_C}
                        >
                          {router.query && router.query.type === "stu"
                            ? "Writer"
                            : "작성자"}
                        </Wrapper>
                        <Text
                          width={`calc(100% - 120px)`}
                          padding={`0 0 0 15px`}
                        >
                          {normalNoticeDetailData &&
                            normalNoticeDetailData.noticeAuthor}
                          {`(${
                            normalNoticeDetailData &&
                            router.query &&
                            router.query.type === "stu"
                              ? normalNoticeDetailData.noticeLevel === 1
                                ? "student"
                                : normalNoticeDetailData.noticeLevel === 2
                                ? "teacher"
                                : "admin"
                              : normalNoticeDetailData.noticeLevel === 1
                              ? "학생"
                              : normalNoticeDetailData.noticeLevel === 2
                              ? "강사"
                              : "관리자"
                          })`}
                        </Text>
                      </Wrapper>

                      <Wrapper
                        dr={`row`}
                        width={width < 900 ? `100%` : `calc(100% / 3)`}
                      >
                        <Wrapper
                          width={`120px`}
                          padding={width < 900 ? `10px 0` : `15px 0`}
                          bgColor={Theme.lightGrey3_C}
                        >
                          {router.query && router.query.type === "stu"
                            ? "Date time"
                            : "작성일"}
                        </Wrapper>
                        <Text
                          width={`calc(100% - 120px)`}
                          padding={`0 0 0 15px`}
                        >
                          {normalNoticeDetailData &&
                            normalNoticeDetailData.noticeCreatedAt}
                        </Text>
                      </Wrapper>

                      <Wrapper
                        dr={`row`}
                        width={width < 900 ? `100%` : `calc(100% / 3)`}
                      >
                        <Wrapper
                          width={`120px`}
                          padding={width < 900 ? `10px 0` : `15px 0`}
                          bgColor={Theme.lightGrey3_C}
                        >
                          {router.query && router.query.type === "stu"
                            ? "View"
                            : "조회수"}
                        </Wrapper>
                        <Text
                          width={`calc(100% - 120px)`}
                          padding={`0 0 0 15px`}
                        >
                          {normalNoticeDetailData &&
                            normalNoticeDetailData.noticeHit}
                        </Text>
                      </Wrapper>
                      <Wrapper dr={`row`} width={`100%`}>
                        <Wrapper
                          width={`120px`}
                          padding={width < 900 ? `10px 0` : `15px 0`}
                          bgColor={Theme.lightGrey3_C}
                        >
                          {router.query && router.query.type === "stu"
                            ? "reciver"
                            : "전송된사람"}
                        </Wrapper>
                        <Text
                          width={`calc(100% - 120px)`}
                          padding={`0 0 0 15px`}
                        >
                          {normalNoticeDetailReceviers &&
                            (normalNoticeDetailReceviers.length === 0
                              ? "admin"
                              : normalNoticeDetailReceviers.map(
                                  (data, idx) =>
                                    `${data.username}${
                                      idx !==
                                      normalNoticeDetailReceviers.length - 1
                                        ? ", "
                                        : ""
                                    }`
                                ))}
                        </Text>
                      </Wrapper>
                    </Wrapper>
                  </Wrapper>
                )}
              </Wrapper>
            </Wrapper>

            <Wrapper>
              {width < 800 ? (
                <Wrapper
                  margin={
                    normalNoticeDetailData &&
                    normalNoticeDetailData.noticeFile &&
                    normalNoticeDetailData.noticeFile !== ""
                      ? `20px 0 30px`
                      : `0px 0 30px`
                  }
                  al={`flex-start`}
                  ju={`flex-start`}
                  color={Theme.black_2C}
                  minHeight={`120px`}
                  padding={`10px`}
                >
                  <WordbreakText
                    al={`flex-start`}
                    ju={`flex-start`}
                    dangerouslySetInnerHTML={{
                      __html:
                        normalNoticeDetailData &&
                        normalNoticeDetailData.noticeContent,
                    }}
                  ></WordbreakText>
                </Wrapper>
              ) : (
                <Wrapper
                  margin={
                    normalNoticeDetailData &&
                    normalNoticeDetailData.noticeFile &&
                    normalNoticeDetailData.noticeFile !== ""
                      ? `60px 0 80px`
                      : `0px 0 80px`
                  }
                  al={`flex-start`}
                  ju={`flex-start`}
                  color={Theme.black_2C}
                  minHeight={`120px`}
                  padding={`10px`}
                >
                  <WordbreakText
                    al={`flex-start`}
                    ju={`flex-start`}
                    dangerouslySetInnerHTML={{
                      __html:
                        normalNoticeDetailData &&
                        normalNoticeDetailData.noticeContent,
                    }}
                  ></WordbreakText>
                </Wrapper>
              )}
            </Wrapper>

            {me && me.level === 1 && (
              <Wrapper al={`flex-end`}>
                <CommonButton
                  kindOf={`subTheme12`}
                  width={width < 800 ? `80px` : `140px`}
                  height={width < 800 ? `30px` : `50px`}
                  fontSize={width < 800 ? `14px` : `18px`}
                  padding={`0`}
                  onClick={moveBackHandler}
                  margin={`0 0 30px`}
                >
                  {router.query && router.query.type === "stu"
                    ? "Go back"
                    : "뒤로가기"}
                </CommonButton>
              </Wrapper>
            )}

            {me && me.level === 2 && (
              <Wrapper al={`flex-end`}>
                <CommonButton
                  kindOf={`subTheme12`}
                  width={width < 800 ? `80px` : `140px`}
                  height={width < 800 ? `30px` : `50px`}
                  fontSize={width < 800 ? `14px` : `18px`}
                  padding={`0`}
                  onClick={moveBackHandler}
                  margin={`0 0 30px`}
                >
                  {router.query && router.query.type === "stu"
                    ? "Go back"
                    : "뒤로가기"}
                </CommonButton>
              </Wrapper>
            )}

            <FormTag form={commentForm} onFinish={commentSubmit}>
              <Wrapper al={`flex-start`} ju={`flex-start`} margin={`0 0 50px`}>
                <Text
                  fontSize={width < 900 ? `15px` : `18px`}
                  color={Theme.red_C}
                  fontWeight={`700`}
                  margin={`0 0 10px`}
                >
                  {router.query && router.query.type === "stu"
                    ? "Comments"
                    : "댓글"}
                  &nbsp;{normalCommentsLen}
                </Text>
                <FormItem
                  name={`comment`}
                  rules={[{ required: true, message: "댓글을 입력해주세요." }]}
                >
                  <TextArea
                    width={`100%`}
                    height={`115px`}
                    placeholder={
                      router.query && router.query.type === "stu"
                        ? "Please write a comment."
                        : "댓글을 입력해주세요."
                    }
                  />
                </FormItem>
                <Wrapper al={`flex-end`}>
                  <CommonButton
                    htmlType={`submit`}
                    width={width < 800 ? `80px` : `140px`}
                    height={width < 800 ? `30px` : `50px`}
                    fontSize={width < 800 ? `14px` : `18px`}
                    padding={`0`}
                  >
                    {router.query && router.query.type === "stu"
                      ? "Write"
                      : "작성"}
                  </CommonButton>
                </Wrapper>
              </Wrapper>
            </FormTag>

            {/* 댓글 */}

            {normalComments && normalComments.length === 0 ? (
              <Wrapper>
                <Empty
                  description={
                    router.query && router.query.type === "stu"
                      ? "No comment"
                      : "댓글이 없습니다."
                  }
                />
              </Wrapper>
            ) : (
              normalComments &&
              normalComments.map((data) => {
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
                        al={width < 900 ? `center` : `flex-start`}
                        margin={`0 0 13px`}
                      >
                        <Text
                          fontSize={width < 900 ? `15px` : `18px`}
                          fontWeight={`700`}
                        >
                          {data.name}(
                          {data.level === 1
                            ? "student"
                            : data.level === 2
                            ? "teacher"
                            : "admin"}
                          )
                          <SpanText
                            fontSize={width < 900 ? `13px` : `16px`}
                            fontWeight={`400`}
                            color={Theme.grey2_C}
                            margin={`0 0 0 15px`}
                          >
                            {moment(data.createdAt).format("YYYY-MM-DD")}
                          </SpanText>
                        </Text>

                        <Wrapper width={`auto`} al={`flex-end`}>
                          <Wrapper
                            dr={`row`}
                            width={`auto`}
                            margin={`0 0 10px`}
                          >
                            {data.commentCnt !== 0 && (
                              <HoverText
                                onClick={() => getCommentHandler(data.id)}
                              >
                                {router.query && router.query.type === "stu"
                                  ? "More comments +"
                                  : "모든 댓글 +"}
                              </HoverText>
                            )}
                            {me && (
                              <CommonButton
                                padding={`0 10px`}
                                kindOf={`black`}
                                margin={`0 0 0 10px`}
                                fontSize={`14px`}
                                onClick={() => openRecommentToggle(data)}
                              >
                                {router.query && router.query.type === "stu"
                                  ? "Reple"
                                  : "댓글 작성"}
                              </CommonButton>
                            )}
                          </Wrapper>
                          {me && data.UserId === me.id && (
                            <Wrapper dr={`row`} width={`auto`}>
                              <HoverText
                                color={Theme.basicTheme_C}
                                onClick={() => updateCommentToggle(data)}
                              >
                                {router.query && router.query.type === "stu"
                                  ? "Edit"
                                  : "수정"}
                              </HoverText>
                              &nbsp;|&nbsp;
                              <Popconfirm
                                placement="bottomRight"
                                title={`삭제하시겠습니까?`}
                                okText="Delete"
                                cancelText="Cancel"
                                onConfirm={() => deleteCommentHandler(data)}
                              >
                                <HoverText color={Theme.red_C}>
                                  {router.query && router.query.type === "stu"
                                    ? "Delete"
                                    : "삭제"}
                                </HoverText>
                              </Popconfirm>
                            </Wrapper>
                          )}
                        </Wrapper>
                      </Wrapper>
                      {data.content}
                    </Wrapper>

                    {/* 대댓글 영역 */}

                    {cocommentToggle &&
                      normalCommentList &&
                      normalCommentList.length !== 0 &&
                      normalCommentList[0].id === data.id &&
                      normalCommentList.slice(1).map((v) => {
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
                            bgColor={v.isDelete === 1 && Theme.lightGrey3_C}
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
                                <Text
                                  fontSize={width < 900 ? `15px` : `18px`}
                                  fontWeight={`700`}
                                >
                                  {v.name}(
                                  {v.level === 1
                                    ? "student"
                                    : v.level === 2
                                    ? "teacher"
                                    : "admin"}
                                  )
                                </Text>
                                <Text
                                  fontSize={width < 900 ? `13px` : `16px`}
                                  margin={`0 15px`}
                                  color={Theme.grey2_C}
                                >
                                  {moment(v.createdAt).format("YYYY-MM-DD")}
                                </Text>
                              </Wrapper>
                              <Wrapper width={`auto`} al={`flex-end`}>
                                {me && v.isDelete === 0 && (
                                  <HoverText
                                    margin={`0 0 10px`}
                                    onClick={() => openRecommentToggle(v)}
                                  >
                                    {router.query && router.query.type === "stu"
                                      ? "Reple"
                                      : "댓글 작성"}
                                  </HoverText>
                                )}

                                {v.isDelete === 0 && me && v.UserId === me.id && (
                                  <Wrapper dr={`row`} width={`auto`}>
                                    <HoverText
                                      onClick={() =>
                                        updateCommentToggle(v, true)
                                      }
                                    >
                                      {router.query &&
                                      router.query.type === "stu"
                                        ? "Edit"
                                        : "수정"}
                                    </HoverText>
                                    &nbsp;|&nbsp;
                                    <Popconfirm
                                      placement="bottomRight"
                                      title={
                                        router.query &&
                                        router.query.type === "stu"
                                          ? "Do you want to delete?"
                                          : "삭제하시겠습니까?"
                                      }
                                      okText="Delete"
                                      cancelText="Cancel"
                                      onConfirm={() => deleteCommentHandler(v)}
                                    >
                                      <HoverText>
                                        {router.query &&
                                        router.query.type === "stu"
                                          ? "Delete"
                                          : "삭제"}
                                      </HoverText>
                                    </Popconfirm>
                                  </Wrapper>
                                )}
                              </Wrapper>
                            </Wrapper>

                            <Wrapper al={`flex-start`} margin={`0 0 15px 15px`}>
                              {v.isDelete === 1 ? (
                                <Text>
                                  {router.query && router.query.type === "stu"
                                    ? "Deleted Comment"
                                    : "삭제된 댓글입니다."}
                                </Text>
                              ) : (
                                <Text>{v.content.split("ㄴ")[1]}</Text>
                              )}
                            </Wrapper>
                          </Wrapper>
                        );
                      })}
                  </>
                );
              })
            )}
          </RsWrapper>

          {/* 대댓글 작성 */}

          <Modal
            width={`800px`}
            title={
              router.query && router.query.type === "stu"
                ? "Write comment"
                : "댓글 작성"
            }
            footer={null}
            visible={repleToggle}
            onCancel={() => openRecommentToggle(null)}
            onOk={() => openRecommentToggle(null)}
          >
            {currentData && (
              <Wrapper padding={`10px`}>
                <FormTag
                  form={childCommentForm}
                  onFinish={childCommentSubmit}
                  labelCol={{ span: 2 }}
                  wrapperCol={{ span: 22 }}
                >
                  <FormItem label="기존댓글">
                    <Text>
                      {currentData.isDelete === 1
                        ? router.query && router.query.type === "stu"
                          ? "Deleted Comment"
                          : "삭제된 댓글입니다."
                        : currentData.parent === 0
                        ? currentData.content
                        : currentData.content.split("ㄴ")[1]}
                    </Text>
                  </FormItem>
                  <FormItem
                    label="댓글"
                    name={`comment`}
                    rules={[
                      {
                        required: true,
                        message:
                          router.query && router.query.type === "stu"
                            ? "Please enter the content."
                            : "댓글을 입력해주세요.",
                      },
                    ]}
                  >
                    <TextArea
                      width={`100%`}
                      height={`115px`}
                      placeholder={
                        router.query && router.query.type === "stu"
                          ? "Please enter the content."
                          : "댓글을 입력해주세요."
                      }
                    />
                  </FormItem>
                  <Wrapper al={`flex-end`}>
                    <CommonButton
                      htmlType={`submit`}
                      width={`100px`}
                      height={`35px`}
                      fontSize={`16px`}
                    >
                      {router.query && router.query.type === "stu"
                        ? "Write"
                        : "작성"}
                    </CommonButton>
                  </Wrapper>
                </FormTag>
              </Wrapper>
            )}
          </Modal>

          {/* 댓글 수정 */}
          <Modal
            width={`800px`}
            title={
              router.query && router.query.type === "stu"
                ? "Comment Update"
                : "댓글 수정"
            }
            visible={updateModal}
            onCancel={updateCommentToggle}
            onOk={updateCommentFormSubmit}
            okText="수정"
            cancelText="취소"
          >
            <Form form={updateCommentForm} onFinish={updateCommentFormFinish}>
              <Form.Item
                label={
                  router.query && router.query.type === "stu"
                    ? "Content"
                    : "댓글내용"
                }
                name={`content`}
                rules={[
                  {
                    required: true,
                    message:
                      router.query && router.query.type === "stu"
                        ? "Please enter the content."
                        : "댓글내용을 입력해주세요.",
                  },
                ]}
              >
                <TextArea width={`100%`} />
              </Form.Item>
            </Form>
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

    // 구현부 종료
    context.store.dispatch(END);
    console.log("🍀 SERVER SIDE PROPS END");
    await context.store.sagaTask.toPromise();
  }
);

export default NormalNoticeDetail;
