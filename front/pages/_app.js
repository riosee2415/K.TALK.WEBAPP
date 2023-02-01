import React, { useCallback, useEffect, useState } from "react";
import Head from "next/head";
import PropTypes from "prop-types";
import "antd/dist/antd.css";
import { ThemeProvider } from "styled-components";
import Theme from "../components/Theme";
import GlobalStyles from "../components/GlobalStyles";
import wrapper from "../store/configureStore";

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

        {/* <React.Fragment>
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-K973KPX');`,
            }}
          />
        </React.Fragment> */}

        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-K973KPX"
            height="0"
            width="0"
            style="display:none;visibility:hidden"
          ></iframe>
        </noscript>

        <meta
          name="naver-site-verification"
          content="d4cad9c4e35a023815c85b4348e963859570b5d5"
        />

        <meta
          name="google-site-verification"
          content="ieJNDE7Fp58-b2Tw6h_v1LGw0ODlkCO-tpkjc822_J8"
        />

        <React.Fragment>
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
          />
          <noscript
            dangerouslySetInnerHTML={{
              __html: `<img height="1" width="1" style="display:none"
      src="https://www.facebook.com/tr?id=483937212685511&ev=PageView&noscript=1" />`,
            }}
          />
        </React.Fragment>

        <React.Fragment>
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                        })(window,document,'script','dataLayer','GTM-T94NWTW');`,
            }}
          />

          <noscript
            dangerouslySetInnerHTML={{
              __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-T94NWTW"
              height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
            }}
          />
        </React.Fragment>

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
      </Head>
      <Component />
    </ThemeProvider>
  );
};
Fourleaf.propTypes = {
  Component: PropTypes.elementType.isRequired,
};

export default wrapper.withRedux(Fourleaf);
