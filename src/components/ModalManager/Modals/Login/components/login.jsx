import "twin.macro";
import { Form, Input, Button, Checkbox, Divider, Space } from "antd";
import { RiMailFill, RiLockPasswordFill } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";
import { BsGithub } from "react-icons/bs";
import { useSession, signIn, signOut } from "next-auth/react";

const LoginComp = ({
  switchViewToSignup = () => null,
  switchViewToForgotPassword = () => null,
  isSubmitting = false,
  handleSubmit = () => null,
}) => {
  const onFinish = async (values) => {
    await handleSubmit("login", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Form
      name="normal_login"
      className="login-form"
      initialValues={{ remember: true }}
      onFinish={onFinish}
    >
      <Form.Item
        name="email"
        rules={[
          {
            required: true,
            type: "email",
            message: "Please input your Email!",
          },
        ]}
      >
        <Input prefix={<RiMailFill color="#d9d9d9" />} placeholder="Email" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: "Please input your Password!" }]}
      >
        <Input
          prefix={<RiLockPasswordFill color="#d9d9d9" />}
          type="password"
          placeholder="Password"
        />
      </Form.Item>
      <Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Button
          type="link"
          onClick={switchViewToForgotPassword}
          tw="float-right"
        >
          Forgot password
        </Button>
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          tw="w-full"
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          Log In
        </Button>
        <Divider>OR</Divider>
        <Space
          align="center"
          direction="horizontal"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Button
            size="large"
            onClick={() => signIn("github")}
            icon={
              <BsGithub
                size={20}
                style={{ display: "inline", marginRight: "8px" }}
              />
            }
            style={{
              backgroundColor: "#24292e",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              borderRadius: "4px",
            }}
          >
            Log in with GitHub
          </Button>

          <Button
            size="large"
            onClick={() => signIn("google")}
            icon={
              <FcGoogle
                size={20}
                style={{ display: "inline", marginRight: "8px" }}
              />
            }
            style={{
              display: "flex",
              alignItems: "center",
              borderRadius: "4px",
            }}
          >
            Log in with Google
          </Button>
        </Space>
        <div tw="flex items-center justify-center mt-8">
          Need an account?
          <Button type="link" onClick={switchViewToSignup}>
            Sign Up
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};

export default LoginComp;
