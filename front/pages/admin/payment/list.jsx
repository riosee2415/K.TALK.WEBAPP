import React, { useCallback, useEffect, useRef, useState } from "react";

import wrapper from "../../../store/configureStore";
import { END } from "redux-saga";
import axios from "axios";

import styled from "styled-components";
import AdminLayout from "../../../components/AdminLayout";
import PageHeader from "../../../components/admin/PageHeader";
import {
  Table,
  Button,
  Modal,
  notification,
  message,
  Input,
  Select,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import {
  AdminContent,
  GuideUl,
  GuideLi,
  Text,
  Wrapper,
} from "../../../components/commonComponents";

import { useDispatch, useSelector } from "react-redux";
import useInput from "../../../hooks/useInput";
import { useRouter, withRouter } from "next/router";

import { LOAD_MY_INFO_REQUEST } from "../../../reducers/user";
import {
  PAYMENT_LIST_REQUEST,
  PAYMENT_PERMIT_REQUEST,
} from "../../../reducers/payment";
import Theme from "../../../components/Theme";

const LoadNotification = (msg, content) => {
  notification.open({
    message: msg,
    description: content,
    onClick: () => {},
  });
};

const PaymentList = () => {
  const { st_loadMyInfoDone, me } = useSelector((state) => state.user);

  const {
    paymentList,
    st_paymentListDone,
    st_paymentListError,
    st_userFindEmailByDone,
    st_userFindEmailByError,
    st_paymentPermitDone,
    st_paymentPermitError,
  } = useSelector((state) => state.payment);

  const router = useRouter();

  const [accountModal, setAccountModal] = useState("");
  const [accountDetail, setAccountDetail] = useState("");

  const [listType, setListType] = useState("");
  const [type, setType] = useState("");

  const inputEmail = useInput("");

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

  const moveLinkHandler = useCallback((link) => {
    router.push(link);
  }, []);

  const onClickSearch = useCallback(() => {
    dispatch({
      type: PAYMENT_LIST_REQUEST,
      data: {
        email: inputEmail.value,
        type: type,
        listType: listType,
      },
    });
  }, [inputEmail.value, type, listType]);

  const modalOpen = useCallback((data) => {
    setAccountModal(true);
    setAccountDetail(data);
  }, []);

  const onModalOkHandler = useCallback(() => {
    setAccountModal(false);

    dispatch({
      type: PAYMENT_PERMIT_REQUEST,
      data: {
        id: accountDetail.id,
      },
    });
  }, [accountDetail]);

  const onCancelHandler = useCallback(() => {
    setAccountModal(false);
  }, []);

  const onClickAllList = useCallback(() => {
    dispatch({
      type: PAYMENT_LIST_REQUEST,
      data: {
        email: "",
        type: "",
        listType: 3,
      },
    });

    setType("");
    setListType("");
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

  ////// USEEFFECT //////

  useEffect(() => {
    if (st_paymentPermitDone) {
      dispatch({
        type: PAYMENT_LIST_REQUEST,
        data: {
          email: inputEmail.value,
          type: type,
          listType: listType,
        },
      });

      return message.success("입금 승인을 완료 했습니다.");
    }
  }, [st_paymentPermitDone, inputEmail.value, type, listType]);

  useEffect(() => {
    if (st_paymentPermitError) {
      return message.error(st_paymentPermitError);
    }
  }, [st_paymentPermitError]);

  ////// HANDLER //////

  ////// DATAVIEW //////

  ////// DATA COLUMNS //////

  const columns = [
    {
      title: "번호",
      dataIndex: "id",
    },

    {
      title: "이름",
      dataIndex: "name",
    },

    {
      title: "결제 유형",
      width: "80px",
      render: (data) => {
        return (
          <Wrapper>
            <Text>{data.type ? data.type : "PayPal"}</Text>

            {data.type === "계좌이체" && (
              <Button
                size="small"
                type="primary"
                disabled={data.isComplete}
                onClick={() => modalOpen(data)}
              >
                {data.isComplete ? "입금완료" : "입금승인"}
              </Button>
            )}
          </Wrapper>
        );
      },
    },

    {
      title: "결제한 강의",
      render: (data) => {
        return <Text>{data.course}</Text>;
      },
    },

    {
      title: "이메일",
      dataIndex: "email",
    },

    {
      title: "가격",
      render: (data) => {
        return <Text>&#36;{data.price}</Text>;
      },
    },

    {
      title: "결제일",
      render: (data) => {
        return (
          <Text>
            {data.type === "PayPal" || data.type === ""
              ? data.createdAt && data.createdAt.slice(0, 10)
              : data.completedAt}
          </Text>
        );
      },
    },

    // data.createdAt.slice(0, 10)

    // {
    //   title: "아이디 여부",
    //   render: (data, _, j) => {
    //     return (
    //       <Button
    //         type={`primary`}
    //         size={`small`}
    //         onClick={() => onClickCheckID(data)}
    //       >
    //         아이디 확인
    //       </Button>
    //     );
    //   },
    // },
  ];

  return (
    <AdminLayout>
      <PageHeader
        breadcrumbs={["입금 관리", "입금"]}
        title={`입금 관리`}
        subTitle={`관리자가 입금내역을 관리할 수 있습니다.`}
      />

      <AdminContent>
        <Wrapper dr={`row`} ju={`flex-start`} margin={`0 0 10px`}>
          <Input
            size="small"
            style={{ width: `200px` }}
            placeholder="이메일"
            {...inputEmail}
            onKeyDown={(e) => e.key === "Enter" && onClickSearch()}
          />

          <Select
            onChange={(e) => setType(e)}
            size="small"
            value={type || null}
            style={{ width: `200px` }}
            placeholder="결제유형을 선택해주세요."
          >
            <Select.Option value={"Paypal"}>Paypal</Select.Option>
            <Select.Option value={"계좌이체"}>계좌이체</Select.Option>
          </Select>

          <Select
            // disabled={type === "계좌이체" ? false : true}
            onChange={(e) => setListType(e)}
            size="small"
            value={listType || null}
            style={{ width: `200px` }}
            placeholder="입금승인 선택해주세요."
          >
            <Select.Option value={1}>미승인</Select.Option>
            <Select.Option value={2}>승인</Select.Option>
          </Select>
          <Button size="small" onClick={() => onClickSearch()}>
            <SearchOutlined />
            검색
          </Button>
          <Button size="small" type="primary" onClick={onClickAllList}>
            전체검색
          </Button>

          {/* <Button size="small" onClick={() => onClickTypeHandler("PayPal")}>
              PayPal
            </Button>
            <Button size="small" onClick={() => onClickTypeHandler("계좌이체")}>
              계좌이체
            </Button> */}
        </Wrapper>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={paymentList ? paymentList : []}
          size="small"
        />
      </AdminContent>

      {/* <Modal
        visible={false}
        width="900px"
        onOk={() => {}}
        onCancel={() => {}}
        title="주의사항">
        <GuideUl>
          <GuideLi>asdfasdf</GuideLi>
          <GuideLi isImpo={true}>asdfasdf</GuideLi>
        </GuideUl>
      </Modal> */}

      <Modal
        visible={accountModal}
        width="900px"
        onOk={onModalOkHandler}
        onCancel={onCancelHandler}
        title="입금확인"
      >
        <Wrapper>입금확인 내역은 다시 복구할 수 없습니다.</Wrapper>
        <Wrapper>정말 승인하시겠습니까?</Wrapper>
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
      data: {
        email: "",
        type: "",
        listType: 3,
      },
    });

    // 구현부 종료
    context.store.dispatch(END);
    console.log("🍀 SERVER SIDE PROPS END");
    await context.store.sagaTask.toPromise();
  }
);

export default withRouter(PaymentList);
