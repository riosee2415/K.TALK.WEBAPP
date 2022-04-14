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
  TimePicker,
} from "antd";
import {
  CloseOutlined,
  CheckOutlined,
  SearchOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";

import {
  LECTURE_CREATE_REQUEST,
  LECTURE_LIST_REQUEST,
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
  GuideLi,
  GuideUl,
  Image,
  RowWrapper,
  Text,
  TextArea,
  TextInput,
  Wrapper,
} from "../../../components/commonComponents";
import Theme from "../../../components/Theme";
import moment from "moment";

const AdminContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
`;

const FileBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

const Filename = styled.span`
  margin-right: 15px;
  color: #555;
  font-size: 13px;
`;

const SearchRow = styled(Row)`
  margin-bottom: 10px;
`;

const NoticeTable = styled(Table)`
  width: 95%;
`;

const LoadNotification = (msg, content) => {
  notification.open({
    message: msg,
    description: content,
    onClick: () => {},
  });
};

const FormTag = styled(Form)`
  width: 60%;
`;
const FormItem = styled(Form.Item)`
  width: ${(props) => props.width || `calc(100% - 80px)`};
  margin: ${(props) => props.margin || `0`};
  display: flex;
  flex-direction: ${(props) => props.dr || ``};
`;

const CusotmInput = styled(TextInput)`
  width: ${(props) => props.width || `100%`};
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

const TimeInput = styled(TimePicker)`
  width: ${(props) => props.width || ``};
  &::placeholder {
    color: ${Theme.grey2_C};
  }
`;

const List = () => {
  const week = ["일", "월", "화", "수", "목", "금", "토"];
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
  const formRef = useRef();
  const [form] = Form.useForm();
  const inputPeriod = useInput();
  const inputCnt = useInput();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [dayArr, setDayArr] = useState([]);

  ////// REDUX //////
  const dispatch = useDispatch();
  const { st_lectureCreateDone, st_lectureCreateError } = useSelector(
    (state) => state.lecture
  );
  const { allUsers } = useSelector((state) => state.user);

  ////// USEEFFECT //////

  useEffect(() => {
    dispatch({
      type: USER_ALL_LIST_REQUEST,
      data: {
        type: 2,
      },
    });
  }, [router.query]);

  useEffect(() => {
    if (st_lectureCreateDone) {
      message.success("강의가 생성되었습니다.");
      form.resetFields();
      form.setFieldsValue({
        allCnt: null,
        endDate: null,
      });
      router.push(`/admin/class/list`);
    }
  }, [st_lectureCreateDone]);

  useEffect(() => {
    if (st_lectureCreateError) {
      message.error(st_lectureCreateError);
    }
  }, [st_lectureCreateError]);

  useEffect(() => {
    if (startDate && inputPeriod.value && form) {
      const endDateData = moment(
        new Date(
          startDate.getFullYear(),
          startDate.getMonth(),
          startDate.getDate() + 7 * inputPeriod.value
        )
      ).format("YYYY-MM-DD");
      form.setFieldsValue({
        endDate: endDateData,
      });
      setEndDate(endDateData);
    }
  }, [startDate, inputPeriod, form]);

  useEffect(() => {
    if (inputCnt.value && inputPeriod.value && form) {
      form.setFieldsValue({
        allCnt: inputPeriod.value * inputCnt.value,
      });
    }
  }, [inputCnt, inputPeriod, form]);

  ////// HANDLER ///////

  const startDateChangeHandler = useCallback((e) => {
    const startDate = new Date(e.format("YYYY-MM-DD"));

    setStartDate(startDate);
  }, []);

  const onSubmit = useCallback((data, idx) => {
    if (parseInt(data.cnt) !== data.day.length) {
      return message.error("횟수와 요일의 개수는 같아야합니다.");
    }
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

    dispatch({
      type: LECTURE_CREATE_REQUEST,
      data: {
        time: day,
        day: data.day.join(" "), //
        count: data.cnt, //
        course: data.course, //
        lecDate: data.lecDate, //
        startLv: data.lv1 + "권 " + data.lv2 + "단원 " + data.lv3 + "페이지", //
        startDate: data.startDate.format(`YYYY-MM-DD`), //
        endDate: data.endDate, //
        UserId: data.UserId, //
        zoomLink: data.zoomLink,
      },
    });
  }, []);

  ////// TOGGLE ///////

  ////// DATAVIEW //////

  return (
    <AdminLayout>
      <PageHeader
        breadcrumbs={["클래스 관리", "클래스 생성"]}
        title={`클래스 생성`}
        subTitle={`새로운 클래스를 생성할 수 있습니다.`}
      />

      <AdminContent>
        <Wrapper
          width={`60%`}
          al={`flex-start`}
          bgColor={Theme.lightGrey_C}
          padding={`20px 20px 0 30px`}
          margin={`0 0 30px`}
          radius={`10px`}
          shadow={`0 0 6px rgba(0,0,0,0.16)`}
        >
          <GuideUl>
            <GuideLi color={Theme.red_C} margin={`0 0 5px`} isImpo>
              강의시간을 선택하려면 강의를 진행하는 요일부터 선택해야 합니다.
            </GuideLi>
            <GuideLi color={Theme.red_C} isImpo>
              횟수는 일주일에 강의를 몇 번 진행할지를 의미합니다. 횟수와 진행
              요일을 선택하면 총 횟수가 자동으로 계산됩니다.
            </GuideLi>
          </GuideUl>
        </Wrapper>
        <FormTag form={form} ref={formRef} onFinish={onSubmit}>
          <Wrapper dr={`row`} margin={`0 0 20px`}>
            <Text width={`80px`}>강의명</Text>
            <FormItem
              rules={[{ required: true, message: "강의명을 입력해주세요." }]}
              name={`course`}
            >
              <CusotmInput />
            </FormItem>
          </Wrapper>

          <Wrapper dr={`row`} margin={`0 0 20px`}>
            <Text width={`80px`}>강사</Text>
            <FormItem
              rules={[{ required: true, message: "강사를 선택해주세요." }]}
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

          <Wrapper dr={`row`} margin={`0 0 20px`}>
            <Text width={`80px`}>레벨</Text>
            <Wrapper dr={`row`} width={`calc(100% - 80px)`}>
              <Wrapper width={`calc(100% / 3)`} dr={`row`} ju={`flex-start`}>
                <FormItem
                  name={`lv1`}
                  width={`calc(100% - 50px)`}
                  rules={[
                    { required: true, message: "강의 레벨을 입력해주세요." },
                  ]}
                >
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

              <Wrapper width={`calc(100% / 3)`} dr={`row`} ju={`flex-start`}>
                <FormItem
                  name={`lv2`}
                  width={`calc(100% - 50px)`}
                  rules={[
                    { required: true, message: "강의 레벨을 입력해주세요." },
                  ]}
                >
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

              <Wrapper width={`calc(100% / 3)`} dr={`row`} ju={`flex-start`}>
                <FormItem
                  name={`lv3`}
                  width={`calc(100% - 50px)`}
                  rules={[
                    { required: true, message: "강의 레벨을 입력해주세요." },
                  ]}
                >
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
            <Text width={`80px`}>강의 기간</Text>
            <FormItem
              rules={[{ required: true, message: "강의 기간을 입력해주세요." }]}
              name={`lecDate`}
              width={`calc(100% - 110px)`}
            >
              <CusotmInput
                onChange={startDateChangeHandler}
                type={`number`}
                {...inputPeriod}
              />
            </FormItem>
            <Text width={`30px`} padding={`0 0 0 10px`}>
              주
            </Text>
          </Wrapper>

          <Wrapper dr={`row`} margin={`0 0 20px`}>
            <Text width={`80px`}>횟수</Text>
            <FormItem
              rules={[{ required: true, message: "횟수를 입력해주세요." }]}
              name={`cnt`}
              {...inputCnt}
              width={`calc(100% - 110px)`}
            >
              <CusotmInput type={`number`} />
            </FormItem>
            <Text width={`30px`} padding={`0 0 0 10px`}>
              회
            </Text>
          </Wrapper>

          <Wrapper dr={`row`} margin={`0 0 20px`}>
            <Text width={`80px`}>진행 요일</Text>
            <FormItem
              rules={[{ required: true, message: "요일을 입력해주세요." }]}
              name={`day`}
            >
              <Select
                mode="multiple"
                size={`large`}
                onChange={(e) => {
                  setDayArr(e);
                }}
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
              <Text width={`80px`}>수업 시간</Text>
              <Wrapper dr={`row`} ju={`flex-start`} width={`calc(100% - 80px)`}>
                {dayArr.map((data, idx) => {
                  return (
                    <FormItem
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
            <Text width={`80px`}>총 횟수</Text>
            <FormItem name={`allCnt`} width={`calc(100% - 110px)`}>
              <CusotmInput type={`number`} readOnly={true} />
            </FormItem>
            <Text width={`30px`} padding={`0 0 0 10px`}>
              회
            </Text>
          </Wrapper>

          <Wrapper dr={`row`} margin={`0 0 20px`}>
            <Text width={`80px`}>시작 날짜</Text>
            <FormItem
              rules={[{ required: true, message: "시작 날짜를 입력해주세요." }]}
              name={`startDate`}
            >
              <DateInput
                format={`YYYY-MM-DD`}
                size={`large`}
                onChange={startDateChangeHandler}
              />
            </FormItem>
          </Wrapper>

          <Wrapper dr={`row`} margin={`0 0 20px`}>
            <Text width={`80px`} onClick={() => setEndDate(null)}>
              종료 날짜
            </Text>
            <FormItem
              rules={[{ required: true, message: "종료 날짜를 입력해주세요." }]}
              name={`endDate`}
            >
              <CusotmInput
                format={`YYYY-MM-DD`}
                size={`large`}
                readOnly={true}
              />
            </FormItem>
          </Wrapper>

          <Wrapper dr={`row`} margin={`0 0 20px`}>
            <Text width={`80px`} onClick={() => setEndDate(null)}>
              줌 링크
            </Text>
            <FormItem
              rules={[
                { required: true, message: "줌링크를 입력해주세요." },
                { type: `url`, message: "https://를 붙여주세요." },
              ]}
              name={`zoomLink`}
            >
              <CusotmInput format={`YYYY-MM-DD`} size={`large`} />
            </FormItem>
          </Wrapper>

          {/* <Wrapper dr={`row`} margin={`0 0 20px`} al={`flex-start`}>
            <Text width={`100px`} margin={`8px 0 0`}>
              메모
            </Text>
            <FormItem
              rules={[{ required: true, message: "메모를 작성해주세요." }]}
              name={`memo`}
            >
              <CustomArea />
            </FormItem>
          </Wrapper> */}

          <Wrapper>
            <Button type={`primary`} htmlType={`submit`}>
              강의 생성
            </Button>
          </Wrapper>
        </FormTag>
      </AdminContent>

      {/* CREATE MODAL */}
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
