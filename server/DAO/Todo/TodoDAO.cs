using Npgsql;
using server.BO.Todo;

namespace server.DAO.Todo
{
    public class TodoDAO
    {
        private readonly IConfiguration _config;
        private readonly string _connectionString;

        public TodoDAO (IConfiguration config)
        {
            _config = config;
            _connectionString = _config.GetConnectionString("DefaultConnection");
        }

        public async Task<List<TodoBO>> GetTodosAsync(TodoRequestBO request, int userId)
        {
            var todos = new List<TodoBO>();
            using var conn = new NpgsqlConnection(_connectionString);
            await conn.OpenAsync();

            var sql = @"SELECT 
                            todoid, 
                            title, 
                            description, 
                            status, 
                            priorty, 
                            duedate, 
                            createddate, 
                            createduser 
                        FROM data.pm_todos 
                        WHERE isdeleted = false AND createduser = @userid";

           // Build điều kiện
            if (!string.IsNullOrEmpty(request.Keyword))
                sql += " AND (title ILIKE @keyword OR description ILIKE @keyword)";

            if (!string.IsNullOrEmpty(request.Status))
                sql += " AND status = @status";

            if (request.FromDate != DateTime.MinValue && request.ToDate != DateTime.MinValue)
                sql += " AND createddate BETWEEN @fromDate AND @toDate";

            // Phân trang
            sql += " ORDER BY createddate DESC LIMIT @pageSize OFFSET @offset";

            using var cmd = new NpgsqlCommand(sql, conn);

            // Bind parameters
            if (!string.IsNullOrEmpty(request.Keyword))
                cmd.Parameters.AddWithValue("keyword", request.Keyword);

            if (!string.IsNullOrEmpty(request.Status))
                cmd.Parameters.AddWithValue("status", request.Status);
            if (request.FromDate != DateTime.MinValue && request.ToDate != DateTime.MinValue)
            {
                cmd.Parameters.AddWithValue("fromDate", request.FromDate);
                cmd.Parameters.AddWithValue("toDate", request.ToDate);
            }
            cmd.Parameters.AddWithValue("userid", userId.ToString());
            cmd.Parameters.AddWithValue("pageSize", request.PageSize);
            cmd.Parameters.AddWithValue("offset", (request.PageIndex - 1) * request.PageSize);

            using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync()) 
            {
                todos.Add(new TodoBO
                {
                    TodoId = reader.GetInt32(0),
                    Title = reader.GetString(1),
                    Description = reader.GetString(2),
                    Status = reader.GetString(3),
                    Priority = reader.GetInt32(4),
                    DueDate = reader.GetDateTime(5),    
                    CreatedDate = reader.GetDateTime(6),
                    CreatedUser = reader.GetString(7)
                });
            }

            return todos;
        }

        public async Task InsertTodoAsync(TodoBO request, int userId)
        {
            using var conn = new NpgsqlConnection(_connectionString);
            await conn.OpenAsync();

            var sql = @"INSERT into data.pm_todos (title, description, status, priorty, duedate, createduser) VALUES (@title, @description, @status, @priorty, @duedate, @createduser)";

            using var cmd = new NpgsqlCommand(sql, conn);
            // Bind parameters
            cmd.Parameters.AddWithValue("title", request.Title);
            cmd.Parameters.AddWithValue("description", (object?)request.Description ?? DBNull.Value);
            cmd.Parameters.AddWithValue("status", "PENDING");
            cmd.Parameters.AddWithValue("priorty", request.Priority);
            cmd.Parameters.AddWithValue("duedate", (object?)request.DueDate ?? DBNull.Value);
            cmd.Parameters.AddWithValue("createduser", userId);

            await cmd.ExecuteNonQueryAsync();
        }

        public async Task UpdateStatusTodoAsync(TodoBO request, int userId)
        {
            using var conn = new NpgsqlConnection(_connectionString);
            await conn.OpenAsync();

            var sql = @"UPDATE data.pm_todos SET status = @status, updateduser = @updateduser, updateddate = @updateddate WHERE todoid = @todoid AND isdeleted = false";

            using var cmd = new NpgsqlCommand(sql, conn);

            var statusUpdate = request.Status == TodoStatus.PENDING.ToString() ? TodoStatus.DONE.ToString() : TodoStatus.PENDING.ToString();

            //Bind parameters
            cmd.Parameters.AddWithValue("status", statusUpdate);
            cmd.Parameters.AddWithValue("updateduser", userId);
            cmd.Parameters.AddWithValue("updateddate", DateTime.Now);
            cmd.Parameters.AddWithValue("todoid", request.TodoId);

            await cmd.ExecuteNonQueryAsync();
        }
    }
}
