using Npgsql;
using server.BO;
using server.BO.Auth;
using server.BO.User;
using server.DAO.Auth;
using server.DAO.User;
using server.Services;

namespace server.BLL.Auth
{
    public class AuthBLL
    {
        private readonly IConfiguration _config;
        private readonly string _connectionString;
        private readonly ITokenService _tokenService;
        private readonly AuthDAO _authDAO;
        private readonly UserDAO _userDAO;

        public AuthBLL(ITokenService tokenService, AuthDAO authDAO, UserDAO userDAO, IConfiguration config)
        {
            _tokenService = tokenService;
            _authDAO = authDAO;
            _userDAO = userDAO;
            _config = config;
            _connectionString = _config.GetConnectionString("DefaultConnection");
        }

        public async Task<LoginResultBO> LoginAsync(LoginRequestBO request)
        {
            // Kiểm tra user đã tồn tại hay chưa
            var userRequest = new UserRequestBO() { Username = request.Username };
            var user = await _userDAO.GetUsersAsync(userRequest);

            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                return new LoginResultBO() { Success = false, ErrorMessage = "Tên đăng nhập hoặc mật khẩu không đúng. Vui lòng kiểm tra lại thông tin đăng nhập" };

            // Tạo access token 
            var accessToken = _tokenService.GenerateJwtToken(user.UserId, request.Username);

            // Tạo refresh token
            var refreshToken = Guid.NewGuid().ToString("N");
            var refreshTokenParam = new RefreshTokenBO()
            {
                Username = request.Username,
                RefreshToken = refreshToken,
                ExpiresDate = DateTime.UtcNow.AddDays(8).AddMilliseconds(-1),
                CreatedUser = request.Username
            };

            // Insert refresh token
            await InsertRefreshTokenAsync(refreshTokenParam);

            return new LoginResultBO() { Success = true, AccessToken = accessToken, RefreshToken = refreshToken };
        }

        private async Task InsertRefreshTokenAsync(RefreshTokenBO refreshTokenParam)
        {
            using var conn = new NpgsqlConnection(_connectionString);
            await conn.OpenAsync();

            var sql = @"INSERT INTO masterdata.pm_refreshtokens (username, refreshtoken, expiresdate, createduser)                     VALUES (@username, @refreshtoken, @expiresdate, @createduser)";

            using var cmd = new NpgsqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("username", refreshTokenParam.Username);
            cmd.Parameters.AddWithValue("refreshtoken", refreshTokenParam.RefreshToken);
            cmd.Parameters.AddWithValue("expiresdate", refreshTokenParam.ExpiresDate);
            cmd.Parameters.AddWithValue("createduser", refreshTokenParam.Username);

            await cmd.ExecuteNonQueryAsync();
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
