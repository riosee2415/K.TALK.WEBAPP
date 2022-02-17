import React, { useCallback, useEffect, useState } from "react";
import Head from "next/head";
import PropTypes from "prop-types";
import "antd/dist/antd.css";
import { ThemeProvider } from "styled-components";
import Theme from "../components/Theme";
import GlobalStyles from "../components/GlobalStyles";
import wrapper from "../store/configureStore";
import WidthProvider from "../components/WidthProvider";

const Fourleaf = ({ Component }) => {
  return (
    <ThemeProvider theme={Theme}>
      <GlobalStyles />
      <Head>
        <title>[[**4LEAF GEAR SAMPLE**]]</title>

        <meta name="author" content="4LEAF SOFTWARE <4leaf.ysh@gmail.com>" />
        {/* <!-- OG tag  --> */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.sample.com/" />
        <meta property="og:image:width" content="800" />
        <meta property="og:image:height" content="400" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="canonical" href="https://www.sample.com" />
      </Head>
      <Component />
    </ThemeProvider>
  );
};
Fourleaf.propTypes = {
  Component: PropTypes.elementType.isRequired,
};

export default wrapper.withRedux(Fourleaf);
