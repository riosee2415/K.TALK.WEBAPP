import React, { useCallback, useEffect, useState } from "react";
import AdminTop from "../../../components/admin/AdminTop";
import PageHeader from "../../../components/admin/PageHeader";
import AdminLayout from "../../../components/AdminLayout";
import { useDispatch, useSelector } from "react-redux";
import {
  COMPANY_CREATE_MODAL_TOGGLE,
  COMPANY_GET_REQUEST,
  COMPANY_CREATE_REQUEST,
  COMPANY_DELETE_REQUEST,
  COMPANY_UPDATE_REQUEST,
} from "../../../reducers/company";
import {
  Table,
  Button,
  Image,
  message,
  Modal,
  notification,
  Input,
  Form,
} from "antd";
import styled from "styled-components";
import wrapper from "../../../store/configureStore";
import { END } from "redux-saga";
import axios from "axios";
import { useRouter } from "next/router";
import { LOAD_MY_INFO_REQUEST } from "../../../reducers/user";
import { Wrapper } from "../../../components/commonComponents";

const CompanyloadNotification = (msg, content) => {
  notification.open({
    message: msg,
    description: content,
    onClick: () => {},
  });
};

const AdminContent = styled.div`
  padding: 20px;
`;

const ModalWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const BusinessInformation = () => {
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

  const [deletePopVisible, setDeletePopVisible] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [updateId, setUpdateId] = useState(null);

  const [inputName, setInputName] = useState("");
  const [inputValue, setInputValue] = useState("");

  const {
    companys,
    st_companyError,
    createModal,
    st_companyCreateDone,
    st_companyCreateError,
    st_companyDeleteDone,
    st_companyDeleteError,
    st_companyUpdateDone,
    st_companyUpdateError,
  } = useSelector((state) => state.company);

  ////// USEEFFECT //////
  useEffect(() => {
    dispatch({
      type: COMPANY_GET_REQUEST,
    });
  }, []);

  useEffect(() => {
    if (st_companyError) {
      return message.error(st_companyError);
    }
  }, [st_companyError]);

  useEffect(() => {
    if (st_companyCreateDone) {
      createModalToggle();

      setInputName("");
      setInputValue("");

      dispatch({
        type: COMPANY_GET_REQUEST,
      });
    }
  }, [st_companyCreateDone, setInputName, setInputValue]);

  useEffect(() => {
    if (st_companyCreateError) {
      return message.error(st_companyCreateError);
    }
  }, [st_companyCreateError]);

  useEffect(() => {
    if (st_companyDeleteDone) {
      dispatch({
        type: COMPANY_GET_REQUEST,
      });
    }
  }, [st_companyDeleteDone]);

  useEffect(() => {
    if (st_companyDeleteError) {
      return message.error(st_companyDeleteError);
    }
  }, [st_companyDeleteError]);

  useEffect(() => {
    if (st_companyDeleteDone) {
      dispatch({
        type: COMPANY_GET_REQUEST,
      });
    }
  }, [st_companyDeleteDone]);

  useEffect(() => {
    if (st_companyDeleteError) {
      return message.error(st_companyDeleteError);
    }
  }, [st_companyDeleteError]);

  useEffect(() => {
    if (st_companyUpdateDone) {
      dispatch({
        type: COMPANY_GET_REQUEST,
      });

      createModalToggle();

      setInputName("");
      setInputValue("");
      setUpdateId(null);
    }
  }, [st_companyUpdateDone]);

  useEffect(() => {
    if (st_companyUpdateError) {
      return message.error(st_companyUpdateError);
    }
  }, [st_companyUpdateError]);

  ////// TOGGLE //////
  const createModalToggle = useCallback(() => {
    dispatch({
      type: COMPANY_CREATE_MODAL_TOGGLE,
    });
  }, [createModal]);

  const deletePopToggle = useCallback(
    (id) => () => {
      setDeleteId(id);
      setDeletePopVisible((prev) => !prev);
    },
    [deletePopVisible, deleteId]
  );

  const updatePopToggle = useCallback(
    (data) => () => {
      createModalToggle();

      setUpdateId(data.id);
      setInputName(data.name);
      setInputValue(data.value);
    },
    [deletePopVisible, deleteId]
  );

  ////// HANDLER //////

  const createHandler = useCallback(() => {
    if (!inputName || inputName.trim() === "") {
      return CompanyloadNotification(
        "ADMIN SYSTEM ERRLR",
        "이름을 입력해주세요."
      );
    }

    if (!inputValue || inputValue.trim() === "") {
      return CompanyloadNotification(
        "ADMIN SYSTEM ERRLR",
        "정보를 입력해주세요."
      );
    }

    dispatch({
      type: COMPANY_CREATE_REQUEST,
      data: { name: inputName, value: inputValue },
    });
  }, [inputName, inputValue]);

  const deleteCompanyHandler = useCallback(() => {
    if (!deleteId) {
      return CompanyloadNotification(
        "ADMIN SYSTEM ERRLR",
        "일시적인 장애가 발생되었습니다. 잠시 후 다시 시도해주세요."
      );
    }
    dispatch({
      type: COMPANY_DELETE_REQUEST,
      data: { companyId: deleteId },
    });

    setDeleteId(null);
    setDeletePopVisible((prev) => !prev);
  }, [deleteId]);

  const updateCompanyHandler = useCallback(
    (data) => {
      dispatch({
        type: COMPANY_UPDATE_REQUEST,
        data: { id: updateId, name: inputName, value: inputValue },
      });
    },
    [inputName, inputValue, updateId]
  );

  ////// DATAVIEW //////
  const columns = [
    {
      title: "No",
      dataIndex: "id",
    },
    {
      title: "NAME",
      render: (data) => <div>{data.name}</div>,
    },
    {
      title: "VALUE",
      render: (data) => <div>{data.value}</div>,
    },
    {
      title: "UPDATE",
      render: (data) => (
        <Button type="primary" onClick={updatePopToggle(data)}>
          UPDATE
        </Button>
      ),
    },
    {
      title: "DELETE",
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
        breadcrumbs={["기초 관리", "사업자정보 관리"]}
        title={`사업자정보 관리`}
        subTitle={`사업자 정보를 등록, 수정, 삭제 등 관리할 수 있습니다.`}
      />

      <AdminTop createButton={true} createButtonAction={createModalToggle} />

      <AdminContent>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={companys ? companys : []}
          size="small"
        />
      </AdminContent>

      {/* CREATE MODAL */}
      <Modal
        visible={createModal}
        width={`400px`}
        title={`사업자 정보 생성하기`}
        onCancel={() => {
          createModalToggle();
          setUpdateId(null);
        }}
        onOk={() => (updateId ? updateCompanyHandler() : createHandler())}
      >
        <Wrapper padding={` 10px `} al={`flex-start`}>
          <div>이름</div>

          <Input
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
          />

          <div>정보</div>
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </Wrapper>
      </Modal>

      <Modal
        visible={deletePopVisible}
        onOk={deleteCompanyHandler}
        onCancel={deletePopToggle(null)}
        title="정말 삭제하시겠습니까?"
      >
        <Wrapper padding={`20px`}>
          <Wrapper>삭제 된 데이터는 다시 복구할 수 없습니다.</Wrapper>
          <Wrapper>정말 삭제하시겠습니까?</Wrapper>
        </Wrapper>
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

export default BusinessInformation;
