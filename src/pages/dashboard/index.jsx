import tw from "twin.macro";
import React from "react";
import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import ReactHtmlParser from "react-html-parser";
import { BiExpand } from "react-icons/bi";
import { AiOutlineDelete, AiOutlineDownload } from "react-icons/ai";
import toast from "react-hot-toast";
import { Result, Button, Popconfirm, Tooltip } from "antd";
import fileDownload from "js-file-download";
import moment from "moment";

import { Loader } from "../../components";
import { GET_WORKS, DELETE_WORK } from "../../graphql";

export default function Dashboard() {
  const router = useRouter();
  const [works, setWorks] = useState([]);
  const [isLoadingWorks, setIsLoadingWorks] = useState(true);
  useQuery(GET_WORKS, {
    onCompleted: ({ works: userWorks }) => {
      if (userWorks.length > 0) {
        const updatedWork = userWorks.map((uw) => {
          const html = uw.files.find((file) => file.type === "html").content;
          const css = uw.files.find((file) => file.type === "css").content;
          const js = uw.files.find((file) => file.type === "js").content;
          const downloadContent = `<!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta http-equiv="X-UA-Compatible" content="IE=edge">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>${uw.label}</title>
              <style>${css}</style>
          </head>
          <body>
          ${html}
          <script>${js}</script>
          </body>
          </html>
          `;
          const showContent = `<div id=${uw.label}><style>${css}</style>${html}<script>${js}</script></div>`;
          return {
            ...uw,
            showContent,
            downloadContent,
          };
        });
        setWorks(updatedWork);
      } else {
        setWorks([]);
      }
      setIsLoadingWorks(false);
    },
    onError: (error) => {
      setIsLoadingWorks(false);
      console.error(error);
    },
  });

  const [deleteHandler] = useMutation(DELETE_WORK, {
    onCompleted: ({ deleteWork }) => {
      toast.success(`Work ${deleteWork.label} deleted`);
      console.log(deleteWork);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const deleteWorkHandler = (workId) => {
    deleteHandler({
      variables: {
        id: workId,
      },
      optimisticResponse: true,
      update: (cache) => {
        const existingWorks = cache.readQuery({ query: GET_WORKS });
        console.log("existing works", existingWorks);
        const newWorks = existingWorks.works.filter((w) => w.id !== workId);
        console.log("filtered works", newWorks);
        cache.writeQuery({
          query: GET_WORKS,
          data: { works: newWorks },
        });
      },
    });
  };

  const downloadHandler = (work) => {
    const fileName = `${work.label}.html`;
    fileDownload(work.downloadContent, fileName);
  };
  if (isLoadingWorks) return <Loader />;
  return (
    <Wrapper>
      <h1 tw="text-4xl mb-8 text-white text-center ml-auto mr-auto width[100%]">
        Dashboard
      </h1>
      {works.length > 0 ? (
        <div tw="grid grid-template-columns[repeat(auto-fill, minmax(300px, 1fr))] gap-20 md:(grid-template-columns[repeat(auto-fill, minmax(320px, 1fr))])">
          {works.map((work) => {
            return (
              <Card
                key={work.id}
                work={work}
                onClick={() => router.push(`/editor/${work.id}`)}
                onDelete={() => deleteWorkHandler(work.id)}
                downloadHandler={downloadHandler}
              />
            );
          })}
        </div>
      ) : (
        <Result
          status="404"
          title="No work added yet"
          subTitle="Sorry, you haven't added any work yet, goto editor to add a new work"
          extra={
            <Button type="primary" onClick={() => router.push("/editor")}>
              Goto Editor
            </Button>
          }
        />
      )}
    </Wrapper>
  );
}

const Card = ({ work = null, downloadHandler = () => null, ...props }) => (
  <div tw="width[350px] height[300px] md:(width[400px] height[320px]) rounded-md background[var(--secondary-background)] overflow-hidden relative hover:(cursor-pointer)">
    <div tw="bg-white w-full h-2/3 rounded-md overflow-hidden">
      {ReactHtmlParser(work.showContent)}
    </div>
    <div tw="h-1/3 p-4">
      <div tw="flex justify-between items-center">
        <h2 tw="text-lg text-white">{work.label}</h2>
        <div tw="flex justify-between items-center">
          <Tooltip
            title="Download a .html file"
            color="var(--tertiary-background)"
          >
            <span tw="mr-2" onClick={() => downloadHandler(work)}>
              <AiOutlineDownload size={24} color="#fff" />
            </span>
          </Tooltip>
          <Popconfirm
            title="Are you sure to delete this work?"
            onConfirm={props.onDelete}
            // onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
            <span>
              <AiOutlineDelete size={24} color="#fff" />
            </span>
          </Popconfirm>
        </div>
      </div>
      <h4 tw="text-sm text-white">
        Created {moment(work.created_at).fromNow()}
      </h4>
    </div>
    <span
      onClick={props.onClick}
      tw="absolute top-4 right-4 p-1 bg-white rounded-md  hover:(border[1px solid var(--secondary-background)] rounded-md)"
    >
      <BiExpand size={28} />
    </span>
  </div>
);

const Wrapper = tw.div`
w-full height[100% - 128px] p-8
[.ant-result>.ant-result-title,.ant-result>.ant-result-subtitle]:(text-white)
`;
