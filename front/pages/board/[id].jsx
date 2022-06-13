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
  COMMUNITY_COMMENT_DELETE_REQUEST,
  COMMUNITY_COMMENT_DETAIL_REQUEST,
  COMMUNITY_COMMENT_UPDATE_REQUEST,
  COMMUNITY_DELETE_REQUEST,
  COMMUNITY_DETAIL_REQUEST,
  COMMUNITY_UPDATE_REQUEST,
  COMMUNITY_UPLOAD_REQUEST,
  CREATE_MODAL_CLOSE_REQUEST,
  CREATE_MODAL_OPEN_REQUEST,
  FILE_INIT,
} from "../../reducers/community";
import ToastEditorComponent5 from "../../components/editor/ToastEditorComponent5";

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

const BoardDetail = () => {
  ////// GLOBAL STATE //////
  const { seo_keywords, seo_desc, seo_ogImage, seo_title } = useSelector(
    (state) => state.seo
  );
  const { me } = useSelector((state) => state.user);

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
    //
    st_communityUpdateDone,
    st_communityUpdateError,
    st_communityDeleteDone,
    st_communityDeleteError,
    st_communityCommentUpdateDone,
    st_communityCommentUpdateError,
    st_communityCommentDeleteDone,
    st_communityCommentDeleteError,
    filePath,
    createModal,
  } = useSelector((state) => state.community);

  ////// HOOKS //////

  const width = useWidth();
  const dispatch = useDispatch();
  const router = useRouter();

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
  const [contentData, setContentData] = useState("");

  const fileRef = useRef();
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
    if (st_communityUpdateDone) {
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
      updateToggle(null);

      return message.success("수정되었습니다.");
    }
  }, [st_communityUpdateDone]);

  useEffect(() => {
    if (st_communityDeleteDone) {
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
      updateToggle(null);

      router.push(`/`);
      return message.success("삭제되었습니다.");
    }
  }, [st_communityDeleteDone]);

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
    if (st_communityUpdateError) {
      return message.error(st_communityUpdateError);
    }
  }, [st_communityUpdateError]);

  useEffect(() => {
    if (st_communityDeleteError) {
      return message.error(st_communityDeleteError);
    }
  }, [st_communityDeleteError]);

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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [router.query]);

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

  const getEditContent = (contentValue) => {
    setContentData(contentValue);
  };

  const fileUploadClick = useCallback(() => {
    fileRef.current.click();
  }, [fileRef.current]);

  const fileChangeHandler = useCallback(
    (e) => {
      const formData = new FormData();

      [].forEach.call(e.target.files, (file) => {
        formData.append("file", file);
      });

      dispatch({
        type: COMMUNITY_UPLOAD_REQUEST,
        data: formData,
      });

      fileRef.current.value = "";
    },
    [fileRef]
  );

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

  const updateFormSubmit = useCallback(() => {
    updateForm.submit();
  }, []);

  const updateFormFinish = useCallback(
    (data) => {
      if (!contentData || contentData.trim() === "") {
        return message.error("Please click the Save button");
      }
      dispatch({
        type: COMMUNITY_UPDATE_REQUEST,
        data: {
          id: updateData.id,
          title: data.title,
          content: contentData,
          file: filePath ? filePath : updateData.file,
          type: updateData.CommunityTypeId,
        },
      });
    },
    [updateData, filePath, contentData]
  );

  const deleteCommentHandler = useCallback((data) => {
    dispatch({
      type: COMMUNITY_COMMENT_DELETE_REQUEST,
      data: {
        commentId: data.id,
      },
    });
  }, []);

  const deleteHandler = useCallback((data) => {
    dispatch({
      type: COMMUNITY_DELETE_REQUEST,
      data: {
        communityId: data.id,
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
            <Wrapper al={`flex-end`} margin={`0 0 10px`}>
              {communityDetail && me && communityDetail.UserId == me.id && (
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
              )}
            </Wrapper>
            <Wrapper
              al={`flex-start`}
              bgColor={Theme.lightGrey2_C}
              borderTop={`2px solid ${Theme.subTheme7_C}`}
              margin={`0 0 20px`}
            >
              <Text
                padding={`20px`}
                fontSize={width < 900 ? `16px` : `24px`}
                fontWeight={`700`}
                color={Theme.subTheme11_C}
              >
                {communityDetail && communityDetail.title}
              </Text>
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
              {communityDetail &&
                communityDetail.file &&
                communityDetail.file !== "" && (
                  <Image src={communityDetail.file} />
                )}
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
                onClick={() => moveLinkHandler(`/`)}
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
                          {data.username}
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
                            <HoverText
                              onClick={() => getCommentHandler(data.id)}
                            >
                              More comments +
                            </HoverText>
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
                                  {v.username}
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

                                {v.isDelete === 0 &&
                                  me &&
                                  v.idOfUser === me.id && (
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
                                        onConfirm={() =>
                                          deleteCommentHandler(v)
                                        }
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

          <Modal
            title={`update review`}
            visible={createModal}
            onCancel={updateToggle}
            onOk={updateFormSubmit}
          >
            <Form
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              form={updateForm}
              onFinish={updateFormFinish}
            >
              <Form.Item
                label={`Title`}
                name={`title`}
                rules={[{ required: true, message: "제목을 입력해 주세요." }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label={`Content`}
                name={`content`}
                rules={[{ required: true, message: "본문을 입력해 주세요." }]}
              >
                <ToastEditorComponent5
                  action={getEditContent}
                  updateData={updateData}
                />
              </Form.Item>
              {/* <Form.Item label={`Type`} name={`type`}>
                    <Select>
                      {communityTypes &&
                        communityTypes.map((data) => {
                          return (
                            <Select.Option value={data.id}>
                              {data.value}
                            </Select.Option>
                          );
                        })}
                    </Select>
                  </Form.Item> */}
              {/* review 고정 */}
              <Form.Item label={`file`}>
                <input
                  type="file"
                  name="file"
                  accept=".png, .jpg"
                  hidden
                  ref={fileRef}
                  onChange={fileChangeHandler}
                />

                <Button
                  type={`primary`}
                  size={`small`}
                  onClick={fileUploadClick}
                >
                  FILE UPLOAD
                </Button>
              </Form.Item>
              <Form.Item label={`image`}>
                <Image
                  width={`100px`}
                  src={filePath ? filePath : updateData && updateData.file}
                />
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
