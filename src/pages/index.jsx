import tw from "twin.macro";
import React from "react";
import Link from "next/link";
import { SiHtml5, SiCss3, SiJavascript } from "react-icons/si";

function Home() {
  return (
    <Wrapper>
      <h1
        className="gradient-text-1"
        tw="text-5xl text-white text-center font-extrabold"
      >
        Hi Folks
      </h1>
      <p className="para">
        CodeworK is a platform where anyone can code their own template, it was
        first intentionally made to replicate the @codepen but after working on
        this, i have so much interesting features in my mind which will be added
        very soon. Right now website could be buggy or not responsive properly
        but i am giving my time to fix this all. <br />
        <br />
        Create your ideas using the{" "}
        <Link href="/editor">
          <a tw="color[#1890ff]">editor tool</a>
        </Link>{" "}
        where you can code your{" "}
        <span>
          HTML <SiHtml5 size="24" color="#d4d4d4" tw="inline" />
        </span>
        ,{" "}
        <span>
          CSS <SiCss3 size="24" color="#d4d4d4" tw="inline" />
        </span>{" "}
        &{" "}
        <span>
          JS <SiJavascript size="24" color="#d4d4d4" tw="inline" />
        </span>{" "}
        and can have live preview as well.
        <br />
        <br />
      </p>
      <h1
        className="gradient-text-2"
        tw="text-3xl font-extrabold text-white text-left inline-block"
      >
        Features coming soon :
      </h1>
      <ul className="feature-list">
        <li>Separate Dashboard where you can find all of your template</li>
        <li>Support For Template engines like pug/ejs</li>
        <li>Make your own template and share them with the world</li>
        <li>Make your template as Public or Private templates</li>
        <li>Download your and other public template</li>
        <li>Private template store</li>
      </ul>
    </Wrapper>
  );
}

export default Home;

const Wrapper = tw.div`
p-8
height[calc(100vh - 128px)]
sm:p-16
[.para]:(text-xl mt-4 text-white text-justify ml-auto mr-auto width[100%])
[.feature-list]:(m-4  text-white text-justify ml-auto mr-auto width[94%] list-disc)
[.feature-list li]:(text-xl mt-2 text-white text-justify )
`;
