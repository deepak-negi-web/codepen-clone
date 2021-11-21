import React from "react";
import tw from "twin.macro";

function Header() {
  return (
    <div tw="h-16 p-4 flex items-center justify-between border[1px solid #34363e]">
      <h1 tw="text-3xl text-white">CodeworK</h1>
    </div>
  );
}

export default Header;
