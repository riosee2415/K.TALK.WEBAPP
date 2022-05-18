import React, { useState, useEffect, useCallback } from "react";
import {
  Wrapper,
  WholeWrapper,
  RsWrapper,
  Image,
  TextInput,
  CommonButton,
} from "./commonComponents";
import { withResizeDetector } from "react-resize-detector";
import styled from "styled-components";
import Theme from "./Theme";
import { Drawer, message } from "antd";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import useInput from "../hooks/useInput";
import {
  LOAD_MY_INFO_REQUEST,
  LOGIN_REQUEST,
  LOGOUT_REQUEST,
} from "../reducers/user";
import { useRouter } from "next/router";
import wrapper from "../store/configureStore";
import axios from "axios";
import { SEO_LIST_REQUEST } from "../reducers/seo";

const AppHeader = ({ width }) => {
  ////////////// - USE STATE- ///////////////

  const { me, st_loginDone, st_loginError, st_logoutDone, st_logoutError } =
    useSelector((state) => state.user);

  const [headerScroll, setHeaderScroll] = useState(false);
  const [pageY, setPageY] = useState(0);
  // const documentRef = useRef(document);

  const dispatch = useDispatch();
  const router = useRouter();

  const [drawar, setDrawar] = useState(false);

  const inputId = useInput("");
  const inputPw = useInput("");

  ///////////// - EVENT HANDLER- ////////////

  const drawarToggle = useCallback(() => {
    setDrawar(!drawar);
  });

  const handleScroll = useCallback(() => {
    const { pageYOffset } = window;
    const deltaY = pageYOffset - pageY;
    const headerScroll = pageY && pageYOffset !== 0 && pageYOffset !== pageY;
    setHeaderScroll(headerScroll);
    setPageY(pageYOffset);
  });

  const loginHandler = useCallback(() => {
    if (!inputId.value || inputId.value.trim() === "") {
      return message.error("아이디를 입력해주세요.");
    }

    if (!inputPw.value || inputPw.value.trim() === "") {
      return message.error("비밀번호를 입력해주세요.");
    }

    dispatch({
      type: LOGIN_REQUEST,
      data: {
        userId: inputId.value,
        password: inputPw.value,
      },
    });
  }, [inputId.value, inputPw.value]);

  const logoutHandler = useCallback(() => {
    dispatch({
      type: LOGOUT_REQUEST,
    });
  }, []);

  const moveLinkHandler = useCallback((link) => {
    router.push(link);
  }, []);

  const onClickHandler = useCallback((data) => {
    data === 1
      ? moveLinkHandler("/student")
      : data === 2
      ? moveLinkHandler("/teacher")
      : message.error("회원 또는 강사가 아닙니다.");
  }, []);

  ////////////// - USE EFFECT- //////////////
  useEffect(() => {
    document.addEventListener("scroll", handleScroll);
    return () => document.removeEventListener("scroll", handleScroll);
  }, [pageY]);

  useEffect(() => {
    if (st_loginDone && me) {
      moveLinkHandler(
        me.level === 1
          ? "/student"
          : me.level === 2
          ? "/teacher"
          : message.error("회원 또는 강사가 아닙니다.")
      );
      return message.success("로그인을 성공하셨습니다.");
    }
  }, [st_loginDone, me]);

  useEffect(() => {
    if (st_loginError) {
      return message.error(st_loginError);
    }
  }, [st_loginError]);

  useEffect(() => {
    if (st_logoutDone) {
      dispatch({
        type: LOAD_MY_INFO_REQUEST,
      });
    }
  }, [st_logoutDone]);

  useEffect(() => {
    if (st_logoutError) {
      return message.error(st_logoutError);
    }
  }, [st_logoutError]);

  return (
    <WholeWrapper
      height={width < 900 ? `auto` : `100px`}
      padding={width < 900 && `10px 0`}
      bgColor={Theme.white_C}
      position={`fixed`}
      top={`0`}
      left={`0`}
      zIndex={`100`}
    >
      <RsWrapper>
        <Wrapper dr={`row`} ju={`space-between`}>
          <Image
            alt="logo"
            width={width < 800 ? `130px` : `250px`}
            margin={width < 900 ? `0 0 10px` : `0`}
            src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/logo/logo.png`}
            cursor={`pointer`}
            onClick={() => moveLinkHandler(`/`)}
          />
          <Wrapper width={`auto`} dr={`row`}>
            {me && me ? (
              <Wrapper dr={`row`}>
                <CommonButton
                  onClick={() => onClickHandler(me.level)}
                  height={width < 700 ? `30px` : `50px`}
                  width={width < 700 ? `auto` : `110px`}
                  fontSize={width < 700 && `11px`}
                  margin={`0 10px 0 0`}
                >
                  My page
                </CommonButton>
                <CommonButton
                  onClick={() => logoutHandler()}
                  height={width < 700 ? `30px` : `50px`}
                  width={width < 700 ? `auto` : `110px`}
                  fontSize={width < 700 && `11px`}
                >
                  Log-out
                </CommonButton>
              </Wrapper>
            ) : (
              <>
                <TextInput
                  type={`text`}
                  width={
                    width < 1100 ? (width < 700 ? `140px` : `250px`) : `300px`
                  }
                  height={width < 700 ? `30px` : `50px`}
                  radius={`25px`}
                  placeholder={`ID`}
                  {...inputId}
                  onKeyDown={(e) => e.keyCode === 13 && loginHandler()}
                />
                <TextInput
                  type={`password`}
                  width={
                    width < 1100 ? (width < 700 ? `140px` : `250px`) : `300px`
                  }
                  height={width < 700 ? `30px` : `50px`}
                  radius={`25px`}
                  margin={width < 700 ? `0 5px` : `0 10px`}
                  placeholder={`PW`}
                  {...inputPw}
                  onKeyDown={(e) => e.keyCode === 13 && loginHandler()}
                />

                <CommonButton
                  onClick={() => loginHandler()}
                  height={width < 700 ? `30px` : `50px`}
                  width={width < 700 ? `auto` : `110px`}
                  fontSize={width < 700 && `11px`}
                >
                  LOGIN
                </CommonButton>
              </>
            )}
          </Wrapper>
        </Wrapper>
      </RsWrapper>
    </WholeWrapper>
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

export default withResizeDetector(AppHeader);
