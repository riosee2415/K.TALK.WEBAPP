import React, { useState, useCallback } from "react";
import { Menu, Switch } from "antd";
import {
  InfoCircleOutlined,
  AppstoreOutlined,
  SettingOutlined,
  BarChartOutlined,
  UserOutlined,
  BookOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { CURRENT_ADMINMENU_STATUS } from "../../reducers/user";
import { Wrapper, Image } from "../commonComponents";

const { SubMenu } = Menu;
const MenuName = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

const AdminMenu = () => {
  const { currentAdminMenu, me } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const router = useRouter();

  const [mode, setMode] = useState(`dark`);

  const [current, setCurrent] = useState(`1`);

  const clickAction = useCallback((e) => {
    // console.log("click", e);

    router.replace(e.key);
    setCurrent(e.key);
  }, []);

  const titleClickHandler = useCallback(
    (key) => () => {
      dispatch({
        type: CURRENT_ADMINMENU_STATUS,
        data: { key },
      });
    },
    [currentAdminMenu]
  );

  return (
    <>
      <Menu
        theme={mode}
        onClick={clickAction}
        style={{ width: `100%` }}
        defaultOpenKeys={currentAdminMenu}
        selectedKeys={[current]}
        mode="inline"
        selectedKeys={router.pathname}
        disabled={false}
      >
        <Wrapper margin={`20px 0 10px`}>
          <Image
            alt="logo"
            src={`https://firebasestorage.googleapis.com/v0/b/storage-4leaf.appspot.com/o/4leaf%2Flogo%2Ffavicon.ico?alt=media&token=22fe389b-44d2-45c2-8735-2baf77e55651`}
            width={`50px`}
            height={`50px`}
            radius={`100%`}
          />
        </Wrapper>
        <Wrapper height={`30px`} fontSize={`0.8rem`}>
          {me && me.nickname}
        </Wrapper>
        <Wrapper height={`30px`} fontSize={`0.8rem`} margin={`0 0 20px`}>
          {me &&
            (parseInt(me.level) === 5
              ? `개발사`
              : parseInt(me.level) === 4
              ? `최고관리자`
              : parseInt(me.level) === 3
              ? `운영자`
              : ``)}
        </Wrapper>
        <Menu.Item key="/admin">
          <MenuName>관리자 메인</MenuName>
        </Menu.Item>
        <SubMenu
          key="sub1"
          icon={<BarChartOutlined />}
          title="접속자 관리"
          onTitleClick={titleClickHandler("sub1")}
        >
          <Menu.Item key="/admin/logs/acceptLogs">
            <MenuName>접속자 통계</MenuName>
          </Menu.Item>
        </SubMenu>
        <SubMenu
          key="sub2"
          icon={<InfoCircleOutlined />}
          title="기초 관리"
          onTitleClick={titleClickHandler("sub2")}
        >
          <Menu.Item key="/admin/info/businessInformation">
            <MenuName>사업자정보 관리</MenuName>
          </Menu.Item>
          <Menu.Item key="/admin/info/popup">
            <MenuName>팝업 관리</MenuName>
          </Menu.Item>

          {/* <SubMenu key="sub3" title="Submenu">
            <Menu.Item key="7">Option 7</Menu.Item>
            <Menu.Item key="8">Option 8</Menu.Item>
          </SubMenu> */}
        </SubMenu>
        <SubMenu
          key="sub3"
          icon={<BookOutlined />}
          title="게시판 관리"
          onTitleClick={titleClickHandler("sub3")}
        >
          <Menu.Item key="/admin/board/notice/list">
            <MenuName>공지사항 관리</MenuName>
          </Menu.Item>
          <Menu.Item key="/admin/board/gallery/list">
            <MenuName>갤러리 관리</MenuName>
          </Menu.Item>
        </SubMenu>
        <SubMenu
          key="su43"
          icon={<SettingOutlined />}
          title="베너 관리"
          onTitleClick={titleClickHandler("sub4")}
        >
          <Menu.Item key="/admin/banner/mainbanner">
            <MenuName>메인베너 관리</MenuName>
          </Menu.Item>
        </SubMenu>
        <SubMenu
          key="sub5"
          icon={<UserOutlined />}
          title="회원 관리"
          onTitleClick={titleClickHandler("sub5")}
        >
          <Menu.Item key="/admin/user/userList">
            <MenuName>회원 리스트</MenuName>
          </Menu.Item>
        </SubMenu>
        <SubMenu
          key="sub6"
          icon={<PhoneOutlined />}
          title="문의 관리"
          onTitleClick={titleClickHandler("sub6")}
        >
          <Menu.Item key="/admin/question/type">
            <MenuName>문의 유형 리스트</MenuName>
          </Menu.Item>
          <Menu.Item key="/admin/question/list">
            <MenuName>문의 리스트</MenuName>
          </Menu.Item>
        </SubMenu>
        <SubMenu
          key="sub7"
          icon={<SettingOutlined />}
          title="환경 설정"
          onTitleClick={titleClickHandler("sub7")}
        >
          <Menu.Item key="/admin/envv/seo">
            <MenuName>SEO 설정</MenuName>
          </Menu.Item>
        </SubMenu>
      </Menu>
    </>
  );
};

export default AdminMenu;
