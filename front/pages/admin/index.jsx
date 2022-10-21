import React, { useCallback, useEffect, useRef, useState } from "react";

import wrapper from "../../store/configureStore";
import { END } from "redux-saga";
import axios from "axios";

import styled, { ThemeContext } from "styled-components";
import AdminLayout from "../../components/AdminLayout";
import {
  Wrapper,
  Image,
  CommonButton,
  Text,
  TextInput,
  SpanText,
  ModalBtn,
  TextArea,
  GuideDiv,
} from "../../components/commonComponents";
import {
  Button,
  DatePicker,
  Empty,
  Form,
  Input,
  message,
  Modal,
  notification,
  Pagination,
  Popconfirm,
  Select,
  Table,
  TimePicker,
} from "antd";

import useInput from "../../hooks/useInput";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import Theme from "../../components/Theme";
import useWidth from "../../hooks/useWidth";
import moment from "moment";

import {
  LOAD_MY_INFO_REQUEST,
  LOGIN_ADMIN_REQUEST,
  UPDATE_MODAL_CLOSE_REQUEST,
  UPDATE_MODAL_OPEN_REQUEST,
  USER_ALL_LIST_REQUEST,
  USER_STU_LIST_REQUEST,
  USER_TEACHER_LIST_REQUEST,
} from "../../reducers/user";
import {
  LECTURE_ALL_LIST_REQUEST,
  LECTURE_DELETE_REQUEST,
  LECTURE_UPDATE_REQUEST,
} from "../../reducers/lecture";
import { MESSAGE_ADMIN_MAIN_LIST_REQUEST } from "../../reducers/message";
import {
  CREATE_MODAL_CLOSE_REQUEST,
  CREATE_MODAL_OPEN_REQUEST,
  NOTICE_ADMIN_MAIN_LIST_REQUEST,
  NOTICE_UPDATE_REQUEST,
  NOTICE_UPLOAD_REQUEST,
} from "../../reducers/notice";

import ToastEditorComponent3 from "../../components/editor/ToastEditorComponent3";
import ToastEditorComponentMix from "../../components/editor/ToastEditorComponentMix";
import { saveAs } from "file-saver";
import {
  NORMAL_COMMENT_CREATE_REQUEST,
  NORMAL_COMMENT_DELETE_REQUEST,
  NORMAL_COMMENT_LIST_REQUEST,
  NORMAL_COMMENT_UPDATE_REQUEST,
  NORMAL_FILE_UPLOAD_REQUEST,
  NORMAL_NOTICE_ADMIN_CREATE_REQUEST,
  NORMAL_NOTICE_ADMIN_LIST_REQUEST,
  NORMAL_NOTICE_DELETE_REQUEST,
  NORMAL_NOTICE_DETAIL_MODAL_TOGGLE,
  NORMAL_NOTICE_DETAIL_REQUEST,
  NORMAL_NOTICE_EDITOR_RENDER,
  NORMAL_NOTICE_FILE_STATE,
  NORMAL_NOTICE_MODAL_TOGGLE,
  NORMAL_NOTICE_UPDATE_REQUEST,
} from "../../reducers/normalNotice";
import { setContext } from "redux-saga/effects";
// let Line;

// if (typeof window !== "undefined") {
//   const { Line: prevLine } = require("@ant-design/charts");

//   Line = prevLine;
// }

const FileBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

const WordbreakText = styled(Text)`
  width: 100%;
  word-wrap: break-all;
`;

const AdminContent = styled.div`
  padding: 20px;
`;

const CustomButton = styled(Button)`
  padding: 0;
  width: 80px;
  height: 35px;
  border-radius: 5px;
  font-size: 14px;
`;

const CusotmInput = styled(TextInput)`
  width: 100%;
  &::placeholder {
    color: ${Theme.grey2_C};
  }
`;

const DateInput = styled(DatePicker)`
  width: ${(props) => props.width || `100%`};
  &::placeholder {
    color: ${Theme.grey2_C};
  }
`;

const FormItem = styled(Form.Item)`
  width: ${(props) => props.width || `calc(100% - 100px)`};
  margin: ${(props) => props.margin || `0`};
`;

const LoadNotification = (msg, content) => {
  notification.open({
    message: msg,
    description: content,
    onClick: () => {},
  });
};

const TimeInput = styled(TimePicker)`
  width: ${(props) => props.width || `100%`};
  &::placeholder {
    color: ${Theme.grey2_C};
  }
`;

const FormTag = styled(Form)`
  width: 100%;
`;

const HoverText = styled(Text)`
  cursor: pointer;
  &:hover {
    font-weight: 700;
  }
  transition: 0.2s;
`;

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

const AdminHome = () => {
  ////// HOOKS //////
  const width = useWidth();

  const [deletePopVisible, setDeletePopVisible] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [updateData, setUpdateData] = useState(null);

  const [form] = Form.useForm();
  const [noticeUpdateform] = Form.useForm();

  const [currentTeacher, setCurrentTeacher] = useState(null);
  const [searchLevel, setSearchLevel] = useState("");

  const [searchStep, setSearchStep] = useState("");
  const [searchTime, setSearchTime] = useState("");
  const [searchStuName, setSearchStuName] = useState("");

  const [allLectureList, setAllLectureList] = useState([]);

  const [noticeDetailData, setNoticeDetailData] = useState(null);
  const [noticeDetailModal, setNoticeDetailModal] = useState(null);

  const [messageDetailData, setMessageDetailData] = useState(null);
  const [messageDetailModal, setMessageDetailModal] = useState(null);

  const [currentPage1, setCurrentPage1] = useState(1);
  const [currentPage2, setCurrentPage2] = useState(1);
  const [listType, setListType] = useState(2);

  const [dayArr, setDayArr] = useState([]);
  const inputId = useInput("");
  const inputPw = useInput("");
  const inputCnt = useInput();
  const inputStartDate = useInput();
  const fileRef = useRef();
  const normalNoticeFileRef = useRef();
  const formRef = useRef();

  const router = useRouter();

  ////// REDUX //////
  const dispatch = useDispatch();

  const {
    allLectures,
    //
    st_lectureDeleteDone,
    st_lectureDeleteError,
    updateModal,
    //
    st_lectureUpdateDone,
    st_lectureUpdateError,
    //
    st_lectureAllListDone,
    st_lectureAllListError,
  } = useSelector((state) => state.lecture);

  const {
    me,
    allUsers,
    teachers,
    userStuList,
    //
    st_loginAdminError,
    st_loginAdminDone,
    //
    st_userStuListDone,
    st_userStuListError,
  } = useSelector((state) => state.user);

  const {
    noticeAdminMain,
    noticeAdminMainMaxPage,
    uploadPath,
    createModal,
    ///
    st_noticeUpdateError,
    st_noticeUpdateDone,
  } = useSelector((state) => state.notice);

  const { messageAdminMainList, messageAdminMainMaxPage } = useSelector(
    (state) => state.message
  );

  // NORMAL SELECTOR
  const {
    normalNoticeAdminList,
    normalNoticeDetailData,
    normalNoticeDetailReceviers,
    normalComments,
    normalCommentsLen,
    normalNoticeFilePath,
    normalCommentList,
    //
    normalNoticeModal,
    normalNoticeDetailModal,
    // 일반 게시판 생성
    normalNoticeAdminCreateLoading,
    normalNoticeAdminCreateDone,
    normalNoticeAdminCreateError,
    // 일반 게시판 수정
    normalNoticeUpdateLoading,
    normalNoticeUpdateDone,
    normalNoticeUpdateError,
    // 일반 게시판 삭제
    normalNoticeDeleteLoading,
    normalNoticeDeleteDone,
    normalNoticeDeleteError,
    // 대댓글 가져오기
    normalCommentListError,
    // 대댓글 생성
    normalCommentCreateDone,
    normalCommentCreateError,
    // 대댓글 수정
    normalCommentUpdateDone,
    normalCommentUpdateError,
    // 대댓글 삭제
    normalCommentDeleteDone,
    normalCommentDeleteError,
  } = useSelector((state) => state.normalNotice);

  const [noticeData, setNoticeData] = useState(null);

  // NORMAL NOTICE STATE
  const [normalNoticeType, setNormalNoticeType] = useState(null);
  const [normalNoticeUser, setNormalNoticeUser] = useState([]);
  const [normalNoticeListType, setNormalNoticeListType] = useState(4);
  const [normalNoticeUpdateData, setNormalNoticeUpdateData] = useState(null);

  const [normalNoticeForm] = Form.useForm();
  const [commentForm] = Form.useForm();
  const [updateCommentForm] = Form.useForm();
  const [childCommentForm] = Form.useForm();

  const [contentData, setContentData] = useState("");
  const filename = useInput(null);

  const [repleToggle, setRepleToggle] = useState(false); // 댓글쓰기 모달 토글
  const [commentUpdateModal, setCommentUpdateModal] = useState(false); // 댓글 수정 모달 토글
  const [currentData, setCurrentData] = useState(null); // 댓글의 정보 보관

  const [updateCommentData, setUpdateCommentData] = useState(false);
  const [grandData, setGrandData] = useState(null);
  const [cocommentToggle, setCocommentToggle] = useState(null);

  ////// USEEFFECT //////

  // useEffect(() => {
  //   dispatch({
  //     type: NOTICE_ADMIN_LIST_REQUEST,
  //     data: {
  //       level: 4,
  //     },
  //   });
  // }, [router.query]);

  // useEffect(() => {
  // dispatch({
  //   type: LECTURE_ALL_LIST_REQUEST,
  //   data: {
  //     TeacherId: currentTeacher ? currentTeacher : "",
  //     time: searchTime ? searchTime : "",
  //     startLv: "",
  //     studentName: searchStuName ? searchStuName : "",
  //   },
  // });
  // }, [router.query]);

  useEffect(() => {
    if (me) {
      dispatch({
        type: NORMAL_NOTICE_ADMIN_LIST_REQUEST,
        data: {
          listType: normalNoticeListType,
        },
      });
    }
  }, [me, normalNoticeListType]);

  useEffect(() => {
    if (st_loginAdminDone) {
      dispatch({
        type: NOTICE_ADMIN_MAIN_LIST_REQUEST,
        data: {
          page: 1,
        },
      });

      dispatch({
        type: MESSAGE_ADMIN_MAIN_LIST_REQUEST,
        data: {
          listType: "",
          search: "",
        },
      });

      dispatch({
        type: LECTURE_ALL_LIST_REQUEST,
        data: {
          TeacherId: "",
          time: "",
          startLv: "",
          studentName: "",
          listType: listType ? listType : 2,
        },
      });

      dispatch({
        type: USER_ALL_LIST_REQUEST,
        data: {
          type: 2,
        },
      });

      dispatch({
        type: USER_STU_LIST_REQUEST,
      });
      dispatch({
        type: USER_TEACHER_LIST_REQUEST,
      });
    }
  }, [st_loginAdminDone]);

  useEffect(() => {
    if (st_lectureDeleteDone) {
      message.success("클래스가 삭제되었습니다.");

      dispatch({
        type: LECTURE_ALL_LIST_REQUEST,
        data: {
          TeacherId: currentTeacher ? currentTeacher : "",
          time: searchTime ? searchTime : "",
          startLv: "",
          studentName: searchStuName ? searchStuName : "",
          listType: listType ? listType : 2,
        },
      });
    }
  }, [st_lectureDeleteDone]);

  useEffect(() => {
    if (st_lectureDeleteError) {
      return message.error(st_lectureDeleteError);
    }
  }, [st_lectureDeleteError]);

  useEffect(() => {
    if (st_lectureUpdateDone) {
      message.success("클래스가 수정되었습니다.");

      dispatch({
        type: LECTURE_ALL_LIST_REQUEST,
        data: {
          TeacherId: currentTeacher ? currentTeacher : "",
          time: searchTime ? searchTime : "",
          startLv: "",
          studentName: searchStuName ? searchStuName : "",
          listType: listType ? listType : 2,
        },
      });
      updateModalClose();
    }
  }, [st_lectureUpdateDone]);

  useEffect(() => {
    if (st_lectureUpdateError) {
      return message.error(st_lectureUpdateError);
    }
  }, [st_lectureUpdateError]);

  // NORMAL CREATE USEEFFECT
  useEffect(() => {
    if (normalNoticeAdminCreateDone) {
      dispatch({
        type: NORMAL_NOTICE_ADMIN_LIST_REQUEST,
        data: {
          listType: normalNoticeListType,
        },
      });

      normalNoticeCreateModalToggle();

      return message.success("일반게시판이 추가되었습니다.");
    }
  }, [normalNoticeAdminCreateDone]);

  useEffect(() => {
    if (normalNoticeAdminCreateError) {
      return message.error(normalNoticeAdminCreateError);
    }
  }, [normalNoticeAdminCreateError]);

  // NORMAL UPDATE USEEFFECT
  useEffect(() => {
    if (normalNoticeUpdateDone) {
      dispatch({
        type: NORMAL_NOTICE_ADMIN_LIST_REQUEST,
        data: {
          listType: normalNoticeListType,
        },
      });

      normalNoticeUpdateModalToggle(null);

      return message.success("일반게시판이 수정되었습니다.");
    }
  }, [normalNoticeUpdateDone]);

  useEffect(() => {
    if (normalNoticeUpdateError) {
      return message.error(normalNoticeUpdateError);
    }
  }, [normalNoticeUpdateError]);

  // NORMAL DELETE USEEFFECT
  useEffect(() => {
    if (normalNoticeDeleteDone) {
      dispatch({
        type: NORMAL_NOTICE_ADMIN_LIST_REQUEST,
        data: {
          listType: normalNoticeListType,
        },
      });

      return message.success("일반게시판이 삭제되었습니다.");
    }
  }, [normalNoticeDeleteDone]);

  useEffect(() => {
    if (normalNoticeDeleteError) {
      return message.error(normalNoticeDeleteError);
    }
  }, [normalNoticeDeleteError]);

  // NORMAL COMMENT LIST USEEFFECT
  useEffect(() => {
    if (normalCommentListError) {
      return message.error(normalCommentListError);
    }
  }, [normalCommentListError]);

  // NORMAL COMMENT CREATE USEEFFECT
  useEffect(() => {
    if (normalCommentCreateDone) {
      dispatch({
        type: NORMAL_NOTICE_DETAIL_REQUEST,
        data: {
          NormalNoticeId: noticeDetailData.noticeId,
        },
      });

      dispatch({
        type: NORMAL_COMMENT_LIST_REQUEST,
        data: {
          normalNoticeId: noticeDetailData.noticeId,
          commentId: grandData,
        },
      });

      if (currentData) {
        openRecommentToggle(null);
        setCurrentData(null);
      }

      commentForm.resetFields();

      return message.success("댓글이 생성되었습니다.");
    }
  }, [normalCommentCreateDone]);

  useEffect(() => {
    if (normalCommentCreateError) {
      return message.error(normalCommentCreateError);
    }
  }, [normalCommentCreateError]);

  // NORMAL COMMENT UPDATE USEEFFECT
  useEffect(() => {
    if (normalCommentUpdateDone) {
      dispatch({
        type: NORMAL_NOTICE_DETAIL_REQUEST,
        data: {
          NormalNoticeId: noticeDetailData.noticeId,
        },
      });

      dispatch({
        type: NORMAL_COMMENT_LIST_REQUEST,
        data: {
          normalNoticeId: noticeDetailData.noticeId,
          commentId: grandData,
        },
      });

      setCommentUpdateModal(false);
      return message.success("댓글이 수정되었습니다.");
    }
  }, [normalCommentUpdateDone]);

  useEffect(() => {
    if (normalCommentUpdateError) {
      return message.error(normalCommentUpdateError);
    }
  }, [normalCommentUpdateError]);

  // NORMAL COMMENT DELETE USEEFFECT
  useEffect(() => {
    if (normalCommentDeleteDone) {
      dispatch({
        type: NORMAL_NOTICE_DETAIL_REQUEST,
        data: {
          NormalNoticeId: noticeDetailData.noticeId,
        },
      });

      dispatch({
        type: NORMAL_COMMENT_LIST_REQUEST,
        data: {
          normalNoticeId: noticeDetailData.noticeId,
          commentId: grandData,
        },
      });

      // if (currentData) {
      //   openRecommentToggle(null);
      //   setCurrentData(null);
      // }

      // commentForm.resetFields();

      return message.success("댓글이 삭제되었습니다.");
    }
  }, [normalCommentDeleteDone]);

  useEffect(() => {
    if (normalCommentDeleteError) {
      return message.error(normalCommentDeleteError);
    }
  }, [normalCommentDeleteError]);

  useEffect(() => {
    if (updateData) {
      setTimeout(() => {
        onFill(updateData);
      }, 500);
    }
  }, [updateData]);

  useEffect(() => {
    if (st_loginAdminError) {
      return message.error(
        st_loginAdminError.reason
          ? st_loginAdminError.reason
          : "로그인을 실패하였습니다."
      );
    }
  }, [st_loginAdminError]);

  useEffect(() => {
    if (st_userStuListError) {
      return message.error(st_userStuListError);
    }
  }, [st_userStuListError]);

  useEffect(() => {
    if (st_lectureAllListDone) {
      let tempArr = [];

      if (searchStuName) {
        for (let i = 0; i < allLectures.length; i++) {
          for (let j = 0; j < allLectures[i].Participants.length; j++) {
            if (
              allLectures[i].Participants[j].User.username === searchStuName
            ) {
              tempArr.push(allLectures[i]);
            }
          }
        }

        setAllLectureList(tempArr);
      } else {
        setAllLectureList(allLectures);
      }
    } else {
      setAllLectureList(allLectures);
    }
  }, [st_lectureAllListDone, router.query]);

  useEffect(() => {
    dispatch({
      type: NOTICE_ADMIN_MAIN_LIST_REQUEST,
      data: {
        page: currentPage1,
      },
    });
  }, [currentPage1]);
  useEffect(() => {
    dispatch({
      type: MESSAGE_ADMIN_MAIN_LIST_REQUEST,
      data: {
        page: currentPage2,
      },
    });
  }, [currentPage2]);

  useEffect(() => {
    setCurrentTeacher(router.query.teacher);
  }, [router.query]);

  useEffect(() => {
    dispatch({
      type: LECTURE_ALL_LIST_REQUEST,
      data: {
        TeacherId: router.query.teacher ? router.query.teacher : "",
        time: "",
        startLv: "",
        studentName: "",
        listType: listType ? listType : 2,
      },
    });
    setCurrentTeacher(router.query.teacher);
  }, [router.query]);

  useEffect(() => {
    if (noticeData) {
      setTimeout(() => {
        onFillNotice(noticeData);
      }, 500);
    }
  }, [noticeData]);

  useEffect(() => {
    if (st_noticeUpdateError) {
      return message.error(st_noticeUpdateError);
    }
  }, [st_noticeUpdateError]);
  useEffect(() => {
    if (st_noticeUpdateDone) {
      message.success("게시글이 수정되었습니다.");

      dispatch({
        type: NOTICE_ADMIN_MAIN_LIST_REQUEST,
        data: {
          level: 1,
        },
      });
      noticeUpdateModalToggle(null);
    }
  }, [st_noticeUpdateDone]);

  useEffect(() => {
    if (normalNoticeUpdateData) {
      normalNoticeForm.setFieldsValue({
        title: normalNoticeUpdateData.noticeTitle,
        content: normalNoticeUpdateData.noticeContent,
      });
    }
  }, [normalNoticeUpdateData]);

  ////// TOGGLE //////

  const normalNoticeCreateModalToggle = useCallback(() => {
    dispatch({
      type: NORMAL_NOTICE_EDITOR_RENDER,
      data: "create",
    });
    normalNoticeForm.resetFields();
    setNormalNoticeUpdateData(null);
    setNormalNoticeType(null);
    setNormalNoticeUser([]);
    setContentData(null);
    filename.setValue(null);

    dispatch({
      type: NORMAL_NOTICE_FILE_STATE,
      data: null,
    });

    dispatch({
      type: NORMAL_NOTICE_MODAL_TOGGLE,
    });
  }, [
    normalNoticeModal,
    normalNoticeType,
    normalNoticeUser,
    contentData,
    normalNoticeUpdateData,
    normalNoticeFilePath,
    filename.value,
  ]);
  console.log(normalNoticeFilePath);

  const normalNoticeUpdateModalToggle = useCallback(
    (data) => {
      if (data) {
        setNormalNoticeUpdateData(data);
        dispatch({
          type: NORMAL_NOTICE_EDITOR_RENDER,
          data: data.noticeContent,
        });
      } else {
        dispatch({
          type: NORMAL_NOTICE_EDITOR_RENDER,
          data: null,
        });
        normalNoticeForm.resetFields();
        setNormalNoticeUpdateData(null);
        setNormalNoticeType(null);
        setNormalNoticeUser([]);
        setContentData(null);
        filename.setValue(null);
      }

      dispatch({
        type: NORMAL_NOTICE_MODAL_TOGGLE,
      });
    },
    [
      normalNoticeModal,
      normalNoticeType,
      normalNoticeUser,
      contentData,
      normalNoticeUpdateData,
      filename.value,
    ]
  );

  const openRecommentToggle = useCallback(
    (data) => {
      if (data) {
        setCurrentData(data);
      } else {
        setCurrentData(null);
        childCommentForm.resetFields();
      }
      setRepleToggle(!repleToggle);
    },
    [repleToggle, currentData]
  );

  ////// HANDLER ///////

  const normalNoticeTypeChangeHandler = useCallback(
    (type) => {
      normalNoticeForm.setFieldsValue({
        userId: [],
      });
      setNormalNoticeUser([]);
      setNormalNoticeType(type);
    },
    [normalNoticeType, normalNoticeUser]
  );

  const normalNoticeUserChangeHandler = useCallback(
    (user) => {
      const userDatum = user.map((data) => JSON.parse(data).id);

      setNormalNoticeUser(userDatum);
    },
    [normalNoticeUser]
  );

  const onFillNotice = useCallback((data) => {
    const type = data.LectureId
      ? "강의 게시판"
      : data.level === 2
      ? "강사 게시판"
      : data.level === 1
      ? "학생 게시판"
      : "전체 이용자 게시판";

    const lecture = data.LectureId && data.LectureId;

    noticeUpdateform.setFieldsValue({
      title: data.title,
      content: data.content,
      type,
      author: data.author,
      lecture,
    });
  }, []);

  const noticeModalToggle = useCallback(
    (data) => {
      setNoticeDetailData(data);
      if (data) {
        dispatch({
          type: NORMAL_NOTICE_DETAIL_REQUEST,
          data: {
            NormalNoticeId: data.noticeId,
          },
        });
      }
      dispatch({
        type: NORMAL_NOTICE_DETAIL_MODAL_TOGGLE,
      });
    },
    [
      noticeDetailData,
      normalNoticeDetailModal,
      normalNoticeDetailData,
      normalComments,
      normalCommentsLen,
    ]
  );

  const messageModalToggle = useCallback((data) => {
    setMessageDetailData(data);
    setMessageDetailModal((prev) => !prev);
  }, []);

  const moveLinkHandler = useCallback((link) => {
    router.push(link);
  }, []);

  const onLoginHandler = () => {
    dispatch({
      type: LOGIN_ADMIN_REQUEST,
      data: { userId: inputId.value, password: inputPw.value },
    });
  };

  const onSubmitUpdate = useCallback(
    (data) => {
      if (parseInt(data.cnt) !== data.day.length) {
        return message.error("횟수와 요일의 개수는 같아야합니다.");
      }

      let time = "";
      if (data.time_1) {
        time += data.time_1.format(`HH:mm`) + " ";
      }
      if (data.time_2) {
        time += data.time_2.format(`HH:mm`) + " ";
      }
      if (data.time_3) {
        time += data.time_3.format(`HH:mm`) + " ";
      }
      if (data.time_4) {
        time += data.time_4.format(`HH:mm`) + " ";
      }
      if (data.time_5) {
        time += data.time_5.format(`HH:mm`) + " ";
      }
      if (data.time_6) {
        time += data.time_6.format(`HH:mm`) + " ";
      }
      if (data.time_7) {
        time += data.time_7.format(`HH:mm`) + " ";
      }

      dispatch({
        type: LECTURE_UPDATE_REQUEST,
        data: {
          id: updateData.id,
          time: time,
          day: data.day.join(" "),
          count: data.cnt,
          course: data.course,
          startLv: data.lv1 + "권 " + data.lv2 + "단원 " + data.lv3 + "페이지",
          startDate: moment(data.startDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
          zoomLink: data.zoomLink,
          price: data.price,
          UserId: data.UserId,
          number: data.number,
        },
      });
    },
    [updateData, allUsers]
  );

  const updateModalOk = useCallback(() => {
    formRef.current.submit();
  }, []);

  const deleteClassHandler = useCallback(() => {
    if (!deleteId) {
      return LoadNotification(
        "ADMIN SYSTEM ERROR",
        "일시적인 장애가 발생되었습니다. 잠시 후 다시 시도해주세요."
      );
    }
    dispatch({
      type: LECTURE_DELETE_REQUEST,
      data: { lectureId: deleteId },
    });

    setDeleteId(null);
    setDeletePopVisible((prev) => !prev);
  }, [deleteId]);

  const onFill = useCallback(
    (data) => {
      setDayArr(data.day.split(" "));

      let day = "";
      if (data.time_1) {
        day += data.time_1.format(`HH:mm`) + " ";
      }
      if (data.time_2) {
        day += data.time_2.format(`HH:mm`) + " ";
      }
      if (data.time_3) {
        day += data.time_3.format(`HH:mm`) + " ";
      }
      if (data.time_4) {
        day += data.time_4.format(`HH:mm`) + " ";
      }
      if (data.time_5) {
        day += data.time_5.format(`HH:mm`) + " ";
      }
      if (data.time_6) {
        day += data.time_6.format(`HH:mm`) + " ";
      }
      if (data.time_7) {
        day += data.time_7.format(`HH:mm`) + " ";
      }

      form.setFieldsValue({
        time: moment(data.time, "HH:mm"),
        day: data.day.split(" "),
        cnt: data.count,

        course: data.course,
        number: data.number,

        lv1: parseInt(data.startLv.split(` `)[0].replace("권", "")),
        lv2: parseInt(data.startLv.split(` `)[1].replace("단원", "")),
        lv3: parseInt(data.startLv.split(` `)[2].replace("페이지", "")),
        startDate: moment(data.startDate, "YYYY-MM-DD"),
        zoomLink: data.zoomLink,
        price: data.price,
        UserId: data.User.id,
        time_1: moment(data.time.split(" ")[0], "HH:mm"),
        time_2: moment(data.time.split(" ")[1], "HH:mm"),
        time_3: moment(data.time.split(" ")[2], "HH:mm"),
        time_4: moment(data.time.split(" ")[3], "HH:mm"),
        time_5: moment(data.time.split(" ")[4], "HH:mm"),
        time_6: moment(data.time.split(" ")[5], "HH:mm"),
        time_7: moment(data.time.split(" ")[6], "HH:mm"),
      });

      // inputStartDate, setValue(data.startDate);
    },
    [inputStartDate, allUsers]
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

  ////// TOGGLE ///////
  const updateModalOpen = useCallback(
    (data) => {
      dispatch({
        type: UPDATE_MODAL_OPEN_REQUEST,
      });
      setUpdateData(data);
    },
    [updateModal]
  );

  const updateModalClose = useCallback(() => {
    dispatch({
      type: UPDATE_MODAL_CLOSE_REQUEST,
    });
    setUpdateData(null);
    setDayArr([]);
  }, [updateModal]);

  const deletePopToggle = useCallback(
    (id) => {
      setDeleteId(id);
      setDeletePopVisible((prev) => !prev);
    },
    [deletePopVisible, deleteId]
  );

  const onChangeTimeHandle = useCallback((e) => {
    setSearchTime(e && e.format("HH:mm"));
  }, []);

  const onClickSearchLevelHandle = useCallback(() => {
    // let startLv = `${searchLevel ? searchLevel : ""} ${
    //   searchStep ? searchStep : ""
    // } ${searchPage ? `${searchPage}페이지` : ""}`;
    let searchStartLv = "";

    if (searchLevel) {
      searchStartLv += searchLevel + "권 ";
    }

    if (searchStep) {
      searchStartLv += searchStep + "단원 ";
    }

    // if (searchPage) {
    //   searchStartLv += searchPage + "페이지";
    // }

    // if (!startLv || startLv.trim() === "" || startLv.includes("undefined")) {
    //   startLv = "";
    // }

    dispatch({
      type: LECTURE_ALL_LIST_REQUEST,
      data: {
        TeacherId: currentTeacher ? currentTeacher : "",
        time: searchTime ? searchTime : "",
        startLv: searchStartLv,
        studentName: searchStuName ? searchStuName : "",
        listType: listType ? listType : 2,
      },
    });
  }, [
    currentTeacher,
    searchLevel,
    searchStep,
    searchTime,
    searchStuName,
    listType,
  ]);

  const noticeUpdateModalToggle = useCallback(
    (data) => {
      setNoticeData(data);
      if (!createModal) {
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

  // 일반게시판 추가
  const normalNoticeAdminCreate = useCallback(
    (data) => {
      const userDatum = data.userId
        ? data.userId.map((data) => JSON.parse(data).id)
        : null;
      dispatch({
        type: NORMAL_NOTICE_ADMIN_CREATE_REQUEST,
        data: {
          title: data.title,
          content: contentData,
          author: "admin",
          level: me.level,
          file: normalNoticeFilePath,
          receiverId: userDatum,
          createType:
            normalNoticeType === "강사전체"
              ? 1
              : normalNoticeType === "학생전체"
              ? 2
              : normalNoticeType === "학생 및 강사 전체"
              ? 3
              : 4,
        },
      });
    },
    [normalNoticeType, normalNoticeFilePath, me, contentData]
  );
  // 일반게시판 수정
  const normalNoticeAdminUpdate = useCallback(
    (data) => {
      dispatch({
        type: NORMAL_NOTICE_UPDATE_REQUEST,
        data: {
          id: normalNoticeUpdateData.noticeId,
          title: data.title,
          content: contentData,
          author: normalNoticeUpdateData.noticeAuthor,
          file: normalNoticeFilePath,
        },
      });
    },
    [normalNoticeUpdateData, uploadPath, contentData, normalNoticeFilePath]
  );
  // 일반게시판 삭제
  const normalNoticeAdminDelete = useCallback(
    (data) => {
      dispatch({
        type: NORMAL_NOTICE_DELETE_REQUEST,
        data: {
          id: data.noticeId,
        },
      });
    },
    [normalNoticeUpdateData, uploadPath, contentData]
  );
  // 일반게시판 리스트타입 수정
  const normalNoticeListTypeChangeHandler = useCallback(
    (type) => {
      setNormalNoticeListType(type);
    },
    [normalNoticeListType]
  );

  const getEditContent = useCallback(
    (contentValue) => {
      if (contentValue) {
        normalNoticeForm.submit();

        setContentData(contentValue);
      }
    },
    [contentData]
  );

  // 일반 게시판 파일 업로드
  const normalNoticeFileUploadHandler = useCallback((e) => {
    if (e) {
      const formData = new FormData();
      filename.setValue(e.target.files[0].name);

      [].forEach.call(e.target.files, (file) => {
        formData.append("file", file);
      });

      dispatch({
        type: NORMAL_FILE_UPLOAD_REQUEST,
        data: formData,
      });
    }
  }, []);

  // 일반 게시판 파일 업로드
  const normalNoticeFileClickHandler = useCallback(() => {
    normalNoticeFileRef.current.click();
  }, [normalNoticeFileRef.current]);

  //   댓글 작성
  const commentSubmit = useCallback(
    (data) => {
      dispatch({
        type: NORMAL_COMMENT_CREATE_REQUEST,
        data: {
          content: data.comment,
          normalNoticeId: normalNoticeDetailData.noticeId,
          parentId: null,
          grantparentId: null,
        },
      });
    },
    [normalNoticeDetailData]
  );

  //   대댓글 작성
  const childCommentSubmit = useCallback(
    (data) => {
      if (currentData) {
        dispatch({
          type: NORMAL_COMMENT_CREATE_REQUEST,
          data: {
            content: data.comment,
            normalNoticeId: normalNoticeDetailData.noticeId,
            parentId: currentData.id,
            grantparentId:
              currentData.parent === 0 ? currentData.id : grandData,
          },
        });
      }
    },
    [normalNoticeDetailData, currentData, grandData]
  );

  // 대댓글 뷰
  const getCommentHandler = useCallback(
    (id) => {
      setCocommentToggle(true);
      setGrandData(id);
      dispatch({
        type: NORMAL_COMMENT_LIST_REQUEST,
        data: {
          normalNoticeId: normalNoticeDetailData.noticeId,
          commentId: id,
        },
      });
    },
    [normalNoticeDetailData]
  );

  const updateCommentFormSubmit = useCallback(() => {
    updateCommentForm.submit();
  }, []);

  const updateCommentFormFinish = useCallback(
    (data) => {
      dispatch({
        type: NORMAL_COMMENT_UPDATE_REQUEST,
        data: {
          id: updateCommentData.id,
          content: data.content,
        },
      });
    },
    [updateCommentData]
  );

  const deleteCommentHandler = useCallback((data) => {
    dispatch({
      type: NORMAL_COMMENT_DELETE_REQUEST,
      data: {
        commentId: data.id,
      },
    });
  }, []);

  const updateCommentToggle = useCallback(
    (data, isV) => {
      setCommentUpdateModal((prev) => !prev);
      setUpdateCommentData(data);

      if (normalNoticeDetailData) {
        setTimeout(() => {
          commentOnFill(data, isV);
        }, 500);
      }
    },
    [commentUpdateModal, updateCommentData]
  );

  const commentOnFill = useCallback((data, isV) => {
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

  //  NORMAL_NOTICE_COLUMN
  const normalNoticeAdminColumn = [
    {
      title: "번호",
      width: `5%`,
      dataIndex: "noticeId",
    },
    {
      title: "제목",
      width: `50%`,
      render: (data) => {
        return (
          <Text
            width={`100%`}
            cursor={`pointer`}
            onClick={() => noticeModalToggle(data)}
            isEllipsis
          >
            {data.noticeTitle}
          </Text>
        );
      },
    },
    {
      title: "작성자",
      width: `15%`,
      render: (data) =>
        `${data.noticeAuthor} (${
          data.noticeLevel === 1
            ? "학생"
            : data.noticeLevel === 2
            ? "강사"
            : "관리자"
        })`,
    },
    {
      title: "조회수",
      width: `5%`,
      dataIndex: "noticeHit",
    },

    {
      title: "생성일",
      width: `10%`,
      dataIndex: "noticeCreatedAt",
    },
    {
      title: "수정",
      width: `5%`,
      render: (data) => {
        return (
          <Button
            type="primary"
            size="small"
            onClick={() => normalNoticeUpdateModalToggle(data)}
            loading={normalNoticeUpdateLoading}
          >
            수정
          </Button>
        );
      },
    },
    {
      title: "삭제",
      width: `5%`,
      render: (data) => {
        return (
          <Popconfirm
            title="삭젬하시겠습니까?"
            okText="삭제"
            cancelText="취소"
            placement="topRight"
            onConfirm={() => normalNoticeAdminDelete(data)}
          >
            <ModalBtn
              type="danger"
              size="small"
              loading={normalNoticeDeleteLoading}
            >
              삭제
            </ModalBtn>
          </Popconfirm>
        );
      },
    },
  ];

  const normalNoticeColumn = [
    {
      title: "번호",
      width: `5%`,
      dataIndex: "noticeId",
    },
    {
      title: "제목",
      width: `50%`,
      render: (data) => {
        return (
          <Text
            width={`100%`}
            cursor={`pointer`}
            onClick={() => noticeModalToggle(data)}
            isEllipsis
          >
            {data.noticeTitle}
          </Text>
        );
      },
    },
    {
      title: "작성자",
      width: `15%`,
      render: (data) =>
        `${data.noticeAuthor} (${
          data.noticeLevel === 1
            ? "학생"
            : data.noticeLevel === 2
            ? "강사"
            : "관리자"
        })`,
    },

    {
      title: "댓글수",
      width: `5%`,
      dataIndex: "commentCnt",
    },

    {
      title: "조회수",
      width: `5%`,
      dataIndex: "noticeHit",
    },

    {
      title: "생성일",
      width: `10%`,
      dataIndex: "noticeCreatedAt",
    },
  ];

  const normalSelectArr = [
    "강사개인",
    "강사전체",
    "학생개인",
    "학생전체",
    "학생 및 강사 전체",
  ];

  return (
    <>
      {me && me.level >= 3 ? (
        <AdminLayout>
          <AdminContent>
            <Text fontSize={`24px`} fontWeight={`bold`} margin={`0 0 30px`}>
              관리자 메인페이지
            </Text>
            <Wrapper
              dr={`row`}
              ju={`space-between`}
              al={`flex-start`}
              margin={`0 0 30px`}
            >
              {/* NORMAL BOARD */}
              <Wrapper al={`flex-start`}>
                <Wrapper dr={`row`} ju={`flex-start`} margin={`0 0 10px`}>
                  <Text
                    width={`auto`}
                    fontSize={`18px`}
                    fontWeight={`bold`}
                    margin={`0 20px 0 0`}
                  >
                    일반 게시판
                  </Text>

                  <Wrapper
                    dr={`row`}
                    ju={`space-between`}
                    width={`calc(100% - 110px)`}
                  >
                    <Wrapper width={`auto`} dr={`row`}>
                      <Button
                        size={`small`}
                        type={normalNoticeListType === 4 && `primary`}
                        onClick={() => normalNoticeListTypeChangeHandler(4)}
                      >
                        전체
                      </Button>
                      <ModalBtn
                        size={`small`}
                        type={normalNoticeListType === 1 && `primary`}
                        onClick={() => normalNoticeListTypeChangeHandler(1)}
                      >
                        학생
                      </ModalBtn>
                      <ModalBtn
                        size={`small`}
                        type={normalNoticeListType === 2 && `primary`}
                        onClick={() => normalNoticeListTypeChangeHandler(2)}
                      >
                        강사
                      </ModalBtn>
                      <ModalBtn
                        size={`small`}
                        type={normalNoticeListType === 3 && `primary`}
                        onClick={() => normalNoticeListTypeChangeHandler(3)}
                      >
                        관리자
                      </ModalBtn>
                    </Wrapper>
                    <Wrapper width={`auto`}>
                      <Button
                        size={`small`}
                        type={`primary`}
                        loading={normalNoticeAdminCreateLoading}
                        onClick={normalNoticeCreateModalToggle}
                      >
                        일반 게시판 작성
                      </Button>
                    </Wrapper>
                  </Wrapper>
                </Wrapper>

                {/* ADMIN GUIDE AREA */}
                <Wrapper
                  margin={`0px 0px 10px 0px`}
                  radius="5px"
                  bgColor={Theme.lightGrey_C}
                  padding="5px"
                  fontSize="13px"
                  al="flex-start"
                >
                  <GuideDiv isImpo={true}>
                    관리자 버튼을 누르면 수정, 삭제가 가능합니다.
                  </GuideDiv>
                  <GuideDiv isImpo={true}>
                    게시판은 수정시 즉시 반영되기 때문에 수정 할 시 신중하게
                    처리바랍니다.
                  </GuideDiv>
                  <GuideDiv isImpo={true}>
                    삭제된 데이터는 복구할 수 없습니다.
                  </GuideDiv>
                </Wrapper>

                <Table
                  rowKey="id"
                  dataSource={
                    normalNoticeAdminList ? normalNoticeAdminList : []
                  }
                  size="small"
                  columns={
                    normalNoticeListType === 3
                      ? normalNoticeAdminColumn
                      : normalNoticeColumn
                  }
                  style={{ width: `100%` }}
                  pagination={{
                    pageSize: 5,
                  }}
                />
              </Wrapper>

              {/* NORMAL BOARD END */}
            </Wrapper>

            {/* CLASS LIST */}
            <Wrapper al={`flex-start`} margin={`0 0 10px`}>
              <Wrapper dr={`row`} ju={`flex-start`} margin={`0 0 16px`}>
                <Text
                  fontSize={`18px`}
                  fontWeight={`bold`}
                  margin={`0 20px 0 0`}
                >
                  클래스 목록
                </Text>
                <Button
                  style={{ marginRight: 10 }}
                  size="small"
                  type="primary"
                  onClick={() => moveLinkHandler(`/admin/class/create`)}
                >
                  새 클래스 추가
                </Button>

                <Button
                  size="small"
                  type="danger"
                  onClick={() => moveLinkHandler(`admin/class/delete`)}
                >
                  종료된 클래스
                </Button>
              </Wrapper>
              <Wrapper dr={`row`} ju={`flex-start`}>
                <Select
                  size="small"
                  style={{ width: `200px`, marginRight: 10 }}
                  placeholder={`정렬을 선택해주세요.`}
                  value={listType}
                  onChange={(e) => setListType(e)}
                  allowClear
                >
                  <Select.Option value={2}>생성일 기준 내림차순</Select.Option>
                  <Select.Option value={3}>생성일 기준 오름차순</Select.Option>
                  <Select.Option value={4}>
                    강의번호 기준 내림차순
                  </Select.Option>
                  <Select.Option value={5}>
                    강의번호 기준 오름차순
                  </Select.Option>
                </Select>

                <Select
                  size="small"
                  style={{ width: `200px`, marginRight: 10 }}
                  placeholder={`강사를 선택해주세요.`}
                  onChange={(e) => setCurrentTeacher(e)}
                  allowClear
                  value={currentTeacher}
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  showSearch
                >
                  <Select.Option value={null}>전체</Select.Option>
                  {teachers &&
                    teachers.map((data) => {
                      return (
                        <Select.Option key={data.id} value={data.id}>
                          {data.username}
                        </Select.Option>
                      );
                    })}
                </Select>

                <Wrapper width={`auto`} margin={`0 10px 0 0`}>
                  <TimeInput
                    size="small"
                    placeholder={`강의시간을 선택해주세요.`}
                    width={`200px`}
                    format={`HH:mm`}
                    onChange={(e) => onChangeTimeHandle(e)}
                  />
                </Wrapper>

                <Wrapper width={`auto`} margin={`0 10px 0 0`}>
                  <Select
                    size="small"
                    style={{ width: `200px` }}
                    placeholder={`학생을 선택해주세요.`}
                    onChange={(e) => setSearchStuName(e)}
                    allowClear
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    showSearch
                  >
                    <Select.Option value={""}>선택안함</Select.Option>

                    {userStuList && userStuList.length === 0 ? (
                      <Wrapper>
                        <Empty description="조회된 사용자 데이터가 없습니다." />
                      </Wrapper>
                    ) : (
                      userStuList &&
                      userStuList.map((data, idx) => {
                        return (
                          <Select.Option key={data.id} value={data.username}>
                            {data.username}
                          </Select.Option>
                        );
                      })
                    )}
                  </Select>
                </Wrapper>

                <Wrapper dr={`row`} width={`auto`} ju={`flex-start`}>
                  <Wrapper
                    width={`auto`}
                    dr={`row`}
                    ju={`flex-start`}
                    margin={`0 10px 0 0`}
                  >
                    <FormItem width={`70px`}>
                      <Select
                        onChange={(e) => setSearchLevel(e)}
                        allowClear={true}
                        size="small"
                      >
                        <Select.Option value={`1`}>1</Select.Option>
                        <Select.Option value={`2`}>2</Select.Option>
                        <Select.Option value={`3`}>3</Select.Option>
                        <Select.Option value={`4`}>4</Select.Option>
                        <Select.Option value={`5`}>5</Select.Option>
                        <Select.Option value={`6`}>6</Select.Option>
                      </Select>
                    </FormItem>
                    <Text>&nbsp;권</Text>
                  </Wrapper>

                  <Wrapper
                    width={`auto`}
                    dr={`row`}
                    ju={`flex-start`}
                    margin={`0 10px 0 0`}
                  >
                    <FormItem width={`70px`}>
                      <Select
                        onChange={(e) => setSearchStep(e)}
                        allowClear={true}
                        size="small"
                      >
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
                    </FormItem>
                    <Text>&nbsp;단원</Text>
                  </Wrapper>

                  <Button
                    type="primary"
                    size="small"
                    onClick={() => onClickSearchLevelHandle()}
                  >
                    검색
                  </Button>
                </Wrapper>
              </Wrapper>
            </Wrapper>

            <Wrapper dr={`row`} ju={`flex-start`}>
              {allLectureList &&
                (allLectureList.length === 0 ? (
                  <Wrapper>
                    <Empty description={`조회된 강의가 없습니다.`} />
                  </Wrapper>
                ) : (
                  allLectureList &&
                  allLectureList.map((data, idx) => {
                    return (
                      <Wrapper
                        key={data.id}
                        width={`calc(100% / 3 - 10px)`}
                        minHeight={`370px`}
                        radius={`10px`}
                        shadow={`0 5px 15px rgba(0,0,0,0.05)`}
                        border={`1px solid ${Theme.subTheme8_C}`}
                        margin={
                          (idx + 1) % 3 === 0 ? `0 0 30px 0` : `0 10px 30px 0`
                        }
                        padding={`20px 10px`}
                        ju={`space-between`}
                      >
                        <Wrapper>
                          <Wrapper
                            dr={`row`}
                            ju={`space-between`}
                            al={`flex-start`}
                            padding={`0 0 20px`}
                            borderBottom={`1px solid ${Theme.subTheme8_C}`}
                          >
                            <Wrapper width={`auto`}>
                              <Wrapper
                                dr={`row`}
                                ju={`flex-start`}
                                al={`flex-start`}
                                margin={`0 0 15px`}
                              >
                                <Wrapper
                                  width={`34px`}
                                  padding={`0 5px`}
                                  margin={`0 10px 0 0`}
                                >
                                  <Image
                                    src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_lecture.png`}
                                    alt={`icon_lecture`}
                                  />
                                </Wrapper>
                                <Wrapper
                                  width={`calc(100% - 44px)`}
                                  al={`flex-start`}
                                >
                                  <Text fontSize={`14px`} fontWeight={`700`}>
                                    {data.day}
                                  </Text>
                                  <Text fontSize={`14px`} fontWeight={`700`}>
                                    {data.time}
                                  </Text>
                                </Wrapper>
                              </Wrapper>

                              <Wrapper
                                dr={`row`}
                                ju={`flex-start`}
                                margin={`0 0 15px`}
                              >
                                <Wrapper
                                  width={`34px`}
                                  padding={`0 5px`}
                                  margin={`0 10px 0 0`}
                                >
                                  <Image
                                    src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_name_yellow.png`}
                                    alt={`icon_lecture`}
                                  />
                                </Wrapper>

                                <Text fontSize={`14px`} fontWeight={`700`}>
                                  {data.User.username}&nbsp;/&nbsp;{data.course}
                                </Text>
                              </Wrapper>

                              <Wrapper dr={`row`} ju={`flex-start`}>
                                <Wrapper
                                  width={`34px`}
                                  padding={`0 5px`}
                                  margin={`0 10px 0 0`}
                                >
                                  <Image
                                    src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_number.png`}
                                    alt={`icon_lecture`}
                                  />
                                </Wrapper>
                                <Text fontSize={`14px`} fontWeight={`700`}>
                                  {data.number}
                                </Text>
                              </Wrapper>
                            </Wrapper>
                            <Wrapper
                              width={width < 1350 ? `100%` : `auto`}
                              fontSize={`15px`}
                              color={Theme.grey2_C}
                              al={width < 1350 ? `flex-start` : `flex-end`}
                              margin={width < 1350 ? `20px 0 0` : `0`}
                            >
                              <Text fontSize={`12px`} fontWeight={`bold`}>
                                {data.startLv}
                              </Text>
                              <Text fontSize={`12px`}>
                                수업 시작일 :{" "}
                                {data.startDate
                                  .replace(/\//g, "-")
                                  .slice(0, 10)}
                              </Text>
                            </Wrapper>
                          </Wrapper>
                          <Wrapper
                            margin={`20px 0 10px`}
                            dr={`row`}
                            ju={`flex-start`}
                          >
                            {data.Participants &&
                              data.Participants.map((data, idx) => {
                                if (data.isChange || data.isDelete) return;

                                return (
                                  <Wrapper
                                    al={`flex-start`}
                                    key={data.id}
                                    margin={`0 15px 0 0`}
                                    fontSize={`12px`}
                                  >
                                    {data.User.username}
                                  </Wrapper>
                                );
                              })}
                          </Wrapper>
                        </Wrapper>
                        <Wrapper dr={`row`}>
                          <CommonButton
                            padding={`0`}
                            width={`80px`}
                            height={`30px`}
                            radius={`5px`}
                            margin={`0 10px 0 0`}
                            fontSize={`13px`}
                            kindOf={`white`}
                            onClick={() =>
                              moveLinkHandler(`/admin/class/${data.id}`)
                            }
                          >
                            자세히 보기
                          </CommonButton>
                          <CommonButton
                            padding={`0`}
                            width={`80px`}
                            height={`30px`}
                            radius={`5px`}
                            fontSize={`13px`}
                            onClick={() => updateModalOpen(data)}
                          >
                            수정
                          </CommonButton>

                          {data.Participants &&
                            data.Participants.filter(
                              (data) => !data.isChange && !data.isDelete
                            ).length === 0 && (
                              <CustomButton
                                type={`danger`}
                                onClick={() => deletePopToggle(data.id)}
                              >
                                종료
                              </CustomButton>
                            )}
                        </Wrapper>
                      </Wrapper>
                    );
                  })
                ))}
            </Wrapper>
            {/* CLASS LIST END */}
          </AdminContent>

          {/* DELETE MODAL */}
          <Modal
            visible={deletePopVisible}
            onOk={deleteClassHandler}
            onCancel={() => deletePopToggle(null)}
            title="강의를 종료하시겠습니까?"
          >
            <Wrapper>강의를 종료하시겠습니까?</Wrapper>
          </Modal>
          {/* UPDATE MODAL */}
          <Modal
            visible={updateModal}
            width={`1100px`}
            title={`클래스 수정`}
            onOk={updateModalOk}
            onCancel={updateModalClose}
          >
            <Form form={form} ref={formRef} onFinish={onSubmitUpdate}>
              <Wrapper padding={`0 50px`}>
                <Wrapper dr={`row`} margin={`0 0 20px`}>
                  <Text width={`100px`}>강의명</Text>
                  <FormItem
                    rules={[
                      { required: true, message: "강의명을 입력해주세요." },
                    ]}
                    name={`course`}
                  >
                    <CusotmInput />
                  </FormItem>
                </Wrapper>

                <Wrapper dr={`row`} margin={`0 0 20px`}>
                  <Text width={`100px`}>강의 번호</Text>
                  <FormItem
                    rules={[
                      { required: true, message: "강의 번호을 입력해주세요." },
                    ]}
                    name={`number`}
                  >
                    <CusotmInput />
                  </FormItem>
                </Wrapper>

                <Wrapper dr={`row`} margin={`0 0 20px`}>
                  <Text width={`100px`}>강사</Text>
                  <FormItem
                    rules={[
                      { required: true, message: "강사를 선택해주세요." },
                    ]}
                    name={`UserId`}
                  >
                    <Select size={`large`}>
                      {allUsers &&
                        allUsers.map((data) => {
                          return (
                            <Select.Option key={data.id} value={data.id}>
                              {data.username}
                            </Select.Option>
                          );
                        })}
                    </Select>
                    {/* <CusotmInput /> */}
                  </FormItem>
                </Wrapper>

                {/* <Wrapper dr={`row`} margin={`0 0 20px`}>
            <Text width={`100px`}>레벨</Text>
            <FormItem
              rules={[{ required: true, message: "레벨을 입력해주세요." }]}
              name={`startLv`}>
              <CusotmInput />
            </FormItem>
          </Wrapper> */}

                <Wrapper dr={`row`} margin={`0 0 20px`}>
                  <Text width={`100px`}>레벨</Text>
                  <Wrapper dr={`row`} width={`calc(100% - 100px)`}>
                    <Wrapper
                      width={`calc(100% / 3)`}
                      dr={`row`}
                      ju={`flex-start`}
                    >
                      <FormItem name={`lv1`} width={`calc(100% - 50px)`}>
                        <Select>
                          <Select.Option value={`1`}>1</Select.Option>
                          <Select.Option value={`2`}>2</Select.Option>
                          <Select.Option value={`3`}>3</Select.Option>
                          <Select.Option value={`4`}>4</Select.Option>
                          <Select.Option value={`5`}>5</Select.Option>
                          <Select.Option value={`6`}>6</Select.Option>
                        </Select>
                      </FormItem>
                      <Text>&nbsp;권</Text>
                    </Wrapper>

                    <Wrapper
                      width={`calc(100% / 3)`}
                      dr={`row`}
                      ju={`flex-start`}
                    >
                      <FormItem name={`lv2`} width={`calc(100% - 50px)`}>
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
                      </FormItem>
                      <Text>&nbsp;단원</Text>
                    </Wrapper>

                    <Wrapper
                      width={`calc(100% / 3)`}
                      dr={`row`}
                      ju={`flex-start`}
                    >
                      <FormItem name={`lv3`} width={`calc(100% - 50px)`}>
                        <Input type={`number`} min={`0`} />
                      </FormItem>
                      <Text>&nbsp;페이지</Text>
                    </Wrapper>
                  </Wrapper>
                  {/* <FormItem
            rules={[{ required: true, message: "레벨을 입력해주세요." }]}
            name={`startLv`}
          ></FormItem> */}
                </Wrapper>

                <Wrapper dr={`row`} margin={`0 0 20px`}>
                  <Text width={`100px`}>횟수</Text>
                  <FormItem
                    rules={[
                      { required: true, message: "횟수를 입력해주세요." },
                    ]}
                    name={`cnt`}
                    width={`calc(100% - 130px)`}
                  >
                    <CusotmInput type={`number`} {...inputCnt} />
                  </FormItem>
                  <Text width={`30px`} padding={`0 0 0 10px`}>
                    회
                  </Text>
                </Wrapper>

                <Wrapper dr={`row`} margin={`0 0 20px`}>
                  <Text width={`100px`}>진행 요일</Text>
                  <FormItem
                    rules={[
                      { required: true, message: "요일을 입력해주세요." },
                    ]}
                    name={`day`}
                  >
                    <Select
                      mode="multiple"
                      size={`large`}
                      onChange={(e) => {
                        setDayArr(e);
                      }}
                    >
                      <Select.Option value={`월`}>월</Select.Option>
                      <Select.Option value={`화`}>화</Select.Option>
                      <Select.Option value={`수`}>수</Select.Option>
                      <Select.Option value={`목`}>목</Select.Option>
                      <Select.Option value={`금`}>금</Select.Option>
                      <Select.Option value={`토`}>토</Select.Option>
                      <Select.Option value={`일`}>일</Select.Option>
                    </Select>
                  </FormItem>
                </Wrapper>

                {dayArr && dayArr.length !== 0 && (
                  <Wrapper dr={`row`} ju={`flex-start`} margin={`0 0 20px`}>
                    <Text width={`100px`}>수업 시간</Text>
                    <Wrapper
                      dr={`row`}
                      ju={`flex-start`}
                      width={`calc(100% - 100px)`}
                    >
                      {dayArr.map((data, idx) => {
                        return (
                          <FormItem
                            key={data.id}
                            width={`auto`}
                            margin={`0 10px 5px 0`}
                            label={data}
                            name={`time_${idx + 1}`}
                            rules={[
                              {
                                required: true,
                                message: `${data}요일의 수업시간을 입력해주세요.`,
                              },
                            ]}
                          >
                            <TimeInput format={`HH:mm`} />
                          </FormItem>
                        );
                      })}
                    </Wrapper>
                  </Wrapper>
                )}

                <Wrapper dr={`row`} margin={`0 0 20px`}>
                  <Text width={`100px`}>시작 날짜</Text>
                  <FormItem
                    rules={[
                      { required: true, message: "시작 날짜를 입력해주세요." },
                    ]}
                    name={`startDate`}
                  >
                    <DateInput
                      format={`YYYY-MM-DD`}
                      size={`large`}
                      // {...inputStartDate}
                      value={
                        updateData && moment(updateData.startDate, "YYYY-MM-DD")
                      }
                    />
                  </FormItem>
                </Wrapper>

                <Wrapper dr={`row`} margin={`0 0 20px`} al={`flex-start`}>
                  <Text width={`100px`} margin={`8px 0 0`}>
                    줌링크
                  </Text>
                  <FormItem
                    rules={[
                      { required: true, message: "줌링크를 작성해주세요." },
                    ]}
                    name={`zoomLink`}
                  >
                    <CusotmInput type={`url`} />
                  </FormItem>
                </Wrapper>
              </Wrapper>
            </Form>
          </Modal>
          {/* NOTICE MODAL */}
          <Modal
            width={`1000px`}
            title={`게시판 상세보기`}
            visible={normalNoticeDetailModal}
            footer={null}
            onCancel={() => noticeModalToggle(null)}
          >
            <Wrapper
              dr={`row`}
              padding={`3px 0`}
              borderBottom={`1px dashed ${Theme.lightGrey3_C}`}
            >
              <Wrapper
                width={`10%`}
                bgColor={Theme.lightGrey3_C}
                padding={`3px`}
              >
                작성자
              </Wrapper>
              <Wrapper width={`90%`} al={`flex-start`} padding={`0 10px`}>
                {noticeDetailData && noticeDetailData.noticeAuthor} (
                {noticeDetailData &&
                  (noticeDetailData.noticeLevel === 1
                    ? "학생"
                    : noticeDetailData.noticeLevel === 2
                    ? "강사"
                    : "관리자")}
                )
              </Wrapper>
            </Wrapper>

            <Wrapper
              dr={`row`}
              padding={`3px 0`}
              borderBottom={`1px dashed ${Theme.lightGrey3_C}`}
            >
              <Wrapper
                width={`10%`}
                bgColor={Theme.lightGrey3_C}
                padding={`3px`}
              >
                작성일
              </Wrapper>
              <Wrapper width={`90%`} al={`flex-start`} padding={`0 10px`}>
                {noticeDetailData && noticeDetailData.noticeCreatedAt}
              </Wrapper>
            </Wrapper>

            <Wrapper
              dr={`row`}
              padding={`3px 0`}
              borderBottom={`1px dashed ${Theme.lightGrey3_C}`}
            >
              <Wrapper
                width={`10%`}
                bgColor={Theme.lightGrey3_C}
                padding={`3px`}
              >
                전송된 사람
              </Wrapper>
              <Wrapper width={`90%`} al={`flex-start`} padding={`0 10px`}>
                {normalNoticeDetailReceviers &&
                  (normalNoticeDetailReceviers.length === 0 ? (
                    <Text>admin</Text>
                  ) : (
                    normalNoticeDetailReceviers.map((data, idx) => (
                      <Text key={idx}>
                        {data.username}
                        {idx !== normalNoticeDetailReceviers.length - 1 && ","}
                        &nbsp;
                      </Text>
                    ))
                  ))}
              </Wrapper>
            </Wrapper>

            <Wrapper
              dr={`row`}
              padding={`3px 0`}
              borderBottom={`1px dashed ${Theme.lightGrey3_C}`}
              margin={`0 0 20px`}
            >
              <Wrapper
                width={`10%`}
                bgColor={Theme.lightGrey3_C}
                padding={`3px`}
              >
                첨부파일
              </Wrapper>

              <Wrapper width={`90%`} al={`flex-start`} padding={`0 10px`}>
                {noticeDetailData && noticeDetailData.noticeFile ? (
                  <CommonButton
                    size={`small`}
                    radius={`5px`}
                    fontSize={`14px`}
                    onClick={() =>
                      fileDownloadHandler(noticeDetailData.noticeFile)
                    }
                  >
                    다운로드
                  </CommonButton>
                ) : (
                  <Text>첨부파일이 없습니다.</Text>
                )}
              </Wrapper>
            </Wrapper>

            <Wrapper
              dr={`row`}
              padding={`3px 0`}
              borderBottom={`1px dashed ${Theme.lightGrey3_C}`}
            >
              <Wrapper
                width={`10%`}
                bgColor={Theme.lightGrey3_C}
                padding={`3px`}
              >
                제목
              </Wrapper>
              <Wrapper width={`90%`} al={`flex-start`} padding={`0 10px`}>
                {noticeDetailData && noticeDetailData.noticeTitle}
              </Wrapper>
            </Wrapper>

            <Wrapper
              dr={`row`}
              padding={`3px 0`}
              borderBottom={`1px dashed ${Theme.lightGrey3_C}`}
            >
              <Wrapper bgColor={Theme.lightGrey3_C} padding={`3px`}>
                내용
              </Wrapper>

              {noticeDetailData && (
                <Wrapper
                  border={`1px solid ${Theme.lightGrey3_C}`}
                  padding={`10px`}
                  al={`flex-start`}
                  ju={`flex-start`}
                  minHeight={`300px`}
                  dangerouslySetInnerHTML={{
                    __html: noticeDetailData.noticeContent,
                  }}
                />
              )}
            </Wrapper>

            <FormTag form={commentForm} onFinish={commentSubmit}>
              <Wrapper al={`flex-start`} ju={`flex-start`} margin={`0 0 10px`}>
                <Wrapper dr={`row`} padding={`3px 0`}>
                  <Wrapper bgColor={Theme.lightGrey3_C} padding={`3px`}>
                    댓글&nbsp;{normalCommentsLen}
                  </Wrapper>

                  <FormItem
                    width={`100%`}
                    name={`comment`}
                    rules={[
                      { required: true, message: "댓글을 입력해주세요." },
                    ]}
                  >
                    <TextArea
                      width={`100%`}
                      height={`115px`}
                      placeholder={`댓글을 입력해주세요.`}
                    />
                  </FormItem>
                  <Wrapper al={`flex-end`} margin={`10px 0 0`}>
                    <Button htmlType={`submit`} type="primary">
                      작성
                    </Button>
                  </Wrapper>
                </Wrapper>
              </Wrapper>
            </FormTag>

            {/* 댓글 */}

            {normalComments &&
              (normalComments.length === 0 ? (
                <Wrapper>
                  <Empty description={`댓글이 없습니다.`} />
                </Wrapper>
              ) : (
                normalComments.map((data) => {
                  return (
                    <>
                      <Wrapper
                        al={`flex-start`}
                        padding={`20px 0 20px 20px`}
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
                          <Text fontSize={`16px`} fontWeight={`700`}>
                            {data.name}(
                            {data.level === 1
                              ? "학생"
                              : data.level === 2
                              ? "강사"
                              : "관리자"}
                            )
                            <SpanText
                              fontSize={`13px`}
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
                              {data.commentCnt !== 0 && (
                                <HoverText
                                  onClick={() => getCommentHandler(data.id)}
                                >
                                  모든 댓글 +
                                </HoverText>
                              )}
                              {me && (
                                <CommonButton
                                  padding={`0 10px`}
                                  kindOf={`black`}
                                  margin={`0 0 0 10px`}
                                  fontSize={`14px`}
                                  onClick={() => openRecommentToggle(data)}
                                >
                                  댓글 작성
                                </CommonButton>
                              )}
                            </Wrapper>
                          </Wrapper>
                        </Wrapper>

                        <Wrapper dr={`row`} margin={`10px 0 0`} al={`flex-end`}>
                          <Wrapper
                            width={`85%`}
                            al={`flex-start`}
                            wordBreak={`break-all`}
                          >
                            {data.content}
                          </Wrapper>
                          <Wrapper width={`15%`} al={`flex-end`}>
                            {me && data.UserId === me.id && (
                              <Wrapper dr={`row`} width={`auto`}>
                                <HoverText
                                  color={Theme.basicTheme_C}
                                  onClick={() => updateCommentToggle(data)}
                                >
                                  수정
                                </HoverText>
                                &nbsp;|&nbsp;
                                <Popconfirm
                                  placement="bottomRight"
                                  title={`삭제하시겠습니까?`}
                                  okText="삭제"
                                  cancelText="취소"
                                  onConfirm={() => deleteCommentHandler(data)}
                                >
                                  <HoverText color={Theme.red_C}>
                                    삭제
                                  </HoverText>
                                </Popconfirm>
                              </Wrapper>
                            )}
                          </Wrapper>
                        </Wrapper>
                      </Wrapper>

                      {/* 대댓글 영역 */}
                      {normalCommentList &&
                        normalCommentList.length > 0 &&
                        normalCommentList[0].id === data.id &&
                        normalCommentList.slice(1).map((v) => {
                          return (
                            <Wrapper
                              key={v.id}
                              padding={
                                width < 900
                                  ? `10px 0 10px ${v.lev * 5}px`
                                  : `30px 0 30px ${v.lev * 15}px`
                              }
                              al={`flex-start`}
                              borderTop={`1px dashed ${Theme.grey_C}`}
                              bgColor={
                                v.lev === 2
                                  ? Theme.lightGrey4_C
                                  : Theme.lightGrey2_C
                              }
                            >
                              <Wrapper dr={`row`} ju={`space-between`}>
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
                                  <Text fontWeight={`700`} fontSize={`16px`}>
                                    {v.name}(
                                    {v.level === 1
                                      ? "학생"
                                      : v.level === 2
                                      ? "강사"
                                      : "관리자"}
                                    )
                                  </Text>
                                  <Text
                                    fontSize={`13px`}
                                    margin={`0 15px`}
                                    color={Theme.grey2_C}
                                  >
                                    {moment(v.createdAt).format("YYYY-MM-DD")}
                                  </Text>
                                </Wrapper>
                                <Wrapper width={`auto`} al={`flex-end`}>
                                  {me && (
                                    <CommonButton
                                      padding={`0 10px`}
                                      kindOf={`black`}
                                      margin={`0 0 0 10px`}
                                      fontSize={`14px`}
                                      onClick={() => openRecommentToggle(v)}
                                    >
                                      댓글 작성
                                    </CommonButton>
                                  )}
                                </Wrapper>
                              </Wrapper>

                              <Wrapper
                                dr={`row`}
                                margin={`10px 0 0`}
                                al={`flex-end`}
                              >
                                <Wrapper
                                  width={`85%`}
                                  al={`flex-start`}
                                  wordBreak={`break-all`}
                                >
                                  {v.isDelete === 1 ? (
                                    <Text>삭제된 댓글입니다.</Text>
                                  ) : (
                                    <Text>{v.content.split("ㄴ")[1]}</Text>
                                  )}
                                </Wrapper>
                                <Wrapper width={`15%`} al={`flex-end`}>
                                  {v.isDelete === 0 &&
                                    me &&
                                    v.UserId === me.id && (
                                      <Wrapper dr={`row`} width={`auto`}>
                                        <HoverText
                                          onClick={() =>
                                            updateCommentToggle(v, true)
                                          }
                                        >
                                          수정
                                        </HoverText>
                                        &nbsp;|&nbsp;
                                        <Popconfirm
                                          placement="bottomRight"
                                          title={`삭제하시겠습니까?`}
                                          okText="삭제"
                                          cancelText="취소"
                                          onConfirm={() =>
                                            deleteCommentHandler(v)
                                          }
                                        >
                                          <HoverText>삭제</HoverText>
                                        </Popconfirm>
                                      </Wrapper>
                                    )}
                                </Wrapper>
                              </Wrapper>
                            </Wrapper>
                          );
                        })}
                    </>
                  );
                })
              ))}
          </Modal>

          {/* NORMAL NOTICE MODAL */}
          <Modal
            width={`1000px`}
            title="일반게시판 관리"
            visible={normalNoticeModal}
            onCancel={() => normalNoticeUpdateModalToggle(null)}
            footer={null}
          >
            <Wrapper padding={`10px`}>
              <Form
                form={normalNoticeForm}
                style={{ width: `100%` }}
                onFinish={
                  normalNoticeUpdateData
                    ? normalNoticeAdminUpdate
                    : normalNoticeAdminCreate
                }
              >
                {!normalNoticeUpdateData && (
                  <Form.Item
                    name={"type"}
                    label="유형"
                    rules={[
                      { required: true, message: "유형을 선택해 주세요." },
                    ]}
                  >
                    <Select
                      size="small"
                      showSearch
                      style={{ width: `100%` }}
                      placeholder="유형을 선택해 주세요."
                      onChange={normalNoticeTypeChangeHandler}
                    >
                      {normalSelectArr &&
                        normalSelectArr.map((data) => (
                          <Select.Option value={data}>{data}</Select.Option>
                        ))}
                    </Select>
                  </Form.Item>
                )}

                {normalNoticeType &&
                  (normalNoticeType === "강사개인" ||
                    normalNoticeType === "학생개인") && (
                    <Form.Item
                      label={normalNoticeType === "강사개인" ? "강사" : "학생"}
                      name="userId"
                      rules={[
                        {
                          required: true,
                          message: `${
                            normalNoticeType === "강사개인" ? "강사" : "학생"
                          }를 선택해주세요.`,
                        },
                      ]}
                    >
                      <Select
                        size="small"
                        mode="multiple"
                        showSearch
                        style={{ width: `100%` }}
                        placeholder={`${
                          normalNoticeType === "강사개인" ? "강사" : "학생"
                        }를 선택해주세요.`}
                        value={normalNoticeUser}
                        onChange={normalNoticeUserChangeHandler}
                      >
                        {normalNoticeType === "강사개인"
                          ? teachers &&
                            teachers.map((data) => (
                              <Select.Option
                                value={JSON.stringify({
                                  id: data.id,
                                  username: data.username,
                                })}
                                key={data.id}
                              >
                                {data.username}
                              </Select.Option>
                            ))
                          : normalNoticeType === "학생개인" &&
                            userStuList &&
                            userStuList.map((data) => (
                              <Select.Option
                                value={JSON.stringify({
                                  id: data.id,
                                  username: data.username,
                                })}
                                key={data.id}
                              >
                                {data.username}
                              </Select.Option>
                            ))}
                      </Select>
                    </Form.Item>
                  )}

                <Form.Item
                  label="제목"
                  name="title"
                  rules={[{ required: true, message: "제목을 입력해 주세요" }]}
                >
                  <Input
                    style={{ boxShadow: `none` }}
                    size="small"
                    allowClear
                    placeholder="제목을 입력해주세요."
                  />
                </Form.Item>

                <Form.Item
                  label="본문"
                  name="content"
                  rules={[{ required: true, message: "본문을 입력해 주세요." }]}
                  style={{ margin: `0` }}
                >
                  <ToastEditorComponentMix
                    action={getEditContent}
                    initialValue={
                      normalNoticeUpdateData
                        ? normalNoticeUpdateData.noticeContent
                        : ""
                    }
                    placeholder="본문을 입력해주세요."
                    buttonText={normalNoticeUpdateData ? "수정" : "추가"}
                  />
                </Form.Item>

                <FileBox>
                  <input
                    type="file"
                    name="file"
                    hidden
                    ref={normalNoticeFileRef}
                    onChange={normalNoticeFileUploadHandler}
                  />
                  <Button
                    size="small"
                    type="primary"
                    onClick={normalNoticeFileClickHandler}
                  >
                    파일업로드
                  </Button>

                  <Text margin={`0 0 0 10px`}>
                    {normalNoticeUpdateData && normalNoticeUpdateData.noticeFile
                      ? `첨부파일`
                      : filename.value
                      ? filename.value
                      : `파일을 선택해주세요.`}
                  </Text>
                </FileBox>
              </Form>
            </Wrapper>
          </Modal>
          {/* NORMAL NOTICE MODAL END */}
          {/* 댓글 수정 */}
          <Modal
            width={`700px`}
            title={`댓글 수정`}
            visible={commentUpdateModal}
            onCancel={updateCommentToggle}
            onOk={updateCommentFormSubmit}
            okText="수정"
            cancelText="취소"
          >
            <FormTag
              form={updateCommentForm}
              onFinish={updateCommentFormFinish}
            >
              <FormItem
                width={`100%`}
                label={`댓글 내용`}
                name={`content`}
                rules={[{ required: true, message: "본문을 입력해 주세요." }]}
              >
                <TextArea width={`100%`} />
              </FormItem>
            </FormTag>
          </Modal>

          {/* 대댓글 작성 */}
          <Modal
            width={`800px`}
            title="댓글 작성"
            footer={null}
            visible={repleToggle}
            onCancel={() => openRecommentToggle(null)}
            onOk={() => openRecommentToggle(null)}
          >
            {currentData && (
              <Wrapper padding={`10px`}>
                <Wrapper
                  dr={`row`}
                  padding={`3px 0`}
                  borderBottom={`1px dashed ${Theme.lightGrey3_C}`}
                  margin={`0 0 10px`}
                >
                  <Wrapper bgColor={Theme.lightGrey3_C} padding={`3px`}>
                    댓글 내용
                  </Wrapper>

                  <Wrapper wordBreak={`break-all`} al={`flex-start`}>
                    {currentData.isDelete === 1
                      ? "삭제된 댓글입니다."
                      : currentData.parent === 0
                      ? currentData.content
                      : currentData.content.split("ㄴ")[1]}
                  </Wrapper>
                </Wrapper>
                {/* <FormItem width={`100%`} label="댓글">
                  <Text></Text>
                </FormItem> */}

                <FormTag form={childCommentForm} onFinish={childCommentSubmit}>
                  <FormItem
                    width={`100%`}
                    label="댓글"
                    name={`comment`}
                    rules={[
                      { required: true, message: "댓글을 작성해주세요." },
                    ]}
                  >
                    <TextArea
                      width={`100%`}
                      height={`115px`}
                      placeholder="댓글을 입력해주세요."
                    />
                  </FormItem>
                  <Wrapper al={`flex-end`}>
                    <CommonButton
                      htmlType={`submit`}
                      width={`80px`}
                      height={`30px`}
                      padding={`0`}
                    >
                      작성
                    </CommonButton>
                  </Wrapper>
                </FormTag>
              </Wrapper>
            )}
          </Modal>
        </AdminLayout>
      ) : (
        <>
          <Wrapper dr={`row`} height={`100vh`}>
            <Wrapper
              width={`50%`}
              height={`100%`}
              bgImg={`url("https://firebasestorage.googleapis.com/v0/b/storage-4leaf.appspot.com/o/4leaf%2F5137894.jpg?alt=media&token=99858357-4602-44aa-b32a-e6c9867788ff")`}
            >
              <Image
                width={`300px`}
                alt="logo"
                src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/logo/logo.png`}
              />
              <Wrapper
                color={Theme.white_C}
                margin={`15px 0 0`}
                fontSize={`1.1rem`}
              >
                관리자페이지에 오신걸 환영합니다.
              </Wrapper>
            </Wrapper>
            <Wrapper width={`50%`}>
              <Wrapper width={`50%`}>
                <Wrapper
                  fontSize={`2rem`}
                  fontWeight={`bold`}
                  margin={`0 0 30px`}
                  al={`flex-start`}
                >
                  Log in
                </Wrapper>
                <Wrapper al={`flex-start`}>아이디</Wrapper>
                <Wrapper>
                  <Input
                    {...inputId}
                    onKeyDown={(e) => e.keyCode === 13 && onLoginHandler()}
                  />
                </Wrapper>
                <Wrapper al={`flex-start`} margin={`15px 0 0`}>
                  비밀번호
                </Wrapper>
                <Wrapper margin={`0 0 15px`}>
                  <Input
                    {...inputPw}
                    type={`password`}
                    onKeyDown={(e) => e.keyCode === 13 && onLoginHandler()}
                  />
                </Wrapper>
                <CommonButton width={`100%`} onClick={onLoginHandler}>
                  로그인
                </CommonButton>
              </Wrapper>
            </Wrapper>
          </Wrapper>
        </>
      )}
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
      type: NOTICE_ADMIN_MAIN_LIST_REQUEST,
      data: {
        page: 1,
      },
    });

    context.store.dispatch({
      type: MESSAGE_ADMIN_MAIN_LIST_REQUEST,
      data: {
        listType: "",
        search: "",
      },
    });

    context.store.dispatch({
      type: USER_ALL_LIST_REQUEST,
      data: {
        type: 2,
      },
    });

    context.store.dispatch({
      type: USER_STU_LIST_REQUEST,
    });
    context.store.dispatch({
      type: USER_TEACHER_LIST_REQUEST,
    });

    context.store.dispatch({
      type: NORMAL_NOTICE_ADMIN_LIST_REQUEST,
      // data: {
      //   listType: 4,
      // },
    });

    // 구현부 종료
    context.store.dispatch(END);
    console.log("🍀 SERVER SIDE PROPS END");
    await context.store.sagaTask.toPromise();
  }
);

export default AdminHome;
