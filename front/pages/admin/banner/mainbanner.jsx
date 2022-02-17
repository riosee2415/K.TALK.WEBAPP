import React, { useCallback, useEffect, useState, useRef } from "react";
import AdminLayout from "../../../components/AdminLayout";
import PageHeader from "../../../components/admin/PageHeader";
import AdminTop from "../../../components/admin/AdminTop";
import { Table, Button, Modal, Input, notification, Popconfirm } from "antd";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import {
  BANNER_UPLOAD_REQUEST,
  MAIN_BANNER_REQUEST,
  UPLOAD_BANNER_INIT_REQUEST,
  VIEW_MODAL_REQUEST,
  VIEW_CREATE_MODAL_REQUEST,
  BANNER_UPDATE_REQUEST,
  BANNER_CREATE_REQUEST,
  BANNER_DELETE_REQUEST,
} from "../../../reducers/banner";
import useInput from "../../../hooks/useInput";
import wrapper from "../../../store/configureStore";
import { END } from "redux-saga";
import axios from "axios";
import { useRouter } from "next/router";
import { LOAD_MY_INFO_REQUEST } from "../../../reducers/user";
import { Wrapper } from "../../../components/commonComponents";

const BANNER_WIDTH = `1200`;
const BANNER_HEIGHT = `440`;

const AdminContent = styled.div`
  padding: 20px;
`;

const BannerWrapper = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const BannerImage = styled.img`
  width: 1200px;
  height: 440px;
  object-fit: cover;
`;

const BannerInput = styled(Input)`
  width: 1200px;
`;

const GuideWrapper = styled.section`
  width: 1200px;
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

const UploadWrapper = styled.div`
  width: 1200px;
  margin: 5px 0;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

const PreviewGuide = styled.p`
  font-weight: 700;
  color: #b1b1b1;
`;

const bannerUploadNotification = (msg, content) => {
  notification.open({
    message: msg,
    description: content,
    onClick: () => {},
  });
};

const Mainbanner = () => {
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
  const [currentViewImagePath, setCurrentViewImagePath] = useState(``);
  const [deletePopVisible, setDeletePopVisible] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const title = useInput(``);
  const content = useInput(``);

  const imageInput = useRef();

  const dispatch = useDispatch();

  ////// REDUX //////
  const {
    banners,
    viewModal,
    createModal,
    uploadBannerPath,
    st_bannerUploadLoading,
    st_bannerUpdateDone,
    st_bannerUpdateError,
    st_bannerCreateDone,
    st_bannerCreateError,
    st_bannerDeleteLoading,
    st_bannerDeleteDone,
    st_bannerDeleteError,
  } = useSelector((state) => state.banner);

  ////// USEEFFECT //////
  useEffect(() => {
    dispatch({
      type: MAIN_BANNER_REQUEST,
    });
  }, []);

  useEffect(() => {
    return () => {
      if (viewModal) {
        dispatch({
          type: UPLOAD_BANNER_INIT_REQUEST,
        });

        dispatch({
          type: MAIN_BANNER_REQUEST,
        });
      }
    };
  }, [viewModal]);

  useEffect(() => {
    if (st_bannerUpdateDone) {
      dispatch({
        type: VIEW_MODAL_REQUEST,
      });

      return bannerUploadNotification(
        "ADMIN SYSTEM",
        "입력하신 정보로 해당 데이터가 수정되었습니다."
      );
    }
  }, [st_bannerUpdateDone]);

  useEffect(() => {
    if (st_bannerDeleteDone) {
      bannerUploadNotification(
        "ADMIN SYSTEM",
        "선택한 메인베너 데이터가 삭제되었습니다."
      );

      dispatch({
        type: MAIN_BANNER_REQUEST,
      });

      return;
    }
  }, [st_bannerDeleteDone]);

  useEffect(() => {
    if (st_bannerCreateDone) {
      dispatch({
        type: VIEW_CREATE_MODAL_REQUEST,
      });

      dispatch({
        type: MAIN_BANNER_REQUEST,
      });

      return bannerUploadNotification(
        "ADMIN SYSTEM",
        "입력하신 정보로 메인베너가 생성되었습니다."
      );
    }
  }, [st_bannerCreateDone]);

  useEffect(() => {
    if (st_bannerUpdateError) {
      bannerUploadNotification("ADMIN SYSTEM ERROR", st_bannerUpdateError);
    }
  }, [st_bannerUpdateError]);

  useEffect(() => {
    if (st_bannerDeleteError) {
      bannerUploadNotification("ADMIN SYSTEM ERROR", st_bannerDeleteError);
    }
  }, [st_bannerDeleteError]);

  useEffect(() => {
    if (st_bannerCreateError) {
      bannerUploadNotification("ADMIN SYSTEM ERROR", st_bannerCreateError);
    }
  }, [st_bannerCreateError]);

  ////// TOGGLE //////
  const deletePopToggle = useCallback(
    (id) => () => {
      setDeleteId(id);
      setDeletePopVisible((prev) => !prev);
    },
    [deletePopVisible, deleteId]
  );

  const viewClick = useCallback(
    (data = {}) =>
      () => {
        dispatch({
          type: VIEW_MODAL_REQUEST,
        });

        if (!viewModal) {
          setCurrentId(data.id);
          setCurrentViewImagePath(data.imagePath);
          title.setValue(data.title);
          content.setValue(data.content);
        }
      },

    [viewModal]
  );

  ////// HANDLER //////
  const deleteHandler = useCallback(() => {
    if (!deleteId) {
      return bannerUploadNotification(
        "ADMIN SYSTEM ERRLR",
        "일시적인 장애가 발생되었습니다. 잠시 후 다시 시도해주세요."
      );
    }

    dispatch({
      type: BANNER_DELETE_REQUEST,
      data: { id: deleteId },
    });

    setDeleteId(null);
    setDeletePopVisible((prev) => !prev);
  }, [deleteId]);

  const createClick = useCallback(() => {
    title.setValue(``);
    content.setValue(``);

    dispatch({
      type: VIEW_CREATE_MODAL_REQUEST,
    });
  }, [createModal]);

  const updateClick = useCallback(() => {
    if (!currentId) {
      return bannerUploadNotification(
        "ADMIN SYSTEM ERROR",
        "데이터가 소실되었습니다. 재접속 후 사용해주세요."
      );
    }

    dispatch({
      type: BANNER_UPDATE_REQUEST,
      data: {
        id: currentId,
        title: title.value,
        imagePath: uploadBannerPath ? uploadBannerPath : currentViewImagePath,
        content: content.value,
      },
    });
  }, [currentId, title, content, uploadBannerPath]);

  const clickImageUpload = useCallback(() => {
    imageInput.current.click();
  }, [imageInput.current]);

  const bannerCreate = useCallback(() => {
    if (!uploadBannerPath) {
      return bannerUploadNotification(
        "ADMIN SYSTEM ERROR",
        "이미지는 필수등록 사항 입니다."
      );
    }

    dispatch({
      type: BANNER_CREATE_REQUEST,
      data: {
        title: title.value,
        content: content.value,
        imagePath: uploadBannerPath,
      },
    });
  }, [title, uploadBannerPath, content]);

  const onChangeImages = useCallback((e) => {
    const formData = new FormData();

    [].forEach.call(e.target.files, (file) => {
      formData.append("image", file);
    });

    dispatch({
      type: BANNER_UPLOAD_REQUEST,
      data: formData,
    });
  });

  ////// DATAVIEW //////
  const columns = [
    {
      title: "No",
      dataIndex: "id",
    },
    {
      title: "TITLE",
      dataIndex: "title",
    },
    {
      title: "CONTENT",
      dataIndex: "content",
    },
    {
      title: "VIEW",
      render: (data) => (
        <Button onClick={viewClick(data)} type="primary">
          VIEW
        </Button>
      ),
    },
    {
      title: "DELETE",
      render: (data) => (
        <Button
          onClick={deletePopToggle(data.id)}
          type="danger"
          loading={st_bannerDeleteLoading}
        >
          DEL
        </Button>
      ),
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        breadcrumbs={["베너 관리", "메인베너 관리"]}
        title={`메인베너 관리`}
        subTitle={`메인화면에 보여지는 이미지를 제어할 수 있습니다.`}
      />
      {/* createButton<Boolean>,  createButtonAction*/}
      <AdminTop createButton={true} createButtonAction={createClick} />

      <AdminContent>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={banners ? banners : []}
          size="small"
        />
      </AdminContent>

      {/* UPDATE MODAL */}
      <Modal
        visible={viewModal}
        width={`1300px`}
        title={`메인베너 상세보기`}
        onCancel={viewClick()}
        onOk={updateClick}
      >
        <BannerWrapper>
          <GuideWrapper>
            <GuideText>
              메인베너 이미지 사이즈는 가로 {BANNER_WIDTH}px 과 세로{" "}
              {BANNER_HEIGHT}px을 기준으로 합니다.
            </GuideText>
            <GuideText>
              이미지 사이즈가 상이할 경우 화면에 올바르지 않게 보일 수 있으니
              이미지 사이즈를 확인해주세요.
            </GuideText>
            <GuideText>
              BANNER TITLE과 BANNER CONTENT는 값을 지정하지 않을 수 있습니다.
            </GuideText>
          </GuideWrapper>

          <BannerImage
            src={
              uploadBannerPath
                ? `${uploadBannerPath}`
                : `${currentViewImagePath}`
            }
            alt="main_banner_image"
          />
          <PreviewGuide>
            {uploadBannerPath && `이미지 미리보기 입니다.`}
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
              loading={st_bannerUploadLoading}
            >
              UPLOAD
            </Button>
          </UploadWrapper>

          <br />
          <br />
          <BannerInput allowClear placeholder="Banner Title" {...title} />
          <br />
          <BannerInput allowClear placeholder="Banner Content" {...content} />
        </BannerWrapper>
      </Modal>

      {/* CREATE MODAL */}
      <Modal
        visible={createModal}
        width={`1300px`}
        title={`메인베너 생성하기`}
        onCancel={createClick}
        onOk={bannerCreate}
      >
        <BannerWrapper>
          <GuideWrapper>
            <GuideText>
              메인베너 이미지 사이즈는 가로 {BANNER_WIDTH}px 과 세로
              {BANNER_HEIGHT}px을 기준으로 합니다.
            </GuideText>
            <GuideText>
              이미지 사이즈가 상이할 경우 화면에 올바르지 않게 보일 수 있으니
              이미지 사이즈를 확인해주세요.
            </GuideText>
            <GuideText>
              BANNER TITLE과 BANNER CONTENT는 값을 지정하지 않을 수 있습니다.
            </GuideText>
          </GuideWrapper>

          <BannerImage
            src={
              uploadBannerPath
                ? `${uploadBannerPath}`
                : `https://via.placeholder.com/${BANNER_WIDTH}x${BANNER_HEIGHT}`
            }
            alt="main_banner_image"
          />
          <PreviewGuide>
            {uploadBannerPath && `이미지 미리보기 입니다.`}
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
              loading={st_bannerUploadLoading}
            >
              UPLOAD
            </Button>
          </UploadWrapper>

          <br />
          <br />
          <BannerInput allowClear placeholder="Banner Title" {...title} />
          <br />
          <BannerInput allowClear placeholder="Banner Content" {...content} />
        </BannerWrapper>
      </Modal>

      <Modal
        visible={deletePopVisible}
        onOk={deleteHandler}
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

export default Mainbanner;
