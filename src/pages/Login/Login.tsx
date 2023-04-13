import React from "react";
import axios from "axios";
import {
  Form,
  Button,
  Input,
  Divider,
  Typography,
  Checkbox,
  notification,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import { setToken } from "../../redux/authSlice";
import { useDispatch } from "react-redux";
import { GoogleOutlined } from "@ant-design/icons";
import { images } from "../../assets/images/index";

const { Title, Paragraph } = Typography;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  const dispatch = useDispatch();

  const onFinish = async (requestBody: any) => {
    try {
      const response = await axios.post(
        "https://x10-server.onrender.com/auth/login",
        requestBody
      );
      if (response.status === 200) {
        api["success"]({
          message: "Error",
          description: response.data.message,
        });
        dispatch(setToken(response.data));
        navigate("/");
      }
    } catch (error: any) {
      api["error"]({
        message: "Error",
        description: error.response.data.message,
      });
    }
  };
  return (
    <div className="login">
      {contextHolder}
      <img src={images.registerBackground} alt="register-background" />
      <div className="form-container">
        <div className="form-title">
          <Title level={3}>Login</Title>
          <Paragraph>Welcome back. Login to start working.</Paragraph>
          <Divider />
        </div>
        <Form
          size="large"
          className="form-layout"
          layout="vertical"
          form={form}
          name="register"
          onFinish={onFinish}
          scrollToFirstError
        >
          {/* Email Field */}
          <Form.Item
            name="credential"
            label="E-mail"
            rules={[
              {
                type: "email",
                message: "The input is not valid E-mail!",
              },
              {
                required: true,
                message: "Please input your E-mail!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          {/* Password Field */}
          <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>

          <Form.Item name="rememberMe" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Login
            </Button>
          </Form.Item>
        </Form>

        <Paragraph>
          <Link to="/forgot-password">Forgot Password?</Link>
          <Divider type="vertical" />
          Don't have account?&nbsp;
          <Link to="/register">Sign up</Link>
        </Paragraph>
        <Divider className="login-divider" orientation="center" plain>
          Or
        </Divider>
        <div className="google-register-button">
          <Button type="primary" size="large">
            <GoogleOutlined />
            Login with Google
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
