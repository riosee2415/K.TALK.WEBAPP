import React, { useCallback, useEffect, useState, useRef } from "react";
import AdminLayout from "../../../components/AdminLayout";
import AdminTop from "../../../components/admin/AdminTop";
import PageHeader from "../../../components/admin/PageHeader";
import styled from "styled-components";
import {
  Button,
  Table,
  Modal,
  Form,
  Input,
  Select,
  Switch,
  notification,
  Row,
  Col,
  message,
  Empty,
  DatePicker,
} from "antd";
import {
  CloseOutlined,
  CheckOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";

import {
  LECTURE_DELETE_REQUEST,
  LECTURE_LIST_REQUEST,
  UPDATE_MODAL_OPEN_REQUEST,
  UPDATE_MODAL_CLOSE_REQUEST,
  LECTURE_UPDATE_REQUEST,
} from "../../../reducers/lecture";

import { withRouter } from "next/router";
import useInput from "../../../hooks/useInput";

import { END } from "redux-saga";
import axios from "axios";
import { useRouter } from "next/router";
import {
  LOAD_MY_INFO_REQUEST,
  USER_ALL_LIST_REQUEST,
} from "../../../reducers/user";
import wrapper from "../../../store/configureStore";
import {
  CommonButton,
  Image,
  RowWrapper,
  Text,
  TextInput,
  Wrapper,
} from "../../../components/commonComponents";
import Theme from "../../../components/Theme";
import useWidth from "../../../hooks/useWidth";
import moment from "moment";

const AdminContent = styled.div`
  padding: 20px;
`;

const NoticeTable = styled(Table)`
  width: 95%;
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
  margin: 0;
`;

const LoadNotification = (msg, content) => {
  notification.open({
    message: msg,
    description: content,
    onClick: () => {},
  });
};

const List = () => {
  // LOAD CURRENT INFO AREA /////////////////////////////////////////////
  const { me, st_loadMyInfoDone } = useSelector((state) => state.user);

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
  const [currentSort, setCurrentSort] = useState(1);

  const [deletePopVisible, setDeletePopVisible] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [updateData, setUpdateData] = useState(null);
  const formRef = useRef();
  const [form] = Form.useForm();

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const inputPeriod = useInput(``);

  ////// REDUX //////
  const dispatch = useDispatch();

  const {
    lectures,
    st_lectureDeleteDone,
    st_lectureDeleteError,
    updateModal,
    st_lectureUpdateDone,
    st_lectureUpdateError,
  } = useSelector((state) => state.lecture);

  const { allUsers } = useSelector((state) => state.user);

  ////// USEEFFECT //////
  useEffect(() => {
    dispatch({
      type: LECTURE_LIST_REQUEST,
      data: {
        sort: currentSort,
      },
    });
  }, [currentSort]);

  useEffect(() => {
    dispatch({
      type: USER_ALL_LIST_REQUEST,
      data: {
        type: 2,
      },
    });
  }, [router.query]);

  useEffect(() => {
    if (st_lectureDeleteDone) {
      message.success("클래스가 삭제되었습니다.");
      dispatch({
        type: LECTURE_LIST_REQUEST,
        data: {
          sort: currentSort,
        },
      });
    }
  }, [st_lectureDeleteDone, currentSort]);

  useEffect(() => {
    if (st_lectureDeleteError) {
      message.error(st_lectureDeleteError);
    }
  }, [st_lectureDeleteError]);

  useEffect(() => {
    if (st_lectureUpdateDone) {
      message.success("클래스가 수정되었습니다.");
      dispatch({
        type: LECTURE_LIST_REQUEST,
        data: {
          sort: currentSort,
        },
      });
      updateModalClose();
    }
  }, [st_lectureUpdateDone, currentSort]);

  useEffect(() => {
    if (st_lectureUpdateError) {
      message.error(st_lectureUpdateError);
    }
  }, [st_lectureUpdateError]);

  useEffect(() => {
    if (startDate && inputPeriod.value && formRef.current) {
      const startDateData = new Date(startDate);
      const endDateData = moment(
        new Date(
          startDateData.getFullYear(),
          startDateData.getMonth(),
          startDateData.getDate() + 7 * inputPeriod.value
        )
      ).format("YYYY-MM-DD");
      formRef.current.setFieldsValue({
        endDate: endDateData,
      });

      setEndDate(endDateData);
    }
  }, [startDate, inputPeriod, formRef]);

  useEffect(() => {
    if (updateData) {
      setTimeout(() => {
        onFill(updateData);
      }, 500);
    }
  }, [updateData]);

  ////// HANDLER ///////

  const startDateChangeHandler = useCallback((e) => {
    const startDateData = new Date(e.format("YYYY-MM-DD"));

    setStartDate(startDateData);
  }, []);

  const onSubmitUpdate = useCallback(
    (data) => {
      let UserId = null;
      for (let i = 0; i < allUsers.length; i++) {
        if (allUsers[i].username === data.UserId) {
          UserId = allUsers[i].id;
        }
      }

      // console.log();

      dispatch({
        type: LECTURE_UPDATE_REQUEST,
        data: {
          id: updateData.id,
          course: data.course,
          UserId,
          startLv: data.startLv,
          endLv: data.endLv,
          price: data.price,
          lecTime: data.lecTime,
          lecDate: data.lecDate,
          startDate: moment(data.startDate).format("YYYY-MM-DD"),
          endDate: data.endDate,
        },
      });
    },
    [updateData, allUsers]
  );

  const updateModalOk = useCallback(() => {
    formRef.current.submit();
  }, []);

  const comboChangeHandler = useCallback((e) => {
    setCurrentSort(e);
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
      let UserId = null;
      for (let i = 0; i < allUsers.length; i++) {
        console.log(allUsers[i], data.teacherName, "onFia");
        if (allUsers[i].username === data.teacherName) {
          UserId = allUsers[i].username;
        }
      }

      form.setFieldsValue({
        course: data.course,
        UserId,
        startLv: data.startLv,
        endLv: data.endLv,
        price: data.price,
        lecTime: data.lecTime,
        lecDate: parseInt(data.lecDate.replace("주", "")),

        startDate: moment(data.startDate, "YYYY-MM-DD"),
        // endDate: moment(data.startDate, "YYYY-MM-DD"),
      });
      inputPeriod.setValue(parseInt(data.lecDate.replace("주", "")));
      setStartDate(data.startDate);
    },
    [inputPeriod, allUsers]
  );
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
  }, [updateModal]);

  const deletePopToggle = useCallback(
    (id) => {
      setDeleteId(id);
      setDeletePopVisible((prev) => !prev);
    },
    [deletePopVisible, deleteId]
  );

  ////// DATAVIEW //////
  const week = ["일", "월", "화", "수", "목", "금", "토"];

  const columns = [
    {
      title: "No",
      dataIndex: "id",
    },
    {
      title: "Title",
      dataIndex: "title",
    },
    {
      title: "Author",
      dataIndex: "author",
    },

    {
      title: "CreatedAt",
      render: (data) => <div>{data.createdAt.substring(0, 10)}</div>,
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        breadcrumbs={["클래스 관리", "클래스 목록, 검색, 정렬"]}
        title={`클래스 목록, 검색, 정렬`}
        subTitle={`클래스의 목록을 살펴볼 수 있고 클래스별 상세 설정을 할 수 있습니다.`}
      />

      <AdminContent>
        <Wrapper dr={`row`}>
          <Wrapper
            width={width < 1350 ? `100%` : `calc(100% / 2 )`}
            margin={`0 0 30px`}
            al={`flex-start`}
            ju={`flex-start`}
          >
            <Text fontSize={`18px`} fontWeight={`700`}>
              강사 게시판
            </Text>
            <RowWrapper margin={`16px 0 10px 0`} gutter={5}>
              <Col>
                <Button type="primary">전체보기</Button>
              </Col>
              <Col>
                <Button>글 찾기</Button>
              </Col>
              <Col>
                <Button>쪽지 보내기</Button>
              </Col>
            </RowWrapper>
            <NoticeTable
              rowKey="id"
              columns={columns}
              // dataSource={notices ? notices : []}
              size="small"
            />
            <Wrapper al={`flex-end`} width={`95%`} margin={`10px 0 0`}>
              <Button>글쓰기</Button>
            </Wrapper>
          </Wrapper>
          <Wrapper
            width={width < 1350 ? `100%` : `calc(100% / 2 )`}
            margin={`0 0 30px`}
            al={`flex-start`}
            ju={`flex-start`}
          >
            <Text fontSize={`18px`} fontWeight={`700`}>
              학생 게시판
            </Text>
            <RowWrapper margin={`16px 0 10px 0`} gutter={5}>
              <Col>
                <Button type="primary">전체보기</Button>
              </Col>
              <Col>
                <Button>글 찾기</Button>
              </Col>
              <Col>
                <Button>쪽지 보내기</Button>
              </Col>
            </RowWrapper>
            <NoticeTable
              rowKey="id"
              columns={columns}
              // dataSource={notices ? notices : []}
              size="small"
            />
            <Wrapper al={`flex-end`} width={`95%`} margin={`10px 0 0`}>
              <Button>글쓰기</Button>
            </Wrapper>
          </Wrapper>
        </Wrapper>
        <Wrapper al={`flex-start`} margin={`0 0 10px`}>
          <Wrapper dr={`row`} ju={`flex-start`} margin={`0 0 16px`}>
            <Text fontSize={`18px`} fontWeight={`bold`} margin={`0 20px 0 0`}>
              클래스 목록
            </Text>
            <Button
              size="small"
              type="primary"
              onClick={() => moveLinkHandler(`/admin/class/create`)}
            >
              새 클래스 추가
            </Button>
          </Wrapper>
          <Select
            style={{ width: `200px` }}
            placeholder={`정렬을 선택해주세요.`}
            onChange={(e) => comboChangeHandler(e)}
          >
            <Select.Option value={`1`}>인원수순</Select.Option>
            <Select.Option value={`2`}>생성일순</Select.Option>
            <Select.Option value={`3`}>강의명순</Select.Option>
          </Select>
        </Wrapper>
        <Wrapper dr={`row`} ju={`flex-start`}>
          {lectures &&
            (lectures.length === 0 ? (
              <Wrapper>
                <Empty description={`조회된 강의가 없습니다.`} />
              </Wrapper>
            ) : (
              lectures.map((data) => {
                return (
                  <Wrapper
                    width={`calc(100% / 3 - 20px)`}
                    minHeight={`370px`}
                    radius={`10px`}
                    shadow={`0 5px 15px rgba(0,0,0,0.05)`}
                    margin={`0 20px 30px 0`}
                    padding={`20px`}
                    ju={`space-between`}
                  >
                    <Wrapper>
                      <Wrapper
                        dr={`row`}
                        ju={`space-between`}
                        al={`flex-start`}
                        padding={`0 0 20px`}
                        borderBottom={`1px solid ${Theme.grey2_C}`}
                      >
                        <Wrapper width={`auto`}>
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
                                src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_lecture.png`}
                                alt={`icon_lecture`}
                              />
                            </Wrapper>

                            <Text fontSize={`16px`} fontWeight={`700`}>
                              {data.lecTime}분 /&nbsp;
                              {week[new Date(data.startDate).getDay()]}요일
                            </Text>
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
                            <Text fontSize={`16px`} fontWeight={`700`}>
                              {data.teacherName}
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
                            <Text fontSize={`16px`} fontWeight={`700`}>
                              NO.{data.id}
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
                          <Text fontSize={`14px`} fontWeight={`bold`}>
                            {data.viewLv}
                          </Text>
                          <Text>
                            수업 시작일 :{" "}
                            {data.startDate.replace(/\//g, "-").slice(0, 10)}
                          </Text>
                        </Wrapper>
                      </Wrapper>
                      <Wrapper
                        margin={`20px 0 0`}
                        dr={`row`}
                        ju={`space-between`}
                      >
                        <Text
                          width={`calc(100% / 2 - 10px)`}
                          margin={`0 0 12px`}
                        >
                          Julieta Lopez
                        </Text>
                        <Text
                          width={`calc(100% / 2 - 10px)`}
                          margin={`0 0 12px`}
                        >
                          Julieta Lopez
                        </Text>
                        <Text
                          width={`calc(100% / 2 - 10px)`}
                          margin={`0 0 12px`}
                        >
                          Julieta Lopez
                        </Text>
                        <Text
                          width={`calc(100% / 2 - 10px)`}
                          margin={`0 0 12px`}
                        >
                          Julieta Lopez
                        </Text>
                        <Text
                          width={`calc(100% / 2 - 10px)`}
                          margin={`0 0 12px`}
                        >
                          Julieta Lopez
                        </Text>
                        <Text
                          width={`calc(100% / 2 - 10px)`}
                          margin={`0 0 12px`}
                        >
                          Julieta Lopez
                        </Text>
                        <Text
                          width={`calc(100% / 2 - 10px)`}
                          margin={`0 0 12px`}
                        >
                          Julieta Lopez
                        </Text>
                        <Text
                          width={`calc(100% / 2 - 10px)`}
                          margin={`0 0 12px`}
                        >
                          Julieta Lopez
                        </Text>
                      </Wrapper>
                    </Wrapper>
                    <Wrapper dr={`row`}>
                      <CommonButton
                        padding={`0`}
                        width={`80px`}
                        height={`35px`}
                        radius={`5px`}
                        margin={`0 10px 0 0`}
                        fontSize={`14px`}
                        onClick={() =>
                          moveLinkHandler(`/admin/class/${data.id}`)
                        }
                      >
                        자세히 보기
                      </CommonButton>
                      <CommonButton
                        padding={`0`}
                        width={`80px`}
                        height={`35px`}
                        radius={`5px`}
                        margin={`0 10px 0 0`}
                        fontSize={`14px`}
                        onClick={() => updateModalOpen(data)}
                      >
                        수정
                      </CommonButton>
                      <CustomButton
                        type={`danger`}
                        onClick={() => deletePopToggle(data.id)}
                      >
                        삭제
                      </CustomButton>
                    </Wrapper>
                  </Wrapper>
                );
              })
            ))}
        </Wrapper>
      </AdminContent>

      {/* DELETE MODAL */}
      <Modal
        visible={deletePopVisible}
        onOk={deleteClassHandler}
        onCancel={() => deletePopToggle(null)}
        title="정말 삭제하시겠습니까?"
      >
        <Wrapper>삭제 된 데이터는 다시 복구할 수 없습니다.</Wrapper>
        <Wrapper>정말 삭제하시겠습니까?</Wrapper>
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
                rules={[{ required: true, message: "강의명을 입력해주세요." }]}
                name={`course`}
              >
                <CusotmInput />
              </FormItem>
            </Wrapper>

            {/* defaultValue={updateData && updateData.teacherName} */}
            <Wrapper dr={`row`} margin={`0 0 20px`}>
              <Text width={`100px`}>강사</Text>
              <FormItem
                rules={[{ required: true, message: "강사를 선택해주세요." }]}
                name={`UserId`}
              >
                <Select size={`large`}>
                  {allUsers &&
                    allUsers.map((data) => {
                      return (
                        <Select.Option key={data.id} value={data.username}>
                          {data.username}
                        </Select.Option>
                      );
                    })}
                </Select>
                {/* <CusotmInput /> */}
              </FormItem>
            </Wrapper>

            <Wrapper dr={`row`} margin={`0 0 20px`}>
              <Text width={`100px`}>시작 레벨</Text>
              <FormItem
                rules={[
                  { required: true, message: "시작 레벨을 입력해주세요." },
                ]}
                name={`startLv`}
              >
                <CusotmInput />
              </FormItem>
            </Wrapper>

            <Wrapper dr={`row`} margin={`0 0 20px`}>
              <Text width={`100px`}>끝 레벨</Text>
              <FormItem
                rules={[{ required: true, message: "끝 레벨을 입력해주세요." }]}
                name={`endLv`}
              >
                <CusotmInput />
              </FormItem>
            </Wrapper>

            <Wrapper dr={`row`} margin={`0 0 20px`}>
              <Text width={`100px`}>가격</Text>
              <FormItem
                rules={[{ required: true, message: "가격을 입력해주세요." }]}
                name={`price`}
                width={`calc(100% - 130px)`}
              >
                <CusotmInput type={`number`} />
              </FormItem>
              <Text margin={`0 0 0 10px`}>원</Text>
            </Wrapper>

            <Wrapper dr={`row`} margin={`0 0 20px`}>
              <Text width={`100px`}>강의 시간</Text>
              <FormItem
                rules={[
                  { required: true, message: "강의 시간을 입력해주세요." },
                ]}
                name={`lecTime`}
                width={`calc(100% - 130px)`}
              >
                <CusotmInput type={`number`} />
              </FormItem>
              <Text margin={`0 0 0 10px`}>분</Text>
            </Wrapper>

            <Wrapper dr={`row`} margin={`0 0 20px`}>
              <Text width={`100px`}>강의 기간</Text>
              <FormItem
                rules={[
                  { required: true, message: "강의 기간을 입력해주세요." },
                ]}
                name={`lecDate`}
                width={`calc(100% - 130px)`}
              >
                <CusotmInput
                  onChange={startDateChangeHandler}
                  type={`number`}
                  {...inputPeriod}
                />
              </FormItem>
              <Text margin={`0 0 0 10px`}>주</Text>
            </Wrapper>

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
                  onChange={startDateChangeHandler}
                  defaultValue={
                    updateData && moment(updateData.startDate, "YYYY-MM-DD")
                  }
                />
              </FormItem>
            </Wrapper>

            <Wrapper dr={`row`} margin={`0 0 20px`}>
              <Text width={`100px`}>종료 날짜</Text>
              <FormItem
                rules={[
                  { required: true, message: "종료 날짜를 입력해주세요." },
                ]}
                name={`endDate`}
              >
                <CusotmInput
                  format={`YYYY-MM-DD`}
                  size={`large`}
                  readOnly={true}
                  value={endDate && endDate}
                />
              </FormItem>
            </Wrapper>
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

export default List;
