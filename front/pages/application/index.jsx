import React, { useState, useCallback } from "react";
import ClientLayout from "../../components/ClientLayout";
import { SEO_LIST_REQUEST } from "../../reducers/seo";
import Head from "next/head";
import wrapper from "../../store/configureStore";
import { LOAD_MY_INFO_REQUEST } from "../../reducers/user";
import axios from "axios";
import { END } from "redux-saga";
import { useSelector } from "react-redux";
import {
  RsWrapper,
  WholeWrapper,
  Wrapper,
  Text,
  TextInput,
  TextArea,
  CommonButton,
  SpanText,
} from "../../components/commonComponents";
import Theme from "../../components/Theme";
import styled from "styled-components";
import { Button, Checkbox, Form, Input, Select } from "antd";
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

const CustomCheckBox = styled(Checkbox)`
  & .ant-checkbox-checked .ant-checkbox-inner {
    background-color: ${Theme.white_C} !important;
    border-color: ${Theme.grey_C} !important;
  }

  & .ant-checkbox-checked .ant-checkbox-inner::after {
    border: 2px solid ${Theme.red_C};
    border-top: 0;
    border-left: 0;
  }
`;

const CustomCheckBox2 = styled(Checkbox)`
  & .ant-checkbox + span {
    font-size: 18px !important;
  }

  & .ant-checkbox-inner {
    width: 20px;
    height: 20px;
  }

  & .ant-checkbox-checked .ant-checkbox-inner {
    background-color: ${Theme.white_C} !important;
    border-color: ${Theme.grey_C} !important;
  }

  & .ant-checkbox-checked .ant-checkbox-inner::after {
    border: 2px solid ${Theme.red_C};
    border-top: 0;
    border-left: 0;
  }
`;

const CustomSelect = styled(Select)`
  width: 100%;

  & .ant-select-selector {
    width: 100% !important;
    height: 40px !important;
    padding: 10px !important;
    border-radius: 5px;
  }
`;

const Application = () => {
  ////// GLOBAL STATE //////
  const { seo_keywords, seo_desc, seo_ogImage, seo_title } = useSelector(
    (state) => state.seo
  );

  ////// HOOKS //////

  const width = useWidth();

  const [titleSelect, setTitleSelect] = useState(null);
  const [timeSelect, setTimeSelect] = useState(null);
  const [agreeCheck, setAgreeCheck] = useState(false);

  ////// REDUX //////
  ////// USEEFFECT //////
  ////// TOGGLE //////

  const titleSelectToggle = useCallback(
    (select) => {
      setTitleSelect(select);
    },
    [titleSelect]
  );

  const timeSelectToggle = useCallback(
    (select) => {
      setTimeSelect(select);
    },
    [timeSelect]
  );

  const agreeCheckToggle = useCallback(
    (data) => {
      setAgreeCheck(data.target.checked);
    },
    [agreeCheck]
  );

  ////// HANDLER //////
  ////// DATAVIEW //////

  const timeArr = [
    "06:00 - 06:50 KST",
    "14:00 - 14:50 KST",
    "22:00 - 22:50 KST",
    "07:00 - 07:50 KST",
    "15:00 - 15:50 KST",
    "23:00 - 23:50 KST",
    "08:00 - 08:50 KST",
    "16:00 - 16:50 KST",
    "24:00 - 24:50 KST",
    "09:00 - 09:50 KST",
    "17:00 - 17:50 KST",
    "01:00 - 01:50 KST",
    "10:00 - 10:50 KST",
    "18:00 - 18:50 KST",
    "02:00 - 02:50 KST",
    "11:00 - 11:50 KST",
    "19:00 - 19:50 KST",
    "03:00 - 03:50 KST",
    "12:00 - 12:50 KST",
    "20:00 - 20:50 KST",
    "04:00 - 04:50 KST",
    "13:00 - 13:50 KST",
    "21:00 - 21:50 KST",
    "05:00 - 05:50 KST",
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
        <WholeWrapper
          bgColor={Theme.subTheme_C}
          padding={`80px 0`}
          margin={width < 700 ? `50px 0 0` : `100px 0 0`}
        >
          <RsWrapper>
            <Wrapper fontSize={`28px`} fontWeight={`bold`}>
              Application Form
            </Wrapper>
            <Wrapper fontSize={`18px`} margin={`10px 0 30px`}>
              for K-talk LIve regular paid Korean lessons
            </Wrapper>
            <Wrapper>
              ·Please complete and submit this form so that teachers can contact
              you for the next step.
            </Wrapper>
            <Wrapper>
              ·If you'd like to apply for our Free Hangeul Lessons, please exit
              this page and visit our website at
            </Wrapper>
            <Wrapper dr={`row`}>
              <Text color={Theme.basicTheme_C}>http://ktalklive.com</Text>
              &nbsp;or our FB page at&nbsp;
              <Text color={Theme.basicTheme_C}>
                https://www.facebook.com/ktalklive/
              </Text>
            </Wrapper>
            <Wrapper
              color={Theme.subTheme2_C}
              margin={`20px 0 68px`}
              fontSize={`20px`}
              fontWeight={`bold`}
            >
              Thank you very much!
            </Wrapper>

            <CustomForm onFinish={console.log}>
              <Wrapper al={`flex-start`}>
                <Text fontSize={`18px`} fontWeight={`bold`} margin={`0 0 10px`}>
                  Name in full (First/Last)
                </Text>
                <Wrapper dr={`row`} ju={`flex-start`}>
                  <Wrapper width={`calc(100% / 2 - 4px)`} margin={`0 8px 0 0`}>
                    <Form.Item name="firstName">
                      <TextInput
                        width={`100%`}
                        placeholder={"First"}
                        radius={`5px`}
                      />
                    </Form.Item>
                  </Wrapper>

                  <Wrapper width={`calc(100% / 2 - 4px)`}>
                    <Form.Item name="lastName">
                      <TextInput
                        width={`100%`}
                        placeholder={"Last"}
                        radius={`5px`}
                      />
                    </Form.Item>
                  </Wrapper>
                </Wrapper>
              </Wrapper>
              <Wrapper al={`flex-start`}>
                <Text fontSize={`18px`} fontWeight={`bold`} margin={`0 0 10px`}>
                  Title
                </Text>
                <Wrapper dr={`row`} ju={`flex-start`}>
                  <Wrapper
                    dr={`row`}
                    width={`40%`}
                    margin={width < 700 ? `0 0 28px` : `0 0 48px`}
                    ju={`flex-start`}
                  >
                    <CustomCheckBox
                      checked={titleSelect === "Ms."}
                      onChange={() => titleSelectToggle("Ms.")}
                    >
                      Ms.
                    </CustomCheckBox>
                    <CustomCheckBox
                      checked={titleSelect === "Mr."}
                      onChange={() => titleSelectToggle("Mr.")}
                    >
                      Mr.
                    </CustomCheckBox>
                    <CustomCheckBox
                      checked={titleSelect === "Others."}
                      onChange={() => titleSelectToggle("Others.")}
                    >
                      Others.
                    </CustomCheckBox>
                  </Wrapper>
                  <Wrapper width={`60%`}>
                    <Form.Item name="title">
                      <TextInput width={"100%"} radius={`5px`} />
                    </Form.Item>
                  </Wrapper>
                </Wrapper>
              </Wrapper>
              <Wrapper al={`flex-start`}>
                <Text fontSize={`18px`} fontWeight={`bold`} margin={`0 0 10px`}>
                  Date of Birth
                </Text>
                <Wrapper dr={`row`} ju={`flex-start`}>
                  <Wrapper width={`calc(100% / 3 - 6px)`}>
                    <Form.Item name="date">
                      <TextInput
                        width={`100%`}
                        radius={`5px`}
                        placeholder={"Date"}
                      />
                    </Form.Item>
                  </Wrapper>

                  <Wrapper width={`calc(100% / 3 - 6px)`} margin={`0 9px`}>
                    <Form.Item name="month">
                      <TextInput
                        width={`100%`}
                        radius={`5px`}
                        placeholder={"Month"}
                      />
                    </Form.Item>
                  </Wrapper>

                  <Wrapper width={`calc(100% / 3 - 6px)`}>
                    <Form.Item name="year">
                      <TextInput
                        width={`100%`}
                        radius={`5px`}
                        placeholder={"Year"}
                      />
                    </Form.Item>
                  </Wrapper>
                </Wrapper>
              </Wrapper>
              <Wrapper al={`flex-start`}>
                <Text fontSize={`18px`} fontWeight={`bold`} margin={`0 0 10px`}>
                  Gmail Address
                </Text>
                <Wrapper dr={`row`} ju={`flex-start`}>
                  <Wrapper width={`calc(100% / 2 - 4px)`} margin={`0 8px 0 0`}>
                    <Form.Item name="email1">
                      <TextInput
                        width={`100%`}
                        radius={`5px`}
                        placeholder={"Address"}
                      />
                    </Form.Item>
                  </Wrapper>

                  <Wrapper width={`calc(100% / 2 - 4px)`}>
                    <Form.Item name="email2">
                      <TextInput
                        width={`100%`}
                        radius={`5px`}
                        placeholder={"@gmail.com"}
                      />
                    </Form.Item>
                  </Wrapper>
                </Wrapper>
              </Wrapper>
              <Wrapper al={`flex-start`}>
                <Text fontSize={`18px`} fontWeight={`bold`} margin={`0 0 10px`}>
                  Nationality
                </Text>
                <Wrapper dr={`row`} ju={`flex-start`}>
                  <Form.Item name="nationality">
                    <TextInput
                      width={`100%`}
                      radius={`5px`}
                      placeholder={"Select Nationality"}
                    />
                  </Form.Item>
                </Wrapper>
              </Wrapper>
              <Wrapper al={`flex-start`}>
                <Text fontSize={`18px`} fontWeight={`bold`} margin={`0 0 10px`}>
                  Country of Residence
                </Text>
                <Wrapper dr={`row`} ju={`flex-start`}>
                  <Form.Item name="CountryOfResidence">
                    <TextInput
                      width={`100%`}
                      radius={`5px`}
                      placeholder={"Nationality"}
                    />
                  </Form.Item>
                </Wrapper>
              </Wrapper>
              <Wrapper al={`flex-start`}>
                <Text fontSize={`18px`} fontWeight={`bold`} margin={`0 0 10px`}>
                  Language you use
                </Text>
                <Wrapper dr={`row`} ju={`flex-start`}>
                  <Form.Item name="LanguageYouUse">
                    <TextInput
                      width={`100%`}
                      radius={`5px`}
                      placeholder={"Select Languge"}
                    />
                  </Form.Item>
                </Wrapper>
              </Wrapper>
              <Wrapper al={`flex-start`}>
                <Text fontSize={`18px`} fontWeight={`bold`} margin={`0 0 10px`}>
                  Phone number
                </Text>
                <Wrapper dr={`row`} ju={`flex-start`}>
                  <Wrapper
                    width={`calc(20% - 4px)`}
                    margin={width < 700 ? `0 8px 28px 0` : `0 8px 48px 0`}
                  >
                    <CustomSelect>
                      <Select.Option>test</Select.Option>
                      <Select.Option>test</Select.Option>
                      <Select.Option>test</Select.Option>
                      <Select.Option>test</Select.Option>
                    </CustomSelect>
                  </Wrapper>

                  <Wrapper width={`calc(80% - 4px)`}>
                    <Form.Item name="lastNumber">
                      <TextInput width={`100%`} radius={`5px`} />
                    </Form.Item>
                  </Wrapper>
                </Wrapper>
              </Wrapper>
              <Wrapper>
                <Form.Item>
                  <TextInput width={`100%`} radius={`5px`} />
                </Form.Item>
              </Wrapper>

              <Wrapper al={`flex-start`} margin={`0 0 35px`}>
                <Text
                  fontSize={`18px`}
                  fontWeight={`bold`}
                  margin={`0 0 10px`}
                  lineHeight={`1.22`}
                >
                  Please choose your available class hours.
                </Text>
                <Text fontSize={`18px`} margin={`0 0 10px`} lineHeight={`1.19`}>
                  Stated time are in Korean Standard Time(GMT +9). Please check
                  all that apply.
                </Text>
              </Wrapper>
              <Wrapper dr={`row`} margin={`0 0 68px`}>
                {timeArr &&
                  timeArr.map((data) => {
                    return (
                      <Wrapper
                        width={
                          width < 700 ? `calc(100% / 2)` : `calc(100% / 3)`
                        }
                        fontSize={`18px`}
                        al={`flex-start`}
                      >
                        <CustomCheckBox2
                          checked={timeSelect === data}
                          onChange={() => timeSelectToggle(data)}
                        >
                          {data}
                        </CustomCheckBox2>
                      </Wrapper>
                    );
                  })}
              </Wrapper>

              <Wrapper
                color={Theme.red_C}
                fontSize={width < 700 ? `16px` : `18px`}
              >
                <Text>Do you agree to the terms of our Student Rules?</Text>
                <Text>
                  Please make sure you have read our student rules via the
                  following link.*
                </Text>
              </Wrapper>
              <Wrapper>
                <SpanText
                  fontSize={`16px`}
                  margin={`42px 0 28px`}
                  textDecoration={"underline"}
                >
                  https://drive.google.com/file/d/14ccUCUmYMGk04y-4NF3TK5qP8Vvgc_02/view?usp=sharing
                </SpanText>

                <CustomCheckBox2
                  checked={agreeCheck}
                  onChange={agreeCheckToggle}
                >
                  Yes, I agree
                </CustomCheckBox2>
              </Wrapper>

              <Wrapper al={`flex-start`}>
                <Text
                  fontSize={`18px`}
                  fontWeight={`bold`}
                  margin={`48px 0 10px`}
                  lineHeight={`1.22`}
                >
                  Do you have any other questions or comments about our program?
                </Text>
                <Form.Item name="question">
                  <TextArea width={`100%`} />
                </Form.Item>
              </Wrapper>

              <Wrapper margin={`12px 0 0`}>
                <CommonButton
                  width={`121px`}
                  height={`34px`}
                  radius={`5px`}
                  htmlType="submit"
                >
                  submission
                </CommonButton>
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

export default Application;
