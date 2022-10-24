import React, {
  useCallback,
  useDebugValue,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";

import { useRouter } from "next/router";

import axios from "axios";
import { END } from "redux-saga";

import AdminLayout from "../../../components/AdminLayout";
import PageHeader from "../../../components/admin/PageHeader";

import {
  Button,
  Calendar,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Select,
  Table,
} from "antd";
import styled from "styled-components";
import {
  Text,
  Wrapper,
  Image,
  SpanText,
  CommonButton,
  RowWrapper,
  ColWrapper,
} from "../../../components/commonComponents";
import Theme from "../../../components/Theme";

import wrapper from "../../../store/configureStore";
import {
  LOAD_MY_INFO_REQUEST,
  USER_ADMIN_UPDATE_REQUEST,
  USER_TEACHER_LIST_REQUEST,
} from "../../../reducers/user";
import {
  LECTURE_COMUTE_REQUEST,
  LECTURE_DETAIL_REQUEST,
  LECTURE_DIARY_ADMIN_LIST_REQUEST,
  LECTURE_MEMO_STU_LIST_REQUEST,
} from "../../../reducers/lecture";
import moment from "moment";
import { BOOK_LIST_REQUEST } from "../../../reducers/book";
import { saveAs } from "file-saver";
import useWidth from "../../../hooks/useWidth";
import {
  PARTICIPANT_ADMIN_LIST_REQUEST,
  PARTICIPANT_UPDATE_REQUEST,
  PARTICIPANT_USER_CURRENT_LIST_REQUEST,
  PARTICIPANT_USER_DELETE_LIST_REQUEST,
  PARTICIPANT_USER_LIMIT_LIST_REQUEST,
  PARTICIPANT_USER_MOVE_LIST_REQUEST,
} from "../../../reducers/participant";
import { NOTICE_LECTURE_LIST_REQUEST } from "../../../reducers/notice";
import { MESSAGE_LECTURE_LIST_REQUEST } from "../../../reducers/message";
import { CalendarOutlined } from "@ant-design/icons";
import { APP_DETAIL_REQUEST } from "../../../reducers/application";
import {
  LECTURE_MEMO_CREATE_REQUEST,
  LECTURE_MEMO_DELETE_REQUEST,
  LECTURE_MEMO_LIST_REQUEST,
  LECTURE_MEMO_UDPATE_REQUEST,
} from "../../../reducers/lectureMemo";
import { PRICE_UPDATE_REQUEST } from "../../../reducers/payment";
import ClassNotice from "../../../components/admin/ClassNotice";
import { COMMUTE_ADMIN_LIST_REQUEST } from "../../../reducers/commute";

const CustomTextArea = styled(Input.TextArea)`
  width: ${(props) => props.width || `250px`};
`;

const CustomDatePicker = styled(DatePicker)`
  width: ${(props) => props.width || `250px`};
`;

const RangePicker = styled(DatePicker.RangePicker)`
  width: ${(props) => props.width || `100%`};
`;

const AdminContent = styled.div`
  padding: 20px;
`;

const CustomForm = styled(Form)`
  width: 100%;
`;

const FormItem = styled(Form.Item)`
  width: ${(props) => props.width};

  @media (max-width: 700px) {
    width: 100%;
  }

  margin: 0px;
`;

const CustomInput = styled(Input)`
  width: ${(props) => props.width || `250px`};
`;

const CustomSelect = styled(Select)`
  margin: ${(props) => props.margin};

  &:not(.ant-select-customize-input) .ant-select-selector {
    border-radius: 5px;
    box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.16);
  }

  & .ant-select-selector {
    width: 250px !important;
    padding: 0 5px !important;
  }

  & .ant-select-arrow span svg {
    color: ${Theme.black_C};
  }

  & .ant-select-selection-placeholder {
    color: ${Theme.grey2_C};
  }
`;

const DetailClass = () => {
  // LOAD CURRENT INFO AREA /////////////////////////////////////////////

  const {
    me,
    st_loadMyInfoDone,
    teachers,
    st_userAdminUpdateDone,
    st_userAdminUpdateError,
  } = useSelector((state) => state.user);

  const {
    lectureDetail,
    lectureMemoStuLastPage,
    lectureMemoStuList,
    lectureDiaryAdminList,
    noticeLectureLastPage,
    lectureCommuteList,
  } = useSelector((state) => state.lecture);
  const {
    partAdminList,

    partUserDeleteList,
    st_participantUserDeleteListDone,
    st_participantUserDeleteListError,

    partUserMoveList,
    st_participantUserMoveListDone,
    st_participantUserMoveListError,
    partUserCurrentList,
    partUserLimitList,

    st_participantUserLimitListDone,
    st_participantUserLimitListError,

    st_participantUpdateDone,
    st_participantUpdateError,
  } = useSelector((state) => state.participant);

  const { bookList, bookMaxLength } = useSelector((state) => state.book);
  const { noticeLectureList } = useSelector((state) => state.notice);
  const { messageLectureList, messageLectureLastPage } = useSelector(
    (state) => state.message
  );

  const { applicationDetail, st_appDetailDone, st_appDetailError } =
    useSelector((state) => state.app);

  const { st_priceUpdateDone, st_priceUpdateError } = useSelector(
    (state) => state.payment
  );

  const { commuteAdminList } = useSelector((state) => state.commute);

  const {
    lectureMemoList,
    st_lectureMemoCreateDone,
    st_lectureMemoCreateError,
    st_lectureMemoUpdateDone,
    st_lectureMemoUpdateError,
    st_lectureMemoDeleteDone,
    st_lectureMemoDeleteError,
  } = useSelector((state) => state.lectureMemo);

  const router = useRouter();

  const moveLinkHandler = useCallback((link) => {
    router.push(link);
  }, []);

  useEffect(() => {
    if (st_loadMyInfoDone) {
      if (!me || parseInt(me.level) < 3) {
        moveLinkHandler(`/admin`);
      }
    }
  }, [st_loadMyInfoDone]);
  /////////////////////////////////////////////////////////////////////////

  ////// HOOKS //////

  const width = useWidth();

  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const [currentBookPage, setCurrentBookPage] = useState(1);

  const [memoModal, setMemoModal] = useState(false);
  const [currentStudentId, setCurrentStudentId] = useState(null);
  const [commutesModal, setCommutesModal] = useState(false);

  const [lecModal, setLecModal] = useState(false);
  const [lecMemoData, setLecMemoData] = useState(null);

  const [detailMemoModal, setDetailMemoModal] = useState(false);
  const [detailMemo, setDetailMemo] = useState(null);

  const [detailBook, setDetailBook] = useState(null);
  const [bookModal, setBookModal] = useState(false);

  const [stuChangeModal, setStuChangeModal] = useState(false);
  const [stuChangeDetail, setStuChangeDetail] = useState(null);

  const [priceChangeModal, setPriceChangeModal] = useState(false);
  const [priceChangeDetail, setPriceChangeDetail] = useState(null);

  const [currentNoticePage, setCurrentNoticePage] = useState(1);
  const [currentMessagePage, setCurrentMessagePage] = useState(1);

  const [noticeModal, setNoticeModal] = useState(false);
  const [noticeDetail, setNoticeDetail] = useState(null);

  const [messageModal, setMessageModal] = useState(false);
  const [messageDetail, setMessageDetail] = useState(null);

  const [time, setTime] = useState(null);

  const [detailToggle, setDetailToggle] = useState(false);
  const [stuDetailModal, setStuDetailModal] = useState(false);
  const [stuChangeDate, setStuChangeDate] = useState("");

  const [memoDetailModal, setMemoDetailModal] = useState("");
  const [memoDetailData, setMemoDetailData] = useState("");

  const [memoCreateModal, setMemoCreateModal] = useState("");
  const [memoUpdateData, setMemoUpdateData] = useState("");

  const [updateStuForm] = Form.useForm();

  const [createMemoForm] = Form.useForm();
  const [updateMemoForm] = Form.useForm();

  const [priceForm] = Form.useForm();
  const [stuDetail, setStuDetail] = useState([]);

  const [isCalendar, setIsCalendar] = useState(false);

  const [isDelete, setIsDelete] = useState(`0`);
  const [isChange, setIsChange] = useState(`0`);

  ////// REDUX //////
  ////// USEEFFECT //////

  useEffect(() => {
    if (router.query) {
      dispatch({
        type: LECTURE_DETAIL_REQUEST,
        data: {
          LectureId: router.query.id,
        },
      });
      dispatch({
        type: LECTURE_DIARY_ADMIN_LIST_REQUEST,
        data: {
          LectureId: router.query.id,
        },
      });
      dispatch({
        type: BOOK_LIST_REQUEST,
        data: {
          LectureId: router.query.id,
        },
      });
      dispatch({
        type: PARTICIPANT_ADMIN_LIST_REQUEST,
        data: {
          LectureId: router.query.id,
          isDelete: `0`,
          isChange: `0`,
        },
      });

      dispatch({
        type: LECTURE_MEMO_LIST_REQUEST,
        data: {
          LectureId: router.query.id,
        },
      });
    }
  }, [router.query]);

  useEffect(() => {
    dispatch({
      type: LECTURE_COMUTE_REQUEST,
      data: {
        lectureId: router.query.id,
        time: time ? time.format("YYYY-MM-DD") : moment().format(`YYYY-MM-DD`),
      },
    });
  }, [router.query, time]);

  useEffect(() => {
    dispatch({
      type: LECTURE_MEMO_STU_LIST_REQUEST,
      data: {
        LectureId: parseInt(router.query.id),
        page: currentPage,
        search: "",
        StudentId: currentStudentId,
      },
    });
  }, [router.query, currentPage, currentStudentId]);

  useEffect(() => {
    dispatch({
      type: NOTICE_LECTURE_LIST_REQUEST,
      data: {
        LectureId: router.query.id,
        page: currentNoticePage,
      },
    });
  }, [router.query, currentNoticePage]);

  useEffect(() => {
    dispatch({
      type: MESSAGE_LECTURE_LIST_REQUEST,
      data: {
        LectureId: router.query.id,
        page: currentMessagePage,
      },
    });
  }, [router.query, currentMessagePage]);

  useEffect(() => {
    dispatch({
      type: BOOK_LIST_REQUEST,
      data: {
        LectureId: router.query.id,
        search: "",
        page: currentBookPage,
      },
    });
  }, [currentBookPage]);

  useEffect(() => {
    if (st_appDetailDone) {
      updateStuForm.setFieldsValue({
        classHour: applicationDetail[0].classHour,
        timeDiff: applicationDetail[0].timeDiff,
        wantStartDate: applicationDetail[0].wantStartDate
          ? moment(applicationDetail[0].wantStartDate)
          : "",
        teacher: applicationDetail[0].teacher,
        freeTeacher: applicationDetail[0].freeTeacher,
        meetDate: applicationDetail[0].wantStartDate
          ? moment(applicationDetail[0].meetDate)
          : "",
        level: applicationDetail[0].level,
        purpose: applicationDetail[0].purpose,
      });
    }
  }, [updateStuForm, st_appDetailDone]);

  useEffect(() => {
    if (st_userAdminUpdateDone) {
      setStuDetailModal(false);
      setIsCalendar(false);
      updateStuForm.resetFields();

      dispatch({
        type: PARTICIPANT_ADMIN_LIST_REQUEST,
        data: {
          LectureId: router.query.id,
        },
      });

      return message.success("학생정보가 수정되었습니다.");
    }
  }, [st_userAdminUpdateDone]);

  useEffect(() => {
    if (st_userAdminUpdateError) {
      return message.error(st_userAdminUpdateError);
    }
  }, [st_userAdminUpdateError]);

  useEffect(() => {
    if (st_userAdminUpdateError) {
      return message.error(st_userAdminUpdateError);
    }
  }, [st_userAdminUpdateError]);

  useEffect(() => {
    if (st_appDetailError) {
      return message.error(st_appDetailError);
    }
  }, [st_appDetailError]);

  useEffect(() => {
    if (st_participantUserLimitListError) {
      return message.error(st_participantUserLimitListError);
    }
  }, [st_participantUserLimitListError]);

  useEffect(() => {
    if (st_participantUserMoveListError) {
      return message.error(st_participantUserMoveListError);
    }
  }, [st_participantUserMoveListError]);

  useEffect(() => {
    if (st_participantUserDeleteListError) {
      return message.error(st_participantUserDeleteListError);
    }
  }, [st_participantUserDeleteListError]);

  useEffect(() => {
    if (st_participantUpdateDone) {
      dispatch({
        type: PARTICIPANT_ADMIN_LIST_REQUEST,
        data: {
          LectureId: router.query.id,
          isDelete: isDelete ? isDelete : `0`,
          isChange: isChange ? isChange : `0`,
        },
      });
      return message.success("학생 참여일이 수정 되었습니다.");
    }
  }, [st_participantUpdateDone]);

  useEffect(() => {
    if (st_participantUpdateError) {
      return message.error(st_participantUpdateError);
    }
  }, [st_participantUpdateError]);

  useEffect(() => {
    if (st_priceUpdateDone) {
      dispatch({
        type: PARTICIPANT_ADMIN_LIST_REQUEST,
        data: {
          LectureId: router.query.id,
          isDelete: isDelete ? isDelete : `0`,
          isChange: isChange ? isChange : `0`,
        },
      });
      return message.success("학생 수업료가 수정 되었습니다.");
    }
  }, [st_priceUpdateDone]);

  useEffect(() => {
    if (st_priceUpdateError) {
      return message.error(st_priceUpdateError);
    }
  }, [st_priceUpdateError]);

  const updateStuFinish = useCallback(
    (data) => {
      dispatch({
        type: USER_ADMIN_UPDATE_REQUEST,
        data: {
          id: stuDetail.UserId,
          birth: data.birth,
          mobile: data.mobile,
          password: data.password,
          stuCountry: data.stuCountry,
          stuLiveCon: data.stuLiveCon,
          stuLanguage: data.stuLanguage,
          sns: data.sns,
          snsId: data.snsId,
          stuPayCount: data.stuPayCount,
          classHour: data.classHour,
          timeDiff: data.timeDiff,
          wantStartDate: data.wantStartDate
            ? data.wantStartDate.format("YYYY-MM-DD")
            : "",
          teacher: data.teacher,
          freeTeacher: data.freeTeacher,
          meetDate: data.meetDate
            ? data.meetDate.format("YYYY-MM-DD hh:mm")
            : "",
          level: data.level,
          purpose: data.purpose,
        },
      });
    },
    [stuDetail, me]
  );

  // useEffect(() => {
  //   if (memoCreateModal) {
  // updateMemoForm.resetFields();
  // createMemoForm.resetFields();
  //   }
  // }, [memoCreateModal]);

  useEffect(() => {
    if (st_lectureMemoCreateDone) {
      dispatch({
        type: LECTURE_MEMO_LIST_REQUEST,
        data: {
          LectureId: router.query.id,
        },
      });
      memoCreateToggle(null);
      message.success(`메모가 작성되었습니다.`);
    }
  }, [st_lectureMemoCreateDone]);

  useEffect(() => {
    if (st_lectureMemoCreateError) {
      message.error(st_lectureMemoCreateError);
    }
  }, [st_lectureMemoCreateError]);

  useEffect(() => {
    if (st_lectureMemoUpdateDone) {
      dispatch({
        type: LECTURE_MEMO_LIST_REQUEST,
        data: {
          LectureId: router.query.id,
        },
      });
      memoCreateToggle(null);
      message.success(`메모가 수정되었습니다.`);
    }
  }, [st_lectureMemoUpdateDone]);

  useEffect(() => {
    if (st_lectureMemoUpdateError) {
      message.error(st_lectureMemoUpdateError);
    }
  }, [st_lectureMemoUpdateError]);

  useEffect(() => {
    if (st_lectureMemoDeleteDone) {
      dispatch({
        type: LECTURE_MEMO_LIST_REQUEST,
        data: {
          LectureId: router.query.id,
        },
      });

      message.success(`메모가 삭제되었습니다.`);
    }
  }, [st_lectureMemoDeleteDone]);

  useEffect(() => {
    if (st_lectureMemoDeleteError) {
      message.error(st_lectureMemoDeleteError);
    }
  }, [st_lectureMemoDeleteError]);

  useEffect(() => {
    dispatch({
      type: PARTICIPANT_ADMIN_LIST_REQUEST,
      data: {
        LectureId: router.query.id,
        isDelete,
        isChange,
      },
    });
  }, [isDelete, isChange]);

  ////// HANDLER //////

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

  const detailMemoOpen = useCallback((data) => {
    setCurrentStudentId(data.UserId);
    setMemoModal(true);
  }, []);
  const detailMemoClose = useCallback(() => {
    setMemoModal(false);
    setCurrentStudentId(null);
  }, []);

  const detailCommutesOpen = useCallback((data) => {
    if (data) {
      dispatch({
        type: COMMUTE_ADMIN_LIST_REQUEST,
        data: {
          LectureId: data.LectureId,
          UserId: data.UserId,
        },
      });
    }

    // setCurrentStudentId(data.UserId);
    setCommutesModal(true);
  }, []);

  const detailCommutesClose = useCallback(() => {
    setCurrentStudentId(null);
    setCommutesModal(false);
  }, []);

  const lecMemoOpen = useCallback((data) => {
    setLecModal(true);
    setLecMemoData(data);
  }, []);

  const lecMemoClose = useCallback(() => {
    setLecModal(false);
    setLecMemoData(null);
  }, []);

  const memoOpen = useCallback((data) => {
    setMemoDetailModal(true);
    setMemoDetailData(data);
  }, []);

  const memoClose = useCallback(() => {
    setMemoDetailModal(false);
    setMemoDetailData(null);
  }, []);

  const detailBookOpen = useCallback(() => {
    setDetailBook(bookList);
    setBookModal(true);
  }, [bookList]);

  const detailBookClose = useCallback(() => {
    setDetailBook(null);
    setBookModal(false);
  }, []);

  const detailMemoContentOpen = useCallback((data) => {
    setDetailMemo(data);
    setDetailMemoModal(true);
  }, []);

  const detailMemoContentClose = useCallback(() => {
    setDetailMemo(null);
    setDetailMemoModal(false);
  }, []);

  const stepEnd = useCallback((endDate, day) => {
    let endDay = moment
      .duration(moment(endDate).diff(moment().format("YYYY-MM-DD")))
      .asDays();

    const arr = ["일", "월", "화", "수", "목", "금", "토"];
    let add = 0;

    for (let i = 0; i < endDay; i++) {
      let saveDay = moment()
        .add(i + 1, "days")
        .day();

      const saveResult = day.includes(arr[saveDay]);

      if (saveResult) {
        add += 1;
      }
    }

    return add;
  }, []);

  const dateChagneHandler = useCallback((data) => {
    const birth = data.format("YYYY-MM-DD");
    updateStuForm.setFieldsValue({
      birth: birth,
    });
  }, []);

  const stuDateChangeHandler = useCallback(
    (data, data2) => {
      setStuChangeDate(data);
    },
    [stuChangeDetail]
  );

  const onClicStuHandler = useCallback(() => {
    if (moment(stuChangeDate) < moment(stuChangeDetail.createdAt)) {
      return message.error("만기일은 시작일보다 과거일 수 없습니다.");
    }

    dispatch({
      type: PARTICIPANT_UPDATE_REQUEST,
      data: {
        partId: stuChangeDetail.id,
        endDate: stuChangeDate && stuChangeDate.format("YYYY-MM-DD"),
        createdAt:
          stuChangeDetail &&
          moment(stuChangeDetail.createdAt, "YYYY-MM-DD").format("YYYY-MM-DD"),
      },
    });
    setStuChangeDate(null);
    setStuDetail(null);
    setStuChangeModal(false);
  }, [stuChangeDetail, stuChangeDate]);

  const onStuFill = useCallback(
    (data) => {
      if (data) {
        updateStuForm.setFieldsValue({
          sns: data.sns,
          snsId: data.snsId,
          birth: data.birth.slice(0, 10),
          mobile: data.mobile,
          password: data.mobile,
          stuLiveCon: data.stuLiveCon,
          stuCountry: data.stuCountry,
          stuLanguage: data.stuLanguage,
          stuPayCount: data.stuPayCount,
        });
      }
    },
    [stuChangeDetail]
  );

  const onSubmitPriceUpdate = useCallback((data) => {
    dispatch({
      type: PRICE_UPDATE_REQUEST,
      data: {
        price: data.price,
      },
    });
  }, []);
  ////// TOGGLE //////

  const noticeToggle = useCallback((data) => {
    setNoticeModal((prev) => !prev);
    setNoticeDetail(data);
  }, []);

  const messageToggle = useCallback((data) => {
    setMessageModal((prev) => !prev);
    setMessageDetail(data);
  }, []);

  const detailModalOpen = useCallback((data) => {
    dispatch({
      type: PARTICIPANT_USER_DELETE_LIST_REQUEST,
      data: {
        UserId: data.UserId,
        isDelete: "1",
        isChange: "0",
      },
    });

    dispatch({
      type: PARTICIPANT_USER_MOVE_LIST_REQUEST,
      data: {
        UserId: data.UserId,
        isDelete: "0",
        isChange: "1",
      },
    });
    dispatch({
      type: PARTICIPANT_USER_CURRENT_LIST_REQUEST,
      data: {
        UserId: data.UserId,
        isDelete: "0",
        isChange: "0",
      },
    });

    dispatch({
      type: PARTICIPANT_USER_LIMIT_LIST_REQUEST,
      data: {
        UserId: data.UserId,
      },
    });

    // let save = data.Participants.filter((Datum, idx) => {
    //   return !Datum.isChange && !Datum.isDelete;
    // });

    // setDetailDatum(save);

    setDetailToggle(true);
  }, []);

  const calenderToggle = useCallback(() => {
    setIsCalendar(!isCalendar);
  }, [isCalendar]);

  const classPartDetailModalOpen = useCallback((data) => {
    setStuDetail(data);

    dispatch({
      type: APP_DETAIL_REQUEST,
      data: {
        email: data.email,
      },
    });

    setStuDetailModal(true);
    onStuFill(data);
  }, []);

  const changeModalOpen = useCallback((data) => {
    setStuChangeModal(true);
    setStuChangeDetail(data);
  }, []);

  const priceChangeModalToggle = useCallback((data) => {
    setPriceChangeModal((prev) => !prev);
    setPriceChangeDetail(data);

    setTimeout(() => {
      priceForm.setFieldsValue({
        price: data,
      });
    }, 500);
  }, []);

  const changeModalClose = useCallback(() => {
    setStuChangeModal(false);
    setStuChangeDetail(null);
    setStuChangeDate("");
  }, []);

  const memoCreateToggle = useCallback(
    (data, create) => {
      setMemoUpdateData(data);
      if (memoCreateModal) {
        setMemoCreateModal(false);
        updateMemoForm.resetFields();
        createMemoForm.resetFields();
      } else {
        setMemoCreateModal(true);
        if (data) {
          setTimeout(() => {
            updateMemoForm.setFieldsValue({
              title: data.title,
              content: data.content,
            });
          }, 500);
        }
      }
    },
    [memoCreateModal, memoUpdateData]
  );
  const memoCreateModalOk = useCallback(() => {
    createMemoForm.submit();
  }, [memoCreateModal]);

  const memoUpdateModalOk = useCallback(() => {
    updateMemoForm.submit();
  }, [memoCreateModal]);

  const memoCreateSubmit = useCallback(
    (data) => {
      dispatch({
        type: LECTURE_MEMO_CREATE_REQUEST,
        data: {
          title: data.title,
          content: data.content,
          LectureId: router.query.id,
        },
      });
    },
    [router.query]
  );

  const memoUpdateSubmit = useCallback(
    (data) => {
      dispatch({
        type: LECTURE_MEMO_UDPATE_REQUEST,
        data: {
          id: memoUpdateData.id,
          title: data.title,
          content: data.content,
        },
      });
    },
    [memoCreateModal]
  );

  const deleteHandler = useCallback((data) => {
    dispatch({
      type: LECTURE_MEMO_DELETE_REQUEST,
      data: {
        memoId: data.id,
      },
    });
  }, []);
  ////// DATAVIEW //////
  const stuColumns = [
    {
      title: "No",
      dataIndex: "id",
    },
    {
      title: "수강생 이름(출생년도)",
      render: (data) => {
        return `${data.username}(${data.birth.slice(0, 10)})`;
      },
    },
    {
      title: "국가",
      dataIndex: "stuCountry",
    },
    {
      title: "수업료",
      render: (data) => {
        const findData = partAdminList.price.find(
          (value) => value.UserId === data.UserId
        );
        return <Text>{findData ? `$` + findData.price : `-`}</Text>;
      },
    },
    {
      title: "만기일",
      render: (data) => {
        return <Text>{data.endDate}</Text>;
      },
    },
    {
      title: "출석 기록",
      render: (data) => (
        <Button
          size={`small`}
          type={`primary`}
          onClick={() => detailCommutesOpen(data)}
        >
          상세보기
        </Button>
      ),
    },
    {
      title: "메모",
      render: (data) => (
        <Button
          size={`small`}
          type={`primary`}
          onClick={() => detailMemoOpen(data)}
        >
          메모 보기
        </Button>
      ),
    },
    {
      title: "학생 정보 보기",
      render: (data) => (
        <Button
          size={`small`}
          type={`primary`}
          onClick={() =>
            data.level === 5
              ? message.error("개발사는 권한을 수정할 수 없습니다.")
              : classPartDetailModalOpen(data)
          }
        >
          정보 보기
        </Button>
      ),
    },
    {
      title: "강의 내역 보기",
      render: (data) => (
        <Button
          size={`small`}
          type={`primary`}
          onClick={() => detailModalOpen(data)}
        >
          내역 보기
        </Button>
      ),
    },

    {
      title: "만기일 수정",
      render: (data) => (
        <Button
          size={`small`}
          type={`primary`}
          onClick={() => changeModalOpen(data)}
        >
          변경
        </Button>
      ),
    },
    // {
    //   title: "수업료 수정",
    //   render: (data) => {
    //     const findData = partAdminList.price.find(
    //       (value) => value.UserId === data.UserId
    //     );
    //     return (
    //       <Button
    //         size={`small`}
    //         type={`primary`}
    //         onClick={() => findData && priceChangeModalToggle(findData.price)}
    //       >
    //         수정
    //       </Button>
    //     );
    //   },
    // },
  ];
  const stuColumns2 = [
    {
      title: "No",
      dataIndex: "id",
    },
    {
      title: "수강생 이름(출생년도)",
      render: (data) => {
        return `${data.username}(${data.birth.slice(0, 10)})`;
      },
    },
    {
      title: "국가",
      dataIndex: "stuCountry",
    },
    {
      title: "수업료",
      render: (data) => {
        const findData = partAdminList.price.find(
          (value) => value.UserId === data.UserId
        );
        return <Text>{findData ? `$` + findData.price : `-`}</Text>;
      },
    },
    {
      title: "만기일",
      render: (data) => {
        return <Text>{data.endDate}</Text>;
      },
    },
    {
      title: "출석 기록",
      render: (data) => (
        <Button
          size={`small`}
          type={`primary`}
          onClick={() => detailCommutesOpen(data)}
        >
          상세보기
        </Button>
      ),
    },
    {
      title: "메모",
      render: (data) => (
        <Button
          size={`small`}
          type={`primary`}
          onClick={() => detailMemoOpen(data)}
        >
          메모 보기
        </Button>
      ),
    },
    {
      title: "학생 정보 보기",
      render: (data) => (
        <Button
          size={`small`}
          type={`primary`}
          onClick={() =>
            data.level === 5
              ? message.error("개발사는 권한을 수정할 수 없습니다.")
              : classPartDetailModalOpen(data)
          }
        >
          정보 보기
        </Button>
      ),
    },
    {
      title: "강의 내역 보기",
      render: (data) => (
        <Button
          size={`small`}
          type={`primary`}
          onClick={() => detailModalOpen(data)}
        >
          내역 보기
        </Button>
      ),
    },

    {
      title: "만기일 수정",
      render: (data) => (
        <Button
          size={`small`}
          type={`primary`}
          onClick={() => changeModalOpen(data)}
        >
          변경
        </Button>
      ),
    },
    // {
    //   title: "수업료 수정",
    //   render: (data) => {
    //     const findData = partAdminList.price.find(
    //       (value) => value.UserId === data.UserId
    //     );
    //     return (
    //       <Button
    //         size={`small`}
    //         type={`primary`}
    //         onClick={() => findData && priceChangeModalToggle(findData.price)}
    //       >
    //         수정
    //       </Button>
    //     );
    //   },
    // },
  ];

  const lectureColumns = [
    {
      title: "번호",
      dataIndex: "id",
    },
    {
      title: "날짜",
      render: (data) => data.createdAt.slice(0, 10),
    },
    {
      title: "강사명",
      dataIndex: "author",
    },
    {
      title: "진도",
      dataIndex: "process",
    },
    {
      title: "수업메모",
      render: (data) => (
        <Button
          size={`small`}
          type={`primary`}
          onClick={() => lecMemoOpen(data)}
        >
          메모 보기
        </Button>
      ),
    },
  ];

  const memoColumns = [
    {
      title: "번호",
      dataIndex: "id",
    },
    {
      title: "제목",

      render: (data) => (
        <Text width={`300px`} isEllipsis>
          {data.title}
        </Text>
      ),
    },

    {
      title: "작성일",

      render: (data) => <div>{data.createdAt.slice(0, 15)}</div>,
    },

    {
      title: "수정",

      render: (data) => (
        <Text
          width={`600px`}
          margin={`0 10px 0 0`}
          onClick={() => memoCreateToggle(data)}
          cursor={`pointer`}
          isEllipsis
        >
          {data.content}
        </Text>
      ),
    },
    {
      title: "삭제",

      render: (data) => (
        <Popconfirm
          placement="bottomRight"
          title={`삭제하시겠습니가?`}
          onConfirm={() => deleteHandler(data)}
          okText="Yes"
          cancelText="No"
        >
          <Button size={`small`} type={`danger`}>
            DELETE
          </Button>
        </Popconfirm>
      ),
    },
  ];

  const lectureCommuteColumns = [
    {
      title: "번호",
      dataIndex: "id",
    },
    {
      title: "학생이름(생년월일)",
      render: (data) => {
        return <div>{`${data.username}(${data.birth.slice(0, 10)})`}</div>;
      },
    },
    {
      title: "국적",
      dataIndex: "stuCountry",
    },
    {
      title: "출석일",
      render: (data) => data.time.slice(0, 10),
    },
    {
      title: "출석 여부",
      dataIndex: "status",
    },
  ];

  const bookColumns = [
    {
      title: "번호",
      dataIndex: "id",
    },
    {
      title: "썸네일 이미지",
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
    {
      title: "첨부파일 다운로드",
      render: (data) => {
        return (
          <Button
            type={`primary`}
            size={`small`}
            onClick={() => fileDownloadHandler(data.file)}
          >
            다운로드
          </Button>
        );
      },
    },
  ];

  const memoListColumns = [
    {
      title: "번호",
      dataIndex: "id",
    },
    {
      title: "작성일",
      render: (data) => <Text>{data.createdAt.slice(0, 13)}</Text>,
    },
    {
      title: "메모 보기",
      render: (data) => {
        return (
          <Button
            type={`primary`}
            size={`small`}
            onClick={() => detailMemoContentOpen(data)}
          >
            내용 보기
          </Button>
        );
      },
    },
  ];

  const commutesListColumns = [
    {
      title: "번호",
      dataIndex: "id",
    },

    {
      title: "출석일",
      render: (data) => (
        <Text>
          {console.log(data)}
          {data.time}
        </Text>
      ),
    },
    {
      title: "출석 여부",
      render: (data) => {
        return <Text>{data.status}</Text>;
      },
    },
  ];

  const noticeColumns = [
    {
      title: "번호",
      dataIndex: "id",
    },
    {
      title: "제목",
      dataIndex: "title",
    },
    {
      title: "작성자",
      dataIndex: "author",
    },
    {
      title: "작성일",
      render: (data) => <div>{data.createdAt.substring(0, 13)}</div>,
    },
    {
      title: "상세보기",
      render: (data) => (
        <Button
          type="primary"
          size={`small`}
          onClick={() => noticeToggle(data)}
        >
          상세보기
        </Button>
      ),
    },
  ];

  const messageColumns = [
    {
      title: "번호",
      dataIndex: "id",
    },
    {
      title: "제목",
      dataIndex: "title",
    },

    {
      title: "작성자",
      dataIndex: "author",
    },

    {
      title: "생성일",
      render: (data) => <div>{data.createdAt.substring(0, 10)}</div>,
    },

    {
      title: "상세보기",
      render: (data) => (
        <Button type="primary" size="small" onClick={() => messageToggle(data)}>
          상세보기
        </Button>
      ),
    },
  ];

  // // // // //
  const columnsList = [
    {
      title: "No",
      dataIndex: "id",
    },

    {
      title: "수업 이름",
      render: (data) => <div>{data.course}</div>,
    },

    {
      title: "요일",
      render: (data) => <div>{data.day}</div>,
    },

    {
      title: "시간",
      render: (data) => <div>{data.time}</div>,
    },

    {
      title: "수업 참여일",
      render: (data) => <div>{data.createdAt.slice(0, 10)}</div>,
    },

    {
      title: "수업 종료일",
      render: (data) => <div>{data.endDate}</div>,
    },
  ];

  const columnsMove = [
    {
      title: "No",
      dataIndex: "id",
    },

    {
      title: "수업 이름",
      render: (data) => <div>{data.course}</div>,
    },

    {
      title: "요일",
      render: (data) => <div>{data.day}</div>,
    },

    {
      title: "시간",
      render: (data) => <div>{data.time}</div>,
    },

    {
      title: "수업 참여일",
      render: (data) => (
        <div>
          {moment(data.endDate)
            .add(parseInt(-data.date), "days")
            .format("YYYY-MM-DD")}
        </div>
      ),
    },

    {
      title: "수업 변경일",
      render: (data) => <div>{data.updatedAt.slice(0, 10)}</div>,
    },
  ];

  const columnsEnd = [
    {
      title: "No",
      dataIndex: "id",
    },

    {
      title: "수업 이름",
      render: (data) => <div>{data.course}</div>,
    },

    {
      title: "요일",
      render: (data) => <div>{data.day}</div>,
    },

    {
      title: "시간",
      render: (data) => <div>{data.time}</div>,
    },

    {
      title: "수업 종료일",
      render: (data) => <div>{data.updatedAt.slice(0, 10)}</div>,
    },
  ];

  const columns7End = [
    {
      title: "No",
      dataIndex: "id",
    },

    {
      title: "수업 이름",
      render: (data) => <div>{data.course}</div>,
    },

    {
      title: "요일",
      render: (data) => <div>{data.day}</div>,
    },

    {
      title: "시간",
      render: (data) => <div>{data.time}</div>,
    },

    {
      title: "수업 남은 날",
      render: (data) => (
        <div style={{ color: Theme.red_C }}>
          {data.limitDate < 0
            ? `D+${Math.abs(data.limitDate)}`
            : data.limitDate === 0
            ? `D-day`
            : `D-${data.limitDate}`}
        </div>
      ),
    },
  ];

  const country = [
    "S. Korea",
    "USA",
    "Australia",
    "Canada",
    "China",
    "Finland",
    "France",
    "Germany",
    "Ireland",
    "Italy",
    "Japan",
    "Malaysia",
    "Netherland",
    "Poland",
    "S. Africa",
    "Singapore",
    "Spain",
    "Sweden",
    "Switzland",
    "Taiwan",
    "U.K.",

    //
    "Afghanistan",
    "Albania",
    "Algeria",
    "Andorra",
    "Angola",
    "Anguilla",
    "Antigua and Barbuda",
    "Argentina",
    "Armenia",
    "Aruba",
    "Austria",
    "Azerbaijan",
    "Bahamas",
    "Bahrain",
    "Bailiwick of Guernsey",
    "Bailiwick of Jersey",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bermuda",
    "Bhutan",
    "Bolivia",
    "Bosnia-Herzegovina",
    "Botswana",
    "Brazil",
    "British Antarctic Territory",
    "British Indian Ocean Territory",
    "British Virgin Islands",
    "Brunei",
    "Bulgaria",
    "Burkina Faso",
    "Burundi",
    "C.te D'Ivoire",
    "Cambodia",
    "Cameroon",
    "Cape Verde",
    "Cayman Islands",
    "Central African Republic",
    "Chad",
    "Chile",
    "Colombia",
    "Comoros",
    "Congo",
    "Cook Islands",
    "Costa Rica",
    "Croatia",
    "Cuba",
    "Cyprus",
    "Czech",
    "Democratic Republic of Congo",
    "Denmark",
    "Djibouti",
    "Dominica",
    "Dominican Republic",
    "Ecuador",
    "Egypt",
    "El Salvador",
    "Equatorial Guinea",
    "Eritrea",
    "Estonia",
    "Eswatini",
    "Ethiopia",
    "Federated States of Micronesia",
    "Fiji",

    "French Guiana",
    "French Polynesia",
    "Gabon",
    "Gambia",
    "Georgia",
    "Ghana",
    "Gibraltar",
    "Greece",
    "Greenland",
    "Grenada",
    "Guadeloupe",
    "Guam",
    "Guatemala",
    "Guinea",
    "Guinea-Bissau",
    "Guyana",
    "Haiti",
    "Honduras",
    "Hongkong",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran",
    "Iraq",
    "Isle of Man",
    "Israel",
    "Jamaica",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kiribati",
    "Kosovo",
    "Kuwait",
    "Kyrgyz",
    "Laos",
    "Latvia",
    "Lebanon",
    "Lesotho",
    "Liberia",
    "Libya",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Macao",
    "Madagascar",
    "Malawi",
    "Maldives",
    "Mali",
    "Malta",
    "Marshall Islands",
    "Martinique",
    "Mauritania",
    "Mauritius",
    "Mayotte",
    "Mazambique",
    "Mexico",
    "Moldova",
    "Monaco",
    "Mongolia",
    "Montenegro",
    "Montserrat",
    "Morocco",
    "Myanmar",
    "Namibia",
    "Nauru",
    "Nepal",
    "Netherlands Antilles",
    "New Caledonia",
    "New Zealand",
    "Nicaragua",
    "Niger",
    "Nigeria",
    "Niue",
    "North Macedonia",
    "Northern Mariana Islands",
    "Norway",
    "Oman",
    "Pakistan",
    "Palau",
    "Palestine",
    "Panama",
    "Papua New Guinea :PNG",
    "Paraguay",
    "Peru",
    "Philippines",
    "Pitcairn Islands",

    "Portugal",
    "Puerto Rico",
    "Qatar",
    "R.union",
    "Romania",
    "Russia",
    "Rwanda",
    "S.o Tom. & Principe",
    "Sahara Arab Democratic Republic",
    "Samoa",
    "San Marino",
    "Saudi Arabia",
    "Senegal",
    "Serbia",
    "Seychelles",
    "Sierra Leone",
    "Slovakia",
    "Slovenia",
    "Solomon Islands",
    "Somalia",
    "South Sudan",

    "Sri Lanka",
    "St Helena",
    "St. Kitts-Nevis",
    "St. Lucia",
    "St. Pierre and Miquelon",
    "St. Vincent & the Grenadines",
    "Sudan",
    "Suriname",

    "Swiss",
    "Syria",

    "Tajikistan",
    "Tanzania",
    "Thailand",
    "Timor-Leste",
    "Togo",
    "Tonga",
    "Trinidad & Tobago",
    "Tunisia",
    "Turkey",
    "Turkmenistan",
    "Turks and Caicos Islands",
    "Tuvalu",
    "Uganda",
    "Ukraine",
    "United Arab Emirates : UAE",

    "Uruguay",
    "Uzbekistan",
    "Vanuatu",
    "Vatican",
    "Venezuela",
    "Vietnam",
    "Wallis and Futuna",
    "Yemen",
    "Zambia",
    "Zimbabwe",
  ];
  return (
    <AdminLayout>
      <PageHeader
        breadcrumbs={["클래스 관리", "클래스 상세보기"]}
        title={`클래스 상세보기`}
        subTitle={`클래스별 상세 설정을 할 수 있습니다.`}
      />

      <AdminContent>
        <Wrapper dr={`row`} ju={`space-between`} margin={`0 0 30px`}>
          <Wrapper dr={`row`} ju={`flex-start`} width={`auto`}>
            <Wrapper width={`auto`} padding={`11px 8px`}>
              <Image
                width={`33px`}
                src="https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_lecture.png"
                alt="lecture_icon"
              />
            </Wrapper>
            <Wrapper width={`auto`} dr={`row`} ju={`flex-start`}>
              <Text fontSize={`24px`} fontWeight={`bold`}>
                {lectureDetail && lectureDetail[0].day}&nbsp;/&nbsp;
                {lectureDetail && lectureDetail[0].time}
              </Text>
              <Text
                fontSize={`16px`}
                color={Theme.grey2_C}
                margin={`0 0 0 15px`}
              >
                NO.{lectureDetail && lectureDetail[0].number}
              </Text>
            </Wrapper>
          </Wrapper>
          <Wrapper dr={`row`} ju={`flex-start`} width={`auto`}>
            <CommonButton
              radius={`5px`}
              width={`130px`}
              margin={`0 6px`}
              kindOf={`white`}
              padding={`0`}
              onClick={() => moveLinkHandler(`/admin`)}
            >
              강의 목록
            </CommonButton>
          </Wrapper>
        </Wrapper>

        <Wrapper
          padding={`40px 30px 35px`}
          dr={`row`}
          ju={`flex-start`}
          al={`flex-start`}
          bgColor={Theme.white_C}
          radius={`10px`}
          shadow={`0px 5px 15px rgba(0, 0, 0, 0.16)`}
          margin={`0 0 32px`}
        >
          <Wrapper width={`auto`} al={`flex-start`}>
            <Wrapper width={`auto`} dr={`row`} ju={`flex-start`}>
              <Wrapper width={`auto`} margin={`0 10px 0 0`} padding={`8px`}>
                <Image
                  width={`18px`}
                  src="https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_calender_b.png"
                  alt="clender_icon"
                />
              </Wrapper>
              <Text fontSize={`18px`}>
                {lectureDetail && lectureDetail[0].startDate.slice(0, 10)}
              </Text>
            </Wrapper>
            <Text padding={`0 0 0 44px`}>
              {lectureDetail && lectureDetail[0].startLv}
            </Text>
          </Wrapper>
          <Wrapper
            width={`auto`}
            dr={`row`}
            ju={`flex-start`}
            margin={`0 100px 0 72px`}
          >
            <Wrapper width={`auto`} margin={`0 10px 0 0`} padding={`8px`}>
              <Image
                width={`18px`}
                src="https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_name_yellow.png"
                alt="name_icon"
              />
            </Wrapper>

            <Text fontSize={`18px`}>
              {lectureDetail && lectureDetail[0].teacherName}&nbsp;/&nbsp;
              {lectureDetail && lectureDetail[0].course}
            </Text>
          </Wrapper>
          <Wrapper width={`auto`} dr={`row`} ju={`flex-start`}>
            <Wrapper width={`auto`} margin={`0 10px 0 0`} padding={`8px`}>
              <Image
                width={`18px`}
                src="https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_book.png"
                alt="book_icon"
              />
            </Wrapper>
            <Text fontSize={`18px`}>
              <Button type={`primary`} size={`small`} onClick={detailBookOpen}>
                교재 리스트
              </Button>
            </Text>
          </Wrapper>

          <Wrapper
            width={`100%`}
            al={`flex-start`}
            fontSize={`16px`}
            margin={`10px 0 0`}
            padding={`0 0 0 44px`}
          >
            <Wrapper dr={`row`} ju={`flex-start`}>
              <Text
                fontWeight={`bold`}
                width={`90px`}
                margin={`0 20px 0 0`}
                color={Theme.black_C}
              >
                ZOOM LINK
              </Text>
              {lectureDetail && lectureDetail[0].zoomLink
                ? lectureDetail[0].zoomLink
                : "-"}
            </Wrapper>
            <Wrapper dr={`row`} ju={`flex-start`}></Wrapper>
          </Wrapper>
        </Wrapper>
        <Wrapper dr={`row`} ju={`flex-start`}>
          <Text fontSize={`18px`} fontWeight={`bold`} margin={`0 10px 0`}>
            수강 학생 목록
          </Text>
          <Button
            size={`small`}
            type={isDelete === `0` && isChange === `0` && `primary`}
            onClick={() => {
              setIsDelete(`0`);
              setIsChange(`0`);
            }}
          >
            현재 수강중인 학생 조회
          </Button>
          &nbsp;
          <Button
            size={`small`}
            type={isDelete === null && isChange === null && `primary`}
            onClick={() => {
              setIsDelete(null);
              setIsChange(null);
            }}
          >
            전체조회
          </Button>
        </Wrapper>

        <Table
          size={`small`}
          columns={
            isChange === null && isDelete === null ? stuColumns : stuColumns2
          }
          dataSource={
            partAdminList &&
            partAdminList.partList &&
            partAdminList.partList.filter((data, idx) => {
              return (
                partAdminList &&
                partAdminList.partList &&
                partAdminList.partList.findIndex((data2, idx2) => {
                  return data.UserId === data2.UserId;
                }) === idx
              );
            })
          }
        />

        <Wrapper dr={`row`} ju={`flex-start`}>
          <Text fontSize={`18px`} fontWeight={`bold`} margin={`0 10px 0 0`}>
            일별 학생 출석 목록
          </Text>
          <DatePicker
            style={{ width: `200px` }}
            onChange={(e) => setTime(e)}
            format={`YYYY-MM-DD`}
          />
        </Wrapper>
        <Table
          size={`small`}
          columns={lectureCommuteColumns}
          dataSource={lectureCommuteList}
        />

        <Text fontSize={`18px`} fontWeight={`bold`}>
          강의 일지
        </Text>

        <Table
          size={`small`}
          columns={lectureColumns}
          dataSource={lectureDiaryAdminList}
        />

        <Wrapper width={`100%`} al={`flex-start`}>
          <Text fontSize={`18px`} fontWeight={`bold`}>
            게시판
          </Text>

          <ClassNotice />
        </Wrapper>

        <Wrapper dr={`row`} ju={`flex-start`}>
          <Text fontSize={`18px`} fontWeight={`bold`}>
            강의 메모
          </Text>
          &nbsp; &nbsp;
          <Button
            size={`small`}
            type={`primary`}
            onClick={() => memoCreateToggle(null, "create")}
          >
            메모 작성
          </Button>
        </Wrapper>

        <Table
          size={`small`}
          columns={memoColumns}
          dataSource={lectureMemoList}
        />
      </AdminContent>

      <Modal
        visible={memoModal}
        footer={null}
        onCancel={detailMemoClose}
        title={`메모`}
      >
        <Wrapper al={`flex-start`}>
          <Table
            style={{ width: `100%` }}
            size={`small`}
            columns={memoListColumns}
            dataSource={lectureMemoStuList}
            pagination={{
              current: parseInt(currentPage),
              total: lectureMemoStuLastPage * 10,
              onChange: (page) => setCurrentPage(page),
            }}
          />
        </Wrapper>
      </Modal>

      <Modal
        visible={commutesModal}
        footer={null}
        onCancel={detailCommutesClose}
        title="출석기록"
      >
        <Wrapper al={`flex-start`}>
          <Table
            style={{ width: `100%` }}
            size={`small`}
            columns={commutesListColumns}
            dataSource={commuteAdminList}
          />

          {/* <Table
              style={{ width: `100%` }}
              size={`small`}
              columns={commutesListColumns}
              dataSource={commuteAdminList}
              pagination={{
                current: parseInt(currentPage),
                total: lectureMemoStuLastPage * 10,
                onChange: (page) => setCurrentPage(page),
              }}
            /> */}
        </Wrapper>
      </Modal>

      <Modal
        visible={detailMemoModal}
        footer={null}
        onCancel={detailMemoContentClose}
        width={800}
        title={`메모 내용`}
      >
        <Wrapper al={`flex-start`}>
          <Text margin={`0 0 20px`} fontSize={`18px`} fontWeight={`700`}>
            {detailMemo && detailMemo.username} &nbsp;| &nbsp;
            {detailMemo && detailMemo.createdAt.slice(0, 13)}
          </Text>
          <Wrapper al={`flex-start`} ju={`flex-start`} height={`500px`}>
            {detailMemo &&
              detailMemo.memo.split(`\n`).map((data, idx) => (
                <SpanText key={data.id}>
                  {data}
                  <br />
                </SpanText>
              ))}
          </Wrapper>
        </Wrapper>
      </Modal>

      <Modal
        visible={lecModal}
        footer={null}
        onCancel={lecMemoClose}
        width={600}
        title={`메모 내용`}
      >
        <Wrapper al={`flex-start`}>
          <Text margin={`0 0 20px`} fontSize={`18px`} fontWeight={`700`}>
            {lecMemoData && lecMemoData.createdAt.slice(0, 10)}
          </Text>
          <Wrapper al={`flex-start`} ju={`flex-start`} minHeight={`300px`}>
            {lecMemoData &&
              lecMemoData.lectureMemo.split(`\n`).map((data, idx) => (
                <SpanText key={data.id}>
                  {data}
                  <br />
                </SpanText>
              ))}
          </Wrapper>
        </Wrapper>
      </Modal>

      <Modal
        visible={bookModal}
        footer={null}
        onCancel={detailBookClose}
        width={width < 700 ? `80%` : 700}
      >
        <Wrapper al={`flex-start`}>
          <Text margin={`0 0 20px`} fontSize={`18px`} fontWeight={`700`}>
            교재
          </Text>
          <Wrapper al={`flex-start`} ju={`flex-start`}>
            <Table
              style={{ width: `100%` }}
              size={`small`}
              columns={bookColumns}
              dataSource={bookList}
              pagination={{
                pageSize: 12,
                total: bookMaxLength * 12,
                onChange: (page) => setCurrentBookPage(page),
                pageSize: 12,
              }}
            />
          </Wrapper>
        </Wrapper>
      </Modal>

      <Modal
        visible={noticeModal}
        onCancel={() => noticeToggle(null)}
        footer={null}
        title={`게시글 자세히 보기`}
      >
        <Wrapper al={`flex-start`}>
          <Wrapper dr={`row`} ju={`flex-start`}>
            <Text fontWeight={`700`}>작성일 : </Text>
            <Text>{noticeDetail && noticeDetail.createdAt.slice(0, 13)}</Text>
          </Wrapper>

          <Wrapper dr={`row`} ju={`flex-start`}>
            <Text fontWeight={`700`}>제목 : </Text>
            <Text>{noticeDetail && noticeDetail.title}</Text>
          </Wrapper>

          <Wrapper dr={`row`} ju={`flex-start`}>
            <Text fontWeight={`700`}>작성자 : </Text>
            <Text>{noticeDetail && noticeDetail.author}</Text>
          </Wrapper>

          <Wrapper dr={`row`} ju={`flex-start`}>
            <Text fontWeight={`700`}>내용</Text>
            <Wrapper al={`flex-start`} ju={`flex-start`}>
              <Text
                dangerouslySetInnerHTML={{
                  __html: noticeDetail && noticeDetail.content,
                }}
              ></Text>
            </Wrapper>
          </Wrapper>
        </Wrapper>
      </Modal>

      <Modal
        visible={messageModal}
        onCancel={() => messageToggle(null)}
        footer={null}
        title={`쪽지 자세히 보기`}
      >
        <Wrapper al={`flex-start`}>
          <Wrapper dr={`row`} ju={`flex-start`}>
            <Text fontWeight={`700`}>작성일 : </Text>
            <Text>{messageDetail && messageDetail.createdAt.slice(0, 13)}</Text>
          </Wrapper>

          <Wrapper dr={`row`} ju={`flex-start`}>
            <Text fontWeight={`700`}>제목 : </Text>
            <Text>{messageDetail && messageDetail.title}</Text>
          </Wrapper>

          <Wrapper dr={`row`} ju={`flex-start`}>
            <Text fontWeight={`700`}>작성자 : </Text>
            <Text>{messageDetail && messageDetail.author}</Text>
          </Wrapper>

          <Wrapper dr={`row`} ju={`flex-start`}>
            <Text fontWeight={`700`}>내용</Text>
            <Wrapper al={`flex-start`} ju={`flex-start`}>
              <Text
                dangerouslySetInnerHTML={{
                  __html: messageDetail && messageDetail.content,
                }}
              ></Text>
            </Wrapper>
          </Wrapper>
        </Wrapper>
      </Modal>
      {/* 강의 내역 */}

      <Modal
        visible={detailToggle}
        width={`80%`}
        title={`학생 강의 목록`}
        footer={null}
        onCancel={() => setDetailToggle(false)}
      >
        <Text
          padding={`16px 0px`}
          color={Theme.black_2C}
          fontSize={`16px`}
          fontWeight={`500`}
        >
          참여하고 있는 강의
          <SpanText color={Theme.red_C} fontSize={`14px`} margin={`0 0 0 10px`}>
            *수업 참여일:관리자가 학생의 수업을 참여시킨 날짜
          </SpanText>
        </Text>
        <Table
          rowKey="id"
          columns={columnsList}
          dataSource={partUserCurrentList}
          size="small"
        />

        <Text
          padding={`16px 0px`}
          color={Theme.black_2C}
          fontSize={`16px`}
          fontWeight={`500`}
        >
          반 이동 내역
          <SpanText color={Theme.red_C} fontSize={`14px`} margin={`0 0 0 10px`}>
            *수업 변경일:관리자가 학생의 수업을 변경시킨 날짜
          </SpanText>
        </Text>

        <Table
          rowKey="id"
          columns={columnsMove}
          dataSource={st_participantUserMoveListDone ? partUserMoveList : []}
          size="small"
        />
        <Text
          padding={`16px 0px`}
          color={Theme.black_2C}
          fontSize={`16px`}
          fontWeight={`500`}
        >
          종료된 강의 내역
          <SpanText color={Theme.red_C} fontSize={`14px`} margin={`0 0 0 10px`}>
            *수업 종료일:관리자가 학생의 수업을 종료시킨 날짜
          </SpanText>
        </Text>
        <Table
          rowKey="id"
          columns={columnsEnd}
          dataSource={
            st_participantUserDeleteListDone ? partUserDeleteList : []
          }
          size="small"
        />

        <Text
          padding={`16px 0px`}
          color={Theme.black_2C}
          fontSize={`16px`}
          fontWeight={`500`}
        >
          일주일 이하로 남은 강의
          <SpanText color={Theme.red_C} fontSize={`14px`} margin={`0 0 0 10px`}>
            *수업 7일 이하:학생의 수업 7일 이하 남은 강의
          </SpanText>
        </Text>
        <Table
          rowKey="id"
          columns={columns7End}
          dataSource={st_participantUserLimitListDone ? partUserLimitList : []}
          size="small"
        />
      </Modal>

      {/* 학생 정보 */}
      <Modal
        visible={stuDetailModal}
        width={`1000px`}
        title={`학생 정보`}
        onCancel={() => setStuDetailModal(false)}
        footer={null}
      >
        <CustomForm form={updateStuForm} onFinish={updateStuFinish}>
          <Wrapper al={`flex-start`} ju={`flex-start`} margin={`0 0 50px`}>
            <Text fontSize={`16px`} fontWeight={`700`} margin={`0 0 10px`}>
              사용자 정보
            </Text>
            <Wrapper dr={`row`} al={`flex-start`}>
              <Wrapper width={`50%`} margin={`0 0 20px`}>
                <RowWrapper width={`100%`} margin={`0 0 10px`}>
                  <ColWrapper
                    width={`120px`}
                    height={`30px`}
                    bgColor={Theme.basicTheme_C}
                    color={Theme.white_C}
                    margin={`0 5px 0 0`}
                  >
                    프로필 이미지
                  </ColWrapper>
                  <ColWrapper>
                    <Wrapper
                      width={`100px`}
                      height={`100px`}
                      margin={`0 0 10px`}
                      radius={`50%`}
                    >
                      <Image
                        radius={`50%`}
                        src={
                          stuDetail
                            ? `${stuDetail && stuDetail.profileImage}`
                            : `https://via.placeholder.com/100x100`
                        }
                      />
                    </Wrapper>
                  </ColWrapper>
                </RowWrapper>

                <RowWrapper width={`100%`} margin={`0 0 10px`}>
                  <ColWrapper
                    width={`120px`}
                    height={`30px`}
                    bgColor={Theme.basicTheme_C}
                    color={Theme.white_C}
                    margin={`0 5px 0 0`}
                  >
                    이름
                  </ColWrapper>
                  <ColWrapper>
                    {stuDetail && stuDetail.username}&nbsp;
                    {stuDetail && stuDetail.lastName}
                  </ColWrapper>
                </RowWrapper>

                <RowWrapper width={`100%`} margin={`0 0 10px`}>
                  <ColWrapper
                    width={`120px`}
                    height={`30px`}
                    bgColor={Theme.basicTheme_C}
                    color={Theme.white_C}
                    margin={`0 5px 0 0`}
                  >
                    아이디
                  </ColWrapper>
                  <ColWrapper>{stuDetail && stuDetail.userId}</ColWrapper>
                </RowWrapper>

                <RowWrapper width={`100%`} margin={`0 0 10px`}>
                  <ColWrapper
                    width={`120px`}
                    height={`30px`}
                    bgColor={Theme.basicTheme_C}
                    color={Theme.white_C}
                    margin={`0 5px 0 0`}
                  >
                    이메일
                  </ColWrapper>
                  <ColWrapper>{stuDetail && stuDetail.email}</ColWrapper>
                </RowWrapper>

                <RowWrapper width={`100%`} margin={`0 0 10px`}>
                  <ColWrapper
                    width={`120px`}
                    height={`30px`}
                    bgColor={Theme.basicTheme_C}
                    color={Theme.white_C}
                    margin={`0 5px 0 0`}
                  >
                    휴대폰 번호
                  </ColWrapper>
                  <ColWrapper>
                    <FormItem name="mobile">
                      <CustomInput
                        onChange={(e) =>
                          updateStuForm.setFieldsValue({
                            password: e.target.value.slice(-4),
                          })
                        }
                      />
                    </FormItem>
                  </ColWrapper>
                </RowWrapper>

                <RowWrapper width={`100%`} margin={`0 0 10px`}>
                  <ColWrapper
                    width={`120px`}
                    height={`30px`}
                    bgColor={Theme.basicTheme_C}
                    color={Theme.white_C}
                    margin={`0 5px 0 0`}
                  >
                    비밀번호
                  </ColWrapper>

                  <ColWrapper>
                    <FormItem name="password">
                      <CustomInput disabled />
                    </FormItem>
                  </ColWrapper>
                </RowWrapper>

                <RowWrapper width={`100%`} margin={`0 0 10px`}>
                  <ColWrapper
                    width={`120px`}
                    height={`30px`}
                    bgColor={Theme.basicTheme_C}
                    color={Theme.white_C}
                    margin={`0 5px 0 0`}
                  >
                    생년월일
                  </ColWrapper>

                  <ColWrapper dr={`row`}>
                    <FormItem name="birth">
                      <CustomInput disabled />
                    </FormItem>

                    <CalendarOutlined onClick={calenderToggle} />
                  </ColWrapper>
                </RowWrapper>

                <RowWrapper width={`100%`} margin={`0 0 10px`}>
                  <Wrapper
                    display={isCalendar ? "flex" : "none"}
                    width={`auto`}
                    border={`1px solid ${Theme.grey_C}`}
                    margin={`0 0 20px`}
                  >
                    <Calendar
                      style={{ width: width < 1350 ? `100%` : `300px` }}
                      fullscreen={false}
                      validRange={[moment(`1940`), moment()]}
                      onChange={dateChagneHandler}
                    />
                  </Wrapper>
                </RowWrapper>

                <RowWrapper width={`100%`} margin={`0 0 10px`}>
                  <ColWrapper
                    width={`120px`}
                    height={`30px`}
                    bgColor={Theme.basicTheme_C}
                    color={Theme.white_C}
                    margin={`0 5px 0 0`}
                  >
                    국가
                  </ColWrapper>

                  <ColWrapper>
                    <FormItem name="stuCountry">
                      <CustomSelect>
                        {country &&
                          country.map((data, idx) => {
                            return (
                              <Select.Option key={data.id} value={data}>
                                {data}
                              </Select.Option>
                            );
                          })}
                      </CustomSelect>
                    </FormItem>
                  </ColWrapper>
                </RowWrapper>

                <RowWrapper width={`100%`} margin={`0 0 10px`}>
                  <ColWrapper
                    width={`120px`}
                    height={`30px`}
                    bgColor={Theme.basicTheme_C}
                    color={Theme.white_C}
                    margin={`0 5px 0 0`}
                  >
                    거주 국가
                  </ColWrapper>

                  <ColWrapper>
                    <FormItem name="stuLiveCon">
                      <CustomSelect>
                        {country &&
                          country.map((data, idx) => {
                            return (
                              <Select.Option key={data.id} value={data}>
                                {data}
                              </Select.Option>
                            );
                          })}
                      </CustomSelect>
                    </FormItem>
                  </ColWrapper>
                </RowWrapper>

                <RowWrapper width={`100%`} margin={`0 0 10px`}>
                  <ColWrapper
                    width={`120px`}
                    height={`30px`}
                    bgColor={Theme.basicTheme_C}
                    color={Theme.white_C}
                    margin={`0 5px 0 0`}
                  >
                    사용언어
                  </ColWrapper>

                  <ColWrapper>
                    <FormItem name="stuLanguage">
                      <CustomInput />
                    </FormItem>
                  </ColWrapper>
                </RowWrapper>

                <RowWrapper width={`100%`} margin={`0 0 10px`}>
                  <ColWrapper
                    width={`120px`}
                    height={`30px`}
                    bgColor={Theme.basicTheme_C}
                    color={Theme.white_C}
                    margin={`0 5px 0 0`}
                  >
                    SNS
                  </ColWrapper>

                  <ColWrapper>
                    <FormItem name="sns">
                      <CustomInput />
                    </FormItem>
                  </ColWrapper>
                </RowWrapper>

                <RowWrapper width={`100%`} margin={`0 0 10px`}>
                  <ColWrapper
                    width={`120px`}
                    height={`30px`}
                    bgColor={Theme.basicTheme_C}
                    color={Theme.white_C}
                    margin={`0 5px 0 0`}
                  >
                    SNS Id
                  </ColWrapper>

                  <ColWrapper>
                    <FormItem name="snsId">
                      <CustomInput />
                    </FormItem>
                  </ColWrapper>
                </RowWrapper>

                <RowWrapper width={`100%`} margin={`0 0 10px`}>
                  <ColWrapper
                    width={`120px`}
                    height={`30px`}
                    bgColor={Theme.basicTheme_C}
                    color={Theme.white_C}
                    margin={`0 5px 0 0`}
                  >
                    회차
                  </ColWrapper>

                  <ColWrapper>
                    <FormItem name="stuPayCount">
                      <CustomInput />
                    </FormItem>
                  </ColWrapper>
                </RowWrapper>
              </Wrapper>

              <Wrapper width={`50%`} margin={`0 0 20px`} al={`flex-start`}>
                <Wrapper>
                  <RowWrapper
                    dr={`row`}
                    margin={`0 0 10px 0`}
                    ju={`flex-start`}
                    al={`flex-start`}
                  >
                    <ColWrapper
                      width={`140px`}
                      height={`30px`}
                      bgColor={Theme.basicTheme_C}
                      color={Theme.white_C}
                      margin={`0 5px 0 0`}
                    >
                      시차
                    </ColWrapper>

                    <FormItem name="timeDiff">
                      <CustomInput />
                    </FormItem>
                  </RowWrapper>

                  <RowWrapper
                    width={`100%`}
                    al={`flex-start`}
                    margin={`0 0 10px 0`}
                  >
                    <ColWrapper
                      width={`140px`}
                      height={`30px`}
                      bgColor={Theme.basicTheme_C}
                      color={Theme.white_C}
                      margin={`0 5px 0 0`}
                    >
                      원하는 시작 날짜
                    </ColWrapper>
                    <ColWrapper>
                      <FormItem name="wantStartDate">
                        <CustomDatePicker />
                      </FormItem>
                    </ColWrapper>
                  </RowWrapper>

                  <RowWrapper
                    width={`100%`}
                    al={`flex-start`}
                    margin={`0 0 10px 0`}
                  >
                    <ColWrapper
                      width={`140px`}
                      height={`30px`}
                      bgColor={Theme.basicTheme_C}
                      color={Theme.white_C}
                      margin={`0 5px 0 0`}
                    >
                      무료수업 담당 강사
                    </ColWrapper>
                    <ColWrapper>
                      <FormItem name="freeTeacher">
                        <Select
                          style={{ width: `250px` }}
                          placeholder={`강사를 선택해주세요.`}
                        >
                          {teachers &&
                            teachers.map((data, idx) => {
                              return (
                                <Select.Option
                                  key={data.id}
                                  value={data.username}
                                >
                                  {data.username}
                                </Select.Option>
                              );
                            })}
                        </Select>
                      </FormItem>
                    </ColWrapper>
                  </RowWrapper>

                  <RowWrapper
                    width={`100%`}
                    al={`flex-start`}
                    margin={`0 0 10px 0`}
                  >
                    <ColWrapper
                      width={`140px`}
                      height={`30px`}
                      bgColor={Theme.basicTheme_C}
                      color={Theme.white_C}
                      margin={`0 5px 0 0`}
                    >
                      담당 강사
                    </ColWrapper>
                    <ColWrapper>
                      <FormItem name="teacher">
                        <Select
                          style={{ width: `250px` }}
                          placeholder={`강사를 선택해주세요.`}
                        >
                          {teachers &&
                            teachers.map((data, idx) => {
                              return (
                                <Select.Option
                                  key={data.id}
                                  value={data.username}
                                >
                                  {data.username}
                                </Select.Option>
                              );
                            })}
                        </Select>
                      </FormItem>
                    </ColWrapper>
                  </RowWrapper>

                  {/* <RowWrapper width={`100%`} al={`flex-start`}>
                    <ColWrapper
                      width={`140px`}
                      height={`30px`}
                      bgColor={Theme.basicTheme_C}
                      color={Theme.white_C}
                      margin={`0 5px 0 0`}>
                      할인 여부
                    </ColWrapper>
                    <ColWrapper>
                      <FormItem name="isDiscount"></FormItem>
                    </ColWrapper>
                  </RowWrapper> */}

                  <RowWrapper
                    width={`100%`}
                    al={`flex-start`}
                    margin={`0 0 10px 0`}
                  >
                    <ColWrapper
                      width={`140px`}
                      height={`30px`}
                      bgColor={Theme.basicTheme_C}
                      color={Theme.white_C}
                      margin={`0 5px 0 0`}
                    >
                      줌 미팅 시간
                    </ColWrapper>
                    <ColWrapper>
                      <FormItem name="meetDate">
                        <CustomDatePicker
                          showTime={{ format: "HH:mm", minuteStep: 10 }}
                          format="YYYY-MM-DD HH:mm"
                        />
                      </FormItem>
                    </ColWrapper>
                  </RowWrapper>

                  <RowWrapper
                    width={`100%`}
                    al={`flex-start`}
                    margin={`0 0 10px 0`}
                  >
                    <ColWrapper
                      width={`140px`}
                      height={`30px`}
                      bgColor={Theme.basicTheme_C}
                      color={Theme.white_C}
                      margin={`0 5px 0 0`}
                    >
                      레벨
                    </ColWrapper>

                    <FormItem name="level">
                      <CustomInput />
                    </FormItem>
                  </RowWrapper>

                  <RowWrapper
                    width={`100%`}
                    al={`flex-start`}
                    margin={`0 0 10px 0`}
                  >
                    <ColWrapper
                      width={`140px`}
                      height={`30px`}
                      bgColor={Theme.basicTheme_C}
                      color={Theme.white_C}
                      margin={`0 5px 0 0`}
                    >
                      가능한 수업시간
                    </ColWrapper>

                    <FormItem name="classHour">
                      <CustomTextArea rows={4} />
                    </FormItem>
                  </RowWrapper>

                  <RowWrapper al={`flex-start`}>
                    <ColWrapper
                      width={`140px`}
                      height={`30px`}
                      bgColor={Theme.basicTheme_C}
                      color={Theme.white_C}
                      margin={`0 5px 0 0`}
                    >
                      메모
                    </ColWrapper>
                    <ColWrapper al={`flex-start`}>
                      <FormItem name="purpose">
                        <CustomTextArea
                          rows={6}
                          border={`1px solid ${Theme.grey_C} !important`}
                        />
                      </FormItem>
                    </ColWrapper>
                  </RowWrapper>
                </Wrapper>

                {/* <RowWrapper width={`100%`} margin={`0 0 10px`}>
                  <ColWrapper
                    width={`120px`}
                    height={`30px`}
                    bgColor={Theme.basicTheme_C}
                    color={Theme.white_C}
                    margin={`0 5px 0 0`}>
                    회차
                  </ColWrapper>

                  <ColWrapper>
                    <FormItem name="stuPayCount">
                      <CustomInput />
                    </FormItem>
                  </ColWrapper>
                </RowWrapper> */}
              </Wrapper>
            </Wrapper>

            <Text color={Theme.red_C}>
              * 이메일 수정 하고싶으면 개발사로 문의해주세요.
            </Text>
          </Wrapper>

          <ColWrapper width={`100%`}>
            <Wrapper dr={`row`} ju={`flex-end`}>
              <Button
                size={`small`}
                onClick={() => setStuDetailModal(false)}
                style={{ marginRight: 10 }}
              >
                취소
              </Button>

              <Button size={`small`} type="primary" htmlType="submit">
                수정
              </Button>
            </Wrapper>
          </ColWrapper>
        </CustomForm>
      </Modal>

      <Modal
        width={`600px`}
        visible={stuChangeModal}
        footer={null}
        onCancel={changeModalClose}
      >
        <Wrapper al={`flex-start`} ju={`flex-start`}>
          <Text margin={`0 0 20px`} fontSize={`18px`} fontWeight={`700`}>
            만기일 수정
          </Text>
          <Wrapper dr={`row`} ju={`flex-start`}>
            <Text>
              시작일:&nbsp;
              {stuChangeDetail &&
                moment(stuChangeDetail.createdAt, `YYYY-MM-DD`).format(
                  `YYYY-MM-DD`
                )}
            </Text>
            &nbsp; &nbsp; &nbsp;
            <Text>
              만기일:&nbsp;
              <DatePicker
                value={
                  stuChangeDate
                    ? stuChangeDate
                    : stuChangeDetail &&
                      moment(stuChangeDetail.endDate, `YYYY-MM-DD`)
                }
                placeholder={"변경할 만기일"}
                onChange={(e) => stuDateChangeHandler(e)}
                allowClear={false}
              />
            </Text>
          </Wrapper>
        </Wrapper>

        <Wrapper al={`flex-end`}>
          <Button type="primary" onClick={onClicStuHandler}>
            변경
          </Button>
        </Wrapper>
      </Modal>

      <Modal
        width={`600px`}
        visible={priceChangeModal}
        footer={null}
        onCancel={() => priceChangeModalToggle(null)}
      >
        <Wrapper al={`flex-start`} ju={`flex-start`}>
          <Text margin={`0 0 20px`} fontSize={`18px`} fontWeight={`700`}>
            수업료 수정
          </Text>
          <Form form={priceForm} onFinish={onSubmitPriceUpdate}>
            <FormItem name={`price`}>
              <Input label={`수업료`} type={`number`} size={`small`} />
            </FormItem>
          </Form>
        </Wrapper>

        <Wrapper al={`flex-end`}>
          <Button type="primary" onClick={onClicStuHandler}>
            변경
          </Button>
        </Wrapper>
      </Modal>

      <Modal
        title={`강의 메모 내용 보기`}
        visible={memoDetailModal}
        onCancel={memoClose}
      >
        asdasd
      </Modal>

      <Modal
        title={memoUpdateData ? `강의 메모 수정` : `강의 메모 작성`}
        visible={memoCreateModal}
        onCancel={() => memoCreateToggle(null)}
        onOk={memoUpdateData ? memoUpdateModalOk : memoCreateModalOk}
      >
        <Form
          form={memoUpdateData ? updateMemoForm : createMemoForm}
          onFinish={memoUpdateData ? memoUpdateSubmit : memoCreateSubmit}
        >
          <FormItem name={`title`} label={`제목`} rules={[{ required: true }]}>
            <Input />
          </FormItem>
          <br />
          <FormItem
            name={`content`}
            label={`내용`}
            rules={[{ required: true }]}
          >
            <Input.TextArea />
          </FormItem>
        </Form>
      </Modal>
    </AdminLayout>
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
      type: USER_TEACHER_LIST_REQUEST,
    });

    // 구현부 종료
    context.store.dispatch(END);
    console.log("🍀 SERVER SIDE PROPS END");
    await context.store.sagaTask.toPromise();
  }
);

export default DetailClass;
