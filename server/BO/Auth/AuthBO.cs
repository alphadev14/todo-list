namespace server.BO.Auth
{
    public class LoginRequestBO
    {
        public string Username { get; set; } = "";
        public string Password { get; set; } = "";
    }

    public class LoginResultBO
    {
        public bool Success { get; set; }
        public string? AccessToken { get; set; }
        public string? RefreshToken { get; set; }
        public string? ErrorMessage { get; set; }
    }

    public class RefreshTokenBO
    {
        public int TokenId { get; set; }             // Khóa chính
        public string Username { get; set; }         // Liên kết tới pm_users(username)
        public string RefreshToken { get; set; }       // Giá trị token
        public DateTime ExpiresDate { get; set; }    // Thời gian hết hạn
        public DateTime? RevokedDate { get; set; }   // Thời gian bị thu hồi
        public string? CreatedUser { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public bool IsDeleted { get; set; } = false;
    }

    public class  RegisterRequestBO
    {
        public string Password { get; set; }
        public string Username { get; set; }
        public string PasswordConfirm { get; set; }
        public string Email { get; set; }
    }
}