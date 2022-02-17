import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { PageHeader as AdminPageHeader } from "antd";
import styled from "styled-components";

const CustomPageHeader = styled(AdminPageHeader)`
  border-bottom: 1px solid #ededed;
`;

const PageHeader = ({ breadcrumbs, title, subTitle }) => {
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    const nextArray = [];

    breadcrumbs.map((data) => {
      nextArray.push({ breadcrumbName: data });
    });

    setRoutes(nextArray);
  }, []);

  return (
    <CustomPageHeader
      className="site-page-header"
      title={title}
      breadcrumb={{ routes }}
      subTitle={subTitle}
    />
  );
};

PageHeader.propTypes = {
  breadcrumbs: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string.isRequired,
};

export default PageHeader;
