import type { TodoRequestModel } from "../models/Todo";
import AxiosClient from "./AxiosClient";

export const todoApi = {
  getTodos: (request: TodoRequestModel) => AxiosClient.post("Todo/GetTodos", request),
  createTodo: (data: { title: string; completed: boolean }) =>
    AxiosClient.post("/todos", data),
}