import React from "react";
import { Login, ModalTwo } from "./Modals";
import { useModal } from "../../providers";
const ModalManager = () => {
  const { modal, closeModal } = useModal();
  return (
    <>
      <Login closeFn={closeModal} open={modal === "login"} />
      <ModalTwo closeFn={closeModal} open={modal === "modal-two"} />
    </>
  );
};

export default ModalManager;
