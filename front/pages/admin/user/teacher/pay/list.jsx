import React, { useCallback, useEffect, useState } from "react";
import AdminLayout from "../../../../../components/AdminLayout";
import PageHeader from "../../../../../components/admin/PageHeader";
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
  Popconfirm,
  DatePicker,
  Row,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import wrapper from "../../../../../store/configureStore";
import { END } from "redux-saga";
import axios from "axios";
import {
  GuideLi,
  GuideUl,
  Image,
  Text,
  TextArea,
  Wrapper,
} from "../../../../../components/commonComponents";

import {
  LOAD_MY_INFO_REQUEST,
  USER_ADMIN_TEACHER_UPDATE_REQUEST,
  USER_FIRE_UPDATE_REQUEST,
  USER_TEA_CREATE_REQUEST,
  USER_TEA_LIST_REQUEST,
} from "../../../../../reducers/user";

import { useRouter, withRouter } from "next/router";
import useInput from "../../../../../hooks/useInput";
import { TEACHER_PARTICIPANT_LIST_REQUEST } from "../../../../../reducers/participant";
import Theme from "../../../../../components/Theme";
import { LECTURE_ALL_LIST_REQUEST } from "../../../../../reducers/lecture";
import { TEACHER_ADMIN_PAY_LIST_REQUEST } from "../../../../../reducers/teacherPay";

const AdminContent = styled.div`
  padding: 20px;
`;

const CustomTable = styled(Table)`
  width: 100%;
`;

const FormTag = styled(Form)`
  width: 100%;
`;

const FormItem = styled(Form.Item)`
  width: 200px;
  margin: 0 10px 0 0 !important;
`;

const UserList = ({}) => {
  // LOAD CURRENT INFO AREA /////////////////////////////////////////////

  const {
    me,
    st_loadMyInfoDone,

    teacherList,
  } = useSelector((state) => state.user);

  const { allLectures } = useSelector((state) => state.lecture);

  const { teacherAdminPayListList, teacherPayAdminPrice } = useSelector(
    (state) => state.teacherpay
  );

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

  ////// USEEFFECT //////

  ////// TOGGLE //////

  ////// HANDLER //////

  const searchHandler = useCallback((data) => {
    dispatch({
      type: TEACHER_ADMIN_PAY_LIST_REQUEST,
      data: {
        TeacherId: data.TeacherId ? data.TeacherId : ``,
        searchDate: data.date[0].format(`YYYY-MM-DD`),
        endDate: data.date[1].format(`YYYY-MM-DD`),
        type: data.type,
        LectureId: data.LectureId,
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
      title: "강의 보기",
      render: (data) => (
        <Button
          size="small"
          type="primary"
          onClick={() => moveLinkHandler(`/admin?teacher=${data.id}`)}
        >
          강의보기
        </Button>
      ),
    },

    {
      title: "강사 상세보기",
      render: (data) => (
        <Button
          size="small"
          type="primary"
          onClick={() => detailModalToggle(data)}
        >
          상세보기
        </Button>
      ),
    },

    {
      title: "해지/재계약",
      render: (data) => (
        <Popconfirm
          onConfirm={() => TeacherFireUpdateHandler(data)}
          title={`강사를 ${data.isFire ? `재계약` : `해지`} 하시겠습니까?`}
        >
          <Button size="small" type={data.isFire ? `primary` : `danger`}>
            {data.isFire ? `재계약` : `해지`}
          </Button>
        </Popconfirm>
      ),
    },

    {
      title: "해지/재계약 기록",
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
            width={`calc(100% - 80px)`}
          >
            <FormTag form={form} onFinish={searchHandler}>
              <Row>
                <FormItem name={`TeacherId`}>
                  <Select size="small" placeholder="강사">
                    {teacherList &&
                      teacherList.map((data) => {
                        return (
                          <Select.Option value={data.id}>
                            {data.username}
                          </Select.Option>
                        );
                      })}
                  </Select>
                </FormItem>

                <FormItem name={`date`}>
                  <DatePicker.RangePicker
                    size="small"
                    placeholder={["start", "end"]}
                    format={`YYYY-MM-DD`}
                  />
                </FormItem>

                <FormItem name={`type`}>
                  <Select size="small" placeholder="유형">
                    <Select.Option value={``}>전체</Select.Option>
                    {["기본수당", "연장수당", "회의수당", "등록수당"].map(
                      (data) => {
                        return (
                          <Select.Option value={data}>{data}</Select.Option>
                        );
                      }
                    )}
                  </Select>
                </FormItem>

                <FormItem name={`LectureId`}>
                  <Select size="small" placeholder="강의">
                    <Select.Option value={null}>전체</Select.Option>
                    {allLectures &&
                      allLectures.map((data) => {
                        return (
                          <Select.Option value={data.id}>
                            {data.course}
                          </Select.Option>
                        );
                      })}
                  </Select>
                </FormItem>

                <Wrapper width={`auto`} height={`32px`}>
                  <Button widt={`80px`} size="small" htmlType={`submit`}>
                    <SearchOutlined />
                    검색
                  </Button>
                </Wrapper>
              </Row>
            </FormTag>
          </Wrapper>
        </Wrapper>

        <Table
          rowKey="id"
          columns={column}
          dataSource={teacherAdminPayListList ? teacherAdminPayListList : []}
          size="small"
        />
      </AdminContent>
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

    context.store.dispatch({
      type: LECTURE_ALL_LIST_REQUEST,
      data: {
        TeacherId: "",
        time: "",
        startLv: "",
        studentName: "",
      },
    });

    context.store.dispatch({
      type: TEACHER_ADMIN_PAY_LIST_REQUEST,
      data: {
        TeacherId: "",
        searchDate: "",
        endDate: "",
        type: "",
        LectureId: "",
      },
    });

    // 구현부 종료
    context.store.dispatch(END);
    console.log("🍀 SERVER SIDE PROPS END");
    await context.store.sagaTask.toPromise();
  }
);

export default withRouter(UserList);
