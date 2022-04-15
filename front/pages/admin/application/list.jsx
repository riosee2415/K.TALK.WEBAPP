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
import { Wrapper, Text, SpanText } from "../../../components/commonComponents";
import {
  UPDATE_MODAL_CLOSE_REQUEST,
  UPDATE_MODAL_OPEN_REQUEST,
  APP_UPDATE_REQUEST,
  APP_LIST_REQUEST,
} from "../../../reducers/application";
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
    applicationList,
    updateModal,

    st_appUpdateDone,
    st_appUpdateError,
  } = useSelector((state) => state.app);

  ////// USEEFFECT //////
  useEffect(() => {
    const qs = router.query;

    dispatch({
      type: APP_LIST_REQUEST,
      data: { isComplete: qs.type ? qs.type : null },
    });
  }, [router.query]);

  useEffect(() => {
    if (st_appUpdateDone) {
      const qs = router.query;

      dispatch({
        type: APP_LIST_REQUEST,
        data: { isComplete: qs.type ? qs.type : null },
      });

      dispatch({
        type: UPDATE_MODAL_CLOSE_REQUEST,
      });
    }
  }, [st_appUpdateDone]);

  useEffect(() => {
    if (st_appUpdateError) {
      return message.error(st_appUpdateError);
    }
  }, [st_appUpdateError]);

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
      type: APP_UPDATE_REQUEST,
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
      dataIndex: "id",
    },

    {
      title: "이름",
      render: (data) => (
        <div>
          {data.firstName}&nbsp;{data.lastName}
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
          onClick={() => updateModalOpen(data)}>
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
            <Button onClick={() => moveLinkHandler(`/admin/application/list`)}>
              전체
            </Button>
          </Col>
          <Col>
            <Button
              onClick={() =>
                moveLinkHandler(`/admin/application/list?type=true`)
              }>
              처리완료
            </Button>
          </Col>
          <Col>
            <Button
              onClick={() =>
                moveLinkHandler(`/admin/application/list?type=false`)
              }>
              미처리
            </Button>
          </Col>
        </RowWrapper>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={applicationList ? applicationList : []}
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
        cancelText="Cancel">
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
        <Wrapper al={`flex-start`} ju={`flex-start`}>
          <Text fontSize={`16px`} fontWeight={`700`} margin={` 0 0 10px`}>
            설명회 참가 신청서
          </Text>
          <Wrapper dr={`row`} al={`flex-start`}>
            <Wrapper width={`50%`} al={`flex-start`} margin={`0 0 20px`}>
              <RowWrapper width={`100%`} margin={`0 0 10px`}>
                <ColWrapper
                  width={`120px`}
                  height={`30px`}
                  bgColor={Theme.basicTheme_C}
                  color={Theme.white_C}
                  margin={`0 5px 0 0`}>
                  이름
                </ColWrapper>
                <ColWrapper>
                  {updateData && updateData.firstName}&nbsp;
                  {updateData && updateData.lastName}
                </ColWrapper>
              </RowWrapper>

              <RowWrapper width={`100%`} margin={`0 0 10px`}>
                <ColWrapper
                  width={`120px`}
                  height={`30px`}
                  bgColor={Theme.basicTheme_C}
                  color={Theme.white_C}
                  margin={`0 5px 0 0`}>
                  성별
                </ColWrapper>
                <ColWrapper>{updateData && updateData.title}</ColWrapper>
              </RowWrapper>

              <RowWrapper width={`100%`} margin={`0 0 10px`}>
                <ColWrapper
                  width={`120px`}
                  height={`30px`}
                  bgColor={Theme.basicTheme_C}
                  color={Theme.white_C}
                  margin={`0 5px 0 0`}>
                  생년월일
                </ColWrapper>
                <ColWrapper>{updateData && updateData.dateOfBirth}</ColWrapper>
              </RowWrapper>

              <RowWrapper width={`100%`} margin={`0 0 10px`}>
                <ColWrapper
                  width={`120px`}
                  height={`30px`}
                  bgColor={Theme.basicTheme_C}
                  color={Theme.white_C}
                  margin={`0 5px 0 0`}>
                  이메일
                </ColWrapper>
                <ColWrapper>{updateData && updateData.gmailAddress}</ColWrapper>
              </RowWrapper>

              <RowWrapper width={`100%`} margin={`0 0 10px`}>
                <ColWrapper
                  width={`120px`}
                  height={`30px`}
                  bgColor={Theme.basicTheme_C}
                  color={Theme.white_C}
                  margin={`0 5px 0 0`}>
                  국가
                </ColWrapper>
                <ColWrapper>{updateData && updateData.nationality}</ColWrapper>
              </RowWrapper>

              <RowWrapper width={`100%`} margin={`0 0 10px`}>
                <ColWrapper
                  width={`120px`}
                  height={`30px`}
                  bgColor={Theme.basicTheme_C}
                  color={Theme.white_C}
                  margin={`0 5px 0 0`}>
                  거주 국가
                </ColWrapper>
                <ColWrapper>
                  {updateData && updateData.countryOfResidence}
                </ColWrapper>
              </RowWrapper>

              <RowWrapper width={`100%`} margin={`0 0 10px`}>
                <ColWrapper
                  width={`120px`}
                  height={`30px`}
                  bgColor={Theme.basicTheme_C}
                  color={Theme.white_C}
                  margin={`0 5px 0 0`}>
                  사용언어
                </ColWrapper>
                <ColWrapper>
                  {updateData && updateData.languageYouUse}
                </ColWrapper>
              </RowWrapper>

              <RowWrapper width={`100%`} margin={`0 0 10px`}>
                <ColWrapper
                  width={`120px`}
                  height={`30px`}
                  bgColor={Theme.basicTheme_C}
                  color={Theme.white_C}
                  margin={`0 5px 0 0`}>
                  휴대폰번호
                </ColWrapper>
                <ColWrapper>
                  {updateData && updateData.phoneNumber}
                  {updateData && updateData.phoneNumber2}
                </ColWrapper>
              </RowWrapper>

              <RowWrapper width={`100%`} margin={`0 0 10px`}>
                <ColWrapper
                  width={`120px`}
                  height={`30px`}
                  bgColor={Theme.basicTheme_C}
                  color={Theme.white_C}
                  margin={`0 5px 0 0`}>
                  가능한 수업시간
                </ColWrapper>
                <ColWrapper>{updateData && updateData.classHour}</ColWrapper>
              </RowWrapper>
            </Wrapper>
            <Wrapper width={`50%`} margin={`0 0 10px`} al={`flex-start`}>
              <ColWrapper
                width={`100%`}
                height={`30px`}
                bgColor={Theme.basicTheme_C}
                color={Theme.white_C}
                margin={`0 5px 0 0`}>
                내용
              </ColWrapper>
              <ColWrapper width={`100%`} al={`flex-start`}>
                {updateData &&
                  updateData.comment &&
                  updateData.comment.split(`\n`).map((content, idx) => {
                    return (
                      <SpanText key={`${content}${idx}`}>
                        {content}
                        <br />
                      </SpanText>
                    );
                  })}
              </ColWrapper>
            </Wrapper>
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
