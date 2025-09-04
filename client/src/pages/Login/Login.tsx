import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Form, Input, Button, Typography, Alert } from "antd";
import "./Login.css";

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onFinish = (values: { email: string; password: string }) => {
    setLoading(true);
    setError("");
    setSuccess("");
    setTimeout(() => {
      if (values.email === "test@email.com" && values.password === "123456") {
        setSuccess("Đăng nhập thành công!");
      } else {
        setError("Email hoặc mật khẩu không đúng!");
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="login-wrapper">
      <Form className="login-form" layout="vertical" onFinish={onFinish}>
        <Title level={2} className="login-title">
          Đăng nhập
        </Title>
        <Text className="login-desc">
          Đăng nhập vào tài khoản của bạn để quản lý todos
        </Text>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Vui lòng nhập email!" }]}
        >
          <Input placeholder="your@email.com" type="email" />
        </Form.Item>
        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
        >
          <Input.Password placeholder="********" />
        </Form.Item>
        {error && (
          <Alert
            type="error"
            message={error}
            showIcon
            style={{ marginBottom: 8 }}
          />
        )}
        {success && (
          <Alert
            type="success"
            message={success}
            showIcon
            style={{ marginBottom: 8 }}
          />
        )}
        <Form.Item>
          <Button
            type="primary"
            color="cyan"
            variant="solid"
            htmlType="submit"
            block
            loading={loading}
            className="login-btn"
          >
            Đăng nhập
          </Button>
        </Form.Item>
        <div className="login-bottom">
          <span>Chưa có tài khoản? </span>
          <Link to="/register" className="login-link">
            Đăng ký ngay
          </Link>
        </div>
      </Form>
    </div>
  );
};

export default Login;
