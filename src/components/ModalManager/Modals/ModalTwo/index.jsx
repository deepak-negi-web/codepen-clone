import React from "react";
import { Modal } from "antd";

const ModalTwo = ({ closeFn = () => null, open = false }) => {
  return (
    <>
      <Modal
        title="Basic Modal 2"
        visible={open}
        onOk={closeFn}
        onCancel={closeFn}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </>
  );
};

export default ModalTwo;
