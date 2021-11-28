import { Form, Input, Button, Checkbox } from "antd";
import { RiMailFill, RiLockPasswordFill } from "react-icons/ri";
import "twin.macro";

const ResetPasswordComp = ({ switchViewToLogin = () => null }) => {
  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Form
      name="resetPassword"
      className="resetPassword-form"
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

      <Form.Item>
        <Button type="primary" htmlType="submit" tw="w-full">
          Send Reset Password Link
        </Button>
        <Button
          type="link"
          onClick={switchViewToLogin}
          tw="w-24 block m-auto mt-2"
        >
          Cancel
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ResetPasswordComp;
