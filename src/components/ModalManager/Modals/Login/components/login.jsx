import { Form, Input, Button, Checkbox } from "antd";
import { RiMailFill, RiLockPasswordFill } from "react-icons/ri";
import "twin.macro";

const LoginComp = ({
  switchViewToSignup = () => null,
  switchViewToForgotPassword = () => null,
}) => {
  const onFinish = (values) => {
    console.log("Success:", values);
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
        <Button type="primary" htmlType="submit" tw="w-full">
          Log In
        </Button>
        <div tw="flex items-center justify-center mt-2">
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
