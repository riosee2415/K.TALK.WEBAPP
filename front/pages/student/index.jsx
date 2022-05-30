import React, { useEffect, useCallback, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  USER_PROFILE_IMAGE_PATH,
  USER_PROFILE_UPLOAD_REQUEST,
  USER_UPDATE_REQUEST,
} from "../../reducers/user";
import {
  Button,
  Empty,
  Form,
  Input,
  message,
  Modal,
  Pagination,
  Select,
  Slider,
  Table,
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
  TextArea,
  TextInput,
  WholeWrapper,
  Wrapper,
} from "../../components/commonComponents";
import Theme from "../../components/Theme";
import {
  MESSAGE_CREATE_REQUEST,
  MESSAGE_FOR_ADMIN_CREATE_REQUEST,
  MESSAGE_TEACHER_LIST_REQUEST,
  MESSAGE_USER_LIST_REQUEST,
} from "../../reducers/message";

import {
  NOTICE_LIST_REQUEST,
  NOTICE_MY_LECTURE_LIST_REQUEST,
} from "../../reducers/notice";
import {
  LECTURE_FILE_REQUEST,
  LECTURE_HOMEWORK_STU_LIST_REQUEST,
  LECTURE_STU_LECTURE_LIST_REQUEST,
  LECTURE_SUBMIT_CREATE_REQUEST,
} from "../../reducers/lecture";
import {
  CloseOutlined,
  RightCircleFilled,
  SyncOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { saveAs } from "file-saver";
import { BOOK_LIST_REQUEST } from "../../reducers/book";
import { CalendarOutlined } from "@ant-design/icons";
import { PAY_CLASS_LEC_DETAIL_REQUEST } from "../../reducers/payClass";

const PROFILE_WIDTH = `150`;
const PROFILE_HEIGHT = `150`;

const CustomSelect = styled(Select)`
  width: calc(100% - 80px);
`;

const CustomInput = styled(TextInput)`
  width: ${(props) => props.width || `100%`};

  &::placeholder {
    color: ${Theme.grey2_C};
  }
`;

const CusotmTextArea = styled(TextArea)`
  width: 100%;
  min-height: 200px;
  border: none;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.15);

  &::placeholder {
    color: ${Theme.grey2_C};
  }
`;

const CustomButton2 = styled(Button)`
  font-size: 16px;
  width: 205px;
  height: 52px;
  line-height: 52px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  font-size: 18px;

  border-radius: 26px;
  background-color: ${Theme.white_C};
  color: ${Theme.basicTheme_C};
  & .btnIcon {
    color: ${Theme.basicTheme_C};
    font-size: 35px;
    line-height: 0;
  }

  @media (max-width: 800px) {
    font-size: 14px;
    width: 100px;
    height: 32px;
    margin: 10px 0 0;
  }
`;

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
  width: 150px;
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

  &.messageModal .ant-modal-header {
    padding: 0;
  }

  &.messageModal {
    padding: 0;
  }
`;

const CustomForm = styled(Form)`
  width: 100%;

  & .ant-form-item {
    width: 100%;
  }
`;

const MessageSelectButton = styled(Button)`
  width: 120px;
  height: 40px;

  @media (max-width: 800px) {
    width: 90px;
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

const MessageModalSelect = styled(Select)`
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.15);
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

    st_messageTeacherListError,

    st_messageCreateDone,
    st_messageCreateError,

    st_messageForAdminCreateDone,
    st_messageForAdminCreateError,

    messageUserList,
    messageUserLastPage,

    st_messageUserListError,
  } = useSelector((state) => state.message);

  const {
    noticeList,
    noticeLastPage,

    noticeMyLectureList,
    noticeMyLectureLastPage,

    st_noticeMyLectureListError,

    st_noticeListError,
  } = useSelector((state) => state.notice);

  const {
    lecturePath,

    st_lectureFileLoading,
    st_lectureFileDone,
    st_lectureFileError,

    st_lectureSubmitCreateDone,
    st_lectureSubmitCreateError,

    lectureStuLectureList,
    lectureStuCommute,

    st_lectureStuLectureListError,

    lectureHomeworkStuList,
    lectureHomeworkStuLastPage,

    st_lectureHomeworkStuListError,
  } = useSelector((state) => state.lecture);

  const { bookList, bookMaxLength, st_bookListDone, st_bookListError } =
    useSelector((state) => state.book);

  ////// HOOKS //////
  const width = useWidth();
  const router = useRouter();
  const dispatch = useDispatch();

  const [updateForm] = Form.useForm();

  const formRef = useRef();

  const [form] = Form.useForm();
  const [answerform] = Form.useForm();

  const [sendform] = Form.useForm();

  const imageInput = useRef();
  const fileInput = useRef();

  const [fileName, setFileName] = useState("");
  const [filePath, setFilePath] = useState("");

  const [messageSendModal, setMessageSendModal] = useState(false);
  const [messageViewModal, setMessageViewModal] = useState(false);

  const [noticeViewModal, setNoticeViewModal] = useState(false);
  const [noticeViewDatum, setNoticeViewDatum] = useState(null);

  const [messageDatum, setMessageDatum] = useState();

  const [sendMessageType, setSendMessageType] = useState(1);
  const [sendMessageAnswerType, setSendMessageAnswerType] = useState(0);
  const [homeWorkModalToggle, setHomeWorkModalToggle] = useState(false);
  const [homeWorkData, setHomeWorkData] = useState("");

  const [bookModal, setBookModal] = useState(false);
  const [bookDetail, setBookDetail] = useState("");

  const [currentPage1, setCurrentPage1] = useState(1);
  const [currentPage2, setCurrentPage2] = useState(1);
  const [currentPage3, setCurrentPage3] = useState(1);
  const [currentPage4, setCurrentPage4] = useState(1);
  const [currentPage5, setCurrentPage5] = useState(1);

  const [attendanceModal, setAttendanceModal] = useState(false);
  const [attendanceData, setAttendanceData] = useState(null);

  const [homework, setHomework] = useState(null);
  const [homeworkModal, setHomeworkModal] = useState(false);

  const { payClassLecDetail } = useSelector((state) => state.payClass);
  const [payModal, setPayModal] = useState(false);
  const [selectPayClass, setSelectPayClass] = useState(null);

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
      title: "Subject",
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
    dispatch({
      type: LECTURE_STU_LECTURE_LIST_REQUEST,
    });

    dispatch({
      type: MESSAGE_TEACHER_LIST_REQUEST,
    });

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
      type: LECTURE_HOMEWORK_STU_LIST_REQUEST,
      data: {
        page: 1,
        search: "",
      },
    });

    dispatch({
      type: NOTICE_MY_LECTURE_LIST_REQUEST,
      data: {
        page: 1,
      },
    });
  }, [router.query]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
    if (st_bookListDone) {
      setBookModal(true);
    }
  }, [st_bookListDone]);

  useEffect(() => {
    if (st_bookListError) {
      return message.error(st_bookListError);
    }
  }, [st_bookListError]);

  useEffect(() => {
    if (st_userProfileUploadDone) {
      return message.success("ID picture successfully uploaded");
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

      return message.success("Profile successfully updated");
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
      return message.success("Message sent.");
    }
  }, [st_messageCreateDone]);

  useEffect(() => {
    if (st_messageCreateError) {
      return message.error(st_messageCreateError);
    }
  }, [st_messageCreateError]);

  useEffect(() => {
    if (st_messageForAdminCreateError) {
      return message.error(st_messageForAdminCreateError);
    }
  }, [st_messageForAdminCreateError]);

  useEffect(() => {
    if (st_messageForAdminCreateDone) {
      onReset();
      return message.success("Message sent.");
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
    if (st_lectureFileError) {
      return message.error(st_lectureFileError);
    }
  }, [st_lectureFileError]);

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
      return message.success("Submission completed");
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

  useEffect(() => {
    if (st_noticeListError) {
      return message.error(st_noticeListError);
    }
  }, [st_noticeListError]);

  useEffect(() => {
    if (st_noticeMyLectureListError) {
      return message.error(st_noticeMyLectureListError);
    }
  }, [st_noticeMyLectureListError]);

  const onReset = useCallback(() => {
    form.resetFields();
    sendform.resetFields();
    answerform.resetFields();

    setNoticeViewModal(false);
    setMessageSendModal(false);
    setMessageViewModal(false);
    setHomeWorkModalToggle(false);
    setFileName("");
    setSendMessageType(1);
    setSendMessageAnswerType(0);
  }, [fileInput]);

  ////// TOGGLE //////

  const meUpdateModalToggle = useCallback(() => {
    dispatch({
      type: ME_UPDATE_MODAL_TOGGLE,
    });
  }, [meUpdateModal]);

  const messageAnswerToggleHanlder = useCallback((data) => {
    if (data.userLevel >= 3) {
      setSendMessageAnswerType(3);
    } else {
      setSendMessageAnswerType(1);
    }
  }, []);

  const messageSendModalHandler = useCallback((data, num) => {
    setMessageSendModal((prev) => !prev);

    if (num === 1) {
      setSendMessageType(3);
    }
  }, []);

  const messageViewModalHandler = useCallback((data) => {
    setMessageViewModal((prev) => !prev);

    if (data.userLevel === 3 || data.userLevel === 4) {
      setSendMessageType(3);
    }

    setMessageDatum(data);
  }, []);

  const sendMessageTypeHandler = useCallback((num) => {
    setSendMessageType(num);
  }, []);

  const sendMessageAnswerTypeHandler = useCallback((num) => {
    setSendMessageAnswerType(num);
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
          : "Please reupload file."
      );

      fileInput.current.value = "";
    },
    [fileInput]
  );

  const meUpdateHandler = useCallback(
    (data) => {
      if (!userProfilePath || userProfilePath.trim().length === 0) {
        return message.error("Upload your ID picture.");
      }

      dispatch({
        type: USER_UPDATE_REQUEST,
        data: {
          profileImage: userProfilePath,
        },
      });
    },
    [userProfilePath]
  );

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

  const sendMessageAnswerAdminFinish = useCallback(
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

  const answerFinishHandler = useCallback(
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

  const answerLectureFinishHanlder = useCallback(
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

    [me, messageDatum]
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
      return message.error("Please upload the file.");
    }
  }, [fileName, filePath, homeWorkData, fileInput]);

  const fileDownloadHandler = useCallback(async (filePath) => {
    let blob = await fetch(filePath).then((r) => r.blob());

    const file = new Blob([blob]);

    const ext = filePath.substring(
      filePath.lastIndexOf(".") + 1,
      filePath.length
    );

    const originName = `Attachments.${ext}`;

    saveAs(file, originName);
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

  const noticeLectureChangePage = useCallback((page) => {
    setCurrentPage4(page);

    dispatch({
      type: NOTICE_MY_LECTURE_LIST_REQUEST,
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

  const stepHanlder2 = useCallback((startDate, endDate, day) => {
    // let dir = 0;

    // const save = Math.abs(
    //   moment.duration(moment().diff(moment(startDate, "YYYY-MM-DD"))).asDays()
    // );

    let check = parseInt(
      moment
        .duration(moment(endDate).diff(moment(startDate, "YYYY-MM-DD")))
        .asDays() + 1
    );

    // if (save >= check) {
    //   dir = check;
    // } else {
    //   dir = save;
    // }

    const arr = ["일", "월", "화", "수", "목", "금", "토"];
    let add = 0;

    for (let i = 0; i <= check; i++) {
      let saveDay = moment(startDate).add(i, "days").day();

      const saveResult = day.includes(arr[saveDay]);

      if (saveResult) {
        add += 1;
      }
    }

    return add;
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

  const divideLecture = useCallback((day, time) => {
    let saveDay = day.split(" ");
    let saveTime = time.split(" ");

    let textSave = "";

    saveDay.map((data, idx) => {
      if (idx === saveDay.length - 1) {
        textSave += `${data} ${
          data === "월"
            ? "Mon"
            : data === "화"
            ? "Tue"
            : data === "수"
            ? "Wed"
            : data === "목"
            ? "Thu"
            : data === "금"
            ? "Fri"
            : data === "토"
            ? "Sat"
            : data === "일"
            ? "Sun"
            : ""
        } ${saveTime[idx]}`;
      } else {
        textSave += `${data} ${
          data === "월"
            ? "Mon"
            : data === "화"
            ? "Tue"
            : data === "수"
            ? data === "Wed"
            : data === "목"
            ? "Thu"
            : data === "금"
            ? "Fri"
            : data === "토"
            ? "Sat"
            : "Sun"
        } ${saveTime[idx]} / `;
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

  const attendanceToggle = useCallback(
    (data) => {
      setAttendanceModal((prev) => !prev);
      setAttendanceData(data);
    },
    [attendanceModal]
  );

  const homeworksToggle = useCallback((data) => {
    setHomework(data);
    setHomeworkModal((prev) => !prev);
  }, []);

  const payModalToggle = useCallback(
    (data) => {
      if (payModal) {
        setPayModal(false);
        setSelectPayClass(null);
      } else {
        setPayModal(true);
        dispatch({
          type: PAY_CLASS_LEC_DETAIL_REQUEST,
          data: {
            LectureId: data.LectureId,
          },
        });
      }
    },
    [payModal]
  );
  ////// DATAVIEW //////

  const commuteColumns = [
    {
      title: `No`,
      dataIndex: `id`,
    },
    {
      title: `Time`,
      dataIndex: `time`,
    },
    {
      title: `Category `,
      dataIndex: `status`,
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
        <WholeWrapper margin={width < 900 ? `52px 0 0` : `100px 0 0`}>
          <Wrapper
            bgImg={`url("https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/student/subBanner.png")`}
            padding={width < 700 ? `30px 0` : `60px 0 140px 0`}
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
              <Wrapper width={`auto`}>
                <CommonButton
                  radius={`20px`}
                  kindOf={`subTheme3`}
                  margin={width < 900 ? `20px 0 0` : `0 0 0 20px`}
                  onClick={meUpdateModalToggle}
                >
                  <SyncOutlined /> Upload My ID picture
                </CommonButton>
              </Wrapper>
            </RsWrapper>
          </Wrapper>

          <RsWrapper margin={width < 800 ? `0` : `-94px 0 0`}>
            <Wrapper
              padding={width < 700 ? `15px 10px 10px` : `40px 30px 35px`}
              dr={`row`}
              ju={`space-between`}
              bgColor={Theme.white_C}
              shadow={`0px 2px 10px rgba(0, 0, 0, 0.05)`}
              margin={`0 0 86px`}
            >
              <Wrapper dr={`row`} ju={`space-between`} margin={`0 0 20px`}>
                <Text
                  fontSize={width < 800 ? `18px` : `22px`}
                  fontWeight={`bold`}
                >
                  <CommonTitle>My schedule</CommonTitle>
                </Text>
              </Wrapper>
              {lectureStuLectureList && lectureStuLectureList.length === 0 ? (
                <Wrapper marign={`50px 0`}>
                  <Empty description="Class Not found" />
                </Wrapper>
              ) : (
                lectureStuLectureList &&
                lectureStuLectureList.map((data, idx) => {
                  return (
                    <Wrapper
                      dr={`row`}
                      ju={`space-between`}
                      borderBottom={
                        idx + 1 !== lectureStuLectureList.length &&
                        `1px dashed ${Theme.grey_C}`
                      }
                      padding={
                        idx + 1 !== lectureStuLectureList.length
                          ? `30px 0`
                          : `30px 0 0`
                      }
                    >
                      <Wrapper width={`auto`} al={`flex-start`} key={data.id}>
                        <Wrapper
                          dr={`row`}
                          ju={`flex-start`}
                          margin={`0 0 10px`}
                        >
                          <Text fontSize={width < 800 ? `16px` : `18px`}>
                            Class number:&nbsp;
                            {data.number}
                          </Text>
                          &nbsp;
                          <Text fontSize={width < 800 ? `16px` : `18px`}>
                            ({divideLecture(data.day, data.time)})
                          </Text>
                          {/* dash */}
                          <Wrapper
                            display={width < 800 && `none`}
                            width={`1px`}
                            height={`21px`}
                            margin={`0 20px`}
                            borderRight={
                              width < 1100 ? `0` : `1px dashed ${Theme.grey_C}`
                            }
                          />
                          {/* dash */}
                          <Text fontSize={width < 800 ? `16px` : `18px`}>
                            {`${stepHanlder2(
                              moment().format("YYYY-MM-DD"),
                              // data.endDate,
                              `2022-06-19`,
                              data.day
                            )} sessons remaining out of ${stepHanlder2(
                              moment(data.PartCreatedAt).format("YYYY-MM-DD"),
                              data.endDate,
                              data.day
                            )}`}
                          </Text>
                        </Wrapper>

                        <Wrapper
                          dr={`row`}
                          width={`auto`}
                          fontSize={width < 800 ? `16px` : `18px`}
                          margin={`0 0 10px`}
                        >
                          <Text
                            margin={width < 800 ? `0 30px 0 0` : `0 80px 0 0`}
                          >
                            <SpanText fontWeight={`bold`}>From:</SpanText>
                            &nbsp;{data.PartCreatedAt.slice(0, 10)}
                          </Text>
                          <Text margin={`0 10px 0 0`}>
                            <SpanText fontWeight={`bold`}>To:</SpanText>
                            &nbsp;{data.endDate}
                          </Text>
                        </Wrapper>

                        {moment
                          .duration(
                            moment(
                              moment(data.endDate).format(`YYYY-MM-DD`)
                            ).diff(moment(moment().format(`YYYY-MM-DD`)))
                          )
                          .asDays() <= 7 && (
                          <SpanText
                            fontSize={`16px`}
                            color={Theme.subTheme2_C}
                            textDecoration={`underline`}
                            cursor={`pointer`}
                            onClick={() => payModalToggle(data)}
                          >
                            <Image
                              src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/student/icon_click.png`}
                              width={`18px`}
                              margin={`0 5px 0 0`}
                            />
                            Please click&nbsp;
                            <SpanText fontWeight={`700`}>here</SpanText> if
                            you’d like to extend you term (7 days before the new
                            term starts)
                          </SpanText>
                        )}
                      </Wrapper>

                      <CustomButton2
                        type={`primary`}
                        size={`small`}
                        onClick={() =>
                          window.open(`${data.zoomLink}`, "_blank")
                        }
                      >
                        Go to My class
                        {width > 800 && (
                          <RightCircleFilled className="btnIcon" />
                        )}
                      </CustomButton2>
                    </Wrapper>
                  );
                })
              )}
            </Wrapper>

            <Wrapper dr={`row`} ju={`flex-start`} margin={`0 0 40px`}>
              <CommonTitle>My Class</CommonTitle>

              <SpanText
                textDecoration={`underLine`}
                color={Theme.basicTheme_C}
                fontSize={`18px`}
                margin={`0 0 0 25px`}
                cursor={`pointer`}
                onClick={() => moveLinkHandler(`student/lectureAll`)}
              >
                All See
              </SpanText>
            </Wrapper>

            {lectureStuLectureList && lectureStuLectureList.length === 0 ? (
              <Wrapper margin={`50px 0`}>
                <Empty description="Not found" />
              </Wrapper>
            ) : (
              lectureStuLectureList &&
              lectureStuLectureList.slice(0, 1).map((data, idx) => {
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
                              Send message
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
                            <Button
                              type={`primary`}
                              size={`small`}
                              onClick={() => attendanceToggle(data)}
                            >
                              My Attendance
                            </Button>
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
            {/* <Wrapper
                        display={width < 1100 && `none`}
                        width={`1px`}
                        height={`190px`}
                        margin={`0 20px`}
                        borderRight={
                          width < 1100 ? `0` : `1px dashed ${Theme.grey_C}`
                        }
                      /> */}
            {/* 쪽지 버튼들 */}

            {/* <Wrapper
                        al={`flex-start`}
                        width={width < 1100 ? `100%` : `calc(30% - 80px)`}
                        margin={
                          width < 1100 && width < 800 ? `10px 0 0` : `20px 0 0`
                        }
                      >
                        <Wrapper
                          borderBottom={`1px dashed ${Theme.grey_C}`}
                          dr={`row`}
                          al={`flex-start`}
                          ju={`flex-start`}
                          padding={width < 800 ? `8px 0` : `16px 0`}
                        >
                          <Text
                            cursor={`pointer`}
                            onClick={() => messageSendModalHandler(data)}
                          >
                            수료증 신청
                          </Text>
                          <Text> | </Text>
                          <Text
                            cursor={`pointer`}
                            onClick={() => messageSendModalHandler(data)}
                          >
                            강의수 늘리기 요청
                          </Text>
                        </Wrapper>
                        <Wrapper
                          borderBottom={`1px dashed ${Theme.grey_C}`}
                          al={`flex-start`}
                          ju={`flex-start`}
                          dr={`row`}
                          padding={width < 800 ? `8px 0` : `16px 0`}
                        >
                          <Text
                            cursor={`pointer`}
                            onClick={() => messageSendModalHandler(data)}
                          >
                            결석 예고
                          </Text>
                          <Text> | </Text>
                          <Text
                            cursor={`pointer`}
                            onClick={() => messageSendModalHandler(data, 1)}
                          >
                            반이동 요청
                          </Text>
                          <Text> | </Text>
                          <Text
                            cursor={`pointer`}
                            onClick={() => messageSendModalHandler(data)}
                          >
                            줌 상담신청
                          </Text>
                        </Wrapper>
                        <Button
                          type={`primary`}
                          size={`small`}
                          style={{ marginTop: 10 }}
                          onClick={() => detailBookOpen(data)}
                        >
                          교재 리스트
                        </Button>
                      </Wrapper> */}

            <Wrapper dr={`row`} ju={`flex-start`} margin={`80px 0 20px`}>
              <CommonTitle>View your homework /&nbsp;</CommonTitle>
              <CommonTitle>submit your homework</CommonTitle>
            </Wrapper>

            <Wrapper margin={`0 0 40px`}>
              {lectureHomeworkStuList &&
                (lectureHomeworkStuList.length === 0 ? (
                  <Wrapper margin={`50px 0`}>
                    <Empty description="숙제가 없습니다." />
                  </Wrapper>
                ) : (
                  lectureHomeworkStuList &&
                  lectureHomeworkStuList.map((data, idx) => {
                    return (
                      <Wrapper
                        key={data.id}
                        dr={`row`}
                        ju={`space-between`}
                        padding={`25px`}
                        borderTop={idx === 0 && `1px solid ${Theme.grey_C}`}
                        borderBottom={`1px solid ${Theme.grey_C}`}
                      >
                        {/* 30% */}
                        <Wrapper
                          dr={`row`}
                          ju={width < 1100 ? `space-between` : `flex-start`}
                          width={width < 1100 ? `100%` : `30%`}
                          margin={width < 1100 && `0 0 10px`}
                        >
                          <Text width={width < 1100 ? `auto` : `60%`}>
                            <SpanText fontWeight={`700`}>Lecture :</SpanText>
                            &nbsp;
                            {data.course}
                          </Text>

                          <Text width={width < 1100 ? `auto` : `40%`}>
                            <SpanText fontWeight={`700`}>Lecturer :</SpanText>
                            &nbsp;
                            {data.username}님
                          </Text>
                        </Wrapper>

                        {/* 21px */}
                        {width > 1100 && (
                          <Wrapper
                            width={`1px`}
                            height={`20px`}
                            borderRight={`1px dashed ${Theme.grey_C}`}
                            margin={`0 20px 0 0`}
                          ></Wrapper>
                        )}

                        {/* 20% */}
                        <Wrapper
                          dr={`row`}
                          ju={`space-between`}
                          width={width < 1100 ? `100%` : `20%`}
                          margin={width < 1100 && `0 0 10px`}
                        >
                          <Text margin={`0 30px 0 0`}>
                            <SpanText fontWeight={`700`}>Subject :</SpanText>
                            {data.title}
                          </Text>
                          <Button
                            size={`small`}
                            type={`primary`}
                            onClick={() => homeworksToggle(data)}
                          >
                            View Content
                          </Button>
                        </Wrapper>

                        {/* 41px */}
                        {width > 1100 && (
                          <Wrapper
                            width={`1px`}
                            height={`20px`}
                            borderRight={`1px dashed ${Theme.grey_C}`}
                            margin={`0 20px`}
                          ></Wrapper>
                        )}

                        {/* 130px */}
                        <Wrapper
                          margin={width < 1100 && `0 0 10px`}
                          width={`130px`}
                          dr={`row`}
                          ju={`flex-start`}
                          onClick={() => fileDownloadHandler(data.file)}
                        >
                          <Image
                            cursor={`pointer`}
                            width={`22px`}
                            margin={width < 900 ? `0 5px 0 0` : `0 16px 0 0`}
                            src="https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_download.png"
                            alt="lecture_icon"
                          />
                          <Text cursor={`pointer`}>Download file</Text>
                        </Wrapper>

                        {/* 41px */}
                        {width > 1100 && (
                          <Wrapper
                            width={`1px`}
                            height={`20px`}
                            borderRight={`1px dashed ${Theme.grey_C}`}
                            margin={`0 20px`}
                          ></Wrapper>
                        )}
                        <Text margin={width < 1100 && `0 0 10px`}>
                          ~
                          {moment(data.date, "YYYY/MM/DD").format("YYYY/MM/DD")}
                        </Text>
                        <Wrapper width={width < 1100 ? `100%` : `210px`}>
                          <CustomButton
                            type={`primary`}
                            style={
                              width < 1100
                                ? { width: `100%` }
                                : { width: `auto` }
                            }
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
                            }
                          >
                            {moment
                              .duration(
                                moment(data.date, "YYYY-MM-DD").diff(
                                  moment(new Date(), "YYYY-MM-DD")
                                )
                              )
                              .asDays() < -1
                              ? "Submission period expired"
                              : "Submit"}
                          </CustomButton>
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

            <Wrapper
              dr={width < 700 ? ` column` : `row`}
              ju={width < 700 ? `center` : `space-between`}
              al={`flex-start`}
              margin={`50px 0 20px 0`}
            >
              <CommonTitle>Class / Bulletin Board</CommonTitle>
            </Wrapper>

            <Wrapper margin={`0 0 40px`}>
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
                  No
                </Text>
                <Text
                  fontSize={width < 700 ? `14px` : `18px`}
                  fontWeight={`Bold`}
                  width={width < 800 ? `25%` : `10%`}
                >
                  Date
                </Text>
                <Text
                  fontSize={width < 700 ? `14px` : `18px`}
                  fontWeight={`Bold`}
                  width={width < 800 ? `45%` : `70%`}
                >
                  Subject
                </Text>
                <Text
                  fontSize={width < 700 ? `14px` : `18px`}
                  fontWeight={`Bold`}
                  width={width < 800 ? `15%` : `10%`}
                >
                  Writer
                </Text>
              </Wrapper>
              {noticeMyLectureList &&
                (noticeMyLectureList.length === 0 ? (
                  <Wrapper margin={`50px 0`}>
                    <Empty description="No announcement" />
                  </Wrapper>
                ) : (
                  noticeMyLectureList.map((data, idx) => {
                    return (
                      <CustomTableHoverWrapper
                        onClick={() => onClickNoticeHandler(data)}
                        key={data.id}
                        bgColor={idx % 2 === 0}
                      >
                        <Wrapper width={width < 800 ? `15%` : `10%`}>
                          {data.id}
                        </Wrapper>
                        <Wrapper width={width < 800 ? `25%` : `10%`}>
                          {moment(data.createdAt, "YYYY/MM/DD").format(
                            "YYYY/MM/DD"
                          )}
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
                      </CustomTableHoverWrapper>
                    );
                  })
                ))}
            </Wrapper>
            <CustomPage
              size="small"
              current={currentPage4}
              total={noticeMyLectureLastPage * 10}
              onChange={(page) => noticeLectureChangePage(page)}
            />

            <Wrapper al={`flex-start`} margin={`86px 0 20px`}>
              <CommonTitle>School / Bulletin Board</CommonTitle>
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
              >
                No
              </Text>
              <Text
                fontSize={width < 700 ? `14px` : `18px`}
                fontWeight={`Bold`}
                width={width < 800 ? `25%` : `10%`}
              >
                Date
              </Text>
              <Text
                fontSize={width < 700 ? `14px` : `18px`}
                fontWeight={`Bold`}
                width={width < 800 ? `45%` : `70%`}
              >
                Subject
              </Text>
              <Text
                fontSize={width < 700 ? `14px` : `18px`}
                fontWeight={`Bold`}
                width={width < 800 ? `15%` : `10%`}
              >
                Writer
              </Text>
            </Wrapper>
            <Wrapper margin={`0 0 40px`}>
              {noticeList &&
                (noticeList.length === 0 ? (
                  <Wrapper margin={`50px 0`}>
                    <Empty description="No announcement" />
                  </Wrapper>
                ) : (
                  noticeList.map((data, idx) => {
                    return (
                      <CustomTableHoverWrapper
                        onClick={() => onClickNoticeHandler(data)}
                        key={data.id}
                        bgColor={idx % 2 === 0}
                      >
                        <Wrapper width={width < 800 ? `15%` : `10%`}>
                          {data.id}
                        </Wrapper>
                        <Wrapper width={width < 800 ? `25%` : `10%`}>
                          {moment(data.createdAt, "YYYY/MM/DD").format(
                            "YYYY/MM/DD"
                          )}
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
                      </CustomTableHoverWrapper>
                    );
                  })
                ))}
            </Wrapper>

            <CustomPage
              size="small"
              current={currentPage1}
              total={noticeLastPage * 10}
              onChange={(page) => noticeChangePage(page)}
            />

            <Wrapper al={`flex-start`} margin={`86px 0 20px`}>
              <CommonTitle>Message to / from my teacher / admin </CommonTitle>
            </Wrapper>

            <Wrapper>
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
                  width={width < 800 ? `25%` : `10%`}
                >
                  Date
                </Text>
                <Text
                  fontSize={width < 700 ? `14px` : `18px`}
                  fontWeight={`Bold`}
                  width={width < 800 ? `45%` : `70%`}
                >
                  Subject
                </Text>
                <Text
                  fontSize={width < 700 ? `14px` : `18px`}
                  fontWeight={`Bold`}
                  width={width < 800 ? `15%` : `10%`}
                >
                  Writer
                </Text>
              </Wrapper>

              {messageUserList &&
                (messageUserList.length === 0 ? (
                  <Wrapper margin={`50px 0`}>
                    <Empty description="No message" />
                  </Wrapper>
                ) : (
                  messageUserList.map((data, idx) => {
                    return (
                      <CustomTableHoverWrapper
                        key={data.id}
                        bgColor={idx % 2 === 0}
                        onClick={() => messageViewModalHandler(data)}
                      >
                        <Wrapper width={width < 800 ? `15%` : `10%`}>
                          {data.id}
                        </Wrapper>
                        <Wrapper width={width < 800 ? `25%` : `10%`}>
                          {moment(data.createdAt, "YYYY/MM/DD").format(
                            "YYYY/MM/DD"
                          )}
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
                      </CustomTableHoverWrapper>
                    );
                  })
                ))}
            </Wrapper>

            <Wrapper al={`flex-end`} margin={`20px 0 40px`}>
              <CommonButton
                radius={`5px`}
                onClick={() => messageSendModalHandler()}
              >
                Send message
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
                <Wrapper width={width < 800 ? `25%` : `10%`}>Date</Wrapper>
              </Wrapper>
              {preparationArr &&
                (preparationArr.length === 0 ? (
                  <Wrapper>
                    <Empty description="No announcement" />
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
            width={`900px`}
            title="Announcement"
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
                {`Writer: ${noticeViewDatum && noticeViewDatum.author}`}
              </Text>
              <Wrapper width={`auto`}>
                <Text>
                  <CalendarOutlined style={{ color: Theme.basicTheme_C }} />
                  &nbsp;
                  {`${moment(
                    noticeViewDatum && noticeViewDatum.createdAt,
                    "YYYY/MM/DD"
                  ).format("YYYY/MM/DD")}`}
                </Text>
              </Wrapper>
            </Wrapper>

            {noticeViewDatum && noticeViewDatum.file && (
              <Wrapper dr={`row`} ju={`flex-end`}>
                <Text margin={`0 10px 0 0`} fontSize={`15px`}>
                  Attachments
                </Text>

                <CommonButton
                  size={`small`}
                  radius={`5px`}
                  fontSize={`14px`}
                  onClick={() => fileDownloadHandler(noticeViewDatum.file)}
                >
                  Download
                </CommonButton>
              </Wrapper>
            )}

            <Text fontSize={`18px`} fontWeight={`bold`}>
              Subject
            </Text>
            <Wrapper
              padding={`10px`}
              bgColor={Theme.subTheme9_C}
              margin={`5px 0 10px`}
            >
              <WordbreakText fontSize={width < 700 ? "14px" : "16px"}>
                {noticeViewDatum && noticeViewDatum.title}
              </WordbreakText>
            </Wrapper>

            <Text fontSize={`18px`} fontWeight={`bold`}>
              Content
            </Text>
            <Wrapper padding={`10px`} bgColor={Theme.subTheme9_C}>
              <WordbreakText
                fontSize={width < 700 ? "14px" : "16px"}
                dangerouslySetInnerHTML={{
                  __html: noticeViewDatum && noticeViewDatum.content,
                }}
              ></WordbreakText>
            </Wrapper>

            <Wrapper margin={`20px 0 0`}>
              <CommonButton
                onClick={() => onReset()}
                kindOf={`grey`}
                color={Theme.darkGrey_C}
                radius={`5px`}
              >
                Go back
              </CommonButton>
            </Wrapper>
          </CustomModal>

          <CustomModal
            visible={messageViewModal}
            width={`900px`}
            title={
              sendMessageAnswerType === 0
                ? "쪽지 보기"
                : sendMessageAnswerType === 1
                ? "Message to my teacher"
                : sendMessageAnswerType === 2
                ? "Message to my lecture"
                : sendMessageAnswerType === 3 && "Message to admin"
            }
            footer={null}
            closable={false}
          >
            <CustomForm
              form={answerform}
              onFinish={(data) =>
                sendMessageAnswerType === 1
                  ? answerFinishHandler(data)
                  : sendMessageAnswerType === 2
                  ? answerLectureFinishHanlder(data, messageTeacherList)
                  : sendMessageAnswerType === 3 &&
                    sendMessageAnswerAdminFinish(data)
              }
            >
              {sendMessageAnswerType !== 0 && (
                <Wrapper dr={`row`} ju={`flex-end`}>
                  <CommonButton
                    margin={`0 0 0 5px`}
                    radius={`5px`}
                    width={`100px`}
                    height={`32px`}
                    size="small"
                    onClick={() => sendMessageAnswerTypeHandler(1)}
                  >
                    {"to my teacher"}
                  </CommonButton>

                  {/* <CommonButton
                    margin={`0 0 0 5px`}
                    radius={`5px`}
                    width={`100px`}
                    height={`32px`}
                    size="small"
                    onClick={() => sendMessageAnswerTypeHandler(2)}
                  >
                    {"수업"}
                  </CommonButton> */}

                  <CommonButton
                    margin={`0 0 0 5px`}
                    radius={`5px`}
                    width={`100px`}
                    height={`32px`}
                    size="small"
                    onClick={() => sendMessageAnswerTypeHandler(3)}
                  >
                    {"to admin"}
                  </CommonButton>
                </Wrapper>
              )}

              {sendMessageAnswerType === 1 && (
                <>
                  <Text fontSize={`18px`} fontWeight={`bold`} margin={`10px 0`}>
                    My classes
                  </Text>

                  <Form.Item
                    name="lectureStuLectureList"
                    rules={[
                      {
                        required: true,
                        message: "Choose your class.",
                      },
                    ]}
                  >
                    <Select style={{ width: `100%` }}>
                      {lectureStuLectureList &&
                      lectureStuLectureList.length === 0 ? (
                        <Option value="No class found">No class found</Option>
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
                    This message will be sent to your teacher.
                  </Text>
                </>
              )}

              {sendMessageAnswerType === 2 && (
                <>
                  <Text fontSize={`18px`} fontWeight={`bold`} margin={`10px 0`}>
                    My classes
                  </Text>

                  <Form.Item
                    name="lectureStuLectureList"
                    rules={[
                      {
                        required: true,
                        message: "Choose your class.",
                      },
                    ]}
                  >
                    <Select style={{ width: `100%` }}>
                      {lectureStuLectureList &&
                      lectureStuLectureList.length === 0 ? (
                        <Option value="No class found">No class found</Option>
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
                    This message will be sent to your teacher
                  </Text>
                </>
              )}
              {sendMessageAnswerType !== 0 && (
                <>
                  <Text fontSize={`18px`} fontWeight={`bold`}>
                    Subject
                  </Text>
                  <Form.Item
                    name="title"
                    rules={[
                      { required: true, message: "제목을 입력해주세요." },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Text fontSize={`18px`} fontWeight={`bold`}>
                    Content
                  </Text>
                  <Form.Item
                    name="content"
                    rules={[
                      { required: true, message: "내용을 입력해주세요." },
                    ]}
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
                      Go back
                    </CommonButton>
                    <CommonButton
                      margin={`0 0 0 5px`}
                      radius={`5px`}
                      htmlType="submit"
                    >
                      Send message
                    </CommonButton>
                  </Wrapper>
                </>
              )}
            </CustomForm>

            {sendMessageAnswerType === 0 && (
              <>
                <Wrapper
                  dr={`row`}
                  ju={`space-between`}
                  margin={`0 0 35px`}
                  fontSize={width < 700 ? "14px" : "16px"}
                >
                  <Text margin={`0 54px 0 0`}>
                    {`Writer: ${messageDatum && messageDatum.author}`}
                  </Text>
                  <Text>{`Date ${
                    messageDatum &&
                    moment(messageDatum.createdAt, "YYYY/MM/DD").format(
                      "YYYY/MM/DD"
                    )
                  }`}</Text>
                </Wrapper>
                <Text fontSize={`18px`} fontWeight={`bold`}>
                  Subject
                </Text>
                <Wrapper
                  padding={`10px`}
                  al={`flex-start`}
                  fontSize={width < 700 ? "14px" : "16px"}
                  bgColor={Theme.subTheme9_C}
                  margin={`5px 0 10px`}
                >
                  <Text>{messageDatum && messageDatum.title}</Text>
                </Wrapper>
                <Text fontSize={`18px`} fontWeight={`bold`}>
                  Content
                </Text>
                <Wrapper
                  padding={`10px`}
                  al={`flex-start`}
                  fontSize={width < 700 ? "14px" : "16px"}
                  bgColor={Theme.subTheme9_C}
                >
                  <Text minHeight={`150px`}>
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
                    onClick={() => onReset()}
                  >
                    Go back
                  </CommonButton>

                  <CommonButton
                    onClick={() => messageAnswerToggleHanlder(messageDatum)}
                    margin={`0 0 0 5px`}
                    radius={`5px`}
                  >
                    Send Message
                  </CommonButton>
                </Wrapper>
              </>
            )}
          </CustomModal>

          <CustomModal
            width={`700px`}
            visible={meUpdateModal}
            footer={null}
            title={"Upload My ID picture"}
            onCancel={meUpdateModalToggle}
          >
            <ProfileWrapper>
              <GuideWrapper>
                <GuideText>
                  The size of your ID picture should be {PROFILE_WIDTH}px x
                  &nbsp;
                  {PROFILE_HEIGHT}px.
                </GuideText>
                <GuideText>Check the size of your picture.</GuideText>
              </GuideWrapper>

              <ProfileImage
                src={
                  userProfilePath
                    ? `${userProfilePath}`
                    : `https://via.placeholder.com/${PROFILE_WIDTH}x${PROFILE_HEIGHT}`
                }
                alt="main_GALLEY_image"
              />
              <PreviewGuide>{userProfilePath && `Image preview`}</PreviewGuide>

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
                  width={`100%`}
                  onClick={clickImageUpload}
                  loading={st_userProfileUploadLoading}
                  radius={`5px`}
                >
                  UPLOAD
                </CommonButton>
              </UploadWrapper>
            </ProfileWrapper>

            <CustomForm form={updateForm} onFinish={meUpdateHandler}>
              <Wrapper al={`flex-end`} margin={`10px 0 0 0`}>
                <CommonButton
                  kindOf={`subTheme3`}
                  height={`40px`}
                  radius={`5px`}
                  htmlType="submit"
                >
                  <SyncOutlined /> Upload My ID picture
                </CommonButton>
              </Wrapper>
            </CustomForm>
          </CustomModal>

          <CustomModal
            visible={homeWorkModalToggle}
            width={`900px`}
            title="Submit homework"
            footer={null}
            closable={false}
          >
            <Text
              fontSize={width < 700 ? `14px` : `18px`}
              fontWeight={`bold`}
              margin={`0 0 10px`}
            >
              Subject
            </Text>
            <Text fontSize={width < 700 ? `14px` : `18px`} margin={`0 0 10px`}>
              {homeWorkData && homeWorkData.title}
            </Text>

            <Text
              fontSize={width < 700 ? `14px` : `18px`}
              fontWeight={`bold`}
              margin={`0 0 10px`}
            >
              Content
            </Text>

            <Text fontSize={width < 700 ? `14px` : `18px`} margin={`0 0 10px`}>
              {homeWorkData && homeWorkData.content}
            </Text>

            <CustomForm
              ref={formRef}
              form={form}
              onFinish={homeWorkFinishHandler}
            >
              <Text
                fontSize={width < 700 ? `14px` : `18px`}
                fontWeight={`bold`}
              >
                Upload file
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
                  }}
                >
                  Upload file
                </Button>
                <Text>{`${fileName}`}</Text>
              </Wrapper>

              <Wrapper dr={`row`}>
                <CommonButton
                  margin={`0 5px 0 0`}
                  kindOf={`grey`}
                  color={Theme.darkGrey_C}
                  radius={`5px`}
                  onClick={() => onReset()}
                >
                  Go back
                </CommonButton>
                <CommonButton
                  margin={`0 0 0 5px`}
                  radius={`5px`}
                  htmlType="submit"
                >
                  Submit
                </CommonButton>
              </Wrapper>
            </CustomForm>
          </CustomModal>

          <CustomModal
            visible={messageSendModal}
            width={`900px`}
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
                    ? "Message to my teacher"
                    : sendMessageType === 2
                    ? "Message to my lecture"
                    : sendMessageType === 3 && "Message to admin"}
                </Text>
                <Wrapper dr={`row`} width={`auto`}>
                  <MessageSelectButton
                    className={sendMessageType === 1 && `active`}
                    size="small"
                    onClick={() => sendMessageTypeHandler(1)}
                  >
                    {"to my teacher"}
                  </MessageSelectButton>

                  {/* <MessageSelectButton
                    className={sendMessageType === 2 && `active`}
                    margin={width < 800 ? `0 0 0 5px` : `0 0 0 8px`}
                    size="small"
                    onClick={() => sendMessageTypeHandler(2)}
                  >
                    {"수업"}
                  </MessageSelectButton> */}

                  <MessageSelectButton
                    className={sendMessageType === 3 && `active`}
                    margin={width < 800 ? `0 10px 0 5px` : `0 40px 0 8px`}
                    size="small"
                    onClick={() => sendMessageTypeHandler(3)}
                  >
                    {"to admin"}
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
              form={sendform}
              onFinish={(data) =>
                sendMessageType === 1
                  ? sendMessageFinishHandler(data)
                  : sendMessageType === 2
                  ? sendMessageLectureFinishHanlder(data)
                  : sendMessageType === 3 && sendMessageAdminFinishHandler(data)
              }
            >
              {sendMessageType === 1 && (
                <>
                  <Text fontSize={`18px`} fontWeight={`bold`} margin={`10px 0`}>
                    My classes
                  </Text>

                  <Form.Item
                    name="lectureStuLectureList"
                    rules={[
                      {
                        required: true,
                        message: "Choose your class.",
                      },
                    ]}
                  >
                    <MessageModalSelect style={{ width: `100%` }}>
                      {lectureStuLectureList &&
                      lectureStuLectureList.length === 0 ? (
                        <Option value="No class found">No class found</Option>
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
                    </MessageModalSelect>
                  </Form.Item>
                  <Text
                    fontSize={`14px`}
                    color={Theme.grey2_C}
                    margin={`0 0 20px`}
                  >
                    This message will be sent to your teacher.
                  </Text>
                </>
              )}

              {sendMessageType === 2 && (
                <>
                  <Text fontSize={`18px`} fontWeight={`bold`} margin={`10px 0`}>
                    My classes
                  </Text>

                  <Form.Item
                    name="lectureStuLectureList"
                    rules={[
                      {
                        required: true,
                        message: "Choose your class.",
                      },
                    ]}
                  >
                    <MessageModalSelect>
                      {lectureStuLectureList &&
                      lectureStuLectureList.length === 0 ? (
                        <Option value="No class found">No class found</Option>
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
                    </MessageModalSelect>
                  </Form.Item>
                  <Text
                    fontSize={`14px`}
                    color={Theme.grey2_C}
                    margin={`0 0 20px`}
                  >
                    This message will be sent to your teacher
                  </Text>
                </>
              )}

              <Text fontSize={`18px`} fontWeight={`bold`}>
                Subject
              </Text>
              <Form.Item
                name="title"
                rules={[{ required: true, message: "제목을 입력해주세요." }]}
              >
                <Input />
              </Form.Item>
              <Text fontSize={`18px`} fontWeight={`bold`}>
                Content
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
                  Go back
                </CommonButton>
                <CommonButton
                  margin={`0 0 0 5px`}
                  radius={`5px`}
                  htmlType="submit"
                >
                  Send message
                </CommonButton>
              </Wrapper>
            </CustomForm>
          </CustomModal>

          <Modal
            visible={bookModal}
            footer={null}
            onCancel={detailBookClose}
            width={width < 700 ? `100%` : 700}
          >
            <Wrapper al={`flex-start`}>
              <Text margin={`0 0 20px`} fontSize={`18px`} fontWeight={`700`}>
                List of class materials
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
          <Modal
            visible={attendanceModal}
            onCancel={() => attendanceToggle(null)}
            footer={null}
            title={`My Attandance`}
          >
            <Table
              dataSource={
                lectureStuCommute &&
                lectureStuCommute.filter((data) => data.LectureId === data.id)
              }
              columns={commuteColumns}
            />
          </Modal>

          <CustomModal
            visible={homeworkModal}
            title="Homework Content"
            width={width < 700 ? `100%` : 700}
            footer={null}
            closable={false}
          >
            <Text
              fontSize={width < 700 ? `14px` : `18px`}
              fontWeight={`bold`}
              margin={`0 0 10px`}
            >
              Subject
            </Text>
            <CustomInput
              width={`100%`}
              value={homework && homework.title}
              disabled
            />
            <br />
            <br />
            <Text
              fontSize={width < 700 ? `14px` : `18px`}
              fontWeight={`bold`}
              margin={`0 0 10px`}
            >
              Content
            </Text>
            <CusotmTextArea value={homework && homework.content} disabled />
            <br />
            <br />
            <Text
              fontSize={width < 700 ? `14px` : `18px`}
              fontWeight={`bold`}
              margin={`0 0 10px`}
            >
              Date
            </Text>

            <Wrapper dr={`row`} ju={`flex-start`}>
              <CustomInput
                value={homework && homework.date + "까지"}
                style={{
                  height: `40px`,
                }}
                disabled
              />
            </Wrapper>
            <Wrapper dr={`row`} margin={`20px 0 0`}>
              <CommonButton
                margin={`0 5px 0 0`}
                kindOf={`grey`}
                color={Theme.darkGrey_C}
                radius={`5px`}
                onClick={() => homeworksToggle(null)}
              >
                Go back
              </CommonButton>
            </Wrapper>
          </CustomModal>
          <Modal
            title={`추가 결제`}
            visible={payModal}
            footer={null}
            onCancel={payModalToggle}
          >
            <Wrapper dr={`row`} ju={`flex-start`} margin={`0 0 10px`}>
              <Text width={`80px`}>강의명 :&nbsp;</Text>
              <CustomSelect onSelect={(e) => setSelectPayClass(e)}>
                {payClassLecDetail &&
                  payClassLecDetail.map((data) => {
                    return (
                      <Select.Option key={data.id} value={JSON.stringify(data)}>
                        {data.name}
                      </Select.Option>
                    );
                  })}
              </CustomSelect>
            </Wrapper>
            {selectPayClass && (
              <>
                <Wrapper dr={`row`} ju={`flex-start`} margin={`0 0 10px`}>
                  <Text width={`80px`}>메모 :&nbsp;</Text>
                  <Wrapper
                    width={`calc(100% - 80px)`}
                    ju={`flex-start`}
                    al={`flex-start`}
                  >
                    {selectPayClass &&
                      JSON.parse(selectPayClass)
                        .memo.split(`\n`)
                        .map((content, idx) => {
                          return (
                            <SpanText>
                              {content}
                              <br />
                            </SpanText>
                          );
                        })}
                  </Wrapper>
                </Wrapper>

                <Wrapper dr={`row`} ju={`flex-start`} margin={`0 0 10px`}>
                  <Text width={`80px`}>가격 :&nbsp;</Text>
                  <Wrapper
                    width={`calc(100% - 80px)`}
                    ju={`flex-start`}
                    al={`flex-start`}
                  >
                    ${selectPayClass && JSON.parse(selectPayClass).price}
                  </Wrapper>
                </Wrapper>

                {selectPayClass && JSON.parse(selectPayClass).discount !== 0 && (
                  <Wrapper dr={`row`} ju={`flex-start`} margin={`0 0 10px`}>
                    <Text width={`80px`}>할인율 :&nbsp;</Text>
                    <Wrapper
                      width={`calc(100% - 80px)`}
                      ju={`flex-start`}
                      al={`flex-start`}
                    >
                      {selectPayClass && JSON.parse(selectPayClass).discount}%
                    </Wrapper>
                  </Wrapper>
                )}

                <Wrapper dr={`row`} ju={`flex-start`} margin={`0 0 10px`}>
                  <Text width={`80px`}>강의 기간 :&nbsp;</Text>
                  <Wrapper
                    width={`calc(100% - 80px)`}
                    ju={`flex-start`}
                    al={`flex-start`}
                  >
                    {selectPayClass && JSON.parse(selectPayClass).week}주
                  </Wrapper>
                </Wrapper>

                <Wrapper dr={`row`} ju={`flex-start`} margin={`0 0 10px`}>
                  <Text width={`80px`}>결제할 가격 :&nbsp;</Text>
                  <Wrapper
                    width={`calc(100% - 80px)`}
                    ju={`flex-start`}
                    al={`flex-start`}
                  >
                    $
                    {selectPayClass &&
                      Math.floor(
                        JSON.parse(selectPayClass).price -
                          (JSON.parse(selectPayClass).price *
                            JSON.parse(selectPayClass).discount) /
                            100
                      )}
                  </Wrapper>
                </Wrapper>
              </>
            )}
            <Wrapper>
              <CommonButton
                size={`small`}
                type={`primary`}
                onClick={() =>
                  moveLinkHandler(
                    `/payment/${
                      selectPayClass && JSON.parse(selectPayClass).id
                    }`
                  )
                }
              >
                결제하러 가기
              </CommonButton>
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

    // 구현부 종료
    context.store.dispatch(END);
    console.log("🍀 SERVER SIDE PROPS END");
    await context.store.sagaTask.toPromise();
  }
);

export default Student;
