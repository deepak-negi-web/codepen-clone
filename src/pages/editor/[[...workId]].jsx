import tw from "twin.macro";
import { useState, useEffect } from "react";
import Split from "react-split";
import { useQuery } from "@apollo/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

import { GET_WORK_DETAILS } from "../../graphql";
import { Editor, Loader } from "../../components";
import { useEditorConfig } from "../../providers";

function EditorPage() {
  const router = useRouter();
  const workId = router.query.workId || [];
  const { editor, setEditorContent, saveUserWorkHandler, editWorkName } =
    useEditorConfig();
  const [collapsedIndex, setCollapsedIndex] = useState(null);
  const { loading: isLoadingWorkDetails } = useQuery(GET_WORK_DETAILS, {
    skip: workId.length === 0,
    variables: {
      id: workId[0],
    },
    onCompleted: ({ workDetails }) => {
      if (Object.keys(workDetails).length > 0) {
        editWorkName(workDetails.label);
        setEditorContent({
          html: workDetails.files.find((file) => file.type === "html").content,
          css: workDetails.files.find((file) => file.type === "css").content,
          js: workDetails.files.find((file) => file.type === "js").content,
          workId: workId[0],
        });
      }
    },
    onError: (error) => {
      console.error(error);
    },
  });

  useEffect(() => {
    if (!router.query.workId) {
      setEditorContent({
        html: "",
        css: "",
        js: "",
        workId: "",
      });
      editWorkName("");
    }
  }, [router.query.workId]);

  if (isLoadingWorkDetails) return <Loader />;

  return (
    <Wrapper direction="vertical">
      <TopPane collapsed={collapsedIndex}>
        <Editor
          title="HTML"
          value={editor.html}
          language="xml"
          onChange={(value) => setEditorContent({ html: value })}
          onCollapsed={() => setCollapsedIndex(0)}
          onSaveHandler={saveUserWorkHandler}
        />
        <Editor
          title="CSS"
          value={editor.css}
          language="css"
          onChange={(value) => setEditorContent({ css: value })}
          onCollapsed={() => setCollapsedIndex(1)}
          onSaveHandler={saveUserWorkHandler}
        />
        <Editor
          title="JS"
          value={editor.js}
          language="javascript"
          onChange={(value) => setEditorContent({ js: value })}
          onCollapsed={() => setCollapsedIndex(2)}
          onSaveHandler={saveUserWorkHandler}
        />
      </TopPane>
      <BottomPane>
        <iframe
          srcDoc={editor.srcDoc}
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
