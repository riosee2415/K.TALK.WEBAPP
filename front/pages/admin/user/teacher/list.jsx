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
  USER_TEA_CREATE_REQUEST,
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
  Combo,
  ComboOption,
  GuideLi,
  GuideUl,
  SpanText,
  Text,
  Wrapper,
} from "../../../../components/commonComponents";
import { LECTURE_ALL_LIST_REQUEST } from "../../../../reducers/lecture";
import { CloseCircleOutlined } from "@ant-design/icons";
import {
  PARTICIPANT_CREATE_REQUEST,
  PARTICIPANT_DELETE_REQUEST,
  PARTICIPANT_USER_DELETE_LIST_REQUEST,
  PARTICIPANT_USER_MOVE_LIST_REQUEST,
} from "../../../../reducers/participant";
import useInput from "../../../../hooks/useInput";
import { SearchOutlined } from "@ant-design/icons";
import Theme from "../../../../components/Theme";
import { PAYMENT_LIST_REQUEST } from "../../../../reducers/payment";
import moment from "moment";

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

    allUsers,
    st_userTeaCreateDone,
    st_userTeaCreateError,
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
  const [form] = Form.useForm();
  const inputName = useInput("");
  const inputEmail = useInput("");

  const [modal, setModal] = useState(false);

  ////// USEEFFECT //////

  useEffect(() => {
    dispatch({
      type: USER_ALL_LIST_REQUEST,
      data: {
        type: 2,
        name: "",
        email: "",
      },
    });
  }, [router.query]);

  useEffect(() => {
    if (st_userTeaCreateDone) {
      message.success("강사가 생성되었습니다.");
      modalToggle();
    }
  }, [st_userTeaCreateDone]);

  useEffect(() => {
    if (st_userTeaCreateError) {
      message.error(st_userTeaCreateError);
    }
  }, [st_userTeaCreateError]);

  ////// TOGGLE //////

  ////// HANDLER //////

  const onSeachTeaHandler = useCallback(() => {
    dispatch({
      type: USER_ALL_LIST_REQUEST,
      data: {
        type: 2,
        name: inputName.value,
        email: inputEmail.value,
      },
    });
  }, [inputName.value, inputEmail.value]);

  const modalToggle = useCallback(() => {
    setModal((prev) => !prev);
  }, []);

  const onSubmitCreate = useCallback((data) => {
    dispatch({
      type: USER_TEA_CREATE_REQUEST,
      data: {
        userId: data.userId,
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
        <Button size="small" type="primary">
          DETAIL
        </Button>
      ),
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
        <Wrapper dr={`row`} ju={`space-between`}>
          <Wrapper
            dr={`row`}
            ju={`flex-start`}
            margin={`0 0 10px`}
            width={`auto`}
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
            <Button size="small" onClick={() => onSeachTeaHandler()}>
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
          dataSource={allUsers ? allUsers : []}
          size="small"
        />
      </AdminContent>
      <Modal
        visible={modal}
        onCancel={modalToggle}
        title="회원 생성"
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
            <Input type="email" />
          </Form.Item>
          <Form.Item
            label="회원아이디"
            rules={[{ required: true, message: "회원아이디를 입력해주세요." }]}
            name="userId"
          >
            <Input />
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
            <Calendar fullscreen={false} />
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

export default withRouter(UserList);
