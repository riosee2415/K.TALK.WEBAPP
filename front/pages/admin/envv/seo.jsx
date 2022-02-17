import React, { useCallback, useEffect, useRef, useState } from "react";
import AdminLayout from "../../../components/AdminLayout";
import PageHeader from "../../../components/admin/PageHeader";
import AdminTop from "../../../components/admin/AdminTop";
import styled from "styled-components";
import { Table, message, Modal, Button, Form, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";

import axios from "axios";
import wrapper from "../../../store/configureStore";
import { END } from "redux-saga";
import { useRouter } from "next/router";
import { LOAD_MY_INFO_REQUEST } from "../../../reducers/user";
import {
  SEO_LIST_REQUEST,
  SEO_TITLE_UPDATE_TOGGLE,
  SEO_KEYWORD_UPDATE_TOGGLE,
  SEO_KEYWORD_CREATE_TOGGLE,
  SEO_TITLE_UPDATE_REQUEST,
  SEO_THUMBNAIL_UPDATE_REQUEST,
  SEO_THUMBNAIL_UPDATE2_REQUEST,
  SEO_KEYWORD_UPDATE_REQUEST,
  SEO_KEYWORD_DELETE_REQUEST,
  SEO_KEYWORD_CREATE_REQUEST,
  SEO_DESC_UPDATE_REQUEST,
} from "../../../reducers/seo";
import { Wrapper, Image } from "../../../components/commonComponents";

const AdminContent = styled.div`
  padding: 20px;
`;

const SubTitle = styled.p`
  font-size: 16px;
  color: ${(props) => props.theme.subTheme3_C};

  &:after {
    content: "";
    display: block;
    width: 80px;
    border-bottom: 7.5px solid ${(props) => props.theme.subTheme4_C};
    border-radius: 15px;
    opacity: 0.4;
  }
`;

const KeyWordToggleBtn = styled(Button)`
  margin-left: 10px;
`;

const EnvSection = styled.section`
  margin-bottom: 60px;
`;

const FileSelectBtn = styled(Button)`
  width: 560px;
  margin-bottom: 5px;
`;

const DescInput = styled(Input)`
  height: 60px;
`;

const ThumbnailGuideTxt = styled.article`
  width: 100%;
  color: ${(props) => props.theme.darkGrey_C};
  border-bottom: 0.5px solid ${(props) => props.theme.lightGrey_C};
  margin-bottom: 5px;
  background-color: rgba(230, 230, 230, 0.3);
  font-size: 13px;
`;

const Seo = () => {
  const {
    seo_title,
    seo_desc,
    seo_keyword,
    titleUpdateModal,
    keywordUpdateModal,
    st_seoTitleUpdateDone,
    st_seoTitleUpdateError,
    previewThumbnail,
    st_seoThumbnailUpdateLoading,
    st_seoThumbnailUpdateDone,
    st_seoThumbnailUpdate2Done,
    st_seoKeywordUpdateDone,
    st_seoKeywordDeleteDone,
    keywordCreateModal,
    st_seoKeywordCreateDone,
    st_seoDescUpdateDone,
  } = useSelector((state) => state.seo);
  const { me, st_loadMyInfoDone } = useSelector((state) => state.user);

  const imageInput = useRef();

  const [currentTitleId, setCurrentTitleId] = useState(null);
  const [currentKeywordId, setCurrentKeywordId] = useState(null);
  const [titleUpdateForm] = Form.useForm();
  const [keywordUpdateForm] = Form.useForm();
  const [keywordCreateForm] = Form.useForm();
  const [descUpdateForm] = Form.useForm();

  const router = useRouter();
  const dispatch = useDispatch();

  const moveLinkHandler = useCallback((link) => {
    router.push(link);
  }, []);

  useEffect(() => {
    if (st_seoThumbnailUpdateDone) {
      message.success(
        "이미지 미리보기가 활성화 되었습니다. 적용을 원하면 저장을 해주세요."
      );
    }
  }, [st_seoThumbnailUpdateDone]);

  useEffect(() => {
    if (st_seoKeywordDeleteDone) {
      dispatch({
        type: SEO_LIST_REQUEST,
      });

      message.success("키워드가 삭제되었습니다.");
    }
  }, [st_seoKeywordDeleteDone]);

  useEffect(() => {
    if (st_seoDescUpdateDone) {
      dispatch({
        type: SEO_LIST_REQUEST,
      });

      message.success("홈페이지 설명이 수정되었습니다.");
    }
  }, [st_seoDescUpdateDone]);

  useEffect(() => {
    if (st_seoKeywordCreateDone) {
      dispatch({
        type: SEO_LIST_REQUEST,
      });

      dispatch({
        type: SEO_KEYWORD_CREATE_TOGGLE,
      });

      message.success("새로운 키워드가 등록되었습니다.");
    }
  }, [st_seoKeywordCreateDone]);

  useEffect(() => {
    if (st_seoTitleUpdateDone) {
      dispatch({
        type: SEO_LIST_REQUEST,
      });

      dispatch({
        type: SEO_TITLE_UPDATE_TOGGLE,
      });

      message.success("타이틀 변경이 성공적으로 완료되었습니다.");
    }
  }, [st_seoTitleUpdateDone]);

  useEffect(() => {
    if (st_seoKeywordUpdateDone) {
      dispatch({
        type: SEO_LIST_REQUEST,
      });

      dispatch({
        type: SEO_KEYWORD_UPDATE_TOGGLE,
      });

      message.success("키워드 변경이 성공적으로 완료되었습니다.");
    }
  }, [st_seoKeywordUpdateDone]);

  useEffect(() => {
    if (st_seoThumbnailUpdate2Done) {
      dispatch({
        type: SEO_LIST_REQUEST,
      });

      message.success("홈페이지 썸네일 변경이 성공적으로 완료되었습니다.");
    }
  }, [st_seoThumbnailUpdate2Done]);

  useEffect(() => {
    if (st_seoTitleUpdateError) {
      message.error("잘못 된 요청입니다. 개발사에 문의해주세요.");
    }
  }, [st_seoTitleUpdateError]);

  useEffect(() => {
    if (st_loadMyInfoDone) {
      if (!me || parseInt(me.level) < 3) {
        moveLinkHandler(`/admin`);
      }
    }
  }, [st_loadMyInfoDone]);

  useEffect(() => {
    setTimeout(() => {
      if (seo_desc.length > 0) {
        descOnFill(seo_desc[0].content || "");
      }
    }, 1000);
  }, [seo_desc]);

  //MODAL TOGGLE HANDLER
  const updateToggleHandler = useCallback(
    (data) => {
      setCurrentTitleId(data.id);

      dispatch({
        type: SEO_TITLE_UPDATE_TOGGLE,
      });

      if (data) {
        titleOnFill(data);
      }
    },
    [titleUpdateModal, currentTitleId]
  );

  //MODAL TOGGLE HANDLER
  const keywordCreateToggleHandler = useCallback(
    (data) => {
      dispatch({
        type: SEO_KEYWORD_CREATE_TOGGLE,
      });
      keywordCreateForm.resetFields();
    },
    [keywordCreateModal]
  );

  const keywordUpdateToggleHandler = useCallback(
    (data) => {
      setCurrentKeywordId(data.id);

      dispatch({
        type: SEO_KEYWORD_UPDATE_TOGGLE,
      });

      if (data) {
        keywordOnFill(data);
      }
    },

    [keywordUpdateModal, currentKeywordId]
  );

  const columns = [
    {
      title: "유형",
      dataIndex: "type",
    },
    {
      title: "내용",
      dataIndex: "content",
    },
    {
      title: "생성일",
      dataIndex: "createdAt",
    },
    {
      title: "수정",
      render: (data) => (
        <Button
          size="small"
          type="primary"
          onClick={() => keywordUpdateToggleHandler(data)}
        >
          수정
        </Button>
      ),
    },
    {
      title: "삭제",
      render: (data) => (
        <Button
          type="danger"
          size="small"
          onClick={() => keywordDeleteHandler(data)}
        >
          삭제
        </Button>
      ),
    },
  ];

  const columns_t = [
    {
      title: "유형",
      dataIndex: "type",
    },
    {
      title: "타이틀",
      dataIndex: "content",
    },
    {
      title: "마지막 수정일",
      dataIndex: "updatedAt",
    },
    {
      title: "수정",
      render: (data) => (
        <Button
          type="primary"
          size="small"
          onClick={() => updateToggleHandler(data)}
        >
          수정
        </Button>
      ),
    },
  ];

  const titleUpdateSubmit = useCallback(
    (data) => {
      dispatch({
        type: SEO_TITLE_UPDATE_REQUEST,
        data: {
          id: currentTitleId,
          title: data.seoTitle,
        },
      });
    },
    [currentTitleId]
  );

  const keywordUpdateSubmit = useCallback(
    (data) => {
      dispatch({
        type: SEO_KEYWORD_UPDATE_REQUEST,
        data: {
          id: currentKeywordId,
          value: data.keywordValue,
        },
      });
    },
    [currentKeywordId]
  );

  const keywordDeleteHandler = useCallback((data) => {
    dispatch({
      type: SEO_KEYWORD_DELETE_REQUEST,
      data: {
        id: data.id,
      },
    });
  }, []);

  const keywordCreateHandler = useCallback((data) => {
    dispatch({
      type: SEO_KEYWORD_CREATE_REQUEST,
      data: {
        value: data.value,
      },
    });
  }, []);

  // FORM SET VALUES
  const titleOnFill = useCallback(
    (data) => {
      titleUpdateForm.setFieldsValue({
        seoTitle: data.content,
      });
    },
    [titleUpdateForm]
  );

  const keywordOnFill = useCallback(
    (data) => {
      keywordUpdateForm.setFieldsValue({
        keywordValue: data.content,
      });
    },
    [keywordUpdateForm]
  );

  const descOnFill = useCallback(
    (data) => {
      descUpdateForm.setFieldsValue({
        value: data,
      });
    },
    [descUpdateForm]
  );

  const onChangeImages = useCallback((e) => {
    const formData = new FormData();

    [].forEach.call(e.target.files, (file) => {
      formData.append("image", file);
    });

    dispatch({
      type: SEO_THUMBNAIL_UPDATE_REQUEST,
      data: formData,
    });
  });

  const clickImageUpload = useCallback(() => {
    imageInput.current.click();
  }, [imageInput.current]);

  const saveThumbnailHandler = useCallback(() => {
    dispatch({
      type: SEO_THUMBNAIL_UPDATE2_REQUEST,
      data: {
        url: previewThumbnail,
      },
    });
  }, [previewThumbnail]);

  const descUpdateHandler = useCallback((data) => {
    dispatch({
      type: SEO_DESC_UPDATE_REQUEST,
      data: {
        value: data.value,
      },
    });
  }, []);

  return (
    <AdminLayout>
      <PageHeader
        breadcrumbs={["환경 설정", "SEO 설정"]}
        title={`SEO 설정`}
        subTitle={`홈페이지의 설명 및 검색엔진에 대한 설정을 할 수 있습니다.`}
      />

      <AdminContent>
        <EnvSection>
          <SubTitle>타이틀 설정</SubTitle>
          <ThumbnailGuideTxt>
            홈페이지 제목에 해당하는 글 입니다. 변경 후 1 ~ 5 영업일 사이에
            검색엔진이 정보를 수집합니다.
          </ThumbnailGuideTxt>

          <Table
            rowKey="id"
            columns={columns_t}
            dataSource={seo_title}
            size="small"
          />
        </EnvSection>

        <EnvSection>
          <SubTitle>홈페이지 썸네일 설정</SubTitle>
          <Wrapper dr="row" ju="flex-start" wrap="no-wrap">
            <Wrapper al="flex-start" width="590px" margin="0px 20px 0px 0px">
              <Image
                width={"560px"}
                height={"280px"}
                src={previewThumbnail}
                margin="0px 0px 10px 0px"
              />

              <input
                type="file"
                name="image"
                accept=".png, .jpg"
                // multiple
                hidden
                ref={imageInput}
                onChange={onChangeImages}
              />

              <FileSelectBtn
                size="small"
                type={st_seoThumbnailUpdateDone ? "default" : "primary"}
                onClick={clickImageUpload}
                loading={st_seoThumbnailUpdateLoading}
              >
                IMAGE SELECT
              </FileSelectBtn>

              {st_seoThumbnailUpdateDone && (
                <FileSelectBtn
                  size="small"
                  type="primary"
                  onClick={saveThumbnailHandler}
                >
                  홈페이지 적용
                </FileSelectBtn>
              )}
            </Wrapper>

            <Wrapper al="flex-start" ju="flex-start" width="100%">
              <ThumbnailGuideTxt>
                홈페이지 썸네일은 타 사용자에게 홈페이지 URL을 전송할 경우
                보여지는 이미지 입니다.
              </ThumbnailGuideTxt>
              <ThumbnailGuideTxt>
                이미지 사이즈는 px기준 가로 800px, 세로 400px을 기준으로 합니다.
                비율이 상이할 경우 이미지가 상이하게 보일 수 있습니다.
              </ThumbnailGuideTxt>
              <ThumbnailGuideTxt>
                이미지 선택하여 미리보기를 활성화 한 후, 저장버튼을 눌러서
                홈페이지에 적용해야 합니다.
              </ThumbnailGuideTxt>
            </Wrapper>
          </Wrapper>
        </EnvSection>

        <EnvSection>
          <SubTitle>
            키워드 설정 [등록된 키워드 {seo_keyword.length}개]
            <KeyWordToggleBtn
              size="small"
              type="primary"
              onClick={keywordCreateToggleHandler}
            >
              + 키워드 등록
            </KeyWordToggleBtn>
          </SubTitle>
          <ThumbnailGuideTxt>
            키워드는 10개가 가장 적당합니다. 개수가 크게 다를 경우 검색엔진에서
            검색될 때 불리하게 작용할 수 있습니다.
          </ThumbnailGuideTxt>

          <Table
            rowKey="id"
            columns={columns}
            dataSource={seo_keyword}
            size="small"
          />
        </EnvSection>
        <EnvSection>
          <SubTitle>홈페이지 설명</SubTitle>

          <ThumbnailGuideTxt>
            홈페이지 제목에 해당하는 글 입니다. 변경 후 1 ~ 5 영업일 사이에
            검색엔진이 정보를 수집합니다.
          </ThumbnailGuideTxt>

          <Form
            name="descUpdateForm"
            labelCol={{ span: 0 }}
            wrapperCol={{ span: 24 }}
            form={descUpdateForm}
            onFinish={descUpdateHandler}
          >
            <Form.Item
              name="value"
              rules={[
                {
                  required: true,
                  message: "Please input your description content!",
                },
              ]}
            >
              <DescInput />
            </Form.Item>

            <Wrapper dr="row" ju="flex-end">
              <Button type="primary" htmlType="submit" size="small">
                홈페이지 적용
              </Button>
            </Wrapper>
          </Form>
        </EnvSection>
      </AdminContent>

      {/* TITLE UPDATE MODAL */}
      <Modal
        width="600px"
        footer={null}
        title="SEO 홈페이지 타이틀 수정"
        visible={titleUpdateModal}
        onOk={() => {}}
        onCancel={updateToggleHandler}
      >
        <Form
          name="titleUpdateForm"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          form={titleUpdateForm}
          onFinish={titleUpdateSubmit}
        >
          <Form.Item
            label="TITLE"
            name="seoTitle"
            rules={[
              { required: true, message: "Please input your title content!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Wrapper dr={`row`} ju={`flex-end`}>
            <Button type="primary" htmlType="submit" size="small">
              UPDATE
            </Button>
          </Wrapper>
        </Form>
      </Modal>

      {/* KEYWORD UPDATE MODAL */}
      <Modal
        width="600px"
        footer={null}
        title="SEO 홈페이지 키워드 수정"
        visible={keywordUpdateModal}
        onOk={() => {}}
        onCancel={keywordUpdateToggleHandler}
      >
        <Form
          name="keywordUpdateForm"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          form={keywordUpdateForm}
          onFinish={keywordUpdateSubmit}
        >
          <Form.Item
            label="KEYWORD"
            name="keywordValue"
            rules={[
              { required: true, message: "Please input your keyword content!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Wrapper dr={`row`} ju={`flex-end`}>
            <Button type="primary" htmlType="submit" size="small">
              UPDATE
            </Button>
          </Wrapper>
        </Form>
      </Modal>

      {/* KEYWORD CREATE MODAL */}
      <Modal
        width="600px"
        footer={null}
        title="SEO 홈페이지 키워드 추가"
        visible={keywordCreateModal}
        onOk={() => {}}
        onCancel={keywordCreateToggleHandler}
      >
        <Form
          name="keywordCreateForm"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          onFinish={keywordCreateHandler}
          form={keywordCreateForm}
        >
          <Form.Item
            label="KEYWORD"
            name="value"
            rules={[
              { required: true, message: "Please input your keyword content!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Wrapper dr={`row`} ju={`flex-end`}>
            <Button type="primary" htmlType="submit" size="small">
              CREATE
            </Button>
          </Wrapper>
        </Form>
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
      type: SEO_LIST_REQUEST,
    });

    // 구현부 종료
    context.store.dispatch(END);
    console.log("🍀 SERVER SIDE PROPS END");
    await context.store.sagaTask.toPromise();
  }
);

export default Seo;
