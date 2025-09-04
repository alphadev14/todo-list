import React, { useState } from "react";
import { Card, Input, Button, Tag, List, Typography, message } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import "./Management.css";

const { Title, Text } = Typography;

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

const filterOptions = [
  { label: "Tất cả", value: "all" },
  { label: "Chưa hoàn thành", value: "active" },
  { label: "Đã hoàn thành", value: "completed" },
];

const Management: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const handleAdd = () => {
    if (!title.trim()) {
      setError("Vui lòng nhập tiêu đề todo!");
      return;
    }
    setTodos([...todos, { id: Date.now(), title, completed: false }]);
    setTitle("");
    setError("");
    message.success("Thêm todo thành công!");
  };

  const handleToggle = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const filteredTodos = todos
    .filter((todo) => {
      if (filter === "active") return !todo.completed;
      if (filter === "completed") return todo.completed;
      return true;
    })
    .filter((todo) => todo.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="management-wrapper">
      <div className="management-header">
        <Title level={4}>Xin chào, phan tam!</Title>
        <Text>
          Bạn có {todos.filter((t) => !t.completed).length} todo chưa hoàn thành
          và {todos.filter((t) => t.completed).length} todo đã hoàn thành.
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
        {filteredTodos.length === 0 ? (
          <Text type="secondary">
            Bạn chưa có todo nào.
            <br />
            Hãy thêm todo đầu tiên của bạn ở trên!
          </Text>
        ) : (
          <List
            dataSource={filteredTodos}
            renderItem={(todo) => (
              <List.Item
                style={{ padding: "12px 16px", borderRadius: 4 }}
                actions={[
                  <Tag color={todo.completed ? "success" : "default"}>
                    {todo.completed ? "Đã hoàn thành" : "Chưa hoàn thành"}
                  </Tag>,
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => handleToggle(todo.id)}
                      style={{ marginRight: 8 }}
                    />
                  }
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
