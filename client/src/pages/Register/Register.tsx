import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Button, Typography, Alert, message } from "antd";
import "./Register.css";
import type { RegisterModel } from "../../models/Auth";
import { AuthApi } from "../../api/authApi";

const { Title, Text } = Typography;

const Register: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigator = useNavigate();

  const onFinish = async (values: RegisterModel) => {
    setLoading(true);
    setError("");
    setSuccess("");

    if (values.password !== values.passwordConfirm) {
      message.error("Mật khẩu không khớp, vui lòng kiểm tra lại.");
      setLoading(false);
      return;
    }

    try {
      const res = await AuthApi.register(values);
      setSuccess(res.data.message || "Đăng ký thành công!");

      // Chuyển về trang login
      setTimeout(() => {
        navigator("/login");
      }, 1000);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Có lỗi xảy ra, vui lòng thử lại!";
      message.error(errorMsg);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
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
          label="Tên đăng nhập"
          name="username"
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
          name="passwordConfirm"
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
