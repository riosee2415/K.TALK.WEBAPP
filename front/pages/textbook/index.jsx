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
import { CloseOutlined, SearchOutlined } from "@ant-design/icons";
import {
  BOOK_CREATE_REQUEST,
  BOOK_FOLDER_LIST_REQUEST,
  BOOK_LIST_REQUEST,
  BOOK_UPLOAD_REQUEST,
  BOOK_UPLOAD_TH_REQUEST,
} from "../../reducers/book";
import { Button, Empty, Form, message, Modal, Select } from "antd";
import { useRouter } from "next/router";
import useInput from "../../hooks/useInput";

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
    bottom: 0;
    width: 100%;
    height: 100%;
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
  const [currentTab, setCurrentTab] = useState(0);
  const [currentMenu, setCurrentMenu] = useState(null);
  const [createModal, setCreateModal] = useState(false);
  ////// REDUX //////
  const dispatch = useDispatch();
  const {
    bookFolderList,
    bookList,
    uploadPath,
    uploadPathTh,
    st_bookCreateDone,
    st_bookCreateError,
  } = useSelector((state) => state.book);
  ////// USEEFFECT //////

  useEffect(() => {
    dispatch({
      type: BOOK_FOLDER_LIST_REQUEST,
    });
    dispatch({
      type: BOOK_LIST_REQUEST,
      data: {
        LectureId: router.query.lectureId,
        BookFolderId: 1,
      },
    });
  }, [router.query, currentMenu]);
  useEffect(() => {
    if ("교재가 생성되었습니다.") {
      message.error(st_bookCreateDone);
      dispatch({
        type: BOOK_LIST_REQUEST,
        data: {
          BookFolderId: 1,
          LectureId: router.query.lectureId,
        },
      });
    }
  }, [st_bookCreateDone, router.query, currentMenu]);
  useEffect(() => {
    if (st_bookCreateError) {
      message.error(st_bookCreateError);
      dispatch({
        type: BOOK_LIST_REQUEST,
        data: {
          LectureId: router.query.lectureId,
          BookFolderId: 1,
        },
      });
    }
  }, [st_bookCreateError, router.query, currentMenu]);
  ////// TOGGLE //////
  ////// HANDLER //////
  const modalOk = useCallback(() => {
    form.submit();
  }, [form]);

  const onSubmit = useCallback(
    (data) => {
      dispatch({
        type: BOOK_CREATE_REQUEST,
        data: {
          thumbnail: uploadPath,
          title: data.title,
          file: uploadPath,
          LectureId: router.query.lectureId,
          BookFolderId: data.folder,
        },
      });
    },
    [uploadPath, router.query]
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
                <CusotmInput placeholder="학생명으로 검색" />
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
                        >
                          <Wrapper width={`22px`} margin={`0 20px 0 0`}>
                            <Image
                              src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_change.png`}
                              alt={`menu_icon`}
                            />
                          </Wrapper>
                          <Text>이름 바꾸기</Text>
                        </Wrapper>
                        <Wrapper
                          className={`menu`}
                          color={Theme.grey2_C}
                          fontSize={`16px`}
                          dr={`row`}
                          ju={`flex-start`}
                          height={`40px`}
                          padding={width < 1100 ? `0 0 0 10px` : `0 0 0 30px`}
                        >
                          <Wrapper width={`22px`} margin={`0 20px 0 0`}>
                            <Image
                              src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_move.png`}
                              alt={`menu_icon`}
                            />
                          </Wrapper>
                          <Text>이동</Text>
                        </Wrapper>
                        <Wrapper
                          className={`menu`}
                          color={Theme.grey2_C}
                          fontSize={`16px`}
                          dr={`row`}
                          ju={`flex-start`}
                          height={`40px`}
                          padding={width < 1100 ? `0 0 0 10px` : `0 0 0 30px`}
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

                      <Wrapper onClick={() => setCurrentMenu(data.id)}>
                        <Image src={data.imagePath} />
                      </Wrapper>
                    </ProductWrapper>
                  );
                })
              )}
            </Wrapper>
          </RsWrapper>
          <Modal
            visible={createModal}
            onCancel={() => setCreateModal(false)}
            onOk={modalOk}
          >
            <Wrapper>
              <Form form={form} onFinish={onSubmit}>
                <Form.Item
                  rules={[
                    { required: true, message: "교재 제목을 입력해주세요." },
                  ]}
                  label={`교재 제목`}
                  name={`title`}
                >
                  <TextInput />
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
            <Wrapper ju={`flex-end`}>
              <input
                type="file"
                name="file"
                hidden
                ref={fileRef}
                onChange={fileChangeHandler}
              />
              <Text>
                {filename.value ? filename.value : `파일을 선택해주세요.`}
              </Text>
              <Button type="primary" onClick={fileUploadClick}>
                FILE UPLOAD
              </Button>
            </Wrapper>

            <Wrapper ju={`flex-end`}>
              <input
                type="file"
                name="file"
                hidden
                ref={fileRef2}
                onChange={fileChangeHandler2}
              />
              <Wrapper>
                <Image src={uploadPathTh} alt={`thumbnail`} />
              </Wrapper>
              <Button type="primary" onClick={fileUploadClick2}>
                FILE UPLOAD
              </Button>
            </Wrapper>
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
