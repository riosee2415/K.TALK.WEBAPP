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
  width: ${(props) => props.width || `calc(100% - 100px)`};
  margin: 0;
`;

const CusotmInput = styled(TextInput)`
  width: 100%;
  &::placeholder {
    color: ${Theme.grey2_C};
  }
`;

const CustomArea = styled(TextArea)`
  width: 100%;
  border-radius: 0;
  &::placeholder {
    color: ${Theme.grey2_C};
  }
  &:focus {
    border: 1px solid ${Theme.grey2_C};
  }
`;

const DateInput = styled(DatePicker)`
  width: ${(props) => props.width || `100%`};
  &::placeholder {
    color: ${Theme.grey2_C};
  }
`;

const TimeInput = styled(TimePicker)`
  width: ${(props) => props.width || `100%`};
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

  const onSubmit = useCallback((data) => {
    console.log(data);
    dispatch({
      type: LECTURE_CREATE_REQUEST,
      data: {
        time: data.time,
        day: data.day,
        count: data.cnt,
        course: data.course,
        lecDate: data.lecDate,
        lecTime: "-",
        startLv: data.startLv,
        endLv: "-",
        startDate: data.startDate,
        endDate: data.endDate,
        memo: data.memo,
        price: data.price,
        UserId: data.UserId,
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
        <FormTag form={form} ref={formRef} onFinish={onSubmit}>
          <Wrapper dr={`row`} margin={`0 0 20px`}>
            <Text width={`100px`}>강의명</Text>
            <FormItem
              rules={[{ required: true, message: "강의명을 입력해주세요." }]}
              name={`course`}
            >
              <CusotmInput />
            </FormItem>
          </Wrapper>

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
            <Text width={`100px`}>레벨</Text>
            <FormItem
              rules={[{ required: true, message: "레벨을 입력해주세요." }]}
              name={`startLv`}
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
            <Text width={`30px`} padding={`0 0 0 10px`}>
              원
            </Text>
          </Wrapper>

          <Wrapper dr={`row`} margin={`0 0 20px`}>
            <Text width={`100px`}>수업 시간</Text>
            <FormItem
              rules={[{ required: true, message: "수업 시간을 입력해주세요." }]}
              name={`time`}
            >
              <TimeInput size={`large`} format={`HH:mm`} />
            </FormItem>
          </Wrapper>

          <Wrapper dr={`row`} margin={`0 0 20px`}>
            <Text width={`100px`}>강의 기간</Text>
            <FormItem
              rules={[{ required: true, message: "강의 기간을 입력해주세요." }]}
              name={`lecDate`}
              width={`calc(100% - 130px)`}
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
            <Text width={`100px`}>횟수</Text>
            <FormItem
              rules={[{ required: true, message: "횟수를 입력해주세요." }]}
              name={`cnt`}
              {...inputCnt}
              width={`calc(100% - 130px)`}
            >
              <CusotmInput type={`number`} />
            </FormItem>
            <Text width={`30px`} padding={`0 0 0 10px`}>
              회
            </Text>
          </Wrapper>

          <Wrapper dr={`row`} margin={`0 0 20px`}>
            <Text width={`100px`}>진행 요일</Text>
            <FormItem
              rules={[{ required: true, message: "요일을 입력해주세요." }]}
              name={`day`}
            >
              <CusotmInput />
            </FormItem>
          </Wrapper>

          <Wrapper dr={`row`} margin={`0 0 20px`}>
            <Text width={`100px`}>총 횟수</Text>
            <FormItem
              rules={[{ required: true, message: "횟수를 입력해주세요." }]}
              name={`allCnt`}
              width={`calc(100% - 130px)`}
            >
              <CusotmInput type={`number`} readOnly={true} />
            </FormItem>
            <Text width={`30px`} padding={`0 0 0 10px`}>
              회
            </Text>
          </Wrapper>

          <Wrapper dr={`row`} margin={`0 0 20px`}>
            <Text width={`100px`}>시작 날짜</Text>
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
            <Text
              width={`100px`}
              onClick={() => {
                setEndDate(null);
                console.log("");
              }}
            >
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

          <Wrapper dr={`row`} margin={`0 0 20px`} al={`flex-start`}>
            <Text width={`100px`} margin={`8px 0 0`}>
              메모
            </Text>
            <FormItem
              rules={[{ required: true, message: "메모를 작성해주세요." }]}
              name={`memo`}
            >
              <CustomArea />
            </FormItem>
          </Wrapper>

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
