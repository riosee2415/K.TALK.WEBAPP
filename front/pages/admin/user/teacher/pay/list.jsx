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
import { Wrapper } from "../../../../../components/commonComponents";
import {
  LOAD_MY_INFO_REQUEST,
  USER_TEA_LIST_REQUEST,
} from "../../../../../reducers/user";
import { useRouter, withRouter } from "next/router";
import { LECTURE_ALL_LIST_REQUEST } from "../../../../../reducers/lecture";
import { TEACHER_ADMIN_PAY_LIST_REQUEST } from "../../../../../reducers/teacherpay";

const AdminContent = styled.div`
  padding: 20px;
`;

const FormTag = styled(Form)`
  width: 100%;
`;

const FormItem = styled(Form.Item)`
  width: 200px;
  margin: 0 10px 0 0 !important;
`;

const UserList = () => {
  // LOAD CURRENT INFO AREA /////////////////////////////////////////////

  const {
    me,
    st_loadMyInfoDone,

    teacherList,
  } = useSelector((state) => state.user);

  const { allLectures } = useSelector((state) => state.lecture);

  const { teacherAdminPayList, teacherPayAdminPrice } = useSelector(
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
        searchDate: data.date ? data.date[0].format(`YYYY-MM-DD`) : "",
        endDate: data.date ? data.date[1].format(`YYYY-MM-DD`) : "",
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
      render: (data) => <div>{data.email}</div>,
    },
    {
      title: "은행",
      render: (data) => <div>{data.bankName}</div>,
    },

    {
      title: "계좌번호",
      render: (data) => <div>{data.bankNo}</div>,
    },

    {
      title: "전화번호",
      render: (data) => <div>{data.mobile}</div>,
    },

    {
      title: "수당유형",
      render: (data) => <div>{data.type}</div>,
    },

    {
      title: "가격",
      render: (data) => (
        <div>{String(data.price).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
      ),
    },

    {
      title: "수당 지급일",
      render: (data) => <div>{data.createdAt}</div>,
    },
  ];

  const typeArr = [
    { type: "기본수당(정규과정)", price: 20000 },
    { type: "기본수당(무료설명회)", price: 30000 },
    { type: "대기수당(정규과정)", price: 10000 },
    { type: "대기수당(무료설명회)", price: 15000 },
    { type: "회의수당", price: 20000 },
    { type: "참관수당", price: 15000 },
    { type: "등록수당", price: 30000 },
    { type: "연장수당", price: 144 * 200 },
  ];
  return (
    <AdminLayout>
      <PageHeader
        breadcrumbs={["강의료", "강의료 산정 관리"]}
        title={`강의료 산정 관리`}
        subTitle={`강의료 산정를 확인할 수 있습니다.`}
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
                    {typeArr.map((data) => {
                      return (
                        <Select.Option key={data.id} value={data.type}>
                          {data.type}
                        </Select.Option>
                      );
                    })}
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
          dataSource={teacherAdminPayList ? teacherAdminPayList : []}
          size="small"
        />

        <Wrapper
          margin={`10px 0 0`}
          al={`flex-end`}
          fontSize={`16px`}
        >{`총 가격: ${String(teacherPayAdminPrice).replace(
          /\B(?=(\d{3})+(?!\d))/g,
          ","
        )}원`}</Wrapper>
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
