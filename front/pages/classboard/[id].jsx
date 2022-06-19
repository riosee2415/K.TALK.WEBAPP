import React, { useState, useCallback, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import {
  Button,
  Calendar,
  Checkbox,
  Empty,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Popconfirm,
  Select,
} from "antd";

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
  COMMUNITY_COMMENT_CREATE_REQUEST,
  COMMUNITY_COMMENT_DELETE_REQUEST,
  COMMUNITY_COMMENT_DETAIL_REQUEST,
  COMMUNITY_COMMENT_LIST_INIT,
  COMMUNITY_COMMENT_UPDATE_REQUEST,
  COMMUNITY_DELETE_REQUEST,
  COMMUNITY_DETAIL_REQUEST,
  COMMUNITY_UPDATE_REQUEST,
  COMMUNITY_UPLOAD_REQUEST,
  CREATE_MODAL_CLOSE_REQUEST,
  CREATE_MODAL_OPEN_REQUEST,
  FILE_INIT,
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

const Classboard = () => {
  ////// GLOBAL STATE //////
  const { seo_keywords, seo_desc, seo_ogImage, seo_title } = useSelector(
    (state) => state.seo
  );
  const { me } = useSelector((state) => state.user);

  const {
    communityDetail,
    communityComment,
    communityCommentDetail,
    st_communityCommentCreateDone,
    st_communityCommentCreateError,
    communityCommentsLen,
    //
    st_communityCommentUpdateDone,
    st_communityCommentUpdateError,
    st_communityCommentDeleteDone,
    st_communityCommentDeleteError,

    createModal,
  } = useSelector((state) => state.community);

  ////// HOOKS //////
  const width = useWidth();

  const router = useRouter();

  const dispatch = useDispatch();

  const [commentForm] = Form.useForm();
  const [childCommentForm] = Form.useForm();

  const [updateCommentForm] = Form.useForm();
  const [updateForm] = Form.useForm();

  const [repleToggle, setRepleToggle] = useState(false); // 댓글쓰기 모달 토글
  const [currentData, setCurrentData] = useState(null); // 댓글의 정보 보관

  const [updateModal, setUpdateModal] = useState(false); // 게시물 수정
  const [updateData, setUpdateData] = useState(false);

  const [updateCommentModal, setUpdateCommentModal] = useState(false); // 댓글 수정
  const [updateCommentData, setUpdateCommentData] = useState(false);
  const [grandData, setGrandData] = useState(null);
  const [cocommentToggle, setCocommentToggle] = useState(null);

  ////// REDUX //////

  ////// USEEFFECT //////
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [router.query]);

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
      dispatch({
        type: COMMUNITY_COMMENT_LIST_INIT,
      });
      setCocommentToggle(false);
      return message.success("댓글이 등록되었습니다.");
    }
  }, [st_communityCommentCreateDone]);

  useEffect(() => {
    if (st_communityCommentUpdateDone) {
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
      updateCommentToggle(null);

      return message.success("댓글이 수정되었습니다.");
    }
  }, [st_communityCommentUpdateDone]);

  useEffect(() => {
    if (st_communityCommentDeleteDone) {
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

      return message.success("댓글이 삭제되었습니다.");
    }
  }, [st_communityCommentDeleteDone]);

  useEffect(() => {
    if (st_communityCommentCreateError) {
      return message.error(st_communityCommentCreateError);
    }
  }, [st_communityCommentCreateError]);

  useEffect(() => {
    if (st_communityCommentUpdateError) {
      return message.error(st_communityCommentUpdateError);
    }
  }, [st_communityCommentUpdateError]);

  useEffect(() => {
    if (st_communityCommentDeleteError) {
      return message.error(st_communityCommentDeleteError);
    }
  }, [st_communityCommentDeleteError]);

  ////// TOGGLE //////

  const commentSubmit = useCallback(
    (data) => {
      dispatch({
        type: COMMUNITY_COMMENT_CREATE_REQUEST,
        data: {
          content: data.comment,
          communityId: router.query.id,
          parentId: null,
          grantparentId: null,
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
            grantparentId:
              currentData.parent === 0 ? currentData.id : grandData,
          },
        });
      }
    },
    [router.query, currentData, grandData]
  );

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

  const getCommentHandler = useCallback(
    (id) => {
      setCocommentToggle(true);
      setGrandData(id);
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

  const updateToggle = useCallback(
    (data) => {
      setUpdateCommentModal((prev) => !prev);
      setUpdateData(data);

      dispatch({
        type: FILE_INIT,
      });
      if (!createModal) {
        setTimeout(() => {
          updateForm.setFieldsValue({
            title: data.title,
            content: data.content,
          });
        }, 500);
        dispatch({
          type: CREATE_MODAL_OPEN_REQUEST,
        });
      } else {
        dispatch({
          type: CREATE_MODAL_CLOSE_REQUEST,
        });
      }
    },
    [createModal]
  );

  const updateCommentFormSubmit = useCallback(() => {
    updateCommentForm.submit();
  }, []);

  const updateCommentFormFinish = useCallback(
    (data) => {
      dispatch({
        type: COMMUNITY_COMMENT_UPDATE_REQUEST,
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
      type: COMMUNITY_COMMENT_DELETE_REQUEST,
      data: {
        commentId: data.id,
      },
    });
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
                  {communityDetail && communityDetail.title}
                </Text>
                {communityDetail && communityDetail.file && (
                  <CommonButton
                    kindOf={`black`}
                    fontSize={`14px`}
                    margin={`0 20px 0 0`}
                  >
                    <a href={communityDetail.file}>File download</a>
                  </CommonButton>
                )}
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
                        Writer
                      </Wrapper>
                      <Text width={`calc(100% - 120px)`} padding={`0 0 0 15px`}>
                        {communityDetail && communityDetail.username}
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
                        Date time
                      </Wrapper>
                      <Text width={`calc(100% - 120px)`} padding={`0 0 0 15px`}>
                        {communityDetail &&
                          moment(communityDetail.createdAt).format(
                            "YYYY-MM-DD"
                          )}
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
                        View
                      </Wrapper>
                      <Text width={`calc(100% - 120px)`} padding={`0 0 0 15px`}>
                        {communityDetail && communityDetail.hit}
                      </Text>
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
                          Writer
                        </Wrapper>
                        <Text
                          width={`calc(100% - 120px)`}
                          padding={`0 0 0 15px`}
                        >
                          {communityDetail && communityDetail.username}
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
                          Date time
                        </Wrapper>
                        <Text
                          width={`calc(100% - 120px)`}
                          padding={`0 0 0 15px`}
                        >
                          {communityDetail &&
                            moment(communityDetail.createdAt).format(
                              "YYYY-MM-DD"
                            )}
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
                          View
                        </Wrapper>
                        <Text
                          width={`calc(100% - 120px)`}
                          padding={`0 0 0 15px`}
                        >
                          {communityDetail && communityDetail.hit}
                        </Text>
                      </Wrapper>
                    </Wrapper>
                  </Wrapper>
                )}

                {/* {width > 800 &&
                communityDetail &&
                me &&
                communityDetail.UserId == me.id && (
                  <Wrapper dr={`row`} width={`auto`} padding={`0 10px 0 0`}>
                    {communityDetail && (
                      <Button
                        size={`small`}
                        type={`primary`}
                        onClick={() => updateToggle(communityDetail)}
                      >
                        edit
                      </Button>
                    )}
                    &nbsp;
                    {communityDetail && (
                      <Popconfirm
                        placement="bottomRight"
                        title={`삭제하시겠습니까?`}
                        okText="Delete"
                        cancelText="Cancel"
                        onConfirm={() => deleteHandler(communityDetail)}
                      >
                        <Button size={`small`} type={`danger`}>
                          delete
                        </Button>
                      </Popconfirm>
                    )}
                  </Wrapper>
                )} */}
              </Wrapper>
            </Wrapper>

            <Wrapper>
              {width < 800 ? (
                <Wrapper
                  margin={
                    communityDetail &&
                    communityDetail.file &&
                    communityDetail.file !== ""
                      ? `20px 0 30px`
                      : `0px 0 30px`
                  }
                  al={`flex-start`}
                  ju={`flex-start`}
                  color={Theme.black_2C}
                  minHeight={`120px`}
                >
                  <WordbreakText
                    al={`flex-start`}
                    ju={`flex-start`}
                    dangerouslySetInnerHTML={{
                      __html: communityDetail && communityDetail.content,
                    }}
                  ></WordbreakText>
                </Wrapper>
              ) : (
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
                  <WordbreakText
                    al={`flex-start`}
                    ju={`flex-start`}
                    dangerouslySetInnerHTML={{
                      __html: communityDetail && communityDetail.content,
                    }}
                  ></WordbreakText>
                </Wrapper>
              )}
            </Wrapper>
            <Wrapper al={`flex-end`}>
              <CommonButton
                kindOf={`subTheme12`}
                width={width < 800 ? `80px` : `140px`}
                height={width < 800 ? `30px` : `50px`}
                fontSize={width < 800 ? `14px` : `18px`}
                padding={`0`}
                onClick={() => moveLinkHandler(`/student/notice`)}
                margin={`0 0 30px`}
              >
                Go back
              </CommonButton>
            </Wrapper>
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
                    placeholder={`Please write a comment.`}
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
                                More comments +
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
                                Reple
                              </CommonButton>
                            )}
                          </Wrapper>
                          {me && data.UserId === me.id && (
                            <Wrapper dr={`row`} width={`auto`}>
                              <HoverText
                                color={Theme.basicTheme_C}
                                onClick={() => updateCommentToggle(data)}
                              >
                                Edit
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
                                  Delete
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
                      communityCommentDetail &&
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
                                {me && (
                                  <HoverText
                                    margin={`0 0 10px`}
                                    onClick={() => openRecommentToggle(v)}
                                  >
                                    Reple
                                  </HoverText>
                                )}

                                {v.isDelete === 0 && me && v.UserId === me.id && (
                                  <Wrapper dr={`row`} width={`auto`}>
                                    <HoverText
                                      onClick={() =>
                                        updateCommentToggle(v, true)
                                      }
                                    >
                                      Edit
                                    </HoverText>
                                    &nbsp;|&nbsp;
                                    <Popconfirm
                                      placement="bottomRight"
                                      title={`삭제하시겠습니까?`}
                                      okText="Delete"
                                      cancelText="Cancel"
                                      onConfirm={() => deleteCommentHandler(v)}
                                    >
                                      <HoverText>Delete</HoverText>
                                    </Popconfirm>
                                  </Wrapper>
                                )}
                              </Wrapper>
                            </Wrapper>

                            <Wrapper al={`flex-start`} margin={`0 0 15px 15px`}>
                              {v.isDelete === 1 ? (
                                <Text>삭제된 댓글입니다.</Text>
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
                    {currentData.isDelete === 1
                      ? "삭제된 댓글입니다."
                      : currentData.parent === 0
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

          <Modal
            title={`update comment`}
            visible={updateModal}
            onCancel={updateCommentToggle}
            onOk={updateCommentFormSubmit}
          >
            <Form form={updateCommentForm} onFinish={updateCommentFormFinish}>
              <Form.Item
                label={`Content`}
                name={`content`}
                rules={[{ required: true, message: "본문을 입력해 주세요." }]}
              >
                <Input.TextArea />
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

export default Classboard;
