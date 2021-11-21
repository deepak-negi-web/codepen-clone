import tw from "twin.macro";
import { useState, useEffect } from "react";
import Split from "react-split";
import { Editor } from "../components";
import useLocalStorage from "../customHooks/useLocalStorage";

function App() {
  const [html, setHtml] = useLocalStorage("html", "");
  const [css, setCss] = useLocalStorage("css", "");
  const [js, setJs] = useLocalStorage("js", "");
  const [srcDoc, setSrcDoc] = useState("");
  const [collapsedIndex, setCollapsedIndex] = useState(null);

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
    <Wrapper direction="vertical">
      <TopPane collapsed={collapsedIndex}>
        <Editor
          title="HTML"
          value={html}
          language="xml"
          onChange={setHtml}
          onCollapsed={() => setCollapsedIndex(0)}
        />
        <Editor
          title="CSS"
          value={css}
          language="css"
          onChange={setCss}
          onCollapsed={() => setCollapsedIndex(1)}
        />
        <Editor
          title="JS"
          value={js}
          language="javascript"
          onChange={setJs}
          onCollapsed={() => setCollapsedIndex(2)}
        />
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

export const TopPane = tw(Split)`
flex flex-row w-full  height[350px] background[#060606] flex-basis[0] flex-grow flex-shrink-0

`;
export const BottomPane = tw.div`
 w-full flex-grow
 height[calc(100vh - 366px)]
`;

export const Wrapper = tw(Split)`
w-full height[calc(100vh - 64px)] flex-grow
`;
