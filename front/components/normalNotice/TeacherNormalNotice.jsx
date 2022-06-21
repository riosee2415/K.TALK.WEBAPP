import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Wrapper,
  Image,
  Text,
  SpanText,
  TextInput,
  CommonButton,
  CommonTitle,
} from "../commonComponents";
import axios from "axios";
import { END } from "redux-saga";
import wrapper from "../../store/configureStore";
import {
  NORMAL_FILE_UPLOAD_REQUEST,
  NORMAL_NOTICE_DELETE_REQUEST,
  NORMAL_NOTICE_EDITOR_RENDER,
  NORMAL_NOTICE_LIST_REQUEST,
  NORMAL_NOTICE_MODAL_TOGGLE,
  NORMAL_NOTICE_TEACHER_CREATE_REQUEST,
  NORMAL_NOTICE_UPDATE_REQUEST,
} from "../../reducers/normalNotice";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Pagination,
  Popconfirm,
  Select,
  Spin,
} from "antd";
import styled from "styled-components";
import Theme from "../Theme";
import useWidth from "../../hooks/useWidth";
import { saveAs } from "file-saver";
import moment from "moment";
import ToastEditorComponentMix from "../../components/editor/ToastEditorComponentMix";
import { useRouter } from "next/router";

const CustomPage = styled(Pagination)`
  & .ant-pagination-next > button {
    border: none;
  }

  & .ant-pagination-prev > button {
    border: none;
  }

  & {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  & .ant-pagination-item,
  & .ant-pagination-next,
  & .ant-pagination-prev {
    border: none;
    width: 28px;
    height: 28px !important;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${Theme.white_C} !important;
    margin: 0 5px !important;
  }

  & .ant-pagination-item-active a {
    color: ${Theme.subTheme2_C};
  }

  & .ant-pagination-item:focus-visible a,
  .ant-pagination-item:hover a {
    color: ${Theme.subTheme2_C};
  }

  & .ant-pagination-item-link svg {
    font-weight: bold;
    color: ${Theme.black_2C};
  }

  @media (max-width: 800px) {
    width: 18px;
    height: 18px !important;
  }
`;

const CustomModal = styled(Modal)`
  & .ant-modal-header,
  & .ant-modal-content {
    border-radius: 5px;
  }

  & .ant-modal-title {
    font-size: 20px;
    font-weight: bold;
  }

  @media (max-width: 700px) {
    & .ant-modal-title {
      font-size: 16px;
    }
  }
`;

const FileBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

const TeacherNormalNotice = () => {
  ////// GLOBAL STATE //////

  const { me } = useSelector((state) => state.user);

  const {
    normalNoticeList,
    normalNoticeLastPage,
    normalNoticeFilePath,
    //
    normalNoticeModal,
    //
    normalNoticeListLoading,
    normalNoticeListError,
    //
    normalNoticeTeacherCreateLoading,
    normalNoticeTeacherCreateDone,
    normalNoticeTeacherCreateError,
    //
    normalNoticeUpdateLoading,
    normalNoticeUpdateDone,
    normalNoticeUpdateError,
    //
    normalNoticeDeleteLoading,
    normalNoticeDeleteDone,
    normalNoticeDeleteError,
  } = useSelector((state) => state.normalNotice);

  ////// HOOKS //////

  const width = useWidth();

  const dispatch = useDispatch();

  const router = useRouter();

  const [normalNoticeType, setNormalNoticeType] = useState(null);
  const [updateData, setUpdateData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [contentData, setContentData] = useState("");
  const [filename, setFilename] = useState(null);

  const [normalNoticeForm] = Form.useForm();

  const fileRef = useRef();

  ////// USEEFFECT /////

  useEffect(() => {
    if (normalNoticeListError) {
      return message.error(normalNoticeListError);
    }
  }, [normalNoticeListError]);

  // CREATE EFFECT
  useEffect(() => {
    if (normalNoticeTeacherCreateDone) {
      dispatch({
        type: NORMAL_NOTICE_LIST_REQUEST,
        data: {
          page: currentPage,
        },
      });

      normalNoticeCreateModalToggle();

      return message.success("일반게시판이 작성됬습니다.");
    }
  }, [normalNoticeTeacherCreateDone]);

  useEffect(() => {
    if (normalNoticeTeacherCreateError) {
      return message.error(normalNoticeTeacherCreateError);
    }
  }, [normalNoticeTeacherCreateError]);

  // UPDATE EFFECT
  useEffect(() => {
    if (normalNoticeUpdateDone) {
      dispatch({
        type: NORMAL_NOTICE_LIST_REQUEST,
        data: {
          page: currentPage,
        },
      });

      normalNoticeUpdateModalToggle(null);

      return message.success("일반게시판이 수정됬습니다.");
    }
  }, [normalNoticeUpdateDone]);

  useEffect(() => {
    if (normalNoticeUpdateError) {
      return message.error(normalNoticeUpdateError);
    }
  }, [normalNoticeUpdateError]);

  // DELETE EFFECT
  useEffect(() => {
    if (normalNoticeDeleteDone) {
      dispatch({
        type: NORMAL_NOTICE_LIST_REQUEST,
        data: {
          page: currentPage,
        },
      });

      return message.success("일반게시판이 삭제됬습니다.");
    }
  }, [normalNoticeDeleteDone]);

  useEffect(() => {
    if (normalNoticeDeleteError) {
      return message.error(normalNoticeDeleteError);
    }
  }, [normalNoticeDeleteError]);

  ////// TOGGLE //////

  // CREATE MODAL TOGGLE
  const normalNoticeCreateModalToggle = useCallback(() => {
    dispatch({
      type: NORMAL_NOTICE_EDITOR_RENDER,
      data: "create",
    });
    setUpdateData(null);
    normalNoticeForm.resetFields();
    setNormalNoticeType(null);
    setContentData(null);

    dispatch({
      type: NORMAL_NOTICE_MODAL_TOGGLE,
    });
  }, [normalNoticeModal, normalNoticeType, contentData, updateData]);

  // UPDATE MODAL TOGGLE
  const normalNoticeUpdateModalToggle = useCallback(
    (data) => {
      if (data) {
        setUpdateData(data);
        setContentData(data.noticeContent);

        normalNoticeForm.setFieldsValue({
          title: data.noticeTitle,
          content: data.noticeContent,
        });

        dispatch({
          type: NORMAL_NOTICE_EDITOR_RENDER,
          data: data.noticeContent,
        });
      } else {
        dispatch({
          type: NORMAL_NOTICE_EDITOR_RENDER,
          data: null,
        });
        setUpdateData(null);
        normalNoticeForm.resetFields();
        setNormalNoticeType(null);
        setContentData(null);
      }

      dispatch({
        type: NORMAL_NOTICE_MODAL_TOGGLE,
      });
    },
    [normalNoticeModal, normalNoticeType, contentData, updateData]
  );

  ////// HANDLER //////

  // 일반게시판 페이지 네이션
  const onChangeNormalNoticePage = useCallback(
    (page) => {
      setCurrentPage(page);

      dispatch({
        type: NORMAL_NOTICE_LIST_REQUEST,
        data: {
          page,
        },
      });
    },
    [currentPage]
  );

  // 일반게시판 추가
  const normalNoticeCreate = useCallback(
    (data) => {
      dispatch({
        type: NORMAL_NOTICE_TEACHER_CREATE_REQUEST,
        data: {
          title: data.title,
          content: contentData,
          author: me.username,
          level: me.level,
          file: normalNoticeFilePath,
          createType: normalNoticeType === "강사전체" ? 1 : 2,
        },
      });
    },
    [normalNoticeType, normalNoticeFilePath, me, contentData]
  );

  // 일반게시판 수정
  const normalNoticeUpdate = useCallback(
    (data) => {
      dispatch({
        type: NORMAL_NOTICE_UPDATE_REQUEST,
        data: {
          id: updateData.noticeId,
          title: data.title,
          content: contentData,
          author: me.username,
          level: me.level,
          file: normalNoticeFilePath,
        },
      });
    },
    [normalNoticeFilePath, me, contentData, updateData]
  );

  // 일반게시판 수정
  const normalNoticeDelete = useCallback((data) => {
    dispatch({
      type: NORMAL_NOTICE_DELETE_REQUEST,
      data: {
        id: data.noticeId,
      },
    });
  }, []);

  // 에디터 추가
  const getEditContent = useCallback(
    (contentValue) => {
      if (contentValue) {
        normalNoticeForm.submit();

        setContentData(contentValue);
      }
    },
    [contentData]
  );

  // 유형 선택
  const normalNoticeTypeChangeHandler = useCallback(
    (type) => {
      setNormalNoticeType(type);
    },
    [normalNoticeType]
  );

  const moveLinkHandler = useCallback((link) => {
    router.push(link);
  });

  // 파일 업로드
  const fileChangeHandler = useCallback(
    (e) => {
      const formData = new FormData();
      setFilename(e.target.files[0].name);

      [].forEach.call(e.target.files, (file) => {
        formData.append("file", file);
      });

      dispatch({
        type: NORMAL_FILE_UPLOAD_REQUEST,
        data: formData,
      });
    },
    [filename]
  );

  const fileUploadClick = useCallback(() => {
    fileRef.current.click();
  }, []);

  ////// DATEVIEW //////
  const normalSelectArr = ["강사전체", "관리자"];

  return (
    <>
      <Wrapper al={`flex-start`}>
        <Wrapper dr={`row`} ju={`space-between`}>
          <CommonTitle margin={`0 0 20px`}>일반게시판</CommonTitle>
          <CommonButton
            onClick={normalNoticeCreateModalToggle}
            loading={normalNoticeTeacherCreateLoading}
          >
            작성하기
          </CommonButton>
        </Wrapper>

        <Wrapper borderTop={`2px solid ${Theme.black_C}`}>
          <Wrapper
            dr={`row`}
            textAlign={`center`}
            padding={`20px 0`}
            bgColor={Theme.subTheme9_C}
            borderBottom={`1px solid ${Theme.grey_C}`}
          >
            <Text
              fontSize={width < 700 ? `14px` : `18px`}
              fontWeight={`Bold`}
              width={width < 800 ? `10%` : `10%`}
            >
              번호
            </Text>
            <Text
              fontSize={width < 700 ? `14px` : `18px`}
              fontWeight={`Bold`}
              width={width < 800 ? `25%` : `10%`}
            >
              날짜
            </Text>
            <Text
              fontSize={width < 700 ? `14px` : `18px`}
              fontWeight={`Bold`}
              width={width < 800 ? `40%` : `60%`}
            >
              제목
            </Text>
            <Text
              fontSize={width < 700 ? `14px` : `18px`}
              fontWeight={`Bold`}
              width={width < 800 ? `13%` : `10%`}
            >
              작성자
            </Text>
            <Text
              fontSize={width < 700 ? `14px` : `18px`}
              fontWeight={`Bold`}
              width={width < 800 ? `12%` : `10%`}
            >
              기능
            </Text>
          </Wrapper>
          {normalNoticeListLoading ? (
            <Wrapper>
              <Spin />
              <Text>일반게시판을 불러오고 있습니다.</Text>
            </Wrapper>
          ) : (
            normalNoticeList &&
            (normalNoticeList.length === 0 ? (
              <Wrapper margin={`30px 0`}>
                <Empty description="조회된 일반게시판이 없습니다." />
              </Wrapper>
            ) : (
              normalNoticeList.map((data, idx) => {
                return (
                  <Wrapper
                    key={data.id}
                    dr={`row`}
                    textAlign={`center`}
                    ju={`flex-start`}
                    padding={`25px 0 20px`}
                    cursor={`pointer`}
                    bgColor={idx % 2 === 1 && Theme.subTheme_C}
                    borderBottom={`1px solid ${Theme.grey_C}`}
                  >
                    <Text
                      fontSize={width < 700 ? `14px` : `16px`}
                      width={width < 800 ? `10%` : `10%`}
                      wordBreak={`break-word`}
                      onClick={() =>
                        moveLinkHandler(
                          `/teacher/normalNotice/${data.noticeId}`
                        )
                      }
                    >
                      {data.noticeId}
                    </Text>
                    <Text
                      fontSize={width < 700 ? `14px` : `16px`}
                      width={width < 800 ? `25%` : `10%`}
                      onClick={() =>
                        moveLinkHandler(
                          `/teacher/normalNotice/${data.noticeId}`
                        )
                      }
                    >
                      {moment(data.noticeCreatedAt, "YYYY/MM/DD").format(
                        "YYYY/MM/DD"
                      )}
                    </Text>
                    <Text
                      fontSize={width < 700 ? `14px` : `16px`}
                      width={width < 800 ? `40%` : `60%`}
                      onClick={() =>
                        moveLinkHandler(
                          `/teacher/normalNotice/${data.noticeId}`
                        )
                      }
                      textAlign={`left`}
                      isEllipsis
                    >
                      {data.noticeTitle}
                    </Text>
                    <Text
                      fontSize={width < 700 ? `14px` : `16px`}
                      width={width < 800 ? `13%` : `10%`}
                      onClick={() =>
                        moveLinkHandler(
                          `/teacher/normalNotice/${data.noticeId}`
                        )
                      }
                    >
                      {data.noticeAuthor}
                    </Text>
                    <Wrapper width={width < 800 ? `12%` : `10%`}>
                      {me.id === data.writeUserId && (
                        <>
                          <CommonButton
                            width={`100%`}
                            onClick={() => normalNoticeUpdateModalToggle(data)}
                            loading={normalNoticeUpdateLoading}
                          >
                            수정
                          </CommonButton>
                          <Popconfirm
                            title="삭제하시겠습니까?"
                            okText="삭제"
                            cancelText="취소"
                            placement="topRight"
                            onConfirm={() => normalNoticeDelete(data)}
                            loading={normalNoticeDeleteLoading}
                          >
                            <CommonButton width={`100%`} kindOf={`delete`}>
                              삭제
                            </CommonButton>
                          </Popconfirm>
                        </>
                      )}
                    </Wrapper>
                  </Wrapper>
                );
              })
            ))
          )}
        </Wrapper>

        <Wrapper margin={`65px 0 85px`}>
          <CustomPage
            current={currentPage}
            total={normalNoticeLastPage * 10}
            onChange={(page) => onChangeNormalNoticePage(page)}
          ></CustomPage>
        </Wrapper>
      </Wrapper>

      {/* NORMAL NOTICE MODAL */}
      <CustomModal
        width={`1000px`}
        title={updateData ? "일반게시판 수정하기" : "일반게시판 작성하기"}
        visible={normalNoticeModal}
        onCancel={() => normalNoticeUpdateModalToggle(null)}
        footer={null}
      >
        <Wrapper padding={`10px`}>
          <Form
            form={normalNoticeForm}
            style={{ width: `100%` }}
            onFinish={updateData ? normalNoticeUpdate : normalNoticeCreate}
          >
            {!updateData && (
              <Form.Item
                name="type"
                label="유형"
                rules={[{ required: true, message: "유형을 선택해 주세요." }]}
              >
                <Select
                  showSearch
                  style={{ width: `100%` }}
                  placeholder="유형을 선택해 주세요."
                  onChange={normalNoticeTypeChangeHandler}
                >
                  {normalSelectArr &&
                    normalSelectArr.map((data) => (
                      <Select.Option value={data}>{data}</Select.Option>
                    ))}
                </Select>
              </Form.Item>
            )}

            <Form.Item
              label="제목"
              name="title"
              rules={[{ required: true, message: "제목을 입력해 주세요" }]}
            >
              <Input allowClear placeholder="제목을 입력해주세요." />
            </Form.Item>

            <Form.Item
              label="본문"
              name="content"
              rules={[{ required: true, message: "본문을 입력해 주세요." }]}
            >
              <ToastEditorComponentMix
                action={getEditContent}
                initialValue={contentData ? contentData : ""}
                placeholder="본문을 입력해주세요."
                buttonText={updateData ? "수정" : "작성"}
              />
            </Form.Item>

            <FileBox>
              <input
                type="file"
                name="file"
                hidden
                ref={fileRef}
                onChange={fileChangeHandler}
              />
              <Text margin={`0 10px 0 0`}>
                {updateData
                  ? `첨부파일`
                  : filename
                  ? filename
                  : `파일을 선택해주세요.`}
              </Text>
              <Button size="small" type="primary" onClick={fileUploadClick}>
                FILE UPLOAD
              </Button>
            </FileBox>
          </Form>
        </Wrapper>
      </CustomModal>
      {/* NORMAL NOTICE MODAL END */}
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

    context.store.dispatch({
      type: NORMAL_NOTICE_LIST_REQUEST,
      data: {
        page: 1,
      },
    });

    // 구현부 종료
    context.store.dispatch(END);
    console.log("🍀 SERVER SIDE PROPS END");
    await context.store.sagaTask.toPromise();
  }
);

export default TeacherNormalNotice;
