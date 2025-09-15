import React, { useEffect, useState } from "react";
import { Card, Input, Button, Tag, List, Typography, message } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import "./Management.css";
import type { TodoModel, TodoRequestModel } from "../../models/Todo";
import { todoApi } from "../../api/TodoApi";
import { useLoading } from "../../contexts/LoadingContext";

const { Title, Text } = Typography;

const filterOptions = [
  { label: "Tất cả", value: "all" },
  { label: "Chưa hoàn thành", value: "active" },
  { label: "Đã hoàn thành", value: "completed" },
];

const initRequestParam: TodoRequestModel = {
  keyword: "",
  status: "",
  fromDate: new Date(new Date().setDate(-20)),
  toDate: new Date(),
  pageIndex: 1,
  pageSize: 20,
};

const Management: React.FC = () => {
  const { showLoading, hideLoading } = useLoading();
  const [request, setRequest] = useState<TodoRequestModel>(initRequestParam);
  const [todos, setTodos] = useState<TodoModel[]>([]);
  const [title, setTitle] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const onGetTodos = async () => {
    showLoading();
    try {
      const res = await todoApi.getTodos(request);
      console.log(res.data);
      setTodos(res.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      message.error(
        err?.response?.data?.message ||
          "Lỗi lấy dữ liệu danh sách việc cần làm."
      );
    } finally {
      hideLoading();
    }
  };

  useEffect(() => {
    onGetTodos();
  }, []);

  const handleAdd = () => {
    if (!title.trim()) {
      setError("Vui lòng nhập tiêu đề todo!");
      return;
    }
    setTitle("");
    setError("");
    message.success("Thêm todo thành công!");
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
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ marginBottom: 12 }}
        />
        <Button type="default" onClick={handleAdd} style={{ marginRight: 8 }}>
          Thêm todo
        </Button>
        <Button>Thêm mô tả</Button>
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
          <Tag
            key={opt.value}
            color={filter === opt.value ? "#111" : "#e5e7eb"}
            style={{
              color: filter === opt.value ? "#fff" : "#111",
              cursor: "pointer",
              marginLeft: 8,
            }}
            onClick={() => setFilter(opt.value)}
          >
            {opt.label}{" "}
            <span>
              {
                todos.filter((todo) => {
                  if (opt.value === "active") return !todo.completed;
                  if (opt.value === "completed") return todo.completed;
                  return true;
                }).length
              }
            </span>
          </Tag>
        ))}
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
