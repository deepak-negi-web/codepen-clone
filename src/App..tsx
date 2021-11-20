/** @jsxImportSource @emotion/react */

import "twin.macro";
import { useState, useEffect } from "react";
import { Editor } from "./components";
import { TopPane, BottomPane } from "./app.style";
import useLocalStorage from "./customHooks/useLocalStorage";

function App() {
  const [html, setHtml] = useLocalStorage("html", "");
  const [css, setCss] = useLocalStorage("css", "");
  const [js, setJs] = useLocalStorage("js", "");
  const [srcDoc, setSrcDoc] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSrcDoc(`
    ${
      css
        ? `<style>
      ${css}
    </style>`
        : ""
    }
  <body>
    ${html}
    </body>
    ${
      js
        ? `<script>
      ${js}
    </script>`
        : ""
    }
  `);
    }, 250);
    return () => clearTimeout(timeout);
  }, [html, css, js]);
  return (
    <div tw="flex flex-col items-center w-full h-screen p-4">
      <TopPane>
        <Editor title="HTML" value={html} language="xml" onChange={setHtml} />
        <Editor title="CSS" value={css} language="css" onChange={setCss} />
        <Editor title="JS" value={js} language="javascript" onChange={setJs} />
      </TopPane>
      <BottomPane>
        <iframe
          srcDoc={srcDoc}
          title="OUTPUT"
          sandbox="allow-scripts"
          frameBorder="0"
          tw="w-full h-full bg-gray-100"
        ></iframe>
      </BottomPane>
    </div>
  );
}
export default App;
