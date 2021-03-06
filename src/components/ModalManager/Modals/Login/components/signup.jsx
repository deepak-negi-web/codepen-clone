import "twin.macro";
import { Form, Input, Button, Checkbox, Space, Divider } from "antd";
import { RiMailFill, RiLockPasswordFill } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";
import { BsGithub } from "react-icons/bs";
import { useSession, signIn, signOut } from "next-auth/react";

const SignupComp = ({
  switchViewToLogin = () => null,
  isSubmitting = false,
  handleSubmit = () => null,
}) => {
  const onFinish = async (values) => {
    await handleSubmit("signup", values);
  };

  return (
    <Form
      name="normal_signup"
      className="signup-form"
      initialValues={{ remember: true }}
      onFinish={onFinish}
    >
      <Form.Item
        name="fullName"
        rules={[
          {
            required: true,
            message: "Please input your Name!",
          },
        ]}
      >
        <Input placeholder="Name" />
      </Form.Item>
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
        hasFeedback
        rules={[{ required: true, message: "Please input your Password!" }]}
      >
        <Input.Password
          prefix={<RiLockPasswordFill color="#d9d9d9" />}
          placeholder="Password"
        />
      </Form.Item>
      <Form.Item
        name="confirmPassword"
        dependencies={["password"]}
        hasFeedback
        rules={[
          { required: true, message: "Please confirm your password!" },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }

              return Promise.reject(
                new Error("The two passwords that you entered do not match!")
              );
            },
          }),
        ]}
      >
        <Input.Password
          prefix={<RiLockPasswordFill color="#d9d9d9" />}
          placeholder="Confirm Password"
        />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          tw="w-full"
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          Sign Up
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
            Login with GitHub
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
            Login with Google
          </Button>
        </Space>
        <div tw="flex items-center justify-center mt-8">
          Already have an account?
          <Button type="link" onClick={switchViewToLogin}>
            Log In
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};

export default SignupComp;
