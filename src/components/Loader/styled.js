import styled from "styled-components";

export const StyledLoader = styled.div`
  color: #fff;
  background-color: var(--main-background);
  width: 100%;
  height: calc(100% - 128px);
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Consolas, Menlo, Monaco, monospace;
  font-weight: bold;
  font-size: 20vh;

  opacity: 0.8;

  span {
    display: inline-block;
    animation: pulse 0.4s alternate infinite ease-in-out;

    &:nth-child(odd) {
      animation-delay: 0.4s;
    }
  }

  @keyframes pulse {
    to {
      transform: scale(0.8);
      opacity: 0.5;
    }
  }
`;
