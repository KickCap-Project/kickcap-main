import reset from 'styled-reset';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
@font-face {
    font-family: 'Pretendard';
    src: url('../asset/font/Pretendard-Thin.otf') format('woff');
}
  ${reset}
  a{
        text-decoration: none;
        color: inherit;
    }
    *{
        box-sizing: border-box;
        font-family: 'Pretendard'
        
    }
    html, body, div, span, h1, h2, h3, h4, h5, h6, p, 
    a, dl, dt, dd, ol, ul, li, form, label, table{
        margin: 0;
        padding: 0;
        border: 0;
        font-size: 20px;
        font-family: 'Pretendard';
        vertical-align: baseline;
    }
    body{
        line-height: 1;
        background-color: "f7f7f7";
    }
    ol, ul{
        list-style: none;
    }
    button {
        border: 0;
        background: transparent;
        cursor: pointer;
    }
    input {
        border: none;
        outline: none;
        padding: 0 10px 0 10px;
        border-radius: 10px;
    }
    ::-webkit-scrollbar{
      display: none;
    }
    input:-webkit-autofill { -webkit-box-shadow: 0 0 0 30px ${(props) =>
      props.theme.subColor} inset ; -webkit-text-fill-color: ${(props) => props.theme.textColor}; }
    input:-webkit-autofill, input:-webkit-autofill:hover, input:-webkit-autofill:focus, input:-webkit-autofill:active { transition: background-color 5000s ease-in-out 0s; }
`;
export default GlobalStyle;
