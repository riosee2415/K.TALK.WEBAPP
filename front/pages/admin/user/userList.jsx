import React, { useCallback, useEffect, useState } from "react";

import wrapper from "../../../store/configureStore";
import { END } from "redux-saga";
import axios from "axios";

import styled from "styled-components";
import AdminLayout from "../../../components/AdminLayout";
import PageHeader from "../../../components/admin/PageHeader";
import {
  Table,
  Button,
  message,
  Modal,
  Select,
  notification,
  Input,
  Form,
  Calendar,
  // DatePicker,
} from "antd";
import { GuideDiv, Wrapper } from "../../../components/commonComponents";
import { SearchOutlined } from "@ant-design/icons";

import {
  LOAD_MY_INFO_REQUEST,
  UPDATE_MODAL_CLOSE_REQUEST,
  UPDATE_MODAL_OPEN_REQUEST,
  USERLIST_REQUEST,
  USERLIST_UPDATE_REQUEST,
  CREATE_MODAL_TOGGLE,
  USER_STU_CREATE_REQUEST,
  USER_TEA_CREATE_REQUEST,
  USER_ALL_LIST_REQUEST,
} from "../../../reducers/user";
import { LECTURE_ALL_LIST_REQUEST } from "../../../reducers/lecture";
import { PAYMENT_LIST_REQUEST } from "../../../reducers/payment";

import useInput from "../../../hooks/useInput";
import { useRouter, withRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import Theme from "../../../components/Theme";

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

const UserList = ({}) => {
  // LOAD CURRENT INFO AREA /////////////////////////////////////////////
  const { me, st_loadMyInfoDone } = useSelector((state) => state.user);
  const { allLectures } = useSelector((state) => state.lecture);

  const router = useRouter();

  const inputCreateEmail = useInput("");

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

  const {
    allUsers,
    createModal,
    updateModal,

    //
    st_userListError,
    //
    st_userListUpdateDone,
    st_userListUpdateError,
    //
    st_userCreateDone,
    st_userCreateError,
    //
    st_userStuCreateDone,
    st_userStuCreateError,
    //
    st_userTeaCreateDone,
    st_userTeaCreateError,
  } = useSelector((state) => state.user);
  const { paymentList } = useSelector((state) => state.payment);

  const [updateData, setUpdateData] = useState(null);
  const [selectUserLevel, setSelectUserLevel] = useState(null);
  const [paymentOpt, setPaymentOpt] = useState(null);

  const inputName = useInput("");
  const inputEmail = useInput("");

  const inputSort = useInput("1");
  const inputLevel = useInput("");

  const [form] = Form.useForm();

  const [lectureList, setLectureList] = useState(null);
  const [selectedList, setSelectedList] = useState([]);
  const [currentType, setCurrentType] = useState(3);

  const getQs = useCallback(() => {
    const qs = router.query;

    let value = "";

    if (currentType) {
      value = `${currentType}`;
    } else {
      value = `3`;
    }

    if (qs.name) {
      value += `?name=${qs.name}`;
    }

    if (qs.email) {
      value += `&email=${qs.email}`;
    }

    return value;
  }, [currentType, router.query]);

  ////// USEEFFECT //////

  useEffect(() => {
    const type = getQs();
    dispatch({
      type: USER_ALL_LIST_REQUEST,
      data: {
        type,
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
  }, [router.query]);

  useEffect(() => {
    const type = getQs();
    dispatch({
      type: USER_ALL_LIST_REQUEST,
      data: {
        type,
      },
    });
  }, [currentType]);

  useEffect(() => {
    if (st_userListUpdateDone) {
      const query = router.query;

      dispatch({
        type: UPDATE_MODAL_CLOSE_REQUEST,
      });

      dispatch({
        type: USERLIST_REQUEST,
        data: {
          name: query.name ? query.name : ``,
          email: query.email ? query.email : ``,
          listType: query.sort,
        },
      });

      return message.success("회원이 수정되었습니다.");
    }
  }, [st_userListUpdateDone]);

  useEffect(() => {
    if (st_userCreateDone) {
      const query = router.query;

      createModalToggle();

      dispatch({
        type: USERLIST_REQUEST,
        data: {
          name: query.name ? query.name : ``,
          email: query.email ? query.email : ``,
          listType: query.sort,
        },
      });

      return message.success("회원이 생성되었습니다.");
    }
  }, [st_userCreateDone]);

  useEffect(() => {
    if (st_userStuCreateDone) {
      const query = router.query;

      createModalToggle();

      dispatch({
        type: USERLIST_REQUEST,
        data: {
          name: query.name ? query.name : ``,
          email: query.email ? query.email : ``,
          listType: query.sort,
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

      return message.success("학생이 생성되었습니다.");
    }
  }, [st_userStuCreateDone]);

  useEffect(() => {
    if (st_userTeaCreateDone) {
      const query = router.query;

      createModalToggle();

      dispatch({
        type: USERLIST_REQUEST,
        data: {
          name: query.name ? query.name : ``,
          email: query.email ? query.email : ``,
          listType: query.sort,
        },
      });

      return message.success("강사가 생성되었습니다.");
    }
  }, [st_userTeaCreateDone]);

  useEffect(() => {
    if (st_userListError) {
      return message.error(st_userListError);
    }
  }, [st_userListError]);

  useEffect(() => {
    if (st_userListUpdateError) {
      return message.error(st_userListUpdateError);
    }
  }, [st_userListUpdateError]);

  useEffect(() => {
    if (st_userCreateError) {
      return message.error(st_userCreateError);
    }
  }, [st_userCreateError]);

  useEffect(() => {
    if (st_userStuCreateError) {
      return message.error(st_userStuCreateError);
    }
  }, [st_userStuCreateError]);

  useEffect(() => {
    if (st_userTeaCreateError) {
      return message.error(st_userTeaCreateError);
    }
  }, [st_userTeaCreateError]);

  useEffect(() => {
    setLectureList(
      allLectures &&
        allLectures.map((data) => {
          return (
            <Select.Option key={data.id} value={data.id} title={`data`}>
              {data.course}
            </Select.Option>
          );
        })
    );
  }, [allLectures]);

  useEffect(() => {
    if (selectUserLevel === "1") {
      const payOpt =
        paymentList &&
        paymentList.map((data) => {
          return (
            <Select.Option
              key={data.id}
              value={`${data.id},${data.LetureId},${data.week},${data.email}`}
            >
              {data.createdAt.slice(0, 10)} | {data.course} | &#36;{data.price}{" "}
              | &nbsp;{data.email}
            </Select.Option>
          );
        });

      setPaymentOpt(payOpt);
    }
  }, [selectUserLevel, paymentList]);
  ////// TOGGLE //////
  const updateModalOpen = useCallback(
    (data) => {
      dispatch({
        type: UPDATE_MODAL_OPEN_REQUEST,
      });

      setUpdateData(data);
      inputLevel.setValue(data.level);
    },
    [updateModal]
  );

  const updateModalClose = useCallback(() => {
    dispatch({
      type: UPDATE_MODAL_CLOSE_REQUEST,
    });
  }, [updateModal]);

  const createModalToggle = useCallback(() => {
    form.resetFields();
    setSelectUserLevel(null);

    dispatch({
      type: CREATE_MODAL_TOGGLE,
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
  }, [createModal, selectUserLevel, allLectures]);

  ////// HANDLER //////

  const onSubmitUpdate = useCallback(() => {
    if (updateData.level === inputLevel.value) {
      return LoadNotification(
        "ADMIN SYSTEM ERRLR",
        "현재 사용자와 같은 레벨로 수정할 수 없습니다.."
      );
    }

    dispatch({
      type: USERLIST_UPDATE_REQUEST,
      data: {
        selectUserId: updateData.id,
        changeLevel: inputLevel.value,
      },
    });
  }, [inputLevel]);

  const onSubmitCreate = useCallback(
    (data) => {
      if (data.password !== data.repassword) {
        return message.error("비밀번호를 동일하게 입력해주세요.");
      }
      if (selectUserLevel === "1") {
        if (data.payment.split(",")[3] !== data.email) {
          return message.error(
            `입력하신 이메일과 결제한 목록의 이메일이 같아야합니다.`
          );
        }
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
            birth: data.birth.format("YYYY-MM-DD"),
            stuCountry: data.stuCountry,
            stuLiveCon: data.stuLiveCon,
            sns: data.sns,
            snsId: data.snsId,
            stuJob: data.stuJob,
            gender: data.gender,
            PaymentId: data.payment.split(",")[0],
            LectureId: data.payment.split(",")[1],
            date: parseInt(data.payment.split(",")[2]) * 7,
            endDate: moment()
              .add(parseInt(data.payment.split(",")[2]) * 7, "days")
              .format("YYYY-MM-DD"),
          },
        });
      } else if (selectUserLevel === "2") {
        dispatch({
          type: USER_TEA_CREATE_REQUEST,
          data: {
            userId: data.userId,
            password: data.password,
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
      } else {
        return message.error("권한을 선택해주세요.");
      }
    },
    [selectUserLevel, selectedList]
  );

  const changeSelectLevel = useCallback(
    (level) => {
      setSelectUserLevel(level);
    },
    [selectUserLevel]
  );

  const onPaymentHanlder = useCallback(() => {
    dispatch({
      type: PAYMENT_LIST_REQUEST,
      data: {
        email: inputCreateEmail.value,
      },
    });
  }, [inputCreateEmail.value]);

  ////// DATAVIEW //////

  const columns = [
    {
      title: "번호",
      dataIndex: "id",
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
      title: "수정",
      render: (data) => (
        <Button
          size="small"
          type="primary"
          onClick={() =>
            data.level === 5
              ? message.error("개발사는 권한을 수정할 수 없습니다.")
              : updateModalOpen(data)
          }
        >
          수정
        </Button>
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

  return (
    <AdminLayout>
      <PageHeader
        breadcrumbs={["회원 관리", "관리"]}
        title={`회원 리스트`}
        subTitle={`홈페이지에 가입한 회원를 확인할 수 있습니다.`}
      />

      <AdminContent>
        <Wrapper
          margin={`0px 0px 10px 0px`}
          radius="5px"
          bgColor={Theme.lightGrey_C}
          padding="5px"
          fontSize="13px"
          al="flex-start"
        >
          <GuideDiv isImpo={true}>
            홈페이지에 가입된 회원을 조회할 수 있습니다.
          </GuideDiv>
          <GuideDiv isImpo={true}>
            학생과 강사를 따로 조회하려면 학생관리와 강사관리 메뉴를
            사용해주세요.
          </GuideDiv>
        </Wrapper>
        <Input.Group compact style={{ margin: ` 0 0 10px 0` }}>
          <Select
            size="small"
            defaultValue="1"
            style={{ width: "10%" }}
            onChange={(data) => setCurrentType(data)}
          >
            <Select.Option value="3">전체</Select.Option>
            <Select.Option value="1">학생</Select.Option>
            <Select.Option value="2">강사</Select.Option>
          </Select>
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
            size="small"
            onClick={() =>
              moveLinkHandler(
                `/admin/user/userList?name=${inputName.value}&email=${inputEmail.value}`
              )
            }
          >
            <SearchOutlined />
            검색
          </Button>
        </Input.Group>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={allUsers ? allUsers : []}
          size="small"
        />
      </AdminContent>

      <Modal
        visible={updateModal}
        width={`400px`}
        title={`사용자 레벨 수정`}
        onCancel={updateModalClose}
        onOk={onSubmitUpdate}
        okText="수정"
        cancelText="취소"
      >
        <Wrapper padding={`10px`} al={`flex-start`}>
          <div>사용자 레벨</div>
          <Select
            style={{ width: "100%" }}
            value={String(inputLevel.value)}
            onChange={(data) => inputLevel.setValue(data)}
          >
            <Select.Option disabled value="1">
              일반학생
            </Select.Option>
            <Select.Option disabled value="2">
              강사
            </Select.Option>
            <Select.Option value="3">운영자</Select.Option>
            <Select.Option value="4">최고관리자</Select.Option>
          </Select>
        </Wrapper>
      </Modal>

      <Modal
        visible={createModal}
        onCancel={createModalToggle}
        title="회원 생성"
        footer={null}
        width={1000}
        okText="생성"
        cancelText="취소"
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          form={form}
          onFinish={onSubmitCreate}
        >
          <Form.Item
            label="이메일"
            rules={[{ required: true, message: "이메일을 입력해주세요." }]}
            name="email"
          >
            <Input
              {...inputCreateEmail}
              type="email"
              onBlur={() => onPaymentHanlder()}
            />
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
            label="비밀번호"
            rules={[{ required: true, message: "비밀번호를 입력해주세요." }]}
            name="password"
          >
            <Input type="password" />
          </Form.Item>

          <Form.Item
            label="비밀번호 재입력"
            rules={[{ required: true, message: "비밀번호를 재입력해주세요." }]}
            name="repassword"
          >
            <Input type="password" />
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

          <Form.Item
            label="권한"
            rules={[{ required: true, message: "권한을 선택해주세요." }]}
            name="lavel"
          >
            <Select onChange={changeSelectLevel}>
              <Select.Option value="1">일반학생</Select.Option>
              <Select.Option value="2">강사</Select.Option>
            </Select>
          </Form.Item>

          {selectUserLevel === "1" ? (
            <>
              {/* <Form.Item
                label="강의 시작/종료일"
                rules={[
                  {
                    required: true,
                    message: "강의 시간/종료일을 입력해주세요.",
                  },
                ]}
                name="dates"
              >
                <DatePicker.RangePicker />
              </Form.Item> */}

              <Form.Item
                label="결제 목록"
                rules={[
                  {
                    required: true,
                    message: "회원에 추가할 강의의 결제목록을 선택해 주세요.",
                  },
                ]}
                name="payment"
              >
                <Select showSearch placeholder="Select a Lecture">
                  {paymentOpt}
                </Select>
              </Form.Item>

              <Form.Item
                label="학생 언어"
                rules={[
                  { required: true, message: "학생 언어를 입력해주세요." },
                ]}
                name="stuLanguage"
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="학생 나라"
                rules={[
                  { required: true, message: "학생 나라를 입력해주세요." },
                ]}
                name="stuCountry"
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="현재 거주 나라"
                rules={[
                  { required: true, message: "학생 거주 나라를 입력해주세요." },
                ]}
                name="stuLiveCon"
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="sns"
                rules={[{ required: true, message: "sns를 입력해주세요." }]}
                name="sns"
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="sns아이디"
                rules={[
                  { required: true, message: "sns아이디를 입력해주세요." },
                ]}
                name="snsId"
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="학생직업"
                rules={[
                  { required: true, message: "학생직업을 입력해주세요." },
                ]}
                name="stuJob"
              >
                <Input />
              </Form.Item>
            </>
          ) : (
            selectUserLevel === "2" && (
              <>
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
                                <Input
                                  type="number"
                                  style={{ width: `100%` }}
                                />
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
                                <Input
                                  type="password"
                                  style={{ width: `100%` }}
                                />
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
                  rules={[
                    { required: true, message: "은행이름을 입력해주세요." },
                  ]}
                  name="bankName"
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="계좌번호"
                  rules={[
                    { required: true, message: "계좌번호를 입력해주세요." },
                  ]}
                  name="bankNo"
                >
                  <Input />
                </Form.Item>
              </>
            )
          )}

          <Wrapper dr={`row`} ju={`flex-end`}>
            <Button
              size="small"
              style={{ margin: `0 10px 0 0` }}
              onClick={createModalToggle}
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
