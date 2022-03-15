import React from "react";

import ClientLayout from "../../components/ClientLayout";
import {
  RsWrapper,
  WholeWrapper,
  Wrapper,
} from "../../components/commonComponents";

const Student = () => {
  return (
    <ClientLayout>
      <WholeWrapper margin={`100px 0 0`}>
        <RsWrapper>
          <Wrapper></Wrapper>
        </RsWrapper>
      </WholeWrapper>
    </ClientLayout>
  );
};

export default Student;
