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

const AppFooter = () => {
  const width = useWidth();
  return (
    <WholeWrapper
      bgColor={Theme.black_C}
      color={Theme.white_C}
      padding={`55px 0`}
    >
      <RsWrapper dr={`row`} ju={`space-between`} al={`flex-end`}>
        <Wrapper width={`auto`} al={`flex-start`}>
          <Text fontSize={width < 800 ? `16px` : `20px`} fontWeight={`bold`}>
            K-Talk Live
          </Text>
          <Text fontSize={width < 800 ? `15px` : `18px`} fontWeight={`300`}>
            Powered by Jeju Korean Language School
          </Text>
          <Text fontWeight={`300`} margin={`20px 0 0`}>
            Original page : jejuklc.com
          </Text>
          <Text fontWeight={`300`}>
            More information : jklc.ktalk@gmail.com
          </Text>
          <Text
            fontWeight={`300`}
            margin={width < 800 ? `20px 0` : `20px 0 0`}
            fontSize={width < 800 ? `10px` : `14px`}
            color={Theme.grey2_C}
          >
            Copyright 2021. Ktalklive inc. all rights reserved. By 4LEAF
            SOFTWARE
          </Text>
        </Wrapper>
        <Image
          alt="logo"
          src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/logo/logo_footer.png`}
          width={width < 800 ? `100px` : `170px`}
        />
      </RsWrapper>
    </WholeWrapper>
  );
};

export default AppFooter;
