using Microsoft.AspNetCore.Mvc;
using server.BO.Auth;
using server.Services;

namespace server.BLL.Auth
{
    public class AuthBLL
    {
        private readonly ITokenService _tokenService;

        public AuthBLL(ITokenService tokenService)
        {
            _tokenService = tokenService;
        }

       public async Task<LoginResultBO> LoginAsync(LoginRequestBO request)
        {
            if (request.Username == "admin" && request.Password == "123456")
            {
                var token = _tokenService.GenerateJwtToken(request.Username);
                return new LoginResultBO 
                { 
                    Success = true,
                    Token = token,
                };
            }

            return new LoginResultBO 
            { 
                Success = false,
                ErrorMessage = "Tên đăng nhập hoặc mật khẩu sai, vui lòng kiểm tra lại"
            };
        }
    }
}
