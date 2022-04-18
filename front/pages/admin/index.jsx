import {
  Button,
  DatePicker,
  Empty,
  Form,
  Input,
  message,
  Modal,
  notification,
  Select,
  TimePicker,
} from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminLayout from "../../components/AdminLayout";
import {
  Wrapper,
  Image,
  CommonButton,
  Text,
  TextInput,
} from "../../components/commonComponents";
import useInput from "../../hooks/useInput";
import {
  LOAD_MY_INFO_REQUEST,
  LOGIN_ADMIN_REQUEST,
  UPDATE_MODAL_CLOSE_REQUEST,
  UPDATE_MODAL_OPEN_REQUEST,
  USER_ALL_LIST_REQUEST,
  USER_STU_LIST_REQUEST,
  USER_TEACHER_LIST_REQUEST,
} from "../../reducers/user";
import Theme from "../../components/Theme";
import wrapper from "../../store/configureStore";
import { END } from "redux-saga";
import axios from "axios";
import useWidth from "../../hooks/useWidth";
import { useRouter } from "next/router";
import styled from "styled-components";
import {
  LECTURE_ALL_LIST_REQUEST,
  LECTURE_DELETE_REQUEST,
  LECTURE_UPDATE_REQUEST,
} from "../../reducers/lecture";
import moment from "moment";
import { SolutionOutlined } from "@ant-design/icons";

// let Line;

// if (typeof window !== "undefined") {
//   const { Line: prevLine } = require("@ant-design/charts");

//   Line = prevLine;
// }

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

const AdminHome = () => {
  ////// HOOKS //////
  const width = useWidth();

  const [deletePopVisible, setDeletePopVisible] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [updateData, setUpdateData] = useState(null);
  const formRef = useRef();
  const [form] = Form.useForm();

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [currentTeacher, setCurrentTeacher] = useState(null);
  const [searchLevel, setSearchLevel] = useState("");
  const [searchPage, setSearchPage] = useState("");
  const [searchStep, setSearchStep] = useState("");
  const [searchTime, setSearchTime] = useState("");
  const [searchStuName, setSearchStuName] = useState("");

  const [allLectureList, setAllLectureList] = useState([]);

  const [dayArr, setDayArr] = useState([]);
  const inputId = useInput("");
  const inputPw = useInput("");
  const inputPeriod = useInput(``);
  const inputCnt = useInput();
  const inputStartDate = useInput();

  const router = useRouter();

  ////// REDUX //////
  const dispatch = useDispatch();

  const {
    allLectures,
    st_lectureDeleteDone,
    st_lectureDeleteError,
    updateModal,
    st_lectureUpdateDone,
    st_lectureUpdateError,

    st_lectureAllListDone,
    st_lectureAllListError,
  } = useSelector((state) => state.lecture);

  const {
    me,
    allUsers,
    teachers,
    st_loginAdminError,

    userStuList,
    st_userStuListDone,
    st_userStuListError,
  } = useSelector((state) => state.user);

  ////// USEEFFECT //////

  useEffect(() => {
    dispatch({
      type: LECTURE_ALL_LIST_REQUEST,
      data: {
        TeacherId: currentTeacher ? currentTeacher : "",
        time: searchTime ? searchTime : "",
        startLv: "",
        studentName: searchStuName ? searchStuName : "",
      },
    });
  }, [router.query]);

  useEffect(() => {
    dispatch({
      type: USER_ALL_LIST_REQUEST,
      data: {
        type: 2,
      },
    });

    dispatch({
      type: USER_STU_LIST_REQUEST,
    });
  }, [router.query]);

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
        },
      });
    }
  }, [st_lectureDeleteDone]);

  useEffect(() => {
    if (st_lectureDeleteError) {
      message.error(st_lectureDeleteError);
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
        },
      });
      updateModalClose();
    }
  }, [st_lectureUpdateDone]);

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

  useEffect(() => {
    dispatch({
      type: USER_TEACHER_LIST_REQUEST,
    });
  }, []);

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
    if (inputCnt.value && inputPeriod.value && form) {
      form.setFieldsValue({
        allCnt: inputPeriod.value * inputCnt.value,
      });
    }
  }, [inputCnt, inputPeriod, form]);

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
  }, [st_lectureAllListDone, searchStuName, router.query]);

  useEffect(() => {
    if (st_lectureAllListError) {
    }
  }, [st_lectureAllListError]);

  // const config = {
  //   data: acceptList,
  //   height: 400,
  //   xField: "date",
  //   yField: "count",
  //   point: {
  //     size: 5,
  //     shape: "diamond",
  //   },
  //   label: {
  //     style: {
  //       fill: "#aaa",
  //     },
  //   },
  // };

  ////// HANDLER ///////

  const moveLinkHandler = useCallback((link) => {
    router.push(link);
  }, []);

  const onLoginHandler = () => {
    dispatch({
      type: LOGIN_ADMIN_REQUEST,
      data: { userId: inputId.value, password: inputPw.value },
    });
  };

  const startDateChangeHandler = useCallback((e) => {
    const startDateData = new Date(e.format("YYYY-MM-DD"));

    setStartDate(startDateData);
  }, []);

  const onSubmitUpdate = useCallback(
    (data) => {
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
          lecDate: parseInt(data.lecDate),
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
      setDayArr(data.day.split(" "));

      inputPeriod.setValue(parseInt(data.lecDate.replace("주", "")));
      setStartDate(data.startDate);

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
        allCnt: data.count * parseInt(data.lecDate.replace("주", "")),
        course: data.course,
        number: data.number,
        lecDate: parseInt(data.lecDate.replace("주", "")),
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
    [inputStartDate, inputPeriod, allUsers, inputPeriod]
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
    let startLv = `${searchLevel ? searchLevel : ""} ${
      searchStep ? searchStep : ""
    } ${searchPage ? `${searchPage}페이지` : ""}`;

    if (!startLv || startLv.trim() === "" || startLv.includes("undefined")) {
      startLv = "";
    }

    dispatch({
      type: LECTURE_ALL_LIST_REQUEST,
      data: {
        TeacherId: currentTeacher ? currentTeacher : "",
        time: searchTime ? searchTime : "",
        startLv: startLv,
        studentName: searchStuName ? searchStuName : "",
      },
    });
  }, [
    currentTeacher,
    searchLevel,
    searchPage,
    searchStep,
    searchTime,
    searchStuName,
  ]);

  return (
    <>
      {me && me.level >= 3 ? (
        <AdminLayout>
          {/* <PageHeader
            breadcrumbs={["클래스 관리", "클래스 목록, 검색, 정렬"]}
            title={`클래스 목록, 검색, 정렬`}
            subTitle={`클래스의 목록을 살펴볼 수 있고 클래스별 상세 설정을 할 수 있습니다.`}
          /> */}

          <AdminContent>
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
                  size="small"
                  type="primary"
                  onClick={() => moveLinkHandler(`/admin/class/create`)}
                >
                  새 클래스 추가
                </Button>
              </Wrapper>
              <Wrapper dr={`row`} ju={`flex-start`}>
                <Select
                  style={{ width: `200px`, marginRight: 10 }}
                  placeholder={`강사를 선택해주세요.`}
                  onChange={(e) => setCurrentTeacher(e)}
                  allowClear
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
                    placeholder={`시간을 선택해주세요.`}
                    width={`200px`}
                    format={`HH:mm`}
                    onChange={(e) => onChangeTimeHandle(e)}
                  />
                </Wrapper>

                <Wrapper width={`auto`} margin={`0 10px 0 0`}>
                  <Select
                    placeholder={`학생을 선택해주세요.`}
                    onChange={(e) => setSearchStuName(e)}
                    allowClear
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

                <Button
                  type="primary"
                  onClick={() => onClickSearchLevelHandle()}
                >
                  검색
                </Button>
              </Wrapper>

              <Wrapper dr={`row`} ju={`flex-start`} margin={`10px 0 0`}>
                <Text width={`auto`} margin={`0 10px 0 0`}>
                  진도별 조회
                </Text>
                <Wrapper width={`200px`} dr={`row`} ju={`flex-start`}>
                  <FormItem width={`calc(100% - 50px)`}>
                    <Select
                      onChange={(e) => setSearchLevel(`${e}권`)}
                      allowClear
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
                  <Text>&nbsp;권</Text>
                </Wrapper>

                <Wrapper width={`200px`} dr={`row`} ju={`flex-start`}>
                  <FormItem width={`calc(100% - 50px)`}>
                    <Select
                      onChange={(e) => setSearchStep(`${e}단원`)}
                      allowClear
                    >
                      <Select.Option value={`1`}>1</Select.Option>
                      <Select.Option value={`2`}>2</Select.Option>
                      <Select.Option value={`3`}>3</Select.Option>
                      <Select.Option value={`4`}>4</Select.Option>
                      <Select.Option value={`5`}>5</Select.Option>
                      <Select.Option value={`6`}>6</Select.Option>
                    </Select>
                  </FormItem>
                  <Text>&nbsp;단원</Text>
                </Wrapper>

                <Wrapper width={`200px`} dr={`row`} ju={`flex-start`}>
                  <FormItem width={`calc(100% - 50px)`}>
                    <Input
                      type={`number`}
                      num={`1`}
                      value={searchPage}
                      onChange={(e) => setSearchPage(e.target.value)}
                    />
                  </FormItem>
                  <Text>&nbsp;페이지</Text>
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
                  allLectureList.map((data) => {
                    return (
                      <Wrapper
                        key={data.id}
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
                                  {data.day}&nbsp;/&nbsp;{data.time}
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
                                <Text fontSize={`16px`} fontWeight={`700`}>
                                  NO.{data.number}
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
                                {data.startLv}
                              </Text>
                              <Text>
                                수업 시작일 :{" "}
                                {data.startDate
                                  .replace(/\//g, "-")
                                  .slice(0, 10)}
                              </Text>
                            </Wrapper>
                          </Wrapper>
                          <Wrapper
                            margin={`20px 0 0`}
                            dr={`row`}
                            ju={`flex-start`}
                          >
                            {data.Participants &&
                              data.Participants.map((data) => {
                                return (
                                  <Text key={data.id} margin={`0 15px 0 0`}>
                                    {data.User.username}
                                  </Text>
                                );
                              })}
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
                          <Select.Option value={`7`}>7</Select.Option>
                          <Select.Option value={`8`}>8</Select.Option>
                          <Select.Option value={`9`}>9</Select.Option>
                          <Select.Option value={`10`}>10</Select.Option>
                          <Select.Option value={`11`}>11</Select.Option>
                          <Select.Option value={`12`}>12</Select.Option>
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
                      disabled
                    />
                  </FormItem>
                  <Text margin={`0 0 0 10px`}>주</Text>
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
                    <CusotmInput disabled type={`number`} {...inputCnt} />
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
                      disabled
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
                  <Text width={`100px`}>총 횟수</Text>
                  <FormItem
                    // rules={[{ required: true, message: "횟수를 입력해주세요." }]}
                    name={`allCnt`}
                    width={`calc(100% - 130px)`}
                  >
                    <CusotmInput type={`number`} disabled />
                  </FormItem>
                  <Text width={`30px`} padding={`0 0 0 10px`}>
                    회
                  </Text>
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
                      // {...inputStartDate}
                      disabled
                      value={
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
                      disabled
                      value={endDate && endDate}
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
                src={`https://firebasestorage.googleapis.com/v0/b/storage-4leaf.appspot.com/o/4leaf%2Flogo%2F4leafsoftware_logo_LW.png?alt=media&token=bc68284c-e82a-42ee-b4c4-a95e0ebc699e`}
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

    // context.store.dispatch({
    //   type: LECTURE_ALL_LIST_REQUEST,
    //   data: {
    //     listType: 1,
    //     TeacherId: "",
    //   },
    // });

    // context.store.dispatch({
    //   type: ACCEPT_LOG_REQUEST,
    //   data: { typeId: "1" },
    // });

    // 구현부 종료
    context.store.dispatch(END);
    console.log("🍀 SERVER SIDE PROPS END");
    await context.store.sagaTask.toPromise();
  }
);

export default AdminHome;
