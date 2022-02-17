import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";
import { Row, Col } from "antd";
import AdminMenu from "./admin/AdminMenu";
import styled from "styled-components";

const AdminCol = styled(Col)`
  height: 100vh;

  & .ant-menu-inline {
    height: 100%;
  }
`;

const AdminCol2 = styled(Col)`
  height: 100vh;
  overflow: auto;
`;

const AdminLayout = ({ children }) => {
  return (
    <Row>
      <AdminCol span={3}>
        <AdminMenu />
      </AdminCol>
      <AdminCol2 span={21}>{children}</AdminCol2>
    </Row>
  );
};

AdminLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AdminLayout;
