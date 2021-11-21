import tw from "twin.macro";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import { Editor } from "./styles";
import { useState } from "react";
import dynamic from "next/dynamic";
import { FaCompressAlt, FaExpandAlt } from "react-icons/fa";

const CodeEditor = dynamic(
  () => {
    require("codemirror/mode/xml/xml");
    require("codemirror/mode/javascript/javascript");
    require("codemirror/mode/css/css");
    return import("react-codemirror2").then((module) => module.Controlled);
  },
  { ssr: false }
);

function EditorComp(props) {
  const { title, onChange, language, value } = props;
  const [open, setOpen] = useState(true);
  const onChangeHandler = (_editor, _data, value) => {
    onChange(value);
  };
  return (
    <Editor css={[open ? tw`w-1/3` : tw`w-0 max-w-0`]}>
      <div tw="flex flex-row items-center justify-between height[45px]  background[#060606] pr-2">
        <p tw=" font-openSans font-bold text-white background[hsl(228,7%,12%)] padding[9px 12px] border-top[3px solid #b9b9b9]">
          {title}
        </p>
        <button
          tw="ml-4 p-2 background[hsl(227 12% 30%)] hover:background[hsl(228deg 12% 40%)]"
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? (
            <FaCompressAlt size="20" color="#fff" />
          ) : (
            <FaExpandAlt size="20" color="#fff" />
          )}
        </button>
      </div>
      <CodeEditor
        onBeforeChange={onChangeHandler}
        value={value}
        className="code-mirror-wrapper"
        options={{
          lineWrapping: true,
          lint: true,
          mode: language,
          theme: "material",
          lineNumbers: true,
        }}
      />
    </Editor>
  );
}

export default EditorComp;
