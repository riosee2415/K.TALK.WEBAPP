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
  Input,
  TextInput,
} from "../../components/commonComponents";
import { Button, Empty, Form, message, Select } from "antd";
import PaypalExpressBtn from "react-paypal-express-checkout";
import {
  PAYMENT_CREATE_REQUEST,
  PAYMENT_LIST_REQUEST,
} from "../../reducers/payment";
import { useRouter } from "next/router";
import { PAY_CLASS_DETAIL_REQUEST } from "../../reducers/payClass";
import moment from "moment";
import useInput from "../../hooks/useInput";

const PaypalBtn = styled(PaypalExpressBtn)``;

const InputText = styled(TextInput)`
  width: 100%;
  height: 30px;

  background-color: rgb(230, 239, 255);
  box-shadow: 2px 2px 2px rgb(226, 226, 226);
`;

const CustomForm = styled(Form)`
  width: 100%;

  & .ant-form-item {
    margin: 0;

    width: 100%;
  }
`;

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

  const [send, setSend] = useState(false);

  const [depositForm] = Form.useForm();

  useEffect(() => {
    if (st_paymentCreateDone) {
      setSend(false);
      depositForm.resetFields();
      return message.success("결제 또는 계좌이체 신청서를 완료했습니다.");
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
          PayClassId: payClassDetail && payClassDetail.id,
          email: successData && successData.email,
          price:
            payClassDetail &&
            payClassDetail.price -
              (payClassDetail.price * payClassDetail.discount) / 100,
          type: "PayPal",
          name: successData.address.recipient_name,
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

  // sandbox
  // production
  let currency = "USD";
  // 결제 금액

  // 결제 성공
  const onSuccess = (payment, data) => {
    setSuccessData(payment);
  };

  // 결제 취소
  const onCancel = (data) => {
    return message.error("The payment was cancelled!", data);
  };

  // 결제 실패
  const onError = (err) => {
    return message.error("The payment was false!", err);
  };

  const onClickSend = useCallback(() => {
    setSend((prev) => !prev);
  }, []);

  const onFinishDeposit = useCallback(
    (data) => {
      dispatch({
        type: PAYMENT_CREATE_REQUEST,
        data: {
          PayClassId: payClassDetail && payClassDetail.id,
          email: data.email,
          price:
            payClassDetail &&
            payClassDetail.price -
              (payClassDetail.price * payClassDetail.discount) / 100,

          type: "계좌이체",
          name: data.name,
          bankNo: data.account,
        },
      });
    },
    [payClassDetail]
  );

  useEffect(() => {
    if (!send) {
      depositForm.resetFields();
    }
  }, [send, depositForm]);

  useEffect(() => {
    if (st_payClassDetailDone) {
      let saveData = moment()
        .add(payClassDetail.week * 7, "days")
        .format("YYYY-MM-DD");
      let diff = moment
        .duration(moment(payClassDetail.Lecture.endDate).diff(moment(saveData)))
        .asDays();
      diff = Math.abs(diff);

      depositForm.setFieldsValue({
        price:
          payClassDetail.price -
          (payClassDetail.price * payClassDetail.discount) / 100,
      });
    }
  }, [depositForm, st_payClassDetailDone]);

  // 클라이언트 정보
  const client = {
    sandbox:
      "Adg97RInMG1OEFbUeFnVlso4UtdnapZiaEcDhCPH58CCBLg0IwMq__Q9uAlPs90GmpCgDW9t76svLBc-",

    // production:
    //   "AU5XytqvAVo11IK8bdQvtVrVKcMReC99C_A3pdUq9CEUoeVI0e27Qm15gCr1_9YNqEaR3PQX8CWZJp6t",
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
        <WholeWrapper
          bgColor={`rgba(216, 231, 255, 0.2)`}
          minHeight={`calc(100vh - 200px)`}
          ju={`flex-start`}>
          <Wrapper
            position={`fixed`}
            top={width < 900 ? `82px` : `100px`}
            left={`0`}
            bgColor={`rgb(230, 239, 255)`}
            padding={`15px 0`}
            zIndex={`100`}
            shadow={`2px 2px 2px rgb(226, 226, 226)`}>
            <RsWrapper dr={`row`} ju={width < 900 ? `center` : `flex-end`}>
              {/* <Wrapper
                width={`auto`}
                fontSize={width < 900 ? `16px` : `20px`}
                margin={width < 900 && `0 0 10px`}
                fontWeight={`bold`}>
                새 인보이스 번호(2202512)
              </Wrapper> */}

              {toggle && (
                <Wrapper width={`auto`}>
                  <PaypalBtn
                    style={style}
                    // paymentOptions={{
                    //   transactions: [
                    //     {
                    //       amount: {
                    //         total: Math.floor(
                    //           payClassDetail &&
                    //             payClassDetail.price -
                    //               (payClassDetail.price *
                    //                 payClassDetail.discount) /
                    //                 100
                    //         ),
                    //         currency: currency,
                    //       },
                    //       item_list: {
                    //         shipping_address: {
                    //           recipient_name: "Brian Robinson",
                    //           line1: "4th Floor",
                    //           line2: "Unit #34",
                    //           city: "San Jose Test",
                    //           state: "CA",
                    //           phone: "011862212345678",
                    //           postal_code: "95131",
                    //           country_code: "US",
                    //         },
                    //       },
                    //     },
                    //   ],
                    // }}
                    env={env}
                    client={client}
                    total={Math.floor(
                      payClassDetail &&
                        payClassDetail.price -
                          (payClassDetail.price * payClassDetail.discount) / 100
                    )}
                    currency={currency}
                    onSuccess={onSuccess}
                    onError={onError}
                    onCancel={onCancel}
                  />
                </Wrapper>
              )}
            </RsWrapper>
          </Wrapper>
          <RsWrapper>
            {payClassDetail ? (
              <Wrapper
                margin={`230px 0 0 0`}
                dr={`row`}
                al={`flex-end`}
                ju={width < 800 ? `center` : `space-between`}>
                <Wrapper
                  al={`flex-start`}
                  width={width < 800 ? `100%` : `calc(100% - 370px)`}>
                  <Text
                    margin={`0 0 15px 0`}
                    fontSize={width < 700 ? `16px` : `20px`}
                    color={Theme.darkGrey_C}
                    fontWeight={`600`}>
                    상품
                  </Text>
                  <Wrapper
                    dr={`row`}
                    ju={`flex-start`}
                    padding={`15px 20px`}
                    fontSize={width < 700 ? `14px` : `18px`}
                    color={Theme.black_3C}
                    minHeight={`80px`}
                    shadow={`0px 5px 15px rgba(0, 0, 0, 0.05)`}
                    bgColor={Theme.white_C}
                    radius={`5px`}>
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

                  <Wrapper margin={`15px 0 0`}>
                    <Wrapper
                      al={`flex-start`}
                      ju={`flex-start`}
                      padding={width < 900 ? `20px` : `20px 30px`}
                      fontSize={width < 700 ? `14px` : `18px`}
                      color={Theme.black_3C}
                      height={`auto`}
                      minHeight={`210px`}
                      shadow={`0px 5px 15px rgba(0, 0, 0, 0.05)`}
                      bgColor={Theme.white_C}
                      radius={`10px `}>
                      <Wrapper
                        al={`flex-start`}
                        borderBottom={`1px solid ${Theme.grey_C}`}
                        padding={`0 0 10px`}
                        margin={`0 0 5px`}>
                        <Text color={Theme.grey2_C}>
                          {payClassDetail && payClassDetail.name}
                        </Text>
                      </Wrapper>
                      {payClassDetail &&
                        payClassDetail.memo.split(`\n`).map((data, idx) => {
                          return (
                            <SpanText key={idx}>
                              {data}
                              <br />
                            </SpanText>
                          );
                        })}
                    </Wrapper>
                  </Wrapper>
                </Wrapper>

                <Wrapper
                  fontSize={width < 700 ? `14px` : `18px`}
                  color={Theme.black_3C}
                  padding={width < 700 ? `20px` : `20px 30px`}
                  shadow={`0px 5px 15px rgba(0, 0, 0, 0.05)`}
                  bgColor={Theme.white_C}
                  minHeight={width < 900 ? `200px` : `305px`}
                  margin={width < 900 && `0 0 50px`}
                  ju={`space-between`}
                  radius={`5px`}
                  width={width < 800 ? `100%` : `350px`}>
                  <Wrapper>
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
                      margin={`13px 0 0`}
                      fontSize={width < 700 ? `14px` : `18px`}>
                      <Text>할인율</Text>
                      <Text color={Theme.subTheme2_C}>
                        {payClassDetail && payClassDetail.discount}%
                      </Text>
                    </Wrapper>
                    <Wrapper
                      dr={`row`}
                      ju={`space-between`}
                      margin={`13px 0 25px`}
                      fontSize={width < 700 ? `14px` : `18px`}>
                      <Text>강의 기간</Text>
                      <Text>{payClassDetail && payClassDetail.week}주</Text>
                    </Wrapper>
                  </Wrapper>

                  <Wrapper
                    dr={`row`}
                    ju={`space-between`}
                    borderTop={`2px dashed ${Theme.grey_C}`}
                    padding={`10px 0 0`}
                    fontSize={width < 700 ? `14px` : `18px`}>
                    <Text>총 결제 금액</Text>
                    <Text
                      color={Theme.black_3C}
                      fontSize={width < 700 ? `16px` : `24px`}>
                      {` $${String(
                        Math.floor(
                          payClassDetail.price -
                            (payClassDetail.price * payClassDetail.discount) /
                              100
                        )
                      ).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`}
                    </Text>
                  </Wrapper>
                </Wrapper>

                <Wrapper dr={`row`} ju={`space-between`} margin={`10px 0`}>
                  <Wrapper
                    width={`auto`}
                    al={`flex-start`}
                    color={Theme.red_C}
                    padding={`10px`}
                    fontSize={`16px`}>
                    *강의 기간은 강의 참여일로부터&nbsp;
                    {payClassDetail && payClassDetail.week}주뒤까지 입니다.
                  </Wrapper>

                  <Button onClick={() => onClickSend()}>
                    {send ? `취소` : `국내송금`}
                  </Button>
                </Wrapper>

                {send && (
                  <Wrapper al={`flex-start`} margin={`40px 0 0 0`}>
                    <Text
                      margin={`0 0 15px 0`}
                      fontSize={width < 700 ? `16px` : `20px`}
                      color={Theme.darkGrey_C}
                      fontWeight={`600`}>
                      계좌이체 신청서
                    </Text>
                  </Wrapper>
                )}

                {send && (
                  <>
                    <Wrapper
                      width={width < 800 ? `100%` : `calc(100% - 370px)`}
                      dr={`row`}
                      padding={`20px 30px`}
                      bgColor={Theme.white_C}
                      radius={`5px`}
                      shadow={`0px 5px 15px rgba(0, 0, 0, 0.05)`}>
                      <CustomForm form={depositForm} onFinish={onFinishDeposit}>
                        <Wrapper
                          dr={`row`}
                          ju={`flex-start`}
                          margin={`10px 0 0 0`}
                          color={Theme.black_3C}
                          fontSize={width < 700 ? `16px` : `18px`}>
                          <Text margin={`0 0 10px 0`}>이름</Text>
                          <Form.Item
                            name={`name`}
                            rules={[
                              {
                                required: true,
                                message: "이름을 입력해주세요.",
                              },
                            ]}>
                            <InputText placeholder="이름을 입력해주세요." />
                          </Form.Item>
                        </Wrapper>
                        <Wrapper
                          dr={`row`}
                          ju={`flex-start`}
                          margin={`10px 0 0 0`}
                          color={Theme.black_3C}
                          fontSize={width < 700 ? `16px` : `18px`}>
                          <Text margin={`0 0 10px 0`}>이메일</Text>
                          <Form.Item
                            name={`email`}
                            rules={[
                              {
                                required: true,
                                message: "이메일을 입력해주세요.",
                              },
                            ]}>
                            <InputText
                              type={`email`}
                              placeholder="가입한 이메일 또는 신청서 이메일을 입력해주세요."
                            />
                          </Form.Item>
                        </Wrapper>
                        <Wrapper
                          dr={`row`}
                          ju={`flex-start`}
                          margin={`10px 0 0 0`}
                          color={Theme.black_3C}
                          fontSize={width < 700 ? `16px` : `18px`}>
                          <Text margin={`0 0 10px 0`}>입금 계좌번호</Text>
                          <Wrapper al={`flex-start`}>
                            <Form.Item
                              name={`account`}
                              rules={[
                                {
                                  required: true,
                                  message: "계좌번호를 입력해주세요.",
                                },
                              ]}>
                              <InputText placeholder="입금 계좌번호를 입력해주세요." />
                            </Form.Item>
                          </Wrapper>
                        </Wrapper>
                        <Wrapper
                          dr={`row`}
                          ju={`flex-start`}
                          margin={`10px 0 0 0`}
                          color={Theme.black_3C}
                          fontSize={width < 700 ? `16px` : `18px`}>
                          <Text>은행 및 계좌번호</Text>
                          <Wrapper
                            al={`flex-start`}
                            fontSize={width < 700 ? `14px` : `16px`}>
                            K-Talk Live OO은행 235-235235-235235
                          </Wrapper>
                        </Wrapper>
                        <Wrapper
                          dr={`row`}
                          ju={`flex-start`}
                          margin={`10px 0 0 0`}
                          color={Theme.black_3C}
                          fontSize={width < 700 ? `16px` : `18px`}>
                          <Text>가격</Text>
                          <Form.Item name={"price"}>
                            <Text
                              al={`flex-start`}
                              margin={`0 0 10px 0`}
                              fontSize={width < 700 ? `14px` : `16px`}>
                              {` $${String(
                                Math.floor(
                                  payClassDetail.price -
                                    (payClassDetail.price *
                                      payClassDetail.discount) /
                                      100
                                )
                              ).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`}
                            </Text>
                          </Form.Item>
                        </Wrapper>
                        <Wrapper al={`flex-end`} margin={`10px 0 0 0`}>
                          <Button htmlType="submit">신청하기</Button>
                        </Wrapper>
                      </CustomForm>
                    </Wrapper>

                    <Wrapper
                      width={`calc(100% - 370px)`}
                      al={`flex-start`}
                      color={Theme.red_C}
                      padding={`10px`}
                      fontSize={`16px`}
                      margin={`0 0 50px 0`}></Wrapper>
                  </>
                )}
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
