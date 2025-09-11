using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.BLL.Todo;
using server.BO.Todo;

namespace server.Controller.Todo
{
    [ApiController]
    [Route("api/v1/[controller]/[action]")]
    [Authorize]
    public class TodoController : ControllerBase
    {
        private readonly TodoBLL _todoBLL;
        public TodoController(TodoBLL todoBLL)
        {
            _todoBLL = todoBLL;
        }

        [HttpPost]
        public async Task<IActionResult> GetTodos([FromBody] TodoRequestBO request)
        {
            var todos = await _todoBLL.GetTodosAsync(request);
            return Ok(todos);
        }

        [HttpPost]
        public async Task InsertTodo([FromBody] TodoBO request)
        {
            await _todoBLL.InsertTodoAsync(request);
        }

        [HttpPost]
        public async Task InsertMutilTodo([FromBody] List<TodoBO> request)
        {
            await _todoBLL.InsertMutilTodoAsync(request);
        }

        [HttpPost]
        public async Task UpdateStatusTodo([FromBody] List<TodoBO> request)
        {
            await _todoBLL.UpdateStatusTodoAsync(request);
        }
    }
}
