export interface TodoModel {
  todoId: number;
  title: string;
  description: string;
  status: string;
  priorty: number;
  dueDate: Date;
  createdDate: Date;
  createdUser: string;
  updatedDate: Date;
  updatedUser: string;
  deletedDate: Date;
  deletedUser: string;
}

export interface TodoRequestModel {
  keyword: string;
  status: string;
  fromDate: Date;
  toDate: Date;
  pageIndex: number;
  pageSize: number;
}