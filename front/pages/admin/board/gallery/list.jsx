import React, { useCallback, useEffect, useRef, useState } from "react";
import AdminLayout from "../../../../components/AdminLayout";
import PageHeader from "../../../../components/admin/PageHeader";
import AdminTop from "../../../../components/admin/AdminTop";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Form,
  Image,
  Input,
  Modal,
  Table,
  notification,
  Row,
  Col,
  message,
} from "antd";
import {
  CREATE_MODAL_CLOSE_REQUEST,
  CREATE_MODAL_OPEN_REQUEST,
  GALLERY_LIST_REQUEST,
  GALLERY_UPLOAD_REQUEST,
  GALLERY_CREATE_REQUEST,
  GALLERY_DELETE_REQUEST,
  UPDATE_GALLERY_PATH,
  GALLERY_UPDATE_REQUEST,
} from "../../../../reducers/gallery";
import useInput from "../../../../hooks/useInput";
import { withRouter } from "next/router";
import { SearchOutlined } from "@ant-design/icons";

import { END } from "redux-saga";
import axios from "axios";
import { LOAD_MY_INFO_REQUEST } from "../../../../reducers/user";
import wrapper from "../../../../store/configureStore";
import { Wrapper } from "../../../../components/commonComponents";

const GALLERY_WIDTH = `400`;
const GALLERY_HEIGHT = `600`;

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

const GalleryWrapper = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const GalleryImage = styled.img`
  width: 400px;
  height: 600px;
  object-fit: cover;
`;
const UploadWrapper = styled.div`
  width: 400px;
  margin: 5px 0;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

const GuideWrapper = styled.section`
  width: 600px;
  padding: 5px;
  margin-bottom: 10px;

  border-radius: 3px;
  background-color: #eeeeee;
`;

const GuideText = styled.div`
  font-size: 13.5px;
  color: #5e5e5e;
  font-weight: 700;
`;

const PreviewGuide = styled.p`
  font-weight: 700;
  color: #b1b1b1;
`;

const LoadNotification = (msg, content) => {
  notification.open({
    message: msg,
    description: content,
    onClick: () => {},
  });
};

const List = ({ router }) => {
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

  ////// HOOKS //////
  const dispatch = useDispatch();

  const {
    gallerys,
    maxPage,
    uploadGalleryPath,

    createModal,
    detailModal,

    st_galleryListDone,
    st_galleryCreateDone,
    st_galleryUpdateDone,
    st_galleryDeleteDone,

    st_galleryListError,
    st_galleryCreateError,
    st_galleryUpdateError,
    st_galleryDeleteError,

    st_galleryUploadLoading,
  } = useSelector((state) => state.gallery);

  const [currentPage, setCurrentPage] = useState(1);

  const imageInput = useRef();
  const formRef = useRef();

  const searchValue = useInput("");
  const inputSearch = useInput("");

  const [form] = Form.useForm();

  const [updateData, setUpdateData] = useState(null);

  const [deletePopVisible, setDeletePopVisible] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

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
      searchValue.setValue(qs.search);
    }

    return value;
  };

  ////// USEEFFECT //////
  useEffect(() => {
    const qs = getQs();
    dispatch({
      type: GALLERY_LIST_REQUEST,
      data: {
        qs,
      },
    });
  }, [router.query]);

  useEffect(() => {
    if (st_galleryCreateDone) {
      const qs = getQs();
      dispatch({
        type: GALLERY_LIST_REQUEST,
        data: {
          qs,
        },
      });

      dispatch({
        type: CREATE_MODAL_CLOSE_REQUEST,
      });
    }
  }, [st_galleryCreateDone, router.query]);

  useEffect(() => {
    if (st_galleryUpdateDone) {
      const qs = getQs();
      dispatch({
        type: GALLERY_LIST_REQUEST,
        data: {
          qs,
        },
      });

      dispatch({
        type: CREATE_MODAL_CLOSE_REQUEST,
      });
    }
  }, [st_galleryUpdateDone, router.query]);

  useEffect(() => {
    if (st_galleryDeleteDone) {
      const qs = getQs();
      dispatch({
        type: GALLERY_LIST_REQUEST,
        data: {
          qs,
        },
      });
    }
  }, [st_galleryDeleteDone, router.query]);

  useEffect(() => {
    if (!createModal) {
      form.resetFields();

      dispatch({
        type: UPDATE_GALLERY_PATH,
        data: "",
      });
    }
  }, [createModal]);

  useEffect(() => {
    if (updateData) {
      setTimeout(() => {
        onFill(updateData);
      }, 500);
    }
  }, [updateData]);

  useEffect(() => {
    if (st_galleryListError) {
      return message.error(st_galleryListError);
    }
  }, [st_galleryListError]);

  useEffect(() => {
    if (st_galleryCreateError) {
      return message.error(st_galleryCreateError);
    }
  }, [st_galleryCreateError]);

  useEffect(() => {
    if (st_galleryUpdateError) {
      return message.error(st_galleryUpdateError);
    }
  }, [st_galleryUpdateError]);

  useEffect(() => {
    if (st_galleryDeleteError) {
      return message.error(st_galleryDeleteError);
    }
  }, [st_galleryDeleteError]);

  ////// TOGGLE //////
  const createModalOpen = useCallback(() => {
    dispatch({
      type: CREATE_MODAL_OPEN_REQUEST,
    });
  }, [createModal]);

  const createModalClose = useCallback(() => {
    dispatch({
      type: CREATE_MODAL_CLOSE_REQUEST,
    });

    setUpdateData(null);
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

  const deletePopToggle = useCallback(
    (id) => () => {
      setDeleteId(id);
      setDeletePopVisible((prev) => !prev);
    },
    [deletePopVisible, deleteId]
  );
  ////// HANDLER //////
  const createModalOk = useCallback(() => {
    formRef.current.submit();
  }, []);

  const onChangeImages = useCallback((e) => {
    const formData = new FormData();

    [].forEach.call(e.target.files, (file) => {
      formData.append("image", file);
    });

    dispatch({
      type: GALLERY_UPLOAD_REQUEST,
      data: formData,
    });
  });

  const clickImageUpload = useCallback(() => {
    imageInput.current.click();
  }, [imageInput.current]);

  const onSubmit = useCallback(
    (value) => {
      if (!uploadGalleryPath || uploadGalleryPath.trim() === "") {
        return LoadNotification("ADMIN SYSTEM ERROR", "썸네일을 등록해주세요.");
      }

      dispatch({
        type: GALLERY_CREATE_REQUEST,
        data: {
          thumbnail: uploadGalleryPath,
          title: value.title,
          content: value.content,
        },
      });
    },
    [uploadGalleryPath]
  );

  const onSubmitUpdate = useCallback(() => {
    if (!uploadGalleryPath || uploadGalleryPath.trim() === "") {
      return LoadNotification("ADMIN SYSTEM ERROR", "썸네일을 등록해주세요.");
    }

    dispatch({
      type: GALLERY_UPDATE_REQUEST,
      data: {
        id: updateData.id,
        thumbnail: uploadGalleryPath,
        title: value.title,
        content: value.content,
      },
    });
  }, [uploadGalleryPath]);

  const deleteGalleryHandler = useCallback(() => {
    if (!deleteId) {
      return LoadNotification(
        "ADMIN SYSTEM ERROR",
        "일시적인 장애가 발생되었습니다. 잠시 후 다시 시도해주세요."
      );
    }
    dispatch({
      type: GALLERY_DELETE_REQUEST,
      data: { galleryId: deleteId },
    });

    setDeleteId(null);
    setDeletePopVisible((prev) => !prev);
  }, [deleteId]);

  const onFill = useCallback((data) => {
    formRef.current.setFieldsValue({
      title: data.title,
      content: data.content,
    });

    dispatch({
      type: UPDATE_GALLERY_PATH,
      data: data.thumbnail,
    });
  }, []);

  const otherPageCall = useCallback(
    (changePage) => {
      setCurrentPage(changePage);
      const queryString = `?page=${changePage}&search=${searchValue.value}`;

      dispatch({
        type: GALLERY_LIST_REQUEST,
        data: {
          qs: queryString || "",
        },
      });
    },
    [searchValue]
  );

  ////// DATAVIEW //////

  // Table
  const columns = [
    {
      title: "No",
      dataIndex: "id",
    },
    {
      title: "PREVIEW",
      render: (data) => <Image width={100} src={`${data.thumbnail}`} />,
    },
    {
      title: "Title",
      dataIndex: "title",
    },

    {
      title: "Hit",
      dataIndex: "hit",
    },
    {
      title: "CreatedAt",
      render: (data) => <div>{data.createdAt.slice(0, 10)}</div>,
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
        breadcrumbs={["게시판 관리", "갤러리 관리"]}
        title={`갤러리 리스트`}
        subTitle={`사용자에게 제공하는 갤러리를 관리할 수 있습니다.`}
      />
      <AdminTop createButton={true} createButtonAction={createModalOpen} />

      <AdminContent>
        <Row style={{ padding: `0 0 10px 0` }}>
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
                  `/admin/board/gallery/list?page=${currentPage}&search=${inputSearch.value}`
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
          dataSource={gallerys ? gallerys : []}
          size="small"
          pagination={{
            defaultCurrent: 1,
            current: parseInt(currentPage),

            total: maxPage * 10,
            onChange: (page) => otherPageCall(page),
          }}
        />
      </AdminContent>

      <Modal
        visible={createModal}
        width={`1100px`}
        title={`새로운 갤러리 작성`}
        onCancel={createModalClose}
        onOk={createModalOk}
      >
        <Wrapper padding={`10px`}>
          <GalleryWrapper>
            <GuideWrapper>
              <GuideText>
                썸네일 이미지 사이즈는 가로 {GALLERY_WIDTH}px 과 세로
                {GALLERY_HEIGHT}px을 기준으로 합니다.
              </GuideText>
              <GuideText>
                이미지 사이즈가 상이할 경우 화면에 올바르지 않게 보일 수 있으니
                이미지 사이즈를 확인해주세요.
              </GuideText>
              <GuideText>
                GALLEY TITLE과 GALLEY CONTENT는 값을 지정하지 않을 수 있습니다.
              </GuideText>
            </GuideWrapper>

            <GalleryImage
              src={
                uploadGalleryPath
                  ? `${uploadGalleryPath}`
                  : `https://via.placeholder.com/${GALLERY_WIDTH}x${GALLERY_HEIGHT}`
              }
              alt="main_GALLEY_image"
            />
            <PreviewGuide>
              {uploadGalleryPath && `이미지 미리보기 입니다.`}
            </PreviewGuide>

            <UploadWrapper>
              <input
                type="file"
                name="image"
                accept=".png, .jpg"
                // multiple
                hidden
                ref={imageInput}
                onChange={onChangeImages}
              />
              <Button
                type="primary"
                onClick={clickImageUpload}
                loading={st_galleryUploadLoading}
              >
                UPLOAD
              </Button>
            </UploadWrapper>
          </GalleryWrapper>

          <Form
            style={{ width: `100%` }}
            onFinish={updateData ? onSubmitUpdate : onSubmit}
            form={form}
            ref={formRef}
          >
            <Form.Item name={"title"} label="제목" rules={[{ required: true }]}>
              <Input allowClear placeholder="Title..." />
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
        onOk={deleteGalleryHandler}
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

export default withRouter(List);
