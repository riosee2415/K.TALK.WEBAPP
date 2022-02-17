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
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  CREATE_MODAL_CLOSE_REQUEST,
  CREATE_MODAL_OPEN_REQUEST,
  NOTICE_CREATE_REQUEST,
  NOTICE_UPDATE_REQUEST,
  NOTICE_DELETE_REQUEST,
  NOTICE_LIST_REQUEST,
} from "../../../../reducers/notice";
import { withRouter } from "next/router";
import useInput from "../../../../hooks/useInput";

import { END } from "redux-saga";
import axios from "axios";
import { useRouter } from "next/router";
import { LOAD_MY_INFO_REQUEST } from "../../../../reducers/user";
import wrapper from "../../../../store/configureStore";
import { Wrapper } from "../../../../components/commonComponents";

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

  const [isTop, setIsTop] = useState(false);
  const isTopChange = (e) => {
    setIsTop(e);
  };

  const realFile = useInput(null);
  const filename = useInput(null);

  const [updateData, setUpdateData] = useState(null);

  const [deletePopVisible, setDeletePopVisible] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  ////// HOOKS //////
  const dispatch = useDispatch();

  const fileRef = useRef();
  const formRef = useRef();
  const [state, setState] = useState(null);

  const searchValue = useInput("");
  const inputSearch = useInput("");

  const [form] = Form.useForm();

  ////// REDUX //////
  const {
    notices,
    maxPage,
    createModal,
    detailModal,
    st_noticeCreateDone,
    st_noticeUpdateDone,
    st_noticeDeleteDone,

    st_noticeListError,
    st_noticeCreateError,
    st_noticeUpdateError,
    st_noticeDeleteError,
  } = useSelector((state) => state.notice);

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
    if (st_noticeListError) {
      return message.error(st_noticeListError);
    }
  }, [st_noticeListError]);

  useEffect(() => {
    if (st_noticeCreateError) {
      return message.error(st_noticeCreateError);
    }
  }, [st_noticeCreateError]);

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
      const qs = getQs();
      dispatch({
        type: NOTICE_LIST_REQUEST,
        data: {
          qs,
        },
      });

      dispatch({
        type: CREATE_MODAL_CLOSE_REQUEST,
      });
    }
  }, [st_noticeCreateDone, router.query]);

  useEffect(() => {
    if (st_noticeUpdateDone) {
      const qs = getQs();
      dispatch({
        type: NOTICE_LIST_REQUEST,
        data: {
          qs,
        },
      });

      dispatch({
        type: CREATE_MODAL_CLOSE_REQUEST,
      });
    }
  }, [st_noticeUpdateDone, router.query]);

  useEffect(() => {
    if (st_noticeDeleteDone) {
      const qs = getQs();
      dispatch({
        type: NOTICE_LIST_REQUEST,
        data: {
          qs,
        },
      });
    }
  }, [st_noticeDeleteDone, router.query]);

  useEffect(() => {
    if (!createModal) {
      form.resetFields();
    }
  }, [createModal]);

  useEffect(() => {
    const qs = getQs();
    dispatch({
      type: NOTICE_LIST_REQUEST,
      data: {
        qs,
      },
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
      title: data.title,
      content: data.content,
      type: data.type,
      isTop: data.isTop,
    });

    setIsTop(data.isTop);
  }, []);

  const onSubmit = useCallback(
    (value) => {
      const formData = new FormData();

      formData.append("title", value.title);
      formData.append("content", value.content);
      formData.append("type", value.type);
      formData.append("isTop", isTop);
      formData.append("file", realFile.value);

      dispatch({
        type: NOTICE_CREATE_REQUEST,
        data: formData,
      });
    },
    [isTop, realFile.value]
  );

  const onSubmitUpdate = useCallback(
    (value) => {
      const formData = new FormData();

      formData.append("id", updateData.id);
      formData.append("title", value.title);
      formData.append("content", value.content);
      formData.append("type", value.type);
      formData.append("isTop", isTop);
      formData.append("file", realFile.value);

      dispatch({
        type: NOTICE_UPDATE_REQUEST,
        data: formData,
      });
    },
    [isTop, realFile.value, updateData]
  );

  const createModalOk = useCallback(() => {
    formRef.current.submit();
  }, [isTop, realFile.value]);

  const fileChangeHandler = useCallback(
    (e) => {
      const currentFile = e.target.files[0];

      realFile.setValue(currentFile);
      filename.setValue(currentFile.name);
    },
    [realFile.value]
  );

  const fileUploadClick = useCallback(() => {
    fileRef.current.click();
  }, [fileRef.current]);

  const otherPageCall = useCallback(
    (changePage) => {
      setCurrentPage(changePage);
      const queryString = `?page=${changePage}&search=${searchValue}`;

      dispatch({
        type: NOTICE_LIST_REQUEST,
        data: {
          qs: queryString || "",
        },
      });
    },
    [searchValue]
  );

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

  ////// DATAVIEW //////
  const columns = [
    {
      title: "No",
      dataIndex: "id",
    },
    {
      title: "Title",
      dataIndex: "title",
    },
    {
      title: "Author",
      dataIndex: "author",
    },
    {
      title: "Hit",
      dataIndex: "hit",
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
        breadcrumbs={["게시판 관리", "공지사항 관리"]}
        title={`공지사항 리스트`}
        subTitle={`사용자에게 제공하는 공지사항을 관리할 수 있습니다.`}
      />

      <AdminTop createButton={true} createButtonAction={createModalOpen} />

      <AdminContent>
        <Row gutter={[10, 10]} style={{ padding: "0 0 10px 0" }}>
          <Col span={`6`}>
            <Input
              style={{ width: "100%" }}
              placeholder="검색어"
              {...inputSearch}
            />
          </Col>

          <Col>
            <Button
              onClick={() =>
                moveLinkHandler(
                  `/admin/board/notice/list?page=${currentPage}&search=${inputSearch.value}`
                )
              }
            >
              <SearchOutlined />
              검색
            </Button>
          </Col>
        </Row>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={notices ? notices : []}
          size="small"
          pagination={{
            defaultCurrent: 1,
            current: parseInt(currentPage),

            total: maxPage * 10,
            onChange: (page) => otherPageCall(page),
          }}
        />
      </AdminContent>

      {/* CREATE MODAL */}
      <Modal
        visible={createModal}
        width={`1100px`}
        title={`새로운 공지사항 작성`}
        onOk={createModalOk}
        onCancel={updateData ? updateModalClose : createModalClose}
      >
        <Wrapper padding={`10px`}>
          <Form
            style={{ width: `100%` }}
            onFinish={updateData ? onSubmitUpdate : onSubmit}
            form={form}
            ref={formRef}
          >
            <Form.Item name={"title"} label="제목" rules={[{ required: true }]}>
              <Input allowClear placeholder="Title..." />
            </Form.Item>

            <Form.Item name={"type"} label="유형" rules={[{ required: true }]}>
              <Select
                showSearch
                style={{ width: 200 }}
                placeholder="Select a Type"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                <Select.Option value="공지사항">공지사항</Select.Option>
                <Select.Option value="새소식">새소식</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name={"isTop"} label="상단">
              <Switch
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
                defaultChecked={false}
                checked={isTop}
                onChange={isTopChange}
              />
            </Form.Item>

            <Form.Item
              name={"content"}
              label="본문"
              rules={[{ required: true }]}
            >
              <Input.TextArea
                allowClear
                placeholder="Content..."
                autoSize={{ minRows: 10, maxRows: 10 }}
              />
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
                  {filename.value ? filename.value : `파일을 선택해주세요.`}
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
        title="정말 삭제하시겠습니까?"
      >
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
