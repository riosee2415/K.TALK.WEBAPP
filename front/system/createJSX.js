const fs = require("fs");
const args = process.argv.slice(2);

let folderTree = "./pages/";

const newFilename = args[args.length - 1] + ".jsx";

let upperFilename = args[args.length - 1];

let exExeFilename = upperFilename.substring(0, 1).toUpperCase();
exExeFilename += String(
  upperFilename.substring(1, args[args.length - 1].length)
).toLowerCase();

args.map((v, idx) => {
  if (idx !== args.length - 1) {
    folderTree += `${v}/`;
  }
});

let tempTree = "./pages/";

if (folderTree.split("/").length - 1 > 3) {
  console.log("🍀 This Work Try More Folder Tree Then Make New Folder. 🍀");

  const startIdx = 2;
  const lastIndex = folderTree.split("/").length - 2;

  for (let i = startIdx; i <= lastIndex; i++) {
    tempTree += folderTree.split("/")[i] + "/";

    try {
      fs.accessSync(`${tempTree}/`);
    } catch (error) {
      fs.mkdirSync(`${tempTree}/`);
    }
  }
} else {
  try {
    fs.accessSync(folderTree);
  } catch (error) {
    fs.mkdirSync(folderTree);
  }
}

let prevPath = "";

for (let i = 0; i < args.length; i++) {
  prevPath += "../";
}

fs.writeFile(
  folderTree + newFilename,
  `
import React, { useEffect } from "react";
import ClientLayout from "${prevPath}components/ClientLayout";
import { useDispatch, useSelector } from "react-redux";

import wrapper from "${prevPath}store/configureStore";
import { END } from "redux-saga";
import useWidth from "${prevPath}hooks/useWidth";
import useInput from "${prevPath}hooks/useInput";
import Theme from "${prevPath}components/Theme";
import styled from "styled-components";
import axios from "axios";

import { LOAD_MY_INFO_REQUEST } from "${prevPath}reducers/user";
import { SEO_LIST_REQUEST } from "${prevPath}reducers/seo";

import Head from "next/head";

const ${exExeFilename} = () => {
  ////// GLOBAL STATE //////
  const { seo_keywords, seo_desc, seo_ogImage, seo_title } = useSelector(
    (state) => state.seo
  );

  ////// HOOKS //////
  ////// REDUX //////
  ////// USEEFFECT //////
  ////// TOGGLE //////
  ////// HANDLER //////
  ////// DATAVIEW //////

  return (
    <>
    <Head>
      <title>{seo_title.length < 1 ? "ALAL" : seo_title[0].content}</title>

      <meta
        name="subject"
        content={seo_title.length < 1 ? "ALAL" : seo_title[0].content}
      />
      <meta
        name="title"
        content={seo_title.length < 1 ? "ALAL" : seo_title[0].content}
      />
      <meta name="keywords" content={seo_keywords} />
      <meta
        name="description"
        content={
          seo_desc.length < 1 ? "undefined description" : seo_desc[0].content
        }
      />
      {/* <!-- OG tag  --> */}
      <meta
        property="og:title"
        content={seo_title.length < 1 ? "ALAL" : seo_title[0].content}
      />
      <meta
        property="og:site_name"
        content={seo_title.length < 1 ? "ALAL" : seo_title[0].content}
      />
      <meta
        property="og:description"
        content={
          seo_desc.length < 1 ? "undefined description" : seo_desc[0].content
        }
      />
      <meta property="og:keywords" content={seo_keywords} />
      <meta
        property="og:image"
        content={seo_ogImage.length < 1 ? "" : seo_ogImage[0].content}
      />
    </Head>

      <ClientLayout>
        <h4>4LEAF SOFTWARE NEW NEXT.JS PAGE</h4>
        <h4>Have A Good Development.</h4>

        <h5>개발환경 문의) 개발본부 CTO 윤상호</h5>
        <h5>개발환경 문의) 개발2팀 팀장 서재완</h5>
      </ClientLayout>
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  async (context) => {
    // SSR Cookie Settings For Data Load/////////////////////////////////////
    const cookie = context.req ? context.req.headers.cookie : "";
    axios.defaults.headers.Cookie = "";
    if (context.req && cookie) {
      axios.defaults.headers.Cookie = cookie;
    }
    ////////////////////////////////////////////////////////////////////////
    // 구현부

    context.store.dispatch({
      type: LOAD_MY_INFO_REQUEST,
    });

    context.store.dispatch({
      type: SEO_LIST_REQUEST,
    });

    // 구현부 종료
    context.store.dispatch(END);
    console.log("🍀 SERVER SIDE PROPS END");
    await context.store.sagaTask.toPromise();
  }
);

export default ${exExeFilename};

  `,
  function (err) {
    if (err === null) {
      console.log("🍀 4LEAF SOFTWARE - DEV ENV - COMMAND SYSTEM CLEAR RUN!");
    } else {
      console.log(err);
      console.log("fail");
    }
  }
);
