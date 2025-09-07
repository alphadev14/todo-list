using server.BO.User;

namespace server.BO.Todo
{
    public class TodoBO
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public bool IsDone { get; set; } = false;
        public int UserId { get; set; }
        public UserBO User { get; set; }
    }
}
