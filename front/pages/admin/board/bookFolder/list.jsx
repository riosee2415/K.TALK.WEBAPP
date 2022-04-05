import React, { useCallback, useEffect, useState, useRef } from "react";
import AdminLayout from "../../../../components/AdminLayout";
import AdminTop from "../../../../components/admin/AdminTop";
import PageHeader from "../../../../components/admin/PageHeader";
import styled from "styled-components";
import { Button, Table, Modal, Form, Input, notification, message } from "antd";

import { useDispatch, useSelector } from "react-redux";
import {
  CREATE_MODAL_CLOSE_REQUEST,
  CREATE_MODAL_OPEN_REQUEST,
  BOOK_FOLDER_CREATE_REQUEST,
  BOOK_FOLDER_UPDATE_REQUEST,
  BOOK_FOLDER_DELETE_REQUEST,
  BOOK_FOLDER_LIST_REQUEST,
} from "../../../../reducers/book";
import { withRouter } from "next/router";

import { END } from "redux-saga";
import axios from "axios";

import { LOAD_MY_INFO_REQUEST } from "../../../../reducers/user";
import wrapper from "../../../../store/configureStore";
import { Wrapper } from "../../../../components/commonComponents";

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

const BookFolderList = ({ router }) => {
  // LOAD CURRENT INFO AREA /////////////////////////////////////////////
  const { me, st_loadMyInfoDone } = useSelector((state) => state.user);

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

  const [updateData, setUpdateData] = useState(null);
  const [deletePopVisible, setDeletePopVisible] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  ////// HOOKS //////
  const dispatch = useDispatch();
  const formRef = useRef();

  const [form] = Form.useForm();

  ////// REDUX //////
  const {
    bookFolderList,
    createModal,

    st_bookFolderCreateDone,
    st_bookFolderUpdateDone,
    st_bookFolderDeleteDone,

    st_bookFolderListError,
    st_bookFolderCreateError,
    st_bookFolderUpdateError,
    st_bookFolderDeleteError,
  } = useSelector((state) => state.book);

  ////// USEEFFECT //////
  useEffect(() => {
    if (st_bookFolderListError) {
      return message.error(st_bookFolderListError);
    }
  }, [st_bookFolderListError]);

  useEffect(() => {
    if (st_bookFolderCreateError) {
      return message.error(st_bookFolderCreateError);
    }
  }, [st_bookFolderCreateError]);

  useEffect(() => {
    if (st_bookFolderUpdateError) {
      return message.error(st_bookFolderUpdateError);
    }
  }, [st_bookFolderUpdateError]);

  useEffect(() => {
    if (st_bookFolderDeleteError) {
      return message.error(st_bookFolderDeleteError);
    }
  }, [st_bookFolderDeleteError]);

  useEffect(() => {
    if (st_bookFolderCreateDone) {
      message.success(`책 폴더가 생성되었습니다.`);

      dispatch({
        type: BOOK_FOLDER_LIST_REQUEST,
      });

      dispatch({
        type: CREATE_MODAL_CLOSE_REQUEST,
      });
    }
  }, [st_bookFolderCreateDone, router.query]);

  useEffect(() => {
    if (st_bookFolderUpdateDone) {
      message.success(`책 폴더가 수정되었습니다.`);

      dispatch({
        type: BOOK_FOLDER_LIST_REQUEST,
      });

      dispatch({
        type: CREATE_MODAL_CLOSE_REQUEST,
      });
      setUpdateData(null);
    }
  }, [st_bookFolderUpdateDone, router.query]);

  useEffect(() => {
    if (st_bookFolderDeleteDone) {
      message.success(`책 폴더가 삭제되었습니다.`);

      dispatch({
        type: BOOK_FOLDER_LIST_REQUEST,
      });
    }
  }, [st_bookFolderDeleteDone, router.query]);

  useEffect(() => {
    if (!createModal) {
      form.resetFields();
    }
  }, [createModal]);

  useEffect(() => {
    dispatch({
      type: BOOK_FOLDER_LIST_REQUEST,
    });
  }, [router.query]);

  useEffect(() => {
    if (updateData) {
      setTimeout(() => {
        onFill(updateData);
      }, 500);
    }
  }, [updateData]);

  ////// TOGGLE ///////
  const createModalOpen = useCallback(() => {
    dispatch({
      type: CREATE_MODAL_OPEN_REQUEST,
    });
  }, [createModal]);

  const createModalClose = useCallback(() => {
    dispatch({
      type: CREATE_MODAL_CLOSE_REQUEST,
    });
  }, [createModal]);

  const updateModalOpen = useCallback(
    (data) => {
      dispatch({
        type: CREATE_MODAL_OPEN_REQUEST,
      });

      setUpdateData(data);
    },
    [createModal]
  );

  const updateModalClose = useCallback(() => {
    dispatch({
      type: CREATE_MODAL_CLOSE_REQUEST,
    });
    setUpdateData(null);
  }, [createModal]);

  const deletePopToggle = useCallback(
    (id) => () => {
      setDeleteId(id);
      setDeletePopVisible((prev) => !prev);
    },
    [deletePopVisible, deleteId]
  );

  const onFill = useCallback((data) => {
    formRef.current.setFieldsValue({
      title: data.value,
    });
  }, []);

  const onSubmit = useCallback((value) => {
    dispatch({
      type: BOOK_FOLDER_CREATE_REQUEST,
      data: {
        value: value.title,
      },
    });
  }, []);

  const onSubmitUpdate = useCallback(
    (value) => {
      dispatch({
        type: BOOK_FOLDER_UPDATE_REQUEST,
        data: {
          id: updateData.id,
          value: value.title,
        },
      });
    },
    [updateData]
  );

  const createModalOk = useCallback(() => {
    formRef.current.submit();
  }, []);

  const deleteNoticeHandler = useCallback(() => {
    if (!deleteId) {
      return LoadNotification(
        "ADMIN SYSTEM ERROR",
        "일시적인 장애가 발생되었습니다. 잠시 후 다시 시도해주세요."
      );
    }
    dispatch({
      type: BOOK_FOLDER_DELETE_REQUEST,
      data: { folderId: deleteId },
    });

    setDeleteId(null);
    setDeletePopVisible((prev) => !prev);
  }, [deleteId]);

  ////// DATAVIEW //////
  const columns = [
    {
      title: "No",
      dataIndex: "id",
    },
    {
      title: "Value",
      dataIndex: "value",
    },
    {
      title: "CreatedAt",
      render: (data) => <div>{data.createdAt.substring(0, 10)}</div>,
    },
    {
      title: "UPDATE",
      render: (data) => (
        <Button type="primary" onClick={() => updateModalOpen(data)}>
          UPDATE
        </Button>
      ),
    },
    {
      title: "DEL",
      render: (data) => (
        <Button type="danger" onClick={deletePopToggle(data.id)}>
          DEL
        </Button>
      ),
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        breadcrumbs={["게시판 관리", "폴더 관리"]}
        title={`폴더 리스트`}
        subTitle={`사용자에게 제공하는 폴더를 관리할 수 있습니다.`}
      />

      <AdminTop createButton={true} createButtonAction={createModalOpen} />

      <AdminContent>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={bookFolderList ? bookFolderList : []}
          size="small"
        />
      </AdminContent>

      {/* CREATE MODAL */}
      <Modal
        visible={createModal}
        width={`1100px`}
        title={`새로운 폴더 작성`}
        onOk={createModalOk}
        onCancel={updateData ? updateModalClose : createModalClose}>
        <Wrapper padding={`10px`}>
          <Form
            style={{ width: `100%` }}
            onFinish={updateData ? onSubmitUpdate : onSubmit}
            form={form}
            ref={formRef}>
            <Form.Item
              name={"title"}
              label="폴더 이름"
              rules={[{ required: true }]}>
              <Input allowClear placeholder="Title..." />
            </Form.Item>
          </Form>
        </Wrapper>
      </Modal>

      <Modal
        visible={deletePopVisible}
        onOk={deleteNoticeHandler}
        onCancel={deletePopToggle(null)}
        title="정말 삭제하시겠습니까?">
        <Wrapper>삭제 된 데이터는 다시 복구할 수 없습니다.</Wrapper>
        <Wrapper>정말 삭제하시겠습니까?</Wrapper>
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

export default withRouter(BookFolderList);
