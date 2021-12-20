import tw from "twin.macro";
import { useState } from "react";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import { FaCompressAlt, FaExpandAlt } from "react-icons/fa";

import { Editor } from "./styles";
import { useModal } from "../../providers";

const CodeEditor = dynamic(
  () => {
    require("codemirror/lib/codemirror.css");
    require("codemirror/theme/material.css");
    require("codemirror/mode/xml/xml");
    require("codemirror/mode/javascript/javascript");
    require("codemirror/mode/css/css");
    return import("react-codemirror2").then((module) => module.Controlled);
  },
  { ssr: false }
);

function EditorComp(props) {
  const { title, onChange, language, value, onCollapsed } = props;
  const { status, data: session } = useSession();
  const [open, setOpen] = useState(true);
  const { openModal } = useModal();
  const onChangeHandler = (_editor, _data, value) => {
    onChange(value);
  };
  const onSave = (editor) => {
    if (status !== "authenticated") {
      openModal("login");
    } else {
      console.log("save", editor);
    }
  };
  return (
    <Editor>
      <div tw="flex flex-row items-center justify-between height[45px]  background[var(--main-background)] pr-2">
        <p tw=" font-openSans font-bold text-white background[var(--secondary-background)] padding[9px 12px] border-top[3px solid #b9b9b9]">
          {title}
        </p>
        <button
          tw="ml-4 p-2 background[var(--tertiary-background)] hover:background[hsl(228deg 12% 40%)]"
          onClick={onCollapsed}
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
          extraKeys: {
            "Ctrl-S": onSave,
          },
        }}
      />
    </Editor>
  );
}

export default EditorComp;
