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
  SpanText,
} from "../../components/commonComponents";
import { Button, Empty, message, Select } from "antd";
import PaypalExpressBtn from "react-paypal-express-checkout";
import {
  PAYMENT_CREATE_REQUEST,
  PAYMENT_LIST_REQUEST,
} from "../../reducers/payment";
import { useRouter } from "next/router";
import { PAY_CLASS_DETAIL_REQUEST } from "../../reducers/payClass";
import moment from "moment";

const PaypalBtn = styled(PaypalExpressBtn)``;

const Index = () => {
  ////// GLOBAL STATE //////
  const { seo_keywords, seo_desc, seo_ogImage, seo_title } = useSelector(
    (state) => state.seo
  );

  const { me } = useSelector((state) => state.user);

  const router = useRouter();
  const dispatch = useDispatch();

  const {
    paymentList,
    st_paymentListDone,
    st_paymentListError,
    st_paymentCreateDone,
    st_paymentCreateError,
  } = useSelector((state) => state.payment);

  const { payClassDetail, st_payClassDetailDone, st_payClassDetailError } =
    useSelector((state) => state.payClass);

  const width = useWidth();

  const [toggle, setToggle] = useState(false);
  const [successData, setSuccessData] = useState("");

  useEffect(() => {
    if (st_paymentCreateDone) {
      return message.success("결제를 완료했습니다.");
    }
  }, [st_paymentCreateDone]);

  useEffect(() => {
    if (st_paymentCreateError) {
      return message.error(st_paymentCreateError);
    }
  }, [st_paymentCreateError]);

  useEffect(() => {
    if (st_payClassDetailError) {
      return message.error(st_payClassDetailError);
    }
  }, [st_payClassDetailError]);

  useEffect(() => {
    if (st_paymentListError) {
      return message.error(st_paymentListError);
    }
  }, [st_paymentListError]);

  ////// HOOKS //////
  ////// REDUX //////
  ////// USEEFFECT //////

  useEffect(() => {
    dispatch({
      type: PAY_CLASS_DETAIL_REQUEST,
      data: {
        classId: router.query.id,
      },
    });

    setToggle(true);
  }, []);

  useEffect(() => {
    if (successData) {
      dispatch({
        type: PAYMENT_CREATE_REQUEST,
        data: {
          price:
            payClassDetail &&
            payClassDetail.price -
              (payClassDetail.price * payClassDetail.discount) / 100,
          email: successData && successData.email,
          PayClassId: payClassDetail && payClassDetail.id,
        },
      });
    }
  }, [successData]);

  ////// TOGGLE //////
  ////// HANDLER //////
  ////// DATAVIEW //////

  const style = {
    display: "none",
    size: "large",
    color: "blue",
    shape: "rect",
    label: "checkout",
    tagline: "true",
    layout: "horizontal",
  };

  // small
  // medium
  // large
  // responsive

  let env = "sandbox";
  let currency = "USD";
  // 결제 금액

  // 결제 성공
  const onSuccess = (payment) => {
    setSuccessData(payment);
    // console.log(payment);
  };

  // 결제 취소
  const onCancel = (data) => {
    return message.error("The payment was cancelled!", data);
  };

  // 결제 실패
  const onError = (err) => {
    return message.error("The payment was false!", data);
  };

  // 클라이언트 정보
  const client = {
    sandbox:
      "ARjNDMl7aLKB5_m5zBKz4C7BV6Z4ePz8IeNPugWMjBisNcEEYLsUa2FUZ-qqDs_jICbI467wl_YdlhzA",
    production: "k-talk",
  };

  useEffect(() => {
    if (st_payClassDetailDone) {
      let saveData = moment()
        .add(payClassDetail.week * 7, "days")
        .format("YYYY-MM-DD");

      let diff = moment
        .duration(moment(payClassDetail.Lecture.endDate).diff(moment(saveData)))
        .asDays();

      diff = Math.abs(diff);
    }
  }, [st_payClassDetailDone]);

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
            {payClassDetail ? (
              <Wrapper
                margin={`100px 0 0 0`}
                minHeight={`600px`}
                al={`flex-start`}
                ju={`flex-start`}>
                <Wrapper
                  dr={`row`}
                  width={width < 700 ? `100%` : `auto`}
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
                  <Text>{payClassDetail && payClassDetail.name}</Text>
                </Wrapper>

                <Wrapper
                  al={`flex-start`}
                  dr={width < 1000 ? `column` : `row`}
                  margin={`30px 0 100px 0`}>
                  <Wrapper
                    al={`flex-start`}
                    ju={`flex-start`}
                    padding={`35px 25px`}
                    width={width < 1000 ? `100%` : `calc(100% - 30% - 22px)`}
                    fontSize={width < 700 ? `14px` : `18px`}
                    color={Theme.black_3C}
                    height={`auto`}
                    shadow={`0px 2px 4px rgba(0, 0, 0, 0.16)`}
                    radius={`10px `}>
                    {payClassDetail &&
                      payClassDetail.memo.split(`\n`).map((data) => {
                        return (
                          <SpanText>
                            {data}
                            <br />
                          </SpanText>
                        );
                      })}
                  </Wrapper>

                  <Wrapper
                    width={width < 1000 ? `100%` : `30%`}
                    margin={width < 1000 ? `22px 0 0 0` : `0 0 0 22px`}
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
                          <Text>
                            {`$${
                              payClassDetail &&
                              String(payClassDetail.price).replace(
                                /\B(?=(\d{3})+(?!\d))/g,
                                ","
                              )
                            }`}
                          </Text>
                        </Wrapper>

                        <Wrapper
                          dr={`row`}
                          ju={`space-between`}
                          margin={`13px 0 10px 0`}
                          fontSize={width < 700 ? `14px` : `18px`}>
                          <Text>할인율</Text>
                          <Text color={Theme.subTheme2_C}>
                            {payClassDetail && payClassDetail.discount}%
                          </Text>
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
                          {` $${String(
                            Math.floor(
                              payClassDetail.price -
                                (payClassDetail.price *
                                  payClassDetail.discount) /
                                  100
                            )
                          ).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`}
                        </Text>
                      </Wrapper>
                    </Wrapper>

                    {toggle && (
                      <Wrapper
                        ju={`flex-start`}
                        margin={`10px 0 0`}
                        width={`auto`}>
                        <PaypalBtn
                          style={style}
                          env={env}
                          client={client}
                          total={Math.floor(
                            payClassDetail &&
                              payClassDetail.price -
                                (payClassDetail.price *
                                  payClassDetail.discount) /
                                  100
                          )}
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
            ) : (
              <Wrapper height={`100vh`}>
                <Empty description="존재하지 않는 결제 클래스 정보입니다." />
              </Wrapper>
            )}
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
