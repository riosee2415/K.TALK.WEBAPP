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
  Badge,
  Table,
  Button,
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
  ATag,
} from "../../components/commonComponents";
import Theme from "../../components/Theme";
import {
  MESSAGE_ALL_LIST_REQUEST,
  MESSAGE_CREATE_REQUEST,
  MESSAGE_FOR_ADMIN_CREATE_REQUEST,
  MESSAGE_PART_LIST_REQUEST,
  MESSAGE_TEACHER_LIST_REQUEST,
  MESSAGE_USER_LIST_REQUEST,
} from "../../reducers/message";

import {
  NOTICE_LIST_REQUEST,
  NOTICE_MY_LECTURE_LIST_REQUEST,
} from "../../reducers/notice";
import { LECTURE_STU_LECTURE_LIST_REQUEST } from "../../reducers/lecture";
import { FileDoneOutlined, RollbackOutlined } from "@ant-design/icons";
import { saveAs } from "file-saver";
import { BOOK_LECTURE_LIST_REQUEST } from "../../reducers/book";

const CustomButton = styled(Button)`
  font-size: 16px;
  height: 26px;

  @media (max-width: 700px) {
    font-size: 14px;

    height: 24px;
  }
`;

const BackIcon = styled(Wrapper)`
  cursor: pointer;
  transition: 0.5s;
  & .anticon-rollback {
    font-size: 30px;
    color: ${Theme.black_C};
  }

  &:hover {
    & .anticon-rollback {
      font-size: 30px;
      color: ${Theme.grey2_C};
    }
    color: ${Theme.grey2_C};
  }
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
  text-align: center;
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

const CustomModal = styled(Modal)`
  & .ant-modal-header,
  & .ant-modal-content {
    border-radius: 5px;
  }

  & .ant-modal-title {
    font-size: 20px;
    font-weight: bold;
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

const WordbreakText = styled(Text)`
  width: 100%;
  word-wrap: break-all;
`;

const LectureAll = () => {
  ////// GLOBAL STATE //////

  const { seo_keywords, seo_desc, seo_ogImage, seo_title } = useSelector(
    (state) => state.seo
  );
  const {
    me,
    //
  } = useSelector((state) => state.user);

  const {
    messageTeacherList,
    st_messageTeacherListDone,
    st_messageTeacherListError,

    st_messageCreateDone,
    st_messageCreateError,

    st_messageForAdminCreateDone,
    st_messageForAdminCreateError,

    messagePartList,
    messagePartLastPage,
    st_messagePartListDone,
    st_messagePartListError,

    messageAllList,
    messageAllLastPage,
    st_messageAllListDone,
    st_messageAllListError,
  } = useSelector((state) => state.message);

  const {
    lectureStuLectureList,
    st_lectureStuLectureListDone,
    st_lectureStuLectureListError,
  } = useSelector((state) => state.lecture);

  const {
    noticeMyLectureList,
    noticeMyLectureLastPage,

    st_noticeMyLectureListDone,
    st_noticeMyLectureListError,
  } = useSelector((state) => state.notice);

  const { bookLecture, st_bookLectureListDone, st_bookLectureListError } =
    useSelector((state) => state.book);

  ////// HOOKS //////
  const width = useWidth();
  const router = useRouter();
  const dispatch = useDispatch();

  const formRef = useRef();

  const [form] = Form.useForm();
  const [answerform] = Form.useForm();
  const [sendform] = Form.useForm();

  const [sendMessageType, setSendMessageType] = useState(1);
  const [messageSendModal, setMessageSendModal] = useState(false);
  const [messageViewModal, setMessageViewModal] = useState(false);
  const [messageAnswerModal, setMessageAnswerModal] = useState(false);
  const [messageAnswerAdminModal, setMessageAnswerAdminModal] = useState(false);

  const [messageDatum, setMessageDatum] = useState();

  const [noticeViewModal, setNoticeViewModal] = useState(false);
  const [noticeViewDatum, setNoticeViewDatum] = useState(null);

  const [currentPage1, setCurrentPage1] = useState(1);
  const [currentPage2, setCurrentPage2] = useState(1);
  const [currentPage3, setCurrentPage3] = useState(1);
  const [currentPage4, setCurrentPage4] = useState(1);

  const [detailBook, setDetailBook] = useState(null);
  const [bookModal, setBookModal] = useState(false);

  const [lectureId, setLectureId] = useState("");

  const [selectValue, setSelectValue] = useState("");

  const bookColumns = [
    {
      title: "No",
      dataIndex: "id",
    },
    {
      title: "이미지",
      render: (data) => {
        return (
          <Wrapper width={`100px`}>
            <Image src={data.Book.thumbnail} alt={`thumbnail`} />
          </Wrapper>
        );
      },
    },
    {
      title: "제목",
      render: (data) => {
        return <Text>{data.Book.title}</Text>;
      },
    },

    {
      title: "다운로드",
      render: (data) => {
        return (
          <Button
            type={`primary`}
            size={`small`}
            onClick={() => fileDownloadHandler(data.Book.file)}>
            다운로드
          </Button>
        );
      },
    },
  ];

  ////// USEEFFECT //////

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    dispatch({
      type: MESSAGE_ALL_LIST_REQUEST,
    });
  }, []);

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
    if (st_messageCreateError) {
      return message.error(st_messageCreateError);
    }
  }, [st_messageCreateError]);

  useEffect(() => {
    if (st_bookLectureListDone) {
      setDetailBook(bookLecture);
      setBookModal(true);
    }
  }, [st_bookLectureListDone]);

  useEffect(() => {
    if (st_bookLectureListError) {
      return message.error(st_bookLectureListError);
    }
  }, [st_bookLectureListError]);

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

    dispatch({
      type: NOTICE_MY_LECTURE_LIST_REQUEST,
      data: {
        page: 1,
      },
    });

    dispatch({
      type: MESSAGE_PART_LIST_REQUEST,
      data: {
        page: 1,
      },
    });
  }, []);

  useEffect(() => {
    if (st_noticeMyLectureListError) {
      onReset();

      return message.error(st_noticeMyLectureListError);
    }
  }, [st_noticeMyLectureListError]);

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

  useEffect(() => {
    if (st_lectureStuLectureListError) {
      return message.error(st_lectureStuLectureListError);
    }
  }, []);

  useEffect(() => {
    if (st_messagePartListError) {
      return message.error(st_messagePartListError);
    }
  }, [st_messagePartListError]);

  useEffect(() => {
    if (st_messageAllListError) {
      return message.error(st_messageAllListError);
    }
  }, [st_messageAllListError]);

  const onReset = useCallback(() => {
    form.resetFields();
    answerform.resetFields();
    sendform.resetFields();

    setSendMessageType(1);
    setMessageViewModal(false);
    setMessageAnswerModal(false);
    setMessageAnswerAdminModal(false);
    setMessageSendModal(false);

    setNoticeViewModal(false);
    setNoticeViewDatum(null);
  }, []);

  ////// TOGGLE //////

  const messageSendModalHandler = useCallback((data, num) => {
    setMessageSendModal((prev) => !prev);

    if (num === 1) {
      setSendMessageType(3);
    }

    setMessageDatum(data);
  }, []);

  ////// HANDLER //////

  const receiveLectureIdtHandler = useCallback((value) => {
    setLectureId(value);
  }, []);

  const onClickNoticeHandler = useCallback((data) => {
    setNoticeViewDatum(data);
    setNoticeViewModal(true);
  }, []);

  const sendMessageFinishHandler = useCallback(
    (data) => {
      dispatch({
        type: MESSAGE_CREATE_REQUEST,
        data: {
          title: data.title,
          author: me.username,
          senderId: me.id,
          receiverId: messageDatum.UserId,
          content: data.content,
          level: 2,
        },
      });
    },
    [me, messageDatum]
  );

  const sendMessageLectureFinishHanlder = useCallback(
    (data) => {
      dispatch({
        type: MESSAGE_CREATE_REQUEST,
        data: {
          title: data.title,
          author: me.username,
          senderId: me.id,
          receiverId: messageDatum.UserId,
          receiveLectureId: messageDatum.id,
          content: data.content,
          level: 2,
        },
      });
    },
    [messageDatum, me]
  );

  const sendMessageAdminFinishHandler = useCallback(
    (data) => {
      dispatch({
        type: MESSAGE_FOR_ADMIN_CREATE_REQUEST,
        data: {
          title: data.title,
          author: me.username,
          content: data.content,
        },
      });
    },
    [me]
  );

  const sendMessageTypeHandler = useCallback((num) => {
    setSendMessageType(num);
  }, []);

  const DDay = useCallback((startDate, endDate, count, lecDate, day) => {
    let dir = 0;

    let startDay = moment
      .duration(moment(startDate).diff(moment().format("YYYY-MM-DD")))
      .asDays();

    let endDay = moment
      .duration(moment(endDate).diff(moment().format("YYYY-MM-DD")))
      .asDays();

    let diff = moment
      .duration(moment(endDate).diff(moment(startDate)))
      .asDays();

    if (startDay < 0 && endDay < 0) {
      return 0;
    } else if (startDay > 0) {
      const arr = ["일", "월", "화", "수", "목", "금", "토"];
      let add = 0;

      for (let i = 0; i < diff; i++) {
        let saveDay = moment(startDate)
          .add(i + 1, "days")
          .day();

        const saveResult = day.includes(arr[saveDay]);

        if (saveResult) {
          add += 1;
        }
      }

      return add;
    } else {
      const arr = ["일", "월", "화", "수", "목", "금", "토"];
      let add = 0;

      for (let i = 0; i < endDay; i++) {
        let saveDay = moment(startDate)
          .add(i + 1, "days")
          .day();

        const saveResult = day.includes(arr[saveDay]);

        if (saveResult) {
          add += 1;
        }
      }

      return add;
    }

    // const save = Math.abs(
    //   moment.duration(moment().diff(moment(startDate, "YYYY-MM-DD"))).asDays() -
    //     1
    // );

    // let check = parseInt(
    //   moment
    //     .duration(moment(endDate).diff(moment(startDate, "YYYY-MM-DD")))
    //     .asDays() + 1
    // );

    // if (save >= check) {
    //   dir = check;
    // } else {
    //   dir = save;
    // }

    // const arr = ["일", "월", "화", "수", "목", "금", "토"];
    // let add = 0;

    // for (let i = 0; i < dir; i++) {
    //   let saveDay = moment(startDate)
    //     .add(i + 1, "days")
    //     .day();

    //   const saveResult = day.includes(arr[saveDay]);

    //   if (saveResult) {
    //     add += 1;
    //   }
    // }

    // return add;
  }, []);

  const stepHanlder = useCallback((startDate, endDate, count, lecDate, day) => {
    let dir = 0;

    const save = Math.abs(
      moment.duration(moment().diff(moment(startDate, "YYYY-MM-DD"))).asDays() -
        1
    );

    let check = parseInt(
      moment
        .duration(moment(endDate).diff(moment(startDate, "YYYY-MM-DD")))
        .asDays() + 1
    );

    if (save >= check) {
      dir = check;
    } else {
      dir = save;
    }

    const arr = ["일", "월", "화", "수", "목", "금", "토"];
    let add = 0;

    for (let i = 0; i < dir; i++) {
      let saveDay = moment(startDate)
        .add(i + 1, "days")
        .day();

      const saveResult = day.includes(arr[saveDay]);

      if (saveResult) {
        add += 1;
      }
    }

    return parseInt((add / (count * lecDate)) * 100);
  }, []);

  const stepHanlder2 = useCallback(
    (startDate, endDate, count, lecDate, day) => {
      let dir = 0;

      const save = Math.abs(
        moment
          .duration(moment().diff(moment(startDate, "YYYY-MM-DD")))
          .asDays() - 1
      );

      let check = parseInt(
        moment
          .duration(moment(endDate).diff(moment(startDate, "YYYY-MM-DD")))
          .asDays() + 1
      );

      if (save >= check) {
        dir = check;
      } else {
        dir = save;
      }

      const arr = ["일", "월", "화", "수", "목", "금", "토"];
      let add = 0;

      for (let i = 0; i < dir; i++) {
        let saveDay = moment(startDate)
          .add(i + 1, "days")
          .day();

        const saveResult = day.includes(arr[saveDay]);

        if (saveResult) {
          add += 1;
        }
      }

      return add;
    },
    []
  );

  const messageViewModalHandler = useCallback((data) => {
    setMessageViewModal((prev) => !prev);

    setMessageDatum(data);
  }, []);

  const noticeChangePage = useCallback((page) => {
    setCurrentPage2(page);

    dispatch({
      type: NOTICE_MY_LECTURE_LIST_REQUEST,
      data: {
        page,
      },
    });
  }, []);

  const messageChangePage = useCallback((page) => {
    dispatch({
      type: MESSAGE_PART_LIST_REQUEST,
      data: {
        page,
      },
    });
  }, []);

  const allmessageChangePage = useCallback((page) => {
    dispatch({
      type: MESSAGE_ALL_LIST_REQUEST,
      data: {
        page,
      },
    });
  }, []);

  const detailBookClose = useCallback(() => {
    setDetailBook(null);
    setBookModal(false);
  }, []);

  const detailBookOpen = useCallback(
    (data) => {
      dispatch({
        type: BOOK_LECTURE_LIST_REQUEST,
        data: {
          LectureId: data.id,
        },
      });
    },
    [bookLecture]
  );

  const fileDownloadHandler = useCallback(async (filePath) => {
    let blob = await fetch(filePath).then((r) => r.blob());

    const file = new Blob([blob]);

    const ext = filePath.substring(
      filePath.lastIndexOf(".") + 1,
      filePath.length
    );

    const originName = `첨부파일.${ext}`;

    saveAs(file, originName);
  }, []);

  const moveBackHandler = useCallback(() => {
    router.back();
  }, []);

  const divideLecture = useCallback((day, time) => {
    let saveDay = day.split(" ");
    let saveTime = time.split(" ");

    let textSave = "";

    saveDay.map((data, idx) => {
      if (idx === saveDay.length - 1) {
        textSave += `${data} ${saveTime[idx]}`;
      } else {
        textSave += `${data} ${saveTime[idx]} | `;
      }
    });

    return textSave;
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
            <Wrapper dr={`row`} ju={`space-between`}>
              <Wrapper
                margin={width < 700 ? `30px 0` : `60px 0`}
                dr={`row`}
                ju={`space-between`}
                width={`auto`}>
                <Wrapper width={`auto`} dr={`row`} ju={`flex-start`}>
                  <Wrapper
                    width={`auto`}
                    padding={`9px`}
                    bgColor={Theme.white_C}>
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
                    <SpanText
                      color={Theme.basicTheme_C}
                      wordBreak={`break-all`}>
                      {me && me.username}
                    </SpanText>
                    님!
                  </Text>
                </Wrapper>
              </Wrapper>
              <BackIcon width={`auto`} onClick={moveBackHandler}>
                <RollbackOutlined />
                <Text>뒤로가기</Text>
              </BackIcon>
            </Wrapper>

            <Wrapper
              al={`flex-start`}
              margin={width < 700 ? `20px 0 10px` : `0 0 20px`}>
              <Text
                fontSize={width < 800 ? `18px` : `22px`}
                fontWeight={`bold`}>
                강의 공지사항
              </Text>
            </Wrapper>

            <Wrapper
              radius={`10px`}
              shadow={`0px 2px 4px rgba(0, 0, 0, 0.16)`}
              margin={`0 0 60px`}>
              <Wrapper
                dr={`row`}
                fontWeight={`bold`}
                padding={`20px 0`}
                fontSize={width < 800 ? `14px` : `18px`}>
                <Wrapper width={width < 800 ? `15%` : `10%`}>번호</Wrapper>
                <Wrapper width={width < 800 ? `45%` : `70%`}>제목</Wrapper>
                <Wrapper width={width < 800 ? `15%` : `10%`}>작성자</Wrapper>
                <Wrapper width={width < 800 ? `25%` : `10%`}>날짜</Wrapper>
              </Wrapper>
              {noticeMyLectureList &&
                (noticeMyLectureList.length === 0 ? (
                  <Wrapper margin={`50px 0`}>
                    <Empty description="공지사항이 없습니다." />
                  </Wrapper>
                ) : (
                  noticeMyLectureList.map((data, idx) => {
                    return (
                      <CustomTableHoverWrapper
                        onClick={() => onClickNoticeHandler(data)}
                        key={data.id}
                        bgColor={idx % 2 === 0}>
                        <Wrapper width={width < 800 ? `15%` : `10%`}>
                          {data.id}
                        </Wrapper>
                        <Wrapper
                          width={width < 800 ? `45%` : `70%`}
                          al={`flex-start`}
                          padding={`0 0 0 10px`}>
                          {data.title}
                        </Wrapper>
                        <Wrapper width={width < 800 ? `15%` : `10%`}>
                          {data.author}
                        </Wrapper>
                        <Wrapper width={width < 800 ? `25%` : `10%`}>
                          {moment(data.createdAt, "YYYY/MM/DD").format(
                            "YYYY/MM/DD"
                          )}
                        </Wrapper>
                      </CustomTableHoverWrapper>
                    );
                  })
                ))}
            </Wrapper>
            <CustomPage
              size="small"
              current={currentPage2}
              total={noticeMyLectureLastPage * 10}
              onChange={(page) => noticeChangePage(page)}
            />

            <Wrapper al={`flex-start`} margin={`0 0 20px`}>
              <Text
                fontSize={width < 800 ? `18px` : `22px`}
                fontWeight={`bold`}>
                관리자 강의 쪽지함
              </Text>

              <Text fontSize={width < 800 ? `14px` : `18px`}>
                관리자에서 강의 단위로 보낸 쪽지 목록 입니다.
              </Text>
            </Wrapper>

            <Wrapper radius={`10px`} shadow={`0px 2px 4px rgba(0, 0, 0, 0.16)`}>
              <Wrapper
                dr={`row`}
                fontWeight={`bold`}
                padding={`20px 0`}
                fontSize={width < 800 ? `14px` : `18px`}>
                <Wrapper width={width < 800 ? `15%` : `10%`}>번호</Wrapper>
                <Wrapper width={width < 800 ? `45%` : `70%`}>제목</Wrapper>
                <Wrapper width={width < 800 ? `15%` : `10%`}>작성자</Wrapper>
                <Wrapper width={width < 800 ? `25%` : `10%`}>날짜</Wrapper>
              </Wrapper>
              {messagePartList &&
                (messagePartList.length === 0 ? (
                  <Wrapper margin={`50px 0`}>
                    <Empty description="내게 온 쪽지가 없습니다." />
                  </Wrapper>
                ) : (
                  messagePartList.map((data, idx) => {
                    return (
                      <CustomTableHoverWrapper
                        key={data.id}
                        bgColor={idx % 2 === 0}
                        onClick={() => messageViewModalHandler(data)}>
                        <Wrapper width={width < 800 ? `15%` : `10%`}>
                          {data.id}
                        </Wrapper>
                        <Wrapper
                          width={width < 800 ? `45%` : `70%`}
                          al={`flex-start`}
                          padding={`0 0 0 10px`}>
                          {data.title}
                        </Wrapper>
                        <Wrapper width={width < 800 ? `15%` : `10%`}>
                          {data.author}
                        </Wrapper>
                        <Wrapper width={width < 800 ? `25%` : `10%`}>
                          {moment(data.createdAt, "YYYY/MM/DD").format(
                            "YYYY/MM/DD"
                          )}
                        </Wrapper>
                      </CustomTableHoverWrapper>
                    );
                  })
                ))}
            </Wrapper>

            <Wrapper margin={`60px 0`}>
              <CustomPage
                size="small"
                current={currentPage3}
                total={messagePartLastPage * 10}
                onChange={(page) => messageChangePage(page)}
              />
            </Wrapper>

            <Wrapper al={`flex-start`} margin={`0 0 20px`}>
              <Text
                fontSize={width < 800 ? `18px` : `22px`}
                fontWeight={`bold`}>
                전체 쪽지 및 학생
              </Text>
            </Wrapper>

            <Wrapper radius={`10px`} shadow={`0px 2px 4px rgba(0, 0, 0, 0.16)`}>
              <Wrapper
                dr={`row`}
                fontWeight={`bold`}
                padding={`20px 0`}
                fontSize={width < 800 ? `14px` : `18px`}>
                <Wrapper width={width < 800 ? `15%` : `10%`}>번호</Wrapper>
                <Wrapper width={width < 800 ? `45%` : `70%`}>제목</Wrapper>
                <Wrapper width={width < 800 ? `15%` : `10%`}>작성자</Wrapper>
                <Wrapper width={width < 800 ? `25%` : `10%`}>날짜</Wrapper>
              </Wrapper>
              {messageAllList &&
                (messageAllList.length === 0 ? (
                  <Wrapper margin={`50px 0`}>
                    <Empty description="내게 온 쪽지가 없습니다." />
                  </Wrapper>
                ) : (
                  messageAllList.map((data, idx) => {
                    return (
                      <CustomTableHoverWrapper
                        key={data.id}
                        bgColor={idx % 2 === 0}
                        onClick={() => messageViewModalHandler(data)}>
                        <Wrapper width={width < 800 ? `15%` : `10%`}>
                          {data.id}
                        </Wrapper>
                        <Wrapper
                          width={width < 800 ? `45%` : `70%`}
                          al={`flex-start`}
                          padding={`0 0 0 10px`}>
                          {data.title}
                        </Wrapper>
                        <Wrapper width={width < 800 ? `15%` : `10%`}>
                          {data.author}
                        </Wrapper>
                        <Wrapper width={width < 800 ? `25%` : `10%`}>
                          {moment(data.createdAt, "YYYY/MM/DD").format(
                            "YYYY/MM/DD"
                          )}
                        </Wrapper>
                      </CustomTableHoverWrapper>
                    );
                  })
                ))}
            </Wrapper>

            <Wrapper margin={`60px 0`}>
              <CustomPage
                size="small"
                current={currentPage4}
                total={messageAllLastPage * 10}
                onChange={(page) => allmessageChangePage(page)}
              />
            </Wrapper>

            <Wrapper al={`flex-start`} margin={`0 0 20px`}>
              <Text
                fontSize={width < 800 ? `18px` : `22px`}
                fontWeight={`bold`}>
                내 강의정보
              </Text>
            </Wrapper>

            {lectureStuLectureList && lectureStuLectureList.length === 0 ? (
              <Wrapper margin={`50px 0`}>
                <Empty description="조회된 리스트가 없습니다." />
              </Wrapper>
            ) : (
              lectureStuLectureList &&
              lectureStuLectureList.map((data, idx) => {
                return (
                  <Wrapper
                    key={data.id}
                    dr={`row`}
                    padding={width < 800 ? `10px` : `30px`}
                    bgColor={Theme.white_C}
                    radius={`10px`}
                    ju={`space-between`}
                    shadow={`0px 5px 15px rgba(0, 0, 0, 0.16)`}
                    margin={
                      lectureStuLectureList.length - 1 ? `0 0 70px` : `0 0 60px`
                    }
                    al={width < 1100 && `flex-start`}>
                    <Wrapper
                      width={width < 800 ? `calc(100%)` : `calc(100%)`}
                      position={`relative`}>
                      <Wrapper dr={`row`}>
                        <Wrapper
                          width={width < 1100 ? `100%` : `calc(70% - 1px)`}>
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
                              src={
                                data.User.profileImage
                                  ? data.User.profileImage
                                  : "https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/img_default-profile_big.png"
                              }
                              alt="student_thumbnail"
                            />
                            <Wrapper
                              margin={
                                width < 800 ? `0 0 0 100px` : `0 0 0 204px`
                              }>
                              <Wrapper dr={`row`} ju={`flex-start`}>
                                <Text
                                  margin={`0 10px 0 0`}
                                  fontSize={width < 800 ? `16px` : `18px`}
                                  fontWeight={`bold`}>
                                  강의명
                                </Text>
                                <Text margin={`0 10px 0 0`}>{data.course}</Text>
                              </Wrapper>

                              <Wrapper
                                dr={`row`}
                                ju={`flex-start`}
                                color={Theme.grey2_C}
                                fontSize={width < 800 ? `14px` : `16px`}>
                                <Text lineHeight={`1.19`}>
                                  {data.User.username}
                                </Text>
                                <Text
                                  lineHeight={`1.19`}
                                  margin={width < 800 ? `5px` : `0 10px`}>
                                  |
                                </Text>
                                <Text lineHeight={`1.19`}>
                                  {`강의 수 : ${stepHanlder2(
                                    data.startDate,
                                    data.endDate,
                                    data.count,
                                    data.lecDate,
                                    data.day
                                  )} / ${data.lecDate * data.count}`}
                                </Text>

                                {/* <Text
                                  lineHeight={`1.19`}
                                  margin={width < 800 ? `5px` : `0 10px`}>
                                  |
                                </Text>
                                <Text lineHeight={`1.19`}>
                                  등록상황 : 수료중
                                </Text> */}
                              </Wrapper>

                              <Wrapper
                                dr={`row`}
                                ju={`flex-start`}
                                color={Theme.grey2_C}
                                margin={width < 800 ? `5px 0 0 0` : `5px 0`}>
                                <Wrapper
                                  width={`auto`}
                                  dr={`row`}
                                  margin={width < 700 ? `0` : `0 10px 0 0`}>
                                  <Image
                                    width={`18px`}
                                    height={`18px`}
                                    margin={`0 5px 0 0`}
                                    src="https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_calender_y.png"
                                    alt="clender_icon"
                                  />

                                  <Text
                                    fontSize={width < 700 ? `14px` : `16px`}>
                                    {`${moment(
                                      data.startDate,
                                      "YYYY/MM/DD"
                                    ).format("YYYY/MM/DD")} ~ ${moment(
                                      data.endDate,
                                      "YYYY/MM/DD"
                                    ).format("YYYY/MM/DD")}`}

                                    <SpanText
                                      fontWeight={`bold`}
                                      color={Theme.red_C}
                                      margin={`0 0 0 15px`}>
                                      {/* D-{DDay(data.startDate, data.endDate)} */}
                                      {DDay(
                                        data.startDate,
                                        data.endDate,
                                        data.count,
                                        data.lecDate,
                                        data.day
                                      )}
                                      회
                                    </SpanText>
                                  </Text>
                                </Wrapper>

                                <Wrapper
                                  width={`auto`}
                                  dr={`row`}
                                  ju={`flex-start`}
                                  margin={`5px 0 0 0`}
                                  color={Theme.grey2_C}>
                                  <Wrapper width={`auto`} margin={`0 5px 0 0`}>
                                    <Image
                                      width={`16px`}
                                      height={`16px`}
                                      src="https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_clock.png"
                                      alt="clock_icon"
                                    />
                                  </Wrapper>

                                  <Text
                                    fontSize={width < 800 ? `14px` : `16px`}
                                    lineHeight={`1.22`}>
                                    {divideLecture(data.day, data.time)}
                                  </Text>
                                </Wrapper>
                              </Wrapper>

                              <Wrapper
                                ju={`flex-start`}
                                margin={width < 700 ? `10px 0 0` : `5px 0 0`}
                                color={Theme.grey2_C}>
                                <Wrapper
                                  al={`flex-start`}
                                  fontSize={width < 800 ? `14px` : `16px`}
                                  lineHeight={`1.22`}>
                                  {data.startLv}
                                </Wrapper>
                              </Wrapper>

                              <Wrapper
                                dr={`row`}
                                ju={`space-between`}
                                margin={`5px 0 0`}>
                                <Wrapper dr={`row`} width={`auto`}>
                                  <Image
                                    margin={`0 5px 0 0`}
                                    width={`18px`}
                                    height={`auto`}
                                    src="https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_name.png"
                                    alt="clender_icon"
                                  />
                                  <Text
                                    fontSize={width < 700 ? `14px` : `18px`}>
                                    {data.User.username}
                                  </Text>
                                </Wrapper>

                                <CustomButton
                                  type={`primary`}
                                  size={`small`}
                                  onClick={() =>
                                    window.open(`${data.zoomLink}`, "_blank")
                                  }>
                                  강의 이동
                                </CustomButton>
                              </Wrapper>
                            </Wrapper>
                            <Wrapper
                              margin={
                                width < 800 ? `40px 0 0` : `35px 0 0  204px`
                              }>
                              <Wrapper dr={`row`} ju={`flex-start`}>
                                <Text width={width < 800 ? `100%` : `15%`}>
                                  <SpanText color={Theme.subTheme2_C}>
                                    ●
                                  </SpanText>
                                  &nbsp; 출석 상황
                                </Text>
                                <Wrapper width={width < 800 ? `80%` : `75%`}>
                                  <CustomSlide
                                    value={
                                      data.Commutes &&
                                      (data.Commutes.length * 100) /
                                        (data.lecDate * data.count)
                                    }
                                    disabled={true}
                                    draggableTrack={true}
                                    bgColor={Theme.subTheme2_C}
                                  />
                                </Wrapper>
                                <Text
                                  width={`10%`}
                                  color={Theme.grey2_C}
                                  padding={`0 0 0 10px`}>
                                  {`(${parseInt(
                                    data.Commutes &&
                                      (data.Commutes.length * 100) /
                                        (data.lecDate * data.count)
                                  )}%)`}
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
                          al={`flex-start`}
                          width={width < 1100 ? `100%` : `calc(30% - 80px)`}
                          margin={
                            width < 1100 && width < 800
                              ? `10px 0 0`
                              : `20px 0 0`
                          }>
                          <Wrapper
                            borderBottom={`1px dashed ${Theme.grey_C}`}
                            dr={`row`}
                            al={`flex-start`}
                            ju={`flex-start`}
                            padding={width < 800 ? `8px 0` : `16px 0`}>
                            <Text
                              cursor={`pointer`}
                              onClick={() => messageSendModalHandler(data)}>
                              수료증 신청
                            </Text>
                            <Text> | </Text>
                            <Text
                              cursor={`pointer`}
                              onClick={() => messageSendModalHandler(data)}>
                              강의수 늘리기 요청
                            </Text>
                          </Wrapper>
                          <Wrapper
                            borderBottom={`1px dashed ${Theme.grey_C}`}
                            al={`flex-start`}
                            ju={`flex-start`}
                            dr={`row`}
                            padding={width < 800 ? `8px 0` : `16px 0`}>
                            <Text
                              cursor={`pointer`}
                              onClick={() => messageSendModalHandler(data)}>
                              결석 예고
                            </Text>
                            <Text> | </Text>
                            <Text
                              cursor={`pointer`}
                              onClick={() => messageSendModalHandler(data, 1)}>
                              반이동 요청
                            </Text>
                            <Text> | </Text>
                            <Text
                              cursor={`pointer`}
                              onClick={() => messageSendModalHandler(data)}>
                              줌 상담신청
                            </Text>
                          </Wrapper>
                          <Wrapper
                            dr={`row`}
                            ju={`space-between`}
                            al={`center`}>
                            <Button
                              type={`primary`}
                              size={`small`}
                              style={{ marginTop: 10 }}
                              onClick={() => detailBookOpen(data)}>
                              교재 리스트
                            </Button>

                            <Text
                              margin={`10px 0 0 0`}
                              cursor={`pointer`}
                              onClick={() => messageSendModalHandler(data)}>
                              쪽지보내기
                            </Text>
                          </Wrapper>
                        </Wrapper>
                      </Wrapper>
                    </Wrapper>
                    {/** */}
                  </Wrapper>
                );
              })
            )}
          </RsWrapper>
        </WholeWrapper>

        <CustomModal
          visible={noticeViewModal}
          width={`1350px`}
          title="공지사항"
          footer={null}
          closable={false}>
          <Wrapper
            dr={`row`}
            ju={`space-between`}
            margin={`0 0 35px`}
            fontSize={width < 700 ? "14px" : "16px"}>
            <Text margin={`0 54px 0 0`}>
              {`작성자: ${noticeViewDatum && noticeViewDatum.author}`}
            </Text>
            <Wrapper width={`auto`}>
              <Text>
                {`작성일: ${moment(
                  noticeViewDatum && noticeViewDatum.createdAt,
                  "YYYY/MM/DD"
                ).format("YYYY/MM/DD")}`}
              </Text>

              <Text>
                {`수정일: ${moment(
                  noticeViewDatum && noticeViewDatum.updatedAt,
                  "YYYY/MM/DD"
                ).format("YYYY/MM/DD")}`}
              </Text>
            </Wrapper>
          </Wrapper>

          {noticeViewDatum && noticeViewDatum.file && (
            <Wrapper dr={`row`} ju={`flex-end`}>
              <Text margin={`0 10px 0 0`} fontSize={`15px`}>
                첨부파일
              </Text>

              <CommonButton
                size={`small`}
                radius={`5px`}
                fontSize={`14px`}
                onClick={() => fileDownloadHandler(noticeViewDatum.file)}>
                다운로드
              </CommonButton>
            </Wrapper>
          )}

          <Text fontSize={`18px`} fontWeight={`bold`}>
            제목
          </Text>
          <Wrapper padding={`10px`}>
            <WordbreakText fontSize={width < 700 ? "14px" : "16px"}>
              {noticeViewDatum && noticeViewDatum.title}
            </WordbreakText>
          </Wrapper>

          <Text fontSize={`18px`} fontWeight={`bold`}>
            내용
          </Text>
          <Wrapper padding={`10px`}>
            <WordbreakText
              fontSize={width < 700 ? "14px" : "16px"}
              dangerouslySetInnerHTML={{
                __html: noticeViewDatum && noticeViewDatum.content,
              }}></WordbreakText>
          </Wrapper>

          <Wrapper>
            <CommonButton
              onClick={() => onReset()}
              kindOf={`grey`}
              color={Theme.darkGrey_C}
              radius={`5px`}>
              돌아가기
            </CommonButton>
          </Wrapper>
        </CustomModal>

        <Modal
          visible={bookModal}
          footer={null}
          onCancel={detailBookClose}
          width={width < 700 ? `80%` : 700}>
          <Wrapper al={`flex-start`}>
            <Text margin={`0 0 20px`} fontSize={`18px`} fontWeight={`700`}>
              교재 목록
            </Text>
            <Wrapper al={`flex-start`} ju={`flex-start`}>
              <Table
                style={{ width: `100%` }}
                size={`small`}
                columns={bookColumns}
                dataSource={bookLecture}
              />
            </Wrapper>
          </Wrapper>
        </Modal>

        <CustomModal
          visible={messageViewModal}
          width={`1350px`}
          title={"쪽지 상세"}
          footer={null}
          closable={false}>
          {!messageAnswerModal && !messageAnswerAdminModal && (
            <>
              <Wrapper
                dr={`row`}
                ju={`space-between`}
                margin={`0 0 35px`}
                fontSize={width < 700 ? "14px" : "16px"}>
                <Text margin={`0 54px 0 0`}>
                  {`작성자: ${messageDatum && messageDatum.author}`}
                </Text>
                <Text>{`날짜 ${
                  messageDatum &&
                  moment(messageDatum.createdAt, "YYYY/MM/DD").format(
                    "YYYY/MM/DD"
                  )
                }`}</Text>
              </Wrapper>

              <Text fontSize={`18px`} fontWeight={`bold`}>
                제목
              </Text>

              <Wrapper
                padding={`10px`}
                al={`flex-start`}
                fontSize={width < 700 ? "14px" : "16px"}>
                <Text>{messageDatum && messageDatum.title}</Text>
              </Wrapper>

              <Text fontSize={`18px`} fontWeight={`bold`}>
                내용
              </Text>
              <Wrapper
                padding={`10px`}
                al={`flex-start`}
                fontSize={width < 700 ? "14px" : "16px"}>
                <Text minHeight={`360px`}>
                  {messageDatum &&
                    messageDatum.content?.split("\n").map((data, idx) => {
                      return (
                        <Text key={`${data}${idx}`}>
                          {data}
                          <br />
                        </Text>
                      );
                    })}
                </Text>
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
              </Wrapper>
            </>
          )}
        </CustomModal>

        <CustomModal
          visible={messageSendModal}
          width={`1350px`}
          title={
            sendMessageType === 1
              ? "강사에게 쪽지 보내기"
              : sendMessageType === 2
              ? "수업에 대해 쪽지 보내기"
              : sendMessageType === 3 && "관리자에게 쪽지 보내기"
          }
          footer={null}
          closable={false}>
          <CustomForm
            ref={formRef}
            form={form}
            onFinish={(data) =>
              sendMessageType === 1
                ? sendMessageFinishHandler(data)
                : sendMessageType === 2
                ? sendMessageLectureFinishHanlder(data, messageTeacherList)
                : sendMessageType === 3 && sendMessageAdminFinishHandler(data)
            }>
            <Wrapper dr={`row`} ju={`flex-end`}>
              <CommonButton
                margin={`0 0 0 5px`}
                radius={`5px`}
                width={`100px`}
                height={`32px`}
                size="small"
                onClick={() => sendMessageTypeHandler(1)}>
                {"강사"}
              </CommonButton>

              <CommonButton
                margin={`0 0 0 5px`}
                radius={`5px`}
                width={`100px`}
                height={`32px`}
                size="small"
                onClick={() => sendMessageTypeHandler(2)}>
                {"수업"}
              </CommonButton>

              <CommonButton
                margin={`0 0 0 5px`}
                radius={`5px`}
                width={`100px`}
                height={`32px`}
                size="small"
                onClick={() => sendMessageTypeHandler(3)}>
                {"관리자"}
              </CommonButton>
            </Wrapper>

            {sendMessageType === 1 && (
              <Text fontSize={`14px`} color={Theme.grey2_C} margin={`0 0 20px`}>
                강사님 개인쪽지함에 쪽지가 전달됩니다.
              </Text>
            )}

            {sendMessageType === 2 && (
              <Text fontSize={`14px`} color={Theme.grey2_C} margin={`0 0 20px`}>
                강사님 수업 쪽지함에 쪽지가 전달됩니다.
              </Text>
            )}

            <Text fontSize={`18px`} fontWeight={`bold`}>
              제목
            </Text>
            <Form.Item
              name="title"
              rules={[{ required: true, message: "제목을 입력해주세요." }]}>
              <Input />
            </Form.Item>
            <Text fontSize={`18px`} fontWeight={`bold`}>
              내용
            </Text>

            <Form.Item
              name="content"
              rules={[{ required: true, message: "내용을 입력해주세요." }]}>
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
                쪽지 보내기
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
      type: MESSAGE_TEACHER_LIST_REQUEST,
    });

    // 구현부 종료
    context.store.dispatch(END);
    console.log("🍀 SERVER SIDE PROPS END");
    await context.store.sagaTask.toPromise();
  }
);

export default LectureAll;
