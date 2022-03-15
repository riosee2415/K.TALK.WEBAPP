import React, { useCallback, useState } from "react";

import { useSelector, useDispatch } from "react-redux";
import { END } from "redux-saga";
import Head from "next/head";
import axios from "axios";
import wrapper from "../../store/configureStore";

import { Form, Select, Calendar } from "antd";
import { CalendarOutlined, CaretDownOutlined } from "@ant-design/icons";
import ClientLayout from "../../components/ClientLayout";
import {
  WholeWrapper,
  RsWrapper,
  Wrapper,
  Text,
  TextInput,
} from "../../components/commonComponents";

import { SEO_LIST_REQUEST } from "../../reducers/seo";
import { LOAD_MY_INFO_REQUEST } from "../../reducers/user";
import Theme from "../../components/Theme";
import styled from "styled-components";
import useWidth from "../../hooks/useWidth";

const CustomForm = styled(Form)`
  width: 718px;

  & .ant-form-item {
    width: 100%;
    margin: 0 0 48px;
  }

  @media (max-width: 700px) {
    width: 100%;

    & .ant-form-item {
      margin: 0 0 28px;
    }
  }
`;

const CusotmInput = styled(TextInput)`
  /* border: none; */
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.16);
  border-radius: 5px;

  &::placeholder {
    color: ${Theme.grey2_C};
  }
`;

const CustomSelect = styled(Select)`
  width: 100%;

  &:not(.ant-select-customize-input) .ant-select-selector {
    border-radius: 5px;
    box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.05);
  }

  & .ant-select-selector {
    width: 100% !important;
    height: 40px !important;
    padding: 5px 0 0 10px !important;
  }

  & .ant-select-arrow span svg {
    color: ${Theme.black_C};
  }
`;

const Presentation = () => {
  ////// GLOBAL STATE //////
  const { seo_keywords, seo_desc, seo_ogImage, seo_title } = useSelector(
    (state) => state.seo
  );

  ////// HOOKS //////

  const width = useWidth();

  const [isCalendar, setIsCalendar] = useState(false);

  const [form] = Form.useForm();

  ////// TOGGLE //////

  const calenderToggle = useCallback(() => {
    setIsCalendar(!isCalendar);
  }, [isCalendar]);

  const dateChagneHandler = useCallback((data) => {
    const birth = data.format("YYYY-MM-DD");
    form.setFieldsValue({
      date: birth.split("-")[2],
      month: birth.split("-")[1],
      year: birth.split("-")[0],
    });
  }, []);

  ////// DATAVIEW //////

  const firstPhoneArr = [
    "010",
    "011",
    "012",
    "013",
    "014",
    "015",
    "016",
    "017",
    "018",
    "019",
    "030",
    "050",
    "060",
    "070",
    "080",
    "020",
    "040",
    "090",
  ];
  return (
    <>
      <Head>
        <title>{seo_title.length < 1 ? "ALAL" : seo_title[0].content}</title>

        <meta
          name="subject"
          content={seo_title.length < 1 ? "ALAL" : seo_title[0].content}
        />
        <meta
          name="title"
          content={seo_title.length < 1 ? "ALAL" : seo_title[0].content}
        />
        <meta name="keywords" content={seo_keywords} />
        <meta
          name="description"
          content={
            seo_desc.length < 1 ? "undefined description" : seo_desc[0].content
          }
        />
        {/* <!-- OG tag  --> */}
        <meta
          property="og:title"
          content={seo_title.length < 1 ? "ALAL" : seo_title[0].content}
        />
        <meta
          property="og:site_name"
          content={seo_title.length < 1 ? "ALAL" : seo_title[0].content}
        />
        <meta
          property="og:description"
          content={
            seo_desc.length < 1 ? "undefined description" : seo_desc[0].content
          }
        />
        <meta property="og:keywords" content={seo_keywords} />
        <meta
          property="og:image"
          content={seo_ogImage.length < 1 ? "" : seo_ogImage[0].content}
        />
      </Head>
      <ClientLayout>
        <WholeWrapper margin={`100px 0`}>
          <RsWrapper>
            <Wrapper margin={`90px 0 68px`}>
              <Text color={Theme.grey2_C}>
                For absolute beginners / For pre-intermediate leamers
              </Text>
              <Text fontSize={`28px`} fontWeight={`bold`}>
                설명회 참가신청서 (초급/중급)
              </Text>
            </Wrapper>
            <CustomForm form={form}>
              <Text fontSize={`18px`} fontWeight={`bold`}>
                Name in full (First / Last)
              </Text>
              <Wrapper dr={`row`} ju={`space-between`}>
                <Wrapper width={`calc(50% - 4px)`}>
                  <Form.Item>
                    <CusotmInput placeholder="First" width={`100%`} />
                  </Form.Item>
                </Wrapper>
                <Wrapper width={`calc(50% - 4px)`}>
                  <Form.Item>
                    <CusotmInput placeholder="Last" width={`100%`} />
                  </Form.Item>
                </Wrapper>
              </Wrapper>
              <Wrapper al={`flex-start`} position={"relative"}>
                <Text fontSize={`18px`} fontWeight={`bold`}>
                  Date of Birth
                </Text>
                <Wrapper dr={`row`} ju={`flex-start`}>
                  <Wrapper width={`calc(100% / 3 - 16px)`}>
                    <Form.Item name="date" rules={[{ requierd: true }]}>
                      <CusotmInput
                        readOnly
                        width={`100%`}
                        placeholder={"Date"}
                      />
                    </Form.Item>
                  </Wrapper>

                  <Wrapper width={`calc(100% / 3 - 16px)`} margin={`0 9px`}>
                    <Form.Item name="month" rules={[{ requierd: true }]}>
                      <CusotmInput
                        readOnly
                        width={`100%`}
                        placeholder={"Month"}
                      />
                    </Form.Item>
                  </Wrapper>

                  <Wrapper width={`calc(100% / 3 - 16px)`}>
                    <Form.Item name="year" rules={[{ requierd: true }]}>
                      <CusotmInput
                        readOnly
                        width={`100%`}
                        placeholder={"Year"}
                      />
                    </Form.Item>
                  </Wrapper>
                  <Wrapper
                    width={`30px`}
                    margin={width < 700 ? `0 0 28px` : `0 0 48px`}
                    fontSize={`30px`}
                  >
                    <CalendarOutlined onClick={calenderToggle} />
                  </Wrapper>
                </Wrapper>

                <Wrapper
                  display={isCalendar ? "flex" : "none"}
                  width={`auto`}
                  position={width < 1350 ? `static` : `absolute`}
                  top={`30px`}
                  right={`-310px`}
                  border={`1px solid ${Theme.grey_C}`}
                  margin={`0 0 20px`}
                >
                  <Calendar
                    style={{ width: width < 1350 ? `100%` : `300px` }}
                    fullscreen={false}
                    onChange={dateChagneHandler}
                  />
                </Wrapper>
              </Wrapper>

              <Text fontSize={`18px`} fontWeight={`bold`}>
                Gmail Address
              </Text>
              <Wrapper dr={`row`} ju={`flex-start`}>
                <Wrapper width={`calc(100% / 2 - 4px)`} margin={`0 8px 0 0`}>
                  <Form.Item name="firstEmail" rules={[{ required: true }]}>
                    <CusotmInput width={`100%`} placeholder={"Address"} />
                  </Form.Item>
                </Wrapper>

                <Wrapper width={`calc(100% / 2 - 4px)`}>
                  <Form.Item name="lastEmail" rules={[{ required: true }]}>
                    <CusotmInput width={`100%`} placeholder={"@gmail.com"} />
                  </Form.Item>
                </Wrapper>
              </Wrapper>

              <Text fontSize={`18px`} fontWeight={`bold`}>
                Login PW
              </Text>
              <Form.Item>
                <CusotmInput width={`100%`} placeholder={"PW"} />
              </Form.Item>
              <Text fontSize={`18px`} fontWeight={`bold`}>
                Country of Residence
              </Text>
              <Form.Item>
                <CusotmInput width={`100%`} placeholder={"Nationality"} />
              </Form.Item>
              <Text fontSize={`18px`} fontWeight={`bold`}>
                Phone number
              </Text>
              <Wrapper dr={`row`} ju={`flex-start`}>
                <Wrapper width={`calc(20% - 4px)`} margin={`0 8px 0 0`}>
                  <Form.Item name="phoneNumber" rules={[{ required: true }]}>
                    <CustomSelect
                      suffixIcon={() => {
                        return <CaretDownOutlined />;
                      }}
                    >
                      {firstPhoneArr &&
                        firstPhoneArr.map((data) => {
                          return (
                            <Select.Option value={data}>{data}</Select.Option>
                          );
                        })}
                    </CustomSelect>
                  </Form.Item>
                </Wrapper>

                <Wrapper width={`calc(80% - 4px)`}>
                  <Form.Item name="phoneNumber2" rules={[{ required: true }]}>
                    <CusotmInput width={`100%`} />
                  </Form.Item>
                </Wrapper>
              </Wrapper>
            </CustomForm>
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

    // 구현부 종료
    context.store.dispatch(END);
    console.log("🍀 SERVER SIDE PROPS END");
    await context.store.sagaTask.toPromise();
  }
);

export default Presentation;
