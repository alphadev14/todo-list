
using server.BO.Todo;
using server.DAO.Todo;

namespace server.BLL.Todo
{
    public class TodoBLL
    {

        private readonly TodoDAO _todoDAO;

        public TodoBLL(TodoDAO todoDAO)
        {
            _todoDAO = todoDAO;
        }

        public async Task<List<TodoBO>> GetTodosAsync(TodoRequestBO request)
        {
            var todos = await _todoDAO.GetTodosAsync(request);
            return todos;
        }

        public async Task InsertTodoAsync(TodoBO request)
        {
           
            await _todoDAO.InsertTodoAsync(request);
        }

        public async Task UpdateStatusTodoAsync(List<TodoBO> request)
        {
            throw new NotImplementedException();
        }

        public async Task InsertMutilTodoAsync(List<TodoBO> request)
        {
            throw new NotImplementedException();
        }
    }
}
