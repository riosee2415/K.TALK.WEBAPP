import React, { useCallback, useEffect, useState } from "react";
import AdminLayout from "../../../../components/AdminLayout";
import PageHeader from "../../../../components/admin/PageHeader";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import {
  LOAD_MY_INFO_REQUEST,
  CHANGE_CLASS_CLOSE_REQUEST,
  CHANGE_CLASS_OPEN_REQUEST,
  USER_ALL_LIST_REQUEST,
  USER_CLASS_CHANGE_REQUEST,
  CLASS_PART_CLOSE_REQUEST,
  CLASS_PART_OPEN_REQUEST,
  USER_ADMIN_UPDATE_REQUEST,
  USER_TEACHER_LIST_REQUEST,
} from "../../../../reducers/user";
import {
  Table,
  Button,
  message,
  Modal,
  Select,
  Input,
  Form,
  Calendar,
  DatePicker,
  Switch,
  Empty,
} from "antd";
import { useRouter, withRouter } from "next/router";
import wrapper from "../../../../store/configureStore";
import { END } from "redux-saga";
import axios from "axios";
import {
  SpanText,
  Text,
  Wrapper,
  RowWrapper,
  ColWrapper,
  TextInput,
  Image,
  GuideUl,
  GuideLi,
  GuideDiv,
} from "../../../../components/commonComponents";
import { LECTURE_ALL_LIST_REQUEST } from "../../../../reducers/lecture";
import {
  PARTICIPANT_CREATE_REQUEST,
  PARTICIPANT_DELETE_REQUEST,
  PARTICIPANT_USER_DELETE_LIST_REQUEST,
  PARTICIPANT_USER_MOVE_LIST_REQUEST,
  PARTICIPANT_USER_LIMIT_LIST_REQUEST,
  PARTICIPANT_USER_CURRENT_LIST_REQUEST,
} from "../../../../reducers/participant";
import { APP_DETAIL_REQUEST } from "../../../../reducers/application";
import useInput from "../../../../hooks//useInput";
import { CalendarOutlined, SearchOutlined } from "@ant-design/icons";
import Theme from "../../../../components/Theme";
import { PAYMENT_LIST_REQUEST } from "../../../../reducers/payment";
import moment from "moment";
import useWidth from "../../../../hooks/useWidth";
import { COMMUTE_ADMIN_LIST_REQUEST } from "../../../../reducers/commute";

const CustomTextArea = styled(Input.TextArea)`
  width: ${(props) => props.width || `250px`};
`;

const CustomDatePicker = styled(DatePicker)`
  width: ${(props) => props.width || `250px`};
`;

const AdminContent = styled.div`
  padding: 20px;
`;

// const Input = styled(Input)`
//   width: ${(props) => props.width || `250px`};
// `;

const FormItem = styled(Form.Item)`
  width: ${(props) => props.width || `100%`};

  @media (max-width: 700px) {
    width: 100%;
  }

  margin: 0px;
`;

const CustomForm = styled(Form)`
  width: 100%;
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

const List = () => {
  const { Option } = Select;

  // LOAD CURRENT INFO AREA /////////////////////////////////////////////

  const { allLectures } = useSelector((state) => state.lecture);

  const {
    partUserCurrentList,
    st_participantUserCurrentListDone,
    st_participantUserCurrentListError,

    st_participantCreateDone,
    st_participantCreateError,
    st_participantDeleteDone,
    st_participantDeleteError,

    partUserDeleteList,
    st_participantUserDeleteListDone,
    st_participantUserDeleteListError,

    partUserMoveList,
    st_participantUserMoveListDone,
    st_participantUserMoveListError,

    partUserLimitList,

    st_participantUserLimitListDone,
    st_participantUserLimitListError,
  } = useSelector((state) => state.participant);

  const { paymentList, st_paymentListDone, st_paymentListError } = useSelector(
    (state) => state.payment
  );

  const { applicationDetail, st_appDetailDone, st_appDetailError } =
    useSelector((state) => state.app);

  const { commuteAdminList, st_commuteCreateDone, st_commuteCreateError } =
    useSelector((state) => state.commute);

  const {
    me,
    st_loadMyInfoDone,

    allUsers,
    classChangeModal,
    classPartModal,
    //
    st_userListError,
    //
    st_userChangeDone,
    st_userChangeError,

    st_userAdminUpdateDone,
    st_userAdminUpdateError,

    teachers,
  } = useSelector((state) => state.user);

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
  const dispatch = useDispatch();

  const width = useWidth();

  const [updateData, setUpdateData] = useState(null);
  const [detailDatum, setDetailDatum] = useState([]);

  const [opt2, setOpt2] = useState(null);
  const [opt4, setOpt4] = useState(null);

  const [detailToggle, setDetailToggle] = useState(false);
  const [classPartEndModal, setClassPartEndModal] = useState(false);
  const [stuDetail, setStuDetail] = useState([]);
  const [stuDetailModal, setStuDetailModal] = useState(false);

  const [parData, setParData] = useState(null);
  const [parEndData, setParEndData] = useState(null);

  const [form] = Form.useForm();
  const [updateClassform] = Form.useForm();
  const [updateEndClassform] = Form.useForm();
  const [updateStuForm] = Form.useForm();

  const inputName = useInput("");
  const inputEmail = useInput("");

  const [isPayment, setIsPayment] = useState(0);
  const [isCalendar, setIsCalendar] = useState(false);

  const [stuCommuteModal, setStuCommuteModal] = useState(false);
  const [stuCommuteDetail, setStuCommuteDetail] = useState("");

  const [stuSelect, setStuSelect] = useState("");

  ////// USEEFFECT //////

  useEffect(() => {
    dispatch({
      type: USER_ALL_LIST_REQUEST,
      data: {
        type: 1,
        name: "",
        email: "",
      },
    });

    dispatch({
      type: LECTURE_ALL_LIST_REQUEST,
      data: {
        TeacherId: "",
        studentName: "",
        time: "",
        startLv: "",
      },
    });
  }, [router.query, st_participantDeleteDone, st_participantCreateDone]);

  useEffect(() => {
    if (st_userChangeDone) {
      dispatch({
        type: USER_ALL_LIST_REQUEST,
        data: {
          type: 1,
          name: "",
          email: "",
        },
      });

      dispatch({
        type: LECTURE_ALL_LIST_REQUEST,
        data: {
          TeacherId: "",
          studentName: "",
          time: "",
          startLv: "",
        },
      });
      classChangeModalClose();
      return message.success("학생의 반이 옮겨졌습니다.");
    }
  }, [st_userChangeDone]);

  useEffect(() => {
    if (st_userListError) {
      return message.error(st_userListError);
    }
  }, [st_userListError]);

  useEffect(() => {
    if (st_userChangeError) {
      return message.error(st_userChangeError);
    }
  }, [st_userChangeError]);

  useEffect(() => {
    if (st_participantCreateDone) {
      classPartModalClose();
      return message.success("해당 학생을 수업에 참여시켰습니다.");
    }
  }, [st_participantCreateDone]);

  useEffect(() => {
    if (st_participantCreateError) {
      return message.error(st_participantCreateError);
    }
  }, [st_participantCreateError]);

  useEffect(() => {
    setOpt2(
      paymentList &&
        paymentList.map((data) => {
          if (data.UserId) return;
          if (data.isComplete === 0) {
            return;
          }
          return (
            <Option
              key={data.id}
              value={JSON.stringify(data)}
              // value={`${data.id},${data.LetureId},${data.week}`}
            >
              {`결제일: ${data.createdAt.slice(0, 10)} | ${data.course} | `}
              {`결제한 가격: $${data.price} |  ${data.email}`}
            </Option>
          );
        })
    );
  }, [paymentList]);

  useEffect(() => {
    setOpt4(
      allLectures &&
        allLectures.map((data) => {
          return (
            <Option key={data.id} value={data.id}>
              {data.number} | {data.course}
            </Option>
          );
        })
    );
  }, [allLectures]);

  useEffect(() => {
    if (st_paymentListError) {
      return message.error(st_paymentListError);
    }
  }, [st_paymentListError]);

  useEffect(() => {
    if (st_participantDeleteDone) {
      classPartEndModalClose();
      return message.success("해당 학생이 수업에서 제외되었습니다.");
    }
  }, [st_participantDeleteDone]);

  useEffect(() => {
    if (st_participantDeleteError) {
      return message.error(st_participantDeleteError);
    }
  }, [st_participantDeleteError]);

  useEffect(() => {
    if (st_participantUserDeleteListError) {
      return message.error(st_participantUserDeleteListError);
    }
  }, [st_participantUserDeleteListError]);

  useEffect(() => {
    if (st_participantUserMoveListError) {
      return message.error(st_participantUserMoveListError);
    }
  }, [st_participantUserMoveListError]);

  useEffect(() => {
    if (st_participantUserLimitListError) {
      return message.error(st_participantUserLimitListError);
    }
  }, [st_participantUserLimitListError]);

  useEffect(() => {
    if (st_participantUserLimitListDone) {
    }
  }, [st_participantUserLimitListDone]);

  useEffect(() => {
    if (st_participantUserDeleteListDone) {
    }
  }, [st_participantUserDeleteListDone]);

  useEffect(() => {
    if (st_participantUserMoveListDone) {
    }
  }, [st_participantUserMoveListDone]);

  useEffect(() => {
    if (st_participantUserCurrentListDone) {
    }
  }, [st_participantUserCurrentListDone]);

  useEffect(() => {
    if (st_participantUserCurrentListError) {
      return message.error(st_participantUserCurrentListError);
    }
  }, [st_participantUserCurrentListError]);

  useEffect(() => {
    if (st_userAdminUpdateDone) {
      setStuDetailModal(false);
      setIsCalendar(false);
      updateStuForm.resetFields();

      dispatch({
        type: USER_ALL_LIST_REQUEST,
        data: {
          type: 1,
          name: "",
          email: "",
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
    if (st_appDetailDone) {
      updateStuForm.setFieldsValue({
        classHour: applicationDetail[0].classHour,
        timeDiff: applicationDetail[0].timeDiff,
        wantStartDate: applicationDetail[0].wantStartDate
          ? moment(applicationDetail[0].wantStartDate)
          : "",
        teacher: applicationDetail[0].teacher,
        meetDate: applicationDetail[0].wantStartDate
          ? moment(applicationDetail[0].meetDate)
          : "",
        level: applicationDetail[0].level,
        purpose: applicationDetail[0].purpose,
        freeTeacher: applicationDetail[0].freeTeacher,
      });
    }
  }, [updateStuForm, st_appDetailDone]);

  useEffect(() => {
    if (st_commuteCreateError) {
      return message.error(st_commuteCreateError);
    }
  }, [st_commuteCreateError]);

  useEffect(() => {
    if (st_appDetailError) {
      return message.error(st_appDetailError);
    }
  }, [st_appDetailError]);

  ////// TOGGLE //////
  const classChangeModalOpen = useCallback(
    (data) => {
      dispatch({
        type: CHANGE_CLASS_OPEN_REQUEST,
      });

      setUpdateData(data);
    },
    [classChangeModal]
  );

  const classChangeModalClose = useCallback(() => {
    dispatch({
      type: CHANGE_CLASS_CLOSE_REQUEST,
    });
    setUpdateData(null);
    form.resetFields();
  }, [classChangeModal, form]);

  const classPartModalOpen = useCallback(
    (data) => {
      dispatch({
        type: CLASS_PART_OPEN_REQUEST,
      });

      dispatch({
        type: PAYMENT_LIST_REQUEST,
        data: {
          email: data.email,
          listType: 2,
        },
      });

      updateClassform.resetFields();
      setParData(data);
    },
    [classPartModal]
  );

  const classPartModalClose = useCallback(() => {
    dispatch({
      type: CLASS_PART_CLOSE_REQUEST,
    });

    updateClassform.resetFields();

    setIsPayment(0);
    setParData(null);
  }, [classPartModal, updateClassform]);

  const classPartEndModalOpen = useCallback((data) => {
    setClassPartEndModal(true);

    updateEndClassform.resetFields();

    onFillEnd(data);
    setParEndData(data);
  }, []);

  const classPartEndModalClose = useCallback((data) => {
    setClassPartEndModal(false);
    setParEndData(null);
  }, []);

  const classPartDetailModalOpen = useCallback(
    (data) => {
      setStuDetail(data);

      dispatch({
        type: APP_DETAIL_REQUEST,
        data: {
          email: data.email,
        },
      });

      onStuFill(data);
      setStuDetailModal(true);
    },

    []
  );

  const classStuModalOpen = useCallback(
    (data) => {
      setStuCommuteModal(true);
      setStuCommuteDetail(data);
    },

    []
  );

  const onStuFill = useCallback((data) => {
    if (data) {
      updateStuForm.setFieldsValue({
        username: data.username,
        email: data.email,
        userId: data.userId,
        sns: data.sns,
        snsId: data.snsId,
        birth: data.birth.slice(0, 10),
        mobile: data.mobile,
        password: data.mobile.slice(-4),
        stuLiveCon: data.stuLiveCon,
        stuCountry: data.stuCountry,
        stuLanguage: data.stuLanguage,
        stuPayCount: data.stuPayCount,
      });
    }
  }, []);

  const onFillEnd = useCallback((data) => {
    updateEndClassform.setFieldsValue({
      userName: data.username,
    });
  }, []);

  ////// HANDLER //////

  const onSubmitEnd = useCallback(() => {
    updateEndClassform.submit();
  }, []);

  const onModalOk = useCallback(() => {
    form.submit();
  }, [form]);

  const onModalChangeOk = useCallback(() => {
    updateClassform.submit();
  }, [form]);

  const onSubmit = useCallback(
    async (data) => {
      if (!data.lecture) {
        return message.error(`현재 강의를 선택해주세요.`);
      }
      if (!data.changelecture) {
        return message.error(`바꿀 강의를 선택해주세요.`);
      }

      let LectureId = data.lecture.split(",")[0];
      let endDate = data.lecture.split(",")[2];

      let Day = Math.ceil(
        Math.abs(moment.duration(moment().diff(moment(endDate))).asDays())
      );

      dispatch({
        type: USER_CLASS_CHANGE_REQUEST,
        data: {
          UserId: updateData.id,
          LectureId: LectureId,
          ChangeLectureId: data.changelecture,
          date: Day,
          endDate: endDate,
        },
      });
    },
    [updateData, paymentList]
  );

  const onUpdateClassSubmit = useCallback(
    (data) => {
      let partLecture = data.partLecture && JSON.parse(data.partLecture);
      let lectureList = data.lectureList && JSON.parse(data.lectureList);

      // if (lectureList) {
      //   if (moment() < moment(lectureList.startDate)) {
      //     return message.error(
      //       "수업 참여일이 수업 시작 날짜보다 과거일 수 없습니다."
      //     );
      //   }
      // } else if (partLecture) {
      //   if (moment() < moment(partLecture.startDate.slice(0, 10))) {
      //     return message.error(
      //       "수업 참여일이 수업 시작 날짜보다 과거일 수 없습니다."
      //     );
      //   }
      // }

      dispatch({
        type: PARTICIPANT_CREATE_REQUEST,
        data: {
          UserId: parData.id,
          LectureId: lectureList ? lectureList.id : partLecture.LetureId,
          date: lectureList
            ? parseInt(data.date) * 7
            : parseInt(partLecture.week) * 7,
          endDate: lectureList
            ? moment()
                .add(parseInt(data.date * 7 - 1), "days")
                .format("YYYY-MM-DD")
            : moment()
                .add(parseInt(partLecture.week * 7 - 1), "days")
                .format("YYYY-MM-DD"),
          PaymentId: lectureList ? null : partLecture.id,
        },
      });
    },
    [parData, allLectures]
  );

  const onEndClassSubmit = useCallback(
    (data) => {
      dispatch({
        type: PARTICIPANT_DELETE_REQUEST,
        data: {
          UserId: parEndData.id,
          LectureId: data.partLecture,
        },
      });
    },
    [parEndData]
  );

  const onSeachStuHandler = useCallback(() => {
    dispatch({
      type: USER_ALL_LIST_REQUEST,
      data: {
        type: 1,
        name: inputName.value,
        email: inputEmail.value,
      },
    });
  }, [inputName.value, inputEmail.value]);

  const onSeachHandler = useCallback((LectureId, paymentData) => {
    let arr = [];

    paymentData.map((data, idx) => {
      if (data.LetureId === LectureId) {
        arr.push({
          id: data.id,
          week: data.week,
        });
      }
    });
  }, []);

  const detailModalOpen = useCallback((data) => {
    dispatch({
      type: PAYMENT_LIST_REQUEST,
      data: {
        email: data && data.email,
      },
    });
    dispatch({
      type: PARTICIPANT_USER_CURRENT_LIST_REQUEST,
      data: {
        UserId: data.id,
        isDelete: "0",
        isChange: "0",
      },
    });

    dispatch({
      type: PARTICIPANT_USER_DELETE_LIST_REQUEST,
      data: {
        UserId: data.id,
        isDelete: "1",
        isChange: "0",
      },
    });

    dispatch({
      type: PARTICIPANT_USER_MOVE_LIST_REQUEST,
      data: {
        UserId: data.id,
        isDelete: "0",
        isChange: "1",
      },
    });

    dispatch({
      type: PARTICIPANT_USER_LIMIT_LIST_REQUEST,
      data: {
        UserId: data.id,
      },
    });

    let save = data.Participants.filter((Datum, idx) => {
      return !Datum.isChange && !Datum.isDelete;
    });

    setDetailDatum(save);
    setDetailToggle(true);
  }, []);

  const updateStuFinish = useCallback(
    (data) => {
      if (data.email === stuDetail.email) {
        dispatch({
          type: USER_ADMIN_UPDATE_REQUEST,
          data: {
            id: stuDetail.id,
            username: data.username,
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
      } else {
        dispatch({
          type: USER_ADMIN_UPDATE_REQUEST,
          data: {
            id: stuDetail.id,
            username: data.username,
            userId: data.email,
            email: data.email,
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
      }
    },
    [stuDetail]
  );

  const calenderToggle = useCallback(() => {
    setIsCalendar(!isCalendar);
  }, [isCalendar]);

  const dateChagneHandler = useCallback((data) => {
    const birth = data.format("YYYY-MM-DD");
    updateStuForm.setFieldsValue({
      birth: birth,
    });
  }, []);

  const buttonHandle = useCallback(
    (type) => {
      setIsPayment(type);

      updateClassform.setFieldsValue({
        isPayment: type,
      });
    },
    [updateClassform]
  );

  const onClickCommuteHandler = useCallback(() => {
    dispatch({
      type: COMMUTE_ADMIN_LIST_REQUEST,
      data: {
        LectureId: stuSelect,
        UserId: stuCommuteDetail.id,
      },
    });
  }, [stuSelect, stuCommuteDetail]);

  const stuCancelHandler = useCallback(() => {
    setStuCommuteModal(false);
    setStuSelect("");
  }, []);

  ////// DATAVIEW //////

  const column = [
    {
      width: `3%`,
      title: "번호",
      dataIndex: "stuNo",
    },

    {
      width: `16%`,
      title: "회원이름",
      render: (data) => <div>{data.username}</div>,
    },
    {
      width: `20%`,
      title: "이메일",
      render: (data) => <div>{data.email}</div>,
    },

    {
      width: `8%`,
      title: "국적",
      render: (data) => <div>{data.stuCountry}</div>,
    },

    {
      width: `6%`,
      title: "권한",
      render: (data) => (
        <div>
          {data.level === 1
            ? "일반학생"
            : data.level === 2
            ? "강사"
            : data.level === 3
            ? "운영자"
            : data.level === 4
            ? "최고관리자"
            : "개발사"}
        </div>
      ),
    },
    {
      width: `6%`,
      title: "반 옮기기",
      render: (data) => {
        return (
          <Button
            size="small"
            type="primary"
            onClick={() =>
              data.level === 5
                ? message.error("개발사는 권한을 수정할 수 없습니다.")
                : classChangeModalOpen(data)
            }
          >
            반 옮기기
          </Button>
        );
      },
    },
    {
      width: `6%`,
      title: "수업참여",
      render: (data) => {
        return (
          <Button
            size="small"
            onClick={() =>
              data.level === 5
                ? message.error("개발사는 권한을 수정할 수 없습니다.")
                : classPartModalOpen(data)
            }
          >
            수업참여
          </Button>
        );
      },
    },
    {
      width: `6%`,
      title: "수업빼기",
      render: (data) => {
        return (
          <Button
            size="small"
            type="primary"
            onClick={() =>
              data.level === 5
                ? message.error("개발사는 권한을 수정할 수 없습니다.")
                : classPartEndModalOpen(data)
            }
          >
            수업빼기
          </Button>
        );
      },
    },
    {
      width: `8%`,
      title: "강의내역보기",
      render: (data) => {
        return (
          <Button size="small" onClick={() => detailModalOpen(data)}>
            강의내역보기
          </Button>
        );
      },
    },
    {
      width: `8%`,
      title: "학생정보보기",
      render: (data) => {
        return (
          <Button
            size="small"
            type="primary"
            onClick={() =>
              data.level === 5
                ? message.error("개발사는 권한을 수정할 수 없습니다.")
                : classPartDetailModalOpen(data)
            }
          >
            학생정보보기
          </Button>
        );
      },
    },
    {
      width: `8%`,
      title: "학생출석보기",
      render: (data) => {
        return (
          <Button
            size="small"
            onClick={() =>
              data.level === 5
                ? message.error("개발사는 권한을 수정할 수 없습니다.")
                : classStuModalOpen(data)
            }
          >
            학생출석보기
          </Button>
        );
      },
    },
    // {
    //   title: "기능",
    //   render: (data) => (
    //     <Wrapper>
    //       <Button
    //         size="small"
    //         type="primary"
    //         onClick={() =>
    //           data.level === 5
    //             ? message.error("개발사는 권한을 수정할 수 없습니다.")
    //             : classChangeModalOpen(data)
    //         }
    //       >
    //         반 옮기기
    //       </Button>

    //       <Button
    //         size="small"
    //         onClick={() =>
    //           data.level === 5
    //             ? message.error("개발사는 권한을 수정할 수 없습니다.")
    //             : classPartModalOpen(data)
    //         }
    //       >
    //         수업참여
    //       </Button>

    //       <Button
    //         size="small"
    //         type="primary"
    //         onClick={() =>
    //           data.level === 5
    //             ? message.error("개발사는 권한을 수정할 수 없습니다.")
    //             : classPartEndModalOpen(data)
    //         }
    //       >
    //         수업빼기
    //       </Button>
    //     </Wrapper>
    //   ),
    // },

    // {
    //   title: "학생 강의 상세",
    //   render: (data) => (
    //     <Wrapper>
    //       <Button
    //         size="small"
    //         type="primary"
    //         onClick={() => detailModalOpen(data)}
    //       >
    //         강의내역보기
    //       </Button>

    //       <Button
    //         size="small"
    //         onClick={() =>
    //           data.level === 5
    //             ? message.error("개발사는 권한을 수정할 수 없습니다.")
    //             : classPartDetailModalOpen(data)
    //         }
    //       >
    //         학생정보보기
    //       </Button>

    //       <Button
    //         size="small"
    //         type="primary"
    //         onClick={() =>
    //           data.level === 5
    //             ? message.error("개발사는 권한을 수정할 수 없습니다.")
    //             : classStuModalOpen(data)
    //         }
    //       >
    //         학생출석보기
    //       </Button>
    //     </Wrapper>
    //   ),
    // },

    // {
    //   title: "DELETE",
    //   render: (data) => (
    //     <Button type="danger" onClick={deletePopToggle(data.id)}>
    //       DEL
    //     </Button>
    //   ),
    // },
  ];

  const columnsList = [
    {
      title: "No",
      dataIndex: "id",
    },

    {
      title: "수업 번호",
      render: (data) => <div>{data.number}</div>,
    },

    {
      title: "이름",
      render: (data) => <div>{data.TeacherName}</div>,
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
      title: "수업 번호",
      render: (data) => <div>{data.number}</div>,
    },

    {
      title: "이름",
      render: (data) => <div>{data.TeacherName}</div>,
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
        <div>{moment(data.createdAt).format("YYYY-MM-DD")}</div>
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
      title: "수업 번호",
      render: (data) => <div>{data.number}</div>,
    },

    {
      title: "이름",
      render: (data) => <div>{data.TeacherName}</div>,
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
      render: (data) => <div>{data.createdAt.slice(0, 10)}</div>,
    },
  ];

  const columns7End = [
    {
      title: "No",
      dataIndex: "id",
    },

    {
      title: "수업 번호",
      render: (data) => <div>{data.number}</div>,
    },

    {
      title: "이름",
      render: (data) => <div>{data.teacherName}</div>,
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
        <div style={{ color: Theme.red_C }}>{`${data.limitDate}일`}</div>
      ),
    },
  ];

  const columnCommute = [
    {
      title: "수업 이름",
      render: (data) => <div>{data.course}</div>,
    },

    {
      title: "요일",
      render: (data) => <div>{data.LectureDay}</div>,
    },

    {
      title: "시간",
      render: (data) => <div>{data.LectureTime}</div>,
    },

    {
      title: "출석상태",
      render: (data) => <div>{`${data.status}`}</div>,
    },

    {
      title: "출석일",
      render: (data) => <div>{`${data.createdAt.slice(0, 13)}`}</div>,
    },
  ];

  const columnsPayList = [
    {
      title: "번호",
      dataIndex: "id",
    },

    {
      title: "결제한 강의",
      dataIndex: "course",
    },

    {
      title: "결제한 가격",

      render: (data) => {
        return <div>{`$${data.price}`}</div>;
      },
    },

    {
      title: "결제일",
      render: (data) => {
        return <div>{data.createdAt.substring(0, 10)}</div>;
      },
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
        breadcrumbs={["회원 관리", "관리"]}
        title={`학생 목록`}
        subTitle={`홈페이지에 가입한 학생을 확인할 수 있습니다.`}
      />
      {/* <AdminTop createButton={true} createButtonAction={() => {})} /> */}

      <AdminContent>
        <Wrapper
          width={`auto`}
          dr={`row`}
          margin={`0 0 10px`}
          ju={`space-between`}
        >
          <Wrapper dr={`row`} ju={`flex-start`} width={`75%`}>
            <Input
              size="small"
              style={{ width: "30%" }}
              placeholder="사용자명"
              {...inputName}
              onKeyDown={(e) => e.keyCode === 13 && onSeachStuHandler()}
            />
            <Input
              size="small"
              style={{ width: "30%" }}
              placeholder="이메일"
              {...inputEmail}
              onKeyDown={(e) => e.keyCode === 13 && onSeachStuHandler()}
            />
            <Button size="small" onClick={() => onSeachStuHandler()}>
              <SearchOutlined />
              검색
            </Button>
          </Wrapper>

          <Wrapper width={`auto`} al={`flex-end`}>
            <Button
              size="small"
              type="primary"
              onClick={() => moveLinkHandler("/application")}
            >
              회원생성
            </Button>
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
            학생이 수업을 연장해서 듣게 해야하는 경우 기간이 만료된 강의를 먼저
            수업빼기 기능을 이용해서 빼주시고 다시 수업참여 기능을 이용하여
            재참여 시켜줘야 합니다.
          </GuideDiv>
        </Wrapper>

        <Table
          rowKey="id"
          columns={column}
          dataSource={allUsers ? allUsers : []}
          size="small"
          pagination={{
            pageSize: 30,
          }}
        />
      </AdminContent>

      <Modal
        visible={classChangeModal}
        width={`400px`}
        title={`학생 수업 변경`}
        onCancel={classChangeModalClose}
        onOk={onModalOk}
        okText="수정"
        cancelText="취소"
      >
        <Wrapper padding={`10px`} al={`flex-start`}>
          <Form
            form={form}
            style={{ width: `100%` }}
            onFinish={(data) => onSubmit(data)}
          >
            <Form.Item label={`학생`}>
              <Input disabled value={updateData && updateData.username} />
            </Form.Item>

            <Form.Item label={`현재 강의`} name={`lecture`}>
              <Select
                width={`100%`}
                height={`32px`}
                showSearch
                placeholder="Select a Lecture"
              >
                {updateData &&
                  updateData.Participants.map((data, idx) => {
                    if (data.isDelete) {
                      return null;
                    } else if (data.isChange) {
                      return null;
                    }

                    return (
                      <Option
                        key={data.id}
                        value={`${data.LectureId},${data.date},${data.endDate}`}
                      >
                        {data.Lecture?.number} | {data.Lecture?.course}
                      </Option>
                    );
                  })}
              </Select>
            </Form.Item>

            <Form.Item label={`바뀔 강의`} name={`changelecture`}>
              <Select
                width={`100%`}
                height={`32px`}
                showSearch
                placeholder="Select a Lecture"
                // name={`changelecture`}
              >
                {opt4}
              </Select>
            </Form.Item>
          </Form>
        </Wrapper>
      </Modal>

      <Modal
        visible={classPartModal}
        width={`800px`}
        title={`학생 수업 참여`}
        onCancel={classPartModalClose}
        onOk={onModalChangeOk}
        okText="수정"
        cancelText="취소"
      >
        <Wrapper padding={`10px`} al={`flex-start`}>
          <Form
            form={updateClassform}
            style={{ width: `100%` }}
            onFinish={onUpdateClassSubmit}
          >
            <Form.Item label={`학생`}>
              <Input disabled value={parData && parData.username} />
            </Form.Item>

            <Form.Item
              label="결제 여부"
              name="isPayment"
              rules={[{ required: true, message: "결제 여부를 선택해주세요." }]}
            >
              <Button
                size="small"
                style={{ marginRight: 10 }}
                type={isPayment === 1 && `primary`}
                onClick={() => buttonHandle(1)}
              >
                네
              </Button>
              <Button
                size="small"
                type={isPayment === 2 && `primary`}
                onClick={() => buttonHandle(2)}
              >
                아니요
              </Button>
            </Form.Item>

            {isPayment === 1 && (
              <Form.Item
                label={`참여할 강의`}
                name={`partLecture`}
                rules={[
                  { required: true, message: "참가시킬 강의를 선택해주세요." },
                ]}
              >
                <Select
                  width={`100%`}
                  height={`32px`}
                  showSearch
                  onChange={(LectureId) =>
                    onSeachHandler(LectureId, paymentList)
                  }
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  placeholder="Select a Lecture"
                >
                  {opt2}
                </Select>
              </Form.Item>
            )}

            {isPayment === 2 && (
              <>
                <Form.Item
                  label="강의 목록"
                  name="lectureList"
                  rules={[
                    { message: "강의목록을 선택해주세요.", required: true },
                  ]}
                >
                  <Select showSearch placeholder="Select a Lecture">
                    {allLectures && allLectures.length === 0
                      ? ""
                      : allLectures &&
                        allLectures.map((data, idx) => {
                          return (
                            <Select.Option
                              key={data.id}
                              value={JSON.stringify(data)}
                            >
                              {`${data.number} | ${data.course} | ${data.User.username}`}
                            </Select.Option>
                          );
                        })}
                  </Select>
                </Form.Item>

                <Form.Item
                  label="강의 기간"
                  name="date"
                  rules={[
                    { message: "강의기간 입력해주세요.", required: true },
                  ]}
                >
                  <Wrapper dr={`row`}>
                    <TextInput
                      width={`calc(100% - 30px)`}
                      height={"32px"}
                      type={`number`}
                      min={1}
                    />
                    <Text width={`30px`} padding={`10px`}>
                      주
                    </Text>
                  </Wrapper>
                </Form.Item>
              </>
            )}
          </Form>
        </Wrapper>
      </Modal>

      <Modal
        visible={classPartEndModal}
        width={`400px`}
        title={`학생 수업 종료`}
        onCancel={classPartEndModalClose}
        onOk={onSubmitEnd}
        okText="수정"
        cancelText="취소"
      >
        <Wrapper padding={`10px`} al={`flex-start`}>
          <Form
            form={updateEndClassform}
            style={{ width: `100%` }}
            onFinish={onEndClassSubmit}
          >
            <Form.Item label={`학생`} name={`userName`}>
              <Input disabled value={parEndData && parEndData.username} />
            </Form.Item>

            <Form.Item
              label={`종료할 강의`}
              name={`partLecture`}
              rules={[
                { required: true, message: "종료할 강의를 선택해주세요." },
              ]}
            >
              <Select
                width={`100%`}
                height={`32px`}
                showSearch
                placeholder="Select a Lecture"
              >
                {parEndData &&
                  parEndData.Participants.map((data, idx) => {
                    if (data.isDelete) {
                      return null;
                    } else if (data.isChange) {
                      return null;
                    }

                    return (
                      <Option key={data.id} value={data.LectureId}>
                        {data.Lecture?.number} | {data.Lecture?.course}
                      </Option>
                    );
                  })}
              </Select>
            </Form.Item>
          </Form>
        </Wrapper>
      </Modal>

      <Modal
        visible={detailToggle}
        width={`75%`}
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

        <Text fontSize={`16px`} fontWeight={`700`} margin={`0 0 10px`}>
          학생 결제 목록
        </Text>

        <Table
          rowKey="id"
          columns={columnsPayList}
          dataSource={paymentList ? paymentList : []}
          size="small"
        />
      </Modal>

      <Modal
        visible={stuDetailModal}
        width={`1000px`}
        title={`학생 관리`}
        onCancel={() => setStuDetailModal(false)}
        footer={null}
      >
        <CustomForm form={updateStuForm} onFinish={updateStuFinish}>
          <Wrapper al={`flex-start`} ju={`flex-start`} margin={`0 0 50px`}>
            <Text fontSize={`16px`} fontWeight={`700`} margin={`0 0 10px`}>
              사용자 정보
            </Text>
            <Wrapper dr={`row`} al={`flex-start`} ju={`space-between`}>
              <Wrapper width={`48%`} margin={`0 0 20px`}>
                <Wrapper
                  padding={`5px 0 3px`}
                  dr={`row`}
                  borderBottom={`1px dashed ${Theme.lightGrey3_C}`}
                >
                  <Wrapper bgColor={Theme.lightGrey3_C} padding={`3px`}>
                    프로필 이미지
                  </Wrapper>
                  <Wrapper>
                    <Image
                      radius={`50%`}
                      src={
                        stuDetail
                          ? `${stuDetail && stuDetail.profileImage}`
                          : `https://via.placeholder.com/100x100`
                      }
                    />
                  </Wrapper>
                </Wrapper>

                <Wrapper
                  padding={`5px 0`}
                  dr={`row`}
                  borderBottom={`1px dashed ${Theme.lightGrey3_C}`}
                >
                  <Wrapper
                    width={`25%`}
                    bgColor={Theme.lightGrey3_C}
                    padding={`3px`}
                  >
                    이름
                  </Wrapper>
                  <Wrapper width={`75%`} al={`flex-start`} padding={`0 10px`}>
                    <FormItem name="username">
                      <Input />
                    </FormItem>
                  </Wrapper>
                </Wrapper>

                <Wrapper
                  padding={`5px 0`}
                  dr={`row`}
                  borderBottom={`1px dashed ${Theme.lightGrey3_C}`}
                >
                  <Wrapper
                    width={`25%`}
                    bgColor={Theme.lightGrey3_C}
                    padding={`3px`}
                  >
                    이메일
                  </Wrapper>
                  <Wrapper width={`75%`} al={`flex-start`} padding={`0 10px`}>
                    <FormItem name="email">
                      <Input />
                    </FormItem>
                  </Wrapper>
                </Wrapper>

                <Wrapper
                  padding={`5px 0`}
                  dr={`row`}
                  borderBottom={`1px dashed ${Theme.lightGrey3_C}`}
                >
                  <Wrapper
                    width={`25%`}
                    bgColor={Theme.lightGrey3_C}
                    padding={`3px`}
                  >
                    아이디
                  </Wrapper>
                  <Wrapper width={`75%`} al={`flex-start`} padding={`0 10px`}>
                    <FormItem name="email">
                      <Input disabled />
                    </FormItem>
                  </Wrapper>
                </Wrapper>

                <Wrapper
                  padding={`5px 0`}
                  dr={`row`}
                  borderBottom={`1px dashed ${Theme.lightGrey3_C}`}
                >
                  <Wrapper
                    width={`25%`}
                    bgColor={Theme.lightGrey3_C}
                    padding={`3px`}
                  >
                    휴대폰 번호
                  </Wrapper>
                  <Wrapper width={`75%`} al={`flex-start`} padding={`0 10px`}>
                    <FormItem name="mobile">
                      <Input
                        onChange={(e) =>
                          updateStuForm.setFieldsValue({
                            password: e.target.value.slice(-4),
                          })
                        }
                      />
                    </FormItem>
                  </Wrapper>
                </Wrapper>

                <Wrapper
                  padding={`5px 0`}
                  dr={`row`}
                  borderBottom={`1px dashed ${Theme.lightGrey3_C}`}
                >
                  <Wrapper
                    width={`25%`}
                    bgColor={Theme.lightGrey3_C}
                    padding={`3px`}
                  >
                    비밀번호
                  </Wrapper>
                  <Wrapper width={`75%`} al={`flex-start`} padding={`0 10px`}>
                    <FormItem name="password">
                      <Input disabled />
                    </FormItem>
                  </Wrapper>
                </Wrapper>

                <Wrapper
                  padding={`5px 0`}
                  dr={`row`}
                  borderBottom={`1px dashed ${Theme.lightGrey3_C}`}
                >
                  <Wrapper
                    width={`25%`}
                    bgColor={Theme.lightGrey3_C}
                    padding={`3px`}
                  >
                    생년월일
                  </Wrapper>
                  <Wrapper
                    width={`75%`}
                    ju={`space-between`}
                    padding={`0 10px`}
                    dr={`row`}
                  >
                    <FormItem name="birth" width={`calc(100% - 30px)`}>
                      <Input disabled />
                    </FormItem>

                    <CalendarOutlined onClick={calenderToggle} />
                  </Wrapper>
                </Wrapper>

                <Wrapper
                  display={isCalendar ? "flex" : "none"}
                  width={`auto`}
                  shadow={`0px 0px 10px ${Theme.lightGrey3_C}`}
                  border={`1px solid ${Theme.lightGrey3_C}`}
                  padding={`5px 0`}
                  margin={`5px 0 0`}
                >
                  <Calendar
                    // style={{ width: width < 1350 ? `100%` : `100%` }}
                    fullscreen={false}
                    validRange={[moment(`1940`), moment()]}
                    onChange={dateChagneHandler}
                  />
                </Wrapper>

                <Wrapper
                  padding={`5px 0`}
                  dr={`row`}
                  borderBottom={`1px dashed ${Theme.lightGrey3_C}`}
                >
                  <Wrapper
                    width={`25%`}
                    bgColor={Theme.lightGrey3_C}
                    padding={`3px`}
                  >
                    국가
                  </Wrapper>
                  <Wrapper width={`75%`} al={`flex-start`} padding={`0 10px`}>
                    <FormItem name="stuCountry">
                      <Select>
                        {country &&
                          country.map((data, idx) => {
                            return (
                              <Select.Option key={idx} value={data}>
                                {data}
                              </Select.Option>
                            );
                          })}
                      </Select>
                    </FormItem>
                  </Wrapper>
                </Wrapper>

                <Wrapper
                  padding={`5px 0`}
                  dr={`row`}
                  borderBottom={`1px dashed ${Theme.lightGrey3_C}`}
                >
                  <Wrapper
                    width={`25%`}
                    bgColor={Theme.lightGrey3_C}
                    padding={`3px`}
                  >
                    거주 국가
                  </Wrapper>
                  <Wrapper width={`75%`} al={`flex-start`} padding={`0 10px`}>
                    <FormItem name="stuLiveCon">
                      <Select>
                        {country &&
                          country.map((data, idx) => {
                            return (
                              <Select.Option key={idx} value={data}>
                                {data}
                              </Select.Option>
                            );
                          })}
                      </Select>
                    </FormItem>
                  </Wrapper>
                </Wrapper>

                <Wrapper
                  padding={`5px 0`}
                  dr={`row`}
                  borderBottom={`1px dashed ${Theme.lightGrey3_C}`}
                >
                  <Wrapper
                    width={`25%`}
                    bgColor={Theme.lightGrey3_C}
                    padding={`3px`}
                  >
                    사용언어
                  </Wrapper>
                  <Wrapper width={`75%`} al={`flex-start`} padding={`0 10px`}>
                    <FormItem name="stuLanguage">
                      <Input />
                    </FormItem>
                  </Wrapper>
                </Wrapper>

                <Wrapper
                  padding={`5px 0`}
                  dr={`row`}
                  borderBottom={`1px dashed ${Theme.lightGrey3_C}`}
                >
                  <Wrapper
                    width={`25%`}
                    bgColor={Theme.lightGrey3_C}
                    padding={`3px`}
                  >
                    SNS
                  </Wrapper>
                  <Wrapper width={`75%`} al={`flex-start`} padding={`0 10px`}>
                    <FormItem name="sns">
                      <Input />
                    </FormItem>
                  </Wrapper>
                </Wrapper>

                <Wrapper
                  padding={`5px 0`}
                  dr={`row`}
                  borderBottom={`1px dashed ${Theme.lightGrey3_C}`}
                >
                  <Wrapper
                    width={`25%`}
                    bgColor={Theme.lightGrey3_C}
                    padding={`3px`}
                  >
                    SNS Id
                  </Wrapper>
                  <Wrapper width={`75%`} al={`flex-start`} padding={`0 10px`}>
                    <FormItem name="snsId">
                      <Input />
                    </FormItem>
                  </Wrapper>
                </Wrapper>

                <Wrapper
                  padding={`5px 0`}
                  dr={`row`}
                  borderBottom={`1px dashed ${Theme.lightGrey3_C}`}
                >
                  <Wrapper
                    width={`25%`}
                    bgColor={Theme.lightGrey3_C}
                    padding={`3px`}
                  >
                    회차
                  </Wrapper>
                  <Wrapper width={`75%`} al={`flex-start`} padding={`0 10px`}>
                    <FormItem name="stuPayCount">
                      <Input />
                    </FormItem>
                  </Wrapper>
                </Wrapper>
              </Wrapper>

              <Wrapper width={`50%`} al={`flex-start`}>
                <Wrapper
                  padding={`5px 0`}
                  dr={`row`}
                  borderBottom={`1px dashed ${Theme.lightGrey3_C}`}
                >
                  <Wrapper
                    width={`25%`}
                    bgColor={Theme.lightGrey3_C}
                    padding={`3px`}
                  >
                    시차
                  </Wrapper>
                  <Wrapper width={`75%`} al={`flex-start`} padding={`0 10px`}>
                    <FormItem name="timeDiff">
                      <Input />
                    </FormItem>
                  </Wrapper>
                </Wrapper>

                <Wrapper
                  padding={`5px 0`}
                  dr={`row`}
                  borderBottom={`1px dashed ${Theme.lightGrey3_C}`}
                >
                  <Wrapper
                    width={`25%`}
                    bgColor={Theme.lightGrey3_C}
                    padding={`3px`}
                  >
                    원하는 시작 날짜
                  </Wrapper>
                  <Wrapper width={`75%`} al={`flex-start`} padding={`0 10px`}>
                    <FormItem name="wantStartDate">
                      <CustomDatePicker style={{ width: `100%` }} />
                    </FormItem>
                  </Wrapper>
                </Wrapper>

                <Wrapper
                  padding={`5px 0`}
                  dr={`row`}
                  borderBottom={`1px dashed ${Theme.lightGrey3_C}`}
                >
                  <Wrapper
                    width={`25%`}
                    bgColor={Theme.lightGrey3_C}
                    padding={`3px`}
                  >
                    무료수업 담당 강사
                  </Wrapper>
                  <Wrapper width={`75%`} al={`flex-start`} padding={`0 10px`}>
                    <FormItem name="freeTeacher">
                      <Select placeholder={`강사를 선택해주세요.`}>
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
                  </Wrapper>
                </Wrapper>

                <Wrapper
                  padding={`5px 0`}
                  dr={`row`}
                  borderBottom={`1px dashed ${Theme.lightGrey3_C}`}
                >
                  <Wrapper
                    width={`25%`}
                    bgColor={Theme.lightGrey3_C}
                    padding={`3px`}
                  >
                    담당 강사
                  </Wrapper>
                  <Wrapper width={`75%`} al={`flex-start`} padding={`0 10px`}>
                    <FormItem name="teacher">
                      <Select
                        placeholder={`수업을 선택해주세요.`}
                        filterOption={(input, option) =>
                          option.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                        showSearch
                      >
                        {allLectures &&
                          allLectures.map((data, idx) => {
                            return (
                              <Select.Option
                                key={`${data.User.username} ${data.course}`}
                                value={data.username}
                              >
                                {`(${data.number}) ${data.User.username} ${data.course}`}
                              </Select.Option>
                            );
                          })}
                      </Select>
                    </FormItem>
                  </Wrapper>
                </Wrapper>

                <Wrapper
                  padding={`5px 0`}
                  dr={`row`}
                  borderBottom={`1px dashed ${Theme.lightGrey3_C}`}
                >
                  <Wrapper
                    width={`25%`}
                    bgColor={Theme.lightGrey3_C}
                    padding={`3px`}
                  >
                    줌 미팅 시간
                  </Wrapper>
                  <Wrapper width={`75%`} al={`flex-start`} padding={`0 10px`}>
                    <FormItem name="meetDate">
                      <CustomDatePicker
                        style={{ width: `100%` }}
                        showTime={{ format: "HH:mm", minuteStep: 10 }}
                        format="YYYY-MM-DD HH:mm"
                      />
                    </FormItem>
                  </Wrapper>
                </Wrapper>

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

                <Wrapper
                  padding={`5px 0`}
                  dr={`row`}
                  borderBottom={`1px dashed ${Theme.lightGrey3_C}`}
                >
                  <Wrapper
                    width={`25%`}
                    bgColor={Theme.lightGrey3_C}
                    padding={`3px`}
                  >
                    레벨
                  </Wrapper>
                  <Wrapper width={`75%`} al={`flex-start`} padding={`0 10px`}>
                    <FormItem name="level">
                      <Input />
                    </FormItem>
                  </Wrapper>
                </Wrapper>

                <Wrapper
                  padding={`5px 0`}
                  dr={`row`}
                  borderBottom={`1px dashed ${Theme.lightGrey3_C}`}
                >
                  <Wrapper bgColor={Theme.lightGrey3_C} padding={`3px`}>
                    가능한 수업시간
                  </Wrapper>
                  <Wrapper al={`flex-start`}>
                    <FormItem name="classHour">
                      <CustomTextArea rows={4} width={{ width: `100%` }} />
                    </FormItem>
                  </Wrapper>
                </Wrapper>

                <Wrapper
                  padding={`5px 0`}
                  dr={`row`}
                  borderBottom={`1px dashed ${Theme.lightGrey3_C}`}
                >
                  <Wrapper bgColor={Theme.lightGrey3_C} padding={`3px`}>
                    메모
                  </Wrapper>
                  <Wrapper al={`flex-start`}>
                    <FormItem name="purpose">
                      <CustomTextArea
                        style={{ width: `100%` }}
                        rows={6}
                        border={`1px solid ${Theme.grey_C} !important`}
                      />
                    </FormItem>
                  </Wrapper>
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
                      <Input />
                    </FormItem>
                  </ColWrapper>
                </RowWrapper> */}
              </Wrapper>
            </Wrapper>

            <Text color={Theme.red_C}>
              * 이메일 수정 하고싶으면 개발사로 문의해주세요.
            </Text>
          </Wrapper>

          <ColWrapper width={`100%`} ju={`space-between`}>
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
        visible={stuCommuteModal}
        width={`1100px`}
        title={`학생 출석 목록`}
        footer={null}
        onCancel={() => stuCancelHandler()}
        onOk={onModalOk}
      >
        <Wrapper dr={`row`} ju={`flex-start`} margin={`0 0 10px 0`}>
          <Select
            style={{ width: 200 }}
            onChange={(e) => setStuSelect(e)}
            value={stuSelect}
            size="small"
          >
            {stuCommuteDetail && stuCommuteDetail.Participants.length === 0 ? (
              <Select>{"참여중인 수업이 없습니다."}</Select>
            ) : (
              stuCommuteDetail.Participants &&
              stuCommuteDetail.Participants.map((data, idx) => {
                return (
                  <Select.Option key={data.id} value={data.Lecture.id}>
                    {data.Lecture.course}
                  </Select.Option>
                );
              })
            )}
          </Select>

          <Button
            size="small"
            style={{ marginLeft: 10 }}
            onClick={() => onClickCommuteHandler()}
            type="primary"
          >
            검색
          </Button>
        </Wrapper>

        <Table
          rowKey="id"
          columns={columnCommute}
          dataSource={commuteAdminList ? commuteAdminList : []}
          size="small"
        />
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

export default withRouter(List);
