import React from "react";
import { StyledLoader } from "./styled";
export default function Loader() {
  return (
    <StyledLoader>
      <span>{`{`}</span>
      <span>{`}`}</span>
    </StyledLoader>
  );
}
