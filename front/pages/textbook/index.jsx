import React, { useCallback, useEffect, useRef, useState } from "react";
import ClientLayout from "../../components/ClientLayout";
import { useDispatch, useSelector } from "react-redux";

import wrapper from "../../store/configureStore";
import { END } from "redux-saga";
import useWidth from "../../hooks/useWidth";
import Theme from "../../components/Theme";
import styled from "styled-components";
import axios from "axios";

import { LOAD_MY_INFO_REQUEST } from "../../reducers/user";
import { SEO_LIST_REQUEST } from "../../reducers/seo";

import Head from "next/head";
import {
  RsWrapper,
  WholeWrapper,
  Wrapper,
  Text,
  CommonButton,
  TextInput,
  Image,
  ProductWrapper,
} from "../../components/commonComponents";
import {
  CloseOutlined,
  FolderOpenFilled,
  SearchOutlined,
} from "@ant-design/icons";
import {
  BOOK_CREATE_REQUEST,
  BOOK_DELETE_REQUEST,
  BOOK_FILE_INIT,
  BOOK_FOLDER_LIST_REQUEST,
  BOOK_LIST_REQUEST,
  BOOK_UPDATE_REQUEST,
  BOOK_UPLOAD_REQUEST,
  BOOK_UPLOAD_TH_REQUEST,
} from "../../reducers/book";
import { Button, Empty, Form, Input, message, Modal, Select } from "antd";
import { useRouter } from "next/router";
import useInput from "../../hooks/useInput";
import { saveAs } from "file-saver";

const LoadNotification = (msg, content) => {
  notification.open({
    message: msg,
    description: content,
    onClick: () => {},
  });
};

const TabWrapper = styled(Wrapper)`
  width: calc(100% / 5 - 13px);
  margin: 0 13px 10px 0;
  height: 50px;
  border: 1px solid ${Theme.grey_C};
  border-radius: 10px;
  flex-direction: row;
  justify-content: flex-start;
  padding: 0 5px;
  &:hover {
    border: 1px solid ${Theme.basicTheme_C};
  }
  &.current {
    border: 1px solid ${Theme.basicTheme_C};
  }
  @media (max-width: 700px) {
    width: 110px;
  }
`;
const CusotmInput = styled(TextInput)`
  border: none;
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.16);

  padding: 0 0 0 55px;
  border-radius: 25px;
  width: 100%;
  height: 50px;
  background-color: ${Theme.lightGrey_C};

  &::placeholder {
    color: ${Theme.grey2_C};
  }

  &:focus {
    border: 1px solid ${Theme.basicTheme_C};
  }
`;

const ProductMenu = styled(Wrapper)`
  bottom: -80px;
  transition: 0.5s;

  @media (max-width: 1100px) {
    top: 0;
    width: 100%;
    height: calc(100% - 35px);
    border-radius: 0;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  }

  & .menu {
    transition: 0.5s;
    &:hover {
      background-color: ${Theme.lightGrey_C};
    }
  }
`;

const Index = () => {
  ////// GLOBAL STATE //////
  const { seo_keywords, seo_desc, seo_ogImage, seo_title } = useSelector(
    (state) => state.seo
  );

  ////// HOOKS //////
  const router = useRouter();
  const width = useWidth();
  const [form] = Form.useForm();
  const fileRef = useRef();
  const fileRef2 = useRef();
  const filename = useInput();
  const searchInput = useInput(``);
  const [currentTab, setCurrentTab] = useState(null);
  const [currentMenu, setCurrentMenu] = useState(null);
  const [createModal, setCreateModal] = useState(false);
  const [updateData, setUpdateData] = useState(null);

  const [deletePopVisible, setDeletePopVisible] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  ////// REDUX //////
  const dispatch = useDispatch();
  const {
    bookFolderList,
    bookList,
    uploadPath,
    uploadPathTh,
    st_bookCreateDone,
    st_bookCreateError,
    st_bookUpdateDone,
    st_bookUpdateError,
    st_bookDeleteDone,
    st_bookDeleteError,
  } = useSelector((state) => state.book);
  ////// USEEFFECT //////
  useEffect(() => {
    if (updateData) {
      setTimeout(() => {
        form.setFieldsValue({
          thumbnail: updateData.thumbnail,
          file: updateData.file,
          title: updateData.title,
          folder: updateData.BookFolderId,
        });
      }, 500);
    }
  }, [updateData]);

  useEffect(() => {
    dispatch({
      type: BOOK_FOLDER_LIST_REQUEST,
    });
    dispatch({
      type: BOOK_LIST_REQUEST,
      data: {
        BookFolderId: currentTab,
      },
    });
    searchInput.setValue(``);
  }, [router.query, currentTab]);

  useEffect(() => {
    if (st_bookCreateDone) {
      message.success("교재가 생성되었습니다.");
      dispatch({
        type: BOOK_LIST_REQUEST,
        data: {
          BookFolderId: currentTab,
        },
      });
      updateModalClose();
    }
  }, [st_bookCreateDone]);

  useEffect(() => {
    if (st_bookCreateError) {
      message.error(st_bookCreateError);
      dispatch({
        type: BOOK_LIST_REQUEST,
        data: {
          BookFolderId: currentTab,
        },
      });
    }
  }, [st_bookCreateError]);

  useEffect(() => {
    if (st_bookUpdateDone) {
      dispatch({
        type: BOOK_LIST_REQUEST,
        data: {
          BookFolderId: currentTab,
        },
      });
      message.success("교재가 생성되었습니다.");
      updateModalClose();
    }
  }, [st_bookUpdateDone]);

  useEffect(() => {
    if (st_bookUpdateError) {
      message.error(st_bookUpdateError);
    }
  }, [st_bookUpdateError]);

  useEffect(() => {
    if (st_bookDeleteDone) {
      dispatch({
        type: BOOK_LIST_REQUEST,
        data: {
          BookFolderId: currentTab,
        },
      });
      message.success("교재가 삭제되었습니다.");
      updateModalClose();
    }
  }, [st_bookDeleteDone]);

  useEffect(() => {
    if (st_bookDeleteError) {
      message.error(st_bookDeleteError);
    }
  }, [st_bookDeleteError]);
  ////// TOGGLE //////
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

  const deletePopToggle = useCallback(
    (id) => () => {
      setDeleteId(id);
      setDeletePopVisible((prev) => !prev);
      setCurrentMenu(null);
    },
    [deletePopVisible, deleteId]
  );

  const deleteNoticeHandler = useCallback(() => {
    if (!deleteId) {
      return LoadNotification(
        "ADMIN SYSTEM ERROR",
        "일시적인 장애가 발생되었습니다. 잠시 후 다시 시도해주세요."
      );
    }
    dispatch({
      type: BOOK_DELETE_REQUEST,
      data: { bookId: deleteId },
    });

    setDeleteId(null);
    setDeletePopVisible((prev) => !prev);
  }, [deleteId]);

  const modalOk = useCallback(() => {
    form.submit();
  }, [form]);

  const onSubmit = useCallback(
    (data) => {
      dispatch({
        type: BOOK_CREATE_REQUEST,
        data: {
          thumbnail: uploadPathTh,
          title: data.title,
          file: uploadPath,
          BookFolderId: data.folder,
        },
      });
    },
    [uploadPathTh, uploadPath, router.query]
  );

  const updateSubmit = useCallback(
    (data) => {
      dispatch({
        type: BOOK_UPDATE_REQUEST,
        data: {
          id: updateData.id,
          thumbnail: uploadPathTh ? uploadPathTh : updateData.thumbnail,
          title: data.title,
          file: uploadPath ? uploadPath : updateData.file,

          BookFolderId: data.folder,
        },
      });
    },
    [uploadPath, uploadPathTh, router.query, updateData]
  );

  const fileChangeHandler = useCallback((e) => {
    const formData = new FormData();
    filename.setValue(e.target.files[0].name);

    [].forEach.call(e.target.files, (file) => {
      formData.append("image", file);
    });

    dispatch({
      type: BOOK_UPLOAD_REQUEST,
      data: formData,
    });
  }, []);

  const fileUploadClick = useCallback(() => {
    fileRef.current.click();
  }, [fileRef.current]);

  const fileChangeHandler2 = useCallback((e) => {
    const formData = new FormData();

    [].forEach.call(e.target.files, (file) => {
      formData.append("image", file);
    });

    dispatch({
      type: BOOK_UPLOAD_TH_REQUEST,
      data: formData,
    });
  }, []);

  const fileUploadClick2 = useCallback(() => {
    fileRef2.current.click();
  }, [fileRef2.current]);

  const updateModalOpen = useCallback((data) => {
    setCreateModal(true);
    setUpdateData(data);
  }, []);
  const updateModalClose = useCallback(
    (data) => {
      dispatch({
        type: BOOK_FILE_INIT,
      });

      setCreateModal(false);
      setUpdateData(null);
      form.resetFields();
    },
    [form]
  );

  const searchHandler = useCallback(
    (link) => {
      dispatch({
        type: BOOK_LIST_REQUEST,
        data: {
          BookFolderId: currentTab,
          search: searchInput.value,
        },
      });
    },
    [router.query, currentTab, searchInput]
  );
  ////// DATAVIEW //////

  return (
    <>
      <Head>
        <title>
          {seo_title.length < 1 ? "K-Talk Live" : seo_title[0].content}
        </title>

        <meta
          name="subject"
          content={seo_title.length < 1 ? "K-Talk Live" : seo_title[0].content}
        />
        <meta
          name="title"
          content={seo_title.length < 1 ? "K-Talk Live" : seo_title[0].content}
        />
        <meta name="keywords" content={seo_keywords} />
        <meta
          name="description"
          content={
            seo_desc.length < 1
              ? "REAL-TIME ONLINE KOREAN LESSONS"
              : seo_desc[0].content
          }
        />
        {/* <!-- OG tag  --> */}
        <meta
          property="og:title"
          content={seo_title.length < 1 ? "K-Talk Live" : seo_title[0].content}
        />
        <meta
          property="og:site_name"
          content={seo_title.length < 1 ? "K-Talk Live" : seo_title[0].content}
        />
        <meta
          property="og:description"
          content={
            seo_desc.length < 1
              ? "REAL-TIME ONLINE KOREAN LESSONS"
              : seo_desc[0].content
          }
        />
        <meta property="og:keywords" content={seo_keywords} />
        <meta
          property="og:image"
          content={seo_ogImage.length < 1 ? "" : seo_ogImage[0].content}
        />
      </Head>

      <ClientLayout>
        <WholeWrapper margin={`100px 0 0`}>
          <RsWrapper>
            <Wrapper al={`flex-start`} margin={`70px 0 30px`}>
              <Text
                color={Theme.black_2C}
                fontSize={width < 800 ? `18px` : `22px`}
                fontWeight={`Bold`}
              >
                교재 목록
              </Text>
            </Wrapper>

            <Wrapper dr={`row`} ju={`space-between`} margin={`0 0 40px`}>
              <Wrapper
                position={`relative`}
                width={width < 800 ? `calc(100% - 100px - 20px)` : `500px`}
              >
                <SearchOutlined
                  style={{
                    color: Theme.grey2_C,
                    fontSize: `20px`,
                    position: "absolute",
                    left: `15px`,
                  }}
                />
                <CusotmInput
                  placeholder="교재 검색"
                  {...searchInput}
                  onKeyDown={(e) => e.keyCode === 13 && searchHandler()}
                />
              </Wrapper>

              <CommonButton
                kindOf={`white2`}
                width={width < 800 ? `100px` : `160px`}
                height={`50px`}
                shadow={`0 2px 10px rgba(0,0,0,0.16)`}
                onClick={() => setCreateModal(true)}
              >
                자료 올리기
              </CommonButton>
            </Wrapper>
            <Wrapper dr={`row`} ju={`flex-start`} margin={`0 0 20px 0`}>
              <TabWrapper
                onClick={() => setCurrentTab(null)}
                className={currentTab === null && `current`}
              >
                <Wrapper
                  width={`17px`}
                  margin={width < 800 ? `0 5px 0 0` : `0 20px 0 0`}
                >
                  <FolderOpenFilled
                    style={{ color: Theme.grey2_C, fontSize: `17px` }}
                  />
                </Wrapper>
                <Text
                  maxWidth={
                    width < 800
                      ? `calc(100% - 17px - 5px)`
                      : `calc(100% - 17px - 20px)`
                  }
                  fontSize={width < 800 ? `10px` : `16px`}
                >
                  전체
                </Text>
              </TabWrapper>
              {bookFolderList &&
                bookFolderList.map((data) => {
                  return (
                    <TabWrapper
                      onClick={() => setCurrentTab(data.id)}
                      className={currentTab === data.id && `current`}
                    >
                      <Wrapper
                        width={`17px`}
                        margin={width < 800 ? `0 5px 0 0` : `0 20px 0 0`}
                      >
                        <Image
                          src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_folder.png`}
                          alt={`file_icon`}
                        />
                      </Wrapper>
                      <Text
                        maxWidth={
                          width < 800
                            ? `calc(100% - 17px - 5px)`
                            : `calc(100% - 17px - 20px)`
                        }
                        fontSize={width < 800 ? `10px` : `16px`}
                      >
                        {data.value}
                      </Text>
                    </TabWrapper>
                  );
                })}
            </Wrapper>

            <Wrapper
              dr={`row`}
              al={`flex-start`}
              ju={`flex-start`}
              minHeight={`680px`}
            >
              {bookList && bookList.length === 0 ? (
                <Wrapper>
                  <Empty description={`조회된 데이터가 없습니다.`} />
                </Wrapper>
              ) : (
                bookList &&
                bookList.map((data, idx) => {
                  return (
                    <ProductWrapper>
                      <ProductMenu
                        display={currentMenu === data.id ? `flex` : `none`}
                        width={`280px`}
                        bgColor={Theme.white_C}
                        position={`absolute`}
                        zIndex={`999`}
                        ju={`flex-start`}
                        radius={`10px`}
                        shadow={`0 5px 15px rgba(0,0,0,0.16)`}
                        right={
                          width < 1280
                            ? width < 1100
                              ? `0`
                              : (idx + 1) % 4 === 0
                              ? ``
                              : `-100px`
                            : (idx + 1) % 6 === 0
                            ? ``
                            : `-100px`
                        }
                        left={
                          width < 1280
                            ? width < 1100
                              ? `0`
                              : (idx + 1) % 4 === 0
                              ? `-100px`
                              : ``
                            : (idx + 1) % 6 === 0
                            ? `-100px`
                            : ``
                        }
                      >
                        <Wrapper
                          height={`20px`}
                          al={`flex-end`}
                          padding={`20px 20px 0 0`}
                          margin={`0 0 10px`}
                        >
                          <CloseOutlined
                            onClick={() => {
                              setCurrentMenu(null);
                            }}
                          />
                        </Wrapper>

                        <Wrapper
                          className={`menu`}
                          color={Theme.grey2_C}
                          fontSize={`16px`}
                          dr={`row`}
                          ju={`flex-start`}
                          height={`40px`}
                          padding={width < 1100 ? `0 0 0 10px` : `0 0 0 30px`}
                          onClick={() => {
                            updateModalOpen(data);
                            setCurrentMenu(null);
                          }}
                        >
                          <Wrapper width={`22px`} margin={`0 20px 0 0`}>
                            <Image
                              src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_change.png`}
                              alt={`menu_icon`}
                            />
                          </Wrapper>
                          <Text>수정</Text>
                        </Wrapper>

                        <Wrapper
                          className={`menu`}
                          color={Theme.grey2_C}
                          fontSize={`16px`}
                          dr={`row`}
                          ju={`flex-start`}
                          height={`40px`}
                          padding={width < 1100 ? `0 0 0 10px` : `0 0 0 30px`}
                          onClick={() => {
                            fileDownloadHandler(data.file);
                            setCurrentMenu(null);
                          }}
                        >
                          <Wrapper width={`22px`} margin={`0 20px 0 0`}>
                            <Image
                              src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_download_gray.png`}
                              alt={`menu_icon`}
                            />
                          </Wrapper>
                          <Text>다운로드</Text>
                        </Wrapper>
                        <Wrapper
                          className={`menu`}
                          color={Theme.grey2_C}
                          fontSize={`16px`}
                          dr={`row`}
                          ju={`flex-start`}
                          height={`40px`}
                          padding={width < 1100 ? `0 0 0 10px` : `0 0 0 30px`}
                          margin={`0 0 20px 0`}
                          onClick={deletePopToggle(data.id)}
                        >
                          <Wrapper width={`22px`} margin={`0 20px 0 0`}>
                            <Image
                              src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_delet.png`}
                              alt={`menu_icon`}
                            />
                          </Wrapper>
                          <Text>삭제</Text>
                        </Wrapper>
                      </ProductMenu>

                      <Wrapper
                        position={`relative`}
                        height={`0`}
                        padding={`0 0 125%`}
                        onClick={() => setCurrentMenu(data.id)}
                      >
                        <Image
                          position={`absolute`}
                          top={`0`}
                          left={`0`}
                          height={`100%`}
                          src={data.thumbnail}
                        />
                      </Wrapper>
                      <Text margin={`5px 0 0 `} height={`30px`}>
                        {data.title}
                      </Text>
                    </ProductWrapper>
                  );
                })
              )}
            </Wrapper>
          </RsWrapper>

          <Modal
            visible={createModal}
            onCancel={
              updateData ? updateModalClose : () => setCreateModal(false)
            }
            onOk={modalOk}
          >
            <Wrapper al={`flex-start`}>
              <Form form={form} onFinish={updateData ? updateSubmit : onSubmit}>
                <Form.Item
                  rules={[
                    { required: true, message: "교재 제목을 입력해주세요." },
                  ]}
                  label={`교재 제목`}
                  name={`title`}
                >
                  <TextInput height={`30px`} />
                </Form.Item>
                <Form.Item
                  rules={[{ required: true, message: "폴더를 선택해주세요." }]}
                  label={`폴더 선택`}
                  name={`folder`}
                >
                  <Select
                    placeholder="Select a Folder"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {bookFolderList &&
                      bookFolderList.map((data) => {
                        return (
                          <Select.Option value={data.id}>
                            {data.value}
                          </Select.Option>
                        );
                      })}
                  </Select>
                </Form.Item>
              </Form>
            </Wrapper>
            <Wrapper dr={`row`} ju={`space-between`} al={`flex-end`}>
              <Wrapper width={`auto`} margin={`20px 0 0`}>
                <input
                  type="file"
                  name="file"
                  accept=".png, .jpg"
                  hidden
                  ref={fileRef2}
                  onChange={fileChangeHandler2}
                />
                <Wrapper width={`150px`} margin={`0 0 10px`}>
                  <Image
                    src={
                      uploadPathTh
                        ? `${uploadPathTh}`
                        : updateData
                        ? updateData.thumbnail
                        : `https://via.placeholder.com/${`80`}x${`100`}`
                    }
                    alt={`thumbnail`}
                  />
                </Wrapper>
                <Button type="primary" onClick={fileUploadClick2}>
                  썸네일 이미지 업로드
                </Button>
              </Wrapper>

              <Wrapper
                width={`auto`}
                margin={`20px 0 0`}
                dr={`row`}
                ju={`flex-end`}
              >
                <input
                  type="file"
                  name="file"
                  hidden
                  ref={fileRef}
                  onChange={fileChangeHandler}
                />
                <Text margin={`0 5px 0 0`}>
                  {filename.value ? filename.value : `파일을 선택해주세요.`}
                </Text>
                <Button type="primary" onClick={fileUploadClick}>
                  교재 파일 업로드
                </Button>
              </Wrapper>
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
        </WholeWrapper>
      </ClientLayout>
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
      type: SEO_LIST_REQUEST,
    });

    // 구현부 종료
    context.store.dispatch(END);
    console.log("🍀 SERVER SIDE PROPS END");
    await context.store.sagaTask.toPromise();
  }
);

export default Index;
