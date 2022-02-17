import React, { useState, useEffect, useCallback } from "react";
import {
  RowWrapper,
  ColWrapper,
  CommonButton,
  Image,
  ATag,
} from "./commonComponents";
import { withResizeDetector } from "react-resize-detector";
import styled from "styled-components";
import Theme from "./Theme";
import { AlignRightOutlined } from "@ant-design/icons";
import { Drawer } from "antd";
import Link from "next/link";

const WebRow = styled(RowWrapper)`
  background: transparent;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10000;
  transition: 0.5s;

  &.background {
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(3px);
  }

  @media (max-width: 700px) {
    display: none;
  }
`;

const MobileRow = styled(RowWrapper)`
  display: none;

  background: transparent;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10000;
  transition: 0.5s;
  padding: 10px 0;

  &.background {
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(3px);
  }

  @media (max-width: 700px) {
    display: flex;
  }
`;

const MenuCol = styled(ColWrapper)`
  color: ${Theme.white_C};
  width: 170px;
  height: 60px;
  background: transparent;
  cursor: pointer;
  transition: 0.5s;
  font-weight: 700;
  position: relative;

  & .submenu {
    display: none;
  }

  &:hover {
    background: ${Theme.white_C};
    color: ${Theme.black_C};
    & .submenu {
      display: flex;
    }
  }
`;

const SubMenuCol = styled(ColWrapper)`
  position: absolute;
  width: 100%;
  height: auto;
  background: ${Theme.black_C};
  padding: 10px 30px;
  text-align: center;
  top: 60px;
`;

const SubMenuTextCol = styled(ColWrapper)`
  color: ${Theme.white_C};
  font-weight: 300;
  position: relative;
  padding: 10px 0 3px;

  &:before {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 1px;
    background: ${Theme.white_C};
    transition: 0.5s;
  }

  &:hover {
    font-weight: 700;
    &:before {
      width: 100%;
    }
  }
`;

const AppHeader = ({ children, width }) => {
  ////////////// - USE STATE- ///////////////
  const [headerScroll, setHeaderScroll] = useState(false);
  const [pageY, setPageY] = useState(0);
  // const documentRef = useRef(document);

  const [drawar, setDrawar] = useState(false);
  const [subMenu, setSubMenu] = useState(``);

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
    <>
      <WebRow
        justify={`center`}
        position={`fixed`}
        top={`0`}
        left={`0`}
        index={`10000`}
        className={headerScroll && "background"}
      >
        <ColWrapper span={20}>
          {/* web */}
          <ColWrapper>
            <ColWrapper width={`100%`} padding={`10px 0`}>
              <ATag href="/">
                <Image
                  width={`100px`}
                  src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/SOUL/assets/images/logo/soul_logo.png`}
                />
              </ATag>
            </ColWrapper>

            <RowWrapper justify={`center`}>
              <MenuCol>
                한의원 소개
                <ATag href="about">
                  <SubMenuCol className="submenu">
                    <SubMenuTextCol>의료진 소개 및 진료 시간표</SubMenuTextCol>
                  </SubMenuCol>
                </ATag>
              </MenuCol>
              <MenuCol>
                <Link href="/diagnosis?type=0">진료 과목</Link>
                <SubMenuCol className="submenu">
                  <SubMenuTextCol>
                    <Link href="/diagnosis?type=1">체질 의학</Link>
                  </SubMenuTextCol>
                  <SubMenuTextCol>
                    <Link href="/diagnosis?type=2">소울 다이어트</Link>
                  </SubMenuTextCol>
                  <SubMenuTextCol>
                    <Link href="/diagnosis?type=3">만성 난치 클리닉</Link>
                  </SubMenuTextCol>
                  <SubMenuTextCol>
                    <Link href="/diagnosis?type=4">통증 클리닉</Link>
                  </SubMenuTextCol>
                </SubMenuCol>
              </MenuCol>
              <ATag width={`auto`} href="/notice">
                <MenuCol>공지사항</MenuCol>
              </ATag>
              <ATag width={`auto`} href="location">
                <MenuCol>오시는 길</MenuCol>
              </ATag>
            </RowWrapper>
          </ColWrapper>
        </ColWrapper>
      </WebRow>
      {/* mobile */}
      <MobileRow justify={`center`} className={headerScroll && "background"}>
        <ColWrapper span={11} al={`flex-start`}>
          <ATag width={`auto`} href="/">
            <Image
              width={`110px`}
              src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/SOUL/assets/images/logo/logo_long_white.png`}
            />
          </ATag>
        </ColWrapper>
        <ColWrapper
          span={11}
          al={`flex-end`}
          fontSize={`2rem`}
          color={Theme.white_C}
        >
          <AlignRightOutlined onClick={drawarToggle} />
        </ColWrapper>

        {drawar && (
          <Drawer
            placement="right"
            closable={true}
            onClose={drawarToggle}
            visible={drawarToggle}
            getContainer={false}
          >
            <ColWrapper al={`flex-start`}>
              <ColWrapper
                fontSize={`1.2rem`}
                onClick={() => {
                  setSubMenu(0);
                }}
              >
                한의원 소개
              </ColWrapper>
              {subMenu === 0 && (
                <>
                  <ATag href="about" width={`auto`} color={`initial`}>
                    <ColWrapper margin={`5px 10px 20px`}>
                      의료진 소개 및 진료 시간표
                    </ColWrapper>
                  </ATag>
                </>
              )}
              <ColWrapper
                fontSize={`1.2rem`}
                onClick={() => {
                  setSubMenu(1);
                }}
              >
                진료 과목
              </ColWrapper>
              {subMenu === 1 && (
                <>
                  <ColWrapper margin={`5px 10px 0`}>
                    <Link href="/diagnosis?type=1">체질 의학</Link>
                  </ColWrapper>

                  <ColWrapper margin={`5px 10px 0`}>
                    <Link href="/diagnosis?type=2">소울 다이어트</Link>
                  </ColWrapper>
                  <ColWrapper margin={`5px 10px 0`}>
                    <Link href="/diagnosis?type=3">만성 난치 클리닉</Link>
                  </ColWrapper>
                  <ColWrapper margin={`5px 10px 20px`}>
                    <Link href="/diagnosis?type=4">통증 클리닉</Link>
                  </ColWrapper>
                </>
              )}
              <ATag width={`auto`} href="notice" color={`initial`}>
                <ColWrapper
                  fontSize={`1.2rem`}
                  onClick={() => {
                    setSubMenu(2);
                  }}
                >
                  공지사항
                </ColWrapper>
              </ATag>
              <ATag href="location" width={`auto`} color={`initial`}>
                <ColWrapper
                  fontSize={`1.2rem`}
                  onClick={() => {
                    setSubMenu(3);
                  }}
                >
                  오시는 길
                </ColWrapper>
              </ATag>
            </ColWrapper>
          </Drawer>
        )}
      </MobileRow>
    </>
  );
};

export default withResizeDetector(AppHeader);
