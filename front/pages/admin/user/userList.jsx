import React, { useCallback, useEffect, useRef, useState } from "react";
import AdminLayout from "../../../components/AdminLayout";
import PageHeader from "../../../components/admin/PageHeader";
import AdminTop from "../../../components/admin/AdminTop";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import {
  LOAD_MY_INFO_REQUEST,
  UPDATE_MODAL_CLOSE_REQUEST,
  UPDATE_MODAL_OPEN_REQUEST,
  USERLIST_REQUEST,
  USERLIST_UPDATE_REQUEST,
} from "../../../reducers/user";
import {
  Table,
  Button,
  Image,
  message,
  Modal,
  Select,
  notification,
  Input,
  Form,
} from "antd";
import useInput from "../../../hooks/useInput";
import { SearchOutlined } from "@ant-design/icons";
import { useRouter, withRouter } from "next/router";
import wrapper from "../../../store/configureStore";
import { END } from "redux-saga";
import axios from "axios";
import { Wrapper } from "../../../components/commonComponents";

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

  const {
    users,
    updateModal,
    st_userListError,
    st_userListUpdateDone,
    st_userListUpdateError,
  } = useSelector((state) => state.user);

  const [updateData, setUpdateData] = useState(null);

  const inputName = useInput("");
  const inputEmail = useInput("");

  const inputSort = useInput("1");
  const inputLevel = useInput("");

  ////// USEEFFECT //////
  useEffect(() => {
    const query = router.query;

    dispatch({
      type: USERLIST_REQUEST,
      data: {
        name: query.name ? query.name : ``,
        email: query.email ? query.email : ``,
        listType: query.sort,
      },
    });
  }, [router.query]);

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
    }
  }, [st_userListUpdateDone]);

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
    router.push(
      `/admin/user/userList?name=${inputName.value}&email=${inputEmail.value}&sort=${inputSort.value}`
    );
  }, [inputSort.value]);

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

  ////// DATAVIEW //////

  const columns = [
    {
      title: "No",
      dataIndex: "id",
    },

    {
      title: "Username",
      render: (data) => <div>{data.username}</div>,
    },
    {
      title: "Nickname",
      render: (data) => <div>{data.nickname}</div>,
    },
    {
      title: "Email",
      render: (data) => <div>{data.email}</div>,
    },
    {
      title: "Mobile",
      render: (data) => <div>{data.mobile}</div>,
    },
    {
      title: "Level",
      render: (data) => <div>{data.level}</div>,
    },
    {
      title: "Update",
      render: (data) => (
        <Button type="primary" onClick={() => updateModalOpen(data)}>
          UPDATE
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
      {/* <AdminTop createButton={true} createButtonAction={() => {})} /> */}

      <AdminContent>
        <Input.Group compact style={{ margin: ` 0 0 10px 0` }}>
          <Select
            defaultValue="1"
            style={{ width: "10%" }}
            value={inputSort.value}
            onChange={(data) => inputSort.setValue(data)}
          >
            <Select.Option value="1">최근 가입일</Select.Option>
            <Select.Option value="2">이름순</Select.Option>
          </Select>
          <Input
            style={{ width: "20%" }}
            placeholder="사용자명"
            {...inputName}
          />
          <Input
            style={{ width: "20%" }}
            placeholder="이메일"
            {...inputEmail}
          />
          <Button
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
          dataSource={users ? users : []}
          size="small"
        />
      </AdminContent>

      <Modal
        visible={updateModal}
        width={`400px`}
        title={`사용자 레벨 수정`}
        onCancel={updateModalClose}
        onOk={onSubmitUpdate}
      >
        <Wrapper padding={`10px`} al={`flex-start`}>
          <div>사용자 레벨</div>
          <Select
            defaultValue="1"
            style={{ width: "100%" }}
            value={inputLevel.value}
            onChange={(data) => inputLevel.setValue(data)}
          >
            <Select.Option value="1">1</Select.Option>
            <Select.Option value="2">2</Select.Option>
            <Select.Option value="3">3</Select.Option>
            <Select.Option value="4">4</Select.Option>
          </Select>
        </Wrapper>
      </Modal>

      <Modal
        visible={false}
        onOk={() => {}}
        onCancel={() => {}}
        title="Ask"
      ></Modal>
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
