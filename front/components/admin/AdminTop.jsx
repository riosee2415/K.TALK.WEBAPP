import React from "react";
import { Row, Col } from "antd";
import styled from "styled-components";
import { PlusCircleOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";

const TopCol = styled(Col)`
  margin: 10px 0;
  padding: 0 20px;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

const IconBox = styled.div`
  margin: 0px 0px 0px 10px;
`;

const CreateIcon = styled(PlusCircleOutlined)`
  font-size: 24px;
  color: #12f;
`;

const AdminTop = ({
  createButton,
  createButtonAction,
  //
}) => {
  return (
    <Row>
      <TopCol span={24}>
        {createButton && (
          <IconBox>
            <CreateIcon onClick={createButtonAction} />
          </IconBox>
        )}
      </TopCol>
    </Row>
  );
};

AdminTop.propTypes = {
  createButton: PropTypes.bool,
  createButtonAction: PropTypes.func,
};

export default AdminTop;
