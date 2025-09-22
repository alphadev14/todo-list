import React, { useEffect, useRef, useState } from "react";
import {
  Card,
  Input,
  Button,
  Tag,
  List,
  Typography,
  message,
  Checkbox,
} from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import type { TodoModel, TodoRequestModel } from "../../models/Todo";
import { todoApi } from "../../api/TodoApi";
import { useLoading } from "../../contexts/LoadingContext";
import type { BaseButtonProps } from "antd/es/button/button";
import axios from "axios";
import "./Management.css";

const { Title, Text } = Typography;

const filterOptions = [
  { label: "Tất cả", value: "", color: "blue" },
  { label: "Chưa hoàn thành", value: "PENDING", color: "danger" },
  { label: "Đã hoàn thành", value: "DONE", color: "green" },
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
  const [error, setError] = useState("");
  const timeoutRef = useRef<number | null>(null);

  const onChangeFilter = ({
    field,
    value,
  }: {
    field: string;
    value: string | number | null;
  }) => {
    console.log({
      field,
      value,
    });
    setRequest((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const onGetTodos = async (params?: TodoRequestModel) => {
    showLoading();
    try {
      const q = params ?? request;
      const res = await todoApi.getTodos(q);
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
    onGetTodos(request);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request.status]);

  const onAddTodo = async () => {
    if (!createTodo.title.trim()) {
      setError("Vui lòng nhập tiêu đề todo!");
      return;
    }
    try {
      await todoApi.InsertTodo(createTodo);
      setError("");
      message.success("Thêm todo thành công!");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message ?? "Có lỗi xảy ra");
      } else {
        setError("Lỗi không xác định");
      }
    } finally {
      hideLoading();
      await onGetTodos(request);
    }
  };

  const onUpdateStatusTodo = async (todo: TodoModel) => {
    showLoading();
    try {
      await todoApi.UpdateStatusTodo(todo);
      message.success("Cập nhật trạng thái công việc thành công");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message ?? "Có lỗi xảy ra");
      } else {
        setError("Lỗi không xác định");
      }
    } finally {
      hideLoading();
      await onGetTodos(request);
    }
  };

  // useEffect: debounce khi request.keyword (hoặc những filter khác) thay đổi
  useEffect(() => {
    // nếu muốn debounce cho nhiều filter cùng lúc thì thêm vào dependency array
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // dùng snapshot của request (lấy giá trị hiện tại từ closure)
    const snapshot = { ...request };

    timeoutRef.current = window.setTimeout(() => {
      onGetTodos(snapshot);
      timeoutRef.current = null;
    }, 500); // delay debounce

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [request.keyword]);

  return (
    <div className="management-wrapper">
      <div className="management-header">
        <Title level={4}>Xin chào, phan tam!</Title>
        <Text>
          Bạn có {todos.filter((t) => t.status == "PENDING").length} todo chưa
          hoàn thành và {todos.filter((t) => t.status == "DONE").length} todo đã
          hoàn thành.
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
        value={request.keyword}
        onChange={(e) =>
          onChangeValue({ field: "keyword", value: e.target.value })
        }
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
              fontWeight: request.status === opt.value ? "bold" : "600",
            }}
            onClick={() =>
              onChangeFilter({ field: "status", value: opt.value })
            }
          >
            {opt.label}{" "}
            <span>
              {
                todos.filter((todo) => {
                  if (opt.value === "PENDING") return todo.status != "DONE";
                  if (opt.value === "DONE") return todo.status == "DONE";
                  return true;
                }).length
              }
            </span>
          </Button>
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
                  <Tag color={todo.status == "DONE" ? "success" : "warning"}>
                    {todo.status == "DONE"
                      ? "Đã hoàn thành"
                      : "Chưa hoàn thành"}
                  </Tag>,
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Checkbox
                      onChange={() => onUpdateStatusTodo(todo)}
                      checked={todo.status == "DONE"}
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
