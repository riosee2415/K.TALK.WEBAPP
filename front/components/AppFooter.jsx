import React from "react";
import {
  Wrapper,
  Text,
  Image,
  WholeWrapper,
  RsWrapper,
} from "./commonComponents";
import Theme from "./Theme";
import useWidth from "../hooks/useWidth";
import { MailOutlined } from "@ant-design/icons";

const AppFooter = () => {
  const width = useWidth();
  return (
    <WholeWrapper>
      <Wrapper bgColor={Theme.subTheme10_C} height={`70px`}>
        <RsWrapper dr={`row`} ju={`flex-end`}>
          <a href={``} target="_blank">
            <Image
              alt="twitter"
              src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/footer/icon_twitter.png`}
              width={`30px`}
              margin={`0 16px 0 0`}
            />
          </a>
          <a href={`https://www.facebook.com/KtalkLive`} target="_blank">
            <Image
              alt="face"
              src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/footer/icon_face-book.png`}
              width={`30px`}
              margin={`0 16px 0 0`}
            />
          </a>
          <a href={`https://www.instagram.com/ktalk_live/`} target="_blank">
            <Image
              alt="insta"
              src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/footer/icon_insta.png`}
              width={`30px`}
              margin={`0 16px 0 0`}
            />
          </a>
          <a href={``} target="_blank">
            <Image
              alt="youtube"
              src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/footer/icon_youtube.png`}
              width={`30px`}
              margin={`0 16px 0 0`}
            />
          </a>
        </RsWrapper>
      </Wrapper>
      <Wrapper
        bgColor={Theme.subTheme15_C}
        padding={`45px 0`}
        color={Theme.white_C}
      >
        <RsWrapper dr={`row`} ju={`space-between`}>
          <Wrapper width={`auto`} al={`flex-start`}>
            <Image
              alt="logo"
              src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/footer/logo_footer_typo.png`}
              width={`128px`}
            />
            <Text fontSize={`12px`} margin={`5px 0 0`} fontWeight={`bold`}>
              Powered by Jeju Korean Language Center
            </Text>
            <Text fontSize={`12px`} margin={`20px 0 0`}>
              Original page : jejuklc.com
            </Text>
            <Wrapper dr={`row`} ju={`flex-start`}>
              <Text fontSize={`12px`} margin={`0 5px 0 0`}>
                More information : jklc.ktalk@gmail.com
              </Text>
              <a href={`mailto:jklc.ktalk@gmail.com`}>
                <MailOutlined />
              </a>
            </Wrapper>
            <Text
              margin={width < 800 ? `20px 0` : `20px 0 0`}
              fontSize={width < 800 ? `10px` : `14px`}
            >
              Copyright 2021. Ktalklive inc. all rights reserved. By K-talk Live
              Co., Ltd.
            </Text>
          </Wrapper>
          <Image
            alt="logo"
            src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/footer/logo_footer_symbol.png`}
            width={width < 800 ? `100px` : `140px`}
          />
        </RsWrapper>
      </Wrapper>
      <Wrapper bgColor={Theme.subTheme10_C} height={`70px`}></Wrapper>
    </WholeWrapper>
  );
};

export default AppFooter;
