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
import moment from "moment";
import { LOAD_MY_INFO_REQUEST } from "../../../reducers/user";
import { SEO_LIST_REQUEST } from "../../../reducers/seo";
import ToastEditorComponent2 from "../../../components/editor/ToastEditorComponent2";
import ToastEditorComponent from "../../../components/editor/ToastEditorComponent";
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
  TextArea,
  CommonTitle,
} from "../../../components/commonComponents";
import {
  CalendarOutlined,
  SearchOutlined,
  DownloadOutlined,
  UploadOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import {
  Checkbox,
  Pagination,
  Input,
  Modal,
  Form,
  Button,
  Calendar,
  message,
  Empty,
  Select,
} from "antd";
import {
  MESSAGE_CREATE_REQUEST,
  MESSAGE_MANY_CREATE_REQUEST,
  MESSAGE_LECTURE_LIST_REQUEST,
  MESSAGE_FOR_ADMIN_CREATE_REQUEST,
} from "../../../reducers/message";
import { useRouter } from "next/router";
import {
  LECTURE_DETAIL_REQUEST,
  LECTURE_DIARY_CREATE_REQUEST,
  LECTURE_DIARY_LIST_REQUEST,
  LECTURE_FILE_REQUEST,
  LECTURE_HOMEWORK_CREATE_REQUEST,
  LECTURE_HOMEWORK_LIST_REQUEST,
  LECTURE_MEMO_STU_CREATE_REQUEST,
  LECTURE_MEMO_STU_LIST_REQUEST,
  LECTURE_MEMO_STU_UPDATE_REQUEST,
  LECTURE_SUBMIT_LIST_REQUEST,
  LECTURE_TEACHER_LIST_REQUEST,
} from "../../../reducers/lecture";
import { PARTICIPANT_LECTURE_LIST_REQUEST } from "../../../reducers/participant";
import {
  NOTICE_CREATE_REQUEST,
  NOTICE_LECTURE_LIST_REQUEST,
  NOTICE_DETAIL_REQUEST,
  NOTICE_UPDATE_REQUEST,
  DETAIL_MODAL_OPEN_REQUEST,
  DETAIL_MODAL_CLOSE_REQUEST,
  NOTICE_UPLOAD_REQUEST,
} from "../../../reducers/notice";
import {
  COMMUTE_CREATE_REQUEST,
  COMMUTE_LIST_REQUEST,
} from "../../../reducers/commute";
import { saveAs } from "file-saver";

const CustomInput = styled(TextInput)`
  width: ${(props) => props.width || `100%`};

  &::placeholder {
    color: ${Theme.grey2_C};
  }
`;

const BackIcon = styled(Wrapper)`
  cursor: pointer;
  transition: 0.5s;
  & .anticon-rollback {
    font-size: 30px;
    color: ${Theme.white_C};
  }

  &:hover {
    & .anticon-rollback {
      font-size: 30px;
      color: ${Theme.basicTheme_C};
    }
    color: ${Theme.basicTheme_C};
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

const FileBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

const Filename = styled.span`
  margin-right: 15px;
  color: #555;
  font-size: 13px;
`;

const Index = () => {
  ////// GLOBAL STATE //////

  const { seo_keywords, seo_desc, seo_ogImage, seo_title } = useSelector(
    (state) => state.seo
  );

  const {
    messageDetail,

    st_messageListError,

    st_messageDetailDone,
    st_messageDetailError,

    st_messageManyCreateDone,
    st_messageManyCreateError,

    st_messageForAdminCreateDone,
    st_messageForAdminCreateError,

    messageLectureList,
    messageLectureLastPage,

    st_messageLectureListError,

    st_messageCreateDone,
    st_messageCreateError,
  } = useSelector((state) => state.message);

  const { me } = useSelector((state) => state.user);

  const {
    lectureDiaryList,
    lectureDiaryLastPage,

    st_lectureDiaryListError,

    st_lectureDiaryCreateDone,
    st_lectureDiaryCreateError,

    lecturePath,
    st_lectureFileLoading,
    st_lectureFileDone,
    st_lectureFileError,

    lectureHomeworkList,
    lectureHomeworkLastPage,

    st_lectureHomeWorkError,

    st_lectureHomeWorkCreateDone,
    st_lectureHomeWorkCreateError,

    lectureSubmitList,
    lectureSubmitLastPage,

    st_lectureSubmitListError,

    lectureDetail,

    st_lectureMemoStuCreateDone,
    st_lectureMemoStuCreateError,

    lectureMemoStuList,
    lectureMemoStuLastPage,
    st_lectureMemoStuListDone,
    st_lectureMemoStuListError,

    st_lectureMemoStuUpdateDone,
    st_lectureMemoStuUpdateError,
  } = useSelector((state) => state.lecture);

  const {
    partLectureList,
    partLecturePrice,
    st_participantLectureListDone,
    st_participantLectureListError,
  } = useSelector((state) => state.participant);

  useEffect(() => {
    if (st_participantLectureListDone) {
    }
  }, [st_participantLectureListDone]);

  const {
    noticeLectureList,
    noticeLectureLastPage,

    st_noticeLectureListError,

    st_noticeCreateDone,
    st_noticeCreateError,

    st_noticeUpdateDone,
    st_noticeUpdateError,

    noticeDetail,
    st_noticeDetailDone,
    st_noticeDetailError,
    detailModal,

    uploadPath,
    st_noticeUploadLoading,
    st_noticeUploadDone,
    st_noticeUploadError,
  } = useSelector((state) => state.notice);

  const {
    commuteList,
    commuteLastPage,

    st_commuteListError,

    st_commuteCreateDone,
    st_commuteCreateError,
  } = useSelector((state) => state.commute);

  ////// HOOKS //////

  const router = useRouter();

  const dispatch = useDispatch();

  const width = useWidth();

  const formRef = useRef();
  const fileRef = useRef();

  const [form] = Form.useForm();
  const [answerform] = Form.useForm();
  const [noticeform] = Form.useForm();
  const [noticeWriteform] = Form.useForm();
  const [homeworkUploadform] = Form.useForm();
  const [diaryform] = Form.useForm();
  const [diaryViewform] = Form.useForm();
  const [homeworkSubmitform] = Form.useForm();
  const [memoform] = Form.useForm();
  const [memoWriteform] = Form.useForm();

  const imageInput = useRef();
  const homeworkUpload = useRef();

  const [isCalendar, setIsCalendar] = useState(false);

  const [messageSendModalToggle, setMessageSendModalToggle] = useState(false);
  const [adminSendMessageToggle, setAdminSendMessageToggle] = useState(false);
  const [noticeModalToggle, setNoticeModalToggle] = useState(false);
  const [homeWorkModalToggle, setHomeWorkModalToggle] = useState(false);
  const [diaryModalToggle, setDiaryModalToggle] = useState(false);
  const [diaryViewModalToggle, setDiaryViewModalToggle] = useState(false);
  const [diaryData, setDiaryData] = useState([]);
  const [memoStuDetailToggle, setMemoStuDetailToggle] = useState(false);
  const [messageAnswerModal, setMessageAnswerModal] = useState(false);

  const [noticeViewModal, setNoticeViewModal] = useState(false);
  const [noticeViewDatum, setNoticeViewDatum] = useState(null);

  const [noticeId, setNoticeId] = useState("");

  const [memoToggle, setMemoToggle] = useState(false);
  const [memoStuBackToggle, setMemoStuBackToggle] = useState(false);
  const [memoId, setMemoId] = useState("");

  const [memoDatum, setMemoDatum] = useState("");

  const [studentToggle, setStudentToggle] = useState(false);
  const [commuteToggle, setCommuteToggle] = useState(false);

  const [checkedList, setCheckedList] = useState([]);
  const [checkedAllValue, setCheckedAllValue] = useState(false);

  const [messageViewToggle, setMessageViewToggle] = useState(false);

  const [fileName, setFileName] = useState("");
  const [filePath, setFilePath] = useState("");

  const noticeFileName = useInput(null);

  const inputDate = useInput("");
  const inputCommuteSearch = useInput("");
  const inputMemoSearch = useInput("");

  const [messageDatum, setMessageDatum] = useState();

  const [currentPage1, setCurrentPage1] = useState(1);
  const [currentPage2, setCurrentPage2] = useState(1);
  const [currentPage3, setCurrentPage3] = useState(1);
  const [currentPage4, setCurrentPage4] = useState(1);
  const [currentPage5, setCurrentPage5] = useState(1);
  const [currentPage6, setCurrentPage6] = useState(1);
  const [currentPage7, setCurrentPage7] = useState(1);

  const [noticeContent, setNoticeContent] = useState("");

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
    if (partLectureList && partLectureList.length !== 0) {
      let arr = [];

      partLectureList.map((data) => {
        arr.push({
          ...data,
          isCheck: false,
        });
      });

      setCheckedList(arr);
    }
  }, [
    partLectureList,
    st_messageForAdminCreateDone,
    st_messageManyCreateDone,
    messageSendModalToggle,
  ]);

  useEffect(() => {
    dispatch({
      type: LECTURE_TEACHER_LIST_REQUEST,
      data: {
        TeacherId: me && me.id,
      },
    });

    dispatch({
      type: PARTICIPANT_LECTURE_LIST_REQUEST,
      data: {
        LectureId: router.query.id,
      },
    });

    dispatch({
      type: LECTURE_DIARY_LIST_REQUEST,
      data: {
        page: 1,
        LectureId: router.query.id,
      },
    });

    dispatch({
      type: LECTURE_HOMEWORK_LIST_REQUEST,
      data: {
        LectureId: parseInt(router.query.id),
        page: 1,
      },
    });

    dispatch({
      type: COMMUTE_LIST_REQUEST,
      data: {
        LectureId: parseInt(router.query.id),
        page: 1,
        search: "",
      },
    });

    dispatch({
      type: LECTURE_DETAIL_REQUEST,
      data: {
        LectureId: parseInt(router.query.id),
      },
    });

    dispatch({
      type: LECTURE_MEMO_STU_LIST_REQUEST,
      data: {
        LectureId: parseInt(router.query.id),
        page: 1,
        search: "",
      },
    });

    dispatch({
      type: MESSAGE_LECTURE_LIST_REQUEST,
      data: {
        LectureId: router.query.id,
        page: 1,
      },
    });

    dispatch({
      type: NOTICE_LECTURE_LIST_REQUEST,
      data: {
        page: 1,
        LectureId: router.query.id,
      },
    });
  }, [me, router.query]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
    if (st_messageDetailError) {
      return message.error(st_messageDetailError);
    }
  }, [st_messageDetailError]);

  useEffect(() => {
    if (st_messageCreateDone) {
      onReset();
      return message.success("답변을 완료 했습니다.");
    }
  }, [st_messageCreateDone]);

  ////////////////////////
  useEffect(() => {
    if (st_messageManyCreateError) {
      return message.error(st_messageManyCreateError);
    }
  }, [st_messageManyCreateError]);

  useEffect(() => {
    if (st_messageManyCreateDone) {
      onReset();

      return message.success("해당 학생에게 쪽지를 보냈습니다.");
    }
  }, [st_messageManyCreateDone]);

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

  useEffect(() => {
    if (st_lectureHomeWorkCreateDone) {
      onReset();

      dispatch({
        type: LECTURE_HOMEWORK_LIST_REQUEST,
        data: {
          LectureId: parseInt(router.query.id),
          page: 1,
        },
      });

      return message.success("숙제를 업로드 했습니다.");
    }
  }, [st_lectureHomeWorkCreateDone]);

  useEffect(() => {
    if (st_lectureHomeWorkCreateError) {
      setFileName("");
      return message.error(st_lectureHomeWorkCreateError);
    }
  }, [st_lectureHomeWorkCreateError]);

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
    if (st_noticeDetailDone) {
      onFillNotice(noticeDetail);
    }
  }, [st_noticeDetailDone]);

  useEffect(() => {
    if (st_noticeCreateDone) {
      onReset();

      dispatch({
        type: NOTICE_LECTURE_LIST_REQUEST,
        data: {
          page: 1,
          LectureId: router.query.id,
        },
      });
      return message.success("공지사항이 작성 되었습니다.");
    }
  }, [st_noticeCreateDone]);

  useEffect(() => {
    if (st_noticeCreateError) {
      return message.error(st_noticeCreateError);
    }
  }, [st_noticeCreateError]);

  useEffect(() => {
    if (st_lectureDiaryCreateDone) {
      onReset();

      dispatch({
        type: LECTURE_DIARY_LIST_REQUEST,
        data: {
          page: 1,
          LectureId: router.query.id,
        },
      });

      return message.success("강사일지 작성을 완료했습니다.");
    }
  }, [st_lectureDiaryCreateDone]);

  useEffect(() => {
    if (st_lectureDiaryCreateError) {
      return message.error(st_lectureDiaryCreateError);
    }
  }, [st_lectureDiaryCreateError]);

  useEffect(() => {
    if (st_noticeUpdateDone) {
      onReset();

      dispatch({
        type: NOTICE_DETAIL_REQUEST,
        data: {
          noticeId: noticeId,
        },
      });

      dispatch({
        type: NOTICE_LECTURE_LIST_REQUEST,
        data: {
          page: 1,
          LectureId: router.query.id,
        },
      });

      return message.success("해당 게시글을 수정했습니다.");
    }
  }, [st_noticeUpdateDone, noticeId]);

  useEffect(() => {
    if (st_noticeUpdateError) {
      return message.error(st_noticeUpdateError);
    }
  }, [st_noticeUpdateError]);

  useEffect(() => {
    if (st_commuteCreateDone) {
      dispatch({
        type: COMMUTE_LIST_REQUEST,
        data: {
          LectureId: parseInt(router.query.id),
          page: 1,
          search: "",
        },
      });

      return message.success("해당 학생을 출석을 완료 했습니다.");
    }
  }, [st_commuteCreateDone]);

  useEffect(() => {
    if (st_commuteCreateError) {
      return message.error(st_commuteCreateError);
    }
  }, [st_commuteCreateError]);

  useEffect(() => {
    if (st_lectureMemoStuCreateDone) {
      onReset();

      dispatch({
        type: LECTURE_MEMO_STU_LIST_REQUEST,
        data: {
          LectureId: parseInt(router.query.id),
          page: 1,
          search: "",
        },
      });

      return message.success("해당 학생에게 메모를 작성했습니다.");
    }
  }, [st_lectureMemoStuCreateDone]);

  useEffect(() => {
    if (st_lectureMemoStuCreateError) {
      return message.error(st_lectureMemoStuCreateError);
    }
  }, [st_lectureMemoStuCreateError]);

  useEffect(() => {
    if (st_lectureMemoStuListError) {
      return message.error(st_lectureMemoStuListError);
    }
  }, [st_lectureMemoStuListError]);

  useEffect(() => {
    if (st_lectureMemoStuListDone) {
    }
  }, [st_lectureMemoStuListDone]);

  useEffect(() => {
    if (st_lectureMemoStuUpdateDone) {
      onReset();

      dispatch({
        type: LECTURE_MEMO_STU_LIST_REQUEST,
        data: {
          LectureId: parseInt(router.query.id),
          page: 1,
          search: "",
        },
      });

      return message.success("해당 학생에 메모를 수정했습니다.");
    }
  }, [st_lectureMemoStuUpdateDone]);

  useEffect(() => {
    if (st_noticeUploadError) {
      return message.error(st_noticeUploadError);
    }
  }, [st_noticeUploadError]);

  useEffect(() => {
    if (st_noticeUploadDone) {
      return message.success("파일을 업로드 했습니다.");
    }
  }, [st_noticeUploadDone]);

  useEffect(() => {
    if (st_lectureMemoStuUpdateError) {
      return message.error(st_lectureMemoStuUpdateError);
    }
  }, [st_lectureMemoStuUpdateError]);

  useEffect(() => {
    if (st_commuteListError) {
      return message.error(st_commuteListError);
    }
  }, [st_commuteListError]);

  useEffect(() => {
    if (st_noticeDetailError) {
      return message.error(st_noticeDetailError);
    }
  }, [st_noticeDetailError]);

  useEffect(() => {
    if (st_noticeLectureListError) {
      return message.error(st_noticeLectureListError);
    }
  }, [st_noticeLectureListError]);

  useEffect(() => {
    if (st_participantLectureListError) {
      return message.error(st_participantLectureListError);
    }
  }, [st_participantLectureListError]);

  useEffect(() => {
    if (st_lectureSubmitListError) {
      return message.error(st_lectureSubmitListError);
    }
  }, [st_lectureSubmitListError]);

  useEffect(() => {
    if (st_lectureDiaryListError) {
      message.error(st_lectureDiaryListError);
      return router.back();
    }
  }, [st_lectureDiaryListError]);

  useEffect(() => {
    if (st_lectureHomeWorkError) {
      return message.error(st_lectureHomeWorkError);
    }
  }, [st_lectureHomeWorkError]);

  useEffect(() => {
    if (st_messageCreateError) {
      return message.error(st_messageCreateError);
    }
  }, [st_messageCreateError]);

  useEffect(() => {
    if (st_messageLectureListError) {
      return message.error(st_messageLectureListError);
    }
  }, [st_messageLectureListError]);

  ////// TOGGLE //////

  const studentToggleHanlder = useCallback(() => {
    setStudentToggle(true);

    dispatch({
      type: LECTURE_SUBMIT_LIST_REQUEST,
      data: {
        LectureId: parseInt(router.query.id),
        search: "",
        page: 1,
      },
    });
  }, []);

  const detailStuToggleHandler = useCallback((data) => {
    setMemoToggle((prev) => !prev);

    setMemoDatum(data);
  }, []);

  const detailStuViewToggleHandler = useCallback((data) => {
    setMemoStuDetailToggle((prev) => !prev);
  }, []);

  const messageSendModalHandler = useCallback(async () => {
    let result = await checkedList.filter((data, idx) => {
      return data.isCheck ? true : false;
    });

    if (result.length !== 0) {
      setMessageSendModalToggle((prev) => !prev);
      setCheckedList(result);
    } else {
      return message.error("체크 박스를 선택해주세요.");
    }
  }, [checkedList]);

  const adminMessageModal = useCallback(() => {
    setMessageSendModalToggle((prev) => !prev);
    setAdminSendMessageToggle(true);
  }, []);

  ////// HANDLER //////

  const fileUploadClick = useCallback(() => {
    fileRef.current.click();
  }, [fileRef.current]);

  const fileChangeHandler = useCallback(
    (e) => {
      const formData = new FormData();
      noticeFileName.setValue(e.target.files[0].name);

      [].forEach.call(e.target.files, (file) => {
        formData.append("file", file);
      });

      dispatch({
        type: NOTICE_UPLOAD_REQUEST,
        data: formData,
      });

      fileRef.current.value = "";
    },
    [fileRef]
  );

  const onClickNoticeHandler = useCallback((data) => {
    setNoticeViewDatum(data);
    setNoticeViewModal(true);
  }, []);

  const dateChagneHandler = useCallback((data) => {
    const birth = data.format("YYYY-MM-DD");

    if (data) {
      homeworkUpload.current.setFieldsValue({
        date: birth,
      });
    }

    inputDate.setValue(birth);
  }, []);

  const noteSendFinishHandler = useCallback(
    async (value, checkList) => {
      let receiverId = await checkList.map((data) => data.UserId);
      let level = await checkList.map((data) => data.level);

      if (receiverId) {
        dispatch({
          type: MESSAGE_MANY_CREATE_REQUEST,
          data: {
            title: value.title1,
            author: me.username,
            content: value.content1,
            receiverId: receiverId,
            level,
          },
        });
      } else {
        return message.error("시스템 오류 입니다. 잠시후 시도해 주세요.");
      }
    },
    [me]
  );

  const noticeFinishHandler = useCallback(
    (value) => {
      if (!noticeContent || noticeContent.trim() === "") {
        return message.error("내용을 입력해주시고 작성하기 버튼을 눌러주세요.");
      } else {
        dispatch({
          type: NOTICE_CREATE_REQUEST,
          data: {
            title: value.title2,
            content: noticeContent,
            author: me.username,
            LectureId: router.query.id,
            file: uploadPath,
          },
        });
      }
    },
    [me, noticeContent, noticeFileName, uploadPath]
  );

  const noticeViewFinishHandler = useCallback(
    (value) => {
      if (!noticeContent || noticeContent.trim() === "") {
        return message.error(
          "내용을 입력해주시고 수정하기를 버튼을 눌러주세요."
        );
      } else {
        if (noticeDetail.length !== 0) {
          dispatch({
            type: NOTICE_UPDATE_REQUEST,
            data: {
              id: noticeDetail[0].id,
              title: value.noticeTitle,
              content: noticeContent,
            },
          });
        }
      }
    },
    [noticeContent, noticeDetail]
  );

  const homeWorkFinishHandler = useCallback(
    (value) => {
      if (filePath) {
        dispatch({
          type: LECTURE_HOMEWORK_CREATE_REQUEST,
          data: {
            title: value.title3,
            content: value.content3,
            date: value.date,
            file: filePath,
            LectureId: router.query.id,
          },
        });

        imageInput.current.value = "";
      } else {
        return message.error("파일을 업로드 해주세요.");
      }
    },
    [lecturePath, filePath]
  );

  const memoFinishHandler = useCallback(
    (data) => {
      dispatch({
        type: LECTURE_MEMO_STU_CREATE_REQUEST,
        data: {
          memo: data.memo,
          UserId: memoDatum.UserId,
          LectureId: memoDatum.LectureId,
        },
      });
    },
    [memoDatum]
  );

  const memoUpdateFinishHandler = useCallback(
    (data) => {
      dispatch({
        type: LECTURE_MEMO_STU_UPDATE_REQUEST,
        data: {
          id: memoId,
          memo: data.memo,
        },
      });
    },
    [memoId]
  );

  const onChangeHomeWorkPage = useCallback((page) => {
    setCurrentPage4(page);

    dispatch({
      type: LECTURE_HOMEWORK_LIST_REQUEST,
      data: {
        LectureId: parseInt(router.query.id),
        page,
      },
    });
  }, []);

  const onChangeFiles = useCallback(
    (e) => {
      const formData = new FormData();

      [].forEach.call(e.target.files, (file) => {
        formData.append("file", file);
      });

      if (e.target.files[0].size > 5242880) {
        message.error("파일 용량 제한 (최대 5MB)");
        imageInput.current.value = "";
        return;
      }

      dispatch({
        type: LECTURE_FILE_REQUEST,
        data: formData,
      });

      setFileName(e.target.files[0] && e.target.files[0].name);
    },
    [imageInput]
  );

  const diaryFinishHandler = useCallback(
    (value) => {
      dispatch({
        type: LECTURE_DIARY_CREATE_REQUEST,
        data: {
          author: me.username,
          process:
            value.process1 +
            "권 " +
            value.process2 +
            "단원 " +
            value.process3 +
            "페이지",
          lectureMemo: value.lectureMemo,
          LectureId: router.query.id,
          startLv:
            value.process1 +
            "권 " +
            value.process2 +
            "단원 " +
            value.process3 +
            "페이지",
        },
      });
    },
    [me]
  );

  const onReset = useCallback(() => {
    form.resetFields();
    answerform.resetFields();
    noticeform.resetFields();
    noticeWriteform.resetFields();
    homeworkUploadform.resetFields();
    diaryform.resetFields();
    homeworkSubmitform.resetFields();
    memoform.resetFields();
    memoWriteform.resetFields();

    inputDate.setValue("");
    inputMemoSearch.setValue("");
    noticeFileName.setValue("");

    setCheckedAllValue(false);
    setMessageViewToggle(false);
    setIsCalendar(false);
    setHomeWorkModalToggle(false);
    setNoticeModalToggle(false);
    setMessageSendModalToggle(false);
    setAdminSendMessageToggle(false);
    setDiaryModalToggle(false);
    setStudentToggle(false);
    setMemoToggle(false);
    setMemoStuDetailToggle(false);
    setNoticeContent("");
    setFileName("");
    setFilePath("");
    setMemoDatum("");
    setMessageAnswerModal(false);
    setNoticeViewModal(false);
    setNoticeViewDatum("");
    setMemoStuBackToggle(false);
    setCommuteToggle(false);
    setDiaryViewModalToggle(false);

    dispatch({
      type: DETAIL_MODAL_CLOSE_REQUEST,
    });
  }, []);

  const onChangeBoxEachHanlder = useCallback((e, idx2, arr) => {
    let result = arr.map((data, idx) => {
      return idx2 === idx ? { ...data, isCheck: e.target.checked } : data;
    });
    setCheckedList(result);
  }, []);

  const onChangeBoxAllHanlder = useCallback((e, arr) => {
    let resultAll = arr.map((data) => {
      return { ...data, isCheck: e.target.checked };
    });
    setCheckedAllValue(e.target.checked);
    setCheckedList(resultAll);
  }, []);

  const messageViewModalHanlder = useCallback((data) => {
    setMessageViewToggle(true);

    setMessageDatum(data);
    // onFillAnswer(data);
  }, []);

  const onFill = (data) => {
    form.setFieldsValue({
      title1: data[0] && data[0].title,
      content2: data[0] && data[0].content,
    });
  };

  // const onFillAnswer = (data) => {
  //   answerform.setFieldsValue({
  //     messageTitle: data.title,
  //     messageContent: data.content,
  //   });
  // };

  const onFillNotice = (data) => {
    if (data.length !== 0) {
      noticeform.setFieldsValue({
        noticeTitle: data[0].title,
        noticeContent: data[0].content,
      });
    }
  };

  const onFillMemoform = (data) => {
    memoform.setFieldsValue({
      memo: data.memo,
      username: data.username,
    });
  };

  const answerFinishHandler = useCallback(
    (data, messageData) => {
      if (messageData) {
        dispatch({
          type: MESSAGE_CREATE_REQUEST,
          data: {
            title: data.messageTitle,
            author: me.username,
            senderId:
              messageData && messageData.receiverId
                ? messageData.receiverId
                : me.id,
            receiverId:
              messageData && messageData.senderId ? messageData.senderId : "",
            content: data.messageContent,
            level: messageData.userlevel ? messageData.userlevel : 4,
          },
        });
      }
    },

    [me]
  );

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

  const diaryCreateToggleHandler = useCallback(() => {
    setDiaryModalToggle((prev) => !prev);
  }, []);

  const onChangeDiaryPage = useCallback((page) => {
    setCurrentPage1(page);

    dispatch({
      type: LECTURE_DIARY_LIST_REQUEST,
      data: {
        page,
        LectureId: router.query.id,
      },
    });
  }, []);

  const onChangeCommutePage = useCallback((page) => {
    setCurrentPage6(page);

    dispatch({
      type: COMMUTE_LIST_REQUEST,
      data: {
        LectureId: parseInt(router.query.id),
        page,
        search: "",
      },
    });
  }, []);

  const onChangeMessagePage = useCallback((page) => {
    setCurrentPage2(page);

    dispatch({
      type: MESSAGE_LECTURE_LIST_REQUEST,
      data: {
        LectureId: router.query.id,
        page,
      },
    });
  }, []);

  const onChangeNoticePage = useCallback((page) => {
    setCurrentPage3(page);

    dispatch({
      type: NOTICE_LECTURE_LIST_REQUEST,
      data: {
        page,
        LectureId: router.query.id,
      },
    });
  }, []);

  const onChangeSubmitPage = useCallback((page) => {
    setCurrentPage5(page);

    dispatch({
      type: LECTURE_SUBMIT_LIST_REQUEST,
      data: {
        page,
        LectureId: router.query.id,
      },
    });
  }, []);

  const onChangeMemoStuPage = useCallback(
    (page) => {
      setCurrentPage7(page);

      dispatch({
        type: LECTURE_MEMO_STU_LIST_REQUEST,
        data: {
          LectureId: parseInt(router.query.id),
          page,
          search: inputMemoSearch.value,
        },
      });
    },
    [inputMemoSearch.value]
  );

  const noticeDetailHandler = useCallback((id) => {
    dispatch({
      type: NOTICE_DETAIL_REQUEST,
      data: {
        noticeId: id,
      },
    });

    dispatch({
      type: DETAIL_MODAL_OPEN_REQUEST,
    });

    setNoticeId(id);
  }, []);

  const messageAnswerToggleHanlder = useCallback(() => {
    setMessageAnswerModal(true);
  }, []);

  const lectureDetailStuMemoHandler = useCallback((data) => {
    onFillMemoform(data);
    setMemoId(data.id);
    setMemoStuBackToggle(true);
  }, []);

  const clickImageUpload = useCallback(() => {
    imageInput.current.click();
  }, [imageInput.current]);

  const getEditContent = useCallback((contentValue) => {
    setNoticeContent(contentValue);
  }, []);

  const getEditContentUpdate = useCallback((contentValue) => {
    setNoticeContent(contentValue);
  }, []);

  const onCommuteHandler = useCallback((data, status) => {
    dispatch({
      type: COMMUTE_CREATE_REQUEST,
      data: {
        time: moment().format("YYYY-MM-DD HH:MM"),
        LectureId: data.LectureId,
        UserId: data.UserId,
        status,
      },
    });
  }, []);

  const commuteSearchHandler = useCallback(() => {
    dispatch({
      type: COMMUTE_LIST_REQUEST,
      data: {
        LectureId: parseInt(router.query.id),
        page: 1,
        search: inputCommuteSearch.value,
      },
    });
  }, [inputCommuteSearch.value]);

  const memoSearchHandler = useCallback(() => {
    dispatch({
      type: LECTURE_MEMO_STU_LIST_REQUEST,
      data: {
        LectureId: parseInt(router.query.id),
        page: 1,
        search: inputMemoSearch.value,
      },
    });
  }, [inputMemoSearch.value]);

  const onCommuteListHandler = useCallback(() => {
    setCommuteToggle((prev) => !prev);
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

  const stepEnd = useCallback((endDate, day) => {
    let endDay =
      moment
        .duration(moment(endDate).diff(moment().format("YYYY-MM-DD")))
        .asDays() + 1;

    const arr = ["일", "월", "화", "수", "목", "금", "토"];
    let add = 0;

    for (let i = 0; i < endDay; i++) {
      let saveDay = moment().add(i, "days").day();

      const saveResult = day.includes(arr[saveDay]);

      if (saveResult) {
        add += 1;
      }
    }

    return add;
  }, []);

  const stepHanlder2 = useCallback((startDate, endDate, count, day) => {
    let saveStart = moment(startDate).format("YYYY-MM-DD");

    const save = moment
      .duration(moment(saveStart).diff(moment().format("YYYY-MM-DD")))
      .asDays();

    const saveEnd = moment
      .duration(
        moment(endDate, "YYYY-MM-DD").diff(moment().format("YYYY-MM-DD"))
      )
      .asDays();

    if (save < 0) {
      return true;
    }

    if (saveEnd < 0) {
      return false;
    }

    const arr = ["일", "월", "화", "수", "목", "금", "토"];

    let toDay = moment().add("days").day();
    let toDayCheck = day.includes(arr[toDay]);

    return toDayCheck;
  }, []);

  const diaryViewClickHandler = useCallback((data) => {
    setDiaryViewModalToggle(true);
    setDiaryData(data);
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
            padding={width < 700 ? `30px 0` : `60px 0`}
            color={Theme.white_C}
          >
            <RsWrapper dr={`row`} ju={width < 900 ? `center` : `flex-start`}>
              <Wrapper dr={`row`} ju={`space-between`}>
                <Wrapper dr={`row`} width={`auto`} ju={`flex-start`}>
                  <Image
                    width={width < 700 ? `65px` : `75px`}
                    height={width < 700 ? `65px` : `75px`}
                    radius={`100%`}
                    src={
                      me && me.profileImage
                        ? me.profileImage
                        : "https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/img_default-profile.png"
                    }
                    alt="teacher_thumbnail"
                  />

                  <Wrapper
                    dr={`row`}
                    width={`auto`}
                    fontSize={width < 700 ? `20px` : `28px`}
                    padding={`0 0 0 15px`}
                  >
                    <Text fontWeight={`bold`}>
                      안녕하세요,&nbsp;
                      <SpanText
                        color={Theme.subTheme9_C}
                        wordBreak={`break-all`}
                      >
                        {me && me.username}&nbsp;
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
            </RsWrapper>
          </Wrapper>
          <RsWrapper margin={`80px 0 0`}>
            <Wrapper>
              {lectureDetail && lectureDetail.length === 0
                ? ""
                : lectureDetail &&
                  lectureDetail.map((data, idx) => {
                    return (
                      <Wrapper
                        key={data.id}
                        dr={`row`}
                        ju={`flex-start`}
                        al={`flex-start`}
                        border={`1px solid ${Theme.grey_C}`}
                        padding={width < 700 ? `15px 10px 10px` : `35px 30px`}
                        margin={`0 0 20px`}
                        bgColor={Theme.subTheme9_C}
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
                          al={`flex-start`}
                        >
                          <Wrapper
                            width={`calc(100% - 42px)`}
                            dr={`row`}
                            ju={`flex-start`}
                          >
                            <Wrapper
                              width={`auto`}
                              padding={width < 700 ? `0` : `5px`}
                              margin={`0 10px 0 0`}
                            >
                              <Image
                                width={`22px`}
                                height={`22px`}
                                src="https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_clock.png"
                                alt="clock_icon"
                              />
                            </Wrapper>

                            <Text
                              fontSize={width < 700 ? `14px` : `18px`}
                              fontWeight={`bold`}
                              lineHeight={`1.22`}
                            >
                              {divideLecture(data.day, data.time)}
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
                          </Wrapper>
                        </Wrapper>

                        <Wrapper
                          dr={`row`}
                          width={width < 1400 ? `100%` : `60%`}
                        >
                          <Wrapper
                            dr={`row`}
                            ju={`flex-start`}
                            margin={width < 800 ? `10px 0 0` : `0`}
                            width={width < 800 ? `100%` : `100%`}
                          >
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
                              width={width < 700 ? `auto` : `140px`}
                            >
                              {moment(data.startDate, "YYYY/MM/DD").format(
                                "YYYY/MM/DD"
                              )}
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
                              borderRightBool={true}
                            >
                              {`${data.number}`}
                            </CustomText2>

                            <CustomText2
                              color={Theme.black_2C}
                              fontWeight={`normal`}
                              fontSize={width < 700 ? `14px` : `18px`}
                              borderRightBool={false}
                            >
                              {`${data.course}`}
                            </CustomText2>

                            {/* <Text
                              width={`180px`}
                              color={Theme.black_2C}
                              fontSize={width < 700 ? `14px` : `18px`}
                              margin={width < 700 ? `0` : `0 13px 0 0`}>
                              {`남은 수업 수:`}
                              <SpanText color={Theme.red_C}>{` ${stepHanlder(
                                data.startDate,
                                data.endDate,
                                data.count,
                                data.lecDate,
                                data.day
                              )}회`}</SpanText>
                            </Text> */}
                          </Wrapper>

                          {/* {width < 700 && (
                            <Wrapper
                              dr={`row`}
                              margin={width < 800 ? `10px 0 0` : `0`}>
                              <Text
                                width={`150px`}
                                color={Theme.black_2C}
                                fontSize={width < 700 ? `14px` : `18px`}
                                margin={width < 700 ? `0` : `0 13px 0 0`}>
                                {`남은 횟수 ${stepHanlder(
                                  data.startDate,
                                  data.endDate,
                                  data.count,
                                  data.lecDate,
                                  data.day
                                )}`}
                              </Text>

                             
                            </Wrapper>
                          )} */}
                        </Wrapper>
                      </Wrapper>
                    );
                  })}

              <Wrapper borderTop={`2px solid ${Theme.black_C}`}>
                {width < 700 ? (
                  <>
                    <Wrapper
                      dr={`row`}
                      textAlign={`center`}
                      ju={`center`}
                      padding={`20px 0`}
                      bgColor={Theme.subTheme9_C}
                      borderBottom={`1px solid ${Theme.grey_C}`}
                    >
                      <CustomCheckBox
                        checked={checkedAllValue}
                        onChange={(e) => onChangeBoxAllHanlder(e, checkedList)}
                      />
                      <Text
                        fontSize={width < 700 ? `14px` : `18px`}
                        fontWeight={`Bold`}
                        width={`25%`}
                      >
                        학생명
                      </Text>
                      <Text
                        fontSize={width < 700 ? `14px` : `18px`}
                        fontWeight={`Bold`}
                        width={`25%`}
                      >
                        출생년도
                      </Text>
                      <Text
                        fontSize={width < 700 ? `14px` : `18px`}
                        fontWeight={`Bold`}
                        width={`25%`}
                      >
                        국가
                      </Text>
                    </Wrapper>

                    {partLectureList && partLectureList.length === 0 ? (
                      <Wrapper margin={`50px 0`}>
                        <Empty description="조회된 데이터가 없습니다." />
                      </Wrapper>
                    ) : (
                      partLectureList &&
                      partLectureList.map((data, idx) => {
                        return (
                          <Wrapper
                            key={data.id}
                            dr={`row`}
                            textAlign={`center`}
                            padding={`25px 0 20px`}
                            bgColor={idx % 2 === 1 && Theme.subTheme_C}
                            borderBottom={`1px solid ${Theme.grey_C}`}
                          >
                            <CustomCheckBox
                              checked={
                                checkedList[idx] && checkedList[idx].isCheck
                              }
                              onChange={(e) =>
                                onChangeBoxEachHanlder(e, idx, checkedList)
                              }
                            />

                            <Text
                              fontSize={width < 700 ? `14px` : `16px`}
                              width={`25%`}
                              wordBreak={`break-word`}
                            >
                              {data.username}
                            </Text>
                            <Text
                              fontSize={width < 700 ? `14px` : `16px`}
                              width={`25%`}
                            >
                              {data.birth.slice(0, 10)}
                            </Text>
                            <Text
                              fontSize={width < 700 ? `14px` : `16px`}
                              width={`25%`}
                            >
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
                      margin={width < 700 ? `20px 0 0` : `0`}
                      bgColor={Theme.subTheme9_C}
                      borderBottom={`1px solid ${Theme.grey_C}`}
                      borderTop={`2px solid ${Theme.black_C}`}
                    >
                      <Text
                        fontSize={width < 700 ? `14px` : `18px`}
                        fontWeight={`Bold`}
                        width={`25%`}
                        wordBreak={`break-word`}
                      >
                        수업료
                      </Text>

                      <Text
                        fontSize={width < 700 ? `14px` : `18px`}
                        fontWeight={`Bold`}
                        width={`25%`}
                      >
                        만기일
                      </Text>
                      <Text
                        fontSize={width < 700 ? `14px` : `18px`}
                        fontWeight={`Bold`}
                        width={`25%`}
                      >
                        메모
                      </Text>
                      <Text
                        fontSize={width < 700 ? `14px` : `18px`}
                        fontWeight={`Bold`}
                        width={`25%`}
                      >
                        출석
                      </Text>
                    </Wrapper>

                    {partLectureList && partLectureList.length === 0 ? (
                      <Wrapper margin={`50px 0`}>
                        <Empty description="조회된 데이터가 없습니다." />
                      </Wrapper>
                    ) : (
                      partLectureList &&
                      partLectureList.map((data, idx) => {
                        return (
                          <Wrapper
                            key={data.id}
                            dr={`row`}
                            textAlign={`center`}
                            padding={`25px 0 20px`}
                            bgColor={idx % 2 === 1 && Theme.subTheme_C}
                            borderBottom={`1px solid ${Theme.grey_C}`}
                          >
                            <Text
                              fontSize={width < 700 ? `14px` : `16px`}
                              width={`25%`}
                            >
                              {`$${
                                partLecturePrice.find(
                                  (value) => value.UserId === data.UserId
                                )?.price || "-"
                              }`}
                            </Text>
                            <Text
                              fontSize={width < 700 ? `14px` : `16px`}
                              width={`25%`}
                              wordBreak={`break-word`}
                            >
                              {data.endDate}

                              <SpanText color={Theme.red_C}>
                                {`(${moment
                                  .duration(
                                    moment(data.endDate, "YYYY-MM-DD").diff(
                                      moment().format("YYYY-MM-DD")
                                    )
                                  )
                                  .asDays()})`}
                              </SpanText>
                            </Text>

                            <Wrapper width={`25%`}>
                              <Button
                                type={`primary`}
                                size={`small`}
                                style={{ margin: `0 0 0 10px` }}
                                onClick={() => detailStuToggleHandler(data)}
                                fontSize={width < 700 ? `14px` : `16px`}
                                disabled={
                                  stepHanlder2(
                                    data.startDate,
                                    data.endDate,
                                    data.count,

                                    data.day
                                  )
                                    ? false
                                    : true
                                }
                              >
                                작성하기
                              </Button>
                            </Wrapper>

                            <Wrapper width={`25%`}>
                              <Button
                                type={`primary`}
                                size={`small`}
                                style={{ margin: `0 0 0 10px` }}
                                bgColor={idx % 2 === 1 && Theme.subTheme_C}
                                borderBottom={`1px solid ${Theme.grey_C}`}
                                onClick={() => onCommuteHandler(data, "출석")}
                                cursor={`pointer`}
                                fontSize={width < 700 ? `14px` : `16px`}
                                disabled={
                                  stepHanlder2(
                                    data.startDate,
                                    data.endDate,
                                    data.count,

                                    data.day
                                  )
                                    ? false
                                    : true
                                }
                                color={
                                  "출석"
                                    ? `${Theme.basicTheme_C}`
                                    : `${Theme.red_C}`
                                }
                              >
                                {"출석"}
                              </Button>

                              <Button
                                size={`small`}
                                style={{ margin: `0 0 0 10px` }}
                                bgColor={idx % 2 === 1 && Theme.subTheme_C}
                                borderBottom={`1px solid ${Theme.grey_C}`}
                                onClick={() => onCommuteHandler(data, "결석")}
                                cursor={`pointer`}
                                fontSize={width < 700 ? `14px` : `16px`}
                                disabled={
                                  stepHanlder2(
                                    data.startDate,
                                    data.endDate,
                                    data.count,

                                    data.day
                                  )
                                    ? false
                                    : true
                                }
                                color={
                                  "결석"
                                    ? `${Theme.basicTheme_C}`
                                    : `${Theme.red_C}`
                                }
                              >
                                {"결석"}
                              </Button>

                              <Button
                                type={`primary`}
                                size={`small`}
                                style={{ margin: `0 0 0 10px` }}
                                bgColor={idx % 2 === 1 && Theme.subTheme_C}
                                borderBottom={`1px solid ${Theme.grey_C}`}
                                onClick={() => onCommuteHandler(data, "지각")}
                                cursor={`pointer`}
                                fontSize={width < 700 ? `14px` : `16px`}
                                disabled={
                                  stepHanlder2(
                                    data.startDate,
                                    data.endDate,
                                    data.count,

                                    data.day
                                  )
                                    ? false
                                    : true
                                }
                                color={
                                  "지각"
                                    ? `${Theme.basicTheme_C}`
                                    : `${Theme.red_C}`
                                }
                              >
                                {"지각"}
                              </Button>
                            </Wrapper>
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
                    padding={`20px 0px`}
                    bgColor={Theme.subTheme9_C}
                    borderBottom={`1px solid ${Theme.grey_C}`}
                  >
                    <CustomCheckBox
                      checked={checkedAllValue}
                      onChange={(e) => onChangeBoxAllHanlder(e, checkedList)}
                    />

                    <Text
                      fontSize={width < 700 ? `14px` : `18px`}
                      fontWeight={`Bold`}
                      width={`15%`}
                    >
                      학생명
                    </Text>
                    <Text
                      fontSize={width < 700 ? `14px` : `18px`}
                      fontWeight={`Bold`}
                      width={`10%`}
                    >
                      출생년도
                    </Text>
                    <Text
                      fontSize={width < 700 ? `14px` : `18px`}
                      fontWeight={`Bold`}
                      width={`10%`}
                    >
                      국가
                    </Text>
                    <Text
                      fontSize={width < 700 ? `14px` : `18px`}
                      fontWeight={`Bold`}
                      width={`15%`}
                    >
                      수업료
                    </Text>
                    <Text
                      fontSize={width < 700 ? `14px` : `18px`}
                      fontWeight={`Bold`}
                      width={`20%`}
                    >
                      만기일
                    </Text>
                    <Text
                      fontSize={width < 700 ? `14px` : `18px`}
                      fontWeight={`Bold`}
                      width={`10%`}
                    >
                      메모
                    </Text>

                    <Text
                      fontSize={width < 700 ? `14px` : `18px`}
                      fontWeight={`Bold`}
                      width={`10%`}
                    >
                      출석
                    </Text>
                  </Wrapper>
                )}

                {width > 700 && (
                  <>
                    {partLectureList && partLectureList.length === 0 ? (
                      <Wrapper margin={`50px 0`}>
                        <Empty description="조회된 데이터가 없습니다." />
                      </Wrapper>
                    ) : (
                      partLectureList &&
                      partLectureList.map((data, idx) => {
                        return (
                          <Wrapper
                            key={data.id}
                            dr={`row`}
                            textAlign={`center`}
                            wordBreak={`break-word`}
                            padding={`25px 0 20px`}
                            bgColor={idx % 2 === 1 && Theme.subTheme_C}
                            borderBottom={`1px solid ${Theme.grey_C}`}
                          >
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
                              width={`15%`}
                              wordBreak={`break-word`}
                            >
                              {data.username}
                            </Text>
                            <Text
                              fontSize={width < 700 ? `14px` : `16px`}
                              width={`10%`}
                            >
                              {data.birth.slice(0, 10)}
                            </Text>
                            <Text
                              fontSize={width < 700 ? `14px` : `16px`}
                              width={`10%`}
                            >
                              {data.stuCountry}
                            </Text>
                            <Text
                              fontSize={width < 700 ? `14px` : `16px`}
                              width={`15%`}
                            >
                              {`$${
                                partLecturePrice.find(
                                  (value) => value.UserId === data.UserId
                                )?.price || "-"
                              }`}
                            </Text>
                            <Text
                              fontSize={width < 700 ? `14px` : `16px`}
                              width={`20%`}
                              wordBreak={`break-word`}
                            >
                              {data.endDate.slice(0, 10)}

                              <SpanText color={Theme.red_C}>
                                {`(${stepEnd(data.endDate, data.day)}회)`}
                              </SpanText>
                            </Text>

                            <Wrapper width={`10%`}>
                              <Button
                                type={`primary`}
                                size={`small`}
                                onClick={() => detailStuToggleHandler(data)}
                                fontSize={width < 700 ? `14px` : `16px`}
                                disabled={
                                  stepHanlder2(
                                    data.startDate,
                                    data.endDate,
                                    data.count,

                                    data.day
                                  )
                                    ? false
                                    : true
                                }
                              >
                                작성하기
                              </Button>
                            </Wrapper>

                            <Wrapper width={`10%`}>
                              <Button
                                type={`primary`}
                                size={`small`}
                                style={{ margin: `0 0 5px` }}
                                bgColor={idx % 2 === 1 && Theme.subTheme_C}
                                borderBottom={`1px solid ${Theme.grey_C}`}
                                onClick={() => onCommuteHandler(data, "출석")}
                                cursor={`pointer`}
                                fontSize={width < 700 ? `14px` : `16px`}
                                disabled={
                                  stepHanlder2(
                                    data.startDate,
                                    data.endDate,
                                    data.count,

                                    data.day
                                  )
                                    ? false
                                    : true
                                }
                                color={
                                  "출석"
                                    ? `${Theme.basicTheme_C}`
                                    : `${Theme.red_C}`
                                }
                              >
                                {"출석"}
                              </Button>

                              <Button
                                size={`small`}
                                style={{ margin: `0 0 5px` }}
                                bgColor={idx % 2 === 1 && Theme.subTheme_C}
                                borderBottom={`1px solid ${Theme.grey_C}`}
                                onClick={() => onCommuteHandler(data, "결석")}
                                cursor={`pointer`}
                                fontSize={width < 700 ? `14px` : `16px`}
                                disabled={
                                  stepHanlder2(
                                    data.startDate,
                                    data.endDate,
                                    data.count,

                                    data.day
                                  )
                                    ? false
                                    : true
                                }
                                color={
                                  "결석"
                                    ? `${Theme.basicTheme_C}`
                                    : `${Theme.red_C}`
                                }
                              >
                                {"결석"}
                              </Button>

                              <Button
                                type={`primary`}
                                size={`small`}
                                bgColor={idx % 2 === 1 && Theme.subTheme_C}
                                borderBottom={`1px solid ${Theme.grey_C}`}
                                onClick={() => onCommuteHandler(data, "지각")}
                                cursor={`pointer`}
                                fontSize={width < 700 ? `14px` : `16px`}
                                disabled={
                                  stepHanlder2(
                                    data.startDate,
                                    data.endDate,
                                    data.count,

                                    data.day
                                  )
                                    ? false
                                    : true
                                }
                                color={
                                  "지각"
                                    ? `${Theme.basicTheme_C}`
                                    : `${Theme.red_C}`
                                }
                              >
                                {"지각"}
                              </Button>
                            </Wrapper>
                          </Wrapper>
                        );
                      })
                    )}
                  </>
                )}
              </Wrapper>
              <Wrapper
                dr={`row`}
                ju={width < 700 ? `center` : `flex-end`}
                margin={`20px 0 0 0`}
              >
                <CommonButton
                  radius={`5px`}
                  width={width < 700 ? `40%` : `150px`}
                  height={width < 700 ? `32px` : `38px`}
                  padding={`0`}
                  margin={width < 900 ? `5px` : `0 5px 0 0`}
                  fontSize={`14px`}
                  onClick={() => messageSendModalHandler()}
                >
                  학생에게 쪽지 보내기
                </CommonButton>

                <CommonButton
                  radius={`5px`}
                  width={width < 700 ? `40%` : `150px`}
                  height={width < 700 ? `32px` : `38px`}
                  padding={`0`}
                  margin={width < 900 ? `5px` : `0 5px 0 0`}
                  fontSize={`14px`}
                  onClick={() => adminMessageModal()}
                >
                  관리자에게 쪽지 보내기
                </CommonButton>

                <CommonButton
                  radius={`5px`}
                  width={width < 700 ? `40%` : `150px`}
                  height={width < 700 ? `32px` : `38px`}
                  padding={`0`}
                  margin={width < 900 ? `5px` : `0 5px 0 0`}
                  fontSize={`14px`}
                  onClick={() => detailStuViewToggleHandler()}
                >
                  메모 목록
                </CommonButton>

                <CommonButton
                  radius={`5px`}
                  width={width < 700 ? `40%` : `150px`}
                  height={width < 700 ? `32px` : `38px`}
                  padding={`0`}
                  fontSize={`14px`}
                  margin={width < 900 && `5px`}
                  onClick={() => onCommuteListHandler()}
                >
                  출석 목록
                </CommonButton>
              </Wrapper>
            </Wrapper>

            <Wrapper al={`flex-start`} margin={`86px 0 0 0`}>
              <CommonTitle margin={`0 0 20px`}>강사일지</CommonTitle>

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
                    width={`15%`}
                  >
                    글번호
                  </Text>
                  <Text
                    fontSize={width < 700 ? `14px` : `18px`}
                    fontWeight={`Bold`}
                    width={`15%`}
                  >
                    강사명
                  </Text>
                  <Text
                    fontSize={width < 700 ? `14px` : `18px`}
                    fontWeight={`Bold`}
                    width={`20%`}
                  >
                    진도
                  </Text>
                  <Text
                    fontSize={width < 700 ? `14px` : `18px`}
                    fontWeight={`Bold`}
                    width={`25%`}
                  >
                    수업메모
                  </Text>
                  <Text
                    fontSize={width < 700 ? `14px` : `18px`}
                    fontWeight={`Bold`}
                    width={`25%`}
                  >
                    날짜
                  </Text>
                </Wrapper>

                {lectureDiaryList && lectureDiaryList.length === 0 ? (
                  <Wrapper margin={`50px 0`}>
                    <Empty description="조회된 데이터가 없습니다." />
                  </Wrapper>
                ) : (
                  lectureDiaryList &&
                  lectureDiaryList.map((data, idx) => {
                    return (
                      <Wrapper
                        key={data.id}
                        dr={`row`}
                        textAlign={`center`}
                        padding={`25px 0 20px`}
                        cursor={`pointer`}
                        bgColor={idx % 2 === 1 && Theme.subTheme_C}
                        borderBottom={`1px solid ${Theme.grey_C}`}
                        onClick={() => diaryViewClickHandler(data)}
                      >
                        <Text
                          fontSize={width < 700 ? `14px` : `16px`}
                          width={`15%`}
                          wordBreak={`break-word`}
                        >
                          {data.id}
                        </Text>
                        <Text
                          fontSize={width < 700 ? `14px` : `16px`}
                          width={`15%`}
                        >
                          {data.author}
                        </Text>
                        <Text
                          fontSize={width < 700 ? `14px` : `16px`}
                          width={`20%`}
                        >
                          {data.process}
                        </Text>

                        <Text
                          fontSize={width < 700 ? `14px` : `16px`}
                          width={`25%`}
                        >
                          {data.lectureMemo}
                        </Text>
                        <Text
                          fontSize={width < 700 ? `14px` : `16px`}
                          width={`25%`}
                        >
                          {data.createdAt.slice(0, 10)}
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
                  fontSize={`14px`}
                  onClick={() => diaryCreateToggleHandler()}
                >
                  작성하기
                </CommonButton>
              </Wrapper>

              <Wrapper>
                <CustomPage
                  current={currentPage1}
                  total={lectureDiaryLastPage * 10}
                  onChange={(page) => onChangeDiaryPage(page)}
                ></CustomPage>
              </Wrapper>
            </Wrapper>

            <Wrapper al={`flex-start`}>
              <CommonTitle margin={`86px 0 20px`}>숙제관리</CommonTitle>

              {(lectureHomeworkList && lectureHomeworkList.length === 0) ||
              null ? (
                <Wrapper margin={`50px 0`}>
                  <Empty description="조회된 데이터가 없습니다." />
                </Wrapper>
              ) : (
                lectureHomeworkList &&
                lectureHomeworkList.map((data, idx) => {
                  return (
                    <Wrapper
                      key={data.id}
                      dr={`row`}
                      ju={`flex-start`}
                      shadow={`0px 5px 15px rgb(0,0,0,0.16)`}
                      margin={`0 0 10px 0`}
                      padding={`20px`}
                      radius={`10px`}
                      bgColor={idx % 2 === 1 && Theme.subTheme_C}
                      borderBottom={`1px solid ${Theme.grey_C}`}
                    >
                      <Text
                        width={`50%`}
                        fontSize={width < 700 ? `14px` : `16px`}
                      >
                        {data.title}
                      </Text>

                      <Wrapper
                        width={`40%`}
                        dr={width < 1100 ? `column` : `row`}
                      >
                        <CustomWrapper width={width < 1100 ? `100%` : `50%`}>
                          <DownloadOutlined
                            onClick={() => fileDownloadHandler(data.file)}
                            style={{
                              fontSize: width < 700 ? 15 : 25,
                              color: Theme.basicTheme_C,
                              marginRight: 10,
                              cursor: `pointer`,
                            }}
                          />

                          <Text
                            fontSize={width < 700 ? `14px` : `16px`}
                            display={width < 700 ? `none` : `block`}
                          >
                            파일 업로드
                          </Text>
                        </CustomWrapper>

                        <CustomWrapper
                          width={width < 1100 ? `100%` : `50%`}
                          beforeBool={width < 1300 ? false : true}
                        >
                          <CalendarOutlined
                            style={{
                              fontSize: width < 700 ? 15 : 25,
                              color: Theme.basicTheme_C,
                              marginRight: 10,
                              cursor: `pointer`,
                            }}
                          />
                          <Text fontSize={width < 700 ? `14px` : `16px`}>
                            {`${data.date}까지`}
                          </Text>
                        </CustomWrapper>
                      </Wrapper>

                      <Wrapper width={`10%`} ju={`center`}>
                        <Text
                          fontSize={width < 700 ? `14px` : `16px`}
                          margin={width < 700 ? `0 0 0 5px` : "0"}
                          fontWeight={`bold`}
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
                        >
                          {moment
                            .duration(
                              moment(data.date, "YYYY-MM-DD").diff(
                                moment(new Date(), "YYYY-MM-DD")
                              )
                            )
                            .asDays() < -1
                            ? "기간 만료"
                            : "제출 기간"}
                        </Text>
                      </Wrapper>
                    </Wrapper>
                  );
                })
              )}
            </Wrapper>

            <Wrapper dr={`row`} ju={`space-between`} margin={`20px 0 40px`}>
              <CommonButton
                radius={`5px`}
                width={width < 700 ? `100px` : `110px`}
                height={width < 700 ? `32px` : `38px`}
                fontSize={`14px`}
                onClick={() => studentToggleHanlder()}
              >
                학생 숙제
              </CommonButton>

              <CommonButton
                radius={`5px`}
                width={width < 700 ? `100px` : `110px`}
                height={width < 700 ? `32px` : `38px`}
                fontSize={`14px`}
                onClick={() => setHomeWorkModalToggle(true)}
              >
                숙제 업로드
              </CommonButton>
            </Wrapper>

            <Wrapper>
              <CustomPage
                current={currentPage4}
                total={lectureHomeworkLastPage * 10}
                onChange={(page) => onChangeHomeWorkPage(page)}
              ></CustomPage>
            </Wrapper>

            <Wrapper al={`flex-start`}>
              <CommonTitle margin={`86px 0 20px`}>공지사항</CommonTitle>
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
                  width={`15%`}
                >
                  글번호
                </Text>
                <Text
                  fontSize={width < 700 ? `14px` : `18px`}
                  fontWeight={`Bold`}
                  width={`60%`}
                >
                  제목
                </Text>
                <Text
                  fontSize={width < 700 ? `14px` : `18px`}
                  fontWeight={`Bold`}
                  width={`25%`}
                >
                  날짜
                </Text>
              </Wrapper>

              {noticeLectureList && noticeLectureList.length === 0 ? (
                <Wrapper margin={`50px 0`}>
                  <Empty description="조회된 데이터가 없습니다." />
                </Wrapper>
              ) : (
                noticeLectureList &&
                noticeLectureList.map((data, idx) => {
                  return (
                    <Wrapper
                      key={data.id}
                      onClick={() => onClickNoticeHandler(data)}
                      dr={`row`}
                      textAlign={`center`}
                      ju={`flex-start`}
                      padding={`25px 0 20px`}
                      cursor={`pointer`}
                      bgColor={idx % 2 === 1 && Theme.subTheme_C}
                      borderBottom={`1px solid ${Theme.grey_C}`}
                    >
                      <Text
                        fontSize={width < 700 ? `14px` : `16px`}
                        width={`15%`}
                        wordBreak={`break-word`}
                      >
                        {data.id}
                      </Text>
                      <Text
                        fontSize={width < 700 ? `14px` : `16px`}
                        width={`60%`}
                        textAlign={`left`}
                      >
                        {data.title}
                      </Text>
                      <Text
                        fontSize={width < 700 ? `14px` : `16px`}
                        width={`25%`}
                      >
                        {moment(data.createdAt, "YYYY/MM/DD").format(
                          "YYYY/MM/DD"
                        )}
                      </Text>
                    </Wrapper>
                  );
                })
              )}
            </Wrapper>

            <Wrapper al={`flex-end`} margin={`20px 0 40px`}>
              <CommonButton
                radius={`5px`}
                width={width < 700 ? `90px` : `110px`}
                height={width < 700 ? `32px` : `38px`}
                fontSize={width < 700 ? `14px` : `14px`}
                onClick={() => setNoticeModalToggle(true)}
              >
                작성하기
              </CommonButton>
            </Wrapper>

            <Wrapper>
              <CustomPage
                total={noticeLectureLastPage * 10}
                current={currentPage3}
                onChange={(page) => onChangeNoticePage(page)}
              ></CustomPage>
            </Wrapper>

            <Wrapper al={`flex-start`} margin={`86px 0 20px`}>
              <CommonTitle>쪽지함</CommonTitle>
            </Wrapper>

            <Wrapper>
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
                    width={`15%`}
                  >
                    글 번호
                  </Text>
                  <Text
                    fontSize={width < 700 ? `14px` : `18px`}
                    fontWeight={`Bold`}
                    width={`calc(100% - 15% - 15% - 25%)`}
                  >
                    제목
                  </Text>

                  <Text
                    fontSize={width < 700 ? `14px` : `18px`}
                    fontWeight={`Bold`}
                    width={`15%`}
                  >
                    작성자
                  </Text>

                  <Text
                    fontSize={width < 700 ? `14px` : `18px`}
                    fontWeight={`Bold`}
                    width={`25%`}
                  >
                    날짜
                  </Text>
                </Wrapper>

                {messageLectureList && messageLectureList.length === 0 ? (
                  <Wrapper margin={`50px 0`}>
                    <Empty description="조회된 데이터가 없습니다." />
                  </Wrapper>
                ) : (
                  messageLectureList &&
                  messageLectureList.map((data2, idx) => {
                    return (
                      <Wrapper
                        key={data2.id}
                        dr={`row`}
                        textAlign={`center`}
                        padding={`25px 0 20px`}
                        cursor={`pointer`}
                        bgColor={idx % 2 === 1 && Theme.subTheme_C}
                        borderBottom={`1px solid ${Theme.grey_C}`}
                        onClick={() => messageViewModalHanlder(data2)}
                      >
                        <Text
                          fontSize={width < 700 ? `14px` : `16px`}
                          width={`15%`}
                        >
                          {data2.id}
                        </Text>
                        <Text
                          fontSize={width < 700 ? `14px` : `16px`}
                          width={`calc(100% - 15% - 15% - 25%)`}
                          textAlign={`left`}
                        >
                          {data2.title}
                        </Text>

                        <Text
                          fontSize={width < 700 ? `14px` : `16px`}
                          width={`15%`}
                        >
                          {data2.author}
                        </Text>
                        <Text
                          fontSize={width < 700 ? `14px` : `16px`}
                          width={`25%`}
                        >
                          {moment(data2.createdAt, "YYYY/MM/DD").format(
                            "YYYY/MM/DD"
                          )}
                        </Text>
                      </Wrapper>
                    );
                  })
                )}
              </Wrapper>

              <Wrapper margin={`110px 0`}>
                <CustomPage
                  current={currentPage2}
                  total={messageLectureLastPage * 10}
                  onChange={(page) => onChangeMessagePage(page)}
                ></CustomPage>
              </Wrapper>
            </Wrapper>
          </RsWrapper>
        </WholeWrapper>

        <CustomModal
          visible={noticeViewModal}
          width={`1350px`}
          title="공지사항"
          footer={null}
          closable={false}
        >
          {detailModal ? (
            <CustomForm form={noticeform} onFinish={noticeViewFinishHandler}>
              <Wrapper
                dr={`row`}
                ju={`space-between`}
                margin={`0 0 35px`}
                fontSize={width < 700 ? `14px` : `16px`}
              >
                <Text margin={`0 54px 0 0`}>
                  {`작성자: ${
                    noticeDetail && noticeDetail[0] && noticeDetail[0].author
                  }`}
                </Text>
                <Wrapper
                  width={`auto`}
                  fontSize={width < 700 ? `14px` : `16px`}
                >
                  <Text>
                    {`작성일: ${moment(
                      noticeDetail &&
                        noticeDetail[0] &&
                        noticeDetail[0].createdAt,
                      "YYYY/MM/DD"
                    ).format("YYYY/MM/DD")}`}
                  </Text>
                </Wrapper>
              </Wrapper>

              <Text fontSize={`18px`} fontWeight={`bold`}>
                제목
              </Text>

              <Form.Item
                name="noticeTitle"
                rules={[{ required: true, message: "제목을 입력해주세요." }]}
              >
                <CustomInput width={`100%`}></CustomInput>
              </Form.Item>

              <Text fontSize={`18px`} fontWeight={`bold`}>
                내용
              </Text>

              <Form.Item
                name="noticeContent"
                rules={[{ required: true, message: "내용을 입력해주세요." }]}
              >
                <ToastEditorComponent
                  action={getEditContentUpdate}
                  placeholder="placeholder"
                  noticeDetail={
                    noticeDetail && noticeDetail[0] && noticeDetail[0].content
                  }
                />
              </Form.Item>

              <Wrapper dr={`row`}>
                <CommonButton
                  kindOf={`grey`}
                  margin={`0 10px 0 0`}
                  color={Theme.darkGrey_C}
                  radius={`5px`}
                  onClick={() => onReset()}
                >
                  돌아가기
                </CommonButton>

                <CommonButton
                  color={Theme.white_C}
                  radius={`5px`}
                  htmlType="submit"
                >
                  수정하기
                </CommonButton>
              </Wrapper>
            </CustomForm>
          ) : (
            <>
              <Wrapper
                dr={`row`}
                ju={`space-between`}
                margin={`0 0 35px`}
                fontSize={width < 700 ? `14px` : `16px`}
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
              <Wrapper
                padding={`10px`}
                fontSize={width < 700 ? `14px` : `16px`}
              >
                <WordbreakText>
                  {noticeViewDatum && noticeViewDatum.title}
                </WordbreakText>
              </Wrapper>

              <Text fontSize={`18px`} fontWeight={`bold`}>
                내용
              </Text>
              <Wrapper
                padding={`10px`}
                fontSize={width < 700 ? `14px` : `16px`}
              >
                <WordbreakText
                  dangerouslySetInnerHTML={{
                    __html: noticeViewDatum && noticeViewDatum.content,
                  }}
                ></WordbreakText>
              </Wrapper>

              <Wrapper dr={`row`}>
                <CommonButton
                  margin={`0 10px 0 0`}
                  onClick={() => onReset()}
                  kindOf={`grey`}
                  color={Theme.darkGrey_C}
                  radius={`5px`}
                >
                  돌아가기
                </CommonButton>

                <CommonButton
                  radius={`5px`}
                  onClick={() => noticeDetailHandler(noticeViewDatum.id)}
                >
                  수정하기
                </CommonButton>
              </Wrapper>
            </>
          )}
        </CustomModal>
        {/* 주석하기 */}

        <CustomModal
          visible={messageViewToggle}
          width={`1350px`}
          title={messageAnswerModal ? "쪽지 답변" : "쪽지함"}
          footer={null}
          closable={false}
        >
          <CustomForm
            form={answerform}
            onFinish={(data) => answerFinishHandler(data, messageDatum)}
          >
            {!messageAnswerModal && (
              <>
                <Wrapper
                  dr={`row`}
                  ju={`space-between`}
                  margin={`0 0 35px`}
                  fontSize={width < 700 ? `14px` : `16px`}
                >
                  <Text margin={`0 54px 0 0`}>
                    {`작성자 :${messageDatum && messageDatum.author}`}
                  </Text>
                  <Text>{`날짜: ${
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
                  fontSize={width < 700 ? `14px` : `16px`}
                >
                  <Text>{messageDatum && messageDatum.title}</Text>
                </Wrapper>
                <Text fontSize={`18px`} fontWeight={`bold`}>
                  내용
                </Text>
                <Wrapper
                  padding={`10px`}
                  al={`flex-start`}
                  fontSize={width < 700 ? `14px` : `16px`}
                >
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
                    onClick={() => onReset()}
                  >
                    돌아가기
                  </CommonButton>
                  <CommonButton
                    margin={`0 0 0 5px`}
                    radius={`5px`}
                    onClick={() => messageAnswerToggleHanlder()}
                  >
                    답변하기
                  </CommonButton>
                </Wrapper>
              </>
            )}

            {messageAnswerModal && (
              <>
                <Wrapper dr={`row`} ju={`flex-start`} margin={`0 0 40px`}>
                  <Text
                    fontSize={`18px`}
                    fontWeight={`bold`}
                    margin={`0 35px 0 0`}
                  >
                    작성자
                  </Text>

                  <Text>{messageDatum && messageDatum.author}</Text>
                </Wrapper>

                <Text fontSize={`18px`} fontWeight={`bold`} margin={`0 0 10px`}>
                  제목
                </Text>

                <Form.Item
                  name="messageTitle"
                  rules={[{ required: true, message: "제목을 입력해주세요." }]}
                >
                  <CustomInput width={`100%`} />
                </Form.Item>

                <Text fontSize={`18px`} fontWeight={`bold`} margin={`0 0 10px`}>
                  내용
                </Text>

                <Form.Item
                  name="messageContent"
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
                    작성하기
                  </CommonButton>
                </Wrapper>
              </>
            )}
          </CustomForm>
        </CustomModal>

        <CustomModal
          visible={messageSendModalToggle}
          width={`1350px`}
          title={
            adminSendMessageToggle ? "관리자에게 쪽지 보내기" : "학생에게 쪽지"
          }
          footer={null}
          closable={false}
        >
          <CustomForm
            ref={formRef}
            form={form}
            onFinish={(data) =>
              adminSendMessageToggle
                ? sendMessageAdminFinishHandler(data)
                : noteSendFinishHandler(data, checkedList)
            }
          >
            {!adminSendMessageToggle && (
              <Text
                fontSize={width < 700 ? `14px` : `18px`}
                fontWeight={`bold`}
                margin={`0 0 10px`}
              >
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
                          <Text
                            key={idx}
                            margin={`0 5px 0`}
                            color={Theme.basicTheme_C}
                          >
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
              margin={`0 0 10px`}
            >
              제목
            </Text>
            <Form.Item
              name="title1"
              rules={[{ required: true, message: "제목을 입력해주세요." }]}
            >
              <CustomInput width={`100%`} />
            </Form.Item>
            <Text
              fontSize={width < 700 ? `14px` : `18px`}
              fontWeight={`bold`}
              margin={`0 0 10px`}
            >
              내용
            </Text>
            <Form.Item
              name="content1"
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
          visible={noticeModalToggle}
          width={`1350px`}
          title="공지사항 글 작성하기"
          footer={null}
          closable={false}
        >
          <CustomForm form={noticeWriteform} onFinish={noticeFinishHandler}>
            <Text
              fontSize={width < 700 ? `14px` : `18px`}
              fontWeight={`bold`}
              margin={`20px 0`}
            >
              제목
            </Text>
            <Form.Item
              name="title2"
              rules={[{ required: true, message: "제목을 입력해주세요." }]}
            >
              <CustomInput width={`100%`} placeholder="제목을 입력해주세요." />
            </Form.Item>

            <Text
              fontSize={width < 700 ? `14px` : `18px`}
              fontWeight={`bold`}
              margin={`20px 0`}
            >
              내용
            </Text>
            <Form.Item
              name="content2"
              rules={[{ required: true, message: "내용을 입력해주세요." }]}
            >
              <ToastEditorComponent2
                action={getEditContent}
                placeholder="내용을 입력해주세요."
              />
            </Form.Item>

            <Form.Item name="file">
              <FileBox>
                <input
                  type="file"
                  name="file"
                  hidden
                  ref={fileRef}
                  onChange={fileChangeHandler}
                />
                <Filename>
                  {noticeFileName.value
                    ? noticeFileName.value
                    : `파일을 선택해주세요.`}
                </Filename>
                <Button
                  type="primary"
                  onClick={fileUploadClick}
                  loading={st_noticeUploadLoading}
                >
                  파일 업로드
                </Button>
              </FileBox>
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
                작성하기
              </CommonButton>
            </Wrapper>
          </CustomForm>
        </CustomModal>

        <CustomModal
          visible={homeWorkModalToggle}
          title="숙제 업로드"
          width={`80%`}
          footer={null}
          closable={false}
        >
          <CustomForm
            form={homeworkUploadform}
            ref={homeworkUpload}
            onFinish={homeWorkFinishHandler}
          >
            <Text
              fontSize={width < 700 ? `14px` : `18px`}
              fontWeight={`bold`}
              margin={`0 0 10px`}
            >
              제목
            </Text>
            <Form.Item
              name="title3"
              rules={[{ required: true, message: "제목을 입력해주세요." }]}
            >
              <CustomInput width={`100%`} placeholder="제목을 입력해주세요." />
            </Form.Item>

            <Text
              fontSize={width < 700 ? `14px` : `18px`}
              fontWeight={`bold`}
              margin={`0 0 10px`}
            >
              내용
            </Text>
            <Form.Item
              name="content3"
              rules={[{ required: true, message: "내용을 입력해주세요." }]}
            >
              <CusotmTextArea placeholder="내용을 입력해주세요." />
            </Form.Item>

            <Text
              fontSize={width < 700 ? `14px` : `18px`}
              fontWeight={`bold`}
              margin={`0 0 10px`}
            >
              날짜
            </Text>
            <Form.Item
              name="date"
              rules={[{ required: true, message: "날짜를 선택해주세요." }]}
            >
              <Wrapper dr={`row`} ju={`flex-start`}>
                <CustomInput
                  placeholder="날짜를 선택해주세요."
                  width={`90%`}
                  value={inputDate.value}
                  style={{
                    height: `40px`,
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
                  border={`1px solid ${Theme.grey_C}`}
                  margin={`20px 0 20px`}
                >
                  <Calendar
                    style={{ width: width < 1350 ? `100%` : `250` }}
                    fullscreen={false}
                    onChange={dateChagneHandler}
                  />
                </Wrapper>
              </Wrapper>
            </Form.Item>

            <Text fontSize={width < 700 ? `14px` : `18px`} fontWeight={`bold`}>
              파일 업로드
            </Text>

            <Wrapper al={`flex-start`} margin={`10px 0 0`}>
              <input
                type="file"
                name="file"
                accept=".pdf"
                // multiple
                hidden
                ref={imageInput}
                onChange={onChangeFiles}
              />
              <Button
                icon={<UploadOutlined />}
                onClick={clickImageUpload}
                loading={st_lectureFileLoading}
                style={{
                  height: `40px`,
                  width: `150px`,
                  margin: `10px 0 0`,
                }}
              >
                파일 올리기
              </Button>
              <Text>{`${fileName}`}</Text>
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
              <CommonButton
                margin={`0 0 0 5px`}
                radius={`5px`}
                htmlType="submit"
              >
                작성하기
              </CommonButton>
            </Wrapper>
          </CustomForm>
        </CustomModal>

        <CustomModal
          visible={diaryModalToggle}
          width={`1350px`}
          title="강사일지 작성하기"
          footer={null}
          closable={false}
        >
          <CustomForm form={diaryform} onFinish={diaryFinishHandler}>
            <Text
              fontSize={width < 700 ? `14px` : `18px`}
              fontWeight={`bold`}
              margin={`0 0 10px`}
            >
              진도
            </Text>
            <Wrapper dr={`row`} ju={`flex-start`} margin={`0 0 10px 0`}>
              <Form.Item
                style={{
                  width: `calc(100% / 3 - 10px - 100px)`,
                  margin: `0`,
                }}
                name="process1"
                rules={[{ required: true, message: "진도를 입력해주세요." }]}
              >
                <Select>
                  <Select.Option value={`1`}>1</Select.Option>
                  <Select.Option value={`2`}>2</Select.Option>
                  <Select.Option value={`3`}>3</Select.Option>
                  <Select.Option value={`4`}>4</Select.Option>
                  <Select.Option value={`5`}>5</Select.Option>
                  <Select.Option value={`6`}>6</Select.Option>
                </Select>
              </Form.Item>
              <Text margin={`0 15px 0 0`} width={`50px`}>
                &nbsp; 권
              </Text>
              <Form.Item
                style={{
                  width: `calc(100% / 3 - 10px - 100px)`,
                  margin: `0`,
                }}
                name="process2"
                rules={[{ required: true, message: "진도를 입력해주세요." }]}
              >
                <Select>
                  <Select.Option value={`1`}>1</Select.Option>
                  <Select.Option value={`2`}>2</Select.Option>
                  <Select.Option value={`3`}>3</Select.Option>
                  <Select.Option value={`4`}>4</Select.Option>
                  <Select.Option value={`5`}>5</Select.Option>
                  <Select.Option value={`6`}>6</Select.Option>
                  <Select.Option value={`7`}>7</Select.Option>
                  <Select.Option value={`8`}>8</Select.Option>
                  <Select.Option value={`9`}>9</Select.Option>
                  <Select.Option value={`10`}>10</Select.Option>
                  <Select.Option value={`11`}>11</Select.Option>
                  <Select.Option value={`12`}>12</Select.Option>
                </Select>
              </Form.Item>
              <Text margin={`0 15px 0 0`} width={`50px`}>
                &nbsp; 단원
              </Text>
              <Form.Item
                style={{
                  width: `calc(100%내 / 3 - 10px - 100px)`,
                  margin: `0`,
                }}
                name="process3"
                rules={[{ required: true, message: "진도를 입력해주세요." }]}
              >
                <CustomInput type={`number`} width={`100%`} />
              </Form.Item>
              <Text width={`100px`}>&nbsp; 페이지</Text>
            </Wrapper>
            <Text
              fontSize={width < 700 ? `14px` : `18px`}
              fontWeight={`bold`}
              margin={`0 0 10px`}
            >
              수업 메모
            </Text>
            <Form.Item
              name="lectureMemo"
              rules={[{ required: true, message: "수업 메모를 입력해주세요." }]}
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
                작성하기
              </CommonButton>
            </Wrapper>
          </CustomForm>
        </CustomModal>

        <CustomModal
          visible={diaryViewModalToggle}
          width={`1350px`}
          title="자세한 강사일지"
          footer={null}
          closable={false}
        >
          <CustomForm form={diaryViewform}>
            <Wrapper al={`flex-start`} fontSize={width < 700 ? `14px` : `18px`}>
              <Text fontWeight={`bold`} margin={`0 0 10px`}>
                진도
              </Text>

              <Text>{diaryData && diaryData.process}</Text>
            </Wrapper>

            <Wrapper al={`flex-start`} fontSize={width < 700 ? `14px` : `18px`}>
              <Text fontWeight={`bold`} margin={`0 0 10px`}>
                수업 메모
              </Text>

              {diaryData &&
                diaryData.lectureMemo &&
                diaryData.lectureMemo.split("\n").map((data, idx) => {
                  return (
                    <Text key={`${data}${idx}`}>
                      {data}
                      <br />
                    </Text>
                  );
                })}
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
          </CustomForm>
        </CustomModal>

        <CustomModal
          visible={studentToggle}
          width={`1350px`}
          title="학생 숙제 제출 목록"
          onCancel={() => onReset()}
          footer={null}
        >
          <CustomForm>
            {lectureSubmitList && lectureSubmitList.length === 0 ? (
              <Wrapper margin={`50px 0`}>
                <Empty description="조회된 학생 숙제 리스트가 없습니다." />
              </Wrapper>
            ) : (
              lectureSubmitList &&
              lectureSubmitList.map((data, idx) => {
                return (
                  <Wrapper
                    key={data.id}
                    dr={`row`}
                    ju={`flex-start`}
                    shadow={`0px 5px 15px rgb(0,0,0,0.16)`}
                    margin={`0 0 10px 0`}
                    padding={`20px`}
                    radius={`10px`}
                  >
                    <Text
                      width={`50%`}
                      fontSize={width < 700 ? `14px` : `16px`}
                    >
                      {data.course}
                    </Text>

                    <Wrapper width={`40%`} dr={width < 1100 ? `column` : `row`}>
                      <CustomWrapper width={width < 1100 ? `100%` : `50%`}>
                        <DownloadOutlined
                          onClick={() => fileDownloadHandler(data.file)}
                          style={{
                            fontSize: width < 700 ? 15 : 25,
                            color: Theme.basicTheme_C,
                            marginRight: 10,
                            cursor: `pointer`,
                          }}
                        />

                        <Text
                          fontSize={width < 700 ? `14px` : `16px`}
                          display={width < 700 ? `none` : `block`}
                        >
                          파일 업로드
                        </Text>
                      </CustomWrapper>

                      <CustomWrapper
                        width={width < 1100 ? `100%` : `50%`}
                        beforeBool={false}
                      >
                        <CalendarOutlined
                          style={{
                            fontSize: width < 700 ? 15 : 25,
                            color: Theme.basicTheme_C,
                            marginRight: 10,
                            cursor: `pointer`,
                          }}
                        />
                        <Text fontSize={width < 700 ? `14px` : `16px`}>
                          {`${data.date}까지`}
                        </Text>
                      </CustomWrapper>
                    </Wrapper>

                    <Wrapper width={`10%`} ju={`center`}>
                      <Text
                        fontSize={width < 700 ? `14px` : `16px`}
                        margin={width < 700 ? `0 0 0 5px` : "0"}
                        fontWeight={`bold`}
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
                      >
                        {moment
                          .duration(
                            moment(data.date, "YYYY-MM-DD").diff(
                              moment(new Date(), "YYYY-MM-DD")
                            )
                          )
                          .asDays() < -1
                          ? "기간 만료"
                          : "제출"}
                      </Text>
                    </Wrapper>
                  </Wrapper>
                );
              })
            )}

            <Wrapper margin={`30px 0`}>
              <CustomPage
                current={currentPage5}
                total={lectureSubmitLastPage * 10}
                onChange={(page) => onChangeSubmitPage(page)}
              ></CustomPage>
            </Wrapper>

            <Wrapper dr={`row`} ju={`flex-end`}>
              <CommonButton
                kindOf={`grey`}
                margin={`0 10px 0 0`}
                color={Theme.darkGrey_C}
                radius={`5px`}
                onClick={() => onReset()}
              >
                돌아가기
              </CommonButton>
            </Wrapper>
          </CustomForm>
        </CustomModal>

        <CustomModal
          visible={memoToggle}
          width={`1350px`}
          title="학생 메모 생성하기"
          footer={null}
          closable={false}
        >
          <CustomForm
            ref={formRef}
            form={memoWriteform}
            onFinish={memoFinishHandler}
          >
            <Text
              fontSize={width < 70 ? `14px` : `18px`}
              fontWeight={`bold`}
              margin={`0 0 10px`}
            >
              학생 메모
            </Text>
            <Form.Item
              name="memo"
              rules={[{ required: true, message: "학생 메모를 입력해주세요." }]}
            >
              <TextArea
                width={`100%`}
                placeholder={`ex) 학생별 특이사항, 수업분위기 ,특별한 내용 등 입력해주세요.`}
              />
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
                작성하기
              </CommonButton>
            </Wrapper>
          </CustomForm>
        </CustomModal>

        <CustomModal
          visible={memoStuDetailToggle}
          width={`1350px`}
          title="학생메모 목록"
          footer={null}
          closable={false}
        >
          <Wrapper al={`flex-start`}>
            {memoStuBackToggle ? (
              <Wrapper>
                <Wrapper al={`flex-start`} margin={`0 0 15px`}>
                  <CommonButton
                    margin={`0 5px 0 0`}
                    kindOf={`grey`}
                    color={Theme.darkGrey_C}
                    radius={`5px`}
                    onClick={() => setMemoStuBackToggle(false)}
                  >
                    뒤로가기
                  </CommonButton>
                </Wrapper>

                <CustomForm
                  form={memoform}
                  onFinish={(data) => memoUpdateFinishHandler(data)}
                >
                  <Text
                    fontSize={width < 700 ? `14px` : `18px`}
                    fontWeight={`bold`}
                    margin={`0 0 10px`}
                  >
                    학생 이름
                  </Text>
                  <Form.Item
                    name="username"
                    rules={[
                      { required: true, message: "학생메모를 입력해주세요." },
                    ]}
                  >
                    <CustomInput width={`100%`} disabled></CustomInput>
                  </Form.Item>

                  <Text
                    fontSize={width < 700 ? `14px` : `18px`}
                    fontWeight={`bold`}
                    margin={`0 0 10px`}
                  >
                    학생 메모
                  </Text>
                  <Form.Item
                    name="memo"
                    rules={[
                      { required: true, message: "학생메모를 입력해주세요." },
                    ]}
                  >
                    <TextArea
                      width={`100%`}
                      placeholder={`ex) 학생별 특이사항, 수업분위기 ,특별한 내용 등 입력해주세요.`}
                    />
                  </Form.Item>

                  <Wrapper al={`flex-end`}>
                    <CommonButton
                      margin={`0 0 0 5px`}
                      radius={`5px`}
                      htmlType="submit"
                    >
                      수정하기
                    </CommonButton>
                  </Wrapper>
                </CustomForm>
              </Wrapper>
            ) : (
              <>
                <Wrapper
                  position={`relative`}
                  width={width < 800 ? `calc(100% - 100px - 20px)` : `500px`}
                  height={`39px`}
                  margin={`0 0 20px`}
                >
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
                    {...inputMemoSearch}
                    onKeyDown={(e) => e.keyCode === 13 && memoSearchHandler()}
                  />
                </Wrapper>

                <Wrapper
                  shadow={`0px 5px 15px rgb(0,0,0,0.16)`}
                  radius={`10px`}
                >
                  <Wrapper
                    dr={`row`}
                    textAlign={width < 700 ? `center` : `left`}
                    padding={`20px 30px`}
                  >
                    <Text
                      fontSize={width < 700 ? `14px` : `18px`}
                      fontWeight={`Bold`}
                      width={`10%`}
                    >
                      번호
                    </Text>

                    <Text
                      fontSize={width < 700 ? `14px` : `18px`}
                      fontWeight={`Bold`}
                      width={`30%`}
                      isEllipsis={true}
                    >
                      학생 이름
                    </Text>

                    <Text
                      fontSize={width < 700 ? `14px` : `18px`}
                      fontWeight={`Bold`}
                      width={`45%`}
                      isEllipsis={true}
                    >
                      메모내용
                    </Text>

                    <Text
                      fontSize={width < 700 ? `14px` : `18px`}
                      fontWeight={`Bold`}
                      width={`15%`}
                      isEllipsis={true}
                    >
                      생성일
                    </Text>
                  </Wrapper>

                  {lectureMemoStuList && lectureMemoStuList.length === 0 ? (
                    <Wrapper margin={`50px 0`}>
                      <Empty description="조회된 데이터가 없습니다." />
                    </Wrapper>
                  ) : (
                    lectureMemoStuList &&
                    lectureMemoStuList.map((data, idx) => {
                      return (
                        <Wrapper
                          onClick={() => lectureDetailStuMemoHandler(data)}
                          dr={`row`}
                          ju={`flex-start`}
                          padding={`25px 30px 20px`}
                          cursor={`pointer`}
                          textAlign={width < 700 ? `center` : `left`}
                          bgColor={idx % 2 === 1 && Theme.subTheme_C}
                          borderBottom={`1px solid ${Theme.grey_C}`}
                        >
                          <Text
                            fontSize={width < 700 ? `14px` : `16px`}
                            width={`10%`}
                          >
                            {data.id}
                          </Text>
                          <Text
                            fontSize={width < 700 ? `14px` : `16px`}
                            width={`30%`}
                          >
                            {data.username}
                          </Text>
                          <Text
                            fontSize={width < 700 ? `14px` : `16px`}
                            width={`45%`}
                            isEllipsis={true}
                          >
                            {data.memo}
                          </Text>
                          <Text
                            fontSize={width < 700 ? `14px` : `16px`}
                            width={`15%`}
                            isEllipsis={true}
                          >
                            {moment(data.createdAt, "YYYY/MM/DD").format(
                              "YYYY/MM/DD"
                            )}
                          </Text>
                        </Wrapper>
                      );
                    })
                  )}
                </Wrapper>

                <Wrapper margin={`50px 0`}>
                  <CustomPage
                    current={currentPage7}
                    total={lectureMemoStuLastPage * 10}
                    onChange={(page) => onChangeMemoStuPage(page)}
                  ></CustomPage>
                </Wrapper>
              </>
            )}
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
        </CustomModal>

        <CustomModal
          visible={commuteToggle}
          width={`1350px`}
          title="학생 출석 목록"
          footer={null}
          closable={false}
        >
          <Wrapper al={`flex-start`}>
            <Wrapper
              position={`relative`}
              width={width < 800 ? `calc(100% - 100px - 20px)` : `500px`}
              height={`39px`}
              margin={`0 0 20px`}
            >
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
                {...inputCommuteSearch}
                onKeyDown={(e) => e.keyCode === 13 && commuteSearchHandler()}
              />
            </Wrapper>
          </Wrapper>

          <Wrapper borderTop={`2px solid ${Theme.black_C}`}>
            <Wrapper
              dr={`row`}
              textAlign={width < 700 ? `center` : `left`}
              padding={`20px 30px`}
            >
              <Text
                fontSize={width < 700 ? `14px` : `18px`}
                fontWeight={`Bold`}
                width={`45%`}
              >
                출석일
              </Text>
              <Text
                fontSize={width < 700 ? `14px` : `18px`}
                fontWeight={`Bold`}
                width={`45%`}
              >
                학생명
              </Text>

              <Text
                fontSize={width < 700 ? `14px` : `18px`}
                fontWeight={`Bold`}
                width={`10%`}
              >
                출석
              </Text>
            </Wrapper>

            {commuteList && commuteList.length === 0 ? (
              <Wrapper margin={`50px 0`}>
                <Empty description="조회된 데이터가 없습니다." />
              </Wrapper>
            ) : (
              commuteList &&
              commuteList.map((data, idx) => {
                return (
                  <Wrapper
                    key={data.id}
                    dr={`row`}
                    ju={`flex-start`}
                    padding={`25px 30px 20px`}
                    cursor={`pointer`}
                    textAlign={width < 700 ? `center` : `left`}
                    bgColor={idx % 2 === 1 && Theme.subTheme_C}
                    borderBottom={`1px solid ${Theme.grey_C}`}
                  >
                    <Text
                      fontSize={width < 700 ? `14px` : `16px`}
                      width={`45%`}
                    >
                      {data.time}
                    </Text>
                    <Text
                      fontSize={width < 700 ? `14px` : `16px`}
                      width={`45%`}
                    >
                      {data.username}
                    </Text>
                    <Text
                      fontSize={width < 700 ? `14px` : `16px`}
                      width={`10%`}
                    >
                      {data.status}
                    </Text>
                  </Wrapper>
                );
              })
            )}
          </Wrapper>

          <Wrapper margin={`50px 0`}>
            <CustomPage
              current={currentPage6}
              total={commuteLastPage * 10}
              onChange={(page) => onChangeCommutePage(page)}
            ></CustomPage>
          </Wrapper>

          <Wrapper dr={`row`} margin={`0 0 30px`}>
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

    // 구현부 종료
    context.store.dispatch(END);
    console.log("🍀 SERVER SIDE PROPS END");
    await context.store.sagaTask.toPromise();
  }
);

export default Index;
