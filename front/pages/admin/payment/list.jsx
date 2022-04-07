import React, { useCallback, useEffect, useRef, useState } from "react";
import AdminLayout from "../../../components/AdminLayout";
import PageHeader from "../../../components/admin/PageHeader";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  Button,
  Modal,
  Select,
  notification,
  message,
  Input,
} from "antd";

import { useRouter, withRouter } from "next/router";
import wrapper from "../../../store/configureStore";
import { END } from "redux-saga";
import axios from "axios";
import {
  Wrapper,
  AdminContent,
  SearchForm,
  SearchFormItem,
  ModalBtn,
  GuideUl,
  GuideLi,
} from "../../../components/commonComponents";
import {
  LOAD_MY_INFO_REQUEST,
  USERLIST_REQUEST,
  USER_FIND_EMAIL_BY_REQUEST,
} from "../../../reducers/user";
import { SearchOutlined } from "@ant-design/icons";
import useInput from "../../../hooks/useInput";
import { PAYMENT_LIST_REQUEST } from "../../../reducers/payment";

const LoadNotification = (msg, content) => {
  notification.open({
    message: msg,
    description: content,
    onClick: () => {},
  });
};

const UserDeliAddress = ({}) => {
  const { st_loadMyInfoDone, me } = useSelector((state) => state.user);

  const {
    paymentList,
    st_paymentListDone,
    st_paymentListError,
    st_userFindEmailByDone,
    st_userFindEmailByError,
  } = useSelector((state) => state.payment);

  useEffect(() => {
    if (st_userFindEmailByDone) {
      if (emailCheckBool) {
        return message.success("기존 아이디가 있습니다.");
      } else {
        return message.warning("기존 아이디가 없습니다.");
      }
    }
  }, [st_userFindEmailByDone]);

  useEffect(() => {
    if (st_userFindEmailByError) {
      return message.error(st_userFindEmailByError);
    }
  }, [st_userFindEmailByError]);

  useEffect(() => {
    if (st_paymentListError) {
      return message.error(st_paymentListError);
    }
  }, [st_paymentListError]);

  const router = useRouter();

  const inputEmail = useInput("");

  const moveLinkHandler = useCallback((link) => {
    router.push(link);
  }, []);

  const onClickSearch = useCallback(() => {
    dispatch({
      type: PAYMENT_LIST_REQUEST,
      data: {
        email: inputEmail.value,
      },
    });
  }, [inputEmail.value]);

  useEffect(() => {
    if (st_loadMyInfoDone) {
      if (!me || parseInt(me.level) < 3) {
        moveLinkHandler(`/admin`);
      }
    }
  }, [st_loadMyInfoDone]);

  const onClickCheckID = useCallback((data) => {
    dispatch({
      type: USER_FIND_EMAIL_BY_REQUEST,
      data: {
        email: data.email,
      },
    });
  }, []);
  /////////////////////////////////////////////////////////////////////////

  ////// HOOKS //////
  const dispatch = useDispatch();

  ////// USEEFFECT //////

  ////// HANDLER //////

  ////// DATAVIEW //////

  ////// DATA COLUMNS //////

  const columns = [
    {
      title: "번호",
      dataIndex: "id",
    },

    {
      title: "결제한 강의",
      dataIndex: "class",
    },

    {
      title: "이메일",
      dataIndex: "email",
    },

    {
      title: "가격",
      dataIndex: "price",
    },

    {
      title: "생성일",
      dataIndex: "createdAt",
    },

    {
      title: "아이디 여부",
      render: (data) => {
        <Button onClick={() => onClickCheckID(data)}>아이디 확인</Button>;
      },
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        breadcrumbs={["결제내역 관리", "결제목록 관리"]}
        title={`결제목록 관리`}
        subTitle={`관리자가 결제내역을 관리할 수 있습니다.`}
      />

      <AdminContent>
        <Input.Group compact style={{ margin: ` 0 0 10px 0` }}>
          <Input
            size="small"
            style={{ width: "20%" }}
            placeholder="이메일"
            {...inputEmail}
            onKeyDown={(e) => e.key === "Enter" && onClickSearch()}
          />
          <Button size="small" onClick={() => onClickSearch()}>
            <SearchOutlined />
            검색
          </Button>
        </Input.Group>

        <Table rowKey="id" columns={columns} dataSource={[]} size="small" />
      </AdminContent>

      <Modal
        visible={false}
        width="900px"
        onOk={() => {}}
        onCancel={() => {}}
        title="주의사항">
        <GuideUl>
          <GuideLi>asdfasdf</GuideLi>
          <GuideLi isImpo={true}>asdfasdf</GuideLi>
        </GuideUl>
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
      type: PAYMENT_LIST_REQUEST,
    });

    // 구현부 종료
    context.store.dispatch(END);
    console.log("🍀 SERVER SIDE PROPS END");
    await context.store.sagaTask.toPromise();
  }
);

export default withRouter(UserDeliAddress);
