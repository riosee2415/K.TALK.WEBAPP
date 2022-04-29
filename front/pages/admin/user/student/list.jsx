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
} from "../../../../components/commonComponents";
import { LECTURE_ALL_LIST_REQUEST } from "../../../../reducers/lecture";
import {
  PARTICIPANT_CREATE_REQUEST,
  PARTICIPANT_DELETE_REQUEST,
  PARTICIPANT_USER_DELETE_LIST_REQUEST,
  PARTICIPANT_USER_MOVE_LIST_REQUEST,
  PARTICIPANT_USER_LIMIT_LIST_REQUEST,
} from "../../../../reducers/participant";
import useInput from "../../../../hooks//useInput";
import { CalendarOutlined, SearchOutlined } from "@ant-design/icons";
import Theme from "../../../../components/Theme";
import { PAYMENT_LIST_REQUEST } from "../../../../reducers/payment";
import moment from "moment";
import useWidth from "../../../../hooks/useWidth";

const AdminContent = styled.div`
  padding: 20px;
`;

const CustomInput = styled(Input)`
  width: ${(props) => props.width || `250px`};
`;

const FormItem = styled(Form.Item)`
  width: ${(props) => props.width};

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

  const { TextArea } = Input;

  // LOAD CURRENT INFO AREA /////////////////////////////////////////////

  const { allLectures } = useSelector((state) => state.lecture);

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

  const {
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

  const [paymentData, setPaymentData] = useState([]);
  const [updateData, setUpdateData] = useState(null);
  const [lectureList, setLectureList] = useState(null);
  const [selectedList, setSelectedList] = useState([]);

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
        },
      });

      updateClassform.resetFields();
      setParData(data);
    },
    [classPartModal]
  );

  const classPartModalClose = useCallback(
    (data) => {
      dispatch({
        type: CLASS_PART_CLOSE_REQUEST,
      });

      updateClassform.resetFields();

      setIsPayment(0);
      setParData(null);
    },
    [classPartModal, updateClassform]
  );

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

  const classPartDetailModalOpen = useCallback((data) => {
    setStuDetail(data);
    setStuDetailModal(true);

    onStuFill(data);
  }, []);

  const onStuFill = useCallback((data) => {
    if (data) {
      updateStuForm.setFieldsValue({
        sns: data.sns,
        snsId: data.snsId,
        birth: data.birth.slice(0, 10),
        mobile: data.mobile,
        password: data.mobile.slice(-4),
        stuLiveCon: data.stuLiveCon,
        stuCountry: data.stuCountry,
        stuLanguage: data.stuLanguage,
        stuPayCount: data.stuPayCount,
        adminMemo: data.adminMemo,
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
    [selectedList, updateData, paymentList]
  );

  const onUpdateClassSubmit = useCallback(
    (data) => {
      let partLecture = data.partLecture && JSON.parse(data.partLecture);
      let lectureList = data.lectureList && JSON.parse(data.lectureList);

      if (lectureList) {
        if (moment() < moment(lectureList.startDate)) {
          return message.error(
            "수업 참여일이 수업 시작 날짜보다 과거일 수 없습니다."
          );
        }
      } else if (partLecture) {
        if (moment() < moment(partLecture.startDate.slice(0, 10))) {
          return message.error(
            "수업 참여일이 수업 시작 날짜보다 과거일 수 없습니다."
          );
        }
      }

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

    setPaymentData(arr);
  }, []);

  const detailModalOpen = useCallback((data) => {
    dispatch({
      type: PARTICIPANT_USER_DELETE_LIST_REQUEST,
      data: {
        UserId: data.id,
        isDelete: true,
        isChange: false,
      },
    });

    dispatch({
      type: PARTICIPANT_USER_MOVE_LIST_REQUEST,
      data: {
        UserId: data.id,
        isDelete: false,
        isChange: true,
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
      dispatch({
        type: USER_ADMIN_UPDATE_REQUEST,
        data: {
          id: stuDetail.id,
          birth: data.birth,
          mobile: data.mobile,
          password: data.password,
          stuCountry: data.stuCountry,
          stuLiveCon: data.stuLiveCon,
          stuLanguage: data.stuLanguage,
          sns: data.sns,
          snsId: data.snsId,
          stuPayCount: data.stuPayCount,
          adminMemo: data.adminMemo,
        },
      });
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

  ////// DATAVIEW //////

  const column = [
    {
      title: "번호",
      dataIndex: "stuNo",
    },

    {
      title: "회원이름",
      render: (data) => <div>{data.username}</div>,
    },
    {
      title: "회원아이디",
      render: (data) => <div>{data.userId}</div>,
    },
    {
      title: "이메일",
      render: (data) => <div>{data.email}</div>,
    },
    {
      title: "전화번호",
      render: (data) => <div>{data.mobile}</div>,
    },
    {
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
      title: "기능",
      render: (data) => (
        <Wrapper>
          <Button
            size="small"
            type="primary"
            onClick={() =>
              data.level === 5
                ? message.error("개발사는 권한을 수정할 수 없습니다.")
                : classChangeModalOpen(data)
            }>
            반 옮기기
          </Button>

          <Button
            size="small"
            onClick={() =>
              data.level === 5
                ? message.error("개발사는 권한을 수정할 수 없습니다.")
                : classPartModalOpen(data)
            }>
            수업참여
          </Button>

          <Button
            size="small"
            type="primary"
            onClick={() =>
              data.level === 5
                ? message.error("개발사는 권한을 수정할 수 없습니다.")
                : classPartEndModalOpen(data)
            }>
            수업빼기
          </Button>
        </Wrapper>
      ),
    },

    {
      title: "학생 강의 상세",
      render: (data) => (
        <Wrapper>
          <Button
            size="small"
            type="primary"
            onClick={() => detailModalOpen(data)}>
            강의내역보기
          </Button>

          <Button
            size="small"
            onClick={() =>
              data.level === 5
                ? message.error("개발사는 권한을 수정할 수 없습니다.")
                : classPartDetailModalOpen(data)
            }>
            학생정보보기
          </Button>
        </Wrapper>
      ),
    },

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
      title: "수업 이름",
      render: (data) => <div>{data.Lecture && data.Lecture.course}</div>,
    },

    {
      title: "요일",
      render: (data) => <div>{data.Lecture && data.Lecture.day}</div>,
    },

    {
      title: "시간",
      render: (data) => <div>{data.Lecture && data.Lecture.time}</div>,
    },

    {
      title: "수업 참여일",
      render: (data) => <div>{data.createdAt.slice(0, 10)}</div>,
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
        <div style={{ color: Theme.red_C }}>{`${data.lastDate}`}</div>
      ),
    },
  ];

  const country = [
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
    "S. Korea",
    "Singapore",
    "Spain",
    "Sweden",
    "Switzland",
    "Taiwan",
    "U.K.",
    "USA",

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
        <Wrapper dr={`row`} ju={`flex-start`} margin={`0 0 10px`}>
          <Input
            size="small"
            style={{ width: "20%" }}
            placeholder="사용자명"
            {...inputName}
          />
          <Input
            size="small"
            style={{ width: "20%" }}
            placeholder="이메일"
            {...inputEmail}
          />
          <Button size="small" onClick={() => onSeachStuHandler()}>
            <SearchOutlined />
            검색
          </Button>
        </Wrapper>

        <Table
          rowKey="id"
          columns={column}
          dataSource={allUsers ? allUsers : []}
          size="small"
        />
      </AdminContent>

      <Modal
        visible={classChangeModal}
        width={`400px`}
        title={`학생 수업 변경`}
        onCancel={classChangeModalClose}
        onOk={onModalOk}>
        <Wrapper padding={`10px`} al={`flex-start`}>
          <Form
            form={form}
            style={{ width: `100%` }}
            onFinish={(data) => onSubmit(data)}>
            <Form.Item label={`학생`}>
              <Input disabled value={updateData && updateData.username} />
            </Form.Item>

            <Form.Item label={`현재 강의`} name={`lecture`}>
              <Select
                width={`100%`}
                height={`32px`}
                showSearch
                placeholder="Select a Lecture">
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
                        value={`${data.LectureId},${data.date},${data.endDate}`}>
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
        onOk={onModalChangeOk}>
        <Wrapper padding={`10px`} al={`flex-start`}>
          <Form
            form={updateClassform}
            style={{ width: `100%` }}
            onFinish={onUpdateClassSubmit}>
            <Form.Item label={`학생`}>
              <Input disabled value={parData && parData.username} />
            </Form.Item>

            <Form.Item
              label="결제 여부"
              name="isPayment"
              rules={[
                { required: true, message: "결제 여부를 선택해주세요." },
              ]}>
              <Button
                style={{ marginRight: 10 }}
                type={isPayment === 1 && `primary`}
                onClick={() => buttonHandle(1)}>
                네
              </Button>
              <Button
                type={isPayment === 2 && `primary`}
                onClick={() => buttonHandle(2)}>
                아니요
              </Button>
            </Form.Item>

            {isPayment === 1 && (
              <Form.Item
                label={`참여할 강의`}
                name={`partLecture`}
                rules={[
                  { required: true, message: "참가시킬 강의를 선택해주세요." },
                ]}>
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
                  placeholder="Select a Lecture">
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
                  ]}>
                  <Select showSearch placeholder="Select a Lecture">
                    {allLectures && allLectures.length === 0
                      ? ""
                      : allLectures &&
                        allLectures.map((data, idx) => {
                          return (
                            <Select.Option
                              key={data.id}
                              value={JSON.stringify(data)}>
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
                  ]}>
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
        onOk={onSubmitEnd}>
        <Wrapper padding={`10px`} al={`flex-start`}>
          <Form
            form={updateEndClassform}
            style={{ width: `100%` }}
            onFinish={onEndClassSubmit}>
            <Form.Item label={`학생`} name={`userName`}>
              <Input disabled value={parEndData && parEndData.username} />
            </Form.Item>

            <Form.Item
              label={`종료할 강의`}
              name={`partLecture`}
              rules={[
                { required: true, message: "종료할 강의를 선택해주세요." },
              ]}>
              <Select
                width={`100%`}
                height={`32px`}
                showSearch
                placeholder="Select a Lecture">
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
        width={`80%`}
        title={`학생 강의 목록`}
        footer={null}
        onCancel={() => setDetailToggle(false)}>
        <Text
          padding={`16px 0px`}
          color={Theme.black_2C}
          fontSize={`16px`}
          fontWeight={`500`}>
          참여하고 있는 강의
          <SpanText color={Theme.red_C} fontSize={`14px`} margin={`0 0 0 10px`}>
            *수업 참여일:관리자가 학생의 수업을 참여시킨 날짜
          </SpanText>
        </Text>
        <Table
          rowKey="id"
          columns={columnsList}
          dataSource={detailDatum}
          size="small"
        />

        <Text
          padding={`16px 0px`}
          color={Theme.black_2C}
          fontSize={`16px`}
          fontWeight={`500`}>
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
          fontWeight={`500`}>
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
          fontWeight={`500`}>
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

      {console.log(stuDetail, "onStuFill")}

      <Modal
        visible={stuDetailModal}
        width={`1000px`}
        title={`학생 관리`}
        onCancel={() => setStuDetailModal(false)}
        footer={null}>
        <CustomForm form={updateStuForm} onFinish={updateStuFinish}>
          <Wrapper al={`flex-start`} ju={`flex-start`} margin={`0 0 50px`}>
            <Text fontSize={`16px`} fontWeight={`700`} margin={`0 0 10px`}>
              사용자가 정보 양식
            </Text>
            <Wrapper dr={`row`} al={`flex-start`}>
              <Wrapper width={`50%`} margin={`0 0 20px`}>
                <RowWrapper width={`100%`} margin={`0 0 10px`}>
                  <ColWrapper
                    width={`120px`}
                    height={`30px`}
                    bgColor={Theme.basicTheme_C}
                    color={Theme.white_C}
                    margin={`0 5px 0 0`}>
                    프로필 이미지
                  </ColWrapper>
                  <ColWrapper>
                    <Image
                      width={`184px`}
                      height={`190px`}
                      src={
                        stuDetail
                          ? `${stuDetail && stuDetail.profileImage}`
                          : `https://via.placeholder.com/184x190`
                      }
                    />
                  </ColWrapper>
                </RowWrapper>

                <RowWrapper width={`100%`} margin={`0 0 10px`}>
                  <ColWrapper
                    width={`120px`}
                    height={`30px`}
                    bgColor={Theme.basicTheme_C}
                    color={Theme.white_C}
                    margin={`0 5px 0 0`}>
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
                    margin={`0 5px 0 0`}>
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
                    margin={`0 5px 0 0`}>
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
                    margin={`0 5px 0 0`}>
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
                    margin={`0 5px 0 0`}>
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
                    margin={`0 5px 0 0`}>
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
                    margin={`0 0 20px`}>
                    <Calendar
                      style={{ width: width < 1350 ? `100%` : `300px` }}
                      fullscreen={false}
                      validRange={[moment(1970), moment()]}
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
                    margin={`0 5px 0 0`}>
                    국가
                  </ColWrapper>

                  <ColWrapper>
                    <FormItem name="stuCountry">
                      <CustomSelect>
                        {country &&
                          country.map((data, idx) => {
                            return (
                              <Select.Option key={idx} value={data}>
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
                    margin={`0 5px 0 0`}>
                    거주 국가
                  </ColWrapper>

                  <ColWrapper>
                    <FormItem name="stuLiveCon">
                      <CustomSelect>
                        {country &&
                          country.map((data, idx) => {
                            return (
                              <Select.Option key={idx} value={data}>
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
                    margin={`0 5px 0 0`}>
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
                    margin={`0 5px 0 0`}>
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
                    margin={`0 5px 0 0`}>
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
                    margin={`0 5px 0 0`}>
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
                <RowWrapper width={`100%`} margin={`0 0 10px`}>
                  <ColWrapper
                    width={`120px`}
                    height={`30px`}
                    bgColor={Theme.basicTheme_C}
                    color={Theme.white_C}
                    margin={`0 5px 0 0`}>
                    메모
                  </ColWrapper>
                  <ColWrapper width={`calc(100% - 125px)`}>
                    <FormItem name="adminMemo" width={`100%`}>
                      <TextArea
                        width={`100%`}
                        autoSize={{ minRows: 6 }}></TextArea>
                    </FormItem>
                  </ColWrapper>
                </RowWrapper>
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
                style={{ marginRight: 10 }}>
                취소
              </Button>

              <Button size={`small`} type="primary" htmlType="submit">
                수정
              </Button>
            </Wrapper>
          </ColWrapper>
        </CustomForm>
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

    // 구현부 종료
    context.store.dispatch(END);
    console.log("🍀 SERVER SIDE PROPS END");
    await context.store.sagaTask.toPromise();
  }
);

export default withRouter(List);
