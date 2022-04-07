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
  Button,
  Calendar,
  Empty,
  Form,
  Input,
  message,
  Modal,
  Pagination,
  Select,
  Slider,
  Switch,
  Table,
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
import {
  LECTURE_FILE_REQUEST,
  LECTURE_HOMEWORK_STU_LIST_REQUEST,
  LECTURE_STU_LECTURE_LIST_REQUEST,
  LECTURE_SUBMIT_CREATE_REQUEST,
} from "../../reducers/lecture";
import {
  CalendarOutlined,
  UploadOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";
import { saveAs } from "file-saver";
import { COMMUTE_LIST_REQUEST } from "../../reducers/commute";
import { FileDoneOutlined } from "@ant-design/icons";
import { BOOK_LECTURE_LIST_REQUEST } from "../../reducers/book";

const PROFILE_WIDTH = `184`;
const PROFILE_HEIGHT = `190`;

const CustomButton = styled(Button)`
  border: none;
  font-weight: "boled";

  color: ${(props) => props.color};
`;

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

const Student = () => {
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
    messageUserLastPage,
    st_messageUserListDone,
    st_messageUserListError,
  } = useSelector((state) => state.message);

  const { noticeList, noticeLastPage, st_noticeListDone, st_noticeListError } =
    useSelector((state) => state.notice);

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
    lectureHomeworkStuLastPage,
    st_lectureHomeworkStuListDone,
    st_lectureHomeworkStuListError,
  } = useSelector((state) => state.lecture);

  const { bookLecture, st_bookLectureListDone, st_bookLectureListError } =
    useSelector((state) => state.book);

  ////// HOOKS //////
  const width = useWidth();
  const router = useRouter();
  const dispatch = useDispatch();

  const [updateForm] = Form.useForm();

  const formRef = useRef();

  const [form] = Form.useForm();
  const [answerform] = Form.useForm();
  const [answerAdminform] = Form.useForm();
  const [sendform] = Form.useForm();

  const [isCalendar, setIsCalendar] = useState(false);

  const imageInput = useRef();
  const fileInput = useRef();

  const [fileName, setFileName] = useState("");
  const [filePath, setFilePath] = useState("");

  const [messageSendModal, setMessageSendModal] = useState(false);
  const [messageViewModal, setMessageViewModal] = useState(false);
  const [messageAnswerModal, setMessageAnswerModal] = useState(false);
  const [messageAnswerAdminModal, setMessageAnswerAdminModal] = useState(false);

  const [noticeViewModal, setNoticeViewModal] = useState(false);
  const [noticeViewDatum, setNoticeViewDatum] = useState(null);

  const [messageDatum, setMessageDatum] = useState();

  const [sendMessageType, setSendMessageType] = useState(1);
  const [homeWorkModalToggle, setHomeWorkModalToggle] = useState(false);
  const [homeWorkData, setHomeWorkData] = useState("");

  const [selectValue, setSelectValue] = useState("");

  const [lectureId, setLectureId] = useState("");
  const [lectureUserId, setLectureUserId] = useState([]);

  const [detailBook, setDetailBook] = useState(null);
  const [bookModal, setBookModal] = useState(false);

  const [currentPage1, setCurrentPage1] = useState(1);
  const [currentPage2, setCurrentPage2] = useState(1);
  const [currentPage3, setCurrentPage3] = useState(1);

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
    if (!me) {
      message.error("로그인 후 이용해주세요.");
      return router.push(`/`);
    } else if (me.level !== 1) {
      message.error("학생이 아닙니다.");
      return router.push(`/`);
    }
  }, [me]);

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
      type: NOTICE_LIST_REQUEST,
      data: {
        page: 1,
      },
    });

    dispatch({
      type: LECTURE_STU_LECTURE_LIST_REQUEST,
    });

    dispatch({
      type: LECTURE_HOMEWORK_STU_LIST_REQUEST,
      data: {
        page: 1,
        search: "",
      },
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
    if (st_userProfileUploadError) {
      return message.error(st_userProfileUploadError);
    }
  }, [st_userProfileUploadError]);

  useEffect(() => {
    if (st_userUserUpdateError) {
      return message.error(st_userUserUpdateError);
    }
  }, [st_userUserUpdateError]);

  useEffect(() => {
    if (meUpdateModal) {
      updateForm.setFieldsValue({
        mobile: me.mobile,
        detailAddress: me.detailAddress,
        address: me.address,
        stuLanguage: me.stuLanguage,
        stuCountry: me.stuCountry,
        stuLiveCon: me.stuLiveCon,
        sns: me.sns,
        snsId: me.snsId,
        stuJob: me.stuJob,
        birth: moment(me.birth),
      });

      if (me.profileImage)
        dispatch({
          type: USER_PROFILE_IMAGE_PATH,
          data: me.profileImage,
        });
    } else {
      updateForm.resetFields();
      dispatch({
        type: USER_PROFILE_IMAGE_PATH,
        data: null,
      });
    }
  }, [meUpdateModal]);

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
    if (st_lectureFileDone) {
      setFilePath(lecturePath);
    }
  }, [st_lectureFileDone]);

  useEffect(() => {
    if (st_lectureHomeworkStuListError) {
      return message.error(st_lectureHomeworkStuListError);
    }
  }, [st_lectureHomeworkStuListError]);

  useEffect(() => {
    if (st_lectureSubmitCreateError) {
      return message.error(st_lectureSubmitCreateError);
    }
  }, [st_lectureSubmitCreateError]);

  useEffect(() => {
    if (st_lectureSubmitCreateDone) {
      onReset();
      return message.success("해당 강의 숙제를 제출했습니다.");
    }
  }, [st_lectureSubmitCreateDone]);

  useEffect(() => {
    if (st_lectureStuLectureListError) {
      return message.error(st_lectureStuLectureListError);
    }
  }, [st_lectureStuLectureListError]);

  useEffect(() => {
    if (st_messageUserListError) {
      return message.error(st_messageUserListError);
    }
  }, [st_messageUserListError]);

  const onReset = useCallback(() => {
    form.resetFields();
    sendform.resetFields();
    answerform.resetFields();

    setMessageAnswerAdminModal(false);
    setNoticeViewModal(false);
    setMessageAnswerModal(false);
    setMessageSendModal(false);
    setMessageViewModal(false);
    setHomeWorkModalToggle(false);
    setFileName("");
    setLectureId("");
    setSendMessageType(1);
  }, [fileInput]);

  ////// TOGGLE //////

  const meUpdateModalToggle = useCallback(() => {
    dispatch({
      type: ME_UPDATE_MODAL_TOGGLE,
    });
  }, [meUpdateModal]);

  const messageAnswerToggleHanlder = useCallback((data) => {
    console.log(data, "data");
    if (data.level >= 3) {
      setMessageAnswerAdminModal(true);
      setLectureId(data.id);
    } else {
      setMessageAnswerModal(true);
    }

    console.log(data, "data");

    console.log("답변하기!");
  }, []);

  const messageSendModalHandler = useCallback((data, num) => {
    setMessageSendModal((prev) => !prev);

    if (num === 1) {
      setSendMessageType(3);
    }

    setLectureId(data);
  }, []);

  const messageViewModalHandler = useCallback((data) => {
    setMessageViewModal((prev) => !prev);

    setMessageDatum(data);
  }, []);

  const sendMessageTypeHandler = useCallback((num) => {
    setSendMessageType(num);
  }, []);

  const homeworkSubmitHanlder = useCallback((data) => {
    setHomeWorkData(data);
    setHomeWorkModalToggle(true);
  }, []);

  ////// HANDLER //////

  const clickImageUpload = useCallback(() => {
    imageInput.current.click();
  }, []);

  const onChangeImages = useCallback((e) => {
    const formData = new FormData();

    [].forEach.call(e.target.files, (file) => {
      formData.append("image", file);
    });

    dispatch({
      type: USER_PROFILE_UPLOAD_REQUEST,
      data: formData,
    });
  }, []);

  const clickFileUpload = useCallback(() => {
    fileInput.current.click();
  }, []);

  const onChangeFiles = useCallback(
    (e) => {
      const formData = new FormData();

      [].forEach.call(e.target.files, (file) => {
        formData.append("file", file);
      });

      dispatch({
        type: LECTURE_FILE_REQUEST,
        data: formData,
      });

      setFileName(
        e.target.files[0] && e.target.files[0].name
          ? e.target.files[0].name
          : "파일을 다시 선택해주세요."
      );

      fileInput.current.value = "";
    },
    [fileInput]
  );

  const meUpdateHandler = useCallback(
    (data) => {
      if (!userProfilePath || userProfilePath.trim().length === 0) {
        return message.error("프로필 사진을 업로드해주세요");
      }

      dispatch({
        type: USER_UPDATE_REQUEST,
        data: {
          profileImage: userProfilePath,
          mobile: data.mobile,
          detailAddress: data.detailAddress,
          address: data.address,
          stuLanguage: data.stuLanguage,
          stuCountry: data.stuCountry,
          stuLiveCon: data.stuLiveCon,
          sns: data.sns,
          snsId: data.snsId,
          stuJob: data.stuJob,
          birth: data.birth.format("YYYY-MM-DD"),
        },
      });
    },
    [userProfilePath]
  );

  const sendMessageFinishHandler = useCallback(
    (data) => {
      dispatch({
        type: MESSAGE_CREATE_REQUEST,
        data: {
          title: data.title,
          author: me.userId,
          senderId: me.id,
          receiverId: lectureId,
          content: data.content,
          level: me.level,
        },
      });
    },
    [me, lectureId]
  );

  const sendMessageLectureFinishHanlder = useCallback(
    (data, messageDatum) => {
      let save = messageDatum.find((data2, idx) => {
        if (data2.id === data.receiveLectureId) {
          return true;
        }
      });

      if (!save) {
        return message.error("잠시후 다시 실행해주세요.");
      }

      dispatch({
        type: MESSAGE_CREATE_REQUEST,
        data: {
          title: data.title,
          author: me.userId,
          senderId: me.id,
          receiverId: save.UserId,
          receiveLectureId: data.receiveLectureId,
          content: data.content,
          level: me.level,
        },
      });
    },

    [me, lectureId]
  );

  const sendMessageAdminFinishHandler = useCallback(
    (data) => {
      dispatch({
        type: MESSAGE_FOR_ADMIN_CREATE_REQUEST,
        data: {
          title: data.messageTitle,
          author: me.userId,
          content: data.messageContent,
        },
      });
    },
    [me]
  );

  const sendMessageAnswerAdminFinish = useCallback(
    (data) => {
      console.log("한번만!");
      dispatch({
        type: MESSAGE_FOR_ADMIN_CREATE_REQUEST,
        data: {
          title: data.messageTitle,
          author: me.userId,
          content: data.messageContent,
        },
      });
    },
    [me]
  );

  const answerFinishHandler = useCallback(
    async (data, messageData) => {
      if (messageData) {
        dispatch({
          type: MESSAGE_CREATE_REQUEST,
          data: {
            title: data.messageTitle,
            author: me.userId,
            senderId: messageData.receiverId,
            receiverId: messageData.senderId,
            receiveLectureId: data.receiveLectureId,
            content: data.messageContent,
            level: me.level,
          },
        });
      }
    },
    [me]
  );

  const homeWorkFinishHandler = useCallback(() => {
    if (fileName) {
      dispatch({
        type: LECTURE_SUBMIT_CREATE_REQUEST,
        data: {
          HomeworkId: homeWorkData.id,
          LectureId: homeWorkData.LectureId,
          file: filePath,
        },
      });

      fileInput.current.value = "";
      setFileName("");
    } else {
      return message.error("파일을 업로드 해주세요.");
    }
  }, [fileName, filePath, homeWorkData, fileInput]);

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

  const receiveSelectHandler = useCallback((value) => {
    setSelectValue(value);
  }, []);

  const receiveLectureIdtHandler = useCallback((value) => {
    setLectureId(value);

    console.log(value, "value");
  }, []);

  const onSearchHandler = useCallback((value) => {
    setLectureId(value);
  }, []);

  const noticeChangePage = useCallback((page) => {
    setCurrentPage1(page);

    dispatch({
      type: NOTICE_LIST_REQUEST,
      data: {
        page,
      },
    });
  }, []);

  const onChangeHomeworkPage = useCallback((page) => {
    setCurrentPage2(page);

    dispatch({
      type: LECTURE_HOMEWORK_STU_LIST_REQUEST,
      data: {
        page,
        search: "",
      },
    });
  }, []);

  const onChangeMessagePage = useCallback((page) => {
    setCurrentPage3(page);

    dispatch({
      type: MESSAGE_USER_LIST_REQUEST,
      data: {
        page,
      },
    });
  }, []);

  const onClickNoticeHandler = useCallback((data) => {
    setNoticeViewDatum(data);
    setNoticeViewModal(true);
  }, []);

  const moveLinkHandler = useCallback((link) => {
    router.push(link);
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
              <Wrapper width={`auto`}>
                <CommonButton radius={`5px`} onClick={meUpdateModalToggle}>
                  회원정보 수정
                </CommonButton>
              </Wrapper>
            </Wrapper>

            <Wrapper dr={`row`} ju={`space-between`} margin={`0 0 20px`}>
              <Text
                fontSize={width < 800 ? `18px` : `22px`}
                fontWeight={`bold`}>
                내 시간표
              </Text>
            </Wrapper>

            {lectureStuLectureList && lectureStuLectureList.length === 0 ? (
              <Wrapper marign={`50px 0`}>
                <Empty description="조회된 시간표 목록이 없습니다." />
              </Wrapper>
            ) : (
              lectureStuLectureList &&
              lectureStuLectureList.slice(0, 1).map((data, idx) => {
                return (
                  <Wrapper
                    key={data.id}
                    padding={width < 700 ? `15px 10px 10px` : `40px 30px 35px`}
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
                      ju={`space-between`}
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
                      width={width < 1280 ? `100%` : `38%`}
                      dr={`row`}
                      ju={`space-between`}
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
                          {data.User.username}
                        </Text>
                      </Wrapper>

                      <Text
                        cursor={`pointer`}
                        color={Theme.basicTheme_C}
                        onClick={() =>
                          window.open(`${data.zoomLink}`, "_blank")
                        }>
                        강의 이동
                      </Text>
                    </Wrapper>
                  </Wrapper>
                );
              })
            )}

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
              lectureStuLectureList.slice(0, 1).map((data, idx) => {
                return (
                  <Wrapper
                    key={data.id}
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
                                fontSize={width < 800 ? `12px` : `16px`}>
                                <Text lineHeight={`1.19`}>
                                  {data.User.username}
                                </Text>

                                <Text lineHeight={`1.19`}>
                                  {"교재 다운로드"}
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
                          <Button
                            type={`primary`}
                            size={`small`}
                            style={{ marginTop: 10 }}
                            onClick={() => detailBookOpen(data)}>
                            교재 리스트
                          </Button>
                        </Wrapper>
                      </Wrapper>
                    </Wrapper>
                    {/** */}
                  </Wrapper>
                );
              })
            )}

            <CommonButton
              radius={`10px`}
              height={`34px`}
              width={`107px`}
              onClick={() => moveLinkHandler(`student/lectureAll`)}>
              전체보기
            </CommonButton>

            <Wrapper al={`flex-start`} margin={`80px 0 20px`}>
              <Text
                fontSize={width < 800 ? `18px` : `22px`}
                fontWeight={`bold`}>
                숙제보기 / 제출하기
              </Text>
            </Wrapper>

            <Wrapper margin={`0 0 60px`}>
              {lectureHomeworkStuList &&
                (lectureHomeworkStuList.length === 0 ? (
                  <Wrapper margin={`50px 0`}>
                    <Empty description="숙제가 없습니다." />
                  </Wrapper>
                ) : (
                  lectureHomeworkStuList &&
                  lectureHomeworkStuList.map((data) => {
                    return (
                      <Wrapper
                        key={data.id}
                        dr={`row`}
                        shadow={`0px 5px 15px rgba(0, 0, 0, 0.16)`}
                        radius={`10px`}
                        padding={`20px`}
                        margin={`0 0 10px`}>
                        <Wrapper
                          width={width < 900 ? `100%` : `55%`}
                          margin={width < 900 && `0 0 10px`}
                          dr={`row`}
                          ju={`flex-start`}>
                          <Wrapper dr={`row`} width={`25%`} ju={`flex-start`}>
                            <Image
                              width={`22px`}
                              margin={width < 900 ? `0 5px 0 0` : `0 16px 0 0`}
                              src="https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_lecture.png"
                              alt="lecture_icon"
                            />
                            <Text fontWeight={`bold`}>{data.course}</Text>
                          </Wrapper>

                          <Wrapper
                            dr={`row`}
                            width={width < 900 ? `30%` : `25%`}
                            ju={`flex-start`}>
                            <Text fontSize={`14px`}>
                              {`${data.username} 강사님`}
                            </Text>
                          </Wrapper>

                          <Wrapper
                            dr={`row`}
                            width={width < 900 ? `45%` : `50%`}
                            ju={`flex-start`}>
                            <Text fontSize={`14px`}>{data.title}</Text>
                          </Wrapper>
                        </Wrapper>
                        <Wrapper
                          width={width < 900 ? `100%` : `45%`}
                          dr={`row`}
                          ju={`flex-start`}>
                          <Wrapper
                            dr={`row`}
                            width={width < 900 ? `10%` : `35%`}
                            ju={`flex-start`}
                            onClick={() => fileDownloadHandler(data.file)}>
                            <Image
                              cursor={`pointer`}
                              width={`22px`}
                              margin={width < 900 ? `0 5px 0 0` : `0 16px 0 0`}
                              src="https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_download.png"
                              alt="lecture_icon"
                            />
                            {width > 900 && (
                              <Text cursor={`pointer`}>파일 다운로드</Text>
                            )}
                          </Wrapper>

                          <Wrapper
                            dr={`row`}
                            width={
                              width < 1100 ? `40%` : width < 900 ? `62%` : `35%`
                            }
                            ju={`flex-start`}>
                            <Image
                              width={`22px`}
                              margin={width < 700 ? `0 5px 0 0` : `0 16px 0 0`}
                              src="https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_calender_b.png"
                              alt="lecture_icon"
                            />
                            <Text>
                              {moment(data.date, "YYYY/MM/DD").format(
                                "YYYY/MM/DD"
                              )}
                              까지
                            </Text>
                          </Wrapper>

                          <Wrapper
                            dr={`row`}
                            width={
                              width < 1100 ? `25%` : width < 900 ? `28%` : `30%`
                            }
                            cursor={`pointer`}>
                            <CustomButton
                              color={
                                moment
                                  .duration(
                                    moment(data.date, "YYYY-MM-DD").diff(
                                      moment(new Date(), "YYYY-MM-DD")
                                    )
                                  )
                                  .asDays() < -1
                                  ? `${Theme.red_C}`
                                  : ""
                              }
                              onClick={() => homeworkSubmitHanlder(data)}
                              disabled={
                                moment
                                  .duration(
                                    moment(data.date, "YYYY-MM-DD").diff(
                                      moment(new Date(), "YYYY-MM-DD")
                                    )
                                  )
                                  .asDays() < -1
                              }>
                              {moment
                                .duration(
                                  moment(data.date, "YYYY-MM-DD").diff(
                                    moment(new Date(), "YYYY-MM-DD")
                                  )
                                )
                                .asDays() < -1
                                ? "제출 기간 만료"
                                : "제출 하기"}
                            </CustomButton>
                          </Wrapper>
                        </Wrapper>
                      </Wrapper>
                    );
                  })
                ))}
            </Wrapper>
            <CustomPage
              size="small"
              current={currentPage2}
              total={lectureHomeworkStuLastPage * 10}
              onChange={(page) => onChangeHomeworkPage(page)}
            />

            <Wrapper al={`flex-start`} margin={`86px 0 20px`}>
              <Text
                fontSize={width < 800 ? `18px` : `22px`}
                fontWeight={`bold`}>
                공지사항
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
              {noticeList &&
                (noticeList.length === 0 ? (
                  <Wrapper>
                    <Empty description="공지사항이 없습니다." />
                  </Wrapper>
                ) : (
                  noticeList.map((data, idx) => {
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
              current={currentPage1}
              tota={noticeLastPage * 10}
              onChange={(page) => noticeChangePage(page)}
            />

            <Wrapper al={`flex-start`} margin={`86px 0 20px`}>
              <Text
                fontSize={width < 800 ? `18px` : `22px`}
                fontWeight={`bold`}>
                내게 온 쪽지
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
              {messageUserList &&
                (messageUserList.length === 0 ? (
                  <Wrapper margin={`50px 0`}>
                    <Empty description="내게 온 쪽지가 없습니다." />
                  </Wrapper>
                ) : (
                  messageUserList.map((data, idx) => {
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

            <Wrapper al={`flex-end`} margin={`20px 0 40px`}>
              <CommonButton
                radius={`5px`}
                onClick={() => messageSendModalHandler()}>
                쪽지 보내기
              </CommonButton>
            </Wrapper>

            <Wrapper margin={`0 0 110px`}>
              <CustomPage
                size="small"
                current={currentPage3}
                total={messageUserLastPage * 10}
                onChange={(page) => onChangeMessagePage(page)}
              />
            </Wrapper>

            {/* <Wrapper al={`flex-start`} margin={`86px 0 20px`}>
              <Text
                fontSize={width < 800 ? `18px` : `22px`}
                fontWeight={`bold`}>
                자습하기
              </Text>
            </Wrapper> */}

            {/* <Wrapper radius={`10px`} shadow={`0px 2px 4px rgba(0, 0, 0, 0.16)`}>
              <Wrapper
                dr={`row`}
                fontWeight={`bold`}
                padding={`20px 0`}
                fontSize={width < 800 ? `14px` : `18px`}>
                <Wrapper width={width < 800 ? `15%` : `10%`}>번호</Wrapper>
                <Wrapper width={width < 800 ? `45%` : `70%`}>자료명</Wrapper>
                <Wrapper width={width < 800 ? `15%` : `10%`}>자료</Wrapper>
                <Wrapper width={width < 800 ? `25%` : `10%`}>날짜</Wrapper>
              </Wrapper>
              {preparationArr &&
                (preparationArr.length === 0 ? (
                  <Wrapper>
                    <Empty description="공지사항이 없습니다." />
                  </Wrapper>
                ) : (
                  preparationArr.map((data, idx) => {
                    return (
                      <CustomTableHoverWrapper
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
                          {width < 800 ? (
                            <Image
                              width={`22px`}
                              margin={width < 700 ? `0 5px 0 0` : `0 16px 0 0`}
                              src="https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_download.png"
                              alt="lecture_icon"
                            />
                          ) : (
                            "자료 다운로드"
                          )}
                        </Wrapper>
                        <Wrapper width={width < 800 ? `25%` : `10%`}>
                          {data.createdAt}
                        </Wrapper>
                      </CustomTableHoverWrapper>
                    );
                  })
                ))}
            </Wrapper>
            <Wrapper al={`flex-end`} margin={`20px 0 40px`}></Wrapper>
            <Wrapper margin={`0 0 110px`}>
              <CustomPage size="small" />
            </Wrapper> */}
          </RsWrapper>

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

          <CustomModal
            visible={messageViewModal}
            width={`1350px`}
            title={messageAnswerModal ? "쪽지 답변" : "쪽지함"}
            footer={null}
            closable={false}>
            <CustomForm
              form={answerform}
              onFinish={
                messageAnswerAdminModal
                  ? (data) => sendMessageAnswerAdminFinish(data)
                  : (data) => answerFinishHandler(data, messageDatum)
              }>
              {messageAnswerModal && (
                <>
                  <Wrapper dr={`row`} ju={`flex-start`} margin={`0 0 20px`}>
                    <Text
                      fontSize={`18px`}
                      fontWeight={`bold`}
                      margin={`0 35px 0 0`}>
                      작성자
                    </Text>

                    <Text>{messageDatum && messageDatum.author}</Text>
                  </Wrapper>

                  <Wrapper dr={`row`} ju={`flex-start`}>
                    <Form.Item
                      name="receiveLectureId"
                      rules={[
                        { required: true, message: "강의를 선택해주세요." },
                      ]}>
                      <Select
                        value={lectureId}
                        style={{ width: `400px` }}
                        showSearch
                        onSearch={onSearchHandler}
                        onChange={receiveLectureIdtHandler}
                        filterOption={(input, option) =>
                          option.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                        disabled={messageAnswerAdminModal ? true : false}>
                        {lectureStuLectureList &&
                        lectureStuLectureList.length === 0 ? (
                          <Option value="참여 중인 강의가 없습니다." disabled>
                            참여 중인 강의가 없습니다.
                          </Option>
                        ) : (
                          lectureStuLectureList &&
                          lectureStuLectureList.map((data, idx) => {
                            if (
                              messageDatum &&
                              messageDatum.senderId !== data.UserId
                            )
                              return;

                            return (
                              <Option key={`${data.id}${idx}`} value={data.id}>
                                {data.course}
                              </Option>
                            );
                          })
                        )}
                      </Select>
                    </Form.Item>
                  </Wrapper>

                  <Text
                    fontSize={`18px`}
                    fontWeight={`bold`}
                    margin={`20px 0 0`}>
                    제목
                  </Text>
                  <Wrapper padding={`10px`}>
                    <Form.Item
                      name="messageTitle"
                      rules={[
                        { required: true, message: "제목을 입력해주세요." },
                      ]}>
                      <CusotmInput width={`100%`} />
                    </Form.Item>
                  </Wrapper>

                  <Text fontSize={`18px`} fontWeight={`bold`}>
                    내용
                  </Text>
                  <Wrapper padding={`10px`}>
                    <Form.Item
                      name="messageContent"
                      rules={[
                        { required: true, message: "내용을 입력해주세요." },
                      ]}>
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
                      작성하기
                    </CommonButton>
                  </Wrapper>
                </>
              )}

              {messageAnswerAdminModal && (
                <>
                  <Wrapper dr={`row`} ju={`flex-start`} margin={`0 0 20px`}>
                    <Text
                      fontSize={`18px`}
                      fontWeight={`bold`}
                      margin={`0 35px 0 0`}>
                      관리자
                    </Text>

                    <Text>{messageDatum && messageDatum.author}</Text>
                    <Text>{`외 모든 관리자`}</Text>
                  </Wrapper>

                  {/* <Wrapper dr={`row`} ju={`flex-start`}>
                    <Form.Item
                      name="receiveLectureId"
                      rules={[
                        { required: true, message: "강의를 선택해주세요." },
                      ]}>
                      <Select
                        value={lectureId}
                        style={{ width: `400px` }}
                        showSearch
                        onSearch={onSearchHandler}
                        onChange={receiveLectureIdtHandler}
                        filterOption={(input, option) =>
                          option.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                        disabled={messageAnswerAdminModal ? true : false}>
                        {lectureStuLectureList &&
                        lectureStuLectureList.length === 0 ? (
                          <Option value="참여 중인 강의가 없습니다." disabled>
                            참여 중인 강의가 없습니다.
                          </Option>
                        ) : (
                          lectureStuLectureList &&
                          lectureStuLectureList.map((data, idx) => {
                            if (
                              messageDatum &&
                              messageDatum.senderId !== data.UserId
                            )
                              return;

                            return (
                              <Option key={`${data.id}${idx}`} value={data.id}>
                                {data.course}
                              </Option>
                            );
                          })
                        )}
                      </Select>
                    </Form.Item>
                  </Wrapper> */}

                  <Text
                    fontSize={`18px`}
                    fontWeight={`bold`}
                    margin={`20px 0 0`}>
                    제목
                  </Text>
                  <Wrapper padding={`10px`}>
                    <Form.Item
                      name="messageTitle"
                      rules={[
                        { required: true, message: "제목을 입력해주세요." },
                      ]}>
                      <CusotmInput width={`100%`} />
                    </Form.Item>
                  </Wrapper>

                  <Text fontSize={`18px`} fontWeight={`bold`}>
                    내용
                  </Text>
                  <Wrapper padding={`10px`}>
                    <Form.Item
                      name="messageContent"
                      rules={[
                        { required: true, message: "내용을 입력해주세요." },
                      ]}>
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
                      작성하기
                    </CommonButton>
                  </Wrapper>
                </>
              )}
            </CustomForm>

            {!messageAnswerModal && !messageAnswerAdminModal && (
              <>
                <Wrapper
                  dr={`row`}
                  ju={`space-between`}
                  margin={`0 0 35px`}
                  fontSize={width < 700 ? "14px" : "16px"}>
                  <Text margin={`0 54px 0 0`}>
                    {messageDatum && messageDatum.author}
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
                      messageDatum.content.split("\n").map((data, idx) => {
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
                  <CommonButton
                    onClick={() => messageAnswerToggleHanlder(messageDatum)}
                    margin={`0 0 0 5px`}
                    radius={`5px`}>
                    답변하기
                  </CommonButton>
                </Wrapper>
              </>
            )}
          </CustomModal>

          <CustomModal
            width={`700px`}
            visible={meUpdateModal}
            footer={null}
            onCancel={meUpdateModalToggle}>
            <Text fontSize={`22px`} fontWeight={`bold`} margin={`0 0 24px`}>
              회원정보 수정
            </Text>

            <ProfileWrapper>
              <GuideWrapper>
                <GuideText>
                  프로필 이미지 사이즈는 가로 {PROFILE_WIDTH}px 과 세로
                  {PROFILE_HEIGHT}px을 기준으로 합니다.
                </GuideText>
                <GuideText>
                  이미지 사이즈가 상이할 경우 화면에 올바르지 않게 보일 수
                  있으니 이미지 사이즈를 확인해주세요.
                </GuideText>
              </GuideWrapper>

              <ProfileImage
                src={
                  userProfilePath
                    ? `${userProfilePath}`
                    : `https://via.placeholder.com/${PROFILE_WIDTH}x${PROFILE_HEIGHT}`
                }
                alt="main_GALLEY_image"
              />
              <PreviewGuide>
                {userProfilePath && `이미지 미리보기 입니다.`}
              </PreviewGuide>

              <UploadWrapper>
                <input
                  type="file"
                  name="image"
                  accept=".png, .jpg"
                  // multiple
                  hidden
                  ref={imageInput}
                  onChange={onChangeImages}
                />
                <CommonButton
                  type="primary"
                  onClick={clickImageUpload}
                  loading={st_userProfileUploadLoading}
                  radius={`5px`}>
                  UPLOAD
                </CommonButton>
              </UploadWrapper>
            </ProfileWrapper>

            <CustomForm form={updateForm} onFinish={meUpdateHandler}>
              <Text fontSize={`18px`} fontWeight={`bold`}>
                전화번호
              </Text>
              <Form.Item
                name="mobile"
                rules={[
                  { required: true, message: "전화번호를 입력해주세요." },
                ]}>
                <CusotmInput
                  width={`100%`}
                  placeholder="전화번호를 입력해주세요."
                />
              </Form.Item>

              <Text fontSize={`18px`} fontWeight={`bold`}>
                주소
              </Text>
              <Form.Item
                name="address"
                rules={[{ required: true, message: "주소를 입력해주세요." }]}>
                <CusotmInput width={`100%`} />
              </Form.Item>

              <Text fontSize={`18px`} fontWeight={`bold`}>
                상세 주소
              </Text>
              <Form.Item
                name="detailAddress"
                rules={[
                  { required: true, message: "상세주소를 입력해주세요." },
                ]}>
                <CusotmInput width={`100%`} />
              </Form.Item>

              <Text fontSize={`18px`} fontWeight={`bold`}>
                학생 언어
              </Text>
              <Form.Item
                name="stuLanguage"
                rules={[
                  { required: true, message: "학생 언어를 입력해주세요." },
                ]}>
                <CusotmInput
                  width={`100%`}
                  placeholder="학생 언어를 입력해주세요."
                />
              </Form.Item>

              <Text fontSize={`18px`} fontWeight={`bold`}>
                학생 나라
              </Text>
              <Form.Item
                name="stuCountry"
                rules={[
                  { required: true, message: "학생 나라를 입력해주세요." },
                ]}>
                <CusotmInput
                  width={`100%`}
                  placeholder="학생 나라를 입력해주세요."
                />
              </Form.Item>

              <Text fontSize={`18px`} fontWeight={`bold`}>
                현재 거주 나라
              </Text>
              <Form.Item
                name="stuLiveCon"
                rules={[
                  { required: true, message: "현재 거주 나라를 입력해주세요." },
                ]}>
                <CusotmInput
                  width={`100%`}
                  placeholder="현재 거주 나라를 입력해주세요."
                />
              </Form.Item>

              <Text fontSize={`18px`} fontWeight={`bold`}>
                sns
              </Text>
              <Form.Item
                name="sns"
                rules={[{ required: true, message: "sns를 입력해주세요." }]}>
                <CusotmInput width={`100%`} placeholder="sns를 입력해주세요." />
              </Form.Item>

              <Text fontSize={`18px`} fontWeight={`bold`}>
                sns아이디
              </Text>
              <Form.Item
                name="snsId"
                rules={[
                  { required: true, message: "sns아이디를 입력해주세요." },
                ]}>
                <CusotmInput
                  width={`100%`}
                  placeholder="sns아이디를 입력해주세요."
                />
              </Form.Item>
              <Text fontSize={`18px`} fontWeight={`bold`}>
                학생직업
              </Text>
              <Form.Item
                name="stuJob"
                rules={[
                  { required: true, message: "학생 직업을 입력해주세요." },
                ]}>
                <CusotmInput
                  width={`100%`}
                  placeholder="학생직업을 입력해주세요."
                />
              </Form.Item>
              <Text fontSize={`18px`} fontWeight={`bold`}>
                생년월일
              </Text>
              <Form.Item
                name="birth"
                rules={[
                  { required: true, message: "생년월일를 입력해주세요." },
                ]}>
                <Calendar fullscreen={false} />
              </Form.Item>

              <Wrapper>
                <CommonButton height={`40px`} radius={`5px`} htmlType="submit">
                  회원정보 수정
                </CommonButton>
              </Wrapper>
            </CustomForm>
          </CustomModal>

          <CustomModal
            visible={homeWorkModalToggle}
            width={`1350px`}
            title="숙제 제출하기"
            footer={null}
            closable={false}>
            <CustomForm
              ref={formRef}
              form={form}
              onFinish={homeWorkFinishHandler}>
              <Text
                fontSize={width < 700 ? `14px` : `18px`}
                fontWeight={`bold`}>
                파일 업로드
              </Text>

              <Wrapper al={`flex-start`}>
                <input
                  type="file"
                  name="file"
                  accept=".pdf"
                  // multiple
                  hidden
                  ref={fileInput}
                  onChange={onChangeFiles}
                />
                <Button
                  icon={<UploadOutlined />}
                  onClick={clickFileUpload}
                  loading={st_lectureFileLoading}
                  style={{
                    height: `40px`,
                    width: `150px`,
                    margin: `10px 0 0`,
                  }}>
                  파일 올리기
                </Button>
                <Text>{`${fileName}`}</Text>
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
                  작성하기
                </CommonButton>
              </Wrapper>
            </CustomForm>
          </CustomModal>

          <CustomModal
            visible={messageSendModal}
            width={`1350px`}
            title={
              sendMessageType === 1
                ? "강사에게 쪽지 보내기"
                : sendMessageType === 2
                ? "수업에 대한 쪽지 보내기"
                : sendMessageType === 3 && "관리자에게 쪽지 보내기"
            }
            footer={null}
            closable={false}>
            <CustomForm
              form={sendform}
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
                <>
                  <Text fontSize={`18px`} fontWeight={`bold`} margin={`10px 0`}>
                    듣고 있는 강의 목록
                  </Text>

                  <Form.Item
                    name="receivePerson"
                    rules={[
                      {
                        required: true,
                        message: "듣고있는 강의 목록을 선택해주세요.",
                      },
                    ]}>
                    <Select
                      value={lectureId}
                      style={{ width: `100%` }}
                      onChange={receiveLectureIdtHandler}>
                      {lectureStuLectureList &&
                      lectureStuLectureList.length === 0 ? (
                        <Option value="참여 중인 강의가 없습니다.">
                          참여 중인 강의가 없습니다.
                        </Option>
                      ) : (
                        lectureStuLectureList &&
                        lectureStuLectureList.map((data, idx) => {
                          return (
                            <Option key={`${data.id}${idx}`} value={data.id}>
                              {data.course}
                            </Option>
                          );
                        })
                      )}
                    </Select>
                  </Form.Item>
                  <Text
                    fontSize={`14px`}
                    color={Theme.grey2_C}
                    margin={`0 0 20px`}>
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
                    name="receiveLectureId"
                    rules={[
                      {
                        required: true,
                        message: "듣고있는 강의 목록을 선택해주세요.",
                      },
                    ]}>
                    <Select
                      value={selectValue}
                      style={{ width: `100%` }}
                      onChange={receiveSelectHandler}>
                      {messageTeacherList && messageTeacherList.length === 0 ? (
                        <Option value="참여 중인 강의가 없습니다.">
                          참여 중인 강의가 없습니다.
                        </Option>
                      ) : (
                        messageTeacherList &&
                        messageTeacherList.map((data, idx) => {
                          return (
                            <Option key={`${data.id}${idx}`} value={data.id}>
                              {data.course}
                            </Option>
                          );
                        })
                      )}
                    </Select>
                  </Form.Item>
                  <Text
                    fontSize={`14px`}
                    color={Theme.grey2_C}
                    margin={`0 0 20px`}>
                    강사님에 수업 상세페이지 쪽지함에 전달 됩니다.
                  </Text>
                </>
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

          <Modal
            visible={bookModal}
            footer={null}
            onCancel={detailBookClose}
            width={width < 700 ? `100%` : 700}>
            <Wrapper al={`flex-start`}>
              <Text margin={`0 0 20px`} fontSize={`18px`} fontWeight={`700`}>
                교재
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

export default Student;
