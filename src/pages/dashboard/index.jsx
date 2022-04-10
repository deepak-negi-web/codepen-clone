import tw from "twin.macro";
import React from "react";
import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import ReactHtmlParser from "react-html-parser";
import { BiExpand } from "react-icons/bi";
import { AiOutlineDelete } from "react-icons/ai";
import toast from "react-hot-toast";
import { Result, Button, Popconfirm } from "antd";
import axios from "axios";

import { Loader } from "../../components";
import useLocalStorage from "../../customHooks/useLocalStorage";
import { getSourceDoc, getHtmlImage } from "../../utils";
import { GET_WORKS, DELETE_WORK } from "../../graphql";

export default function Dashboard() {
  const router = useRouter();
  const [works, setWorks] = useState([]);
  const [isLoadingWorks, setIsLoadingWorks] = useState(true);
  useQuery(GET_WORKS, {
    onCompleted: async ({ works: userWorks }) => {
      if (userWorks.length > 0) {
        let updatedWork = userWorks;
        updatedWork = await getHtmlImage(userWorks);
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

  const htmlToImageHandler = async () => {
    const { data } = await axios.get("/api/htmlToImage");
    console.log(data);
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

const Card = ({ work = null, ...props }) => (
  <div tw="width[350px] height[300px] md:(width[400px] height[320px]) rounded-md background[var(--secondary-background)] overflow-hidden relative hover:(cursor-pointer)">
    <div tw="bg-white w-full h-2/3 rounded-md overflow-hidden">
      {work.showContentImg && (
        <img src={`data:image/png;base64,${work.showContentImg}`} alt="" />
      )}
    </div>
    <div tw="h-1/3 p-4">
      <div tw="flex justify-between items-center">
        <h2 tw="text-lg text-white">{work.label}</h2>
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
    <span
      onClick={props.onClick}
      tw="absolute top-4 right-4 p-1 hover:(border[1px solid var(--secondary-background)] rounded-md)"
    >
      <BiExpand size={28} />
    </span>
  </div>
);

const Wrapper = tw.div`
w-full height[100% - 128px] p-8
[.ant-result>.ant-result-title,.ant-result>.ant-result-subtitle]:(text-white)
`;
