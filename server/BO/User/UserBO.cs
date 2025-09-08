using server.BO.Todo;

namespace server.BO.User
{
    public class UserBO
    {
        public int UserId { get; set; }             // Khóa chính
        public string Username { get; set; }    // Tên đăng nhập
        public string PasswordHash { get; set; } // Mật khẩu đã hash
        public string Email { get; set; }
        public DateTime CreatedDate { get; set; }
        public string CreatedUser { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public string? UpdatedUser { get; set; }
        public DateTime? DeletedDate { get; set; }
        public string? DeletedUser { get; set; }
        public bool IsDeleted { get; set; } = false;
    }

}
