import React, { useCallback, useEffect, useState } from "react";
import AdminLayout from "../../../../components/AdminLayout";
import PageHeader from "../../../../components/admin/PageHeader";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";

import {
  Table,
  Button,
  message,
  Modal,
  Select,
  Input,
  Form,
  Calendar,
  Popconfirm,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import wrapper from "../../../../store/configureStore";
import { END } from "redux-saga";
import axios from "axios";
import {
  GuideLi,
  GuideUl,
  Text,
  Wrapper,
} from "../../../../components/commonComponents";

import {
  LOAD_MY_INFO_REQUEST,
  USER_FIRE_UPDATE_REQUEST,
  USER_TEA_CREATE_REQUEST,
  USER_TEA_LIST_REQUEST,
} from "../../../../reducers/user";

import { useRouter, withRouter } from "next/router";
import useInput from "../../../../hooks/useInput";
import moment from "moment";
import { TEACHER_PARTICIPANT_LIST_REQUEST } from "../../../../reducers/participant";

const AdminContent = styled.div`
  padding: 20px;
`;

const UserList = ({}) => {
  const { Option } = Select;
  // LOAD CURRENT INFO AREA /////////////////////////////////////////////

  const { allLectures } = useSelector((state) => state.lecture);

  const {
    me,
    st_loadMyInfoDone,

    teacherList,
    st_userTeaCreateDone,
    st_userTeaCreateError,
    st_userFireUpdateDone,
    st_userFireUpdateError,
  } = useSelector((state) => state.user);
  const { teaPartList } = useSelector((state) => state.participant);

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
  const [form] = Form.useForm();
  const inputName = useInput("");
  const inputEmail = useInput("");

  const [modal, setModal] = useState(false);

  const [detailmodal, setDetailModal] = useState(false);
  const [detailModalData, setDetailModalData] = useState(null);

  const [logmodal, setLogModal] = useState(false);
  const [updateData, setUpdateData] = useState(null);

  const [currentListType, setCurrentListType] = useState(null);

  const inputEmailView = useInput("");

  ////// USEEFFECT //////

  useEffect(() => {
    if (st_userTeaCreateDone) {
      message.success("강사가 생성되었습니다.");
      dispatch({
        type: USER_TEA_LIST_REQUEST,
        data: {
          isFire: null,
          name: "",
          email: "",
        },
      });
      modalToggle();
      inputName.setValue("");
      inputEmail.setValue("");
      inputEmailView.setValue("");
      form.resetFields();
    }
  }, [st_userTeaCreateDone]);

  useEffect(() => {
    if (st_userTeaCreateError) {
      message.error(st_userTeaCreateError);
    }
  }, [st_userTeaCreateError]);

  useEffect(() => {
    form.setFieldsValue({
      userId: inputEmailView.value,
    });
  }, [form, inputEmailView.value]);

  useEffect(() => {
    if (st_userFireUpdateDone) {
      message.success(
        `강사가 ${updateData ? `재계약되었습니다.` : `해지되었습니다`}`
      );
      dispatch({
        type: USER_TEA_LIST_REQUEST,
        data: {
          isFire: currentListType,
          name: inputName.value,
          email: inputEmail.value,
        },
      });
    }
  }, [st_userFireUpdateDone]);
  useEffect(() => {
    if (st_userFireUpdateError) {
      message.success(st_userFireUpdateError);
    }
  }, [st_userFireUpdateError]);

  ////// TOGGLE //////

  ////// HANDLER //////

  const onSeachTeaHandler = useCallback(() => {
    dispatch({
      type: USER_TEA_LIST_REQUEST,
      data: {
        isFire: currentListType,
        name: inputName.value,
        email: inputEmail.value,
      },
    });
  }, [inputName.value, inputEmail.value, currentListType]);

  useEffect(() => {
    dispatch({
      type: USER_TEA_LIST_REQUEST,
      data: {
        isFire: currentListType,
        name: inputName.value,
        email: inputEmail.value,
      },
    });
  }, [currentListType]);

  const modalToggle = useCallback(() => {
    setModal((prev) => !prev);
  }, []);

  const detailModalToggle = useCallback((data) => {
    setDetailModal((prev) => !prev);
    setDetailModalData(data);
  }, []);

  const logModalToggle = useCallback((data) => {
    setLogModal((prev) => !prev);
    if (data) {
      dispatch({
        type: TEACHER_PARTICIPANT_LIST_REQUEST,
        data: {
          TeacherId: data.id,
        },
      });
    }
  }, []);

  const TeacherFireUpdateHandler = useCallback((data) => {
    if (data.isFire) {
      dispatch({
        type: USER_FIRE_UPDATE_REQUEST,
        data: {
          id: data.id,
          isFire: false,
        },
      });
      setUpdateData(false);
    } else {
      dispatch({
        type: USER_FIRE_UPDATE_REQUEST,
        data: {
          id: data.id,
          isFire: true,
        },
      });
      setUpdateData(true);
    }
  }, []);

  const onSubmitCreate = useCallback((data) => {
    dispatch({
      type: USER_TEA_CREATE_REQUEST,
      data: {
        userId: data.email,
        password: data.mobile.slice(data.mobile.length - 4, data.mobile.length),
        username: data.username,
        mobile: data.mobile,
        email: data.email,
        address: data.address,
        detailAddress: data.detailAddress,
        identifyNum: `${data.identifyNum.firstIdentifyNum}-${data.identifyNum.endIdentifyNum}`,
        teaCountry: "-",
        teaLanguage: data.teaLanguage,
        bankNo: data.bankNo,
        bankName: data.bankName,
        birth: data.birth,
        gender: data.gender,
      },
    });
  }, []);

  const onCancelHandle = useCallback(() => {
    form.resetFields();
    detailModalToggle(null);
  }, []);

  ////// DATAVIEW //////

  const column = [
    {
      title: "번호",
      dataIndex: "id",
    },

    {
      title: "강사 이름",
      render: (data) => <div>{data.username}</div>,
    },
    {
      title: "강사 이메일",
      render: (data) => <div>{data.userId}</div>,
    },

    {
      title: "전화번호",
      render: (data) => <div>{data.mobile}</div>,
    },

    {
      title: "강사 디테일",
      render: (data) => (
        <Button
          size="small"
          type="primary"
          onClick={() => detailModalToggle(data)}
        >
          DETAIL
        </Button>
      ),
    },

    {
      title: "강사 해지/재계약",
      render: (data) => (
        <Popconfirm
          onConfirm={() => TeacherFireUpdateHandler(data)}
          title={`강사를 ${data.isFire ? `재계약` : `해지`} 하시겠습니까?`}
        >
          <Button size="small" type="primary">
            {data.isFire ? `재계약` : `해지`}
          </Button>
        </Popconfirm>
      ),
    },

    {
      title: "강사 해지/재계약 기록",
      render: (data) => (
        <Button
          size="small"
          type="primary"
          onClick={() => logModalToggle(data)}
        >
          DETAIL
        </Button>
      ),
    },
  ];

  const logColumns = [
    {
      title: "번호",
      dataIndex: "id",
    },
    {
      title: "강사명",
      dataIndex: "username",
    },
    {
      title: "이메일",
      dataIndex: "email",
    },
    {
      title: "구분",
      render: (data) => {
        return <Text>{data.isFire ? `해지` : `계약`}</Text>;
      },
    },
    {
      title: "해지일 / 재계약일",
      render: (data) => {
        return (
          <Text>
            {data.isFire
              ? data.updatedAt.slice(0, 13)
              : data.createdAt.slice(0, 13)}
          </Text>
        );
      },
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        breadcrumbs={["회원 관리", "관리"]}
        title={`강사 목록`}
        subTitle={`강사를 확인할 수 있습니다.`}
      />
      {/* <AdminTop createButton={true} createButtonAction={() => {})} /> */}

      <AdminContent>
        <Wrapper dr={`row`} ju={`flex-start`} margin={`0 0 10px`}>
          <Button
            size={`small`}
            type={currentListType === null && "primary"}
            onClick={() => setCurrentListType(null)}
          >
            전체 조회
          </Button>
          <Button
            size={`small`}
            type={currentListType === true && "primary"}
            onClick={() => setCurrentListType(true)}
          >
            해지 강사 조회
          </Button>
          <Button
            size={`small`}
            type={currentListType === false && "primary"}
            onClick={() => setCurrentListType(false)}
          >
            계약 강사 조회
          </Button>
        </Wrapper>
        <Wrapper dr={`row`} ju={`space-between`}>
          <Wrapper
            dr={`row`}
            ju={`flex-start`}
            margin={`0 0 10px`}
            width={`calc(100% - 80px)`}
          >
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
            <Button
              widt={`80px`}
              size="small"
              onClick={() => onSeachTeaHandler()}
            >
              <SearchOutlined />
              검색
            </Button>
          </Wrapper>
          <Button type={`primary`} size={`small`} onClick={modalToggle}>
            강사 생성
          </Button>
        </Wrapper>

        <Table
          rowKey="id"
          columns={column}
          dataSource={teacherList ? teacherList : []}
          size="small"
        />
      </AdminContent>
      <Modal
        visible={modal}
        onCancel={modalToggle}
        title="강사 생성"
        footer={null}
        width={1000}
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          form={form}
          onFinish={onSubmitCreate}
        >
          <Wrapper width={`68%`} margin={`0 16%`}>
            <GuideUl>
              <GuideLi isImpo>회원 아이디는 이메일과 같습니다.</GuideLi>
              <GuideLi isImpo>
                유저의 비밀번호는 전화번호의 맨 뒤 네자리로 자동 설정됩니다.
              </GuideLi>
            </GuideUl>
          </Wrapper>
          <Form.Item
            label="이메일"
            rules={[{ required: true, message: "이메일을 입력해주세요." }]}
            name="email"
          >
            <Input type="email" {...inputEmailView} />
          </Form.Item>

          <Form.Item label="회원아이디" name="userId">
            <Input disabled />
          </Form.Item>

          <Form.Item
            label="회원이름"
            rules={[{ required: true, message: "회원이름을 입력해주세요." }]}
            name="username"
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="생년월일"
            rules={[{ required: true, message: "생년월일을 선택해주세요.." }]}
            name="birth"
          >
            <Calendar
              fullscreen={false}
              validRange={[moment(1970), moment()]}
            />
          </Form.Item>
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
            label="전화번호"
            rules={[{ required: true, message: "전화번호를 입력해주세요." }]}
            name="mobile"
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            label="주소"
            rules={[{ required: true, message: "주소를 입력해주세요." }]}
            name="address"
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="상세주소"
            rules={[{ required: true, message: "상세주소를 입력해주세요." }]}
            name="detailAddress"
          >
            <Input />
          </Form.Item>

          <Form.List
            name="identifyNum"
            rules={[
              {
                validator: async (_, values) => {
                  if (
                    !values ||
                    !values.firstIdentifyNum ||
                    values.firstIdentifyNum.trim().length === 0 ||
                    !values.endIdentifyNum ||
                    values.endIdentifyNum.trim().length === 0
                  ) {
                    return Promise.reject(
                      new Error("주민등록번호를 입력해주세요.")
                    );
                  }
                },
              },
            ]}
          >
            {(fields, { add, remove }, { errors }) => {
              return (
                <>
                  <Form.Item label="주민등록번호">
                    <Wrapper dr={`row`} ju={`space-between`}>
                      <Wrapper width={`48%`}>
                        <Form.Item
                          style={{ width: `100%`, margin: 0 }}
                          name="firstIdentifyNum"
                        >
                          <Input type="number" style={{ width: `100%` }} />
                        </Form.Item>
                      </Wrapper>
                      <Wrapper width={`4%`} margin={`0 0 0`}>
                        -
                      </Wrapper>
                      <Wrapper width={`48%`}>
                        <Form.Item
                          style={{ width: `100%`, margin: 0 }}
                          name="endIdentifyNum"
                        >
                          <Input type="password" style={{ width: `100%` }} />
                        </Form.Item>
                      </Wrapper>
                    </Wrapper>

                    <Wrapper al={`flex-start`}>
                      <Form.ErrorList errors={errors} />
                    </Wrapper>
                  </Form.Item>
                </>
              );
            }}
          </Form.List>
          <Form.Item
            label="강사 가능 언어"
            rules={[
              {
                required: true,
                message: "강사가 가능한 언어를 입력해주세요.",
              },
            ]}
            name="teaLanguage"
          >
            <Input />
          </Form.Item>

          {/* <Form.Item
                  label="강사 나라"
                  rules={[
                    { required: true, message: "강사 나라를 입력해주세요." },
                  ]}
                  name="teaCountry"
                >
                  <Input />
                </Form.Item> */}

          <Form.Item
            label="은행이름"
            rules={[{ required: true, message: "은행이름을 입력해주세요." }]}
            name="bankName"
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="계좌번호"
            rules={[{ required: true, message: "계좌번호를 입력해주세요." }]}
            name="bankNo"
          >
            <Input />
          </Form.Item>

          <Wrapper dr={`row`} ju={`flex-end`}>
            <Button
              size="small"
              style={{ margin: `0 10px 0 0` }}
              onClick={modalToggle}
            >
              취소
            </Button>
            <Button size="small" type="primary" htmlType="submit">
              생성
            </Button>
          </Wrapper>
        </Form>
      </Modal>

      <Modal
        visible={detailmodal}
        footer={null}
        onCancel={() => onCancelHandle()}
        title={`강사 정보`}
      >
        <Wrapper>
          <Wrapper dr={`row`} margin={`0 0 20px`}>
            <Text width={`80px`} fontWeight={`600`}>
              이름 :
            </Text>
            <Text width={`calc(100% - 80px)`}>
              {detailModalData && detailModalData.username}
            </Text>
          </Wrapper>

          <Wrapper dr={`row`} margin={`0 0 20px`}>
            <Text width={`80px`} fontWeight={`600`}>
              성별 :
            </Text>
            <Text width={`calc(100% - 80px)`}>
              {detailModalData && detailModalData.gender}
            </Text>
          </Wrapper>

          <Wrapper dr={`row`} margin={`0 0 20px`}>
            <Text width={`80px`} fontWeight={`600`}>
              가입일 :
            </Text>
            <Text width={`calc(100% - 80px)`}>
              {detailModalData && detailModalData.createdAt.slice(0, 13)}
            </Text>
          </Wrapper>

          <Wrapper dr={`row`} margin={`0 0 20px`}>
            <Text width={`80px`} fontWeight={`600`}>
              이메일 :
            </Text>
            <Text width={`calc(100% - 80px)`}>
              {detailModalData && detailModalData.email}
            </Text>
          </Wrapper>

          <Wrapper dr={`row`} margin={`0 0 20px`}>
            <Text width={`80px`} fontWeight={`600`}>
              아이디 :
            </Text>
            <Text width={`calc(100% - 80px)`}>
              {detailModalData && detailModalData.userId}
            </Text>
          </Wrapper>

          <Wrapper dr={`row`} margin={`0 0 20px`}>
            <Text width={`80px`} fontWeight={`600`}>
              가능 언어 :
            </Text>
            <Text width={`calc(100% - 80px)`}>
              {detailModalData && detailModalData.teaLanguage}
            </Text>
          </Wrapper>

          <Wrapper dr={`row`} margin={`0 0 20px`}>
            <Text width={`80px`} fontWeight={`600`}>
              은행 :
            </Text>
            <Text width={`calc(100% - 80px)`}>
              {detailModalData && detailModalData.bankName}
            </Text>
          </Wrapper>

          <Wrapper dr={`row`} margin={`0 0 20px`}>
            <Text width={`80px`} fontWeight={`600`}>
              계좌번호 :
            </Text>
            <Text width={`calc(100% - 80px)`}>
              {detailModalData && detailModalData.bankNo}
            </Text>
          </Wrapper>

          <Wrapper dr={`row`} margin={`0 0 20px`}>
            <Text width={`80px`} fontWeight={`600`}>
              생년월일 :
            </Text>
            <Text width={`calc(100% - 80px)`}>
              {detailModalData && detailModalData.birth.slice(0, 10)}
            </Text>
          </Wrapper>

          <Wrapper dr={`row`} margin={`0 0 20px`}>
            <Text width={`80px`} fontWeight={`600`}>
              주소 :
            </Text>
            <Text width={`calc(100% - 80px)`}>
              {detailModalData && detailModalData.address}
            </Text>
          </Wrapper>

          <Wrapper dr={`row`} margin={`0 0 20px`}>
            <Text width={`80px`} fontWeight={`600`}>
              상세주소 :
            </Text>
            <Text width={`calc(100% - 80px)`}>
              {detailModalData && detailModalData.detailAddress}
            </Text>
          </Wrapper>
        </Wrapper>
      </Modal>

      <Modal
        visible={logmodal}
        footer={null}
        onCancel={() => logModalToggle(null)}
        title={`해지 / 재계약 기록`}
        width={800}
      >
        <Wrapper>
          <Table
            columns={logColumns}
            dataSource={teaPartList ? teaPartList : []}
          />
        </Wrapper>
      </Modal>
      {console.log(teaPartList)}
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
      type: USER_TEA_LIST_REQUEST,
      data: {
        isFire: null,
        name: "",
        email: "",
      },
    });

    // 구현부 종료
    context.store.dispatch(END);
    console.log("🍀 SERVER SIDE PROPS END");
    await context.store.sagaTask.toPromise();
  }
);

export default withRouter(UserList);
