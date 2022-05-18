import { createGlobalStyle, css } from "styled-components";

const fontStyle = css`
  @import url(http://fonts.googleapis.com/earlyaccess/notosanskr.css);
`;

const GlobalStyles = createGlobalStyle`
  ${fontStyle}

  body {
    font-family: 'Noto Sans KR', sans-serif;
  }

  a {
    color : inherit;
    text-decoration : none;
  }

  textarea {
    resize: none;
    outline: none;
  }

  input {
    outline: none;
  }
  
  a:hover {
    color : inherit;
  }
  
  .ant-modal-header{
    background:${(props) => props.theme.subTheme7_C};
    color:${(props) => props.theme.white_C};
  }

  .ant-modal-title, .ant-modal-close{
    color:${(props) => props.theme.white_C};
  }

  @media (max-width : 576px) {
    html { 
      font-size : 14px;
    }
  }
`;

export default GlobalStyles;
