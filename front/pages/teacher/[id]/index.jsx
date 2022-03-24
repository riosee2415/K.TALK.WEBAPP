import React, { useEffect, useCallback, useRef, useState } from "react";
import ClientLayout from "../../../components/ClientLayout";
import { useDispatch, useSelector } from "react-redux";

import wrapper from "../../../store/configureStore";
import { END } from "redux-saga";
import useWidth from "../../../hooks/useWidth";
import useInput from "../../../hooks/useInput";
import Theme from "../../../components/Theme";
import styled from "styled-components";
import axios from "axios";

import { LOAD_MY_INFO_REQUEST } from "../../../reducers/user";
import { SEO_LIST_REQUEST } from "../../../reducers/seo";

import Head from "next/head";
import {
  RsWrapper,
  WholeWrapper,
  Wrapper,
  Text,
  Image,
  SpanText,
  CommonButton,
  TextInput,
} from "../../../components/commonComponents";
import {
  CalendarOutlined,
  SearchOutlined,
  DownloadOutlined,
  UploadOutlined,
} from "@ant-design/icons";

import {
  Progress,
  Checkbox,
  Pagination,
  Input,
  Modal,
  Form,
  Button,
  Calendar,
  message,
  Empty,
  Upload,
  Select,
} from "antd";
import {
  MESSAGE_CREATE_REQUEST,
  MESSAGE_DETAIL_REQUEST,
  MESSAGE_MANY_CREATE_REQUEST,
  MESSAGE_USER_LIST_REQUEST,
  MESSAGE_FOR_ADMIN_CREATE_REQUEST,
} from "../../../reducers/message";
import { useRouter } from "next/router";
import {
  LECTURE_STUDENT_LIST_REQUEST,
  LECTURE_TEACHER_LIST_REQUEST,
} from "../../../reducers/lecture";

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

const WordbreakText = styled(Text)`
  width: 100%;
  word-wrap: break-all;
`;

const CustomModal = styled(Modal)`
  & .ant-modal-header,
  & .ant-modal-content {
    border-radius: 5px;
  }

  & .ant-modal-title {
    font-size: 20px;
    font-weight: bold;
  }

  @media (max-width: 700px) {
    & .ant-modal-title {
      font-size: 16px;
    }
  }
`;

const CustomForm = styled(Form)`
  width: 100%;

  & .ant-form-item {
    width: 100%;
  }
`;

const CustomWrapper = styled(Wrapper)`
  width: ${(props) => props.width || `15%`};
  flex-direction: row;
  justify-content: flex-start;

  &::before {
    content: "";
    height: 25px;
    margin: 0 30px 0;
    border-right: 1px dashed ${Theme.grey2_C};
    color: ${Theme.grey2_C};
  }

  ${(props) =>
    props.beforeBool &&
    `
    ::after {
    content: "";
    height: 25px;
    margin: 0 0 0 35px;
    border-right: 1px dashed ${Theme.grey2_C};
    color: ${Theme.grey2_C};
  }
  `}

  @media (max-width: 700px) {
    &::before {
      content: "";
      height: 0px;
      margin: 0;
    }
  }
`;

const CustomCheckBox = styled(Checkbox)`
  @media (max-width: 700px) {
    width: 25%;
    justify-content: center;
  }
`;

const CustomProgress = styled(Progress)`
  width: calc(100% - 50px - 13px - 140px - 140px - 22px - 22px - 20px - 20px);

  & .ant-progress-text {
    ::before {
      content: "(";
    }

    ::after {
      content: ")";
      color: ${Theme.grey2_C};
    }
  }

  @media (max-width: 700px) {
    width: calc(100% - 50px - 13px);
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
      padding: 0 8px;
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
    color: ${Theme.grey_C};
  }

  @media (max-width: 1400px) {
    &::after {
      border-right: ${(props) => props.borderRightBool && `0px`};
    }
  }

  @media (max-width: 700px) {
    font-size: 14px;

    &::after {
      margin: ${(props) => props.margin || `0 5px`};
    }
  }
`;

const Index = () => {
  ////// GLOBAL STATE //////

  const { Option } = Select;

  const { seo_keywords, seo_desc, seo_ogImage, seo_title } = useSelector(
    (state) => state.seo
  );

  const {
    messageList,
    messageDetail,

    st_messageListDone,
    st_messageListError,

    st_messageDetailDone,
    st_messageDetailError,

    st_messageForAdminCreateDone,
    st_messageForAdminCreateError,

    lectureTearcherList,
    st_messageTeacherListDone,
    st_messageTeacherListError,

    messageUserList,
    st_messageUserListDone,
    st_messageUserListError,

    st_messageCreateDone,
    st_messageCreateError,
  } = useSelector((state) => state.message);

  const {
    lectureStudentList,
    st_lectureStudentListDone,
    st_lectureStudentListError,
  } = useSelector((state) => state.lecture);

  const { me } = useSelector((state) => state.user);

  ////// HOOKS //////

  const router = useRouter();

  const dispatch = useDispatch();

  const width = useWidth();

  const formRef = useRef();

  const [form] = Form.useForm();
  const [answerform] = Form.useForm();

  const imageInput = useRef();

  const [isCalendar, setIsCalendar] = useState(false);

  const [messageSendModalToggle, setMessageSendModalToggle] = useState(false);
  const [noticeModalToggle, setNoticeModalToggle] = useState(false);
  const [homeWorkModalToggle, setHomeWorkModalToggle] = useState(false);

  const [adminSendMessageToggle, setAdminSendMessageToggle] = useState(false);

  const [checkedList, setCheckedList] = useState([]);
  const [checkAll, setCheckAll] = useState(false);

  const [messageViewToggle, setMessageViewToggle] = useState(false);

  const [selectValue, setSelectValue] = useState("");

  const inputDate = useInput("");

  const [messageDatum, setMessageDatum] = useState();

  ////// REDUX //////

  ////// USEEFFECT //////

  useEffect(() => {
    if (!me) {
      message.error("로그인 후 이용해주세요.");
      return router.push(`/`);
    } else if (me.level !== 2) {
      message.error("강사가 아닙니다.");
      return router.push(`/`);
    }
  }, [me]);

  useEffect(() => {
    if (lectureStudentList && lectureStudentList.length !== 0) {
      let arr = [];

      lectureStudentList.map((data) => {
        arr.push({
          ...data,
          isCheck: false,
        });
      });

      console.log(arr, "arr");
      setCheckedList(arr);
    }
  }, [lectureStudentList, st_messageForAdminCreateDone]);

  useEffect(() => {
    dispatch({
      type: LECTURE_TEACHER_LIST_REQUEST,
      data: {
        TeacherId: me && me.id,
      },
    });

    dispatch({
      type: LECTURE_STUDENT_LIST_REQUEST,
      data: {
        LectureId: router.query.id,
      },
    });
  }, [me, router.query]);

  useEffect(() => {
    if (st_messageListError) {
      return message.error(st_messageListError);
    }
  }, [st_messageListError]);

  useEffect(() => {
    if (st_messageDetailDone) {
      onFill(messageDetail);
    }
  }, [st_messageDetailDone]);

  useEffect(() => {
    if (st_messageCreateDone) {
      onReset();
      return message.success("답변을 완료 했습니다.");
    }
  }, [st_messageCreateDone]);

  useEffect(() => {
    if (st_lectureStudentListDone) {
    }
  }, [st_lectureStudentListDone]);

  useEffect(() => {
    if (st_lectureStudentListError) {
      return message.error(st_lectureStudentListError);
    }
  }, [st_lectureStudentListError]);

  useEffect(() => {
    if (st_messageForAdminCreateDone) {
      onReset();
      return message.success("관리자에게 쪽지를 보냈습니다.");
    }
  }, [st_messageForAdminCreateDone]);

  useEffect(() => {
    if (st_messageForAdminCreateError) {
      return message.error(st_messageForAdminCreateError);
    }
  }, [st_messageForAdminCreateError]);

  ////// TOGGLE //////

  const adminSendMessageToggleHandler = useCallback(() => {
    setAdminSendMessageToggle((prev) => !prev);
  }, []);

  const messageSendModalHandler = useCallback(() => {
    let result = checkedList.filter((data, idx) => {
      return data.isCheck ? true : false;
    });

    if (result.length !== 0) {
      setMessageSendModalToggle((prev) => !prev);
      setCheckedList(result);
    } else {
      return message.error("체크 박스를 선택해주세요.");
    }
  }, [checkedList]);
  ////// HANDLER //////

  const dateChagneHandler = useCallback((data) => {
    console.log(data, "data");
    const birth = data.format("YYYY-MM-DD");
    formRef.current.setFieldsValue({
      date: birth,
    });

    inputDate.setValue(birth);
  }, []);

  const noteSendFinishHandler = useCallback(
    (value) => {
      dispatch({
        type: MESSAGE_MANY_CREATE_REQUEST,
        data: {
          title: value.title1,
          author: me.username,
          content: value.content1,
          receiverId: checkedList.map((data) => data.id),
        },
      });
    },
    [me, selectValue, checkedList]
  );

  const noticeFinishHandler = useCallback((value) => {}, []);

  const homeWorkFinishHandler = useCallback((data) => {}, []);

  const onReset = useCallback(() => {
    form.resetFields();

    inputDate.setValue("");
    setMessageViewToggle(false);
    setIsCalendar(false);
    setHomeWorkModalToggle(false);
    setNoticeModalToggle(false);
    setMessageSendModalToggle(false);
    setAdminSendMessageToggle(false);
  }, []);

  const onChangeBoxEachHanlder = useCallback((e, idx2, arr) => {
    let result = arr.map((data, idx) => {
      return idx2 === idx ? { ...data, isCheck: e.target.checked } : data;
    });

    setCheckedList(result);
  }, []);

  const onChangeBoxAllHanlder = useCallback((e, arr) => {
    console.log(arr);
    let resultAll = arr.map((data) => {
      return { ...data, isCheck: e.target.checked };
    });

    console.log(resultAll, "resultAll");
    setCheckedList(resultAll);
  }, []);

  const messageViewModalHanlder = useCallback((data) => {
    setMessageViewToggle(true);

    setMessageDatum(data);
    onFillAnswer(data);
  }, []);

  const onFill = (data) => {
    form.setFieldsValue({
      title1: data[0] && data[0].title,
      content2: data[0] && data[0].content,
    });
  };

  const onFillAnswer = (data) => {
    answerform.setFieldsValue({
      messageTitle: data.title,
      messageContent: data.content,
    });
  };

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

  const sendMessageAdminFinishHandler = useCallback(
    (data) => {
      dispatch({
        type: MESSAGE_FOR_ADMIN_CREATE_REQUEST,
        data: {
          title: data.title1,
          author: me.username,
          content: data.content1,
        },
      });
    },
    [me]
  );

  ////// DATAVIEW //////

  const testdata = [
    {
      id: 1,
      student: "Eric1",
      birth: "1997",
      country: "인도네시아",
      money: "U$ 11",
      date: `2022/01/22 (D-1)`,
      memo: "작성하기",
      attendance: "출석",
    },
    {
      id: 2,
      student: "Eric2",
      birth: "1997",
      country: "베트남",
      money: "U$ 25",
      date: `2022/01/30 (D-4)`,
      memo: "작성하기",
      attendance: "출석",
    },
    {
      id: 3,
      student: "Eric3",
      birth: "1997",
      country: "일본",
      money: "U$ 20",
      date: `2022/01/01 (D-5)`,
      memo: "작성하기",
      attendance: "출석",
    },
  ];

  const teacherDiaryArr = [
    {
      id: 1,
      teacherName: "Eric1",
      next: "1997",
      memo: "작성하기",
      createdAt: "2022/01/03",
    },
    {
      id: 2,
      teacherName: "Eric1",
      next: "1997",
      memo: "작성하기",
      createdAt: "2022/01/03",
    },
    {
      id: 3,
      teacherName: "Eric1",
      next: "1997",
      memo: "작성하기",
      createdAt: "2022/01/03",
    },
  ];

  const clockArr = [
    {
      name: "월요일",
      time: "7PM",
    },
    {
      name: "화요일",
      time: "7PM",
    },
    {
      name: "수요일",
      time: "7PM",
    },
    {
      name: "금요일",
      time: "7PM",
    },
  ];

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
                  src={
                    me && me.profileImage
                      ? me.profileImage
                      : "https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/img_default-profile.png"
                  }
                  alt="teacher_thumbnail"
                />
              </Wrapper>

              <Wrapper
                dr={`row`}
                width={`auto`}
                fontSize={width < 700 ? `20px` : `28px`}
                padding={`0 0 0 15px`}
                color={Theme.black_2C}>
                <Text fontWeight={`bold`}>
                  안녕하세요,&nbsp;
                  <SpanText color={Theme.basicTheme_C}>
                    {me && me.username}님
                  </SpanText>
                  !
                </Text>
              </Wrapper>
            </Wrapper>

            <Wrapper>
              <Wrapper
                dr={`row`}
                ju={`flex-start`}
                al={`flex-start`}
                shadow={`0px 5px 15px rgb(0,0,0,0.16)`}
                padding={width < 700 ? `15px 10px 10px` : `35px 30px`}
                margin={`0 0 20px`}
                radius={`10px`}>
                <Wrapper
                  width={width < 1280 ? (width < 800 ? `100%` : `60%`) : `37%`}
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
                    {clockArr &&
                      clockArr.length > 0 &&
                      clockArr.map((data, idx) => {
                        return (
                          <>
                            <Text
                              fontSize={width < 700 ? `14px` : `18px`}
                              fontWeight={`bold`}
                              lineHeight={`1.22`}>
                              {data.name}&nbsp;&nbsp;|&nbsp;&nbsp;{data.time}
                            </Text>
                            <Wrapper
                              display={
                                width < 1280
                                  ? `flex`
                                  : (idx + 1) % 3 === 0 && `none`
                              }
                              width={`1px`}
                              height={`34px`}
                              borderLeft={`1px dashed ${Theme.grey_C}`}
                              margin={
                                width < 1350
                                  ? width < 700
                                    ? `0 4px`
                                    : `0 10px`
                                  : `0 20px`
                              }
                            />
                          </>
                        );
                      })}
                  </Wrapper>
                </Wrapper>

                <Wrapper dr={`row`} width={width < 1400 ? `100%` : `60%`}>
                  <Wrapper
                    dr={`row`}
                    ju={`flex-start`}
                    margin={width < 800 ? `10px 0 0` : `0`}
                    width={width < 800 ? `100%` : `100%`}>
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

                    <CustomText2
                      color={Theme.black_2C}
                      fontWeight={`normal`}
                      fontSize={width < 700 ? `14px` : `18px`}
                      width={width < 700 ? `auto` : `140px`}
                      borderRightBool={true}>
                      NO.12384
                    </CustomText2>

                    {width > 700 && (
                      <>
                        <Text
                          width={`50px`}
                          color={Theme.black_2C}
                          fontSize={width < 700 ? `14px` : `18px`}
                          margin={width < 700 ? `0` : `0 13px 0 0`}>
                          진도율
                        </Text>

                        <CustomProgress percent={55} />
                      </>
                    )}
                  </Wrapper>

                  {width < 700 && (
                    <Wrapper dr={`row`} margin={width < 800 ? `10px 0 0` : `0`}>
                      <Text
                        width={`50px`}
                        color={Theme.black_2C}
                        fontSize={width < 700 ? `14px` : `18px`}
                        margin={width < 700 ? `0` : `0 13px 0 0`}>
                        진도율
                      </Text>

                      <CustomProgress percent={55} />
                    </Wrapper>
                  )}
                </Wrapper>
              </Wrapper>

              <Wrapper shadow={`0px 5px 15px rgb(0,0,0,0.16)`} radius={`10px`}>
                {width < 700 ? (
                  <>
                    <Wrapper
                      dr={`row`}
                      textAlign={`center`}
                      ju={`center`}
                      padding={`20px 0`}>
                      <CustomCheckBox
                        onChange={(e) => onChangeBoxAllHanlder(e, checkedList)}
                      />
                      <Text
                        fontSize={width < 700 ? `14px` : `18px`}
                        fontWeight={`Bold`}
                        width={`25%`}>
                        학생명
                      </Text>
                      <Text
                        fontSize={width < 700 ? `14px` : `18px`}
                        fontWeight={`Bold`}
                        width={`25%`}>
                        출생년도
                      </Text>
                      <Text
                        fontSize={width < 700 ? `14px` : `18px`}
                        fontWeight={`Bold`}
                        width={`25%`}>
                        국가
                      </Text>
                    </Wrapper>

                    {lectureStudentList && lectureStudentList.length === 0 ? (
                      <Wrapper>
                        <Empty description="조회된 데이터가 없습니다." />
                      </Wrapper>
                    ) : (
                      lectureStudentList &&
                      lectureStudentList.map((data, idx) => {
                        return (
                          <Wrapper
                            key={data.id}
                            dr={`row`}
                            textAlign={`center`}
                            padding={`25px 0 20px`}
                            cursor={`pointer`}
                            bgColor={idx % 2 === 0 && Theme.lightGrey_C}>
                            <CustomCheckBox
                              checked={checkedList[idx].isCheck}
                              onChange={(e) =>
                                onChangeBoxEachHanlder(e, idx, checkedList)
                              }
                            />

                            <Text
                              fontSize={width < 700 ? `14px` : `16px`}
                              width={`25%`}
                              wordBreak={`break-word`}>
                              {data.username}
                            </Text>
                            <Text
                              fontSize={width < 700 ? `14px` : `16px`}
                              width={`25%`}>
                              {data.birth.slice(0, 10)}
                            </Text>
                            <Text
                              fontSize={width < 700 ? `14px` : `16px`}
                              width={`25%`}>
                              {data.stuCountry}
                            </Text>
                          </Wrapper>
                        );
                      })
                    )}

                    <Wrapper
                      dr={`row`}
                      textAlign={`center`}
                      ju={`center`}
                      padding={`20px 0`}
                      margin={width < 700 ? `20px 0 0` : `0`}>
                      <Text
                        fontSize={width < 700 ? `14px` : `18px`}
                        fontWeight={`Bold`}
                        width={`25%`}
                        wordBreak={`break-word`}>
                        수업료
                      </Text>

                      <Text
                        fontSize={width < 700 ? `14px` : `18px`}
                        fontWeight={`Bold`}
                        width={`25%`}>
                        만기일
                      </Text>
                      <Text
                        fontSize={width < 700 ? `14px` : `18px`}
                        fontWeight={`Bold`}
                        width={`25%`}>
                        메모
                      </Text>
                      <Text
                        fontSize={width < 700 ? `14px` : `18px`}
                        fontWeight={`Bold`}
                        width={`25%`}>
                        출석
                      </Text>
                    </Wrapper>

                    {lectureStudentList && lectureStudentList.length === 0 ? (
                      <Wrapper>
                        <Empty description="조회된 데이터가 없습니다." />
                      </Wrapper>
                    ) : (
                      lectureStudentList &&
                      lectureStudentList.map((data, idx) => {
                        return (
                          <Wrapper
                            dr={`row`}
                            textAlign={`center`}
                            padding={`25px 0 20px`}
                            cursor={`pointer`}
                            bgColor={Theme.lightGrey_C}>
                            <Text
                              fontSize={width < 700 ? `14px` : `16px`}
                              width={`25%`}>
                              U$ 16
                            </Text>
                            <Text
                              fontSize={width < 700 ? `14px` : `16px`}
                              width={`25%`}
                              wordBreak={`break-word`}>
                              {/* 2022/01/22 */}

                              {data.endDate}
                              <SpanText color={Theme.red_C}>(D-5)</SpanText>
                            </Text>
                            <Text
                              fontSize={width < 700 ? `14px` : `16px`}
                              width={`25%`}>
                              {/* 작성하기 */}
                              {data.stuMemo}
                            </Text>

                            <Text
                              fontSize={width < 700 ? `14px` : `16px`}
                              width={`25%`}
                              color={
                                "출석"
                                  ? `${Theme.basicTheme_C}`
                                  : `${Theme.red_C}`
                              }>
                              {data.status ? "출석" : "결석"}
                            </Text>
                          </Wrapper>
                        );
                      })
                    )}
                  </>
                ) : (
                  <Wrapper
                    dr={`row`}
                    textAlign={`center`}
                    ju={`center`}
                    padding={`20px 0px`}>
                    <CustomCheckBox
                      onChange={(e) => onChangeBoxAllHanlder(e, checkedList)}
                    />

                    <Text
                      fontSize={width < 700 ? `14px` : `18px`}
                      fontWeight={`Bold`}
                      width={`15%`}>
                      학생명
                    </Text>
                    <Text
                      fontSize={width < 700 ? `14px` : `18px`}
                      fontWeight={`Bold`}
                      width={`10%`}>
                      출생년도
                    </Text>
                    <Text
                      fontSize={width < 700 ? `14px` : `18px`}
                      fontWeight={`Bold`}
                      width={`10%`}>
                      국가
                    </Text>
                    <Text
                      fontSize={width < 700 ? `14px` : `18px`}
                      fontWeight={`Bold`}
                      width={`15%`}>
                      수업료
                    </Text>
                    <Text
                      fontSize={width < 700 ? `14px` : `18px`}
                      fontWeight={`Bold`}
                      width={`20%`}>
                      만기일
                    </Text>
                    <Text
                      fontSize={width < 700 ? `14px` : `18px`}
                      fontWeight={`Bold`}
                      width={`10%`}>
                      메모
                    </Text>

                    <Text
                      fontSize={width < 700 ? `14px` : `18px`}
                      fontWeight={`Bold`}
                      width={`10%`}>
                      출석
                    </Text>
                  </Wrapper>
                )}

                {width > 700 && (
                  <>
                    {lectureStudentList && lectureStudentList.length === 0 ? (
                      <Wrapper>
                        <Empty description="조회된 데이터가 없습니다." />
                      </Wrapper>
                    ) : (
                      lectureStudentList &&
                      lectureStudentList.map((data, idx) => {
                        return (
                          <Wrapper
                            key={data.id}
                            dr={`row`}
                            textAlign={`center`}
                            padding={`25px 0 20px`}
                            cursor={`pointer`}
                            ju={`center`}
                            bgColor={idx % 2 === 0 && Theme.lightGrey_C}>
                            <CustomCheckBox
                              checked={
                                checkedList &&
                                checkedList[idx] &&
                                checkedList[idx].isCheck
                              }
                              onChange={(e) =>
                                onChangeBoxEachHanlder(e, idx, checkedList)
                              }
                            />
                            <Text
                              fontSize={width < 700 ? `14px` : `16px`}
                              width={`15%`}>
                              {data.username}
                            </Text>
                            <Text
                              fontSize={width < 700 ? `14px` : `16px`}
                              width={`10%`}>
                              {/* 1997 */}
                              {data.birth.slice(0, 10)}
                            </Text>
                            <Text
                              fontSize={width < 700 ? `14px` : `16px`}
                              width={`10%`}>
                              {data.stuCountry}
                            </Text>
                            <Text
                              fontSize={width < 700 ? `14px` : `16px`}
                              width={`15%`}>
                              U$ 16
                            </Text>
                            <Text
                              fontSize={width < 700 ? `14px` : `16px`}
                              width={`20%`}
                              wordBreak={`break-word`}>
                              {/* 2022/01/22 */}
                              {data.endDate}
                              <SpanText color={Theme.red_C}>(D-5)</SpanText>
                            </Text>
                            <Text
                              fontSize={width < 700 ? `14px` : `16px`}
                              width={`10%`}>
                              작성하기
                              {data.stuMemo}
                            </Text>

                            <Text
                              fontSize={width < 700 ? `14px` : `16px`}
                              width={`10%`}
                              color={
                                "출석"
                                  ? `${Theme.basicTheme_C}`
                                  : `${Theme.red_C}`
                              }>
                              {data.status ? "출석" : "결석"}
                            </Text>
                          </Wrapper>
                        );
                      })
                    )}
                  </>
                )}
              </Wrapper>
              <Wrapper al={`flex-end`} margin={`20px 0 0 0`}>
                <CommonButton
                  radius={`5px`}
                  width={width < 700 ? `100px` : `110px`}
                  height={width < 700 ? `32px` : `38px`}
                  fontSize={`14px`}
                  onClick={() => messageSendModalHandler()}>
                  쪽지 보내기
                </CommonButton>
              </Wrapper>
            </Wrapper>

            <Wrapper al={`flex-start`} margin={`86px 0 0 0`}>
              <Text
                color={Theme.black_2C}
                fontSize={width < 700 ? `18px` : `22px`}
                fontWeight={`Bold`}
                margin={`0 0 20px`}>
                강사일지
              </Text>

              <Wrapper shadow={`0px 5px 15px rgb(0,0,0,0.16)`} radius={`10px`}>
                <Wrapper dr={`row`} textAlign={`center`} padding={`20px 0`}>
                  <Text
                    fontSize={width < 700 ? `14px` : `18px`}
                    fontWeight={`Bold`}
                    width={`15%`}>
                    글번호
                  </Text>
                  <Text
                    fontSize={width < 700 ? `14px` : `18px`}
                    fontWeight={`Bold`}
                    width={`15%`}>
                    강사명
                  </Text>
                  <Text
                    fontSize={width < 700 ? `14px` : `18px`}
                    fontWeight={`Bold`}
                    width={`20%`}>
                    진도
                  </Text>
                  <Text
                    fontSize={width < 700 ? `14px` : `18px`}
                    fontWeight={`Bold`}
                    width={`25%`}>
                    수업메모
                  </Text>
                  <Text
                    fontSize={width < 700 ? `14px` : `18px`}
                    fontWeight={`Bold`}
                    width={`25%`}>
                    날짜
                  </Text>
                </Wrapper>

                {teacherDiaryArr && teacherDiaryArr.length === 0 ? (
                  <Wrapper>
                    <Empty description="조회된 데이터가 없습니다." />
                  </Wrapper>
                ) : (
                  teacherDiaryArr &&
                  teacherDiaryArr.map((data, idx) => {
                    return (
                      <Wrapper
                        key={data.id}
                        dr={`row`}
                        textAlign={`center`}
                        padding={`25px 0 20px`}
                        cursor={`pointer`}
                        bgColor={idx % 2 === 0 && Theme.lightGrey_C}>
                        <Text
                          fontSize={width < 700 ? `14px` : `16px`}
                          width={`15%`}
                          wordBreak={`break-word`}>
                          5
                        </Text>
                        <Text
                          fontSize={width < 700 ? `14px` : `16px`}
                          width={`15%`}>
                          홍길동
                        </Text>
                        <Text
                          fontSize={width < 700 ? `14px` : `16px`}
                          width={`20%`}>
                          1권 38페이지
                        </Text>
                        <Text
                          fontSize={width < 700 ? `14px` : `16px`}
                          width={`25%`}>
                          수업메모 내용입니다.
                        </Text>
                        <Text
                          fontSize={width < 700 ? `14px` : `16px`}
                          width={`25%`}>
                          2022/01/22
                        </Text>
                      </Wrapper>
                    );
                  })
                )}
              </Wrapper>
              <Wrapper al={`flex-end`} margin={`20px 0 40px`}>
                <CommonButton
                  radius={`5px`}
                  width={width < 700 ? `100px` : `110px`}
                  height={width < 700 ? `32px` : `38px`}
                  fontSize={`14px`}>
                  작성하기
                </CommonButton>
              </Wrapper>

              <Wrapper>
                <CustomPage defaultCurrent={6} total={40}></CustomPage>
              </Wrapper>
            </Wrapper>

            <Wrapper al={`flex-start`} margin={`86px 0 20px`}>
              <Text
                color={Theme.black_2C}
                fontSize={width < 700 ? `18px` : `22px`}
                fontWeight={`Bold`}>
                출석부 목록
              </Text>
            </Wrapper>

            <Wrapper al={`flex-start`}>
              <Wrapper
                position={`relative`}
                width={width < 800 ? `calc(100% - 100px - 20px)` : `500px`}
                height={`39px`}
                margin={`0 0 20px`}>
                <SearchOutlined
                  style={{
                    color: Theme.grey2_C,
                    fontSize: `20px`,
                    position: "absolute",
                    left: `15px`,
                  }}
                />
                <TextInput
                  padding={`0 0 0 55px`}
                  placeholder="학생명으로 검색"
                  radius={`25px`}
                  width={`100%`}
                  height={`50px`}
                  bgColor={Theme.lightGrey_C}
                />
              </Wrapper>
            </Wrapper>

            <Wrapper shadow={`0px 5px 15px rgb(0,0,0,0.16)`} radius={`10px`}>
              <Wrapper
                dr={`row`}
                textAlign={width < 700 ? `center` : `left`}
                padding={`20px 30px`}>
                <Text
                  fontSize={width < 700 ? `14px` : `18px`}
                  fontWeight={`Bold`}
                  width={`35%`}>
                  날짜
                </Text>
                <Text
                  fontSize={width < 700 ? `14px` : `18px`}
                  fontWeight={`Bold`}
                  width={`35%`}>
                  학생명
                </Text>
                <Text
                  fontSize={width < 700 ? `14px` : `18px`}
                  fontWeight={`Bold`}
                  width={`30%`}>
                  출석여부
                </Text>
              </Wrapper>

              <Wrapper
                dr={`row`}
                ju={`flex-start`}
                padding={`25px 30px 20px`}
                cursor={`pointer`}
                bgColor={Theme.lightGrey_C}
                textAlign={width < 700 ? `center` : `left`}
                // bgColor={idx % 2 === 1 && Theme.lightGrey_C}
              >
                <Text fontSize={width < 700 ? `14px` : `16px`} width={`35%`}>
                  2022-01-22
                </Text>
                <Text fontSize={width < 700 ? `14px` : `16px`} width={`35%`}>
                  ○○○
                </Text>
                <Text fontSize={width < 700 ? `14px` : `16px`} width={`30%`}>
                  Y
                </Text>
              </Wrapper>
            </Wrapper>

            <Wrapper al={`flex-start`}>
              <Text
                cTolor={Theme.black_2C}
                fontSize={width < 700 ? `18px` : `22px`}
                fontWeight={`Bold`}
                margin={`86px 0 20px`}>
                숙제관리
              </Text>

              <Wrapper
                dr={`row`}
                ju={`flex-start`}
                shadow={`0px 5px 15px rgb(0,0,0,0.16)`}
                margin={`0 0 10px 0`}
                padding={`20px`}
                radius={`10px`}>
                <Text width={`50%`} fontSize={width < 700 ? `14px` : `16px`}>
                  한국어로 편지 쓰기
                </Text>

                <Wrapper width={`40%`} dr={width < 1100 ? `column` : `row`}>
                  <CustomWrapper width={width < 1100 ? `100%` : `50%`}>
                    <DownloadOutlined
                      style={{
                        fontSize: width < 700 ? 15 : 25,
                        color: Theme.basicTheme_C,
                        marginRight: 10,
                        cursor: `pointer`,
                      }}
                    />

                    <Text
                      fontSize={width < 700 ? `14px` : `16px`}
                      display={width < 700 ? `none` : `block`}>
                      파일 업로드
                    </Text>
                  </CustomWrapper>

                  <CustomWrapper
                    width={width < 1100 ? `100%` : `50%`}
                    beforeBool={width < 1300 ? false : true}>
                    <CalendarOutlined
                      style={{
                        fontSize: width < 700 ? 15 : 25,
                        color: Theme.basicTheme_C,
                        marginRight: 10,
                        cursor: `pointer`,
                      }}
                    />
                    <Text fontSize={width < 700 ? `14px` : `16px`}>
                      2022/01/31까지
                    </Text>
                  </CustomWrapper>
                </Wrapper>

                <Wrapper width={`10%`} ju={`center`}>
                  <Text
                    fontSize={width < 700 ? `14px` : `16px`}
                    margin={width < 700 ? `0 0 0 5px` : "0"}
                    fontWeight={`bold`}>
                    제출 기한
                  </Text>
                </Wrapper>
              </Wrapper>

              <Wrapper
                dr={`row`}
                ju={`flex-start`}
                shadow={`0px 5px 15px rgb(0,0,0,0.16)`}
                margin={`0 0 10px 0`}
                padding={`20px`}
                radius={`10px`}>
                <Text width={`50%`} fontSize={width < 700 ? `14px` : `16px`}>
                  한국어로 편지 쓰기
                </Text>

                <Wrapper width={`40%`} dr={width < 1100 ? `column` : `row`}>
                  <CustomWrapper width={width < 1100 ? `100%` : `50%`}>
                    <DownloadOutlined
                      style={{
                        fontSize: width < 700 ? 15 : 25,
                        color: Theme.basicTheme_C,
                        marginRight: 10,
                        cursor: `pointer`,
                      }}
                    />

                    <Text
                      fontSize={width < 700 ? `14px` : `16px`}
                      display={width < 700 ? `none` : `block`}>
                      파일 업로드
                    </Text>
                  </CustomWrapper>

                  <CustomWrapper
                    width={width < 1100 ? `100%` : `50%`}
                    beforeBool={width < 1300 ? false : true}>
                    <CalendarOutlined
                      style={{
                        fontSize: width < 700 ? 15 : 25,
                        color: Theme.basicTheme_C,
                        marginRight: 10,
                        cursor: `pointer`,
                      }}
                    />
                    <Text fontSize={width < 700 ? `14px` : `16px`}>
                      2022/01/31까지
                    </Text>
                  </CustomWrapper>
                </Wrapper>

                <Wrapper width={`10%`} ju={`center`}>
                  <Text
                    fontSize={width < 700 ? `14px` : `16px`}
                    margin={width < 700 ? `0 0 0 5px` : "0"}
                    fontWeight={`bold`}>
                    제출 기한
                  </Text>
                </Wrapper>
              </Wrapper>
            </Wrapper>

            <Wrapper al={`flex-end`} margin={`20px 0 40px`}>
              <CommonButton
                radius={`5px`}
                width={width < 700 ? `100px` : `110px`}
                height={width < 700 ? `32px` : `38px`}
                fontSize={`14px`}
                onClick={() => setHomeWorkModalToggle(true)}>
                숙제 업로드
              </CommonButton>
            </Wrapper>

            <Wrapper>
              <CustomPage defaultCurrent={6} total={40}></CustomPage>
            </Wrapper>

            <Wrapper al={`flex-start`}>
              <Text
                color={Theme.black_2C}
                fontSize={width < 700 ? `18px` : `22px`}
                fontWeight={`Bold`}
                margin={`86px 0 20px`}>
                공지사항
              </Text>
            </Wrapper>

            <Wrapper shadow={`0px 5px 15px rgb(0,0,0,0.16)`} radius={`10px`}>
              <Wrapper dr={`row`} textAlign={`center`} padding={`20px 0`}>
                <Text
                  fontSize={width < 700 ? `14px` : `18px`}
                  fontWeight={`Bold`}
                  width={`15%`}>
                  글번호
                </Text>
                <Text
                  fontSize={width < 700 ? `14px` : `18px`}
                  fontWeight={`Bold`}
                  width={`60%`}>
                  제목
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
                  5
                </Text>
                <Text
                  fontSize={width < 700 ? `14px` : `16px`}
                  width={`60%`}
                  textAlign={`left`}>
                  안녕하세요. 오늘 수업 공지입니다.
                </Text>
                <Text fontSize={width < 700 ? `14px` : `16px`} width={`25%`}>
                  2022/01/22
                </Text>
              </Wrapper>
            </Wrapper>

            <Wrapper al={`flex-end`} margin={`20px 0 40px`}>
              <CommonButton
                radius={`5px`}
                width={width < 700 ? `90px` : `110px`}
                height={width < 700 ? `32px` : `38px`}
                fontSize={width < 700 ? `14px` : `14px`}
                onClick={() => setNoticeModalToggle(true)}>
                작성하기
              </CommonButton>
            </Wrapper>

            <Wrapper>
              <CustomPage defaultCurrent={6} total={40}></CustomPage>
            </Wrapper>

            <Wrapper al={`flex-start`} margin={`86px 0 20px`}>
              <Text
                color={Theme.black_2C}
                fontSize={width < 700 ? `18px` : `22px`}
                fontWeight={`Bold`}>
                쪽지함
              </Text>
            </Wrapper>

            <Wrapper>
              <Wrapper shadow={`0px 5px 15px rgb(0,0,0,0.16)`} radius={`10px`}>
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
                    width={`calc(100% - 15% - 15% - 25%)`}>
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

                {messageUserList && messageUserList.length === 0 ? (
                  <Wrapper margin={`30px 0`}>
                    <Empty description="조회된 데이터가 없습니다." />
                  </Wrapper>
                ) : (
                  messageUserList &&
                  messageUserList.map((data2, idx) => {
                    return (
                      <Wrapper
                        key={data2.id}
                        dr={`row`}
                        textAlign={`center`}
                        padding={`25px 0 20px`}
                        cursor={`pointer`}
                        bgColor={idx % 2 === 0 && Theme.lightGrey_C}
                        onClick={() => messageViewModalHanlder(data2)}>
                        <Text
                          fontSize={width < 700 ? `14px` : `16px`}
                          width={`15%`}>
                          {data2.id}
                        </Text>
                        <Text
                          fontSize={width < 700 ? `14px` : `16px`}
                          width={`calc(100% - 15% - 15% - 25%)`}
                          textAlign={`left`}>
                          {data2.title}
                        </Text>

                        <Text
                          fontSize={width < 700 ? `14px` : `16px`}
                          width={`15%`}>
                          {data2.author}
                        </Text>
                        <Text
                          fontSize={width < 700 ? `14px` : `16px`}
                          width={`25%`}>
                          {/* 2022/01/22 */}
                          {data2.createdAt.slice(0, 13)}
                        </Text>
                      </Wrapper>
                    );
                  })
                )}
              </Wrapper>

              <Wrapper margin={`110px 0`}>
                <CustomPage defaultCurrent={6} total={40}></CustomPage>
              </Wrapper>
            </Wrapper>
          </RsWrapper>
        </WholeWrapper>

        <CustomModal
          visible={false}
          width={`1350px`}
          title="공지사항"
          footer={null}
          closable={false}>
          <Wrapper dr={`row`} ju={`flex-start`} margin={`0 0 35px`}>
            <Text margin={`0 54px 0 0`}>작성자 ooo</Text>
            <Text>날짜 2022/01/22</Text>
          </Wrapper>

          <Text fontSize={`18px`} fontWeight={`bold`}>
            제목
          </Text>
          <Wrapper padding={`10px`}>
            <WordbreakText>오늘 공지사항입니다.</WordbreakText>
          </Wrapper>

          <Text fontSize={`18px`} fontWeight={`bold`}>
            내용
          </Text>
          <Wrapper padding={`10px`}>
            <WordbreakText>오늘 공지사항입니다.</WordbreakText>
          </Wrapper>

          <Wrapper>
            <CommonButton
              kindOf={`grey`}
              color={Theme.darkGrey_C}
              radius={`5px`}>
              돌아가기
            </CommonButton>
          </Wrapper>
        </CustomModal>

        <CustomModal
          visible={messageViewToggle}
          width={`1350px`}
          title="쪽지"
          footer={null}
          closable={false}>
          <CustomForm
            form={answerform}
            onFinish={(data) => answerFinishHandler(data, messageDatum)}>
            <Wrapper dr={`row`} ju={`flex-start`} margin={`0 0 35px`}>
              <Text margin={`0 54px 0 0`}>
                {messageDatum && messageDatum.author}
              </Text>
              <Text>{`날짜 ${messageDatum && messageDatum.createdAt}`}</Text>
            </Wrapper>

            <Text fontSize={`18px`} fontWeight={`bold`}>
              제목
            </Text>
            <Wrapper padding={`10px`}>
              <Form.Item
                name="messageTitle"
                rules={[{ required: true, message: "제목을 입력해주세요." }]}>
                <CusotmInput width={`100%`} />
              </Form.Item>
            </Wrapper>

            <Text fontSize={`18px`} fontWeight={`bold`}>
              내용
            </Text>
            <Wrapper padding={`10px`}>
              <Form.Item
                name="messageContent"
                rules={[{ required: true, message: "내용을 입력해주세요." }]}>
                <Input.TextArea style={{ height: `360px` }} />
              </Form.Item>
            </Wrapper>

            <Wrapper dr={`row`}>
              <CommonButton
                margin={`0 5px 0 0`}
                kindOf={`grey`}
                color={Theme.darkGrey_C}
                radius={`5px`}
                onClick={() => onReset()}>
                돌아가기
              </CommonButton>
              <CommonButton
                margin={`0 0 0 5px`}
                radius={`5px`}
                htmlType="submit">
                답변하기
              </CommonButton>
            </Wrapper>
          </CustomForm>
        </CustomModal>

        <CustomModal
          visible={messageSendModalToggle}
          width={`1350px`}
          title={
            adminSendMessageToggle ? "관리자에게 쪽지 보내기" : "강사에게 쪽지"
          }
          footer={null}
          closable={false}>
          <CustomForm
            ref={formRef}
            form={form}
            onFinish={
              adminSendMessageToggle
                ? sendMessageAdminFinishHandler
                : noteSendFinishHandler
            }>
            <Wrapper al={`flex-end`}>
              <CommonButton
                margin={`0 0 0 5px`}
                radius={`5px`}
                width={`100px`}
                height={`32px`}
                size="small"
                onClick={() => adminSendMessageToggleHandler()}>
                {!adminSendMessageToggle ? " 관라자에게" : "학생에게"}
              </CommonButton>
            </Wrapper>

            {!adminSendMessageToggle && (
              <Text
                fontSize={width < 700 ? `14px` : `18px`}
                fontWeight={`bold`}
                margin={`0 0 10px`}>
                받는 사람
              </Text>
            )}

            {!adminSendMessageToggle && (
              <Wrapper al={`flex-start`} margin={`15px 0`}>
                {checkedList && checkedList.length === 0 ? (
                  <Wrapper>
                    <Empty description="단체로 선택하신 박스가 없습니다." />
                  </Wrapper>
                ) : (
                  <Wrapper dr={`row`} width={`auto`} ju={`flex-start`}>
                    {checkedList &&
                      checkedList.map((data, idx) => {
                        return (
                          <Text margin={`0 5px 0`} color={Theme.basicTheme_C}>
                            {data.username}
                          </Text>
                        );
                      })}
                  </Wrapper>
                )}
              </Wrapper>
            )}

            <Text
              fontSize={width < 700 ? `14px` : `18px`}
              fontWeight={`bold`}
              margin={`0 0 10px`}>
              제목
            </Text>
            <Form.Item name="title1" rules={[{ required: true }]}>
              <CusotmInput width={`100%`} />
            </Form.Item>
            <Text
              fontSize={width < 700 ? `14px` : `18px`}
              fontWeight={`bold`}
              margin={`0 0 10px`}>
              내용
            </Text>
            <Form.Item name="content1" rules={[{ required: true }]}>
              <Input.TextArea style={{ height: `360px` }} />
            </Form.Item>
            <Wrapper dr={`row`}>
              <CommonButton
                margin={`0 5px 0 0`}
                kindOf={`grey`}
                color={Theme.darkGrey_C}
                radius={`5px`}
                onClick={() => onReset()}>
                돌아가기
                {/* cancelNoteSendHanlder() */}
              </CommonButton>
              <CommonButton
                margin={`0 0 0 5px`}
                radius={`5px`}
                htmlType="submit">
                쪽지 보내기
              </CommonButton>
            </Wrapper>
          </CustomForm>
        </CustomModal>

        <CustomModal
          visible={noticeModalToggle}
          width={`1350px`}
          title="공지사항 글 작성하기"
          footer={null}
          closable={false}>
          <CustomForm ref={formRef} form={form} onFinish={noticeFinishHandler}>
            <Text
              fontSize={width < 700 ? `14px` : `18px`}
              fontWeight={`bold`}
              margin={`0 0 10px`}>
              제목
            </Text>
            <Form.Item name="title2" rules={[{ required: true }]}>
              <CusotmInput width={`100%`} />
            </Form.Item>
            <Text
              fontSize={width < 700 ? `14px` : `18px`}
              fontWeight={`bold`}
              margin={`0 0 10px`}>
              내용
            </Text>
            <Form.Item name="content2" rules={[{ required: true }]}>
              <Input.TextArea style={{ height: `360px` }} />
            </Form.Item>
            <Wrapper dr={`row`}>
              <CommonButton
                margin={`0 5px 0 0`}
                kindOf={`grey`}
                color={Theme.darkGrey_C}
                radius={`5px`}
                onClick={() => onReset()}>
                돌아가기
              </CommonButton>
              <CommonButton
                margin={`0 0 0 5px`}
                radius={`5px`}
                htmlType="submit">
                답변하기
              </CommonButton>
            </Wrapper>
          </CustomForm>
        </CustomModal>

        <CustomModal
          visible={homeWorkModalToggle}
          width={`1350px`}
          title="숙제 업로드"
          footer={null}
          closable={false}>
          <CustomForm
            ref={formRef}
            form={form}
            onFinish={homeWorkFinishHandler}>
            <Text
              fontSize={width < 700 ? `14px` : `18px`}
              fontWeight={`bold`}
              margin={`0 0 10px`}>
              제목
            </Text>
            <Form.Item name="title3" rules={[{ required: true }]}>
              <CusotmInput placeholder="" />
            </Form.Item>
            <Text
              fontSize={width < 700 ? `14px` : `18px`}
              fontWeight={`bold`}
              margin={`0 0 10px`}>
              날짜
            </Text>
            <Form.Item name="date" rules={[{ required: true }]}>
              <Wrapper dr={`row`} ju={`flex-start`}>
                <CusotmInput
                  placeholder="날짜를 선택해주세요."
                  value={inputDate.value}
                  style={{
                    height: `40px`,
                    width: `130px`,
                    margin: `0 10px 0 0`,
                  }}
                  disabled
                />

                <CalendarOutlined
                  style={{
                    cursor: `pointer`,
                    fontSize: 25,
                    position: `relative`,
                  }}
                  onClick={() => setIsCalendar(!isCalendar)}
                />

                <Wrapper
                  display={isCalendar ? "flex" : "none"}
                  width={`auto`}
                  position={width < 1350 ? `static` : `absolute`}
                  right={`0`}
                  border={`1px solid ${Theme.grey_C}`}
                  margin={`0 0 20px`}>
                  <Calendar
                    style={{ width: width < 1350 ? `100%` : `300px` }}
                    fullscreen={false}
                    onChange={dateChagneHandler}
                  />
                </Wrapper>
              </Wrapper>
            </Form.Item>

            <Text fontSize={width < 700 ? `14px` : `18px`} fontWeight={`bold`}>
              파일 업로드
            </Text>
            <Form.Item name="file" rules={[{ required: true }]}>
              <Upload>
                <Button
                  icon={<UploadOutlined />}
                  style={{ height: `40px`, width: `150px`, margin: `10px 0 0` }}
                  onChange={(e) => console.log(e)}>
                  파일 업로드
                </Button>
              </Upload>
            </Form.Item>
            <Wrapper dr={`row`}>
              <CommonButton
                margin={`0 5px 0 0`}
                kindOf={`grey`}
                color={Theme.darkGrey_C}
                radius={`5px`}
                onClick={() => onReset()}>
                돌아가기
              </CommonButton>
              <CommonButton
                margin={`0 0 0 5px`}
                radius={`5px`}
                htmlType="submit">
                답변하기
              </CommonButton>
            </Wrapper>
          </CustomForm>
        </CustomModal>
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
      type: MESSAGE_USER_LIST_REQUEST,
    });

    // 구현부 종료
    context.store.dispatch(END);
    console.log("🍀 SERVER SIDE PROPS END");
    await context.store.sagaTask.toPromise();
  }
);

export default Index;
