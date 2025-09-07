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
        public string? Token { get; set; }
        public string? ErrorMessage { get; set; }
    }
}