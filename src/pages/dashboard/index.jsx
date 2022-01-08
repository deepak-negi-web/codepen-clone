import tw from "twin.macro";
import React from "react";
import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import ReactHtmlParser from "react-html-parser";
import { BiExpand } from "react-icons/bi";

import { Loader } from "../../components";
import useLocalStorage from "../../customHooks/useLocalStorage";
import { getSourceDoc } from "../../utils";
import { GET_WORKS } from "../../graphql";
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
          return {
            ...uw,
            showContent: `<style>${css}</style>${html}<script>${js}</script>`,
          };
        });
        setWorks(updatedWork);
      }
      setIsLoadingWorks(false);
    },
    onError: (error) => {
      setIsLoadingWorks(false);
      console.error(error);
    },
  });
  if (isLoadingWorks) return <Loader />;
  return (
    <div tw="w-full height[100% - 128px] p-8">
      <h1 tw="text-4xl mb-8 text-white text-center ml-auto mr-auto width[100%]">
        My works
      </h1>
      <div tw="grid grid-template-columns[repeat(auto-fill, minmax(300px, 1fr))] gap-20 md:(grid-template-columns[repeat(auto-fill, minmax(320px, 1fr))])">
        {works.map((work) => {
          return (
            <Card
              key={work.id}
              work={work}
              onClick={() => router.push(`/editor/${work.id}`)}
            />
          );
        })}
      </div>
    </div>
  );
}

const Card = ({ work = null, ...props }) => (
  <div tw="width[350px] height[300px] md:(width[400px] height[320px]) rounded-md background[var(--secondary-background)] overflow-hidden relative hover:(cursor-pointer)">
    <div tw="bg-white w-full h-2/3 rounded-md overflow-hidden">
      {ReactHtmlParser(work.showContent)}
    </div>
    <div tw="h-1/3 p-4">
      <h2 tw="text-lg text-white">{work.label}</h2>
    </div>
    <span
      onClick={props.onClick}
      tw="absolute top-4 right-4 p-1 hover:(border[1px solid var(--secondary-background)] rounded-md)"
    >
      <BiExpand size={28} />
    </span>
  </div>
);
