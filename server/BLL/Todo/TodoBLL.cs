
using server.BO.Todo;

namespace server.BLL.Todo
{
    public class TodoBLL
    {
        public async Task<List<TodoBO>> GetTodosAsync()
        {
            return new List<TodoBO> { new TodoBO() };
        }
    }
}
