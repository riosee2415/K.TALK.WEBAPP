import React, { useCallback, useEffect, useRef, useState } from "react";
import wrapper from "../../../store/configureStore";
import { END } from "redux-saga";
import axios from "axios";
import styled from "styled-components";
import AdminLayout from "../../../components/AdminLayout";
import PageHeader from "../../../components/admin/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Modal,
  Table,
  Input,
  message,
  Form,
  Select,
  DatePicker,
} from "antd";
import {
  Wrapper,
  Text,
  SpanText,
  TextInput,
  GuideDiv,
  ModalBtn,
} from "../../../components/commonComponents";
import { ColWrapper, RowWrapper } from "../../../components/commonComponents";
import Theme from "../../../components/Theme";
import {
  UPDATE_MODAL_CLOSE_REQUEST,
  UPDATE_MODAL_OPEN_REQUEST,
  APP_UPDATE_REQUEST,
  APP_LIST_REQUEST,
} from "../../../reducers/application";
import {
  LOAD_MY_INFO_REQUEST,
  USER_STU_CREATE_REQUEST,
  USER_TEACHER_LIST_REQUEST,
} from "../../../reducers/user";
import { PAYMENT_LIST_REQUEST } from "../../../reducers/payment";
import { LECTURE_ALL_LIST_REQUEST } from "../../../reducers/lecture";
import { useRouter } from "next/router";
import moment from "moment";

const FormItem = styled(Form.Item)`
  width: ${(props) => props.width};
  margin: 0px;

  @media (max-width: 700px) {
    width: 100%;
  }
`;

const CustomSelect = styled(Select)`
  margin: ${(props) => props.margin};

  &:not(.ant-select-customize-input) .ant-select-selector {
    border-radius: 5px;
    box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.16);
  }

  & .ant-select-selector {
    width: 350px !important;
    padding: 0 5px !important;
  }

  & .ant-select-arrow span svg {
    color: ${Theme.black_C};
  }

  & .ant-select-selection-placeholder {
    color: ${Theme.grey2_C};
  }
`;

const CustomTextArea = styled(Input.TextArea)`
  width: ${(props) => props.width || `100%`};
`;

const CustomDatePicker = styled(DatePicker)`
  width: ${(props) => props.width || `350px`};
`;

const CustomInput = styled(Input)`
  width: ${(props) => props.width || `350px`};
`;

const CustomForm = styled(Form)`
  width: 100%;

  & .ant-form-item {
    width: 100%;
    margin: 0 0 48px;
  }

  @media (max-width: 700px) {
    width: 100%;

    & .ant-form-item {
      margin: 0 0 28px;
    }
  }
`;

const CustomForm2 = styled(Form)`
  width: 100%;

  & .ant-form-item {
    margin: 0;
  }
`;

const AdminContent = styled.div`
  padding: 20px;
`;

const List = () => {
  // LOAD CURRENT INFO AREA /////////////////////////////////////////////
  const {
    me,
    st_loadMyInfoDone,
    teachers,
    st_userStuCreateDone,
    st_userStuCreateError,
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

  const [createData, setCreateData] = useState(null);
  const [createModal, setCreateModal] = useState(false);

  const [updateData, setUpdateData] = useState(null);

  const [createForm] = Form.useForm();
  const [updateForm] = Form.useForm();

  const [paymentOpt, setPaymentOpt] = useState(null);

  const [isPayment, setIsPayment] = useState();
  const [isTime, setIsTime] = useState("");

  const [time, setTime] = useState(false);

  const [statusType, setStatusType] = useState("");

  const { paymentList, st_paymentListDone, st_paymentListError } = useSelector(
    (state) => state.payment
  );

  const {
    applicationList,
    updateModal,

    st_appListDone,
    st_appListError,

    st_appUpdateDone,
    st_appUpdateError,
  } = useSelector((state) => state.app);

  const { st_lectureAllListDone, st_lectureAllListError, allLectures } =
    useSelector((state) => state.lecture);

  ////// USEEFFECT //////

  useEffect(() => {
    const qs = router.query;

    dispatch({
      type: APP_LIST_REQUEST,
      data: {
        isComplete: qs.type ? qs.type : null,
        isTime,
        time,
        status: statusType,
      },
    });
  }, [router.query, isTime, time, statusType]);

  useEffect(() => {
    if (st_appUpdateDone) {
      onReset();

      const qs = router.query;

      dispatch({
        type: APP_LIST_REQUEST,
        data: {
          isComplete: qs.type ? qs.type : null,
          isTime: false,
          time: "",
        },
      });

      return message.success("신청서 정보를 추가 및 수정했습니다.");
    }
  }, [st_appUpdateDone]);

  useEffect(() => {
    if (st_appUpdateDone) {
    }
  }, [st_appUpdateDone]);

  useEffect(() => {
    if (st_appUpdateError) {
      return message.error(st_appUpdateError);
    }
  }, [st_appUpdateError]);

  useEffect(() => {
    if (st_appListError) {
      return message.error(st_appListError);
    }
  }, [st_appListError]);

  useEffect(() => {
    if (st_paymentListDone) {
      const payOpt =
        paymentList &&
        paymentList.map((data) => {
          if (data.isComplete === 0) {
            return;
          }
          return (
            <Select.Option key={data.id} value={JSON.stringify(data)}>
              {`결제일: ${data.createdAt.slice(0, 10)} | ${data.course} | `}
              {`결제한 가격: $${data.price} |  ${data.email}`}
            </Select.Option>
          );
        });

      setPaymentOpt(payOpt);
    }
  }, [st_paymentListDone]);

  useEffect(() => {
    if (st_paymentListError) {
      return message.error(st_paymentListError);
    }
  }, [st_paymentListError]);

  useEffect(() => {
    if (st_userStuCreateDone) {
      onReset();

      const qs = router.query;

      dispatch({
        type: APP_LIST_REQUEST,
        data: {
          isComplete: qs.type ? qs.type : null,
          isTime: false,
          time: "",
        },
      });

      return message.success("회원을 생성 했습니다.");
    }
  }, [st_userStuCreateDone]);

  useEffect(() => {
    if (st_userStuCreateError) {
      return message.error(st_userStuCreateError);
    }
  }, [st_userStuCreateError]);

  useEffect(() => {
    if (st_lectureAllListDone) {
    }
  }, [st_lectureAllListDone]);

  useEffect(() => {
    if (st_lectureAllListError) {
      return message.error(st_lectureAllListError);
    }
  }, [st_lectureAllListError]);

  ////// TOGGLE //////

  const createModalToggle = useCallback((data) => {
    setCreateModal((prev) => !prev);

    if (data) {
      let password = data.phoneNumber2.slice(-4);
      createForm.setFieldsValue({
        userId: data.gmailAddress,
        password: password,
        repassword: password,
        username: `${data.firstName} ${data.lastName}`,
        mobile: `${data.phoneNumber}${data.phoneNumber2}`,
        email: data.gmailAddress,
        stuLanguage: data.languageYouUse,
        birth: data.dateOfBirth,
        stuJob: data.job,
        stuCountry: data.nationality,
        stuLiveCon: data.countryOfResidence,
      });
    }

    dispatch({
      type: PAYMENT_LIST_REQUEST,
      data: {
        email: data && data.gmailAddress,
        listType: 2,
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

    setCreateData(data);
  }, []);

  const updateModalOpen = useCallback((data) => {
    setUpdateData(data);
    if (data) {
      updateForm.setFieldsValue({
        timeDiff: data.timeDiff,
        wantStartDate: data.wantStartDate ? moment(data.wantStartDate) : "",
        teacher: data.teacher,
        isDiscount: data.isDiscount,
        meetDate: data.meetDate ? moment(data.meetDate) : "",
        level: data.level,
        job: data.job,
        purpose: data.purpose,
        freeTeacher: data.freeTeacher,
        status: data.status,
      });
    }

    dispatch({
      type: LECTURE_ALL_LIST_REQUEST,
      data: {
        TeacherId: "",
        studentName: "",
        time: "",
        startLv: "",
      },
    });

    dispatch({
      type: PAYMENT_LIST_REQUEST,
      data: {
        email: data && data.gmailAddress,
      },
    });

    dispatch({
      type: UPDATE_MODAL_OPEN_REQUEST,
    });
  }, []);

  ////// HANDLER //////

  const onReset = useCallback(() => {
    createForm.resetFields();
    updateForm.resetFields();

    dispatch({
      type: UPDATE_MODAL_CLOSE_REQUEST,
    });

    setIsPayment(0);
    setCreateModal(false);
    setCreateData(null);
    setUpdateData(null);
  }, [updateData, createData, createModal, updateModal, isPayment]);

  const createClick = useCallback(() => {
    createForm.submit();
  }, [createForm]);

  const updateClick = useCallback(() => {
    updateForm.submit();
  }, [updateForm]);

  const createFinish = useCallback(
    (data) => {
      if (isPayment === 0) {
        return message.error("결제 여부를 선택해주세요.");
      }

      let partLecture = data.paymentList && JSON.parse(data.paymentList);
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
        type: USER_STU_CREATE_REQUEST,
        data: {
          userId: data.userId,
          password: data.mobile.slice(-4),
          username: data.username,
          mobile: data.mobile,
          email: data.email,
          address: data.address,
          detailAddress: data.detailAddress,
          stuLanguage: data.stuLanguage,
          birth: data.birth,
          stuCountry: data.stuCountry,
          stuLiveCon: data.stuLiveCon,
          sns: data.sns,
          snsId: data.snsId,
          stuJob: data.stuJob,
          gender: data.gender,
          PaymentId: lectureList ? null : partLecture.id,
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
        },
      });
    },
    [isPayment]
  );

  const updateFinish = useCallback(
    (data) => {
      dispatch({
        type: APP_UPDATE_REQUEST,
        data: {
          id: updateData.id,
          timeDiff: data.timeDiff ? data.timeDiff : "",
          wantStartDate: data.wantStartDate
            ? data.wantStartDate.format("YYYY-MM-DD")
            : "",
          teacher: data.teacher ? data.teacher : "",
          freeTeacher: data.freeTeacher,
          isDiscount: data.isDiscount,
          meetDate: data.meetDate
            ? data.meetDate.format("YYYY-MM-DD HH:mm")
            : "",
          level: data.level ? data.level : "",
          job: data.job ? data.job : "",
          purpose: data.purpose ? data.purpose : "",
          status: data.status,
        },
      });
    },
    [updateData]
  );

  const buttonHandle = useCallback(
    (type) => {
      setIsPayment(type);

      createForm.setFieldsValue({
        isPayment: type,
      });
    },
    [createForm]
  );

  const onClickAllList = useCallback(() => {
    dispatch({
      type: APP_LIST_REQUEST,
      data: {
        isComplete: "",
        isTime: false,
        time: false,
        status: "",
      },
    });
    setIsTime(false);
    setStatusType("");
  }, []);

  const onChangeDate = useCallback((date) => {
    if (date) {
      setTime(date.format("YYYY-MM-DD hh:mm"));
    } else {
      setTime(null);
    }
  }, []);
  ////// DATAVIEW //////

  const stateList = ["등록", "잠정등록", "NoShow", "연기"];

  // Table
  const columns = [
    {
      title: "번호",
      dataIndex: "id",
    },

    {
      title: "이름",
      render: (data) => (
        <div>
          {data.firstName}&nbsp;{data.lastName}
        </div>
      ),
    },
    {
      title: "이메일",
      render: (data) => <div>{data.gmailAddress}</div>,
    },

    {
      title: "진행여부",
      render: (data) => <div>{data.status}</div>,
    },

    {
      title: "회원가입여부",
      render: (data) => <div>{data.completedAt ? `완료` : `미완료`}</div>,
    },

    {
      title: "줌 미팅일",
      render: (data) => {
        return <div>{data.meetDate ? data.meetDate : "-"}</div>;
      },
    },
    {
      title: "희망 시작일",
      render: (data) => {
        return <div>{data.wantStartDate ? data.wantStartDate : "-"}</div>;
      },
    },
    {
      title: "등록일",
      render: (data) => {
        return <div>{moment(data.createdAt).format("YYYY-MM-DD")}</div>;
      },
    },

    {
      title: "처리일",
      render: (data) => (
        <div>{moment(data.updatedAt).format("YYYY-MM-DD")}</div>
      ),
    },

    {
      title: "학생등록 및 상세정보",
      width: "100px",
      render: (data) => (
        <ColWrapper al={`flex-start`} width={`auto`}>
          {!Boolean(data.isComplete) && (
            <Button
              style={{ width: "100%" }}
              size={`small`}
              onClick={() => createModalToggle(data)}
            >
              학생 등록
            </Button>
          )}

          <Button
            type="primary"
            size={`small`}
            onClick={() => updateModalOpen(data)}
          >
            상세정보 및 정보추가
          </Button>
        </ColWrapper>
      ),
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

  return (
    <AdminLayout>
      <PageHeader
        breadcrumbs={["신청서 관리", "신청서 목록"]}
        title={`신청서 목록`}
        subTitle={`홈페이지의 사용자에게 입력받은 신청서 목록을 관리할 수 있습니다.`}
      />
      {/* <AdminTop createButton={true} createButtonAction={() => {})} /> */}

      <AdminContent>
        {/* ADMIN TOP MENU */}
        <Wrapper
          dr="row"
          ju="flex-start"
          margin="0px 0px 10px 0px"
          borderBottom={`1px dashed ${Theme.lightGrey_C}`}
          padding="5px 0px"
        >
          {/* <ModalBtn
            type={router.query.type === "true" && `primary`}
            size={`small`}
            onClick={() => moveLinkHandler(`/admin/application/list?type=true`)}
          >
            처리완료
          </ModalBtn>
          <ModalBtn
            type={router.query.type === "false" && `primary`}
            size={`small`}
            onClick={() =>
              moveLinkHandler(`/admin/application/list?type=false`)
            }
          >
            미처리
          </ModalBtn> */}

          <Select
            onChange={(e) => setStatusType(e)}
            style={{ width: `350px` }}
            size={`small`}
            value={statusType ? statusType : null}
            placeholder={"등록상태를 선택해주세요. Ex) NoShow"}
          >
            {stateList &&
              stateList.map((data, idx) => {
                return (
                  <Select.Option key={idx} value={data}>
                    {data}
                  </Select.Option>
                );
              })}
          </Select>

          {/* <Text fontSize={`14px`} color={Theme.basicTheme_C}>
              신청서 등록일 또는 미팅 일자로 검색하기
            </Text> */}

          <DatePicker
            size="small"
            showTime
            minuteStep={10}
            format="YYYY-MM-DD hh:mm"
            onChange={(e) => onChangeDate(e)}
          ></DatePicker>
          <Button
            type={!router.query.type && `primary`}
            size={`small`}
            onClick={() => onClickAllList()}
          >
            전체검색
          </Button>
        </Wrapper>
        {/* ADMIN TOP MENU END */}

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
            학생 등록하면 학생 관리에서 확인할 수 있습니다.
          </GuideDiv>
          <GuideDiv isImpo={true}>
            진행여부, 줌 미팅일 날짜로 신청서를 검색할 수 있습니다.
          </GuideDiv>
        </Wrapper>
        {/* ADMIN GUIDE AREA END*/}

        <Table
          rowKey="id"
          columns={columns}
          dataSource={applicationList ? applicationList : []}
          size="small"
        />
      </AdminContent>

      <Modal
        visible={updateModal}
        width={`800px`}
        title={`신청서`}
        onCancel={() => onReset()}
        onOk={() => updateClick()}
        okText="추가"
        cancelText="취소"
      >
        <Wrapper
          padding={`5px 0`}
          dr={`row`}
          borderBottom={`1px dashed ${Theme.lightGrey3_C}`}
        >
          <Wrapper width={`25%`} bgColor={Theme.lightGrey3_C} padding={`3px`}>
            신청일
          </Wrapper>
          <Wrapper width={`75%`} al={`flex-start`} padding={`0 10px`}>
            {updateData && updateData.createdAt.slice(0, 10)}
          </Wrapper>
        </Wrapper>

        <Wrapper
          padding={`5px 0`}
          dr={`row`}
          borderBottom={`1px dashed ${Theme.lightGrey3_C}`}
        >
          <Wrapper width={`25%`} bgColor={Theme.lightGrey3_C} padding={`3px`}>
            처리 완료일
          </Wrapper>
          <Wrapper width={`75%`} al={`flex-start`} padding={`0 10px`}>
            {updateData && updateData.completedAt
              ? updateData.completedAt.slice(0, 10)
              : `미완료`}
          </Wrapper>
        </Wrapper>

        <Text fontSize={`16px`} fontWeight={`700`} margin={`20px 0 10px`}>
          사용자가 입력한 양식
        </Text>

        <Wrapper
          padding={`5px 0`}
          dr={`row`}
          borderBottom={`1px dashed ${Theme.lightGrey3_C}`}
        >
          <Wrapper width={`25%`} bgColor={Theme.lightGrey3_C} padding={`3px`}>
            이름
          </Wrapper>
          <Wrapper width={`75%`} al={`flex-start`} padding={`0 10px`}>
            {updateData && updateData.firstName}&nbsp;
            {updateData && updateData.lastName}
          </Wrapper>
        </Wrapper>

        <Wrapper
          padding={`5px 0`}
          dr={`row`}
          borderBottom={`1px dashed ${Theme.lightGrey3_C}`}
        >
          <Wrapper width={`25%`} bgColor={Theme.lightGrey3_C} padding={`3px`}>
            생년월일
          </Wrapper>
          <Wrapper width={`75%`} al={`flex-start`} padding={`0 10px`}>
            {updateData && updateData.dateOfBirth}
          </Wrapper>
        </Wrapper>

        <Wrapper
          padding={`5px 0`}
          dr={`row`}
          borderBottom={`1px dashed ${Theme.lightGrey3_C}`}
        >
          <Wrapper width={`25%`} bgColor={Theme.lightGrey3_C} padding={`3px`}>
            이메일
          </Wrapper>
          <Wrapper width={`75%`} al={`flex-start`} padding={`0 10px`}>
            {updateData && updateData.gmailAddress}
          </Wrapper>
        </Wrapper>

        <Wrapper
          padding={`5px 0`}
          dr={`row`}
          borderBottom={`1px dashed ${Theme.lightGrey3_C}`}
        >
          <Wrapper width={`25%`} bgColor={Theme.lightGrey3_C} padding={`3px`}>
            국가
          </Wrapper>
          <Wrapper width={`75%`} al={`flex-start`} padding={`0 10px`}>
            {updateData && updateData.nationality}
          </Wrapper>
        </Wrapper>

        <Wrapper
          padding={`5px 0`}
          dr={`row`}
          borderBottom={`1px dashed ${Theme.lightGrey3_C}`}
        >
          <Wrapper width={`25%`} bgColor={Theme.lightGrey3_C} padding={`3px`}>
            거주 국가
          </Wrapper>
          <Wrapper width={`75%`} al={`flex-start`} padding={`0 10px`}>
            {updateData && updateData.countryOfResidence}
          </Wrapper>
        </Wrapper>

        <Wrapper
          padding={`5px 0`}
          dr={`row`}
          borderBottom={`1px dashed ${Theme.lightGrey3_C}`}
        >
          <Wrapper width={`25%`} bgColor={Theme.lightGrey3_C} padding={`3px`}>
            사용언어
          </Wrapper>
          <Wrapper width={`75%`} al={`flex-start`} padding={`0 10px`}>
            {updateData && updateData.languageYouUse}
          </Wrapper>
        </Wrapper>

        <Wrapper
          padding={`5px 0`}
          dr={`row`}
          borderBottom={`1px dashed ${Theme.lightGrey3_C}`}
        >
          <Wrapper width={`25%`} bgColor={Theme.lightGrey3_C} padding={`3px`}>
            휴대폰번호
          </Wrapper>
          <Wrapper width={`75%`} al={`flex-start`} padding={`0 10px`}>
            {updateData && updateData.phoneNumber}
            {updateData && updateData.phoneNumber2}
          </Wrapper>
        </Wrapper>

        <Wrapper
          padding={`5px 0`}
          dr={`row`}
          borderBottom={`1px dashed ${Theme.lightGrey3_C}`}
        >
          <Wrapper width={`25%`} bgColor={Theme.lightGrey3_C} padding={`3px`}>
            가능한 수업시간
          </Wrapper>
          <Wrapper width={`75%`} al={`flex-start`} padding={`0 10px`}>
            {updateData && updateData.classHour}
          </Wrapper>
        </Wrapper>

        <Wrapper
          padding={`5px 0`}
          dr={`row`}
          borderBottom={`1px dashed ${Theme.lightGrey3_C}`}
        >
          <Wrapper bgColor={Theme.lightGrey3_C} padding={`3px`}>
            내용
          </Wrapper>
          <Wrapper
            al={`flex-start`}
            padding={`10px`}
            minHeight={`200px`}
            ju={`flex-start`}
          >
            {updateData &&
              updateData.comment &&
              updateData.comment.split(`\n`).map((content, idx) => {
                return (
                  <SpanText key={`${content}${idx}`}>
                    {content}
                    <br />
                  </SpanText>
                );
              })}
          </Wrapper>
        </Wrapper>

        <CustomForm2
          form={updateForm}
          onFinish={updateFinish}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 24 }}
        >
          <Wrapper
            padding={`5px 0`}
            dr={`row`}
            borderBottom={`1px dashed ${Theme.lightGrey3_C}`}
          >
            <Wrapper width={`25%`} bgColor={Theme.lightGrey3_C} padding={`3px`}>
              등록상태
            </Wrapper>
            <Wrapper width={`75%`} al={`flex-start`} padding={`0 10px`}>
              <Form.Item name="status" style={{ width: `100%` }}>
                <Select
                  placeholder={`등록상태를 선택해주세요.`}
                  style={{ width: `100%` }}
                >
                  {stateList &&
                    stateList.map((data, idx) => {
                      return (
                        <Select.Option key={idx} value={data}>
                          {data}
                        </Select.Option>
                      );
                    })}
                </Select>
              </Form.Item>
            </Wrapper>
          </Wrapper>

          <Wrapper
            padding={`5px 0`}
            dr={`row`}
            borderBottom={`1px dashed ${Theme.lightGrey3_C}`}
          >
            <Wrapper width={`25%`} bgColor={Theme.lightGrey3_C} padding={`3px`}>
              줌 미팅 시간
            </Wrapper>
            <Wrapper width={`75%`} al={`flex-start`} padding={`0 10px`}>
              <Form.Item name="meetDate" style={{ width: `100%` }}>
                <CustomDatePicker
                  showTime={{ format: "HH:mm", minuteStep: 10 }}
                  format="YYYY-MM-DD HH:mm"
                  style={{ width: `100%` }}
                />
              </Form.Item>
            </Wrapper>
          </Wrapper>

          <Wrapper
            padding={`5px 0`}
            dr={`row`}
            borderBottom={`1px dashed ${Theme.lightGrey3_C}`}
          >
            <Wrapper width={`25%`} bgColor={Theme.lightGrey3_C} padding={`3px`}>
              시차
            </Wrapper>
            <Wrapper width={`75%`} al={`flex-start`} padding={`0 10px`}>
              <Form.Item name="timeDiff" style={{ width: `100%` }}>
                <Input />
              </Form.Item>
            </Wrapper>
          </Wrapper>

          <Wrapper
            padding={`5px 0`}
            dr={`row`}
            borderBottom={`1px dashed ${Theme.lightGrey3_C}`}
          >
            <Wrapper width={`25%`} bgColor={Theme.lightGrey3_C} padding={`3px`}>
              무료수업 담당 강사
            </Wrapper>
            <Wrapper width={`75%`} al={`flex-start`} padding={`0 10px`}>
              <Form.Item name="freeTeacher" style={{ width: `100%` }}>
                <Select
                  placeholder={`무료수업 담당강사를 선택해주세요.`}
                  style={{ width: `100%` }}
                >
                  {teachers &&
                    teachers.map((data, idx) => {
                      return (
                        <Select.Option key={data.id} value={data.username}>
                          {data.username}
                        </Select.Option>
                      );
                    })}
                </Select>
              </Form.Item>
            </Wrapper>
          </Wrapper>

          <Wrapper
            padding={`5px 0`}
            dr={`row`}
            borderBottom={`1px dashed ${Theme.lightGrey3_C}`}
          >
            <Wrapper width={`25%`} bgColor={Theme.lightGrey3_C} padding={`3px`}>
              담당 강사
            </Wrapper>
            <Wrapper width={`75%`} al={`flex-start`} padding={`0 10px`}>
              <Form.Item name="teacher" style={{ width: `100%` }}>
                <Select
                  style={{ width: `100%` }}
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
              </Form.Item>
            </Wrapper>
          </Wrapper>

          <Wrapper
            padding={`5px 0`}
            dr={`row`}
            borderBottom={`1px dashed ${Theme.lightGrey3_C}`}
          >
            <Wrapper width={`25%`} bgColor={Theme.lightGrey3_C} padding={`3px`}>
              희망 시작일
            </Wrapper>
            <Wrapper width={`75%`} al={`flex-start`} padding={`0 10px`}>
              <Form.Item name="wantStartDate" style={{ width: `100%` }}>
                <CustomDatePicker style={{ width: `100%` }} />
              </Form.Item>
            </Wrapper>
          </Wrapper>

          <Wrapper
            padding={`5px 0`}
            dr={`row`}
            borderBottom={`1px dashed ${Theme.lightGrey3_C}`}
          >
            <Wrapper width={`25%`} bgColor={Theme.lightGrey3_C} padding={`3px`}>
              레벨
            </Wrapper>
            <Wrapper width={`75%`} al={`flex-start`} padding={`0 10px`}>
              <FormItem name="level" style={{ width: `100%` }}>
                <Input />
              </FormItem>
            </Wrapper>
          </Wrapper>

          <Wrapper
            padding={`5px 0`}
            dr={`row`}
            borderBottom={`1px dashed ${Theme.lightGrey3_C}`}
          >
            <Wrapper width={`25%`} bgColor={Theme.lightGrey3_C} padding={`3px`}>
              직업
            </Wrapper>
            <Wrapper width={`75%`} al={`flex-start`} padding={`0 10px`}>
              <Form.Item name="job" style={{ width: `100%` }}>
                <Input />
              </Form.Item>
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
              <Form.Item style={{ width: `100%` }} name="purpose">
                <CustomTextArea
                  rows={6}
                  border={`1px solid ${Theme.grey_C} !important`}
                />
              </Form.Item>
            </Wrapper>
          </Wrapper>
        </CustomForm2>

        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/* <Wrapper al={`flex-start`} ju={`flex-start`} margin={`0 0 50px`}>
          <Wrapper dr={`row`} al={`flex-start`}>
            <Wrapper width={`50%`} al={`flex-start`} margin={`0 0 20px`}>
              <RowWrapper width={`100%`} margin={`0 0 10px`}>
                <ColWrapper
                  width={`140px`}
                  height={`30px`}
                  bgColor={Theme.basicTheme_C}
                  color={Theme.white_C}
                  margin={`0 5px 0 0`}
                >
                  이름
                </ColWrapper>
                <ColWrapper
                  al={`flex-start`}
                  width={`calc(100% - 140px - 10px)`}
                >
                  {updateData && updateData.firstName}&nbsp;
                  {updateData && updateData.lastName}
                </ColWrapper>
              </RowWrapper>

              <RowWrapper width={`100%`} margin={`0 0 10px`}>
                <ColWrapper
                  width={`140px`}
                  height={`30px`}
                  bgColor={Theme.basicTheme_C}
                  color={Theme.white_C}
                  margin={`0 5px 0 0`}
                >
                  생년월일
                </ColWrapper>
                <ColWrapper
                  al={`flex-start`}
                  width={`calc(100% - 140px - 10px)`}
                >
                  {updateData && updateData.dateOfBirth}
                </ColWrapper>
              </RowWrapper>

              <RowWrapper width={`100%`} margin={`0 0 10px`}>
                <ColWrapper
                  width={`140px`}
                  height={`30px`}
                  bgColor={Theme.basicTheme_C}
                  color={Theme.white_C}
                  margin={`0 5px 0 0`}
                >
                  이메일
                </ColWrapper>
                <ColWrapper
                  al={`flex-start`}
                  width={`calc(100% - 140px - 10px)`}
                >
                  {updateData && updateData.gmailAddress}
                </ColWrapper>
              </RowWrapper>

              <RowWrapper width={`100%`} margin={`0 0 10px`}>
                <ColWrapper
                  width={`140px`}
                  height={`30px`}
                  bgColor={Theme.basicTheme_C}
                  color={Theme.white_C}
                  margin={`0 5px 0 0`}
                >
                  국가
                </ColWrapper>
                <ColWrapper
                  al={`flex-start`}
                  width={`calc(100% - 140px - 10px)`}
                >
                  {updateData && updateData.nationality}
                </ColWrapper>
              </RowWrapper>

              <RowWrapper width={`100%`} margin={`0 0 10px`}>
                <ColWrapper
                  width={`140px`}
                  height={`30px`}
                  bgColor={Theme.basicTheme_C}
                  color={Theme.white_C}
                  margin={`0 5px 0 0`}
                >
                  거주 국가
                </ColWrapper>
                <ColWrapper
                  al={`flex-start`}
                  width={`calc(100% - 140px - 10px)`}
                >
                  {updateData && updateData.countryOfResidence}
                </ColWrapper>
              </RowWrapper>

              <RowWrapper width={`100%`} margin={`0 0 10px`}>
                <ColWrapper
                  width={`140px`}
                  height={`30px`}
                  bgColor={Theme.basicTheme_C}
                  color={Theme.white_C}
                  margin={`0 5px 0 0`}
                >
                  사용언어
                </ColWrapper>
                <ColWrapper
                  al={`flex-start`}
                  width={`calc(100% - 140px - 10px)`}
                >
                  {updateData && updateData.languageYouUse}
                </ColWrapper>
              </RowWrapper>

              <RowWrapper width={`100%`} margin={`0 0 10px`}>
                <ColWrapper
                  width={`140px`}
                  height={`30px`}
                  bgColor={Theme.basicTheme_C}
                  color={Theme.white_C}
                  margin={`0 5px 0 0`}
                >
                  휴대폰번호
                </ColWrapper>
                <ColWrapper
                  al={`flex-start`}
                  width={`calc(100% - 140px - 10px)`}
                >
                  {updateData && updateData.phoneNumber}
                  {updateData && updateData.phoneNumber2}
                </ColWrapper>
              </RowWrapper>

              <RowWrapper margin={`0 0 10px`}>
                <ColWrapper
                  width={`140px`}
                  height={`30px`}
                  bgColor={Theme.basicTheme_C}
                  color={Theme.white_C}
                  margin={`0 5px 0 0`}
                >
                  가능한 수업시간
                </ColWrapper>
                <ColWrapper
                  al={`flex-start`}
                  width={`calc(100% - 140px - 10px)`}
                >
                  {updateData && updateData.classHour}
                </ColWrapper>
              </RowWrapper>
            </Wrapper>
            <Wrapper width={`50%`} margin={`0 0 10px`} al={`flex-start`}>
              <ColWrapper
                width={`100%`}
                height={`30px`}
                bgColor={Theme.basicTheme_C}
                color={Theme.white_C}
                margin={`0 5px 0 0`}
              >
                내용
              </ColWrapper>
              <ColWrapper width={`100%`} al={`flex-start`}>
                {updateData &&
                  updateData.comment &&
                  updateData.comment.split(`\n`).map((content, idx) => {
                    return (
                      <SpanText key={`${content}${idx}`}>
                        {content}
                        <br />
                      </SpanText>
                    );
                  })}
              </ColWrapper>
            </Wrapper>

            <Wrapper al={`flex-start`}>
              <CustomForm2
                form={updateForm}
                onFinish={updateFinish}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 24 }}
              >
                <Wrapper>
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
                      등록상태
                    </ColWrapper>
                    <ColWrapper>
                      <Form.Item name="status">
                        <CustomSelect placeholder={`등록상태를 선택해주세요.`}>
                          {stateList &&
                            stateList.map((data, idx) => {
                              return (
                                <Select.Option key={idx} value={data}>
                                  {data}
                                </Select.Option>
                              );
                            })}
                        </CustomSelect>
                      </Form.Item>
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
                      줌 미팅 시간
                    </ColWrapper>
                    <ColWrapper>
                      <Form.Item name="meetDate">
                        <CustomDatePicker
                          showTime={{ format: "HH:mm", minuteStep: 10 }}
                          format="YYYY-MM-DD HH:mm"
                        />
                      </Form.Item>
                    </ColWrapper>
                  </RowWrapper>

                  <RowWrapper
                    dr={`row`}
                    ju={`flex-start`}
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
                      무료수업 담당 강사
                    </ColWrapper>
                    <ColWrapper>
                      <Form.Item name="freeTeacher">
                        <CustomSelect
                          placeholder={`무료수업 담당강사를 선택해주세요.`}
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
                        </CustomSelect>
                      </Form.Item>
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
                    <ColWrapper dr={`row`}>
                      <Form.Item name="teacher">
                        <CustomSelect
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
                        </CustomSelect>
                      </Form.Item>
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
                      희망 시작일
                    </ColWrapper>
                    <ColWrapper>
                      <Form.Item name="wantStartDate">
                        <CustomDatePicker />
                      </Form.Item>
                    </ColWrapper>
                  </RowWrapper>

                  <RowWrapper width={`100%`} al={`flex-start`}>
                <ColWrapper
                  width={`140px`}
                  height={`30px`}
                  bgColor={Theme.basicTheme_C}
                  color={Theme.white_C}
                  margin={`0 5px 0 0`}
                >
                  할인 여부
                </ColWrapper>
                <ColWrapper>
                  <FormItem name="isDiscount">
                    <Switch
                      defaultChecked={updateForm.getFieldValue("isDiscount")}
                      onChange={(e) => onChangeSwitch(e)}
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
                      직업
                    </ColWrapper>
                    <ColWrapper>
                      <Form.Item name="job">
                        <CustomInput />
                      </Form.Item>
                    </ColWrapper>
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
                    <ColWrapper width={`80%`} al={`flex-start`}>
                      <FormItem width={`100%`} name="purpose">
                        <CustomTextArea
                          rows={6}
                          border={`1px solid ${Theme.grey_C} !important`}
                        />
                      </FormItem>
                    </ColWrapper>
                  </RowWrapper>
                </Wrapper>
              </CustomForm2>
            </Wrapper>
          </Wrapper>
        </Wrapper> */}

        <Text fontSize={`16px`} fontWeight={`700`} margin={`20px 0 10px`}>
          학생 결제 목록
        </Text>

        <Table
          rowKey="id"
          columns={columnsPayList}
          dataSource={paymentList ? paymentList : []}
          size="small"
        />
      </Modal>

      {/* 학생 생성 */}

      <Modal
        visible={createModal}
        width={`1000px`}
        title={`학생 등록`}
        onCancel={() => onReset()}
        onOk={() => createClick()}
        okText="생성"
        cancelText="취소"
      >
        <CustomForm
          form={createForm}
          onFinish={createFinish}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
        >
          <Form.Item
            label="이메일"
            name="email"
            onChange={(e) =>
              createForm.setFieldsValue({
                userId: e.target.value,
              })
            }
          >
            <Input type="email" />
          </Form.Item>
          <Form.Item label="회원아이디" name="userId">
            <Input disabled />
          </Form.Item>
          <Form.Item label="회원이름" name="username">
            <Input />
          </Form.Item>
          <Form.Item label="생년월일" name="birth">
            <Input />
          </Form.Item>
          <Form.Item label="전화번호" name="mobile">
            <Input />
          </Form.Item>
          <Form.Item label="학생 직업" name="stuJob">
            <Input />
          </Form.Item>
          <Form.Item label="학생 언어" name="stuLanguage">
            <Input />
          </Form.Item>
          <Form.Item label="학생 나라" name="stuCountry">
            <Input />
          </Form.Item>
          <Form.Item label="현재 거주 나라" name="stuLiveCon">
            <Input />
          </Form.Item>
          <Form.Item label="결제 여부" name="isPayment">
            <Button
              style={{ marginRight: 10 }}
              type={isPayment === 1 && `primary`}
              onClick={() => buttonHandle(1)}
            >
              네
            </Button>

            <Button
              type={isPayment === 2 && `primary`}
              onClick={() => buttonHandle(2)}
            >
              아니요
            </Button>

            {/* <Select
              showSearch
              placeholder="Select a Lecture"
              onChange={(e) => setIsPayment(e)}>
              <Select.Option value={1}>네</Select.Option>
              <Select.Option value={2}>아니요</Select.Option>
            </Select> */}
          </Form.Item>

          {isPayment === 1 && (
            <Form.Item
              label="결제 목록"
              name="paymentList"
              rules={[{ message: "결제 목록을 선택해주세요.", required: true }]}
            >
              <Select showSearch placeholder="Select a Lecture">
                {paymentOpt}
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
                            {`${data.number} | ${data.course} | ${data.User.username} | ${data.day} | ${data.time}`}
                          </Select.Option>
                        );
                      })}
                </Select>
              </Form.Item>

              <Form.Item
                label="강의 기간"
                name="date"
                rules={[{ message: "강의기간 입력해주세요.", required: true }]}
              >
                <Wrapper dr={`row`}>
                  <TextInput
                    width={`calc(100% - 30px)`}
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

          <Form.Item
            label="성별"
            rules={[{ required: true, message: "생별을 선택해주세요." }]}
            name="gender"
          >
            <Select>
              <Select.Option value={`남`}>남자</Select.Option>
              <Select.Option value={`여`}>여자</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="주소"
            rules={[{ message: "주소를 입력해주세요." }]}
            name="address"
          >
            <Input />
          </Form.Item>

          <Form.Item label="sns" name="sns">
            <Input />
          </Form.Item>
          <Form.Item label="sns아이디" name="snsId">
            <Input />
          </Form.Item>
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

    context.store.dispatch({
      type: USER_TEACHER_LIST_REQUEST,
    });

    // 구현부 종료
    context.store.dispatch(END);
    console.log("🍀 SERVER SIDE PROPS END");
    await context.store.sagaTask.toPromise();
  }
);

export default List;
