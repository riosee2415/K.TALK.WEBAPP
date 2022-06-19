import React, { useCallback, useEffect, useRef, useState } from "react";
import AdminLayout from "../../../../components/AdminLayout";
import PageHeader from "../../../../components/admin/PageHeader";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  Button,
  Modal,
  Select,
  notification,
  message,
  Form,
} from "antd";

import { useRouter, withRouter } from "next/router";
import wrapper from "../../../../store/configureStore";
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
  Text,
} from "../../../../components/commonComponents";
import { LOAD_MY_INFO_REQUEST } from "../../../../reducers/user";
import { LECTURE_NOTICE_ADMIN_LIST_REQUEST } from "../../../../reducers/lectureNotice";
import { GUIDE_MODAL } from "../../../../reducers/notice";
import { saveAs } from "file-saver";
import Theme from "../../../../components/Theme";

const LoadNotification = (msg, content) => {
  notification.open({
    message: msg,
    description: content,
    onClick: () => {},
  });
};

const NoticeClass = ({}) => {
  const { st_loadMyInfoDone, me } = useSelector((state) => state.user);

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

  const { guideModal } = useSelector((state) => state.notice);

  const { adminLectureNotices, lecNoticeCommentDetails } = useSelector(
    (state) => state.lectureNotice
  );

  const [viewModal, setViewModal] = useState(false);
  const [viewData, setViewData] = useState(null);

  const [commentModal, setCommentModal] = useState(false);
  const [commentData, setCommentData] = useState(null);

  ////// USEEFFECT //////
  useEffect(() => {
    if (router.query) {
      dispatch({
        type: LECTURE_NOTICE_ADMIN_LIST_REQUEST,
        data: {
          LectureId: parseInt(router.query.id),
        },
      });
    }
  }, [router.query]);

  ////// TOGGLE //////
  const guideModalToggle = useCallback(() => {
    dispatch({
      type: GUIDE_MODAL,
    });
  }, [guideModal]);

  const viewModalToggle = useCallback(
    (data) => {
      setViewData(data);

      setViewModal(!viewModal);
    },
    [viewModal]
  );

  const commentModalToggle = useCallback(
    (data) => {
      setViewData(data);

      setViewModal(!viewModal);
    },
    [viewModal]
  );

  ////// HANDLER //////
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

  ////// DATA COLUMNS //////

  const columns = [
    {
      title: "번호",
      dataIndex: "noticeId",
    },
    {
      title: "제목",
      dataIndex: "noticeTitle",
    },

    {
      title: "작성자",
      dataIndex: "noticeAuthor",
    },
    {
      title: "상세정보",
      render: (data) => (
        <Button
          type="primary"
          size="small"
          onClick={() => viewModalToggle(data)}
        >
          상세정보
        </Button>
      ),
    },

    // {
    //   title: "게시글 댓글",
    //   render: (data) => (
    //     <Button
    //       type="primary"
    //       size="small"
    //       onClick={() => viewModalToggle(data)}
    //     >
    //       댓글보기
    //     </Button>
    //   ),
    // },
    {
      title: "생성일",
      dataIndex: "noticeCreatedAt",
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        breadcrumbs={["게시판 관리", "게시판"]}
        title={`게시판 목록`}
        subTitle={`강의 게시판을 확인할 수 있습니다.`}
      />

      <AdminContent>
        <Wrapper margin="0px 0px 20px 0px" dr="row" ju="flex-end">
          <ModalBtn
            type="primary"
            size="small"
            onClick={() => moveLinkHandler(`/admin/class/${router.query.id}`)}
          >
            해당 강의로 가기
          </ModalBtn>
          <ModalBtn
            type="danger"
            size="small"
            onClick={() => guideModalToggle()}
          >
            주의사항
          </ModalBtn>
        </Wrapper>

        <Table
          rowKey="noticeId"
          columns={columns}
          dataSource={adminLectureNotices ? adminLectureNotices : []}
          size="small"
        />
      </AdminContent>

      {/* 주의사항 */}
      <Modal
        visible={guideModal}
        width="700px"
        onOk={() => guideModalToggle()}
        onCancel={() => guideModalToggle()}
        title="주의사항"
      >
        <GuideUl>
          <GuideLi>강의 별 게시판입니다.</GuideLi>
          <GuideLi isImpo={true}>수정 및 삭제를 할 수 없습니다.</GuideLi>
        </GuideUl>
      </Modal>

      {/* 상세정보 */}

      <Modal
        visible={viewModal}
        width="700px"
        onOk={() => viewModalToggle(null)}
        onCancel={() => viewModalToggle(null)}
        title="게시글 상세보기"
      >
        {viewData && (
          <Form labelCol={{ span: 3 }} wrapperCol={{ span: 21 }}>
            <Form.Item label="강의명">
              <Text>{viewData.lectureName}</Text>
            </Form.Item>

            <Form.Item label="제목">
              <Text>{viewData.noticeTitle}</Text>
            </Form.Item>

            <Form.Item label="작성자">
              <Text>{viewData.noticeAuthor}</Text>
            </Form.Item>

            <Form.Item label="작성일">
              <Text>{viewData.noticeCreatedAt}</Text>
            </Form.Item>

            <Form.Item label="게시판 내용">
              <Wrapper
                al={`flex-start`}
                ju={`flex-start`}
                dangerouslySetInnerHTML={{
                  __html: viewData && viewData.noticeContent,
                }}
              ></Wrapper>
            </Form.Item>

            {viewData.noticeFile && (
              <Form.Item label="첨부파일">
                <Wrapper
                  width={`120px`}
                  height={`30px`}
                  bgColor={Theme.grey_C}
                  radius={`5px`}
                  margin={`0 10px 0 0`}
                  cursor={`pointer`}
                  color={Theme.white_C}
                  onClick={() => fileDownloadHandler(updateData.noticeFile)}
                >
                  첨부파일 1
                </Wrapper>
              </Form.Item>
            )}
          </Form>
        )}
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

export default withRouter(NoticeClass);
