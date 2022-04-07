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
  Image,
  Text,
} from "../../components/commonComponents";
import { Button, message, Select } from "antd";
import PaypalExpressBtn from "react-paypal-express-checkout";
import {
  PAYMENT_CREATE_REQUEST,
  PAYMENT_LIST_REQUEST,
} from "../../reducers/payment";

const PaypalBtn = styled(PaypalExpressBtn)``;

const Index = () => {
  ////// GLOBAL STATE //////
  const { seo_keywords, seo_desc, seo_ogImage, seo_title } = useSelector(
    (state) => state.seo
  );

  const {
    paymentList,
    st_paymentListDone,
    st_paymentListError,
    st_paymentCreateDone,
    st_paymentCreateError,
  } = useSelector((state) => state.payment);

  const width = useWidth();

  const [toggle, setToggle] = useState(false);
  const [successData, setSuccessData] = useState("");

  useEffect(() => {
    if (st_paymentCreateDone) {
      return message.error(st_paymentCreateDone);
    }
  }, [st_paymentCreateDone]);

  useEffect(() => {
    if (st_paymentCreateError) {
      return message.error(st_paymentCreateError);
    }
  }, [st_paymentCreateError]);

  // useEffect(() => {
  //   if (st_paymentListError) {
  //     return message.error(st_paymentListError);
  //   }
  // }, [st_paymentListError]);

  ////// HOOKS //////
  ////// REDUX //////
  ////// USEEFFECT //////

  useEffect(() => {
    if (successData) {
      dispatch({
        type: PAYMENT_CREATE_REQUEST,
        data: {
          price: "",
          email: "",
          PayClassId: "",
        },
      });
    }

    setToggle(true);
  }, [successData]);

  ////// TOGGLE //////
  ////// HANDLER //////
  ////// DATAVIEW //////

  const style = {
    display: "none",
    size: "responsive",
    color: "blue",
    shape: "rect",
    label: "checkout",
    tagline: "true",
    layout: "horizontal",
  };
  let env = "sandbox";
  let currency = "USD";
  // 결제 금액

  // 결제 성공
  const onSuccess = (payment) => {
    console.log(payment, "payment");
    setSuccessData(payment);
  };

  // 결제 취소
  const onCancel = (data) => {
    console.log("The payment was cancelled!", data);
  };

  // 결제 실패
  const onError = (err) => {
    console.log("Error!", err);
  };

  // 클라이언트 정보
  const client = {
    sandbox:
      "ARjNDMl7aLKB5_m5zBKz4C7BV6Z4ePz8IeNPugWMjBisNcEEYLsUa2FUZ-qqDs_jICbI467wl_YdlhzA",
    production: "k-talk",
  };

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
        <WholeWrapper>
          <RsWrapper>
            <Wrapper margin={`100px 0 0 0`} al={`flex-start`} ju={`flex-start`}>
              <Wrapper
                dr={`row`}
                width={`auto`}
                ju={`flex-start`}
                padding={`15px 20px`}
                margin={`80px 0 0 0`}
                fontSize={width < 700 ? `14px` : `18px`}
                color={Theme.black_3C}
                minHeight={width < 700 ? `80px` : `94px`}
                shadow={`0px 2px 4px rgba(0, 0, 0, 0.16)`}
                radius={`10px`}>
                <Image
                  width={`22px`}
                  margin={width < 900 ? `0 5px 0 0` : `0 16px 0 0`}
                  src="https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_lecture.png"
                  alt="lecture_icon"
                />
                <Text fontWeight={`600`}>강의명</Text>
                &nbsp;
                <Text>|</Text>&nbsp;
                <Text>한국어 완벽 학습</Text>
              </Wrapper>

              <Wrapper al={`flex-start`} dr={`row`} margin={`30px 0 100px 0`}>
                <Wrapper
                  al={`flex-start`}
                  padding={`35px 25px`}
                  width={`calc(100% - 30% - 22px)`}
                  fontSize={width < 700 ? `14px` : `18px`}
                  color={Theme.black_3C}
                  height={`auto`}
                  shadow={`0px 2px 4px rgba(0, 0, 0, 0.16)`}
                  radius={`10px `}>
                  한국어 완벽 학습 한국어 완벽 학습 한국어 완벽 학습 한국어 완벽
                </Wrapper>

                <Wrapper
                  width={`30%`}
                  margin={`0 0 0 22px`}
                  top={`100px`}
                  position={`sticky`}>
                  <Wrapper
                    fontSize={width < 700 ? `14px` : `18px`}
                    color={Theme.black_3C}
                    padding={width < 700 ? `10px` : `20px 30px`}
                    shadow={`0px 2px 4px rgba(0, 0, 0, 0.16)`}
                    radius={`10px `}>
                    <Wrapper borderBottom={`1px dashed ${Theme.grey_C}`}>
                      <Wrapper
                        dr={`row`}
                        ju={`space-between`}
                        fontSize={width < 700 ? `14px` : `18px`}>
                        <Text fontWeight={`600`}>수업 금액</Text>
                        <Text>52,000원</Text>
                      </Wrapper>

                      <Wrapper
                        dr={`row`}
                        ju={`space-between`}
                        margin={`13px 0 10px 0`}
                        fontSize={width < 700 ? `14px` : `18px`}>
                        <Text>할인율</Text>
                        <Text color={Theme.subTheme2_C}>20%</Text>
                      </Wrapper>
                    </Wrapper>

                    <Wrapper
                      dr={`row`}
                      ju={`space-between`}
                      fontSize={width < 700 ? `14px` : `18px`}>
                      <Text>총 결제 금액</Text>
                      <Text
                        color={Theme.black_3C}
                        fontSize={width < 700 ? `16px` : `24px`}>
                        18,200원
                      </Text>
                    </Wrapper>
                  </Wrapper>

                  {toggle && (
                    <Wrapper margin={`10px 0 0`}>
                      <PaypalBtn
                        style={style}
                        env={env}
                        client={client}
                        total={"1"}
                        currency={currency}
                        onSuccess={onSuccess}
                        onError={onError}
                        onCancel={onCancel}
                      />
                    </Wrapper>
                  )}

                  {/* <Button
                    type="primary"
                    style={{ width: "100%", marginTop: 10 }}>
                    결제하기
                  </Button> */}
                </Wrapper>
              </Wrapper>
            </Wrapper>
          </RsWrapper>
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
      type: PAYMENT_LIST_REQUEST,
    });

    // 구현부 종료
    context.store.dispatch(END);
    console.log("🍀 SERVER SIDE PROPS END");
    await context.store.sagaTask.toPromise();
  }
);

export default Index;
