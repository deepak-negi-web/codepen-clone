/** @jsxImportSource @emotion/react */
import tw from "twin.macro";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/xml/xml";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/css/css";
import { FaCompressAlt, FaExpandAlt } from "react-icons/fa";
import { useState } from "react";

import { Controlled as CodeEditor } from "react-codemirror2";

type editorProps = {
  title: string;
  onChange: (value: string) => void;
  language: string;
  value: string;
};

function Editor({ title, onChange, language, value }: editorProps) {
  const [open, setOpen] = useState(true);
  const onChangeHandler = (_editor: any, _data: any, value: string) => {
    console.log(value);
    onChange(value);
  };
  return (
    <div
      css={[
        tw`background[hsl(228,7%,12%)]  h-full border[1px solid #34363e]`,
        // open ? tw`flex-grow` : tw`flex-grow-0`,
        open ? tw`w-1/3` : tw`w-24`,
      ]}
    >
      <div tw="flex flex-row items-center justify-between   background[#060606] pr-2">
        <p tw=" font-openSans font-bold text-white background[hsl(228,7%,12%)] padding[9px 12px] border-top[3px solid #b9b9b9]">
          {title}
        </p>
        <button tw="ml-4" onClick={() => setOpen((prev) => !prev)}>
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
          lineNumbers: true,
        }}
      />
    </div>
  );
}

export default Editor;
