using Microsoft.AspNetCore.Mvc;
using server.BLL.Auth;
using server.BO.Auth;

namespace server.Controller.Auth
{
    [ApiController]
    [Route("/api/v1/[controller]/[action]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthBLL _authBLL;
        public AuthController(AuthBLL authBLL)
        {
            _authBLL = authBLL;
        }

        [HttpPost]
        public async Task<IActionResult> Login([FromBody] LoginRequestBO request)
        {
            var result = await _authBLL.LoginAsync(request);

            if (result.Success)
                return Ok(result);

            return Unauthorized(new {message = result.ErrorMessage});
        }
    }
}
