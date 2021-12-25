import tw from "twin.macro";
import { useState, useEffect } from "react";
import Split from "react-split";
import { useMutation, useQuery } from "@apollo/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import { Editor } from "../../components";
import useLocalStorage from "../../customHooks/useLocalStorage";
import { getSourceDoc } from "../../utils";
import { CREATE_WORK, GET_WORK_DETAILS, UPDATE_WORK_FILE } from "../../graphql";

function EditorPage() {
  const { status, data: session } = useSession();
  const router = useRouter();

  // local state for editor
  const [html, setHtml] = useState("");
  const [css, setCss] = useState("");
  const [js, setJs] = useState("");
  const [srcDoc, setSrcDoc] = useState("");
  const [collapsedIndex, setCollapsedIndex] = useState(null);

  // query for getting work details
  const { loading: isLoadingWorkDetails, error: hasErrorOnWorkDetails } =
    useQuery(GET_WORK_DETAILS, {
      variables: {
        id: router.query.workId,
      },
      onCompleted: ({ workDetails }) => {
        if (Object.keys(workDetails).length > 0) {
          setHtml(
            workDetails.files.find((file) => file.type === "html").content
          );
          setCss(workDetails.files.find((file) => file.type === "css").content);
          setJs(workDetails.files.find((file) => file.type === "js").content);
        }
      },
      onError: (error) => {
        console.error(error);
      },
    });

  // update work files mutation
  const [updateWorkFile, { loading: isUpdatingWorkFile }] = useMutation(
    UPDATE_WORK_FILE,
    {
      onCompleted: (data) => {
        console.log("updated successfully");
      },
      onError: (error) => {
        console.error(error);
      },
    }
  );

  const createUserWorkHandler = async () => {
    await Promise.all(
      ["html", "css", "js"].map(async (data) => {
        updateWorkFile({
          variables: {
            where: {
              workId: {
                _eq: router.query.workId,
              },
              type: {
                _eq: data,
              },
            },
            _set: {
              content:
                data === "html"
                  ? html
                  : data === "css"
                  ? css
                  : data === "js"
                  ? js
                  : "",
            },
          },
        });
      })
    );

    // if (status === "authenticated" && session.user) {
    //   await createWork({
    //     variables: {
    //       object: {
    //         label: `Work-${new Date().getTime()}`,
    //         userId: session?.user?.id,
    //         files: {
    //           data: [
    //             {
    //               type: "html",
    //               content: html,
    //             },
    //             {
    //               type: "css",
    //               content: css,
    //             },
    //             {
    //               type: "js",
    //               content: js,
    //             },
    //           ],
    //         },
    //       },
    //     },
    //   });
    // }
  };
  useEffect(() => {
    const timeout = setTimeout(() => {
      const result = getSourceDoc({ html, css, js });
      setSrcDoc(result);
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
