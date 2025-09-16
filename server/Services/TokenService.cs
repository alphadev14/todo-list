using Microsoft.IdentityModel.Tokens;
using server.BO.User;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace server.Services
{
    public class TokenService : ITokenService
    {
        private readonly IConfiguration _config;

        public TokenService(IConfiguration config)
        {
            _config = config;
        }

        public string GenerateJwtToken(int userId, string userName, IEnumerable<Claim>? extraClaims = null)
        {
            // lấy thông tin từ config
            var jwtKey = _config["Jwt:Key"] ?? "super-secret-key-123";
            var jwtIssuer = _config["Jwt:Issuer"] ?? "todo-api";

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                        // Dùng để lấy UserId trong code
                new Claim(ClaimTypes.NameIdentifier, userId.ToString()),

                // Dùng để map vào HttpContext.User.Identity.Name
                new Claim(ClaimTypes.Name, userName),

                // Role (ASP.NET Core sẽ map đúng vào User.IsInRole)
                new Claim(ClaimTypes.Role, userName == "admin" ? "Admin" : "User"),

                // Unique ID của token
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            };


            if (extraClaims != null) 
            { 
                claims.AddRange(extraClaims);
            }

            var token = new JwtSecurityToken(
                issuer: jwtIssuer,
                audience: null,
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
