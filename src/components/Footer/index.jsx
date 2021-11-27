import React from "react";
import "twin.macro";
import { FaLinkedinIn, FaTwitter } from "react-icons/fa";
import { BsGithub } from "react-icons/bs";
import { StyledFooter } from "./styles";

function Footer() {
  return (
    <StyledFooter>
      <p tw="font-openSans font-bold text-white text-center">
        © {new Date().getFullYear()} CodeworK All rights reserved.
      </p>
      <div tw="flex flex-row justify-center items-center padding[0.5rem 0]">
        <a
          className="social__links"
          tw="text-white text-center mr-4 rounded-full"
          href="https://www.linkedin.com/in/deepaknewdev/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaLinkedinIn size="20" color="#b9b9" />
        </a>
        <a
          className="social__links"
          tw="text-white text-center mr-4"
          href="https://twitter.com/DeepakN19333789"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaTwitter size="20" color="#b9b9" />
        </a>
        <a
          className="social__links"
          tw="text-white text-center mr-4"
          href="https://github.com/deepak-negi-web"
          target="_blank"
          rel="noopener noreferrer"
        >
          <BsGithub size="20" color="#b9b9" />
        </a>
      </div>
    </StyledFooter>
  );
}

export default Footer;
