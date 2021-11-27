import React from "react";
import tw from "twin.macro";

function FeedsPage() {
  return (
    <Wrapper>
      <h1
        className="gradient-text-1"
        tw="text-3xl font-extrabold text-white text-center"
      >
        Feeds Coming Soon
      </h1>
    </Wrapper>
  );
}

export default FeedsPage;

const Wrapper = tw.div`
height[calc(100vh - 128px)]
flex
justify-center
items-center
`;
