import { Form, Input, Button, Checkbox } from "antd";
import { RiMailFill, RiLockPasswordFill } from "react-icons/ri";
import "twin.macro";

const SignupComp = ({ switchViewToLogin = () => null }) => {
  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
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
        rules={[{ required: true, message: "Please input your Password!" }]}
      >
        <Input
          prefix={<RiLockPasswordFill color="#d9d9d9" />}
          type="password"
          placeholder="Password"
        />
      </Form.Item>
      <Form.Item
        name="confirmPassword"
        rules={[{ required: true, message: "Please re-enter your Password!" }]}
      >
        <Input
          prefix={<RiLockPasswordFill color="#d9d9d9" />}
          type="password"
          placeholder="Confirm Password"
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" tw="w-full">
          Sign Up
        </Button>
        <div tw="flex items-center justify-center mt-2">
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
