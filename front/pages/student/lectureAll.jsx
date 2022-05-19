import React, { useEffect, useCallback, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import Head from "next/head";
import { useRouter } from "next/router";
import axios from "axios";
import { END } from "redux-saga";
import wrapper from "../../store/configureStore";
import { SEO_LIST_REQUEST } from "../../reducers/seo";
import { LOAD_MY_INFO_REQUEST } from "../../reducers/user";
import {
  Empty,
  Form,
  Input,
  message,
  Modal,
  Pagination,
  Slider,
  Table,
  Button,
  Select,
} from "antd";
import styled from "styled-components";
import useWidth from "../../hooks/useWidth";
import ClientLayout from "../../components/ClientLayout";
import {
  CommonButton,
  CommonTitle,
  Image,
  RsWrapper,
  SpanText,
  Text,
  WholeWrapper,
  Wrapper,
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
import { NOTICE_MY_LECTURE_LIST_REQUEST } from "../../reducers/notice";
import {
  LECTURE_STU_LECTURE_LIST_REQUEST,
  LECTURE_STU_LIMIT_LIST_REQUEST,
} from "../../reducers/lecture";
import { CloseOutlined, RollbackOutlined } from "@ant-design/icons";
import { saveAs } from "file-saver";
import { BOOK_LIST_REQUEST } from "../../reducers/book";

const CustomButton = styled(Button)`
  font-size: 16px;
  height: 26px;

  @media (max-width: 700px) {
    font-size: 14px;

    height: 24px;
  }
`;

const MessageSelectButton = styled(Button)`
  width: 100px;
  height: 40px;

  @media (max-width: 800px) {
    width: 50px;
    height: 30px;
    line-height: 30px;
    font-size: 12px;
  }
  background-color: ${Theme.basicTheme_C};
  border: 1px solid ${Theme.white_C};
  color: ${Theme.white_C};
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  line-height: 40px;
  margin: ${(props) => props.margin};
  &.active {
    background-color: ${Theme.white_C};
    border: 1px solid ${Theme.white_C};
    color: ${Theme.black_C};
  }
  &:hover {
    background-color: ${Theme.white_C};
    border: 1px solid ${Theme.white_C};
    color: ${Theme.black_C};
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

const CustomTable = styled(Table)`
  width: 100%;

  & .ant-table {
    font-size: 12px;
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

  &.messageModal .ant-modal-header {
    padding: 0;
  }

  &.messageModal {
    padding: 0;
  }

  & .ant-modal-header,
  & .ant-modal-content {
    border-radius: 5px;
  }

  & .ant-modal-title {
    font-size: 20px;
    font-weight: bold;
  }

  & .ant-modal-body {
    padding: 12px;
  }
`;

const CustomForm = styled(Form)`
  width: 100%;

  & .ant-form-item {
    width: 100%;
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

    st_messageTeacherListError,

    st_messageCreateDone,
    st_messageCreateError,

    st_messageForAdminCreateDone,
    st_messageForAdminCreateError,

    messagePartList,
    messagePartLastPage,

    st_messagePartListError,

    messageAllList,
    messageAllLastPage,

    st_messageAllListError,
  } = useSelector((state) => state.message);

  const {
    lectureStuLectureList,
    lectureStuCommute,

    st_lectureStuLectureListError,
    lectureStuLimitList,
  } = useSelector((state) => state.lecture);

  const {
    noticeMyLectureList,
    noticeMyLectureLastPage,

    st_noticeMyLectureListError,
  } = useSelector((state) => state.notice);

  const { bookList, bookMaxLength, st_bookListDone, st_bookListError } =
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

  const [currentPage2, setCurrentPage2] = useState(1);
  const [currentPage3, setCurrentPage3] = useState(1);
  const [currentPage4, setCurrentPage4] = useState(1);
  const [currentPage5, setCurrentPage5] = useState(1);

  const [bookModal, setBookModal] = useState(false);
  const [bookDetail, setBookDetail] = useState("");

  const [limitModal, setLimitModal] = useState(false);

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
            <Image src={data.thumbnail} alt={`thumbnail`} />
          </Wrapper>
        );
      },
    },
    {
      title: "제목",
      render: (data) => {
        return <Text>{data.title}</Text>;
      },
    },

    // {
    //   title: "다운로드",
    //   render: (data) => {
    //     return (
    //       <Button
    //         type={`primary`}
    //         size={`small`}
    //         onClick={() => fileDownloadHandler(data.file)}>
    //         다운로드
    //       </Button>
    //     );
    //   },
    // },
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
    dispatch({
      type: LECTURE_STU_LIMIT_LIST_REQUEST,
    });
  }, [me]);

  useEffect(() => {
    if (st_messageCreateError) {
      return message.error(st_messageCreateError);
    }
  }, [st_messageCreateError]);

  useEffect(() => {
    if (st_bookListError) {
      return message.error(st_bookListError);
    }
  }, [st_bookListError]);

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
  }, [router.query]);

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

  useEffect(() => {
    if (st_bookListDone) {
      setBookModal(true);
    }
  }, [st_bookListDone]);

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

  const onClickNoticeHandler = useCallback((data) => {
    setNoticeViewDatum(data);
    setNoticeViewModal(true);
  }, []);

  const sendMessageFinishHandler = useCallback(
    (data) => {
      let lectureStuLectureData = JSON.parse(data.lectureStuLectureList);

      dispatch({
        type: MESSAGE_CREATE_REQUEST,
        data: {
          title: data.title,
          author: me.username,
          senderId: me.id,
          receiverId: lectureStuLectureData.TeacherId,
          content: data.content,
          level: lectureStuLectureData.level,
        },
      });
    },
    [me]
  );

  const sendMessageLectureFinishHanlder = useCallback(
    (data) => {
      let lectureStuLectureData = JSON.parse(data.lectureStuLectureList);

      dispatch({
        type: MESSAGE_CREATE_REQUEST,
        data: {
          title: data.title,
          author: me.username,
          senderId: me.id,
          receiverId: lectureStuLectureData.TeacherId,
          receiveLectureId: lectureStuLectureData.LectureId,
          content: data.content,
          level: lectureStuLectureData.level,
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

  const stepHanlder2 = useCallback((startDate, endDate, day) => {
    let dir = 0;

    const save = Math.abs(
      moment.duration(moment().diff(moment(startDate, "YYYY-MM-DD"))).asDays()
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

    for (let i = 0; i <= dir; i++) {
      let saveDay = moment(startDate).add(i, "days").day();

      const saveResult = day.includes(arr[saveDay]);

      if (saveResult) {
        add += 1;
      }
    }

    return add;
  }, []);

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
    setCurrentPage3(page);
    dispatch({
      type: MESSAGE_PART_LIST_REQUEST,
      data: {
        page,
      },
    });
  }, []);

  const allmessageChangePage = useCallback((page) => {
    setCurrentPage4(page);
    dispatch({
      type: MESSAGE_ALL_LIST_REQUEST,
      data: {
        page,
      },
    });
  }, []);

  const detailBookOpen = useCallback((data) => {
    setBookDetail(data);

    dispatch({
      type: BOOK_LIST_REQUEST,
      data: {
        LectureId: data.LectureId,
      },
    });
  }, []);

  const detailBookClose = useCallback(() => {
    setBookModal(false);
  }, []);

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

  const slideValue = useCallback((lectureStuCommute, data) => {
    const tempArr =
      lectureStuCommute &&
      lectureStuCommute.filter((commute, idx) => {
        return commute.LectureId === data.LectureId;
      });

    return (tempArr.length * 100) / ((data.date / 7) * data.count);
  }, []);

  const onChangeBookPage = useCallback(
    (page) => {
      setCurrentPage5(page);

      dispatch({
        type: BOOK_LIST_REQUEST,
        data: {
          LectureId: bookDetail.LectureId,
          page,
        },
      });
    },
    [bookDetail]
  );

  ////// DATAVIEW //////

  const limitColumns = [
    {
      title: "번호",
      dataIndex: "id",
    },
    {
      title: "강의명",
      dataIndex: "course",
    },
    {
      title: "강사명",
      dataIndex: "teacherName",
    },
    {
      title: "가격($)",
      dataIndex: "price",
    },
    {
      title: "강의 참가일",
      render: (data) => data.createdAt.slice(0, 10),
    },

    {
      title: "남은 일수",
      render: (data) => <div>D-{data.limitDate}</div>,
    },
  ];
  const limitColumnsM = [
    {
      title: "강의명 / 강사명",
      width: 110,
      render: (data) => (
        <Wrapper al={`flex-start`}>
          <Text>{data.course} /&nbsp;</Text>
          <Text>{data.teacherName}</Text>
        </Wrapper>
      ),
    },
    {
      title: "가격($)",
      dataIndex: "price",
    },
    {
      title: "참가일",
      render: (data) => data.createdAt.slice(0, 10),
    },

    {
      title: "일수",
      render: (data) => <div>D-{data.limitDate}</div>,
    },
  ];

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
        <WholeWrapper margin={`100px 0 0`} bgColor={Theme.subTheme_C}>
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
          <RsWrapper margin={`50px 0 0`}>
            <Wrapper al={`flex-end`}>
              <BackIcon width={`auto`} onClick={moveBackHandler}>
                <RollbackOutlined />
                <Text>뒤로가기</Text>
              </BackIcon>
            </Wrapper>
            <Wrapper
              al={`flex-start`}
              margin={width < 700 ? `20px 0 10px` : `0 0 20px`}
            >
              <CommonTitle>Class / Bulletin Board</CommonTitle>
            </Wrapper>

            <Wrapper
              margin={`0 0 40px`}
              Wrapper
              borderTop={`2px solid ${Theme.black_C}`}
            >
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
                >
                  번호
                </Text>
                <Text
                  fontSize={width < 700 ? `14px` : `18px`}
                  fontWeight={`Bold`}
                  width={width < 800 ? `45%` : `70%`}
                >
                  제목
                </Text>

                <Text
                  fontSize={width < 700 ? `14px` : `18px`}
                  fontWeight={`Bold`}
                  width={width < 800 ? `15%` : `10%`}
                >
                  작성자
                </Text>

                <Text
                  fontSize={width < 700 ? `14px` : `18px`}
                  fontWeight={`Bold`}
                  width={width < 800 ? `25%` : `10%`}
                >
                  날짜
                </Text>
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
                        bgColor={idx % 2 === 0}
                        borderBottom={`1px solid ${Theme.grey_C}`}
                      >
                        <Wrapper width={width < 800 ? `15%` : `10%`}>
                          {data.id}
                        </Wrapper>
                        <Wrapper
                          width={width < 800 ? `45%` : `70%`}
                          al={`flex-start`}
                          padding={`0 0 0 10px`}
                        >
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

            <Wrapper al={`flex-start`} margin={`50px 0 20px`}>
              <CommonTitle>관리자 강의 쪽지함</CommonTitle>

              <Text fontSize={width < 800 ? `14px` : `18px`}>
                관리자에서 강의 단위로 보낸 쪽지 목록 입니다.
              </Text>
            </Wrapper>

            <Wrapper borderTop={`2px solid ${Theme.black_C}`}>
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
                >
                  번호
                </Text>
                <Text
                  fontSize={width < 700 ? `14px` : `18px`}
                  fontWeight={`Bold`}
                  width={width < 800 ? `45%` : `70%`}
                >
                  제목
                </Text>

                <Text
                  fontSize={width < 700 ? `14px` : `18px`}
                  fontWeight={`Bold`}
                  width={width < 800 ? `15%` : `10%`}
                >
                  작성자
                </Text>

                <Text
                  fontSize={width < 700 ? `14px` : `18px`}
                  fontWeight={`Bold`}
                  width={width < 800 ? `25%` : `10%`}
                >
                  날짜
                </Text>
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
                        onClick={() => messageViewModalHandler(data)}
                        borderBottom={`1px solid ${Theme.grey_C}`}
                      >
                        <Wrapper width={width < 800 ? `15%` : `10%`}>
                          {data.id}
                        </Wrapper>
                        <Wrapper
                          width={width < 800 ? `45%` : `70%`}
                          al={`flex-start`}
                          padding={`0 0 0 10px`}
                        >
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

            <Wrapper margin={`40px 0 50px`}>
              <CustomPage
                size="small"
                current={currentPage3}
                total={messagePartLastPage * 10}
                onChange={(page) => messageChangePage(page)}
              />
            </Wrapper>

            <Wrapper al={`flex-start`} margin={`0 0 20px`}>
              <CommonTitle>전체 쪽지 및 학생</CommonTitle>
            </Wrapper>

            <Wrapper borderTop={`2px solid ${Theme.black_C}`}>
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
                >
                  글 번호
                </Text>
                <Text
                  fontSize={width < 700 ? `14px` : `18px`}
                  fontWeight={`Bold`}
                  width={width < 800 ? `45%` : `70%`}
                >
                  제목
                </Text>

                <Text
                  fontSize={width < 700 ? `14px` : `18px`}
                  fontWeight={`Bold`}
                  width={width < 800 ? `15%` : `10%`}
                >
                  작성자
                </Text>

                <Text
                  fontSize={width < 700 ? `14px` : `18px`}
                  fontWeight={`Bold`}
                  width={width < 800 ? `25%` : `10%`}
                >
                  날짜
                </Text>
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
                        onClick={() => messageViewModalHandler(data)}
                        borderBottom={`1px solid ${Theme.grey_C}`}
                      >
                        <Wrapper width={width < 800 ? `15%` : `10%`}>
                          {data.id}
                        </Wrapper>
                        <Wrapper
                          width={width < 800 ? `45%` : `70%`}
                          al={`flex-start`}
                          padding={`0 0 0 10px`}
                        >
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

            <Wrapper dr={`row`} ju={`flex-start`} margin={`0 0 20px`}>
              <CommonTitle>My Class</CommonTitle> &nbsp; &nbsp;
              <Button
                type={`primary`}
                size={`small`}
                onClick={() => setLimitModal(true)}
              >
                내가 결제한 강의 정보
              </Button>
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
                    // padding={`0 0 10px`}
                    margin={`0 0 20px`}
                    // borderBottom={`1px dashed ${Theme.grey}`}
                  >
                    <Wrapper
                      key={data.id}
                      width={`100%`}
                      dr={`row`}
                      ju={`flex-start`}
                      margin={`0 0 30px`}
                    >
                      <Image
                        top={`0`}
                        left={`0`}
                        width={width < 800 ? `60px` : `80px`}
                        height={width < 800 ? `60px` : `80px`}
                        radius={`5px`}
                        src={
                          data.profileImage
                            ? data.profileImage
                            : "https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/img_default-profile_big.png"
                        }
                        alt="student_thumbnail"
                      />
                      <Wrapper
                        padding={`0 0 0 16px`}
                        width={
                          width < 800
                            ? `calc(100% - 80px)`
                            : `calc(100% - 184px)`
                        }
                      >
                        <Wrapper margin={`10px 0 0 0`} al={`flex-start`}>
                          <Text
                            fontSize={width < 800 ? `14px` : `16px`}
                            margin={`0 0 10px`}
                          >
                            {data.course}&nbsp;{" "}
                            <Button
                              size={`small`}
                              type={`primary`}
                              onClick={() => messageSendModalHandler(data)}
                            >
                              쪽지 보내기
                            </Button>
                          </Text>

                          <Wrapper
                            dr={width < 800 ? `column` : `row`}
                            ju={width < 800 ? `center` : `flex-start`}
                            al={width < 800 ? `flex-start` : `center`}
                            width={`auto`}
                            fontSize={width < 800 ? `14px` : `16px`}
                          >
                            <Text
                              fontSize={width < 800 ? `14px` : `16px`}
                              margin={`0 10px 0 0`}
                            >
                              Lecturer: {data.username}
                            </Text>
                            <Wrapper
                              display={width < 1100 && `none`}
                              width={`1px`}
                              height={`20px`}
                              margin={`0 10px`}
                              borderRight={
                                width < 1100
                                  ? `0`
                                  : `1px dashed ${Theme.grey_C}`
                              }
                            />
                            <Text margin={width < 800 ? `0` : `0 20px 0 0`}>
                              Leanrning at chapter&nbsp;
                              {data.startLv.split(` `)[0].split(`권`)[0]} of
                              Book&nbsp;
                              {data.startLv.split(` `)[1].split(`단원`)[0]}
                              &nbsp;(Page&nbsp;
                              {data.startLv.split(` `)[2].split(`페이지`)[0]})
                            </Text>
                            <Wrapper dr={`row`} width={`auto`}>
                              <Text>
                                <SpanText color={Theme.subTheme2_C}>●</SpanText>
                                &nbsp;My Attendance&nbsp; &nbsp;
                              </Text>
                              <Wrapper width={width < 800 ? `150px` : `200px`}>
                                {console.log(lectureStuCommute)}
                                <CustomSlide
                                  value={slideValue(lectureStuCommute, data)}
                                  disabled={true}
                                  draggableTrack={true}
                                  bgColor={Theme.subTheme2_C}
                                />
                              </Wrapper>
                            </Wrapper>
                          </Wrapper>
                        </Wrapper>

                        {/* 
                    <Wrapper
                      margin={`10px 0 0 0`}
                      dr={`row`}
                      ju={`flex-start`}
                      color={Theme.grey2_C}
                      fontSize={width < 800 ? `12px` : `16px`}
                      lineHeight={`1.19`}
                    >
                      {`${data.startLv}`}

                      <Text fontSize={width < 700 ? `14px` : `16px`}>
                        {stepHanlder2(
                          moment(data.PartCreatedAt).format("YYYY-MM-DD"),
                          data.endDate,
                          data.day
                        ) -
                          (data.date / 7) * data.count <=
                          0 && (
                          <SpanText
                            fontWeight={`bold`}
                            color={Theme.red_C}
                            margin={`0 0 0 15px`}
                          >
                            {Math.abs(
                              stepHanlder2(
                                moment(data.PartCreatedAt).format(
                                  "YYYY-MM-DD"
                                ),
                                data.endDate,
                                data.day
                              ) - Math.floor((data.date / 7) * data.count)
                            )}
                            회
                          </SpanText>
                        )}
                      </Text>
                    </Wrapper> */}

                        <Wrapper>
                          {/* <Wrapper
                              dr={`row`}
                              ju={`flex-start`}
                              margin={`10px 0`}>
                              <Text width={width < 800 ? `100%` : `15%`}>
                                <SpanText color={Theme.basicTheme_C}>
                                  ●
                                </SpanText>
                                &nbsp; 수업 진도
                              </Text>
                              <Wrapper width={width < 800 ? `80%` : `75%`}>
                                <CustomSlide
                                  value={stepHanlder(
                                    data.startDate,
                                    data.endDate,
                                    data.count,
                                    data.lecDate,
                                    data.day
                                  )}
                                  disabled={true}
                                  draggableTrack={true}
                                  bgColor={Theme.basicTheme_C}
                                />
                              </Wrapper>
                              <Text
                                width={`10%`}
                                color={Theme.grey2_C}
                                padding={`0 0 0 10px`}>
                                {`( ${stepHanlder(
                                  data.startDate,
                                  data.endDate,
                                  data.count,
                                  data.lecDate,
                                  data.day
                                )}%)`}
                              </Text>
                            </Wrapper> */}
                          {/* <Wrapper dr={`row`} ju={`flex-start`}>
                              <Text width={width < 800 ? `100%` : `15%`}>
                                <SpanText color={Theme.subTheme6_C}>
                                  ●
                                </SpanText>
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
                            </Wrapper> */}
                        </Wrapper>
                      </Wrapper>
                    </Wrapper>
                    <Wrapper borderTop={`2px solid ${Theme.black_C}`}>
                      <Wrapper
                        dr={`row`}
                        textAlign={`center`}
                        height={`80px`}
                        bgColor={Theme.subTheme9_C}
                        borderBottom={`1px solid ${Theme.grey_C}`}
                      >
                        <Wrapper width={`50%`} dr={`row`} height={`100%`}>
                          <Wrapper width={`50%`}>
                            Registration Frequency
                          </Wrapper>
                          <Wrapper
                            width={`50%`}
                            bgColor={Theme.white_C}
                            height={`100%`}
                          >
                            {data.stuPayCount}
                          </Wrapper>
                        </Wrapper>
                        <Wrapper width={`50%`} dr={`row`} height={`100%`}>
                          <Wrapper width={`50%`}>
                            Date of my first lessons
                          </Wrapper>
                          <Wrapper
                            width={`50%`}
                            bgColor={Theme.white_C}
                            height={`100%`}
                          >
                            {data.PartCreatedAt.slice(0, 10)}
                          </Wrapper>
                        </Wrapper>
                      </Wrapper>
                    </Wrapper>
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
          closable={false}
        >
          <Wrapper
            dr={`row`}
            ju={`space-between`}
            margin={`0 0 35px`}
            fontSize={width < 700 ? "14px" : "16px"}
          >
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
                onClick={() => fileDownloadHandler(noticeViewDatum.file)}
              >
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
              }}
            ></WordbreakText>
          </Wrapper>

          <Wrapper>
            <CommonButton
              onClick={() => onReset()}
              kindOf={`grey`}
              color={Theme.darkGrey_C}
              radius={`5px`}
            >
              돌아가기
            </CommonButton>
          </Wrapper>
        </CustomModal>

        <Modal
          visible={bookModal}
          footer={null}
          onCancel={detailBookClose}
          width={width < 700 ? `80%` : 700}
        >
          <Wrapper al={`flex-start`}>
            <Text margin={`0 0 20px`} fontSize={`18px`} fontWeight={`700`}>
              교재 목록
            </Text>
            <Wrapper al={`flex-start`} ju={`flex-start`}>
              <Table
                style={{ width: `100%` }}
                size={`small`}
                columns={bookColumns}
                dataSource={bookList}
                pagination={{
                  pageSize: 12,
                  current: currentPage5,
                  total: bookMaxLength * 12,
                  onChange: (page) => onChangeBookPage(page),
                }}
              />
            </Wrapper>
          </Wrapper>
        </Modal>

        <CustomModal
          visible={messageViewModal}
          width={`1350px`}
          title={"쪽지 상세"}
          footer={null}
          closable={false}
        >
          {!messageAnswerModal && !messageAnswerAdminModal && (
            <>
              <Wrapper
                dr={`row`}
                ju={`space-between`}
                margin={`0 0 35px`}
                fontSize={width < 700 ? "14px" : "16px"}
              >
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
                fontSize={width < 700 ? "14px" : "16px"}
              >
                <Text>{messageDatum && messageDatum.title}</Text>
              </Wrapper>

              <Text fontSize={`18px`} fontWeight={`bold`}>
                내용
              </Text>
              <Wrapper
                padding={`10px`}
                al={`flex-start`}
                fontSize={width < 700 ? "14px" : "16px"}
              >
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
                  onClick={() => onReset()}
                >
                  돌아가기
                </CommonButton>
              </Wrapper>
            </>
          )}
        </CustomModal>

        <CustomModal
          visible={messageSendModal}
          width={`1350px`}
          className={`messageModal`}
          title={
            <Wrapper
              dr={`row`}
              ju={`space-between`}
              height={width < 800 ? `80px` : `100px`}
              padding={width < 800 ? `0 10px` : `0 50px`}
              bgColor={Theme.basicTheme_C}
            >
              <Text fontSize={width < 800 ? `14px` : `20px`}>
                {sendMessageType === 1
                  ? "강사에게 쪽지 보내기"
                  : sendMessageType === 2
                  ? "수업에 대한 쪽지 보내기"
                  : sendMessageType === 3 && "관리자에게 쪽지 보내기"}
              </Text>
              <Wrapper dr={`row`} width={`auto`}>
                <MessageSelectButton
                  className={sendMessageType === 1 && `active`}
                  size="small"
                  onClick={() => sendMessageTypeHandler(1)}
                >
                  {"강사"}
                </MessageSelectButton>

                <MessageSelectButton
                  className={sendMessageType === 2 && `active`}
                  margin={width < 800 ? `0 0 0 5px` : `0 0 0 8px`}
                  size="small"
                  onClick={() => sendMessageTypeHandler(2)}
                >
                  {"수업"}
                </MessageSelectButton>

                <MessageSelectButton
                  className={sendMessageType === 3 && `active`}
                  margin={width < 800 ? `0 10px 0 5px` : `0 40px 0 8px`}
                  size="small"
                  onClick={() => sendMessageTypeHandler(3)}
                >
                  {"관리자"}
                </MessageSelectButton>
                <CloseOutlined
                  onClick={onReset}
                  style={{ fontSize: `20px`, color: Theme.white_C }}
                />
              </Wrapper>
            </Wrapper>
          }
          footer={null}
          closable={false}
        >
          <CustomForm
            ref={formRef}
            form={form}
            onFinish={(data) =>
              sendMessageType === 1
                ? sendMessageFinishHandler(data)
                : sendMessageType === 2
                ? sendMessageLectureFinishHanlder(data, messageTeacherList)
                : sendMessageType === 3 && sendMessageAdminFinishHandler(data)
            }
          >
            {sendMessageType === 1 && (
              <>
                <Text fontSize={`18px`} fontWeight={`bold`} margin={`10px 0`}>
                  듣고 있는 강의 목록
                </Text>

                <Form.Item
                  name="lectureStuLectureList"
                  rules={[
                    {
                      required: true,
                      message: "듣고있는 강의 목록을 선택해주세요.",
                    },
                  ]}
                >
                  <Select style={{ width: `100%` }}>
                    {lectureStuLectureList &&
                    lectureStuLectureList.length === 0 ? (
                      <Option value="참여 중인 강의가 없습니다.">
                        참여 중인 강의가 없습니다.
                      </Option>
                    ) : (
                      lectureStuLectureList &&
                      lectureStuLectureList.map((data, idx) => {
                        return (
                          <Option
                            key={`${data.id}${idx}`}
                            value={JSON.stringify(data)}
                          >
                            {`${data.course} | ${data.username}`}
                          </Option>
                        );
                      })
                    )}
                  </Select>
                </Form.Item>
                <Text
                  fontSize={`14px`}
                  color={Theme.grey2_C}
                  margin={`0 0 20px`}
                >
                  강사님 개인쪽지함에 쪽지가 전달됩니다.
                </Text>
              </>
            )}

            {sendMessageType === 2 && (
              <>
                <Text fontSize={`18px`} fontWeight={`bold`} margin={`10px 0`}>
                  듣고 있는 강의 목록
                </Text>

                <Form.Item
                  name="lectureStuLectureList"
                  rules={[
                    {
                      required: true,
                      message: "듣고있는 강의 목록을 선택해주세요.",
                    },
                  ]}
                >
                  <Select style={{ width: `100%` }}>
                    {lectureStuLectureList &&
                    lectureStuLectureList.length === 0 ? (
                      <Option value="참여 중인 강의가 없습니다.">
                        참여 중인 강의가 없습니다.
                      </Option>
                    ) : (
                      lectureStuLectureList &&
                      lectureStuLectureList.map((data, idx) => {
                        return (
                          <Option
                            key={`${data.id}${idx}`}
                            value={JSON.stringify(data)}
                          >
                            {`${data.course} | ${data.username}`}
                          </Option>
                        );
                      })
                    )}
                  </Select>
                </Form.Item>
                <Text
                  fontSize={`14px`}
                  color={Theme.grey2_C}
                  margin={`0 0 20px`}
                >
                  강사님에 수업 상세페이지 쪽지함에 전달 됩니다.
                </Text>
              </>
            )}

            <Text fontSize={`18px`} fontWeight={`bold`}>
              제목
            </Text>
            <Form.Item
              name="title"
              rules={[{ required: true, message: "제목을 입력해주세요." }]}
            >
              <Input />
            </Form.Item>
            <Text fontSize={`18px`} fontWeight={`bold`}>
              내용
            </Text>

            <Form.Item
              name="content"
              rules={[{ required: true, message: "내용을 입력해주세요." }]}
            >
              <Input.TextArea style={{ height: `360px` }} />
            </Form.Item>
            <Wrapper dr={`row`}>
              <CommonButton
                margin={`0 5px 0 0`}
                kindOf={`grey`}
                color={Theme.darkGrey_C}
                radius={`5px`}
                onClick={() => onReset()}
              >
                돌아가기
              </CommonButton>
              <CommonButton
                margin={`0 0 0 5px`}
                radius={`5px`}
                htmlType="submit"
              >
                쪽지 보내기
              </CommonButton>
            </Wrapper>
          </CustomForm>
        </CustomModal>
        <CustomModal
          width={800}
          title={`내가 결제한 강의 정보`}
          footer={null}
          onCancel={() => setLimitModal(false)}
          visible={limitModal}
        >
          <Wrapper>
            <CustomTable
              pagination={{
                size: "small",
              }}
              dataSource={lectureStuLimitList ? lectureStuLimitList : []}
              columns={width < 800 ? limitColumnsM : limitColumns}
            />
          </Wrapper>
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
