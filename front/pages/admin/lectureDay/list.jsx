import React, { useCallback, useEffect, useState } from "react";
import AdminLayout from "../../../components/AdminLayout";
import PageHeader from "../../../components/admin/PageHeader";
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
} from "../../../reducers/user";
import { Table, Button, message, Modal, Select, Input, Form } from "antd";
import { useRouter, withRouter } from "next/router";
import wrapper from "../../../store/configureStore";
import { END } from "redux-saga";
import axios from "axios";
import {
  Combo,
  ComboOption,
  SpanText,
  Text,
  Wrapper,
  RowWrapper,
  ColWrapper,
  TextInput,
} from "../../../components/commonComponents";
import { LECTURE_ALL_LIST_REQUEST } from "../../../reducers/lecture";
import { CloseCircleOutlined } from "@ant-design/icons";
import {
  PARTICIPANT_CREATE_REQUEST,
  PARTICIPANT_DELETE_REQUEST,
  PARTICIPANT_USER_DELETE_LIST_REQUEST,
  PARTICIPANT_USER_MOVE_LIST_REQUEST,
  PARTICIPANT_USER_LIMIT_LIST_REQUEST,
  PARTICIPANT_LASTDATE_LIST_REQUEST,
} from "../../../reducers/participant";
import useInput from "../../../hooks//useInput";
import { SearchOutlined } from "@ant-design/icons";
import Theme from "../../../components/Theme";
import { PAYMENT_LIST_REQUEST } from "../../../reducers/payment";
import moment from "moment";

const AdminContent = styled.div`
  padding: 20px;
`;

const List = ({}) => {
  // LOAD CURRENT INFO AREA /////////////////////////////////////////////

  const { me, st_loadMyInfoDone } = useSelector((state) => state.user);

  const {
    partLastDateList,
    st_participantLastDateListDone,
    st_participantLastDateListError,
  } = useSelector((state) => state.participant);

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

  const inputSearch = useInput("");

  ////// USEEFFECT //////

  useEffect(() => {
    if (st_participantLastDateListDone) {
    }
  }, [st_participantLastDateListDone]);

  useEffect(() => {
    if (st_participantLastDateListError) {
      return message.error(st_participantLastDateListError);
    }
  }, [st_participantLastDateListError]);

  useEffect(() => {
    dispatch({
      type: PARTICIPANT_LASTDATE_LIST_REQUEST,
      data: {
        search: "",
      },
    });
  }, []);

  ////// TOGGLE //////

  ////// HANDLER //////

  const onSeachStuHandler = useCallback(() => {
    dispatch({
      type: PARTICIPANT_LASTDATE_LIST_REQUEST,
      data: {
        search: inputSearch.value,
      },
    });
  }, [inputSearch.value]);

  ////// DATAVIEW //////

  const columns = [
    {
      title: "번호",
      dataIndex: "id",
    },
    {
      title: "이름",
      dataIndex: "username",
    },
    {
      title: "이메일",
      dataIndex: "email",
    },
    {
      title: "국적",
      dataIndex: "stuCountry",
    },
    {
      title: "강사명",
      dataIndex: "id",
    },
    {
      title: "강의 번호",
      dataIndex: "number",
    },
    {
      title: "결제 날짜",
      dataIndex: "createdAt",
    },
    {
      title: "결제 금액",
      dataIndex: "price",
    },
    {
      title: "결제 만료일",
      render: (data) => <div>{`${data.lastDate}일`}</div>,
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        breadcrumbs={["수업 만료일 관리", "수업 만료일"]}
        title={`수업 만료일 목록`}
        subTitle={`홈페이지에 학생들에 수업 만료일을 확인할 수 있습니다.`}
      />
      {/* <AdminTop createButton={true} createButtonAction={() => {})} /> */}

      <AdminContent>
        <Wrapper dr={`row`} ju={`flex-start`} margin={`0 0 10px`}>
          <Input
            size="small"
            style={{ width: "20%" }}
            placeholder="수업 만료일 수 ex) 7일, 27일"
            {...inputSearch}
            onKeyDown={(e) => e.keyCode === 13 && onSeachStuHandler()}
          />
          <Button size="small" onClick={() => onSeachStuHandler()}>
            <SearchOutlined />
            검색
          </Button>
        </Wrapper>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={partLastDateList ? partLastDateList : []}
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

    // 구현부 종료
    context.store.dispatch(END);
    console.log("🍀 SERVER SIDE PROPS END");
    await context.store.sagaTask.toPromise();
  }
);

export default withRouter(List);
