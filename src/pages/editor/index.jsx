import tw from "twin.macro";
import { useState, useEffect } from "react";
import Split from "react-split";
import { useMutation } from "@apollo/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import { Editor, Loader } from "../../components";
import useLocalStorage from "../../customHooks/useLocalStorage";
import { getSourceDoc } from "../../utils";
import { CREATE_WORK } from "../../graphql";

function EditorPage() {
  const router = useRouter();

  const [html, setHtml] = useState("");
  const [css, setCss] = useState("");
  const [js, setJs] = useState("");
  const [srcDoc, setSrcDoc] = useState("");
  const [collapsedIndex, setCollapsedIndex] = useState(null);
  const { status, data: session } = useSession();
  // create work mutation
  const [createWork, { loading: isCreatingWork }] = useMutation(CREATE_WORK, {
    onCompleted: ({ createdWork }) => {
      router.push(`/editor/${createdWork.id}`);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const createUserWorkHandler = async () => {
    if (status === "authenticated" && session.user) {
      await createWork({
        variables: {
          object: {
            label: `Work-${new Date().getTime()}`,
            userId: session?.user?.id,
            files: {
              data: [
                {
                  type: "html",
                  content: html,
                },
                {
                  type: "css",
                  content: css,
                },
                {
                  type: "js",
                  content: js,
                },
              ],
            },
          },
        },
      });
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      const result = getSourceDoc({ html, css, js });
      setSrcDoc(result);
    }, 250);
    return () => clearTimeout(timeout);
  }, [html, css, js]);

  if (isCreatingWork) return <Loader />;

  return (
    <Wrapper direction="vertical">
      <TopPane collapsed={collapsedIndex}>
        <Editor
          title="HTML"
          value={html}
          language="xml"
          onChange={setHtml}
          onCollapsed={() => setCollapsedIndex(0)}
          onSaveHandler={createUserWorkHandler}
        />
        <Editor
          title="CSS"
          value={css}
          language="css"
          onChange={setCss}
          onCollapsed={() => setCollapsedIndex(1)}
          onSaveHandler={createUserWorkHandler}
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
          tw="w-full h-full bg-gray-100"
          name="CodeworK"
          frameBorder="0"
          sandbox="allow-downloads allow-forms allow-modals allow-pointer-lock allow-popups allow-presentation allow-same-origin allow-scripts allow-top-navigation-by-user-activation"
          allow="accelerometer; camera; encrypted-media; display-capture; geolocation; gyroscope; microphone; midi; clipboard-read; clipboard-write"
          allowfullscreen="true"
          allowpaymentrequest="true"
          allowtransparency="true"
          loading="lazy"
        ></iframe>
      </BottomPane>
    </Wrapper>
  );
}
export default EditorPage;

export const TopPane = tw(Split)`
flex flex-row w-full  height[350px] background[#060606] flex-basis[0] flex-grow flex-shrink-0

`;
export const BottomPane = tw.div`
 w-full flex-grow
 height[calc(100vh - 366px)]
`;

export const Wrapper = tw(Split)`
w-full height[calc(100vh - 128px)] flex-grow
`;
