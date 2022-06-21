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
  Popconfirm,
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
import {
  LECTURE_NOTICE_CREATE_REQUEST,
  LECTURE_NOTICE_DELETE_REQUEST,
  LECTURE_NOTICE_LIST_REQUEST,
  LECTURE_NOTICE_MODAL_TOGGLE,
  LECTURE_NOTICE_UPDATE_REQUEST,
  LECTURE_NOTICE_UPLOAD_REQUEST,
  RESET_LECTURE_NOTICE_PATH,
} from "../../../reducers/lectureNotice";
import ToastEditorLectureNotice from "../../../components/editor/ToastEditorLectureNotice";
import { LECTURE_DETAIL_REQUEST } from "../../../reducers/lecture";
import { PARTICIPANT_STUDENT_LIST_REQUEST } from "../../../reducers/participant";

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

const Notice = ({}) => {
  ////// GLOBAL STATE //////

  const { seo_keywords, seo_desc, seo_ogImage, seo_title } = useSelector(
    (state) => state.seo
  );
  const { me } = useSelector((state) => state.user);

  const { lectureDetail } = useSelector((state) => state.lecture);

  const { studentLists } = useSelector((state) => state.participant);

  const {
    lectureNotices,
    maxPage,
    uploadLectureNoticePath,
    lectureNoticeModal,
    //
    st_lectureNoticeListError,
    //
    st_lectureNoticeCreateDone,
    st_lectureNoticeCreateError,
    //
    st_lectureNoticeUpdateDone,
    st_lectureNoticeUpdateError,
    //
    st_lectureNoticeDeleteDone,
    st_lectureNoticeDeleteError,
  } = useSelector((state) => state.lectureNotice);

  ////// HOOKS //////
  const width = useWidth();

  const router = useRouter();

  const dispatch = useDispatch();

  const fileRef = useRef();

  const [lectureNoticeForm] = Form.useForm();

  const [updateData, setUpdateData] = useState(null);
  const [inputContent, setInputContent] = useState(null);
  const [valueChange, setValueChange] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);

  ////// USEEFFECT //////

  useEffect(() => {
    if (!me) {
      message.error("Please log in");
      return router.push(`/`);
    } else if (me.level !== 1) {
      message.error("Access denied");
      return router.push(`/`);
    }
  }, [me]);

  useEffect(() => {
    if (router.query) {
      // 강의실 게시글 목록
      dispatch({
        type: LECTURE_NOTICE_LIST_REQUEST,
        data: {
          LectureId: parseInt(router.query.id),
          page: currentPage,
        },
      });

      // 강의실 선생님 정보
      dispatch({
        type: LECTURE_DETAIL_REQUEST,
        data: {
          LectureId: parseInt(router.query.id),
        },
      });

      // 강의실 학생 목록
      dispatch({
        type: PARTICIPANT_STUDENT_LIST_REQUEST,
        data: {
          LectureId: parseInt(router.query.id),
        },
      });
    }
  }, [router.query, currentPage]);

  useEffect(() => {
    if (updateData) {
      lectureNoticeForm.setFieldsValue({
        lTitle: updateData.title,
        lContent: updateData.noticeContent,
      });
    }
  }, [updateData]);

  useEffect(() => {
    if (lectureNotices) {
      if (updateData) {
        setUpdateData(
          lectureNotices.find((data) => data.noticeId === updateData.noticeId)
        );
      }
    }
  }, [lectureNotices]);

  useEffect(() => {
    if (st_lectureNoticeListError) {
      return message.error(st_lectureNoticeListError);
    }
  }, [st_lectureNoticeListError]);

  useEffect(() => {
    if (st_lectureNoticeCreateDone) {
      dispatch({
        type: LECTURE_NOTICE_LIST_REQUEST,
        data: {
          LectureId: router.query && router.query.id,
          page: currentPage,
        },
      });

      dispatch({
        type: RESET_LECTURE_NOTICE_PATH,
      });

      lectureNoticeModalToggle(null);

      return message.success("게시판이 등록되었습니다.");
    }
  }, [st_lectureNoticeCreateDone]);

  useEffect(() => {
    if (st_lectureNoticeCreateError) {
      return message.error(st_lectureNoticeCreateError);
    }
  }, [st_lectureNoticeCreateError]);

  useEffect(() => {
    if (st_lectureNoticeUpdateDone) {
      dispatch({
        type: LECTURE_NOTICE_LIST_REQUEST,
        data: {
          LectureId: router.query && router.query.id,
          page: currentPage,
        },
      });

      dispatch({
        type: RESET_LECTURE_NOTICE_PATH,
      });

      lectureNoticeModalToggle(null);

      return message.success("게시판이 수정되었습니다.");
    }
  }, [st_lectureNoticeUpdateDone]);

  useEffect(() => {
    if (st_lectureNoticeUpdateError) {
      return message.error(st_lectureNoticeUpdateError);
    }
  }, [st_lectureNoticeUpdateError]);

  useEffect(() => {
    if (st_lectureNoticeDeleteDone) {
      dispatch({
        type: LECTURE_NOTICE_LIST_REQUEST,
        data: {
          LectureId: router.query && router.query.id,
          page: currentPage,
        },
      });

      return message.success("게시판이 삭제되었습니다.");
    }
  }, [st_lectureNoticeDeleteDone]);

  useEffect(() => {
    if (st_lectureNoticeDeleteError) {
      return message.error(st_lectureNoticeDeleteError);
    }
  }, [st_lectureNoticeDeleteError]);

  ////// TOGGLE //////

  const moveLinkHandler = useCallback((link) => {
    router.push(link);
  }, []);

  const lectureNoticeModalToggle = useCallback(
    (data) => {
      if (data) {
        setUpdateData(data);
      } else {
        setUpdateData(null);
      }

      setInputContent(null);
      lectureNoticeForm.resetFields();

      dispatch({
        type: LECTURE_NOTICE_MODAL_TOGGLE,
      });
    },
    [lectureNoticeForm, inputContent]
  );

  ////// HANDLER //////
  const otherPageCall = useCallback(
    (changePage) => {
      setCurrentPage(changePage);

      dispatch({
        type: LECTURE_NOTICE_LIST_REQUEST,
        data: {
          LectureId: router.query && router.query.id,
          page: changePage,
        },
      });
    },
    [router.query]
  );

  const userValueChange = useCallback(
    (data) => {
      if (data === "강사") {
        const tempArr1 = [];

        tempArr1.push(lectureDetail[0].TeacherId);

        setValueChange(tempArr1);
      } else if (data === "반전체") {
        const tempArr2 = [];

        studentLists.map((data) => {
          tempArr2.push(data.id);
        });

        setValueChange(tempArr2);
      }
    },
    [lectureDetail, studentLists]
  );

  // 게시판 등록

  const onSubmit = useCallback(
    (data) => {
      if (
        !inputContent ||
        inputContent.indexOf("Please write a comment.") === 72
      ) {
        return message.error("Please write a comment.");
      }

      if (data.lSend === "강사") {
        dispatch({
          type: LECTURE_NOTICE_CREATE_REQUEST,
          data: {
            title: data.lTitle,
            content: inputContent,
            author: me.username,
            level: me.level,
            LectureId: router.query.id,
            receiverId: valueChange,
            file: uploadLectureNoticePath,
          },
        });
      }

      if (data.lSend === "반전체") {
        dispatch({
          type: LECTURE_NOTICE_CREATE_REQUEST,
          data: {
            title: data.lTitle,
            content: inputContent,
            author: me.username,
            level: me.level,
            LectureId: router.query.id,
            receiverId: valueChange,
            file: uploadLectureNoticePath,
          },
        });
      }
    },
    [me, router.query, inputContent, uploadLectureNoticePath, valueChange]
  );

  const getEditContent = useCallback(
    (contentValue) => {
      if (contentValue) {
        lectureNoticeForm.submit();

        setInputContent(contentValue);
      }
    },
    [inputContent, lectureNoticeForm, updateData]
  );

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
        type: LECTURE_NOTICE_UPLOAD_REQUEST,
        data: formData,
      });

      fileRef.current.value = "";
    },
    [fileRef]
  );

  //  게시판 수정
  const updateSubmit = useCallback(
    (data) => {
      if (
        !inputContent ||
        inputContent.indexOf("Please write a comment.") === 72
      ) {
        return message.error("Please write a comment.");
      }

      dispatch({
        type: LECTURE_NOTICE_UPDATE_REQUEST,
        data: {
          id: updateData.noticeId,
          title: data.lTitle,
          content: inputContent,
          file: uploadLectureNoticePath,
        },
      });
    },
    [updateData, inputContent]
  );

  //  게시판 삭제
  const deleteHandler = useCallback((data) => {
    dispatch({
      type: LECTURE_NOTICE_DELETE_REQUEST,
      data: {
        id: data.noticeId,
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
            padding={width < 700 ? `30px 0` : `60px 0`}
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
              <CommonTitle>Class / Board</CommonTitle>
            </Wrapper>

            <Wrapper al={`flex-end`} margin={`0 0 20px`}>
              <CommonButton onClick={() => lectureNoticeModalToggle(null)}>
                Write
              </CommonButton>
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
                display={width < 900 ? `none` : `block`}
              >
                No
              </Text>
              <Text
                fontSize={width < 700 ? `12px` : `18px`}
                fontWeight={`Bold`}
                width={width < 800 ? `18%` : `10%`}
              >
                Date
              </Text>
              <Text
                fontSize={width < 700 ? `12px` : `18px`}
                fontWeight={`Bold`}
                width={width < 800 ? `30%` : `53%`}
              >
                Title
              </Text>
              <Text
                fontSize={width < 700 ? `12px` : `18px`}
                fontWeight={`Bold`}
                width={width < 800 ? `20%` : `15%`}
              >
                Writer
              </Text>
              <Text
                fontSize={width < 700 ? `12px` : `18px`}
                fontWeight={`Bold`}
                width={width < 800 ? `27%` : `12%`}
              >
                Update | Delete
              </Text>
            </Wrapper>
            {lectureNotices &&
              (lectureNotices.length === 0 ? (
                <Wrapper margin={`50px 0`}>
                  <Empty description="No announcement" />
                </Wrapper>
              ) : (
                lectureNotices.map((data) => {
                  return (
                    <CustomTableHoverWrapper key={data.noticeId}>
                      <Wrapper
                        width={width < 800 ? `15%` : `10%`}
                        display={width < 900 ? `none` : `flex`}
                      >
                        {data.noticeId}
                      </Wrapper>
                      <Wrapper
                        width={width < 800 ? `18%` : `10%`}
                        fontSize={width < 700 && `12px`}
                      >
                        {data.noticeCreatedAt}
                      </Wrapper>
                      <Wrapper
                        width={width < 800 ? `30%` : `53%`}
                        al={`flex-start`}
                        padding={`0 0 0 10px`}
                        onClick={() =>
                          moveLinkHandler(`/classboard/${data.noticeId}`)
                        }
                      >
                        <Text
                          width={width < 900 ? `100px` : `400px`}
                          textAlign={`start`}
                          isEllipsis
                        >
                          {data.title}
                        </Text>
                      </Wrapper>
                      <Wrapper
                        width={width < 800 ? `20%` : `15%`}
                        fontSize={width < 800 ? `10px` : `14px`}
                      >
                        {data.noticeAuthor}(
                        {data.noticeLevel === 1
                          ? "student"
                          : data.noticeLevel === 2
                          ? "teacher"
                          : "admin"}
                        )
                      </Wrapper>
                      <Wrapper width={width < 800 ? `27%` : `12%`}>
                        {data.writeUserId === (me && me.id) ? (
                          <Wrapper dr={`row`}>
                            <CommonButton
                              width={width < 900 ? `100%` : `50%`}
                              onClick={() => lectureNoticeModalToggle(data)}
                            >
                              Update
                            </CommonButton>
                            <Popconfirm
                              title="Are you sure you want to delete it?"
                              okText="Delete"
                              cancelText="Cancel"
                              onConfirm={() => deleteHandler(data)}
                            >
                              <CommonButton
                                width={width < 900 ? `100%` : `50%`}
                                fontSize={`13px`}
                                kindOf={`delete`}
                              >
                                Delete
                              </CommonButton>
                            </Popconfirm>
                          </Wrapper>
                        ) : (
                          <Text fontSize={width < 800 ? `12px` : `14px`}>
                            You do not have permission.
                          </Text>
                        )}
                      </Wrapper>
                    </CustomTableHoverWrapper>
                  );
                })
              ))}

            <Wrapper margin={`50px 0`}>
              <CustomPage
                size="small"
                current={currentPage}
                total={maxPage * 10}
                onChange={(page) => otherPageCall(page)}
              />
            </Wrapper>
          </RsWrapper>

          {/* NOTICE CREATE && UPDATE MODAL */}

          <Modal
            title={updateData ? `Notice Update` : `Notice Write`}
            visible={lectureNoticeModal}
            onCancel={() => lectureNoticeModalToggle(null)}
            width={`900px`}
            footer={null}
          >
            <Form
              form={lectureNoticeForm}
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 21 }}
              onFinish={updateData ? updateSubmit : onSubmit}
            >
              {updateData ? (
                <></>
              ) : (
                <Form.Item label={`Send`} name={`lSend`}>
                  <Select onChange={(data) => userValueChange(data)}>
                    <Select.Option value={"강사"}>Teacher</Select.Option>
                    <Select.Option value={"반전체"}>All class</Select.Option>
                  </Select>
                </Form.Item>
              )}

              <Form.Item label={`Title`} name={`lTitle`}>
                <Input placeholder="Please write a title." />
              </Form.Item>

              <Form.Item label={`File`}>
                <input
                  type="file"
                  name="file"
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

              <Form.Item label={`Image`}>
                <Image
                  width={`100px`}
                  src={
                    uploadLectureNoticePath
                      ? uploadLectureNoticePath
                      : updateData && updateData.noticeFile
                  }
                />
              </Form.Item>

              <Form.Item label={`Content`} name={`lContent`}>
                <ToastEditorLectureNotice
                  action={getEditContent}
                  initialValue={updateData ? updateData.noticeContent : null}
                  placeholder="Please write a content."
                  buttonText={updateData ? "UPDATE" : "CREATE"}
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

    // 구현부 종료
    context.store.dispatch(END);
    console.log("🍀 SERVER SIDE PROPS END");
    await context.store.sagaTask.toPromise();
  }
);

export default Notice;
