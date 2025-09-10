using Npgsql;
using server.BO.User;

namespace server.DAO.User
{
    public class UserDAO
    {
        private readonly IConfiguration _config;
        private readonly string _connectionString;

        public UserDAO(IConfiguration config)
        {
            _config = config;
            _connectionString = _config.GetConnectionString("DefaultConnection");
        }

        public async Task<UserBO> GetUsersAsync(UserRequestBO request)
        {
           using var conn = new NpgsqlConnection(_connectionString);
            await conn.OpenAsync();

            var sql = @"SELECT userid, username, passwordhash, email, createddate, createduser, isdeleted 
                FROM masterdata.pm_users 
                WHERE (username = @username OR email = @username) AND isdeleted = false";

            using var cmd = new NpgsqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("username", request.Username);

            using var reader = await cmd.ExecuteReaderAsync();

            if (await reader.ReadAsync()) 
            {
                return new UserBO
                {
                    UserId = reader.GetInt32(0),
                    Username = reader.GetString(1),
                    PasswordHash = reader.GetString(2),
                    Email = reader.GetString(3),
                    CreatedDate = reader.GetDateTime(4),
                    CreatedUser = reader.GetString(5),
                    IsDeleted = reader.GetBoolean(6)
                };
            }

            return null;
        }
    }
}
