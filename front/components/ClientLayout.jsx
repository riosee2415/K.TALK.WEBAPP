import React, { useState, useCallback, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Row, Col, Drawer } from "antd";
import Link from "next/link";
import { withResizeDetector } from "react-resize-detector";
import { AlignRightOutlined } from "@ant-design/icons";
import AppHeader from "./AppHeader";
import AppFooter from "./AppFooter";

const ClientLayout = ({ children, width }) => {
  return (
    <section>
      {/* HEADER */}
      <AppHeader />

      {/* <MobileCol >
        <CustomRow justify={`space-between`} margin={`10px`}>
          <Col span={5}>
            <img
              width={`100%`}
              src={`https://firebasestorage.googleapis.com/v0/b/storage-4leaf.appspot.com/o/SOUL%2Fassets%2Fimages%2Flogo%2Fsoul_logo.png?alt=media&token=2cfae161-5462-4687-b5ed-d7ee85755b7a`}
            />
          </Col>
          <Col span={2}>
            <AlignRightOutlined onClick={drawarToggle} />
          </Col>
        </CustomRow>
      </MobileCol>

      */}

      {/* content */}
      <Row>
        <Col span={0}>LEFT</Col>
        <Col span={24}>{children}</Col>
        <Col span={0}>RIGHT</Col>
      </Row>

      {/* Footer */}

      <AppFooter />
    </section>
  );
};

ClientLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default withResizeDetector(ClientLayout);
