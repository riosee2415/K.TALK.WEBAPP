import React, { useCallback, useEffect, useState, useRef } from "react";

import { END } from "redux-saga";
import axios from "axios";
import wrapper from "../../../../store/configureStore";

import styled from "styled-components";
import AdminLayout from "../../../../components/AdminLayout";
import AdminTop from "../../../../components/admin/AdminTop";
import PageHeader from "../../../../components/admin/PageHeader";
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
  Image,
} from "antd";
import {
  GuideDiv,
  RowWrapper,
  Text,
  Wrapper,
} from "../../../../components/commonComponents";

import { LOAD_MY_INFO_REQUEST } from "../../../../reducers/user";

import { useDispatch, useSelector } from "react-redux";
import { withRouter } from "next/router";
import useInput from "../../../../hooks/useInput";
import useWidth from "../../../../hooks/useWidth";

import {
  CREATE_MODAL_CLOSE_REQUEST,
  CREATE_MODAL_OPEN_REQUEST,
  COMMUNITY_TYPE_LIST_REQUEST,
  COMMUNITY_LIST_REQUEST,
  COMMUNITY_UPDATE_REQUEST,
  COMMUNITY_CREATE_REQUEST,
  COMMUNITY_UPLOAD_REQUEST,
  FILE_INIT,
  COMMUNITY_DELETE_REQUEST,
} from "../../../../reducers/community";
import ToastEditorComponent5 from "../../../../components/editor/ToastEditorComponent5";
import ToastEditorComponent6 from "../../../../components/editor/ToastEditorComponent6";
import Theme from "../../../../components/Theme";

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

  const [currentListType, setCurrentListType] = useState(null);
  const [contentData, setContentData] = useState("");

  const [form] = Form.useForm();

  ////// REDUX //////
  const {
    filePath,
    noticeLectureLastPage,
    createModal,

    st_communityCreateDone,

    st_communityUpdateDone,
    st_communityDeleteDone,

    st_communityListError,

    st_communityUpdateError,
    st_communityDeleteError,
    st_communityCreateError,

    communityTypes,
    communityList,
    communityMaxLength,
  } = useSelector((state) => state.community);

  ////// USEEFFECT //////

  useEffect(() => {
    if (st_communityListError) {
      return message.error(st_communityListError);
    }
  }, [st_communityListError]);

  useEffect(() => {
    if (st_communityCreateError) {
      return message.error(st_communityCreateError);
    }
  }, [st_communityCreateError]);

  useEffect(() => {
    if (st_communityUpdateError) {
      return message.error(st_communityUpdateError);
    }
  }, [st_communityUpdateError]);

  useEffect(() => {
    if (st_communityDeleteError) {
      return message.error(st_communityDeleteError);
    }
  }, [st_communityDeleteError]);

  useEffect(() => {
    if (st_communityCreateDone) {
      message.success("게시글이 생성되었습니다.");
      setCurrentListType(null);

      dispatch({
        type: COMMUNITY_LIST_REQUEST,
        data: {
          typeId: null,
        },
      });

      dispatch({
        type: CREATE_MODAL_CLOSE_REQUEST,
      });
      dispatch({
        type: FILE_INIT,
      });
      filename.setValue(``);
    }
  }, [st_communityCreateDone]);

  useEffect(() => {
    if (st_communityUpdateDone) {
      message.success("게시글이 수정되었습니다.");
      setCurrentListType(null);

      dispatch({
        type: COMMUNITY_LIST_REQUEST,
        data: {
          level: null,
        },
      });

      dispatch({
        type: CREATE_MODAL_CLOSE_REQUEST,
      });
      dispatch({
        type: FILE_INIT,
      });
    }
  }, [st_communityUpdateDone]);

  useEffect(() => {
    if (st_communityDeleteDone) {
      message.success("게시글이 삭제되었습니다.");
      dispatch({
        type: COMMUNITY_LIST_REQUEST,
        data: {
          typeId: currentListType,
        },
      });
    }
  }, [st_communityDeleteDone]);

  useEffect(() => {
    if (!createModal) {
      form.resetFields();
    }
  }, [createModal]);

  useEffect(() => {
    const typeId = currentListType;

    dispatch({
      type: COMMUNITY_LIST_REQUEST,
      data: {
        typeId,
      },
    });

    setCurrentPage(1);
  }, [currentListType]);

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
    dispatch({
      type: FILE_INIT,
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
    dispatch({
      type: FILE_INIT,
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
    form.setFieldsValue({
      title: data.title,
      content: data.content,
      type: data.CommunityTypeId,
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
      dispatch({
        type: COMMUNITY_CREATE_REQUEST,
        data: {
          title: value.title,
          content: contentData,
          file: filePath,
          type: value.type,
        },
      });
    },
    [filePath, contentData]
  );

  const onSubmitUpdate = useCallback(
    (value) => {
      dispatch({
        type: COMMUNITY_UPDATE_REQUEST,
        data: {
          id: updateData.id,
          title: value.title,
          content: contentData,
          file: filePath ? filePath : updateData.file,
          type: value.type,
        },
      });
    },
    [filePath, updateData, contentData]
  );

  const createModalOk = useCallback(() => {
    form.submit();
  }, [realFile.value]);

  const fileChangeHandler = useCallback(
    (e) => {
      const formData = new FormData();

      [].forEach.call(e.target.files, (file) => {
        formData.append("file", file);
      });

      dispatch({
        type: COMMUNITY_UPLOAD_REQUEST,
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
      type: COMMUNITY_DELETE_REQUEST,
      data: { communityId: deleteId },
    });

    setDeleteId(null);
    setDeletePopVisible((prev) => !prev);
  }, [deleteId]);

  const listBtnClickHandler = useCallback((type) => {
    setCurrentListType(type);
  }, []);

  const otherPageCall = useCallback(
    (changePage) => {
      setCurrentPage(changePage);

      dispatch({
        type: COMMUNITY_LIST_REQUEST,
        data: {
          page: changePage,
          typeId: currentListType,
        },
      });
    },
    [currentListType]
  );

  const getEditContent = (contentValue) => {
    setContentData(contentValue);
  };

  ////// DATAVIEW //////
  const columns = [
    {
      title: "번호",
      dataIndex: "id",
    },
    {
      title: "유형",
      dataIndex: "value",
    },
    {
      title: "제목",
      dataIndex: "title",
    },
    {
      title: "작성자",
      dataIndex: "username",
    },
    {
      title: "생성일",
      render: (data) => <div>{data.createdAt.substring(0, 13)}</div>,
    },
    {
      title: "수정",
      render: (data) => (
        <Button
          type="primary"
          size="small"
          onClick={() => updateModalOpen(data)}
        >
          수정
        </Button>
      ),
    },
    {
      title: "삭제",
      render: (data) => (
        <Button type="danger" size="small" onClick={deletePopToggle(data.id)}>
          삭제
        </Button>
      ),
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        breadcrumbs={["리뷰게시판 관리", "리뷰게시판"]}
        title={`리뷰게시판 목록`}
        subTitle={`사용자에게 제공하는 리뷰게시판을 관리할 수 있습니다.`}
      />

      <AdminContent>
        <Wrapper al={`flex-end`} margin={`0 0 10px`}>
          <Button
            size="small"
            type={`primary`}
            onClick={() => createModalOpen()}
          >
            게시판 작성하기
          </Button>
        </Wrapper>
        <Wrapper
          margin={`0px 0px 10px 0px`}
          radius="5px"
          bgColor={Theme.lightGrey_C}
          padding="5px"
          fontSize="13px"
          al="flex-start"
        >
          <GuideDiv isImpo={true}>
            홈페이지 메인화면에 보여지는 리뷰를 관리할 수 있습니다.
          </GuideDiv>
          <GuideDiv isImpo={true}>
            글 작성 또는 수정시 즉시 화면에 반영되기 때문에 신중하게
            처리바랍니다.
          </GuideDiv>
        </Wrapper>
        <RowWrapper margin={`0 0 10px`} gutter={5}>
          <Col>
            <Button
              size="small"
              type={currentListType === null && `primary`}
              onClick={() => listBtnClickHandler(null)}
            >
              전체
            </Button>
          </Col>
          {communityTypes &&
            communityTypes.map((data) => {
              return (
                <Col>
                  <Button
                    size="small"
                    type={currentListType === data.id && `primary`}
                    onClick={() => listBtnClickHandler(data.id)}
                  >
                    {data.value}
                  </Button>
                </Col>
              );
            })}
        </RowWrapper>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={communityList ? communityList : []}
          size="small"
          pagination={{
            defaultCurrent: 1,
            current: parseInt(currentPage),
            onChange: (page) => otherPageCall(page),
            total: communityMaxLength * 10,
          }}
        />
      </AdminContent>

      {/* CREATE MODAL */}
      <Modal
        visible={createModal}
        width={`1100px`}
        title={`새로운 게시글 작성`}
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
            <Form.Item
              name={"title"}
              label="제목"
              rules={[{ required: true, message: "제목을 입력해 주세요" }]}
            >
              <Input allowClear placeholder="Title..." />
            </Form.Item>

            <Form.Item
              name={"type"}
              label="유형"
              rules={[
                { required: true, message: "메세지 유형을 선택해 주세요." },
              ]}
            >
              <Select
                disabled={updateData ? true : false}
                showSearch
                style={{ width: 200 }}
                placeholder="Select a Type"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {communityTypes &&
                  communityTypes.map((data) => {
                    return (
                      <Select.Option key={data.id} value={data.id}>
                        {data.value}
                      </Select.Option>
                    );
                  })}
              </Select>
            </Form.Item>

            <Form.Item
              name={"content"}
              label="본문"
              rules={[{ required: true, message: "본문을 입력해 주세요." }]}
            >
              {updateData ? (
                <ToastEditorComponent5
                  action={getEditContent}
                  updateData={updateData}
                />
              ) : (
                <ToastEditorComponent6
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
                  accept={`.png, jpg`}
                  hidden
                  ref={fileRef}
                  onChange={fileChangeHandler}
                />
                <Filename></Filename>
                <Button type="primary" onClick={fileUploadClick}>
                  FILE UPLOAD
                </Button>
              </FileBox>
            </Form.Item>

            <Form.Item label={`이미지`}>
              <Image
                width={`100px`}
                src={filePath ? filePath : updateData && updateData.file}
              />
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

    context.store.dispatch({
      type: COMMUNITY_LIST_REQUEST,
      data: {
        typeId: null,
      },
    });

    context.store.dispatch({
      type: COMMUNITY_TYPE_LIST_REQUEST,
    });

    // 구현부 종료
    context.store.dispatch(END);
    console.log("🍀 SERVER SIDE PROPS END");
    await context.store.sagaTask.toPromise();
  }
);

export default withRouter(NoticeList);
