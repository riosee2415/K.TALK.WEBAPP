import React, { useCallback, useEffect, useState, useRef } from "react";
import AdminLayout from "../../../../components/AdminLayout";
import AdminTop from "../../../../components/admin/AdminTop";
import PageHeader from "../../../../components/admin/PageHeader";
import styled from "styled-components";
import {
  Button,
  Table,
  Modal,
  Form,
  Input,
  Select,
  Switch,
  notification,
  Row,
  Col,
  message,
} from "antd";
import {
  CloseOutlined,
  CheckOutlined,
  SearchOutlined,
  CloudSyncOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  CREATE_MODAL_CLOSE_REQUEST,
  CREATE_MODAL_OPEN_REQUEST,
  NOTICE_CREATE_REQUEST,
  NOTICE_UPDATE_REQUEST,
  NOTICE_DELETE_REQUEST,
  NOTICE_UPLOAD_REQUEST,
  NOTICE_LECTURE_CREATE_REQUEST,
  NOTICE_ADMIN_CREATE_REQUEST,
  NOTICE_LECTURE_LIST_REQUEST,
  NOTICE_ADMIN_LIST_REQUEST,
  NOTICE_FILE_INIT,
} from "../../../../reducers/notice";
import { withRouter } from "next/router";
import useInput from "../../../../hooks/useInput";
import useWidth from "../../../../hooks/useWidth";

import { END } from "redux-saga";
import axios from "axios";
import { useRouter } from "next/router";
import { LOAD_MY_INFO_REQUEST } from "../../../../reducers/user";
import wrapper from "../../../../store/configureStore";
import {
  CommonButton,
  RowWrapper,
  Text,
  Wrapper,
} from "../../../../components/commonComponents";
import { LECTURE_LIST_REQUEST } from "../../../../reducers/lecture";
import ToastEditorComponent3 from "../../../../components/editor/ToastEditorComponent3";
import ToastEditorComponent4 from "../../../../components/editor/ToastEditorComponent4";

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

const SearchRow = styled(Row)`
  margin-bottom: 10px;
`;

const LoadNotification = (msg, content) => {
  notification.open({
    message: msg,
    description: content,
    onClick: () => {},
  });
};

const NoticeList = ({ router }) => {
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

  const [currentPage, setCurrentPage] = useState(1);

  const realFile = useInput(null);
  const filename = useInput(null);

  const [updateData, setUpdateData] = useState(null);

  const [deletePopVisible, setDeletePopVisible] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  ////// HOOKS //////
  const dispatch = useDispatch();
  const width = useWidth();

  const fileRef = useRef();
  const formRef = useRef();

  const [isLectureBoard, setIsLectureBoard] = useState(false);

  const [currentLectureId, setCurrentLectureId] = useState(null);
  const [currentListType, setCurrentListType] = useState(null);
  const [contentData, setContentData] = useState("");

  const [form] = Form.useForm();

  ////// REDUX //////
  const {
    notices,
    noticeLectureList,
    uploadPath,
    noticeLectureLastPage,
    createModal,
    detailModal,
    st_noticeCreateDone,
    st_noticeLectureCreateDone,
    st_noticeUpdateDone,
    st_noticeDeleteDone,

    st_noticeLectureListError,
    st_noticeAdminListError,

    st_noticeCreateError,
    st_noticeUpdateError,
    st_noticeDeleteError,
    st_noticeLectureCreateError,
  } = useSelector((state) => state.notice);

  const { lectures } = useSelector((state) => state.lecture);

  const getQs = () => {
    const qs = router.query;

    let value = "";

    if (!qs.page) {
      setCurrentPage(1);
      value = "?page=1";
    } else {
      setCurrentPage(qs.page);
      value = `?page=${qs.page}`;
    }

    if (qs.search) {
      value += `&search=${qs.search}`;
    }

    return value;
  };

  ////// USEEFFECT //////

  useEffect(() => {
    if (st_noticeLectureListError) {
      return message.error(st_noticeLectureListError);
    }
  }, [st_noticeLectureListError]);

  useEffect(() => {
    if (st_noticeAdminListError) {
      return message.error(st_noticeAdminListError);
    }
  }, [st_noticeAdminListError]);

  useEffect(() => {
    if (st_noticeCreateError) {
      return message.error(st_noticeCreateError);
    }
  }, [st_noticeCreateError]);

  useEffect(() => {
    if (st_noticeLectureCreateError) {
      return message.error(st_noticeLectureCreateError);
    }
  }, [st_noticeLectureCreateError]);

  useEffect(() => {
    if (st_noticeUpdateError) {
      return message.error(st_noticeUpdateError);
    }
  }, [st_noticeUpdateError]);

  useEffect(() => {
    if (st_noticeDeleteError) {
      return message.error(st_noticeDeleteError);
    }
  }, [st_noticeDeleteError]);

  useEffect(() => {
    if (st_noticeCreateDone) {
      message.success("게시글이 생성되었습니다.");
      setCurrentListType(1);

      dispatch({
        type: NOTICE_ADMIN_LIST_REQUEST,
        data: {
          level: 1,
        },
      });

      dispatch({
        type: CREATE_MODAL_CLOSE_REQUEST,
      });
      dispatch({
        type: NOTICE_FILE_INIT,
      });
      filename.setValue(``);
    }
  }, [st_noticeCreateDone]);

  useEffect(() => {
    if (st_noticeLectureCreateDone) {
      message.success("게시글이 생성되었습니다.");
      setCurrentListType(1);

      dispatch({
        type: NOTICE_ADMIN_LIST_REQUEST,
        data: {
          level: 1,
        },
      });

      dispatch({
        type: CREATE_MODAL_CLOSE_REQUEST,
      });
      dispatch({
        type: NOTICE_FILE_INIT,
      });
      filename.setValue(``);
    }
  }, [st_noticeLectureCreateDone]);

  useEffect(() => {
    if (st_noticeUpdateDone) {
      message.success("게시글이 수정되었습니다.");
      setCurrentListType(1);

      dispatch({
        type: NOTICE_ADMIN_LIST_REQUEST,
        data: {
          level: 1,
        },
      });

      dispatch({
        type: CREATE_MODAL_CLOSE_REQUEST,
      });
    }
  }, [st_noticeUpdateDone]);

  useEffect(() => {
    if (st_noticeDeleteDone) {
      message.success("게시글이 삭제되었습니다.");
      currentListType === 4
        ? dispatch({
            type: NOTICE_LECTURE_LIST_REQUEST,
            data: {
              page: currentPage,
              LectureId: currentLectureId,
            },
          })
        : dispatch({
            type: NOTICE_ADMIN_LIST_REQUEST,
            data: {
              level: currentListType,
            },
          });
    }
  }, [st_noticeDeleteDone]);

  useEffect(() => {
    if (!createModal) {
      form.resetFields();
    }
  }, [createModal]);

  useEffect(() => {
    const level = currentListType === 4 ? null : currentListType;
    if (currentListType !== 4) {
      dispatch({
        type: NOTICE_ADMIN_LIST_REQUEST,
        data: {
          level,
        },
      });
    }
  }, [currentListType]);

  useEffect(() => {
    if (updateData) {
      setTimeout(() => {
        onFill(updateData);
      }, 500);
    }
  }, [updateData]);

  useEffect(() => {
    const qs = getQs();
    const level = currentListType === 4 ? null : currentListType;
    if (currentListType !== 4) {
      dispatch({
        type: NOTICE_ADMIN_LIST_REQUEST,
        data: {
          level,
        },
      });
    }
  }, [currentListType]);

  useEffect(() => {
    const qs = getQs();
    dispatch({
      type: LECTURE_LIST_REQUEST,
      data: {
        sort: 1,
      },
    });
  }, [router.query]);

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
    setIsLectureBoard(false);
    filename.setValue(``);
  }, [createModal, filename]);

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
    filename.setValue(``);
  }, [createModal]);

  const deletePopToggle = useCallback(
    (id) => () => {
      setDeleteId(id);
      setDeletePopVisible((prev) => !prev);
    },
    [deletePopVisible, deleteId]
  );

  const onFill = useCallback((data) => {
    const type = data.LectureId
      ? "강의 게시판"
      : data.level === 2
      ? "강사 게시판"
      : data.level === 1
      ? "학생 게시판"
      : "전체 이용자 게시판";

    const lecture = data.LectureId && data.LectureId;

    formRef.current.setFieldsValue({
      title: data.title,
      content: data.content,
      type,
      author: data.author,
      lecture,
    });
  }, []);

  const onSubmit = useCallback(
    (value) => {
      if (!contentData || contentData.trim() === "") {
        return LoadNotification(
          "ADMIN SYSTEM ERROR",
          "작성하기 버튼을 눌러주세요."
        );
      }

      const level =
        value.type === "강사 게시판"
          ? 2
          : value.type === "학생 게시판"
          ? 1
          : null;

      if (value.type === "강의 게시판") {
        // console.log(value);
        dispatch({
          type: NOTICE_LECTURE_CREATE_REQUEST,
          data: {
            title: value.title,
            content: contentData,
            author: me.username,
            LectureId: value.lecture,
            file: uploadPath,
          },
        });
      } else {
        dispatch({
          type: NOTICE_ADMIN_CREATE_REQUEST,
          data: {
            level,
            title: value.title,
            content: contentData,
            author: me.username,
            file: uploadPath,
          },
        });
      }
    },
    [uploadPath, contentData, me]
  );

  const onSubmitUpdate = useCallback(
    (value) => {
      if (!contentData || contentData.trim() === "") {
        return LoadNotification(
          "ADMIN SYSTEM ERROR",
          "작성하기 버튼을 눌러주세요."
        );
      }

      dispatch({
        type: NOTICE_UPDATE_REQUEST,
        data: {
          id: updateData.id,
          title: value.title,
          content: contentData,
          file: uploadPath,
        },
      });
    },
    [uploadPath, updateData, contentData]
  );

  const createModalOk = useCallback(() => {
    formRef.current.submit();
  }, [realFile.value]);

  const fileChangeHandler = useCallback(
    (e) => {
      const formData = new FormData();
      filename.setValue(e.target.files[0].name);

      [].forEach.call(e.target.files, (file) => {
        formData.append("file", file);
      });

      dispatch({
        type: NOTICE_UPLOAD_REQUEST,
        data: formData,
      });
    },
    [realFile.value]
  );

  const fileUploadClick = useCallback(() => {
    fileRef.current.click();
  }, [fileRef.current]);

  const deleteNoticeHandler = useCallback(() => {
    if (!deleteId) {
      return LoadNotification(
        "ADMIN SYSTEM ERROR",
        "일시적인 장애가 발생되었습니다. 잠시 후 다시 시도해주세요."
      );
    }
    dispatch({
      type: NOTICE_DELETE_REQUEST,
      data: { noticeId: deleteId },
    });

    setDeleteId(null);
    setDeletePopVisible((prev) => !prev);
  }, [deleteId]);

  const noticeTypeChangeHandler = useCallback((e) => {
    if (e === "강의 게시판") {
      setIsLectureBoard(true);
    } else {
      setCurrentLectureId(null);
      setIsLectureBoard(false);
    }
  }, []);

  const otherPageCall = useCallback(
    (changePage) => {
      setCurrentPage(changePage);

      dispatch({
        type: NOTICE_LECTURE_LIST_REQUEST,
        data: {
          page: changePage,
          LectureId: currentLectureId,
        },
      });
    },
    [currentLectureId]
  );

  const listChangeHandler = useCallback(
    (LectureId) => {
      setCurrentLectureId(LectureId);
      dispatch({
        type: NOTICE_LECTURE_LIST_REQUEST,
        data: {
          page: currentPage,
          LectureId,
        },
      });
    },
    [currentPage]
  );

  const getEditContent = (contentValue) => {
    setContentData(contentValue);
  };

  const listBtnClickHandler = useCallback((type) => {
    setCurrentListType(type);
  }, []);

  ////// DATAVIEW //////
  const columns = [
    {
      title: "번호",
      dataIndex: "id",
    },
    {
      title: "제목",
      dataIndex: "title",
    },
    {
      title: "작성자",
      dataIndex: "author",
    },
    {
      title: "생성일",
      render: (data) => <div>{data.createdAt.substring(0, 13)}</div>,
    },
    {
      title: "수정",
      render: (data) => (
        <Button type="primary" onClick={() => updateModalOpen(data)}>
          수정
        </Button>
      ),
    },
    {
      title: "삭제",
      render: (data) => (
        <Button type="danger" onClick={deletePopToggle(data.id)}>
          삭제
        </Button>
      ),
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        breadcrumbs={["게시판 관리", "게시판 관리"]}
        title={`게시판 목록`}
        subTitle={`사용자에게 제공하는 게시판을 관리할 수 있습니다.`}
      />

      <AdminTop createButton={true} createButtonAction={createModalOpen} />

      <AdminContent>
        <RowWrapper margin={`0 0 10px`} gutter={5}>
          <Col>
            <Button
              type={currentListType === 1 && `primary`}
              onClick={() => listBtnClickHandler(1)}>
              학생 게시판
            </Button>
          </Col>
          <Col>
            <Button
              type={currentListType === 2 && `primary`}
              onClick={() => listBtnClickHandler(2)}>
              강사 게시판
            </Button>
          </Col>
          <Col>
            <Button
              type={currentListType === 4 && `primary`}
              onClick={() => listBtnClickHandler(4)}>
              강의 게시판
            </Button>
          </Col>
          <Col>
            <Button
              type={currentListType === 3 && `primary`}
              onClick={() => listBtnClickHandler(3)}>
              전체 이용자 게시판
            </Button>
          </Col>
        </RowWrapper>

        {currentListType === 4 && (
          <RowWrapper margin={`0 0 10px`}>
            <Text lineHeight={`2rem`}>강의 선택 :&nbsp;</Text>
            <Select
              onChange={listChangeHandler}
              showSearch
              placeholder="Select a Lecture"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              style={{ width: `300px` }}>
              {lectures &&
                lectures.map((data) => {
                  return (
                    <Select.Option value={data.id}>{data.course}</Select.Option>
                  );
                })}
            </Select>
          </RowWrapper>
        )}

        {currentListType === 4 ? (
          <Table
            rowKey="id"
            columns={columns}
            dataSource={noticeLectureList ? noticeLectureList : []}
            size="small"
            pagination={{
              defaultCurrent: 1,
              current: parseInt(currentPage),
              onChange: (page) => otherPageCall(page),
              total: noticeLectureLastPage * 10,
            }}
          />
        ) : (
          <Table
            rowKey="id"
            columns={columns}
            dataSource={notices ? notices : []}
            size="small"
          />
        )}
      </AdminContent>

      {/* CREATE MODAL */}
      <Modal
        visible={createModal}
        width={`1100px`}
        title={`새로운 게시글 작성`}
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
              label="제목"
              rules={[{ required: true, message: "제목을 입력해 주세요" }]}>
              <Input allowClear placeholder="Title..." />
            </Form.Item>

            <Form.Item
              name={"type"}
              label="유형"
              rules={[
                { required: true, message: "메세지 유형을 선택해 주세요." },
              ]}>
              <Select
                disabled={updateData ? true : false}
                showSearch
                onChange={(e) => noticeTypeChangeHandler(e)}
                style={{ width: 200 }}
                placeholder="Select a Type"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }>
                <Select.Option value="강사 게시판">강사 게시판</Select.Option>
                <Select.Option value="학생 게시판">학생 게시판</Select.Option>
                <Select.Option value="강의 게시판">강의 게시판</Select.Option>
                <Select.Option value="전체 이용자 게시판">
                  전체 이용자 게시판
                </Select.Option>
              </Select>
            </Form.Item>
            {isLectureBoard === true && (
              <Form.Item
                name={"lecture"}
                label="강의"
                rules={[{ required: true, message: "강의를 선택해 주세요." }]}>
                <Select
                  disabled={updateData ? true : false}
                  showSearch
                  style={{ width: 200 }}
                  placeholder="Select a Lecture"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }>
                  {lectures &&
                    lectures.map((data) => {
                      return (
                        <Select.Option value={data.id}>
                          {data.course}
                        </Select.Option>
                      );
                    })}
                </Select>
              </Form.Item>
            )}

            <Form.Item
              name={"content"}
              label="본문"
              rules={[{ required: true, message: "본문을 입력해 주세요." }]}>
              {/* <Input.TextArea
                allowClear
                placeholder="Content..."
                autoSize={{ minRows: 10, maxRows: 10 }}
              /> */}
              {updateData ? (
                <ToastEditorComponent3
                  action={getEditContent}
                  updateData={updateData}
                />
              ) : (
                <ToastEditorComponent4
                  action={getEditContent}
                  placeholder="내용을 입력해주세요."
                />
              )}
            </Form.Item>

            <Form.Item>
              <FileBox>
                <input
                  type="file"
                  name="file"
                  hidden
                  ref={fileRef}
                  onChange={fileChangeHandler}
                />
                <Filename>
                  {updateData
                    ? `첨부파일`
                    : filename.value
                    ? filename.value
                    : `파일을 선택해주세요.`}
                </Filename>
                <Button type="primary" onClick={fileUploadClick}>
                  FILE UPLOAD
                </Button>
              </FileBox>
            </Form.Item>

            {/* {updateData && (
            <Form.Item>
              <FileBox>
                <Button onClick={onFill}>불러오기</Button>
              </FileBox>
            </Form.Item>
          )} */}
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

export default withRouter(NoticeList);
