
using server.BO.Todo;
using server.DAO.Todo;
using server.Services;

namespace server.BLL.Todo
{
    public class TodoBLL
    {

        private readonly TodoDAO _todoDAO;
        private readonly IUserContextService _userContextService;

        public TodoBLL(TodoDAO todoDAO, IUserContextService UserContextService)
        {
            _todoDAO = todoDAO;
            _userContextService = UserContextService;
        }

        public async Task<List<TodoBO>> GetTodosAsync(TodoRequestBO request)
        {
            var todos = await _todoDAO.GetTodosAsync(request);
            return todos;
        }

        public async Task InsertTodoAsync(TodoBO request)
        {
           var userId = _userContextService.GetUserId();
            if (userId == null)
                throw new Exception("Lỗi không xác định được user thêm công việc.");

            await _todoDAO.InsertTodoAsync(request, userId);
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
