import styled from "styled-components";

export const Editor = styled.div`
  background: hsl(228, 7%, 12%);
  border: 1px solid #34363e;
  flex-grow: 1;
  height: 100%;
  flex: 1;
  :hover {
    cursor: text;
  }
  .CodeMirror {
    height: 100%;
    background: hsl(228, 7%, 12%);
    color: #fff;
  }
  .CodeMirror-scroll {
    overflow: scroll !important;
    margin-bottom: -30px;
    margin-right: -30px;
    padding-bottom: 30px;
    height: 100%;
    outline: none;
    position: relative;
  }
  .CodeMirror-sizer {
    margin-left: 39px;
    margin-bottom: -17px;
    min-height: 405px;
    padding-right: 9px;
    padding-bottom: 0px;
    min-width: 200px;
  }
  .CodeMirror-gutters {
    background: hsl(228, 7%, 12%);
    color: #fff;
    border: none;
  }
  .CodeMirror-linenumber {
    padding: 0 3px 0 5px;
    min-width: 20px;
    text-align: right;
    color: #fff;
    white-space: nowrap;
  }
  .CodeMirror-lines {
    padding-bottom: 128px;
  }
  .CodeMirror-line {
    word-wrap: break-word;
    white-space: pre-wrap;
    word-break: normal;
  }
  .CodeMirror-cursor {
    border-left: 1px solid #fff;
  }
  .code-mirror-wrapper {
    flex-grow: 1;
    overflow: hidden;
    height: calc(100% - 45px);
  }
`;
