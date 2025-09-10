using Microsoft.AspNetCore.Mvc;
using server.BLL.User;
using server.BO.User;

namespace server.Controller.User
{
    [ApiController]
    [Route("/api/v1/[controller]/[action]")]
    public class UserController : ControllerBase
    {
        private readonly UserBLL _userBLL;

        public UserController(UserBLL userBLL) 
        {
            _userBLL = userBLL;
        }

        [HttpPost]
        public async Task<IActionResult> GetUsers([FromBody] UserRequestBO request)
        {
            var user = await _userBLL.GetUsersAsync(request);
            if (user != null)
            {
                return Ok(user);
            }
            
            return NoContent();
        }
    }
}
