import React, { useCallback, useEffect, useRef, useState } from "react";
import AdminLayout from "../../../components/AdminLayout";
import PageHeader from "../../../components/admin/PageHeader";
import AdminTop from "../../../components/admin/AdminTop";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Col,
  Modal,
  Row,
  Table,
  notification,
  Layout,
  Input,
  message,
} from "antd";
import {
  UPDATE_MODAL_CLOSE_REQUEST,
  UPDATE_MODAL_OPEN_REQUEST,
  PROCESS_UPDATE_REQUEST,
  PROCESS_LIST_REQUEST,
} from "../../../reducers/processApply";
import { LOAD_MY_INFO_REQUEST } from "../../../reducers/user";
import { useRouter } from "next/router";
import { render } from "react-dom";
import useInput from "../../../hooks/useInput";
import wrapper from "../../../store/configureStore";
import { END } from "redux-saga";
import axios from "axios";
import { ColWrapper, RowWrapper } from "../../../components/commonComponents";
import { saveAs } from "file-saver";
import Theme from "../../../components/Theme";

const { Sider, Content } = Layout;

const AdminContent = styled.div`
  padding: 20px;
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

const LoadNotification = (msg, content) => {
  notification.open({
    message: msg,
    description: content,
    onClick: () => {},
  });
};

const List = ({ location }) => {
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

  const [updateData, setUpdateData] = useState(null);

  const {
    processList,
    updateModal,

    st_questionUpdateDone,
    st_questionUpdateError,
  } = useSelector((state) => state.processApply);

  ////// USEEFFECT //////
  useEffect(() => {
    const qs = router.query;

    dispatch({
      type: PROCESS_LIST_REQUEST,
      data: { isComplete: qs.type ? qs.type : null },
    });
  }, [router.query]);

  useEffect(() => {
    if (st_questionUpdateDone) {
      const qs = router.query;

      dispatch({
        type: PROCESS_LIST_REQUEST,
        data: { isComplete: qs.type ? qs.type : null },
      });

      dispatch({
        type: UPDATE_MODAL_CLOSE_REQUEST,
      });
    }
  }, [st_questionUpdateDone]);

  useEffect(() => {
    if (st_questionUpdateError) {
      return message.error(st_questionUpdateError);
    }
  }, [st_questionUpdateError]);

  ////// TOGGLE //////

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
  }, [updateModal]);

  ////// HANDLER //////
  const onSubmitUpdate = useCallback(() => {
    dispatch({
      type: PROCESS_UPDATE_REQUEST,
      data: {
        id: updateData.id,
      },
    });
  }, [updateData]);

  const fileDownloadHandler = useCallback(async (filePath) => {
    let blob = await fetch(filePath).then((r) => r.blob());

    const file = new Blob([blob]);

    const ext = filePath.substring(
      filePath.lastIndexOf(".") + 1,
      filePath.length
    );

    const originName = `첨부파일.${ext}`;

    saveAs(file, originName);
  }, []);
  ////// DATAVIEW //////

  // Table
  const columns = [
    {
      title: "No",
      dataIndex: "id",
    },

    {
      title: "Title",
      render: (data) => <div>{data.title}</div>,
    },
    {
      title: "isCompleted",
      render: (data) => <div>{data.isCompleted ? `완료` : `미완료`}</div>,
    },
    ,
    {
      title: "CreatedAt",
      render: (data) => {
        return <div>{data.createdAt.substring(0, 10)}</div>;
      },
    },
    {
      title: "UpdatedAt",
      render: (data) => <div>{data.updatedAt.substring(0, 10)}</div>,
    },
    {
      title: "UPDATE",
      render: (data) => (
        <Button type="primary" onClick={() => updateModalOpen(data)}>
          UPDATE
        </Button>
      ),
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        breadcrumbs={["문의 관리", "문의 리스트"]}
        title={`문의 리스트`}
        subTitle={`홈페이지의 문의를 관리할 수 있습니다.`}
      />
      {/* <AdminTop createButton={true} createButtonAction={() => {})} /> */}

      <AdminContent>
        <RowWrapper margin={`0 0 10px 0`} gutter={5}>
          <Col>
            <Button onClick={() => moveLinkHandler(`/admin/question/list`)}>
              전체
            </Button>
          </Col>
          <Col>
            <Button
              onClick={() => moveLinkHandler(`/admin/question/list?type=true`)}
            >
              처리완료
            </Button>
          </Col>
          <Col>
            <Button
              onClick={() => moveLinkHandler(`/admin/question/list?type=false`)}
            >
              미처리
            </Button>
          </Col>
        </RowWrapper>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={processList ? processList : []}
          size="middle"
        />
      </AdminContent>

      <Modal
        visible={updateModal}
        width={`1000px`}
        title={`문의`}
        onCancel={updateModalClose}
        onOk={onSubmitUpdate}
        okText="Complete"
        cancelText="Cancel"
      >
        <RowWrapper padding={`50px`}>
          <ColWrapper
            span={12}
            al={`flex-start`}
            ju={`flex-start`}
            padding={`0 30px 0 0`}
          >
            <RowWrapper gutter={5} margin={`0 0 10px`}>
              <ColWrapper
                width={`120px`}
                height={`30px`}
                bgColor={Theme.basicTheme_C}
                color={Theme.white_C}
              >
                이름
              </ColWrapper>
              <ColWrapper>
                {updateData && updateData.firstName}&nbsp;
                {updateData && updateData.lastName}
              </ColWrapper>
            </RowWrapper>
            {/*  */}
            <RowWrapper gutter={5}>
              <ColWrapper
                width={`120px`}
                height={`30px`}
                bgColor={Theme.basicTheme_C}
                color={Theme.white_C}
              >
                문의 제목
              </ColWrapper>
              <ColWrapper>{updateData && updateData.title}</ColWrapper>
            </RowWrapper>
            {/*  */}
            <RowWrapper gutter={5} margin={`10px 0`}>
              <ColWrapper
                span={24}
                width={`100%`}
                bgColor={Theme.basicTheme_C}
                color={Theme.white_C}
              >
                문의 내용
              </ColWrapper>
              <ColWrapper></ColWrapper>
            </RowWrapper>
          </ColWrapper>
          <ColWrapper span={12} ju={`flex-start`}>
            <RowWrapper gutter={5} margin={`0 0 10px`}>
              <ColWrapper
                width={`120px`}
                height={`30px`}
                bgColor={Theme.basicTheme_C}
                color={Theme.white_C}
              >
                생년월일
              </ColWrapper>
              <ColWrapper>{updateData && updateData.dateOfBirth}</ColWrapper>
            </RowWrapper>

            <RowWrapper gutter={5} margin={`0 0 10px`}>
              <ColWrapper
                width={`120px`}
                height={`30px`}
                bgColor={Theme.basicTheme_C}
                color={Theme.white_C}
              >
                이름
              </ColWrapper>
              <ColWrapper>
                {updateData && updateData.firstName}&nbsp;
                {updateData && updateData.lastName}
              </ColWrapper>
            </RowWrapper>
          </ColWrapper>
        </RowWrapper>
        <RowWrapper padding={`20px 50px`}>
          {updateData && updateData.file1 && (
            <ColWrapper
              width={`120px`}
              height={`30px`}
              bgColor={Theme.grey_C}
              radius={`5px`}
              margin={`0 10px 0 0`}
              cursor={`pointer`}
              color={Theme.white_C}
              onClick={() => fileDownloadHandler(updateData.file1)}
            >
              첨부파일 1
            </ColWrapper>
          )}
          {updateData && updateData.file2 && (
            <ColWrapper
              width={`120px`}
              height={`30px`}
              bgColor={Theme.grey_C}
              radius={`5px`}
              margin={`0 10px 0 0`}
              cursor={`pointer`}
              color={Theme.white_C}
              onClick={() => fileDownloadHandler(updateData.file2)}
            >
              첨부파일 2
            </ColWrapper>
          )}
        </RowWrapper>
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

export default List;
