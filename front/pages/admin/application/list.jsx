import React, { useCallback, useEffect, useRef, useState } from "react";
import AdminLayout from "../../../components/AdminLayout";
import PageHeader from "../../../components/admin/PageHeader";
import AdminTop from "../../../components/admin/AdminTop";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Col,
  Modal,
  Row,
  Table,
  notification,
  Layout,
  Input,
  message,
  Form,
  Calendar,
  Select,
  Switch,
  DatePicker,
} from "antd";
import {
  Wrapper,
  Text,
  SpanText,
  TextInput,
} from "../../../components/commonComponents";
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
import { useRouter } from "next/router";

import wrapper from "../../../store/configureStore";
import { END } from "redux-saga";
import axios from "axios";
import {
  ColWrapper,
  RowWrapper,
  TextArea,
} from "../../../components/commonComponents";
import { saveAs } from "file-saver";
import Theme from "../../../components/Theme";
import { PAYMENT_LIST_REQUEST } from "../../../reducers/payment";
import useWidth from "../../../hooks/useWidth";
import moment from "moment";
import {
  LECTURE_ALL_LIST_REQUEST,
  LECTURE_TEACHER_LIST_REQUEST,
} from "../../../reducers/lecture";

const FormItem = styled(Form.Item)`
  width: 80%;

  @media (max-width: 700px) {
    width: 100%;
  }
`;

const CustomInput = styled(Input)`
  width: ${(props) => props.width};
`;

const CustomForm = styled(Form)`
  width: 718px;

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

  @media (max-width: 700px) {
  }
`;

const AdminContent = styled.div`
  padding: 20px;
`;

const LoadNotification = (msg, content) => {
  notification.open({
    message: msg,
    description: content,
    onClick: () => {},
  });
};

const List = ({ location }) => {
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

  const [isPayment, setIsPayment] = useState(0);

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
      data: { isComplete: qs.type ? qs.type : null },
    });
  }, [router.query]);

  useEffect(() => {
    if (st_appUpdateDone) {
      onReset();

      const qs = router.query;

      dispatch({
        type: APP_LIST_REQUEST,
        data: { isComplete: qs.type ? qs.type : null },
      });

      return message.success("신청서 정보를 추가했습니다.");
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
          return (
            <Select.Option
              key={data.id}
              value={`${data.id},${data.LetureId},${data.week},${data.email}`}>
              {data.createdAt.slice(0, 10)} | {data.course} | &#36;{data.price}{" "}
              | &nbsp;{data.email}
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
        data: { isComplete: qs.type ? qs.type : null },
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
    onFillUser(data);

    dispatch({
      type: PAYMENT_LIST_REQUEST,
      data: {
        email: data && data.gmailAddress,
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
    onFillApp(data);
    setUpdateData(data);

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

      console.log({
        userId: data.userId,
        password: data.password,
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
        PaymentId:
          data && data.paymentList ? data.paymentList.split(",")[0] : null,
        LectureId:
          data && data.lectureList
            ? data.lectureList
            : data.paymentList.split(",")[1],
        date: data.date
          ? String(data.date * 7)
          : parseInt(data.paymentList.split(",")[2]) * 7,
        endDate: data.date
          ? moment()
              .add(parseInt(data.date) * 7, "days")
              .format("YYYY-MM-DD")
          : moment()
              .add(parseInt(data.paymentList.split(",")[2]) * 7, "days")
              .format("YYYY-MM-DD"),
      });

      dispatch({
        type: USER_STU_CREATE_REQUEST,
        data: {
          userId: data.userId,
          password: data.password,
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
          PaymentId:
            data && data.paymentList ? data.paymentList.split(",")[0] : null,
          LectureId:
            data && data.lectureList
              ? data.lectureList
              : data.paymentList.split(",")[1],
          date: data.date
            ? String(data.date * 7)
            : parseInt(data.paymentList.split(",")[2]) * 7,
          endDate: data.date
            ? moment()
                .add(parseInt(data.date) * 7, "days")
                .format("YYYY-MM-DD")
            : moment()
                .add(parseInt(data.paymentList.split(",")[2]) * 7, "days")
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
          timeDiff: data.timeDiff,
          wantStartDate: data.wantStartDate.format("YYYY-MM-DD"),
          teacher: data.teacher,
          isDiscount: data.isDiscount,
          meetDate: data.meetDate.format("YYYY-MM-DD"),
          level: data.level,
          job: data.job,
          purpose: data.purpose,
        },
      });
    },
    [updateData]
  );

  const onFillUser = useCallback((data) => {
    if (data) {
      let password = data.phoneNumber2.slice(-4);

      createForm.setFieldsValue({
        userId: data.gmailAddress,
        password: password,
        repassword: password,
        username: `${data.firstName}${data.lastName}`,
        mobile: `${data.phoneNumber}${data.phoneNumber2}`,
        email: data.gmailAddress,
        stuLanguage: data.languageYouUse,
        birth: data.dateOfBirth,
        stuJob: data.job,
        stuCountry: data.nationality,
        stuLiveCon: data.countryOfResidence,
      });
    }
  }, []);

  const onFillApp = useCallback(
    (data) => {
      if (data) {
        if (data.wantStartDate) {
          updateForm.setFieldsValue({
            timeDiff: data.timeDiff,
            wantStartDate: moment(data.wantStartDate),
            teacher: data.teacher,
            isDiscount: data.isDiscount,
            meetDate: moment(data.meetDate),
            level: data.level,
            job: data.job,
            purpose: data.purpose,
          });
        } else {
          updateForm.setFieldsValue({
            timeDiff: data.timeDiff,
            teacher: data.teacher,
            isDiscount: data.isDiscount,
            level: data.level,
            job: data.job,
            purpose: data.purpose,
          });
        }
      }
    },
    [updateForm]
  );

  const onChangeSwitch = useCallback((e) => {
    updateForm.setFieldsValue({
      isDiscount: e ? 1 : 0,
    });
  }, []);

  ////// DATAVIEW //////

  const levelData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  // Table
  const columns = [
    {
      title: "No",
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
      title: "처리 여부",
      render: (data) => <div>{data.completedAt ? `완료` : `미완료`}</div>,
    },
    ,
    {
      title: "등록일",
      render: (data) => {
        return <div>{data.createdAt.substring(0, 10)}</div>;
      },
    },

    {
      title: "처리일",
      render: (data) => <div>{data.updatedAt.substring(0, 10)}</div>,
    },

    {
      title: "신청자",

      render: (data) => (
        <ColWrapper al={`flex-start`}>
          {!Boolean(data.isComplete) && (
            <Button size={`small`} onClick={() => createModalToggle(data)}>
              회원 생성
            </Button>
          )}

          <Button
            type="primary"
            size={`small`}
            onClick={() => updateModalOpen(data)}>
            정보 추가
          </Button>
        </ColWrapper>
      ),
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
        <RowWrapper margin={`0 0 10px 0`} gutter={5}>
          <Col>
            <Button onClick={() => moveLinkHandler(`/admin/application/list`)}>
              전체
            </Button>
          </Col>
          <Col>
            <Button
              onClick={() =>
                moveLinkHandler(`/admin/application/list?type=true`)
              }>
              처리완료
            </Button>
          </Col>
          <Col>
            <Button
              onClick={() =>
                moveLinkHandler(`/admin/application/list?type=false`)
              }>
              미처리
            </Button>
          </Col>
        </RowWrapper>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={applicationList ? applicationList : []}
          size="small"
        />
      </AdminContent>

      <Modal
        visible={updateModal}
        width={`1000px`}
        title={`신청서`}
        onCancel={() => onReset()}
        onOk={() => updateClick()}
        okText="추가"
        cancelText="취소">
        <Wrapper dr={`row`} ju={`flex-start`} margin={`0 0 20px`}>
          <Text fontSize={`16px`} fontWeight={`700`} margin={`0 20px 0 0`}>
            신청일 |&nbsp;{updateData && updateData.createdAt.slice(0, 10)}
          </Text>
          <Text fontSize={`16px`} fontWeight={`700`}>
            처리 완료일 |&nbsp;
            {updateData && updateData.completedAt
              ? updateData.completedAt.slice(0, 10)
              : `미완료`}
          </Text>
        </Wrapper>
        <Wrapper al={`flex-start`} ju={`flex-start`} margin={`0 0 50px`}>
          <Text fontSize={`16px`} fontWeight={`700`} margin={`0 0 10px`}>
            사용자가 입력한 양식
          </Text>
          <Wrapper dr={`row`} al={`flex-start`}>
            <Wrapper width={`50%`} al={`flex-start`} margin={`0 0 20px`}>
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
                  {updateData && updateData.firstName}&nbsp;
                  {updateData && updateData.lastName}
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
                <ColWrapper>{updateData && updateData.dateOfBirth}</ColWrapper>
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
                <ColWrapper>{updateData && updateData.gmailAddress}</ColWrapper>
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
                <ColWrapper>{updateData && updateData.nationality}</ColWrapper>
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
                  {updateData && updateData.countryOfResidence}
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
                  {updateData && updateData.languageYouUse}
                </ColWrapper>
              </RowWrapper>

              <RowWrapper width={`100%`} margin={`0 0 10px`}>
                <ColWrapper
                  width={`120px`}
                  height={`30px`}
                  bgColor={Theme.basicTheme_C}
                  color={Theme.white_C}
                  margin={`0 5px 0 0`}>
                  휴대폰번호
                </ColWrapper>
                <ColWrapper>
                  {updateData && updateData.phoneNumber}
                  {updateData && updateData.phoneNumber2}
                </ColWrapper>
              </RowWrapper>

              <RowWrapper width={`100%`} margin={`0 0 10px`}>
                <ColWrapper
                  width={`120px`}
                  height={`30px`}
                  bgColor={Theme.basicTheme_C}
                  color={Theme.white_C}
                  margin={`0 5px 0 0`}>
                  가능한 수업시간
                </ColWrapper>
                <ColWrapper>{updateData && updateData.classHour}</ColWrapper>
              </RowWrapper>
            </Wrapper>
            <Wrapper width={`50%`} margin={`0 0 10px`} al={`flex-start`}>
              <ColWrapper
                width={`100%`}
                height={`30px`}
                bgColor={Theme.basicTheme_C}
                color={Theme.white_C}
                margin={`0 5px 0 0`}>
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
          </Wrapper>
        </Wrapper>

        <Wrapper al={`flex-start`}>
          <CustomForm2
            form={updateForm}
            onFinish={updateFinish}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 24 }}>
            <Wrapper>
              <Wrapper dr={`row`} ju={`flex-start`} al={`flex-start`}>
                <Wrapper
                  width={`120px`}
                  height={`30px`}
                  bgColor={Theme.basicTheme_C}
                  color={Theme.white_C}
                  margin={`0 5px 0 0`}>
                  시차
                </Wrapper>

                <FormItem
                  rules={[{ required: true, message: "시차를 입력해주세요." }]}
                  name="timeDiff">
                  <CustomInput min={1} type={`number`} width={`100%`} />
                </FormItem>
              </Wrapper>

              <RowWrapper width={`100%`} al={`flex-start`}>
                <ColWrapper
                  width={`120px`}
                  height={`30px`}
                  bgColor={Theme.basicTheme_C}
                  color={Theme.white_C}
                  margin={`0 5px 0 0`}>
                  원하는 날짜
                </ColWrapper>
                <ColWrapper>
                  <Form.Item
                    rules={[
                      { required: true, message: "날짜를 입력해주세요." },
                    ]}
                    name="wantStartDate">
                    <DatePicker />
                  </Form.Item>
                </ColWrapper>
              </RowWrapper>

              <RowWrapper width={`100%`} al={`flex-start`}>
                <ColWrapper
                  width={`120px`}
                  height={`30px`}
                  bgColor={Theme.basicTheme_C}
                  color={Theme.white_C}
                  margin={`0 5px 0 0`}>
                  담당강사
                </ColWrapper>
                <ColWrapper>
                  <Form.Item
                    rules={[
                      { required: true, message: "날짜를 입력해주세요." },
                    ]}
                    name="teacher">
                    <Select
                      style={{ width: `200px` }}
                      placeholder={`강사를 선택해주세요.`}>
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
                </ColWrapper>
              </RowWrapper>

              <RowWrapper width={`100%`} al={`flex-start`}>
                <ColWrapper
                  width={`120px`}
                  height={`30px`}
                  bgColor={Theme.basicTheme_C}
                  color={Theme.white_C}
                  margin={`0 5px 0 0`}>
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

              <RowWrapper width={`100%`} al={`flex-start`}>
                <ColWrapper
                  width={`120px`}
                  height={`30px`}
                  bgColor={Theme.basicTheme_C}
                  color={Theme.white_C}
                  margin={`0 5px 0 0`}>
                  줌 미팅 날짜
                </ColWrapper>
                <ColWrapper>
                  <Form.Item
                    rules={[
                      { required: true, message: "날짜를 입력해주세요." },
                    ]}
                    name="meetDate">
                    <DatePicker />
                  </Form.Item>
                </ColWrapper>
              </RowWrapper>

              <RowWrapper width={`100%`} al={`flex-start`}>
                <ColWrapper
                  width={`120px`}
                  height={`30px`}
                  bgColor={Theme.basicTheme_C}
                  color={Theme.white_C}
                  margin={`0 5px 0 0`}>
                  레벨
                </ColWrapper>
                <ColWrapper>
                  <Form.Item
                    rules={[
                      { required: true, message: "레벨을 입력해주세요." },
                    ]}
                    name="level">
                    <Select style={{ width: 176 }}>
                      {levelData.map((data, idx) => {
                        return (
                          <Select.Option key={idx} value={data}>
                            {data}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </ColWrapper>
              </RowWrapper>

              <RowWrapper width={`100%`} al={`flex-start`}>
                <ColWrapper
                  width={`120px`}
                  height={`30px`}
                  bgColor={Theme.basicTheme_C}
                  color={Theme.white_C}
                  margin={`0 5px 0 0`}>
                  직업
                </ColWrapper>
                <ColWrapper>
                  <Form.Item
                    rules={[
                      { required: true, message: "직업를 입력해주세요." },
                    ]}
                    name="job">
                    <CustomInput width={`100%`} />
                  </Form.Item>
                </ColWrapper>
              </RowWrapper>

              <RowWrapper al={`flex-start`}>
                <ColWrapper
                  width={`120px`}
                  height={`30px`}
                  bgColor={Theme.basicTheme_C}
                  color={Theme.white_C}
                  margin={`0 5px 0 0`}>
                  배우는 목적
                </ColWrapper>
                <ColWrapper width={`80%`} al={`flex-start`}>
                  <FormItem
                    rules={[
                      {
                        required: true,
                        message: "배우는 목적을 입력해주세요.",
                      },
                    ]}
                    name="purpose">
                    <TextArea height={`200px`} width={`100%`} />
                  </FormItem>
                </ColWrapper>
              </RowWrapper>
            </Wrapper>
          </CustomForm2>
        </Wrapper>
      </Modal>

      {/* 학생 생성 */}

      <Modal
        visible={createModal}
        width={`1000px`}
        title={`학생 생성`}
        onCancel={() => onReset()}
        onOk={() => createClick()}
        okText="생성"
        cancelText="취소">
        <CustomForm
          form={createForm}
          onFinish={createFinish}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}>
          <Form.Item label="이메일" name="email">
            <Input disabled type="email" />
          </Form.Item>
          <Form.Item label="회원아이디" name="userId">
            <Input disabled />
          </Form.Item>
          <Form.Item label="회원이름" name="username">
            <Input disabled />
          </Form.Item>
          <Form.Item label="생년월일" name="birth">
            <Input disabled />
          </Form.Item>
          <Form.Item label="전화번호" name="mobile">
            <Input disabled />
          </Form.Item>
          <Form.Item label="비밀번호" name="password">
            <Input type="password" disabled />
          </Form.Item>
          <Form.Item label="비밀번호 재입력" name="repassword">
            <Input type="password" disabled />
          </Form.Item>
          <Form.Item label="학생 직업" name="stuJob">
            <Input disabled />
          </Form.Item>
          <Form.Item label="학생 언어" name="stuLanguage">
            <Input disabled />
          </Form.Item>
          <Form.Item label="학생 나라" name="stuCountry">
            <Input disabled />
          </Form.Item>
          <Form.Item label="현재 거주 나라" name="stuLiveCon">
            <Input disabled />
          </Form.Item>
          <Form.Item label="결제 여부" name="isPayment">
            <Select
              showSearch
              placeholder="Select a Lecture"
              onChange={(e) => setIsPayment(e)}>
              <Select.Option value={1}>네</Select.Option>
              <Select.Option value={2}>아니요</Select.Option>
            </Select>
          </Form.Item>

          {isPayment === 1 && (
            <Form.Item
              label="결제 목록"
              name="paymentList"
              rules={[
                { message: "결제 목록을 선택해주세요.", required: true },
              ]}>
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
                ]}>
                <Select showSearch placeholder="Select a Lecture">
                  {allLectures && allLectures.length === 0
                    ? ""
                    : allLectures &&
                      allLectures.map((data, idx) => {
                        if (
                          createData &&
                          createData.teacher !== data.User.username
                        )
                          return;

                        return (
                          <Select.Option key={data.id} value={data.id}>
                            {`${data.course} | ${data.User.username}`}
                          </Select.Option>
                        );
                      })}
                </Select>
              </Form.Item>

              <Form.Item
                label="강의 기간"
                name="date"
                rules={[{ message: "강의기간 입력해주세요.", required: true }]}>
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
            name="gender">
            <Select>
              <Select.Option value={`남`}>남자</Select.Option>
              <Select.Option value={`여`}>여자</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="주소"
            rules={[{ required: true, message: "주소를 입력해주세요." }]}
            name="address">
            <Input />
          </Form.Item>
          <Form.Item
            label="상세주소"
            rules={[{ required: true, message: "상세주소를 입력해주세요." }]}
            name="detailAddress">
            <Input />
          </Form.Item>
          <Form.Item
            label="sns"
            rules={[{ required: true, message: "sns를 입력해주세요." }]}
            name="sns">
            <Input />
          </Form.Item>
          <Form.Item
            label="sns아이디"
            rules={[{ required: true, message: "sns아이디를 입력해주세요." }]}
            name="snsId">
            <Input />
          </Form.Item>
          {/* <Wrapper dr={`row`} ju={`flex-end`}>
            <Button
              size="small"
              style={{ margin: `0 10px 0 0` }}
              onClick={createModalToggle}>
              취소
            </Button>
            <Button size="small" type="primary" htmlType="submit">
              생성
            </Button>
          </Wrapper> */}
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
