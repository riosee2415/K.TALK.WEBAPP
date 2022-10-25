import React, { useCallback, useEffect } from "react";
import AdminLayout from "../../../components/AdminLayout";
import PageHeader from "../../../components/admin/PageHeader";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import {
  LOAD_MY_INFO_REQUEST,
  USER_STU_LIST_REQUEST,
} from "../../../reducers/user";
import { Table, Button, message, Input, Select, Form } from "antd";
import { useRouter, withRouter } from "next/router";
import wrapper from "../../../store/configureStore";
import { END } from "redux-saga";
import axios from "axios";
import { Wrapper } from "../../../components/commonComponents";

import { PART_LAST_LIST_REQUEST } from "../../../reducers/participant";
import { useState } from "react";

const AdminContent = styled.div`
  padding: 20px;
`;

const SearchForm = styled(Form)`
  display: flex;
  flex-direction: row;
  width: auto;

  & .ant-form-item {
    width: 200px;
    margin: 0;
  }

  & .ant-form-item,
  & .ant-form-item-control-input {
    min-height: 0;
  }
`;

const List = ({}) => {
  ////// GLOBAL STATE //////

  const { me, st_loadMyInfoDone, userStuList } = useSelector(
    (state) => state.user
  );

  const { partLastList, st_participantLastDateListError } = useSelector(
    (state) => state.participant
  );

  ////// HOOKS //////
  const router = useRouter();

  const dispatch = useDispatch();

  const [searchForm] = Form.useForm();

  const [userId, setUserId] = useState(false);

  ////// USEEFFECT //////
  useEffect(() => {
    if (st_loadMyInfoDone) {
      if (!me || parseInt(me.level) < 3) {
        moveLinkHandler(`/admin`);
      }
    }
  }, [st_loadMyInfoDone]);

  useEffect(() => {
    dispatch({
      type: PART_LAST_LIST_REQUEST,
      data: {
        userId,
      },
    });
  }, [userId]);

  useEffect(() => {
    if (st_participantLastDateListError) {
      return message.error(st_participantLastDateListError);
    }
  }, [st_participantLastDateListError]);

  ////// TOGGLE //////

  ////// HANDLER //////
  const moveLinkHandler = useCallback((link) => {
    router.push(link);
  }, []);

  const selectHandler = useCallback(
    (data) => {
      setUserId(data);
    },
    [userId]
  );

  const allHandler = useCallback(() => {
    setUserId(false);
    searchForm.resetFields();
  }, [userId]);

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
      title: "아이디",
      dataIndex: "userId",
    },
    {
      title: "국적",
      dataIndex: "stuCountry",
    },

    {
      title: "남은 수업 횟수",
      render: (data) => <div>{data.ingyerCnt ? data.ingyerCnt : 0}</div>,
    },

    {
      title: "수업 종료일",
      dataIndex: "viewEndDate",
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        breadcrumbs={["수업 만료일 관리", "수업 만료일"]}
        title={`수업 만료일 목록`}
        subTitle={`홈페이지에 학생들에 수업 만료일을 확인할 수 있습니다.`}
      />

      <AdminContent>
        <Wrapper dr={`row`} ju={`flex-start`} margin={`0 0 10px`}>
          <SearchForm form={searchForm}>
            <Form.Item name="user">
              <Select
                size="small"
                placeholder="유저를 선택해주세요."
                onChange={selectHandler}
              >
                <Select.Option value={false} disabled>
                  유저를 선택해주세요.
                </Select.Option>
                {userStuList &&
                  userStuList.map((data) => (
                    <Select.Option key={data.id} value={data.id}>
                      {data.username}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
          </SearchForm>
          <Button size="small" type="primary" onClick={allHandler}>
            전체 조회
          </Button>
        </Wrapper>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={partLastList}
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
      type: PART_LAST_LIST_REQUEST,
    });

    context.store.dispatch({
      type: USER_STU_LIST_REQUEST,
    });

    // 구현부 종료
    context.store.dispatch(END);
    console.log("🍀 SERVER SIDE PROPS END");
    await context.store.sagaTask.toPromise();
  }
);

export default withRouter(List);
