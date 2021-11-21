import tw from "twin.macro";
import { useState, useEffect } from "react";
import { Editor } from "../components";
import useLocalStorage from "../customHooks/useLocalStorage";

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
    <Wrapper>
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
    </Wrapper>
  );
}
export default App;

export const TopPane = tw.div`
flex flex-row
items-center w-full  height[350px]
gap-4 background[#060606]
pl-4 pr-4
flex-basis[0]
flex-grow
flex-shrink-0
`;
export const BottomPane = tw.div`
 w-full mt-4 flex-grow
 height[calc(100vh - 366px)]
`;

export const Wrapper = tw.div`
flex flex-col items-center w-full height[calc(100vh - 64px)] flex-grow
`;
