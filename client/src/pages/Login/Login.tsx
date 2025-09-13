import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Form, Input, Button, Typography, Alert } from "antd";
import "./Login.css";
import type { LoginModel } from "../../models/Auth";
import { AuthApi } from "../../api/authApi";

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onFinish = async (values: LoginModel) => {
    setLoading(true);
    console.log("Received values of form: ", values);
    try {
      const response = await AuthApi.login(values);
      setSuccess("Đăng nhập thành công!");
      setError("");
      console.log("reponse in line 22: ", response);

      // Lưu token vào localStorage
      localStorage.setItem("token", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);

      // Redirect về trang home
      window.location.href = "/";

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || "Đăng nhập thất bại!");
      setSuccess("");
    }
    setLoading(false);
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
          label="Tăn đăng nhập hoặc email"
          name="username"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tên đăng nhập hoặc email!",
            },
          ]}
        >
          <Input placeholder="Tên đăng nhập hoặc email" type="username" />
        </Form.Item>
        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
        >
          <Input.Password placeholder="Mật khẩu" />
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
