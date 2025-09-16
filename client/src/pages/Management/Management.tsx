import React, { useEffect, useState } from "react";
import { Card, Input, Button, Tag, List, Typography, message } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import "./Management.css";
import type { TodoModel, TodoRequestModel } from "../../models/Todo";
import { todoApi } from "../../api/TodoApi";
import { useLoading } from "../../contexts/LoadingContext";
import type { BaseButtonProps } from "antd/es/button/button";
import axios from "axios";

const { Title, Text } = Typography;

const filterOptions = [
  { label: "Tất cả", value: "all", color: "blue" },
  { label: "Chưa hoàn thành", value: "active", color: "danger" },
  { label: "Đã hoàn thành", value: "completed", color: "green" },
];

const initRequestParam: TodoRequestModel = {
  keyword: "",
  status: "",
  fromDate: new Date(new Date().setDate(-20)),
  toDate: new Date(),
  pageIndex: 1,
  pageSize: 20,
};

const initTodo: TodoModel = {
  title: "",
  description: "",
  todoId: 0,
  status: "",
  priorty: 0,
  dueDate: new Date(new Date().setDate(7)),
};

const Management: React.FC = () => {
  const { showLoading, hideLoading } = useLoading();
  const [request, setRequest] = useState<TodoRequestModel>(initRequestParam);
  const [createTodo, setCreateTodo] = useState<TodoModel>(initTodo);
  const [todos, setTodos] = useState<TodoModel[]>([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const onChangeFilter = () => {
    setRequest(initRequestParam);
  };

  const onGetTodos = async () => {
    showLoading();
    try {
      const res = await todoApi.getTodos(request);
      console.log(res.data);
      setTodos(res.data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message ?? "Có lỗi xảy ra");
      } else {
        setError("Lỗi không xác định");
      }
    } finally {
      hideLoading();
    }
  };

  const onChangeValue = ({
    field,
    value,
  }: {
    field: string;
    value: string | number | null;
  }) => {
    setCreateTodo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(() => {
    onGetTodos();
  }, []);

  const onAddTodo = async () => {
    if (!createTodo.title.trim()) {
      setError("Vui lòng nhập tiêu đề todo!");
      return;
    }
    try {
      await todoApi.InsertTodo(createTodo);
      setError("");
      message.success("Thêm todo thành công!");
      await onGetTodos();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message ?? "Có lỗi xảy ra");
      } else {
        setError("Lỗi không xác định");
      }
    } finally {
      hideLoading();
    }
  };

  return (
    <div className="management-wrapper">
      <div className="management-header">
        <Title level={4}>Xin chào, phan tam!</Title>
        <Text>
          Bạn có {todos.filter((t) => !t.status).length} todo chưa hoàn thành và{" "}
          {todos.filter((t) => t.status).length} todo đã hoàn thành.
        </Text>
      </div>
      <Card
        className="management-card"
        title={
          <span>
            <PlusOutlined /> Thêm todo mới
          </span>
        }
      >
        <Input
          placeholder="Nhập tiêu đề todo..."
          value={createTodo.title}
          onChange={(e) =>
            onChangeValue({ field: "title", value: e.target.value })
          }
          style={{ marginBottom: 12 }}
        />
        <Input
          placeholder="Nhập mô tả..."
          value={createTodo.description}
          onChange={(e) =>
            onChangeValue({ field: "description", value: e.target.value })
          }
          style={{ marginBottom: 12 }}
        />
        <Button color="green" variant="solid" onClick={onAddTodo}>
          Thêm todo
        </Button>
        {error && <div className="management-error">{error}</div>}
      </Card>
      <Input
        prefix={<SearchOutlined />}
        placeholder="Tìm kiếm todos..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ margin: "24px 0 12px 0" }}
        className="management-search"
      />
      <div className="management-filter">
        <span>Lọc:</span>
        {filterOptions.map((opt) => (
          <Button
            key={opt.value}
            color={opt.color as BaseButtonProps["color"]}
            variant="filled"
            style={{
              cursor: "pointer",
              marginLeft: 8,
              fontWeight: filter === opt.value ? "bold" : "600",
            }}
            onClick={() => setFilter(opt.value)}
          >
            {opt.label}{" "}
            <span>
              {
                todos.filter((todo) => {
                  if (opt.value === "active") return !todo.status;
                  if (opt.value === "completed") return todo.status;
                  return true;
                }).length
              }
            </span>
          </Button>
        ))}
        <Button onClick={onChangeFilter}></Button>
      </div>
      <Card style={{ marginTop: 16, maxWidth: 800, width: "100%" }}>
        {todos.length === 0 ? (
          <Text type="secondary">
            Bạn chưa có todo nào.
            <br />
            Hãy thêm todo đầu tiên của bạn ở trên!
          </Text>
        ) : (
          <List
            dataSource={todos}
            renderItem={(todo) => (
              <List.Item
                style={{ padding: "12px 16px", borderRadius: 4 }}
                actions={[
                  <Tag color={todo.status ? "success" : "default"}>
                    {todo.status ? "Đã hoàn thành" : "Chưa hoàn thành"}
                  </Tag>,
                ]}
              >
                <List.Item.Meta
                  avatar={<input type="checkbox" style={{ marginRight: 8 }} />}
                  title={todo.title}
                />
              </List.Item>
            )}
          />
        )}
      </Card>
    </div>
  );
};

export default Management;
