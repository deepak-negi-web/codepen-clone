import React from "react";
import { Modal, Alert } from "antd";
import { useSession, signIn, signOut } from "next-auth/react";
import axios from "axios";

import LoginComp from "./components/login";
import SignupComp from "./components/signup";
import ForgotPasswordComp from "./components/forgotPassword";
import { isClient } from "../../../../utils";

const Login = ({ closeFn = () => null, open = false }) => {
  const [view, switchView] = React.useState("login");
  const [error, setError] = React.useState(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

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

  const handleSubmit = async (type, values) => {
    try {
      setIsSubmitting(true);
      if (type === "login") {
        const response = await signIn("credentials", {
          redirect: false,
          email: values.email,
          password: values.password,
        });
        if (response?.error) {
          setError(response?.error);
          setIsSubmitting(false);
        } else {
          setIsSubmitting(false);
          closeModalHandler();
        }
      } else if (type === "signup") {
        console.log(type, values);
        const options = {
          url: isClient ? `${window.location.origin}/api/register` : "",
          method: "POST",
          data: {
            name: values.fullName,
            email: values.email,
            password: values.password,
          },
        };
        const { data } = await axios(options);
        if (data.success) {
          const response = await signIn("credentials", {
            redirect: false,
            email: values.email,
            password: values.password,
          });
          if (response?.error) {
            setError(response?.error);
            setIsSubmitting(false);
          } else {
            setIsSubmitting(false);
            closeModalHandler();
          }
        } else {
          setError("Something Went Wrong! Please try again later.");
          setIsSubmitting(false);
        }
      }
    } catch (err) {
      setIsSubmitting(false);
      console.error(err);
      setError("Email or password is incorrect!");
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
        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            banner
            style={{ marginBottom: "16px" }}
          />
        )}

        {view === "login" && (
          <LoginComp
            switchViewToSignup={switchViewToSignup}
            switchViewToForgotPassword={switchViewToForgotPassword}
            isSubmitting={isSubmitting}
            handleSubmit={handleSubmit}
          />
        )}
        {view === "signup" && (
          <SignupComp
            switchViewToLogin={switchViewToLogin}
            isSubmitting={isSubmitting}
            handleSubmit={handleSubmit}
          />
        )}
        {view === "forgotPassword" && (
          <ForgotPasswordComp
            switchViewToLogin={switchViewToLogin}
            isSubmitting={isSubmitting}
            handleSubmit={handleSubmit}
          />
        )}
      </Modal>
    </>
  );
};

export default Login;
