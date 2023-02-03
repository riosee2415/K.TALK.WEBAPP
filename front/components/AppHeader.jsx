import React, { useState, useEffect, useCallback } from "react";
import {
  Wrapper,
  WholeWrapper,
  RsWrapper,
  Image,
  TextInput,
  CommonButton,
  Text,
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

  // 스크롤 이동
  const scrollMoveHandler = useCallback((type) => {
    const element = document.getElementById(type);
    element.scrollIntoView({ behavior: "smooth" });
  }, []);

  ////////////// - USE EFFECT- //////////////
  useEffect(() => {
    document.addEventListener("scroll", handleScroll);
    return () => document.removeEventListener("scroll", handleScroll);
  }, [pageY]);

  useEffect(() => {
    if (st_loginDone && me) {
      if (me.level >= 3) {
        return;
      }
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
      height={width < 900 ? `auto` : `72px`}
      padding={width < 900 && `10px 0`}
      bgColor={Theme.lightGrey4_C}
      position={`fixed`}
      top={`0`}
      left={`0`}
      zIndex={`100`}
    >
      <Wrapper dr={`row`} ju={`flex-start`} padding={`0 30px`}>
        <Image
          alt="logo"
          width={width < 800 ? `130px` : `180px`}
          margin={width < 900 ? `0 0 10px` : `0`}
          src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/logo/logo.png`}
          cursor={`pointer`}
          onClick={() => moveLinkHandler(`/`)}
        />
        <Wrapper width={`auto`} dr={`row`}>
          {me && me ? (
            <Wrapper dr={`row`}>
              <CommonButton
                radius={`50px`}
                onClick={() => onClickHandler(me.level)}
                height={width < 700 ? `30px` : `50px`}
                width={width < 700 ? `auto` : `110px`}
                fontSize={width < 700 && `11px`}
                margin={`0 10px 0 0`}
              >
                My page
              </CommonButton>
              <CommonButton
                radius={`50px`}
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
              <Wrapper
                width={`2px`}
                height={`18px`}
                margin={`0 65px`}
                bgColor={Theme.darkGrey_C}
              ></Wrapper>
              <Text
                isHover
                fontWeight={`bold`}
                margin={`0 70px 0 0`}
                onClick={() => scrollMoveHandler("stu")}
              >
                STUDENTS’ REVIEW
              </Text>
              <Text
                isHover
                fontWeight={`bold`}
                margin={`0 70px 0 0`}
                onClick={() => scrollMoveHandler("what")}
              >
                WHAT IS K-TALK LIVE?
              </Text>
              <Text
                isHover
                fontWeight={`bold`}
                margin={`0 150px 0 0`}
                onClick={() => scrollMoveHandler("tutor")}
              >
                TUTORS
              </Text>
              ID
              <TextInput
                type={`text`}
                width={`185px`}
                height={`30px`}
                radius={`5px`}
                placeholder={`ID`}
                margin={`0 60px 0 20px`}
                {...inputId}
                onKeyDown={(e) => e.keyCode === 13 && loginHandler()}
              />
              PW
              <TextInput
                type={`password`}
                width={`185px`}
                height={`30px`}
                radius={`5px`}
                margin={`0 45px 0 20px`}
                placeholder={`PW`}
                {...inputPw}
                onKeyDown={(e) => e.keyCode === 13 && loginHandler()}
              />
              <CommonButton
                radius={`10px`}
                onClick={() => loginHandler()}
                height={`30px`}
                width={`65px`}
                padding={`0`}
                fontSize={width < 700 && `11px`}
              >
                LOGIN
              </CommonButton>
            </>
          )}
        </Wrapper>
      </Wrapper>
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
