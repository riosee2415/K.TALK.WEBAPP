import React, { useCallback, useEffect, useRef, useState } from "react";

import axios from "axios";
import wrapper from "../store/configureStore";
import { END } from "redux-saga";
import Head from "next/head";

import ClientLayout from "../components/ClientLayout";
import { useDispatch, useSelector } from "react-redux";
import Popup from "../components/popup/popup";
import {
  Text,
  Image,
  WholeWrapper,
  Wrapper,
  RsWrapper,
  CommonButton,
  SpanText,
  ATag,
} from "../components/commonComponents";

import useWidth from "../hooks/useWidth";
import Theme from "../components/Theme";
import { useRouter } from "next/router";

import { LOAD_MY_INFO_REQUEST } from "../reducers/user";
import { SEO_LIST_REQUEST } from "../reducers/seo";

import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import styled from "styled-components";
import {
  COMMUNITY_CREATE_REQUEST,
  COMMUNITY_LIST_REQUEST,
  COMMUNITY_TYPE_LIST_REQUEST,
  COMMUNITY_UPLOAD_REQUEST,
  FILE_INIT,
  CREATE_MODAL_CLOSE_REQUEST,
  CREATE_MODAL_OPEN_REQUEST,
} from "../reducers/community";
import {
  Button,
  Empty,
  Form,
  Input,
  message,
  Modal,
  notification,
  Pagination,
  Select,
} from "antd";
import ToastEditorComponent6 from "../components/editor/ToastEditorComponent6";
import { FileTextOutlined } from "@ant-design/icons";

const Box = styled(Wrapper)`
  align-items: flex-start;
  justify-content: flex-start;
  transition: 0.5s;
  width: calc(50% - 10px);
  padding: 20px 25px;
  background-color: ${(props) => props.theme.lightGrey_C};
  border-radius: 10px;
  cursor: pointer;
  &:hover {
    background-color: ${(props) => props.theme.subTheme6_C};
    & ${Text} {
      color: ${(props) => props.theme.white_C};
    }
  }
  & ${Text} {
    color: ${(props) => props.theme.subTheme11_C};
  }
  &:nth-child(2n) {
    margin: 0 0 20px 20px;
  }
  margin: 0 0 20px;
  @media (max-width: 800px) {
    width: 100%;
    margin: 0 0 20px !important;
  }
`;

const LoadNotification = (msg, content) => {
  notification.open({
    message: msg,
    description: content,
    onClick: () => {},
  });
};

const Home = ({}) => {
  const width = useWidth();
  ////// GLOBAL STATE //////
  const { seo_keywords, seo_desc, seo_ogImage, seo_title } = useSelector(
    (state) => state.seo
  );

  ////// HOOKS //////
  const router = useRouter();
  const fileRef = useRef();
  ////// REDUX //////
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { communityList, communityMaxLength, createModal } = useSelector(
    (state) => state.community
  );
  const { me } = useSelector((state) => state.user);
  const [modalView, setModalView] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [contentData, setContentData] = useState("");
  const {
    communityTypes,
    st_communityCreateDone,
    st_communityCreateError,
    filePath,
  } = useSelector((state) => state.community);
  ////// USEEFFECT //////
  useEffect(() => {
    if (st_communityCreateDone) {
      message.success(`게시판이 작성되었습니다.`);
      dispatch({
        type: COMMUNITY_LIST_REQUEST,
        data: {
          typeId: 2,
        },
      });
      dispatch({
        type: FILE_INIT,
      });
      modalClose();
    }
  }, [st_communityCreateDone]);

  useEffect(() => {
    dispatch({
      type: COMMUNITY_LIST_REQUEST,
      data: {
        typeId: 2,
      },
    });
  }, [router.query]);

  useEffect(() => {
    if (st_communityCreateError) {
      message.error(st_communityCreateError);
    }
  }, [st_communityCreateError]);
  ////// TOGGLE //////

  const modalOpen = useCallback(() => {
    dispatch({
      type: CREATE_MODAL_OPEN_REQUEST,
    });
  }, []);
  const modalClose = useCallback(() => {
    dispatch({
      type: CREATE_MODAL_CLOSE_REQUEST,
    });
    form.resetFields();
  }, []);
  ////// HANDLER //////
  const moveLinkHandler = useCallback((link) => {
    router.push(link);
  }, []);

  const formFinishBoard = useCallback(() => {
    form.submit();
  }, [form]);

  const onSubmitBoard = useCallback(
    (data) => {
      if (!contentData || contentData.trim() === "") {
        return message.error("Please click the Save button");
      }
      dispatch({
        type: COMMUNITY_CREATE_REQUEST,
        data: {
          title: data.title,
          content: contentData,
          type: 2,
          file: filePath,
        },
      });
    },
    [filePath, contentData]
  );

  const fileUploadClick = useCallback(() => {
    fileRef.current.click();
  }, [fileRef.current]);

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

      fileRef.current.value = "";
    },
    [fileRef]
  );

  const otherPageCall = useCallback((changePage) => {
    setCurrentPage(changePage);

    dispatch({
      type: COMMUNITY_LIST_REQUEST,
      data: {
        page: changePage,
        typeId: 2,
      },
    });
  }, []);

  const getEditContent = (contentValue) => {
    setContentData(contentValue);
  };
  ////// DATAVIEW //////

  return (
    <>
      <Head>
        <title>
          {seo_title.length < 1 ? "K-talk Live" : seo_title[0].content}
        </title>

        <meta
          name="subject"
          content={seo_title.length < 1 ? "K-talk Live" : seo_title[0].content}
        />
        <meta
          name="title"
          content={seo_title.length < 1 ? "K-talk Live" : seo_title[0].content}
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
          content={seo_title.length < 1 ? "K-talk Live" : seo_title[0].content}
        />
        <meta
          property="og:site_name"
          content={seo_title.length < 1 ? "K-talk Live" : seo_title[0].content}
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

        {/* <script
          dangerouslySetInnerHTML={{
            __html: `!function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '483937212685511');
          fbq('track', 'PageView');`,
          }}
        ></script>

        <noscript>
          <img
            height="1"
            width="1"
            style="display:none"
            src="https://www.facebook.com/tr?id=483937212685511&ev=PageView&noscript=1"
          />
        </noscript> */}
      </Head>

      <ClientLayout>
        <WholeWrapper padding={width < 800 ? `82px 0` : `100px 0`}>
          <Image
            alt="main"
            src={
              width < 900
                ? `https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/main-banner/banner1-mobile.png`
                : `https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/main-banner/banner1.png`
            }
          />
          <Wrapper margin={`80px 0 0`}>
            <RsWrapper>
              <Wrapper
                fontSize={
                  width < 900 ? (width < 700 ? `14px` : `16px`) : `24px`
                }
                color={Theme.basicTheme_C}
                fontWeight={`bold`}
                margin={`0 0 20px`}
              >
                <Text>
                  <SpanText color={Theme.subTheme6_C}>K-talk Live</SpanText>
                  &nbsp;RUNS&nbsp;
                  <SpanText color={Theme.subTheme6_C}>
                    FREE ONLINE LESSONS
                  </SpanText>
                </Text>
                <Text>EVERY WEEK ALL YEAR ROUND</Text>
              </Wrapper>
              <Image
                alt="icon"
                margin={`10px 0 5px 15px`}
                width={width < 800 ? `220px` : `280px`}
                src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/main/img_free-message.png`}
              />
              <Wrapper dr={`row`} ju={`space-between`} margin={`0 0 100px`}>
                <Wrapper
                  shadow={`0 5px 15px rgba(0, 0, 0, 0.05)`}
                  width={width < 1000 ? `100%` : `49%`}
                  padding={width < 900 ? `20px 10px` : `35px 30px`}
                  dr={`row`}
                  ju={`space-around`}
                >
                  <Wrapper
                    width={`auto`}
                    fontSize={
                      width < 900 ? (width < 700 ? `13px` : `15px`) : `20px`
                    }
                    al={`flex-start`}
                  >
                    <Text fontWeight={`bold`}>For absolute beginners</Text>
                    <Text fontWeight={`300`}>
                      three 50-minute sessions a week
                    </Text>
                  </Wrapper>
                  <Wrapper width={`auto`}>
                    <ATag
                      href={`https://forms.gle/M4hQxCN8itnWkM3x7`}
                      target={`_blank`}
                    >
                      <CommonButton
                        height={`40px`}
                        radius={`25px`}
                        kindOf={`white`}
                        padding={`5px 5px 5px 8px`}
                      >
                        apply here
                        <Image
                          alt="icon"
                          margin={`0 0 0 15px`}
                          width={width < 900 ? `25px` : `30px`}
                          src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/main/blue-btn.png`}
                        />
                      </CommonButton>
                    </ATag>
                  </Wrapper>
                </Wrapper>
                <Wrapper
                  shadow={`0 5px 15px rgba(0, 0, 0, 0.05)`}
                  width={width < 1000 ? `100%` : `49%`}
                  padding={width < 900 ? `20px 10px` : `35px 30px`}
                  dr={`row`}
                  ju={`space-around`}
                >
                  <Wrapper
                    width={`auto`}
                    fontSize={
                      width < 900 ? (width < 700 ? `13px` : `15px`) : `20px`
                    }
                    al={`flex-start`}
                  >
                    <Text fontWeight={`bold`}>
                      For pre-intermediate learners
                    </Text>
                    <Text fontWeight={`300`}>2 sessions a week</Text>
                  </Wrapper>
                  <Wrapper width={`auto`}>
                    <ATag
                      href={`https://forms.gle/nsqiuEsEQqMj9qUj7 `}
                      target={`_blank`}
                    >
                      <CommonButton
                        height={`40px`}
                        radius={`25px`}
                        kindOf={`white`}
                        padding={`5px 5px 5px 8px`}
                        onClick={() => moveLinkHandler(`/application`)}
                      >
                        apply here
                        <Image
                          alt="icon"
                          margin={`0 0 0 15px`}
                          width={width < 900 ? `25px` : `30px`}
                          src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/main/blue-btn.png`}
                        />
                      </CommonButton>
                    </ATag>
                  </Wrapper>
                </Wrapper>
              </Wrapper>

              <Wrapper
                fontSize={
                  width < 900 ? (width < 700 ? `14px` : `16px`) : `24px`
                }
                color={Theme.subTheme2_C}
                fontWeight={`bold`}
                margin={`0 0 20px`}
              >
                K-talk Live regular paid lessons
              </Wrapper>

              <Wrapper
                shadow={`0 5px 15px rgba(0, 0, 0, 0.05)`}
                padding={width < 900 ? `20px 10px` : `35px 30px`}
                dr={`row`}
                ju={width < 900 ? `center` : `space-around`}
              >
                <Wrapper
                  width={`auto`}
                  al={`flex-start`}
                  color={Theme.darkGrey_C}
                  fontSize={
                    width < 900 ? (width < 700 ? `12px` : `14px`) : `18px`
                  }
                  fontWeight={`300`}
                >
                  <Text>
                    Starts every Monday
                    <SpanText
                      fontSize={width < 800 ? `12px` : `15px`}
                      margin={`0 10px`}
                    >
                      |
                    </SpanText>
                    Suitable for beginner to advanced
                    <SpanText
                      fontSize={width < 800 ? `12px` : `15px`}
                      margin={`0 10px`}
                    >
                      |
                    </SpanText>
                    Live online group class taught by native Korean teachers
                  </Text>
                  <Text margin={width < 700 ? `10px 0` : `20px 0`}>
                    3 sessions a week (1 session = 50 minutes)
                    <SpanText
                      fontSize={width < 800 ? `12px` : `15px`}
                      margin={`0 10px`}
                    >
                      |
                    </SpanText>
                    US $144 for 4 weeks (12 sessions over 4 weeks)
                    <SpanText
                      fontSize={width < 800 ? `12px` : `15px`}
                      margin={`0 10px`}
                    >
                      |
                    </SpanText>
                    Lessons through Zoom
                  </Text>
                  <Text>
                    Payment through Paypal
                    <SpanText
                      fontSize={width < 800 ? `12px` : `15px`}
                      margin={`0 10px`}
                    >
                      |
                    </SpanText>
                    Money-back guarantee for all lesson
                    <SpanText
                      fontSize={width < 800 ? `12px` : `15px`}
                      margin={`0 10px`}
                    >
                      |
                    </SpanText>
                    Not more than 7 learners in a class
                  </Text>
                </Wrapper>
                <Wrapper width={`auto`} margin={width < 900 && `15px 0 0`}>
                  <CommonButton
                    height={`40px`}
                    radius={`25px`}
                    kindOf={`subTheme`}
                    padding={`5px 5px 5px 8px`}
                    onClick={() => moveLinkHandler("/application")}
                  >
                    apply here
                    <Image
                      alt="icon"
                      margin={`0 0 0 15px`}
                      width={width < 900 ? `25px` : `30px`}
                      src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/main/red-btn.png`}
                    />
                  </CommonButton>
                </Wrapper>
              </Wrapper>
              <Wrapper dr={`row`} margin={`60px 0 0`} ju={`space-between`}>
                <Wrapper
                  shadow={`0 5px 15px rgba(0, 0, 0, 0.05)`}
                  padding={`20px 30px`}
                  dr={`row`}
                  width={width < 1000 ? `100%` : `63%`}
                >
                  <ATag
                    width={`auto`}
                    dr={`row`}
                    href={`https://www.instagram.com/ktalk_live/`}
                    target={`_blank`}
                    margin={width < 900 && `0 0 15px`}
                  >
                    <Image
                      alt="icon"
                      margin={`0 5px 0 0px`}
                      width={`24px`}
                      src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/main/icon_instagram.png`}
                    />
                    <Text fontSize={width < 900 ? `14px` : `18px`}>
                      https://www.instagram.com/ktalk_live/
                    </Text>
                  </ATag>
                  <Image
                    alt="icon"
                    margin={`0 15px`}
                    width={`1px`}
                    display={width < 900 ? `none` : `block`}
                    src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/main/dot-line.png`}
                  />
                  <ATag
                    width={`auto`}
                    dr={`row`}
                    href={`https://www.facebook.com/KtalkLive`}
                    target={`_blank`}
                  >
                    <Image
                      alt="icon"
                      margin={`0 5px 0 0px`}
                      width={`24px`}
                      src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/main/icon_facebook.png`}
                    />
                    <Text fontSize={width < 900 ? `14px` : `18px`}>
                      https://www.facebook.com/KtalkLive
                    </Text>
                  </ATag>
                </Wrapper>
                <Wrapper
                  shadow={`0 5px 15px rgba(0, 0, 0, 0.05)`}
                  padding={`20px 30px`}
                  dr={`row`}
                  width={width < 1000 ? `100%` : `35%`}
                >
                  <ATag
                    width={`auto`}
                    dr={`row`}
                    href={`mailto:jklc.ktalk@gmail.com`}
                  >
                    <Text
                      fontSize={
                        width < 900 ? (width < 700 ? `13px` : `14px`) : `18px`
                      }
                      fontWeight={`bold`}
                    >
                      More infomation
                    </Text>
                    <Image
                      alt="icon"
                      margin={`0 5px 0 15px`}
                      width={`24px`}
                      src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/main/icon_mail.png`}
                    />
                    <Text fontSize={width < 900 ? `14px` : `18px`}>
                      jklc.ktalk@gmail.com
                    </Text>
                  </ATag>
                </Wrapper>
              </Wrapper>

              <Wrapper al={`flex-start`} ju={`flex-start`} margin={`110px 0 0`}>
                <Wrapper dr={`row`} ju={`space-between`} margin={`0 0 20px`}>
                  <Text fontSize={`24px`} fontWeight={`700`}>
                    Student's Review
                  </Text>
                  {me && <CommonButton onClick={modalOpen}>Write</CommonButton>}
                </Wrapper>
                <Wrapper dr={`row`} ju={`flex-start`}>
                  {communityList && communityList.length === 0 ? (
                    <Wrapper>
                      <Empty description={`게시물이 없습니다.`} />
                    </Wrapper>
                  ) : (
                    communityList &&
                    communityList.map((data) => {
                      return (
                        <Box
                          onClick={() => moveLinkHandler(`/board/${data.id}`)}
                        >
                          <Text>No.{data.id}</Text>
                          <Text margin={`0 0 40px`} width={`100%`} isEllipsis>
                            {data.file && (
                              <>
                                <FileTextOutlined
                                  style={{ color: Theme.basicTheme_C }}
                                />
                                &nbsp;
                              </>
                            )}
                            {data.title}
                          </Text>
                          <Wrapper dr={`row`} ju={`space-between`}>
                            <Text>
                              {data.createdAt} | {data.username}(
                              {data.level === 1
                                ? `Student`
                                : data.level === 2
                                ? `Teacher`
                                : `admin`}
                              )
                            </Text>
                            <Text>
                              View&nbsp;{data.hit}&nbsp;| Comments&nbsp;
                              {data.commentCnt}
                            </Text>
                          </Wrapper>
                        </Box>
                      );
                    })
                  )}
                </Wrapper>
                <Wrapper margin={`20px 0 0`}>
                  <Pagination
                    defaultCurrent={1}
                    current={parseInt(currentPage)}
                    onChange={(page) => otherPageCall(page)}
                    total={communityMaxLength * 10}
                  />
                </Wrapper>
              </Wrapper>
              <Modal
                title={`Write`}
                visible={createModal}
                onOk={formFinishBoard}
                onCancel={modalClose}
                width={`900px`}
              >
                <Form
                  form={form}
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 20 }}
                  onFinish={onSubmitBoard}
                >
                  <Form.Item label={`Title`} name={`title`}>
                    <Input />
                  </Form.Item>
                  <Form.Item label={`Content`} name={`content`}>
                    <ToastEditorComponent6
                      action={getEditContent}
                      placeholder="Please write a comment."
                    />
                  </Form.Item>
                  {/* <Form.Item label={`Type`} name={`type`}>
                    <Select>
                      {communityTypes &&
                        communityTypes.map((data) => {
                          return (
                            <Select.Option value={data.id}>
                              {data.value}
                            </Select.Option>
                          );
                        })}
                    </Select>
                  </Form.Item> */}
                  {/* review 고정 */}
                  <Form.Item label={`File`}>
                    <input
                      type="file"
                      name="file"
                      hidden
                      ref={fileRef}
                      onChange={fileChangeHandler}
                    />

                    <Button
                      type={`primary`}
                      size={`small`}
                      onClick={fileUploadClick}
                    >
                      FILE UPLOAD
                    </Button>
                  </Form.Item>
                  {filePath && (
                    <Form.Item label={`이미지`}>
                      <Image width={`100px`} src={filePath} />
                    </Form.Item>
                  )}
                </Form>
              </Modal>
            </RsWrapper>
          </Wrapper>
          <Popup />
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

    context.store.dispatch({
      type: COMMUNITY_TYPE_LIST_REQUEST,
    });

    // 구현부 종료
    context.store.dispatch(END);
    console.log("🍀 SERVER SIDE PROPS END");
    await context.store.sagaTask.toPromise();
  }
);
export default Home;
