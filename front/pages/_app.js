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
        <title>K-Talk Live | admin</title>

        <meta name="author" content="4LEAF SOFTWARE <4leaf.ysh@gmail.com>" />
        {/* <!-- OG tag  --> */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.ktalklive.com/" />
        <meta property="og:image" content="./og_img.png" />
        <meta property="og:image:width" content="800" />
        <meta property="og:image:height" content="400" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="canonical" href="https://www.ktalklive.com" />

        <script
          dangerouslySetInnerHTML={{
            __html: `(function(d) {
              var config = {
                kitId: 'ynh5igu',
                scriptTimeout: 3000,
                async: true
              },
              h=d.documentElement,t=setTimeout(function(){h.className=h.className.replace(/\bwf-loading\b/g,"")+" wf-inactive";},config.scriptTimeout),tk=d.createElement("script"),f=false,s=d.getElementsByTagName("script")[0],a;h.className+=" wf-loading";tk.src='https://use.typekit.net/'+config.kitId+'.js';tk.async=true;tk.onload=tk.onreadystatechange=function(){a=this.readyState;if(f||a&&a!="complete"&&a!="loaded")return;f=true;clearTimeout(t);try{Typekit.load(config)}catch(e){}};s.parentNode.insertBefore(tk,s)
            })(document);`,
          }}
        ></script>

        <script
          dangerouslySetInnerHTML={{
            __html: `!function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '483937212685511');
          fbq('track', 'PageView');`,
          }}
        ></script>

        <noscript>
          <img
            height="1"
            width="1"
            style="display:none"
            src="https://www.facebook.com/tr?id=483937212685511&ev=PageView&noscript=1"
          />
        </noscript>
      </Head>
      <Component />
    </ThemeProvider>
  );
};
Fourleaf.propTypes = {
  Component: PropTypes.elementType.isRequired,
};

export default wrapper.withRedux(Fourleaf);
