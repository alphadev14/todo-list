using Npgsql;
using server.BO.User;

namespace server.DAO.Auth
{
    public class AuthDAO
    {
        private readonly IConfiguration _config;
        private readonly string _connectionString;

        public AuthDAO(IConfiguration config)
        {
            _config = config;
            _connectionString = _config.GetConnectionString("DefaultConnection");
        }

        public async Task RegisterAsync(UserBO user)
        {
            using var conn = new NpgsqlConnection(_connectionString);
            await conn.OpenAsync();

            var sql = @"INSERT INTO masterdata.pm_users 
                        (username, passwordhash, email, createduser)
                        VALUES (@username, @passwordhash, @email, @createduser)";

            using var cmd = new NpgsqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("username", user.Username);
            cmd.Parameters.AddWithValue("passwordhash", user.PasswordHash);
            cmd.Parameters.AddWithValue("email", user.Email ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("createduser", user.CreatedUser);

            await cmd.ExecuteNonQueryAsync();
        }
    }
}
