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
  LECTURE_TEACHER_LIST_REQUEST,
  LECTURE_LINK_UPDATE_REQUEST,
} from "../../reducers/lecture";
import {
  message,
  Pagination,
  Modal,
  Form,
  Empty,
  Input,
  Select,
  Button,
  Spin,
} from "antd";
import {
  SyncOutlined,
  UserOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import useWidth from "../../hooks/useWidth";
import ClientLayout from "../../components/ClientLayout";
import {
  RsWrapper,
  WholeWrapper,
  Wrapper,
  Image,
  Text,
  SpanText,
  TextInput,
  CommonButton,
  CommonTitle,
} from "../../components/commonComponents";
import Theme from "../../components/Theme";
import {
  NOTICE_LECTURE_LIST_REQUEST,
  NOTICE_LIST_REQUEST,
} from "../../reducers/notice";
import {
  MESSAGE_ALL_LIST_REQUEST,
  MESSAGE_CREATE_REQUEST,
  MESSAGE_SENDER_LIST_REQUEST,
  MESSAGE_USER_LIST_REQUEST,
} from "../../reducers/message";
import { saveAs } from "file-saver";
import {
  BOOK_ALL_LIST_REQUEST,
  BOOK_CREATE_REQUEST,
  BOOK_UPLOAD_REQUEST,
  BOOK_UPLOAD_TH_REQUEST,
} from "../../reducers/book";
import useInput from "../../hooks/useInput";
import {
  NORMAL_NOTICE_LIST_REQUEST,
  NORMAL_NOTICE_MODAL_TOGGLE,
  NORMAL_NOTICE_STU_CREATE_REQUEST,
  NORMAL_NOTICE_TEACHER_CREATE_REQUEST,
} from "../../reducers/normalNotice";
import ToastEditorComponentMix from "../../components/editor/ToastEditorComponentMix";
import TeacherNormalNotice from "../../components/normalNotice/TeacherNormalNotice";

const PROFILE_WIDTH = `150`;
const PROFILE_HEIGHT = `150`;

const TopButton = styled(Wrapper)`
  width: calc(100% / 4 - 10px);
  padding: 20px 0;
  flex-direction: row;
  font-size: 16px;
  font-family: "LeferiPoint-BlackObliqueA";
  background: ${Theme.subTheme9_C};
  border-radius: 10px;
  cursor: pointer;

  & .noHover,
  .hover {
    transition: 0.5s;
  }

  & .hover {
    opacity: 0;
  }

  &:hover {
    & .noHover {
      opacity: 0;
    }

    & .hover {
      opacity: 1;
    }
    background: ${Theme.subTheme14_C};
    color: ${Theme.basicTheme_C};
  }

  @media (max-width: 700px) {
    width: calc(100% / 2 - 10px);
    margin: 0 0 10px;
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

const CustomButton = styled.button`
  width: calc(100% / 4 - 30px);
  color: ${Theme.black_3C};
  font-size: 18px;
  margin: 0 30px 0 0;
  height: 70px;
  border: none;
  background-color: ${Theme.white_C};
  border: 1px solid ${Theme.basicTheme_C};
  box-shadow: 0px 0px 5px rgb(0, 0, 0, 0.16);
  cursor: pointer;

  &:hover {
    transition: all 0.2s;
    border: 1px solid ${Theme.basicTheme_C};
    background-color: ${Theme.basicTheme_C};
    color: ${Theme.white_C};
  }

  @media (max-width: 700px) {
    font-size: 14px;
    width: calc(100% / 2 - 10px);
    margin: 10px 10px 0 0;
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

const CustomText3 = styled(Text)`
  font-size: 18px;
  font-weight: Bold;
  margin: 0 20px 0 0;

  &::before {
    content: "";
    margin: 0 20px 0 0;
    border-right: 1px dashed ${Theme.grey_C};
    color: ${Theme.grey_C};
  }

  @media (max-width: 700px) {
    font-size: 14px;
    &::before {
      margin: 0 10px;
    }
  }
`;

const Name = styled(Text)`
  margin: 0 25px 0 0;

  &::after {
    content: "•";
    margin: 0 0 0 25px;
  }

  &:last-child {
    margin: 0;

    &::after {
      display: none;
    }
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

const CustomInput = styled(TextInput)`
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

const ProfileWrapper = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ProfileImage = styled.img`
  width: 150px;
  height: 150px;
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

const WordbreakText = styled(Text)`
  width: 100%;
  word-wrap: break-all;
`;

const FileBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

const Index = () => {
  ////// GLOBAL STATE //////
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
    lectureTeacherList,
    lectureTeacherStudents,
    st_lectureTeacherListError,

    st_lectureLinkUpdateDone,
    st_lectureLinkUpdateError,
  } = useSelector((state) => state.lecture);

  const {
    noticeList,
    noticeLastPage,
    st_noticeListDone,
    st_noticeListError,

    noticeLectureList,
    noticeLectureLastPage,
    st_noticeLectureListError,
  } = useSelector((state) => state.notice);

  const {
    normalNoticeList,
    normalNoticeLastPage,
    normalNoticeModal,
    //
    normalNoticeListLoading,
    normalNoticeListError,
    //
    normalNoticeTeacherCreateLoading,
    normalNoticeTeacherCreateDone,
    normalNoticeTeacherCreateError,
  } = useSelector((state) => state.normalNotice);

  const {
    messageUserList,
    messageUserLastPage,

    st_messageUserListError,

    st_messageCreateDone,
    st_messageCreateError,

    messageAllList,
    messageAllLastPage,

    st_messageAllListError,

    messageSenderList,
    messageSenderLastPage,
  } = useSelector((state) => state.message);

  const {
    uploadPath,
    uploadPathTh,
    st_bookAllListDone,
    st_bookAllListError,

    st_bookCreateDone,
    st_bookCreateError,

    st_bookUploadLoading,
    st_bookUploadDone,
    st_bookUploadError,

    st_bookUploadThLoading,
    st_bookUploadThDone,
    st_bookUploadThError,
  } = useSelector((state) => state.book);

  useEffect(() => {
    if (st_bookUploadDone) {
      return message.success("파일을 업로드 했습니다.");
    }
  }, [st_bookUploadDone]);

  ////// HOOKS //////

  const width = useWidth();
  const router = useRouter();
  const dispatch = useDispatch();

  const [updateForm] = Form.useForm();
  const [zoomLinkForm] = Form.useForm();
  const [answerform] = Form.useForm();
  const [textBookUploadform] = Form.useForm();
  const [form] = Form.useForm();

  const [currentPage1, setCurrentPage1] = useState(1);
  const [currentPage2, setCurrentPage2] = useState(1);
  const [currentPage3, setCurrentPage3] = useState(1);
  const [currentPage4, setCurrentPage4] = useState(1);
  const [currentPage5, setCurrentPage5] = useState(1);
  const [currentPage6, setCurrentPage6] = useState(1);

  const [zoomLinkToggle, setZoomLinkToggle] = useState(false);
  const [messageViewToggle, setMessageViewToggle] = useState(false);
  const [senderModal, setSenderModal] = useState(false);
  const [messageAnswerModal, setMessageAnswerModal] = useState(false);

  const [noticeViewModal, setNoticeViewModal] = useState(false);
  const [noticeViewDatum, setNoticeViewDatum] = useState(null);

  const [textbookToggle, setTextbookToggle] = useState(false);
  const [textbookData, setTextbookData] = useState("");

  const [selectLectureValue, setSelectLectureValue] = useState("");

  const [lectureId, setLectureId] = useState("");

  const [thumbnail, setThumbnail] = useState("");

  const filename = useInput("");

  const imageInput = useRef();
  const fileRef = useRef();
  const fileRef2 = useRef();

  const [messageDatum, setMessageDatum] = useState();

  const [currentModalStage, setCurrentModalStage] = useState(null);
  const [currentModalLevel, setCurrentModalLevel] = useState(null);
  const [currentModalKinds, setCurrentModalKinds] = useState(null);

  const textbookModalHandler = useCallback((data) => {
    setTextbookToggle((prev) => !prev);
    setTextbookData(data);
  }, []);

  ////// REDUX //////
  ////// USEEFFECT //////

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    dispatch({
      type: MESSAGE_ALL_LIST_REQUEST,
    });
  }, [router.query]);

  useEffect(() => {
    if (st_bookAllListDone) {
    }
  }, [st_bookAllListDone]);

  useEffect(() => {
    if (st_bookAllListError) {
      return message.error(st_bookAllListError);
    }
  }, [st_bookAllListError]);

  useEffect(() => {
    if (st_bookCreateError) {
      return message.error(st_bookCreateError);
    }
  }, [st_bookCreateError]);

  useEffect(() => {
    if (st_bookCreateDone) {
      onReset();
      textbookModalHandler(null);
      setTextbookToggle(false);
      return message.success("교재 등록이 완료되었습니다.");
    }
  }, [st_bookCreateDone]);

  useEffect(() => {
    dispatch({
      type: LECTURE_TEACHER_LIST_REQUEST,
      data: {
        TeacherId: me && me.id,
      },
    });
  }, [me]);

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
        postNum: me.postNum,
        address: me.address,
        detailAddress: me.detailAddress,
        teaLanguage: me.teaLanguage,
        teaCountry: me.teaCountry,
        bankNo: me.bankNo,
        bankName: me.bankName,
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
    if (st_messageUserListError) {
      return message.error(st_messageUserListError);
    }
  }, [st_messageUserListError]);

  useEffect(() => {
    dispatch({
      type: MESSAGE_USER_LIST_REQUEST,
      data: {
        page: 1,
      },
    });
    dispatch({
      type: MESSAGE_SENDER_LIST_REQUEST,
      data: {
        page: 1,
      },
    });
  }, [router.query]);

  useEffect(() => {
    if (st_lectureLinkUpdateDone) {
      zoomLinkModalToggle();

      dispatch({
        type: LECTURE_TEACHER_LIST_REQUEST,
        data: {
          TeacherId: me && me.id,
        },
      });

      return message.success("줌 링크를 등록하였습니다.");
    }
  }, [st_lectureLinkUpdateDone]);

  useEffect(() => {
    if (st_lectureLinkUpdateError) {
      return message.error(st_lectureLinkUpdateError);
    }
  }, [st_lectureLinkUpdateError]);

  useEffect(() => {
    if (st_noticeListDone) {
    }
  }, [st_noticeListDone]);

  useEffect(() => {
    if (st_noticeListError) {
      return message.error(st_noticeListError);
    }
  }, [st_noticeListError]);

  useEffect(() => {
    if (st_lectureTeacherListError) {
      return message.error(st_lectureTeacherListError);
    }
  }, [st_lectureTeacherListError]);

  useEffect(() => {
    if (st_messageCreateError) {
      return message.error(st_messageCreateError);
    }
  }, [st_messageCreateError]);

  useEffect(() => {
    if (st_messageCreateDone) {
      onReset();
      return message.success("쪽지를 보냈습니다.");
    }
  }, [st_messageCreateDone]);

  useEffect(() => {
    if (st_noticeLectureListError) {
      return message.error(st_noticeLectureListError);
    }
  }, [st_noticeLectureListError]);

  useEffect(() => {
    if (st_messageAllListError) {
      return message.error(st_messageAllListError);
    }
  }, [st_messageAllListError]);

  useEffect(() => {
    if (st_bookUploadThDone) {
      setThumbnail(uploadPathTh);

      return message.success("이미지를 업로드 했습니다.");
    }
  }, [st_bookUploadThDone]);

  useEffect(() => {
    if (st_bookUploadThError) {
      return message.error(st_bookUploadThError);
    }
  }, [st_bookUploadThError]);

  ////// TOGGLE //////

  const meUpdateModalToggle = useCallback(() => {
    dispatch({
      type: ME_UPDATE_MODAL_TOGGLE,
    });
  }, [meUpdateModal]);

  const zoomLinkModalToggle = useCallback(
    (data) => {
      setZoomLinkToggle((prev) => !prev);

      onFillZoomLink(data);
      setLectureId(data);
    },
    [zoomLinkToggle]
  );

  const messageAnswerToggleHanlder = useCallback((e) => {
    setMessageAnswerModal(true);
  }, []);

  ////// HANDLER //////
  const lectureReceiveHandler = useCallback((data) => {
    let change = JSON.parse(data);

    dispatch({
      type: NOTICE_LECTURE_LIST_REQUEST,
      data: {
        page: 1,
        LectureId: change.id,
      },
    });

    setSelectLectureValue(change);
  }, []);

  const onClickNoticeHandler = useCallback((data) => {
    setNoticeViewDatum(data);
    setNoticeViewModal(true);
  }, []);

  const onReset = useCallback(() => {
    answerform.resetFields();
    textBookUploadform.resetFields();

    filename.setValue("");
    setThumbnail("");

    setTextbookToggle(false);

    setMessageAnswerModal(false);
    setMessageViewToggle(false);

    setNoticeViewModal(false);

    setNoticeViewDatum("");
    setTextbookData("");
    setCurrentModalKinds(null);
    setCurrentModalLevel(null);
    setCurrentModalStage(null);
    setSenderModal(false);
  }, []);

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

  const meUpdateHandler = useCallback(
    (data) => {
      if (!userProfilePath || userProfilePath.trim().length === 0) {
        return message.error("프로필 사진을 업로드해주세요");
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

  const moveLinkHandler = useCallback((link) => {
    router.push(link);
  }, []);

  const onChangeNoticePage = useCallback((page) => {
    setCurrentPage1(page);

    dispatch({
      type: NOTICE_LIST_REQUEST,
      data: {
        page,
      },
    });
  }, []);

  const onChangeNoticeLecturePage = useCallback(
    (page) => {
      setCurrentPage5(page);

      dispatch({
        type: NOTICE_LECTURE_LIST_REQUEST,
        data: {
          page,
          LectureId: id,
        },
      });
    },
    [selectLectureValue]
  );

  const onChangeLecturePage = useCallback((page) => {
    setCurrentPage2(page);

    dispatch({
      type: NOTICE_LIST_REQUEST,
      data: {
        page,
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

  const onChangeSenderMessagePage = useCallback((page) => {
    setCurrentPage6(page);

    dispatch({
      type: MESSAGE_SENDER_LIST_REQUEST,
      data: {
        page,
      },
    });
  }, []);

  const zoomLinkFinish = useCallback(
    (data) => {
      dispatch({
        type: LECTURE_LINK_UPDATE_REQUEST,
        data: {
          id: lectureId.id,
          zoomLink: data.zoomLink,
          zoomPass: data.zoomPass,
        },
      });
    },
    [lectureId]
  );

  const onFillZoomLink = (data) => {
    if (data) {
      zoomLinkForm.setFieldsValue({
        zoomLink: data.zoomLink,
        zoomPass: data.zoomPass,
      });
    }
  };

  const messageViewModalHanlder = useCallback((data, isSender) => {
    setMessageViewToggle(true);
    if (isSender) {
      setSenderModal(true);
    }

    setMessageDatum(data);
  }, []);

  const answerFinishHandler = useCallback(
    (data, messageData) => {
      if (messageData) {
        dispatch({
          type: MESSAGE_CREATE_REQUEST,
          data: {
            title: data.messageTitle,
            author: me.username,
            senderId: me.id,
            receiverId: messageData.senderId,
            content: data.messageContent,
            level: messageData.userLevel,
          },
        });
      }
    },

    [me]
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

  const allmessageChangePage = useCallback((page) => {
    setCurrentPage4(page);
    dispatch({
      type: MESSAGE_ALL_LIST_REQUEST,
      data: {
        page,
      },
    });
  }, []);

  const divideLecture = useCallback((day, time) => {
    let saveDay = day.split(" ");
    let saveTime = time.split(" ");

    let textSave = "";

    saveDay.map((data, idx) => {
      if (idx === saveDay.length - 1) {
        textSave += `${data} ${saveTime[idx]}`;
      } else {
        textSave += `${data} ${saveTime[idx]}  •  `;
      }
    });

    return textSave;
  }, []);

  const fileChangeHandler = useCallback((e) => {
    const formData = new FormData();

    [].forEach.call(e.target.files, (file) => {
      formData.append("image", file);
    });

    if (e.target.files[0].size > 104857600) {
      message.error("파일 용량 제한 (최대 100MB)");
      return;
    }

    dispatch({
      type: BOOK_UPLOAD_REQUEST,
      data: formData,
    });

    filename.setValue(e.target.files[0].name);
    fileRef2.current.value = "";
  }, []);

  const fileUploadClick = useCallback(() => {
    fileRef.current.click();
  }, [fileRef.current]);

  const fileChangeHandler2 = useCallback((e) => {
    const formData = new FormData();

    [].forEach.call(e.target.files, (file) => {
      formData.append("image", file);
    });

    dispatch({
      type: BOOK_UPLOAD_TH_REQUEST,
      data: formData,
    });
  }, []);

  const fileUploadClick2 = useCallback(() => {
    fileRef2.current.click();
  }, [fileRef2.current]);

  const onSubmit = useCallback(
    (data) => {
      dispatch({
        type: BOOK_CREATE_REQUEST,
        data: {
          thumbnail: uploadPathTh,
          title: data.title,
          file: uploadPath,
          LectureId: textbookData.id,
          level: data.level,
          stage: data.stage,
          kinds: data.kinds,
        },
      });
    },
    [uploadPathTh, uploadPath, textbookData, router.query]
  );

  const modalOk = useCallback(() => {
    textBookUploadform.submit();
  }, [form]);

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
        <WholeWrapper margin={width < 900 ? `52px 0 0` : `100px 0 0`}>
          <Wrapper
            bgImg={`url("https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/student/subBanner.png")`}
            padding={width < 700 ? `50px 0` : `100px 0`}
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
                  fontSize={width < 700 ? `16px` : `28px`}
                  fontWeight={`bold`}
                  padding={`0 0 0 15px`}
                >
                  안녕하세요,&nbsp;
                  <SpanText color={Theme.subTheme9_C} wordBreak={`break-all`}>
                    {me && me.username}&nbsp;
                  </SpanText>
                  쌤!
                </Text>
              </Wrapper>
              <Wrapper width={`auto`}>
                <CommonButton
                  radius={`20px`}
                  kindOf={`subTheme3`}
                  margin={width < 900 ? `10px 0` : `0 0 0 20px`}
                  onClick={meUpdateModalToggle}
                >
                  <SyncOutlined /> Upload My ID picture
                </CommonButton>
              </Wrapper>
            </RsWrapper>
          </Wrapper>

          <RsWrapper>
            <Wrapper dr={`row`} ju={`space-between`} margin={`-20px 0 80px`}>
              <TopButton onClick={() => moveLinkHandler(`/textbook`)}>
                <Wrapper width={`auto`} position={`relative`}>
                  <Image
                    src="https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_document_h_221021.png"
                    alt="icon"
                    width={`20px`}
                    margin={`0 10px 0 0`}
                    className="hover"
                    position={`absolute`}
                    top={`0`}
                    left={`0`}
                  />

                  <Image
                    src="https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_document_221021.png"
                    alt="icon"
                    width={`20px`}
                    margin={`0 10px 0 0`}
                    className="noHover"
                  />
                </Wrapper>

                <Text>교재 찾기 / 올리기</Text>
              </TopButton>

              <TopButton>
                <Wrapper width={`auto`} position={`relative`}>
                  <Image
                    src="https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_rule_h_221021.png"
                    alt="icon"
                    width={`20px`}
                    margin={`0 10px 0 0`}
                    className="hover"
                    position={`absolute`}
                    top={`0`}
                    left={`0`}
                  />

                  <Image
                    src="https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_rule_221021.png"
                    alt="icon"
                    width={`20px`}
                    margin={`0 10px 0 0`}
                    className="noHover"
                  />
                </Wrapper>

                <Text>복무 규정</Text>
              </TopButton>

              <TopButton>
                <Wrapper width={`auto`} position={`relative`}>
                  <Image
                    src="https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_contract_h_221021.png"
                    alt="icon"
                    width={`20px`}
                    margin={`0 10px 0 0`}
                    className="hover"
                    position={`absolute`}
                    top={`0`}
                    left={`0`}
                  />

                  <Image
                    src="https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_contract_221021.png"
                    alt="icon"
                    width={`20px`}
                    margin={`0 10px 0 0`}
                    className="noHover"
                  />
                </Wrapper>

                <Text>강사 계약서</Text>
              </TopButton>

              <TopButton onClick={() => moveLinkHandler(`/teacher/teacherPay`)}>
                <Wrapper width={`auto`} position={`relative`}>
                  <Image
                    src="https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_pay_h_221021.png"
                    alt="icon"
                    width={`20px`}
                    margin={`0 10px 0 0`}
                    className="hover"
                    position={`absolute`}
                    top={`0`}
                    left={`0`}
                  />

                  <Image
                    src="https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_pay_221021.png"
                    alt="icon"
                    width={`20px`}
                    margin={`0 10px 0 0`}
                    className="noHover"
                  />
                </Wrapper>

                <Text>강의료 산정</Text>
              </TopButton>
            </Wrapper>

            {/* 내수업 */}
            <Wrapper dr={`row`} ju={`space-between`} margin={`0 0 20px`}>
              <CommonTitle>내 수업</CommonTitle>

              <Wrapper dr={`row`} width={`auto`}>
                <TextInput
                  height={`25px`}
                  margin={`0 10px 0 0`}
                  placeholder="검색어를 입력해주세요."
                />
                <CommonButton height={`25px`} padding={`0 10px`}>
                  작성하기
                </CommonButton>
              </Wrapper>
            </Wrapper>

            {lectureTeacherList && lectureTeacherList.length === 0 ? (
              <Wrapper margin={`30px 0`}>
                <Empty description="조회된 수업 리스트가 없습니다." />
              </Wrapper>
            ) : (
              lectureTeacherList &&
              lectureTeacherList.map((data, idx) => {
                return (
                  <>
                    <Wrapper
                      padding={`30px`}
                      borderTop={`1px solid ${Theme.subTheme8_C}`}
                      borderBottom={`1px solid ${Theme.grey_C}`}
                      dr={`row`}
                      ju={`space-between`}
                      key={idx}
                    >
                      <Wrapper dr={`row`} width={`auto`}>
                        <Wrapper
                          dr={`row`}
                          width={`auto`}
                          margin={`0 20px 0 0`}
                        >
                          <Image
                            width={width < 900 ? `15px` : `22px`}
                            height={width < 900 ? `15px` : `22px`}
                            src="https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_clock.png"
                            alt="clock_icon"
                            margin={`0 10px 0 0`}
                          />

                          <Text fontSize={`16px`}>
                            {divideLecture(data && data.day, data && data.time)}
                          </Text>
                        </Wrapper>

                        <Wrapper
                          dr={`row`}
                          width={`auto`}
                          margin={`0 20px 0 0`}
                        >
                          <Image
                            width={width < 900 ? `15px` : `22px`}
                            height={width < 900 ? `15px` : `22px`}
                            src="https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_calender_y.png"
                            alt="calender_icon"
                            margin={`0 10px 0 0`}
                          />
                          <Text fontSize={`16px`}>
                            {moment(data.startDate, "YYYY/MM/DD").format(
                              "YYYY/MM/DD"
                            )}
                          </Text>
                        </Wrapper>

                        <Wrapper
                          dr={`row`}
                          width={`auto`}
                          margin={`0 20px 0 0`}
                        >
                          <Image
                            width={width < 900 ? `15px` : `22px`}
                            height={width < 900 ? `15px` : `22px`}
                            src="https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_number.png"
                            alt="calender_icon"
                            margin={`0 10px 0 0`}
                          />
                          <Text fontSize={`16px`}>{`${data.number}`}</Text>
                        </Wrapper>

                        <Wrapper dr={`row`} width={`auto`}>
                          <Image
                            width={width < 900 ? `15px` : `22px`}
                            height={width < 900 ? `15px` : `22px`}
                            src="https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_lecture.png"
                            alt="calender_icon"
                            margin={`0 10px 0 0`}
                          />
                          <Text fontSize={`16px`}>{data.course}</Text>
                        </Wrapper>
                      </Wrapper>

                      <Wrapper dr={`row`} width={`auto`}>
                        <CommonButton
                          kindOf={`subTheme14`}
                          margin={`0 5px 0 0`}
                          onClick={() => textbookModalHandler(data)}
                        >
                          교재 등록하기
                        </CommonButton>
                        <CommonButton
                          kindOf={`subTheme14`}
                          onClick={() => moveLinkHandler(`/teacher/${data.id}`)}
                        >
                          수업상세 보러가기
                        </CommonButton>
                      </Wrapper>
                    </Wrapper>

                    <Wrapper
                      padding={`50px 30px`}
                      ju={`flex-start`}
                      dr={`row`}
                      fontSize={`16px`}
                      bgColor={Theme.lightGrey2_C}
                      margin={`0 0 30px`}
                    >
                      {lectureTeacherStudents.map((data2) => {
                        if (data2.LectureId === data.id) {
                          return <Name>{data2.username}</Name>;
                        } else {
                          return null;
                        }
                      })}
                    </Wrapper>
                  </>
                );
              })
            )}

            <Wrapper margin={`50px 0`}>
              <CustomPage
                current={currentPage2}
                total={noticeLastPage * 10}
                onChange={(page) => onChangeLecturePage(page)}
              ></CustomPage>
            </Wrapper>

            {/* NORMAL NOTICE TABLE */}
            <TeacherNormalNotice />

            {/* <Wrapper al={`flex-start`}>
              <CommonTitle margin={`0 0 20px`}>내 수업</CommonTitle>

              {lectureTeacherList && lectureTeacherList.length === 0 ? (
                <Wrapper margin={`30px 0`}>
                  <Empty description="조회된 수업 리스트가 없습니다." />
                </Wrapper>
              ) : (
                lectureTeacherList &&
                lectureTeacherList.map((data, idx) => {
                  return (
                    <Wrapper
                      key={data.id}
                      margin={
                        idx === lectureTeacherList.length - 1 ? `0` : "0 0 20px"
                      }
                      border={`1px solid ${Theme.grey_C}`}
                    >
                      <Wrapper
                        dr={`row`}
                        ju={`flex-start`}
                        al={`flex-start`}
                        bgColor={Theme.subTheme9_C}
                        padding={width < 900 ? `20px 10px` : `25px 30px`}
                      >
                        <Wrapper
                          width={
                            width < 1280
                              ? width < 800
                                ? `100%`
                                : `60%`
                              : `37%`
                          }
                          dr={`row`}
                          ju={`flex-start`}
                        >
                          <Wrapper
                            width={`auto`}
                            padding={width < 700 ? `0` : `5px`}
                            margin={`0 10px 0 0`}
                          >
                            <Image
                              width={width < 900 ? `15px` : `22px`}
                              height={width < 900 ? `15px` : `22px`}
                              src="https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_clock.png"
                              alt="clock_icon"
                            />
                          </Wrapper>

                          <Wrapper
                            width={`auto`}
                            minWidth={`calc(100% - 42px - 100px)`}
                            dr={`row`}
                            ju={`flex-start`}
                          >
                            <Text
                              fontSize={width < 700 ? `14px` : `18px`}
                              fontWeight={`bold`}
                              lineHeight={`1.22`}
                            >
                              {divideLecture(
                                data && data.day,
                                data && data.time
                              )}
                            </Text>
                          </Wrapper>
                          <Wrapper
                            width={`1px`}
                            height={width < 800 ? `20px` : `34px`}
                            borderLeft={`1px dashed ${Theme.grey_C}`}
                            margin={
                              width < 1350
                                ? width < 700
                                  ? `0 4px`
                                  : `0 10px`
                                : `0 20px`
                            }
                          />
                        </Wrapper>

                        <Wrapper
                          dr={`row`}
                          ju={`space-between`}
                          width={width < 1400 ? `100%` : `62%`}
                          margin={width < 700 ? `10px 0 0 0` : `0`}
                        >
                          <Wrapper dr={`row`} width={`auto`}>
                            <Image
                              width={width < 900 ? `15px` : `22px`}
                              height={width < 900 ? `15px` : `22px`}
                              src="https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_calender_y.png"
                              alt="calender_icon"
                              margin={`0 5px 0 0`}
                            />
                            <CustomText2
                              color={Theme.black_2C}
                              fontWeight={`normal`}
                              width={width < 700 ? `auto` : `140px`}
                            >
                              {moment(data.startDate, "YYYY/MM/DD").format(
                                "YYYY/MM/DD"
                              )}
                            </CustomText2>

                            <Image
                              width={width < 900 ? `15px` : `22px`}
                              height={width < 900 ? `15px` : `22px`}
                              src="https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_number.png"
                              alt="calender_icon"
                              margin={`0 5px 0 0`}
                            />
                            <Text
                              color={Theme.black_2C}
                              fontSize={width < 700 ? `12px` : `18px`}
                              width={width < 700 ? `auto` : `140px`}
                              margin={`0 10px 0 0`}
                            >
                              {`${data.number}`}
                            </Text>

                            <Wrapper width={`auto`} fontWeight={`bold`}>
                              <Text
                                cursor={`pointer`}
                                color={Theme.black_2C}
                                fontSize={width < 700 ? `12px` : `18px`}
                                width={`auto`}
                                onClick={() => textbookModalHandler(data)}
                              >
                                교재 등록
                              </Text>
                            </Wrapper>
                          </Wrapper>

                          <Text
                            color={Theme.black_2C}
                            fontSize={width < 700 ? `12px` : `18px`}
                          >
                            {data.course}
                          </Text>

                          <Wrapper width={`auto`}>
                            <CustomText3
                              onClick={() =>
                                moveLinkHandler(`/teacher/${data.id}`)
                              }
                              color={Theme.black_2C}
                              cursor={`pointer`}
                            >
                              상세 수업 보러가기
                            </CustomText3>
                          </Wrapper>
                        </Wrapper>
                      </Wrapper>
                      <Wrapper
                        dr={`row`}
                        ju={`flex-start`}
                        padding={width < 900 ? `20px 10px` : `30px`}
                      >
                        {lectureTeacherStudents.map((data2) => {
                          if (data2.LectureId === data.id) {
                            return <Name>{data2.username}</Name>;
                          } else {
                            return null;
                          }
                        })}
                      </Wrapper>
                    </Wrapper>
                  );
                })
              )}

              <Wrapper margin={`65px 0 0`}>
                <CustomPage
                  current={currentPage2}
                  total={noticeLastPage * 10}
                  onChange={(page) => onChangeLecturePage(page)}
                ></CustomPage>
              </Wrapper>
            </Wrapper> */}

            {/* <Wrapper
              dr={`row`}
              margin={`100px 0`}
              ju={width < 700 ? `flex-start` : "center"}
            >
              <CustomButton onClick={() => moveLinkHandler(`/textbook`)}>
                교재 찾기 / 올리기
              </CustomButton>
              <CustomButton>복무 규정</CustomButton>
              <CustomButton>강사 계약서</CustomButton>
              <CustomButton
                onClick={() => moveLinkHandler(`/teacher/teacherPay`)}
              >
                강의료 산정
              </CustomButton>
            </Wrapper> */}
          </RsWrapper>

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
                  프로필 이미지 사이즈는 가로 {PROFILE_WIDTH}px 과 세로&nbsp;
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
            width={`700px`}
            height={`500px`}
            visible={zoomLinkToggle}
            onCancel={zoomLinkModalToggle}
            footer={null}
          >
            <Wrapper>
              <Text
                fontSize={width < 900 ? `15px` : `22px`}
                fontWeight={`bold`}
                margin={`0 0 24px`}
              >
                줌링크 등록하기
              </Text>
            </Wrapper>

            <CustomForm onFinish={zoomLinkFinish} form={zoomLinkForm}>
              <Form.Item
                label="줌 링크"
                name={"zoomLink"}
                rules={[{ required: true, message: "줌링크를 입력해주세요." }]}
              >
                <CustomInput width={`100%`} />
              </Form.Item>

              <Form.Item
                label="줌 비밀번호"
                name={"zoomPass"}
                rules={[
                  { required: true, message: "줌 비밀번호를 입력해주세요." },
                ]}
              >
                <CustomInput width={`100%`} />
              </Form.Item>

              <Wrapper>
                <CommonButton height={`40px`} radius={`5px`} htmlType="submit">
                  등록
                </CommonButton>
              </Wrapper>
            </CustomForm>
          </CustomModal>
        </WholeWrapper>

        <CustomModal
          visible={messageViewToggle}
          width={`900px`}
          title={messageAnswerModal ? "쪽지 답변" : "쪽지함"}
          footer={null}
          closable={false}
        >
          <CustomForm
            form={answerform}
            onFinish={(data) => answerFinishHandler(data, messageDatum)}
          >
            {messageAnswerModal && (
              <>
                <Wrapper dr={`row`} ju={`flex-start`} margin={`0 0 40px`}>
                  <Image
                    alt="thumnail"
                    src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/logo/favicon.png`}
                    width={`65px`}
                    height={`65px`}
                    radius={`100%`}
                    margin={`0 10px 0 0`}
                  />

                  <Text>{messageDatum && messageDatum.author}</Text>
                </Wrapper>

                <Text fontSize={`18px`} fontWeight={`bold`}>
                  제목
                </Text>
                <Wrapper padding={`10px`}>
                  <Form.Item
                    name="messageTitle"
                    rules={[
                      { required: true, message: "제목을 입력해주세요." },
                    ]}
                  >
                    <CustomInput
                      width={`100%`}
                      placeholder="제목을 입력해주세요."
                    />
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
                    ]}
                  >
                    <Input.TextArea
                      style={{ height: `360px` }}
                      placeholder="내용을 입력해주세요."
                    />
                  </Form.Item>
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

                  <CommonButton
                    margin={`0 0 0 5px`}
                    radius={`5px`}
                    htmlType="submit"
                  >
                    작성하기
                  </CommonButton>
                </Wrapper>
              </>
            )}
          </CustomForm>

          {!messageAnswerModal && (
            <>
              <Wrapper
                dr={`row`}
                ju={`space-between`}
                margin={`0 0 35px`}
                fontSize={width < 700 ? `14px` : `16px`}
              >
                <Text margin={`0 54px 0 0`}>
                  <Image
                    alt="thumnail"
                    src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/logo/favicon.png`}
                    width={`65px`}
                    height={`65px`}
                    radius={`100%`}
                    margin={`0 10px 0 0`}
                  />
                  {`${messageDatum && messageDatum.author}`}
                </Text>
                <Text>
                  <CalendarOutlined style={{ color: Theme.basicTheme_C }} />
                  &nbsp;
                  {`${
                    messageDatum &&
                    moment(messageDatum.createdAt, "YYYY/MM/DD").format(
                      "YYYY/MM/DD"
                    )
                  }`}
                </Text>
              </Wrapper>

              <Text fontSize={`18px`} fontWeight={`bold`}>
                제목
              </Text>

              <Wrapper
                padding={`10px`}
                al={`flex-start`}
                bgColor={Theme.subTheme9_C}
                margin={`5px 0 10px`}
              >
                <Text fontSize={width < 700 ? `14px` : `16px`}>
                  {messageDatum && messageDatum.title}
                </Text>
              </Wrapper>

              <Text fontSize={`18px`} fontWeight={`bold`}>
                내용
              </Text>
              <Wrapper
                padding={`10px`}
                al={`flex-start`}
                bgColor={Theme.subTheme9_C}
              >
                <Text
                  minHeight={`150px`}
                  fontSize={width < 700 ? `14px` : `16px`}
                >
                  {messageDatum &&
                    messageDatum.content.split(`\n`).map((data, idx) => {
                      return (
                        <Text key={`${data}${idx}`}>
                          {data}
                          <br />
                        </Text>
                      );
                    })}
                </Text>
              </Wrapper>

              <Wrapper dr={`row`} margin={`20px 0 0`}>
                <CommonButton
                  margin={`0 5px 0 0`}
                  kindOf={`grey`}
                  color={Theme.darkGrey_C}
                  radius={`5px`}
                  onClick={() => onReset()}
                >
                  돌아가기
                </CommonButton>

                {!senderModal && (
                  <CommonButton
                    onClick={() => messageAnswerToggleHanlder(messageDatum)}
                    margin={`0 0 0 5px`}
                    radius={`5px`}
                  >
                    답변하기
                  </CommonButton>
                )}
              </Wrapper>
            </>
          )}
        </CustomModal>

        <CustomModal
          visible={noticeViewModal}
          title="공지사항"
          width={`900px`}
          footer={null}
          closable={false}
        >
          <Wrapper
            dr={`row`}
            ju={`space-between`}
            margin={`0 0 35px`}
            fontSize={width < 700 ? `14px` : `16px`}
          >
            <Text margin={`0 54px 0 0`}>
              <Image
                alt="thumnail"
                src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/logo/favicon.png`}
                width={`65px`}
                height={`65px`}
                radius={`100%`}
                margin={`0 10px 0 0`}
              />
              {`${noticeViewDatum && noticeViewDatum.author}`}
            </Text>
            <Wrapper width={`auto`}>
              <Text>
                <CalendarOutlined style={{ color: Theme.basicTheme_C }} />
                &nbsp;
                {` ${moment(
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
          <Wrapper
            padding={`10px`}
            bgColor={Theme.subTheme9_C}
            margin={`5px 0 10px`}
          >
            <WordbreakText fontSize={width < 700 ? `14px` : `16px`}>
              {noticeViewDatum && noticeViewDatum.title}
            </WordbreakText>
          </Wrapper>

          <Text fontSize={`18px`} fontWeight={`bold`}>
            내용
          </Text>
          <Wrapper padding={`10px`} bgColor={Theme.subTheme9_C}>
            <WordbreakText
              fontSize={width < 700 ? `14px` : `16px`}
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
              돌아가기
            </CommonButton>
          </Wrapper>
        </CustomModal>

        <CustomModal
          visible={textbookToggle}
          title="교재 등록"
          okText="등록"
          cancelText="취소"
          onCancel={() => onReset()}
          onOk={modalOk}
        >
          <Wrapper al={`flex-start`}>
            <Form form={textBookUploadform} onFinish={onSubmit}>
              <Form.Item
                rules={[
                  { required: true, message: "교재 제목을 입력해주세요." },
                ]}
                label={`교재 제목`}
                name={`title`}
              >
                <TextInput height={`30px`} />
              </Form.Item>

              <Form.Item
                rules={[{ required: true, message: "권을 선택해주세요." }]}
                label={`권`}
                name={`level`}
                onBlur={() =>
                  textBookUploadform.getFieldValue(`level`) === "" &&
                  setCurrentModalLevel(null)
                }
              >
                {currentModalLevel === "기타" ? (
                  <Input />
                ) : (
                  <Select onSelect={(e) => setCurrentModalLevel(e)}>
                    {[`기타`, 1, 2, 3, 4, 5, 6].map((data, idx) => {
                      return (
                        <Select.Option value={data} key={idx}>
                          {data}
                        </Select.Option>
                      );
                    })}
                  </Select>
                )}
              </Form.Item>
              <Form.Item
                rules={[{ required: true, message: "단원을 선택해주세요." }]}
                label={`단원`}
                name={`stage`}
                onBlur={() =>
                  textBookUploadform.getFieldValue(`stage`) === "" &&
                  setCurrentModalStage(null)
                }
              >
                {currentModalStage === "기타" ? (
                  <Input />
                ) : (
                  <Select onSelect={(e) => setCurrentModalStage(e)}>
                    {[`기타`, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((data, idx) => {
                      return (
                        <Select.Option value={data} key={idx}>
                          {data}
                        </Select.Option>
                      );
                    })}
                  </Select>
                )}
              </Form.Item>

              <Form.Item
                rules={[{ required: true, message: "유형을 선택해주세요." }]}
                label={`유형`}
                name={`kinds`}
                onBlur={() =>
                  textBookUploadform.getFieldValue(`kinds`) === "" &&
                  setCurrentModalKinds(null)
                }
              >
                {currentModalKinds === "기타" ? (
                  <Input />
                ) : (
                  <Select onSelect={(e) => setCurrentModalKinds(e)}>
                    {[`기타`, `교과서`, `워크북`, `듣기파일`, `토픽`].map(
                      (data, idx) => {
                        return (
                          <Select.Option value={data} key={idx}>
                            {data}
                          </Select.Option>
                        );
                      }
                    )}
                  </Select>
                )}
              </Form.Item>
            </Form>
          </Wrapper>
          <Wrapper dr={`row`} ju={`space-between`} al={`flex-end`}>
            <Wrapper width={`auto`} margin={`20px 0 0`}>
              <input
                type="file"
                name="file"
                accept=".png, .jpg"
                hidden
                ref={fileRef2}
                onChange={fileChangeHandler2}
              />

              <Wrapper width={`150px`} margin={`0 0 10px`}>
                <Image
                  src={
                    thumbnail
                      ? thumbnail
                      : `https://via.placeholder.com/${`80`}x${`100`}`
                  }
                  alt={`thumbnail`}
                />
              </Wrapper>
              <Button
                type="primary"
                onClick={fileUploadClick2}
                loading={st_bookUploadThLoading}
              >
                썸네일 이미지 업로드
              </Button>
            </Wrapper>

            <Wrapper
              width={`auto`}
              margin={`20px 0 0`}
              dr={`row`}
              ju={`flex-end`}
            >
              <input
                type="file"
                name="file"
                hidden
                ref={fileRef}
                onChange={fileChangeHandler}
              />
              <Text margin={`0 5px 0 0`}>
                {filename.value ? filename.value : `파일을 선택해주세요.`}
              </Text>
              <Button
                type="primary"
                onClick={fileUploadClick}
                loading={st_bookUploadLoading}
              >
                교재 파일 업로드
              </Button>
            </Wrapper>
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
      type: BOOK_ALL_LIST_REQUEST,
    });

    context.store.dispatch({
      type: NOTICE_LIST_REQUEST,
      data: {
        page: 1,
      },
    });

    context.store.dispatch({
      type: NORMAL_NOTICE_LIST_REQUEST,
      data: {
        page: 1,
      },
    });

    // 구현부 종료
    context.store.dispatch(END);
    console.log("🍀 SERVER SIDE PROPS END");
    await context.store.sagaTask.toPromise();
  }
);

export default Index;
