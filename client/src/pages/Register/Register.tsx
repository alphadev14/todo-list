import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Form, Input, Button, Typography, Alert } from "antd";
import "./Register.css";

const { Title, Text } = Typography;

const Register: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onFinish = (values: {
    name: string;
    email: string;
    password: string;
    confirm: string;
  }) => {
    setLoading(true);
    setError("");
    setSuccess("");
    setTimeout(() => {
      if (values.password !== values.confirm) {
        setError("Mật khẩu xác nhận không khớp!");
      } else {
        setSuccess("Đăng ký thành công!");
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="register-wrapper">
      <Form className="register-form" layout="vertical" onFinish={onFinish}>
        <Title level={2} className="register-title">
          Đăng ký
        </Title>
        <Text className="register-desc">
          Tạo tài khoản mới để bắt đầu quản lý todos
        </Text>
        <Form.Item
          label="Tên"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
        >
          <Input placeholder="Tên của bạn" />
        </Form.Item>
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
        <Form.Item
          label="Xác nhận mật khẩu"
          name="confirm"
          rules={[{ required: true, message: "Vui lòng xác nhận mật khẩu!" }]}
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
            htmlType="submit"
            color="green"
            variant="solid"
            block
            loading={loading}
            className="register-btn"
          >
            Đăng ký
          </Button>
        </Form.Item>
        <div className="register-bottom">
          <span>Đã có tài khoản? </span>
          <Link to="/login" className="register-link">
            Đăng nhập ngay
          </Link>
        </div>
      </Form>
    </div>
  );
};

export default Register;
