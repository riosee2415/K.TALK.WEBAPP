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
import { Drawer } from "antd";
import Link from "next/link";

const AppHeader = ({ width }) => {
  ////////////// - USE STATE- ///////////////
  const [headerScroll, setHeaderScroll] = useState(false);
  const [pageY, setPageY] = useState(0);
  // const documentRef = useRef(document);

  const [drawar, setDrawar] = useState(false);

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

  ////////////// - USE EFFECT- //////////////
  useEffect(() => {
    document.addEventListener("scroll", handleScroll);
    return () => document.removeEventListener("scroll", handleScroll);
  }, [pageY]);
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
        <Wrapper dr={`row`} ju={width < 900 ? `center` : `space-between`}>
          <Image
            alt="logo"
            width={width < 800 ? `130px` : `250px`}
            margin={width < 900 && `0 0 10px`}
            src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/logo/logo.png`}
          />
          <Wrapper width={`auto`} dr={`row`}>
            <TextInput
              type={`text`}
              width={width < 1100 ? (width < 700 ? `140px` : `250px`) : `300px`}
              height={width < 700 ? `30px` : `50px`}
              radius={`25px`}
              placeholder={`ID`}
            />
            <TextInput
              type={`password`}
              width={width < 1100 ? (width < 700 ? `140px` : `250px`) : `300px`}
              height={width < 700 ? `30px` : `50px`}
              radius={`25px`}
              margin={width < 700 ? `0 5px` : `0 10px`}
              placeholder={`PW`}
            />
            <CommonButton
              height={width < 700 ? `30px` : `50px`}
              width={width < 700 ? `auto` : `110px`}
              fontSize={width < 700 && `11px`}
            >
              LOGIN
            </CommonButton>
          </Wrapper>
        </Wrapper>
      </RsWrapper>
    </WholeWrapper>
  );
};

export default withResizeDetector(AppHeader);
