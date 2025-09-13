import AxiosClient from "./AxiosClient";

export const todoApi = {
  getTodos: () => AxiosClient.get("/todos"),
  createTodo: (data: { title: string; completed: boolean }) =>
    AxiosClient.post("/todos", data),
}