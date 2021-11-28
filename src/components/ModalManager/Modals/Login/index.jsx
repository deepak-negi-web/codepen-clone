import React from "react";
import { Modal } from "antd";

import LoginComp from "./components/login";
import SignupComp from "./components/signup";
import ForgotPasswordComp from "./components/forgotPassword";

const Login = ({ closeFn = () => null, open = false }) => {
  const [view, switchView] = React.useState("login");
  const switchViewToLogin = () => {
    switchView("login");
  };
  const switchViewToSignup = () => {
    switchView("signup");
  };

  const switchViewToForgotPassword = () => {
    switchView("forgotPassword");
  };

  const closeModalHandler = () => {
    switchView("login");
    closeFn();
  };
  const getModalTitle = () => {
    if (view === "login") {
      return "Log In!";
    } else if (view === "signup") {
      return "Sign Up!";
    } else if (view === "forgotPassword") {
      return "Forgot Password?";
    }
  };
  return (
    <>
      <Modal
        title={getModalTitle()}
        visible={open}
        onOk={closeModalHandler}
        onCancel={closeModalHandler}
        footer={null}
      >
        {view === "login" && (
          <LoginComp
            switchViewToSignup={switchViewToSignup}
            switchViewToForgotPassword={switchViewToForgotPassword}
          />
        )}
        {view === "signup" && (
          <SignupComp switchViewToLogin={switchViewToLogin} />
        )}
        {view === "forgotPassword" && (
          <ForgotPasswordComp switchViewToLogin={switchViewToLogin} />
        )}
      </Modal>
    </>
  );
};

export default Login;
