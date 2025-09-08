using Microsoft.AspNetCore.Mvc;
using server.BO;
using server.BO.Auth;
using server.BO.User;
using server.DAO.Auth;
using server.Services;
using System.Net.WebSockets;

namespace server.BLL.Auth
{
    public class AuthBLL
    {
        private readonly ITokenService _tokenService;
        private readonly AuthDAO _authDAO;

        public AuthBLL(ITokenService tokenService, AuthDAO authDAO)
        {
            _tokenService = tokenService;
            _authDAO = authDAO;
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

        public async Task<ResultBO> RegisterAsync(RegisterRequestBO request)
        {
            // Kiểm tra thông tin user
            // Mã hóa password
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password);

            var user = new UserBO
            {
                Username = request.Username,
                PasswordHash = hashedPassword,
                Email = request.Email,
                CreatedUser = "admin"
            };

            await _authDAO.RegisterAsync(user);

            return new ResultBO { Success = true, Message = "Đăng kí tài khoản thành công." };
        }
    }
}
