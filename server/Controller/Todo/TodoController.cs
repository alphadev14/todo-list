using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.BLL.Todo;

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

        [HttpGet]
        public async Task<IActionResult> GetTodos()
        {
            var todos = _todoBLL.GetTodosAsync();
            return Ok(todos);
        } 
    }
}
