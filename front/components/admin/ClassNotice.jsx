import React, { useCallback, useEffect, useRef, useState } from "react";
import AdminLayout from "../AdminLayout";
import PageHeader from "../admin/PageHeader";
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
  Empty,
} from "antd";

import { useRouter, withRouter } from "next/router";
import wrapper from "../../store/configureStore";
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
  SpanText,
} from "../commonComponents";
import { LOAD_MY_INFO_REQUEST } from "../../reducers/user";
import {
  LECNOTICE_ADMIN_DETAIL_REQUEST,
  LECNOTICE_COMMENT_DETAIL_REQUEST,
  LECTURE_NOTICE_ADMIN_LIST_REQUEST,
} from "../../reducers/lectureNotice";
import { GUIDE_MODAL } from "../../reducers/notice";
import { saveAs } from "file-saver";
import Theme from "../Theme";
import moment from "moment";

const LoadNotification = (msg, content) => {
  notification.open({
    message: msg,
    description: content,
    onClick: () => {},
  });
};

const Icon = styled(Wrapper)`
  height: 1px;
  background: ${Theme.darkGrey_C};
  position: relative;

  &:before {
    content: "";
    position: absolute;
    bottom: -2px;
    right: 4px;
    width: 1px;
    height: 10px;
    background: ${Theme.darkGrey_C};
    transform: rotate(-60deg);
  }
`;

const HoverText = styled(Text)`
  cursor: pointer;
  &:hover {
    font-weight: 700;
  }
  transition: 0.2s;
`;

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

  const {
    adminLectureNotices,
    adminLecNoticeDetail,
    adminLecNoticeDetailReceviers,
    adminLecNoticeComment,
    lecNoticeCommentDetails,
  } = useSelector((state) => state.lectureNotice);

  const [viewModal, setViewModal] = useState(false);

  const [commentToggle, setCommentToggle] = useState(null);

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
      if (data) {
        dispatch({
          type: LECNOTICE_ADMIN_DETAIL_REQUEST,
          data: {
            LectureNoticeId: data.noticeId,
          },
        });
      }

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

  const getCommentHandler = useCallback(
    (id) => {
      setCommentToggle(true);
      dispatch({
        type: LECNOTICE_COMMENT_DETAIL_REQUEST,
        data: {
          lectureNoticeId: adminLecNoticeDetail.noticeId,
          commentId: id,
        },
      });
    },
    [router.query, adminLecNoticeDetail]
  );

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
      title: "조회수",
      dataIndex: "noticeHit",
    },
    {
      title: "댓글수",
      dataIndex: "commentCnt",
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

    {
      title: "생성일",
      dataIndex: "noticeCreatedAt",
    },
  ];

  return (
    <>
      <Table
        style={{ width: `100%` }}
        rowKey="noticeId"
        columns={columns}
        dataSource={adminLectureNotices ? adminLectureNotices : []}
        size="small"
      />

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
        width="900px"
        onOk={() => viewModalToggle(null)}
        onCancel={() => viewModalToggle(null)}
        title="게시글 상세보기"
      >
        {adminLecNoticeDetail && (
          <Form labelCol={{ span: 3 }} wrapperCol={{ span: 21 }}>
            <Form.Item label="강의명">
              <Text>{adminLecNoticeDetail.lectureName}</Text>
            </Form.Item>

            <Form.Item label="제목">
              <Text>{adminLecNoticeDetail.noticeTitle}</Text>
            </Form.Item>

            <Form.Item label="작성자">
              <Text>{adminLecNoticeDetail.noticeAuthor}</Text>
            </Form.Item>

            <Form.Item label="작성일">
              <Text>{adminLecNoticeDetail.noticeCreatedAt}</Text>
            </Form.Item>
            <Form.Item label="전송된 사람">
              <Wrapper dr={`row`} ju={`flex-start`}>

              {adminLecNoticeDetailReceviers && (
                adminLecNoticeDetailReceviers.length === 0 ? (
                  <Text>admin</Text>
                  ) : (
                    adminLecNoticeDetailReceviers.map((data, idx) => (
                      <Text key={data.idx}>{data.username}{idx !== adminLecNoticeDetailReceviers.length - 1 ? `, ` :``}</Text>
                      ))
                      )
                      )}
                      </Wrapper>
            </Form.Item>

            <Form.Item label="게시판 내용">
              <Wrapper
                al={`flex-start`}
                ju={`flex-start`}
                dangerouslySetInnerHTML={{
                  __html:
                    adminLecNoticeDetail && adminLecNoticeDetail.noticeContent,
                }}
              ></Wrapper>
            </Form.Item>

            {adminLecNoticeDetail.noticeFile && (
              <Form.Item label="첨부파일">
                <Wrapper
                  width={`120px`}
                  height={`30px`}
                  bgColor={Theme.basicTheme_C}
                  radius={`5px`}
                  margin={`0 10px 0 0`}
                  cursor={`pointer`}
                  color={Theme.white_C}
                  onClick={() =>
                    fileDownloadHandler(adminLecNoticeDetail.noticeFile)
                  }
                >
                  첨부파일 1
                </Wrapper>
              </Form.Item>
            )}
          </Form>
        )}

        {adminLecNoticeComment && adminLecNoticeComment.length === 0 ? (
          <Wrapper margin={`50px 0`}>
            <Empty description={`등록된 댓글이 없습니다.`} />
          </Wrapper>
        ) : (
          adminLecNoticeComment &&
          adminLecNoticeComment.map((data) => {
            return (
              <>
                <Wrapper
                  al={`flex-start`}
                  padding={`30px 10px`}
                  borderTop={`1px solid ${Theme.lightGrey3_C}`}
                  borderBottom={`1px solid ${Theme.lightGrey3_C}`}
                  cursor={`pointer`}
                  key={data.id}
                >
                  <Wrapper
                    dr={`row`}
                    ju={`space-between`}
                    al={`flex-start`}
                    margin={`0 0 13px`}
                  >
                    <Text fontSize={`18px`} fontWeight={`700`}>
                      {data.name}(
                      {data.level === 1
                        ? "student"
                        : data.level === 2
                        ? "teacher"
                        : "admin"}
                      )
                      <SpanText
                        fontSize={`16px`}
                        fontWeight={`400`}
                        color={Theme.grey2_C}
                        margin={`0 0 0 15px`}
                      >
                        {moment(data.createdAt).format("YYYY-MM-DD")}
                      </SpanText>
                    </Text>

                    <Wrapper width={`auto`} al={`flex-end`}>
                      <Wrapper dr={`row`} width={`auto`} margin={`0 0 10px`}>
                        {data.commentCnt !== 0 && (
                          <HoverText onClick={() => getCommentHandler(data.id)}>
                            More comments +
                          </HoverText>
                        )}
                      </Wrapper>
                    </Wrapper>
                  </Wrapper>
                  {data.content}
                </Wrapper>

                {/* 대댓글 영역 */}

                {commentToggle &&
                  lecNoticeCommentDetails &&
                  lecNoticeCommentDetails.length !== 0 &&
                  lecNoticeCommentDetails[0].id === data.id &&
                  lecNoticeCommentDetails.slice(1).map((v) => {
                    return (
                      <Wrapper
                        key={v.id}
                        padding={`10px 0 10px ${v.lev * 20}px`}
                        al={`flex-start`}
                        borderTop={`1px solid ${Theme.lightGrey_C}`}
                        bgColor={v.isDelete === 1 && Theme.lightGrey3_C}
                      >
                        <Wrapper
                          dr={`row`}
                          ju={`space-between`}
                          margin={`0 0 10px`}
                          width={`calc(100% - 15px)`}
                        >
                          <Wrapper dr={`row`} ju={`flex-start`} width={`auto`}>
                            <Wrapper
                              width={`auto`}
                              margin={`0 10px 0 0`}
                              al={`flex-start`}
                            >
                              <Wrapper
                                width={`1px`}
                                height={`15px`}
                                bgColor={Theme.darkGrey_C}
                              ></Wrapper>
                              <Icon width={`${v.lev * 10}px`}></Icon>
                            </Wrapper>
                            <Text fontSize={`18px`} fontWeight={`700`}>
                              {v.name}(
                              {v.level === 1
                                ? "student"
                                : v.level === 2
                                ? "teacher"
                                : "admin"}
                              )
                            </Text>
                            <Text
                              fontSize={`16px`}
                              margin={`0 15px`}
                              color={Theme.grey2_C}
                            >
                              {moment(v.createdAt).format("YYYY-MM-DD")}
                            </Text>
                          </Wrapper>
                          <Wrapper width={`auto`} al={`flex-end`}></Wrapper>
                        </Wrapper>

                        <Wrapper al={`flex-start`} margin={`0 0 15px 15px`}>
                          {v.isDelete === 1 ? (
                            <Text>삭제된 댓글입니다.</Text>
                          ) : (
                            <Text>{v.content.split("ㄴ")[1]}</Text>
                          )}
                        </Wrapper>
                      </Wrapper>
                    );
                  })}
              </>
            );
          })
        )}
      </Modal>
    </>
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
