import React, { useEffect, useCallback, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import DaumPostCode from "react-daum-postcode";
import moment from "moment";

import Head from "next/head";
import { useRouter } from "next/router";

import axios from "axios";
import { END } from "redux-saga";
import wrapper from "../../store/configureStore";
import { SEO_LIST_REQUEST } from "../../reducers/seo";
import {
  LOAD_MY_INFO_REQUEST,
  ME_UPDATE_MODAL_TOGGLE,
  POSTCODE_MODAL_TOGGLE,
  USER_PROFILE_IMAGE_PATH,
  USER_PROFILE_UPLOAD_REQUEST,
  USER_UPDATE_REQUEST,
} from "../../reducers/user";

import {
  Calendar,
  Empty,
  Form,
  Input,
  message,
  Modal,
  Pagination,
  Select,
  Slider,
} from "antd";
import styled from "styled-components";
import useWidth from "../../hooks/useWidth";
import ClientLayout from "../../components/ClientLayout";
import {
  CommonButton,
  Image,
  RsWrapper,
  SpanText,
  Text,
  WholeWrapper,
  Wrapper,
  TextInput,
} from "../../components/commonComponents";
import Theme from "../../components/Theme";
import {
  MESSAGE_CREATE_REQUEST,
  MESSAGE_FOR_ADMIN_CREATE_REQUEST,
  MESSAGE_TEACHER_LIST_REQUEST,
  MESSAGE_USER_LIST_REQUEST,
} from "../../reducers/message";

import { NOTICE_LIST_REQUEST } from "../../reducers/notice";
import { LECTURE_STU_LECTURE_LIST_REQUEST } from "../../reducers/lecture";

const PROFILE_WIDTH = `184`;
const PROFILE_HEIGHT = `190`;

const ProfileWrapper = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ProfileImage = styled.img`
  width: 184px;
  height: 190px;
  object-fit: cover;
  border-radius: 5px;
`;
const UploadWrapper = styled.div`
  width: 184px;
  margin: 5px 0;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

const GuideWrapper = styled.section`
  width: 100%;
  padding: 5px;
  margin-bottom: 10px;

  border-radius: 3px;
  background-color: #eeeeee;
`;

const GuideText = styled.div`
  font-size: 13.5px;
  color: #5e5e5e;
  font-weight: 700;
`;

const PreviewGuide = styled.p`
  font-weight: 700;
  color: #b1b1b1;
`;

const CustomSlide = styled(Slider)`
  width: 100%;
  margin: 0 0 8px;
  & .ant-slider-track,
  & .ant-slider-rail {
    height: 12px;
    border-radius: 10px;
  }

  & .ant-slider-track {
    background-color: ${(props) => props.bgColor} !important;
  }

  & .ant-slider-handle {
    display: none;
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

const CustomTableHoverWrapper = styled(Wrapper)`
  flex-direction: row;
  padding: 25px 0 20px;
  font-size: 16px;
  background-color: ${(props) =>
    props.bgColor ? Theme.lightGrey_C : Theme.white_C};
  cursor: pointer;
  &:hover {
    background-color: ${(props) =>
      props.bgColor ? Theme.white_C : Theme.lightGrey_C};
  }

  @media (max-width: 800px) {
    font-size: 14px;
  }
`;

const WordbreakText = styled(Text)`
  width: 100%;
  word-wrap: break-all;
`;

const CustomModal = styled(Modal)`
  & .ant-modal-header,
  & .ant-modal-content {
    border-radius: 5px;
  }
`;

const CustomForm = styled(Form)`
  width: 100%;

  & .ant-form-item {
    width: 100%;
  }
`;

const CusotmInput = styled(TextInput)`
  border: none;
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.16);
  border-radius: 5px;

  &::placeholder {
    color: ${Theme.grey2_C};
  }

  &:focus {
    border: 1px solid ${Theme.basicTheme_C};
  }
`;

const LectureAll = () => {
  ////// GLOBAL STATE //////

  const { Option } = Select;

  const { seo_keywords, seo_desc, seo_ogImage, seo_title } = useSelector(
    (state) => state.seo
  );
  const {
    me,
    meUpdateModal,
    postCodeModal,
    userProfilePath,
    //
    st_userProfileUploadLoading,
    st_userProfileUploadDone,
    st_userProfileUploadError,
    //
    st_userUserUpdateDone,
    st_userUserUpdateError,
  } = useSelector((state) => state.user);

  const {
    messageTeacherList,
    st_messageTeacherListDone,
    st_messageTeacherListError,

    st_messageCreateDone,
    st_messageCreateError,

    st_messageForAdminCreateDone,
    st_messageForAdminCreateError,

    messageUserList,
    st_messageUserListDone,
    st_messageUserListError,
  } = useSelector((state) => state.message);

  const {
    lecturePath,

    st_lectureFileLoading,
    st_lectureFileDone,
    st_lectureFileError,

    st_lectureSubmitCreateDone,
    st_lectureSubmitCreateError,

    lectureStuLectureList,
    st_lectureStuLectureListDone,
    st_lectureStuLectureListError,

    lectureHomeworkStuList,
    st_lectureHomeworkStuListDone,
    st_lectureHomeworkStuListError,
  } = useSelector((state) => state.lecture);

  ////// HOOKS //////
  const width = useWidth();
  const router = useRouter();
  const dispatch = useDispatch();

  const [updateForm] = Form.useForm();

  const formRef = useRef();

  const [form] = Form.useForm();
  const [answerform] = Form.useForm();

  const [messageSendModal, setMessageSendModal] = useState(false);
  const [messageViewModal, setMessageViewModal] = useState(false);

  const [messageDatum, setMessageDatum] = useState();

  const [adminSendMessageToggle, setAdminSendMessageToggle] = useState(false);

  const [selectValue, setSelectValue] = useState("");

  const [currentPage1, setCurrentPage1] = useState(1);

  ////// USEEFFECT //////

  useEffect(() => {
    if (!me) {
      message.error("로그인 후 이용해주세요.");
      return router.push(`/`);
    } else if (me.level !== 1) {
      message.error("학생이 아닙니다.");
      return router.push(`/`);
    }
  }, [me]);

  useEffect(() => {
    dispatch({
      type: MESSAGE_TEACHER_LIST_REQUEST,
    });

    dispatch({
      type: MESSAGE_USER_LIST_REQUEST,
      data: {
        page: 1,
      },
    });

    dispatch({
      type: LECTURE_STU_LECTURE_LIST_REQUEST,
    });
  }, []);

  useEffect(() => {
    if (st_userProfileUploadDone) {
      return message.success("프로필 사진이 업로드되었습니다.");
    }
  }, [st_userProfileUploadDone]);

  useEffect(() => {
    if (st_userUserUpdateDone) {
      dispatch({
        type: LOAD_MY_INFO_REQUEST,
      });

      updateForm.resetFields();
      dispatch({
        type: USER_PROFILE_IMAGE_PATH,
        data: null,
      });

      dispatch({
        type: ME_UPDATE_MODAL_TOGGLE,
      });

      return message.success("회원 정보가 수정되었습니다.");
    }
  }, [st_userUserUpdateDone]);

  useEffect(() => {
    if (st_messageCreateDone) {
      onReset();

      return message.success("해당 강사님에게 쪽지를 보냈습니다.");
    }
  }, [st_messageCreateDone]);

  useEffect(() => {
    if (st_messageForAdminCreateError) {
      return message.error(st_messageForAdminCreateError);
    }
  }, [st_messageForAdminCreateError]);

  useEffect(() => {
    if (st_messageForAdminCreateDone) {
      onReset();
      return message.success("관리자에게 쪽지를 보냈습니다.");
    }
  }, [st_messageForAdminCreateDone]);

  useEffect(() => {
    if (st_messageTeacherListError) {
      return message.error(st_messageTeacherListError);
    }
  }, [st_messageTeacherListError]);

  const onReset = useCallback(() => {
    form.resetFields();

    setNoticeViewModal(false);
    setMessageSendModal(false);
    setMessageViewModal(false);
  }, []);

  ////// TOGGLE //////

  const messageSendModalHandler = useCallback(() => {
    setMessageSendModal((prev) => !prev);
  }, []);

  const messageViewModalHandler = useCallback((data) => {
    setMessageViewModal((prev) => !prev);

    // console.log(data, "dta");
    onFiil(data);
    setMessageDatum(data);
  }, []);

  const adminSendMessageToggleHandler = useCallback(() => {
    setAdminSendMessageToggle((prev) => !prev);
  }, []);

  ////// HANDLER //////

  const sendMessageFinishHandler = useCallback(
    (data) => {
      // console.log(data, "data");

      dispatch({
        type: MESSAGE_CREATE_REQUEST,
        data: {
          title: data.title,
          author: me.userId,
          senderId: me.id,
          receiverId: data.receivePerson,
          content: data.content,
          level: me.level,
        },
      });
    },
    [me]
  );

  const sendMessageAdminFinishHandler = useCallback(
    (data) => {
      dispatch({
        type: MESSAGE_FOR_ADMIN_CREATE_REQUEST,
        data: {
          title: data.title,
          author: me.userId,
          content: data.content,
        },
      });
    },
    [me]
  );

  const answerFinishHandler = useCallback((data, messageData) => {
    dispatch({
      type: MESSAGE_CREATE_REQUEST,
      data: {
        title: data.messageTitle,
        author: messageData.author,
        senderId: messageData.receiverId,
        receiverId: messageData.senderId,
        content: data.messageContent,
        level: messageData.level,
      },
    });
  }, []);

  const receiveSelectHandler = useCallback((value) => {
    setSelectValue(value);
  }, []);

  const onFiil = useCallback((data) => {
    if (data) {
      answerform.setFieldsValue({
        messageTitle: data.title,
        messageContent: data.content,
      });
    }
  }, []);

  const moveLinkHandler = useCallback((link) => {
    router.push(link);
  }, []);

  ////// DATAVIEW //////

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
        <WholeWrapper margin={`100px 0 0`} bgColor={Theme.subTheme_C}>
          <RsWrapper>
            <Wrapper
              margin={width < 700 ? `30px 0` : `60px 0`}
              dr={`row`}
              ju={`space-between`}>
              <Wrapper width={`auto`} dr={`row`} ju={`flex-start`}>
                <Wrapper width={`auto`} padding={`9px`} bgColor={Theme.white_C}>
                  <Image
                    width={width < 700 ? `65px` : `75px`}
                    height={width < 700 ? `65px` : `75px`}
                    radius={`100px`}
                    src={
                      me && me.profileImage
                        ? me.profileImage
                        : "https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/img_default-profile.png"
                    }
                    alt="student_thumbnail"
                  />
                </Wrapper>
                <Text
                  fontSize={width < 700 ? `20px` : `28px`}
                  fontWeight={`bold`}
                  padding={`0 0 0 15px`}>
                  안녕하세요,&nbsp;
                  <SpanText color={Theme.basicTheme_C}>
                    {me && me.username}
                  </SpanText>
                  님!
                </Text>
              </Wrapper>
            </Wrapper>

            <Wrapper al={`flex-start`} margin={`0 0 20px`}>
              <Text
                fontSize={width < 800 ? `18px` : `22px`}
                fontWeight={`bold`}>
                내 시간표
              </Text>
            </Wrapper>

            {lectureStuLectureList && lectureStuLectureList.length === 0
              ? ""
              : lectureStuLectureList &&
                lectureStuLectureList.map((data, idx) => {
                  return (
                    <Wrapper
                      padding={
                        width < 700 ? `15px 10px 10px` : `40px 30px 35px`
                      }
                      dr={`row`}
                      ju={`flex-start`}
                      bgColor={Theme.white_C}
                      radius={`10px`}
                      shadow={`0px 5px 15px rgba(0, 0, 0, 0.16)`}
                      margin={`0 0 86px`}
                      al={`flex-start`}>
                      <Wrapper
                        width={
                          width < 1280 ? (width < 800 ? `100%` : `60%`) : `37%`
                        }
                        dr={`row`}
                        ju={`flex-start`}
                        al={`flex-start`}>
                        <Wrapper
                          width={`auto`}
                          padding={width < 700 ? `0` : `5px`}
                          margin={`0 10px 0 0`}>
                          <Image
                            width={`22px`}
                            height={`22px`}
                            src="https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_clock.png"
                            alt="clock_icon"
                          />
                        </Wrapper>
                        <Wrapper
                          width={`calc(100% - 42px)`}
                          dr={`row`}
                          ju={`flex-start`}>
                          <Text
                            fontSize={width < 800 ? `14px` : `18px`}
                            fontWeight={`bold`}
                            lineHeight={`1.22`}>
                            {data.day}&nbsp;&nbsp;|&nbsp;&nbsp;
                            {data.time}
                          </Text>
                          <Wrapper
                            display={
                              width < 1280
                                ? `flex`
                                : (idx + 1) % 3 === 0 && `none`
                            }
                            width={`1px`}
                            height={width < 800 ? `20px` : `34px`}
                            borderLeft={`1px dashed ${Theme.grey_C}`}
                            margin={
                              width < 1350
                                ? width < 800
                                  ? `0 4px`
                                  : `0 10px`
                                : `0 20px`
                            }
                          />
                        </Wrapper>
                      </Wrapper>

                      <Wrapper
                        width={
                          width < 1280 ? (width < 800 ? `100%` : `40%`) : `25%`
                        }
                        dr={`row`}
                        ju={`flex-start`}
                        margin={width < 800 && `5px 0`}>
                        <Wrapper width={`auto`} margin={`0 10px 0 0`}>
                          <Image
                            width={`22px`}
                            height={`22px`}
                            src="https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_calender_y.png"
                            alt="clender_icon"
                          />
                        </Wrapper>
                        <Text fontSize={width < 700 ? `14px` : `18px`}>
                          {`${moment(data.startDate, "YYYY/MM/DD").format(
                            "YYYY/MM/DD"
                          )} ~ ${moment(data.endDate, "YYYY/MM/DD").format(
                            "YYYY/MM/DD"
                          )}`}
                          <SpanText
                            fontWeight={`bold`}
                            color={Theme.red_C}
                            margin={`0 0 0 15px`}>
                            {`D-${moment
                              .duration(
                                moment(data.endDate, "YYYY-MM-DD").diff(
                                  moment(data.startDate, "YYYY-MM-DD")
                                )
                              )
                              .asDays()}`}
                          </SpanText>
                        </Text>
                      </Wrapper>
                      <Wrapper
                        width={width < 1280 ? `100%` : `38%`}
                        dr={`row`}
                        ju={`flex-start`}
                        al={`flex-start`}>
                        <Wrapper
                          width={`25%`}
                          dr={`row`}
                          ju={`flex-start`}
                          margin={`0 20px 0 0`}>
                          <Image
                            margin={`0 10px 0 0`}
                            width={`22px`}
                            height={`22px`}
                            src="https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_name.png"
                            alt="clender_icon"
                          />
                          <Text fontSize={width < 700 ? `14px` : `18px`}>
                            {data.teacherName}
                          </Text>
                        </Wrapper>

                        <Wrapper
                          width={`calc(75% - 20px)`}
                          al={`flex-start`}
                          fontSize={width < 700 ? `12px` : `16px`}>
                          <Text color={Theme.grey2_C}>
                            <SpanText
                              fontWeight={`bold`}
                              margin={`0 16px 0 0`}
                              color={Theme.black_C}>
                              ZOOM ID
                            </SpanText>

                            {data.zoomLink}
                          </Text>
                          <Text color={Theme.grey2_C}>
                            <SpanText
                              fontWeight={`bold`}
                              margin={`0 14px 0 0`}
                              color={Theme.black_C}>
                              Password
                            </SpanText>
                            {data.zoomPass}
                          </Text>
                        </Wrapper>
                      </Wrapper>
                    </Wrapper>
                  );
                })}

            <Wrapper al={`flex-start`} margin={`0 0 20px`}>
              <Text
                fontSize={width < 800 ? `18px` : `22px`}
                fontWeight={`bold`}>
                내 강의정보
              </Text>
            </Wrapper>

            <Wrapper
              dr={`row`}
              padding={width < 800 ? `10px` : `30px`}
              bgColor={Theme.white_C}
              radius={`10px`}
              ju={`space-between`}
              shadow={`0px 5px 15px rgba(0, 0, 0, 0.16)`}
              margin={`0 0 86px`}
              al={width < 1100 && `flex-start`}>
              <Wrapper
                width={width < 800 ? `calc(100%)` : `calc(100%)`}
                position={`relative`}>
                <Wrapper dr={`row`}>
                  <Wrapper width={width < 1100 ? `100%` : `calc(70% - 1px)`}>
                    <Wrapper
                      width={`100%`}
                      dr={`row`}
                      al={width < 800 && `flex-start`}>
                      <Image
                        position={`absolute`}
                        top={`0`}
                        left={`0`}
                        width={width < 800 ? `80px` : `184px`}
                        height={width < 800 ? `80px` : `190px`}
                        radius={`5px`}
                        src="https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/img_default-profile_big.png"
                        alt="student_thumbnail"
                      />
                      <Wrapper
                        margin={width < 800 ? `0 0 0 100px` : `0 0 0 204px`}>
                        <Wrapper dr={`row`} ju={`flex-start`}>
                          <Text
                            margin={`0 10px 0 0`}
                            fontSize={width < 800 ? `16px` : `18px`}
                            fontWeight={`bold`}>
                            강의명
                          </Text>
                          <Text>한국어 초급/중급반</Text>
                        </Wrapper>
                        <Wrapper
                          dr={`row`}
                          ju={`flex-start`}
                          color={Theme.grey2_C}
                          fontSize={width < 800 ? `12px` : `16px`}>
                          <Text lineHeight={`1.19`}>강사 이름</Text>
                          <Text
                            lineHeight={`1.19`}
                            margin={width < 800 ? `5px` : `0 10px`}>
                            |
                          </Text>
                          <Text lineHeight={`1.19`}>강의 수 : 5/30</Text>
                          <Text
                            lineHeight={`1.19`}
                            margin={width < 800 ? `5px` : `0 10px`}>
                            |
                          </Text>
                          <Text lineHeight={`1.19`}>등록상황 : 수료중</Text>
                        </Wrapper>
                      </Wrapper>
                      <Wrapper
                        margin={width < 800 ? `40px 0 0` : `35px 0 0  204px`}>
                        <Wrapper dr={`row`} ju={`flex-start`}>
                          <Text width={width < 800 ? `100%` : `15%`}>
                            <SpanText color={Theme.subTheme2_C}>●</SpanText>
                            &nbsp; 출석 상황
                          </Text>
                          <Wrapper width={width < 800 ? `80%` : `75%`}>
                            <CustomSlide
                              defaultValue={100}
                              disabled={true}
                              draggableTrack={true}
                              bgColor={Theme.subTheme2_C}
                            />
                          </Wrapper>
                          <Text
                            width={`10%`}
                            color={Theme.grey2_C}
                            padding={`0 0 0 10px`}>
                            (100%)
                          </Text>
                        </Wrapper>
                        <Wrapper dr={`row`} ju={`flex-start`} margin={`10px 0`}>
                          <Text width={width < 800 ? `100%` : `15%`}>
                            <SpanText color={Theme.basicTheme_C}>●</SpanText>
                            &nbsp; 수업 진도
                          </Text>
                          <Wrapper width={width < 800 ? `80%` : `75%`}>
                            <CustomSlide
                              defaultValue={55}
                              disabled={true}
                              draggableTrack={true}
                              bgColor={Theme.basicTheme_C}
                            />
                          </Wrapper>
                          <Text
                            width={`10%`}
                            color={Theme.grey2_C}
                            padding={`0 0 0 10px`}>
                            (55%)
                          </Text>
                        </Wrapper>
                        <Wrapper dr={`row`} ju={`flex-start`}>
                          <Text width={width < 800 ? `100%` : `15%`}>
                            <SpanText color={Theme.subTheme6_C}>●</SpanText>
                            &nbsp; 성취도
                          </Text>
                          <Wrapper width={width < 800 ? `80%` : `75%`}>
                            <CustomSlide
                              defaultValue={100}
                              disabled={true}
                              draggableTrack={true}
                              bgColor={Theme.subTheme6_C}
                            />
                          </Wrapper>
                          <Text
                            width={`10%`}
                            color={Theme.grey2_C}
                            padding={`0 0 0 10px`}>
                            (100%)
                          </Text>
                        </Wrapper>
                      </Wrapper>
                    </Wrapper>
                  </Wrapper>

                  <Wrapper
                    display={width < 1100 && `none`}
                    width={`1px`}
                    height={`190px`}
                    margin={`0 40px`}
                    borderRight={
                      width < 1100 ? `0` : `1px dashed ${Theme.grey_C}`
                    }
                  />
                  <Wrapper
                    width={width < 1100 ? `100%` : `calc(30% - 80px)`}
                    margin={
                      width < 1100 && width < 800 ? `10px 0 0` : `20px 0 0`
                    }>
                    <Wrapper
                      borderBottom={`1px dashed ${Theme.grey_C}`}
                      al={`flex-start`}
                      ju={`flex-start`}>
                      <Text
                        padding={width < 800 ? `8px 0` : `16px 0`}
                        color={Theme.basicTheme_C}>
                        ZOOM 이동
                      </Text>
                    </Wrapper>
                    <Wrapper
                      borderBottom={`1px dashed ${Theme.grey_C}`}
                      dr={`row`}
                      al={`flex-start`}
                      ju={`flex-start`}
                      padding={width < 800 ? `8px 0` : `16px 0`}>
                      <Text>수료증 신청</Text>
                      <Text> | </Text>
                      <Text>강의수 늘리기 요청</Text>
                    </Wrapper>
                    <Wrapper
                      borderBottom={`1px dashed ${Theme.grey_C}`}
                      al={`flex-start`}
                      ju={`flex-start`}
                      dr={`row`}
                      padding={width < 800 ? `8px 0` : `16px 0`}>
                      <Text>결석 예고</Text>
                      <Text> | </Text>
                      <Text>반이동 요청</Text>
                      <Text> | </Text>
                      <Text>줌 상담신청</Text>
                    </Wrapper>
                  </Wrapper>
                </Wrapper>
              </Wrapper>
              {/** */}
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

    context.store.dispatch({
      type: MESSAGE_TEACHER_LIST_REQUEST,
    });

    // 구현부 종료
    context.store.dispatch(END);
    console.log("🍀 SERVER SIDE PROPS END");
    await context.store.sagaTask.toPromise();
  }
);

export default LectureAll;
