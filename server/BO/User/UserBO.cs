using server.BO.Todo;

namespace server.BO.User
{
    public class UserBO
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string Role { get; set; } = "USER"; // USER, ADMIN
        public List<TodoBO> Todos { get; set; }
    }

}
