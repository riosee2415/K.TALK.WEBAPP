import React, { useCallback, useEffect, useRef, useState } from "react";
import AdminLayout from "../../../components/AdminLayout";
import PageHeader from "../../../components/admin/PageHeader";
import AdminTop from "../../../components/admin/AdminTop";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { Button, Col, Modal, Table, message } from "antd";
import { Wrapper, Text } from "../../../components/commonComponents";

import {
  UPDATE_MODAL_CLOSE_REQUEST,
  UPDATE_MODAL_OPEN_REQUEST,
  PROCESS_APPLY_UPDATE_REQUEST,
  PROCESS_APPLY_LIST_REQUEST,
} from "../../../reducers/processApply";
import { LOAD_MY_INFO_REQUEST } from "../../../reducers/user";
import { useRouter } from "next/router";
import wrapper from "../../../store/configureStore";
import { END } from "redux-saga";
import axios from "axios";
import { ColWrapper, RowWrapper } from "../../../components/commonComponents";

import Theme from "../../../components/Theme";

const AdminContent = styled.div`
  padding: 20px;
`;

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
    processList2,
    updateModal,

    st_processApplyUpdateDone,
    st_processApplyUpdateError,
  } = useSelector((state) => state.processApply);

  ////// USEEFFECT //////
  useEffect(() => {
    const qs = router.query;

    dispatch({
      type: PROCESS_APPLY_LIST_REQUEST,
      data: { isComplete: qs.type ? qs.type : null },
    });
  }, [router.query]);

  useEffect(() => {
    if (st_processApplyUpdateDone) {
      const qs = router.query;

      dispatch({
        type: PROCESS_APPLY_LIST_REQUEST,
        data: { isComplete: qs.type ? qs.type : null },
      });

      dispatch({
        type: UPDATE_MODAL_CLOSE_REQUEST,
      });
    }
  }, [st_processApplyUpdateDone]);

  useEffect(() => {
    if (st_processApplyUpdateError) {
      return message.error(st_processApplyUpdateError);
    }
  }, [st_processApplyUpdateError]);

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
      type: PROCESS_APPLY_UPDATE_REQUEST,
      data: {
        id: updateData.id,
      },
    });
  }, [updateData]);

  ////// DATAVIEW //////

  // Table
  const columns = [
    {
      title: "No",
      render: (data) => <div>{data.id}</div>,
    },

    {
      title: "이름",
      render: (data) => (
        <div>
          {data.cFirstName}&nbsp;{data.cLastName}
        </div>
      ),
    },
    {
      title: "처리 여부",
      render: (data) => <div>{data.completedAt ? `완료` : `미완료`}</div>,
    },
    ,
    {
      title: "등록일",
      render: (data) => {
        return <div>{data.createdAt.substring(0, 10)}</div>;
      },
    },
    {
      title: "처리일",
      render: (data) => <div>{data.updatedAt.substring(0, 10)}</div>,
    },
    {
      title: "수정",
      render: (data) => (
        <Button
          type="primary"
          size={`small`}
          onClick={() => updateModalOpen(data)}
        >
          UPDATE
        </Button>
      ),
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        breadcrumbs={["신청서 관리", "신청서 리스트"]}
        title={`신청서 리스트`}
        subTitle={`홈페이지의 신청서를 관리할 수 있습니다.`}
      />
      {/* <AdminTop createButton={true} createButtonAction={() => {})} /> */}

      <AdminContent>
        <RowWrapper margin={`0 0 10px 0`} gutter={5}>
          <Col>
            <Button
              onClick={() => moveLinkHandler(`/admin/processApply2/list`)}
            >
              전체
            </Button>
          </Col>
          <Col>
            <Button
              onClick={() =>
                moveLinkHandler(`/admin/processApply2/list?type=true`)
              }
            >
              처리완료
            </Button>
          </Col>
          <Col>
            <Button
              onClick={() =>
                moveLinkHandler(`/admin/processApply2/list?type=false`)
              }
            >
              미처리
            </Button>
          </Col>
        </RowWrapper>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={processList2 ? processList2 : []}
          size="small"
        />
      </AdminContent>

      <Modal
        visible={updateModal}
        width={`1000px`}
        title={`신청서`}
        onCancel={updateModalClose}
        onOk={onSubmitUpdate}
        okText="Complete"
        cancelText="Cancel"
      >
        <Wrapper dr={`row`} ju={`flex-start`} margin={`0 0 20px`}>
          <Text fontSize={`16px`} fontWeight={`700`} margin={`0 20px 0 0`}>
            신청일 |&nbsp;{updateData && updateData.createdAt.slice(0, 10)}
          </Text>
          <Text fontSize={`16px`} fontWeight={`700`}>
            처리 완료일 |&nbsp;
            {updateData && updateData.completedAt
              ? updateData.completedAt.slice(0, 10)
              : `-`}
          </Text>
        </Wrapper>
        <Wrapper al={`flex-start`}>
          <Text fontSize={`16px`} fontWeight={`700`} margin={` 0 0 10px`}>
            정규과정 등록신청서
          </Text>
          <Wrapper dr={`row`} ju={`flex-start`} margin={`0 0 20px`}>
            <RowWrapper width={`50%`} margin={`0 0 10px`}>
              <ColWrapper
                width={`120px`}
                height={`30px`}
                bgColor={Theme.basicTheme_C}
                color={Theme.white_C}
                margin={`0 5px 0 0`}
              >
                이름
              </ColWrapper>
              <ColWrapper>
                {updateData && updateData.cFirstName}&nbsp;
                {updateData && updateData.cLastName}
              </ColWrapper>
            </RowWrapper>

            <RowWrapper width={`50%`} margin={`0 0 10px`}>
              <ColWrapper
                width={`120px`}
                height={`30px`}
                bgColor={Theme.basicTheme_C}
                color={Theme.white_C}
                margin={`0 5px 0 0`}
              >
                생년월일
              </ColWrapper>
              <ColWrapper>{updateData && updateData.cDateOfBirth}</ColWrapper>
            </RowWrapper>

            <RowWrapper width={`50%`} margin={`0 0 10px`}>
              <ColWrapper
                width={`120px`}
                height={`30px`}
                bgColor={Theme.basicTheme_C}
                color={Theme.white_C}
                margin={`0 5px 0 0`}
              >
                이메일
              </ColWrapper>
              <ColWrapper>{updateData && updateData.cGmailAddress}</ColWrapper>
            </RowWrapper>

            <RowWrapper width={`50%`} margin={`0 0 10px`}>
              <ColWrapper
                width={`120px`}
                height={`30px`}
                bgColor={Theme.basicTheme_C}
                color={Theme.white_C}
                margin={`0 5px 0 0`}
              >
                로그인 비밀번호
              </ColWrapper>
              <ColWrapper>{updateData && updateData.cLoginPw}</ColWrapper>
            </RowWrapper>

            <RowWrapper width={`50%`} margin={`0 0 10px`}>
              <ColWrapper
                width={`120px`}
                height={`30px`}
                bgColor={Theme.basicTheme_C}
                color={Theme.white_C}
                margin={`0 5px 0 0`}
              >
                성별
              </ColWrapper>
              <ColWrapper>{updateData && updateData.cGender}</ColWrapper>
            </RowWrapper>

            <RowWrapper width={`50%`} margin={`0 0 10px`}>
              <ColWrapper
                width={`120px`}
                height={`30px`}
                bgColor={Theme.basicTheme_C}
                color={Theme.white_C}
                margin={`0 5px 0 0`}
              >
                국가
              </ColWrapper>
              <ColWrapper>{updateData && updateData.cNationality}</ColWrapper>
            </RowWrapper>

            <RowWrapper width={`50%`} margin={`0 0 10px`}>
              <ColWrapper
                width={`120px`}
                height={`30px`}
                bgColor={Theme.basicTheme_C}
                color={Theme.white_C}
                margin={`0 5px 0 0`}
              >
                거주 국가
              </ColWrapper>
              <ColWrapper>
                {updateData && updateData.cCountryofResidence}
              </ColWrapper>
            </RowWrapper>

            <RowWrapper width={`50%`} margin={`0 0 10px`}>
              <ColWrapper
                width={`120px`}
                height={`30px`}
                bgColor={Theme.basicTheme_C}
                color={Theme.white_C}
                margin={`0 5px 0 0`}
              >
                사용 언어
              </ColWrapper>
              <ColWrapper>
                {updateData && updateData.cLanguageYouUse}
              </ColWrapper>
            </RowWrapper>

            <RowWrapper width={`50%`} margin={`0 0 10px`}>
              <ColWrapper
                width={`120px`}
                height={`30px`}
                bgColor={Theme.basicTheme_C}
                color={Theme.white_C}
                margin={`0 5px 0 0`}
              >
                휴대폰 번호
              </ColWrapper>
              <ColWrapper>{updateData && updateData.cPhonenumber}</ColWrapper>
            </RowWrapper>

            <RowWrapper width={`50%`} margin={`0 0 10px`}>
              <ColWrapper
                width={`120px`}
                height={`30px`}
                bgColor={Theme.basicTheme_C}
                color={Theme.white_C}
                margin={`0 5px 0 0`}
              >
                sns
              </ColWrapper>
              <ColWrapper>{updateData && updateData.cSns}</ColWrapper>
            </RowWrapper>

            <RowWrapper width={`50%`} margin={`0 0 10px`}>
              <ColWrapper
                width={`120px`}
                height={`30px`}
                bgColor={Theme.basicTheme_C}
                color={Theme.white_C}
                margin={`0 5px 0 0`}
              >
                sns id
              </ColWrapper>
              <ColWrapper>{updateData && updateData.cSnsId}</ColWrapper>
            </RowWrapper>
            <RowWrapper width={`50%`} margin={`0 0 10px`}>
              <ColWrapper
                width={`120px`}
                height={`30px`}
                bgColor={Theme.basicTheme_C}
                color={Theme.white_C}
                margin={`0 5px 0 0`}
              >
                직업
              </ColWrapper>
              <ColWrapper>{updateData && updateData.cOccupation}</ColWrapper>
            </RowWrapper>
          </Wrapper>
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

export default List;
