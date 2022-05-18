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
    color:${(props) => props.theme.white_C} !important;
  }

  .ant-input{
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.15);
    border:none;

    &:focus {
      border: 1px solid ${(props) => props.theme.subTheme7_C};
      box-shadow: 0px 0px 5px rgba(0, 69, 255, 0.2);
    }
  }

  @media (max-width : 576px) {
    html { 
      font-size : 14px;
    }
  }
`;

export default GlobalStyles;
