import React, { useCallback, useEffect, useState } from "react";
import Router from "next/router";
import { Input, Button, Form } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import useInput from "../../hooks/useInput";
import { useDispatch, useSelector } from "react-redux";
import { SIGNUP_REQUEST } from "../../reducers/user";
import ClientLayout from "../../components/ClientLayout";
import { SEO_LIST_REQUEST } from "../../reducers/seo";
import Head from "next/head";
import wrapper from "../../store/configureStore";
import { LOAD_MY_INFO_REQUEST } from "../../reducers/user";
import axios from "axios";
import { END } from "redux-saga";

const SignUp = () => {
  ////// GLOBAL STATE //////
  const { seo_keywords, seo_desc, seo_ogImage, seo_title } = useSelector(
    (state) => state.seo
  );
  ////// HOOKS //////
  const dispatch = useDispatch();

  const email = useInput(``);
  const nickname = useInput(``);

  const password = useInput(``);

  const [passwordCheck, setPasswordCheck] = useState(``);
  const [passwordError, setPasswordError] = useState(false);

  ////// REDUX //////
  const { st_signUpLoading, st_signUpDone } = useSelector(
    (state) => state.user
  );
  ////// USEEFFECT //////
  useEffect(() => {
    if (st_signUpDone) {
      alert("회원가입 성공!");
      Router.replace("/");
    }
  }, [st_signUpDone]);
  ////// TOGGLE //////
  ////// HANDLER //////\

  const checkPasswordChangeHandler = useCallback(
    (e) => {
      setPasswordCheck(e.target.value);
      setPasswordError(e.target.value !== password.value);
    },
    [password.value]
  );

  const onSubmit = useCallback(() => {
    if (password.value !== passwordCheck) {
      alert("비밀번호 확인!");
      return setPasswordError(true);
    }

    dispatch({
      type: SIGNUP_REQUEST,
      data: {
        email: email.value,
        password: password.value,
        nickname: nickname.value,
      },
    });
  }, [email, nickname, password, passwordCheck]);

  ////// DATAVIEW //////

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
        <div>
          <Form onFinish={onSubmit}>
            <div>
              <label>EMAIL</label>
              <Input type="email" required {...email} />
            </div>
            <div>
              <label>NICKNAME</label>
              <Input type="text" required {...nickname} />
            </div>
            <div>
              <label>PASSOWRD</label>
              <Input.Password type="password" required {...password} />
            </div>
            <div>
              <label>RE-PASSWORD</label>
              <Input.Password
                type="password"
                required
                value={passwordCheck}
                onChange={checkPasswordChangeHandler}
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </div>
            <div>{passwordError && <p> 비밀번호가 일치하지 않습니다. </p>}</div>

            <Button type="primary" htmlType="submit" loading={st_signUpLoading}>
              가입하기
            </Button>
          </Form>
        </div>
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

export default SignUp;
