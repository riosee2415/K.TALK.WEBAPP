import React from "react";
import { RowWrapper, ColWrapper, Image } from "./commonComponents";
import Theme from "./Theme";
import styled from "styled-components";

const Logo = styled(Image)`
  width: 200px !important;

  @media (max-width: 700px) {
    width: 150px !important;
    margin-top: 10px;
  }
`;

const AppFooter = () => {
  return (
    <RowWrapper justify={`center`} padding={`30px 0`}>
      <ColWrapper xs={22} sm={20}>
        <RowWrapper justify={`space-between`}>
          <ColWrapper al={`flex-start`}>
            <ColWrapper
              fontSize={`1.1rem`}
              color={Theme.grey_C}
              fontWeight={`bold`}
            >
              부산 동구 Best Total Service
            </ColWrapper>
            <ColWrapper fontSize={`1.1rem`} color={Theme.grey_C}>
              주소 : [48781] 부산광역시 동구 구청로 1(수정동) 대표전화 :
              051-440-4000
            </ColWrapper>
            <ColWrapper fontSize={`0.9rem`} color={Theme.grey_C}>
              Copyright(C) Dong-gu office All Rights Reserved.
            </ColWrapper>
          </ColWrapper>
          <ColWrapper al={`flex-end`} sm={7} xs={24}>
            <Logo
              alt="logo"
              src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/busan-dongu/assets/images/logo/footer_logo.png`}
            />
          </ColWrapper>
        </RowWrapper>
      </ColWrapper>
    </RowWrapper>
  );
};

export default AppFooter;
