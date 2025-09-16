using System.Security.Claims;

namespace server.Services
{
    public class UserContextService : IUserContextService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UserContextService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public int GetUserId()
        {
            var userId = _httpContextAccessor.HttpContext?.User?
                .FindFirst(ClaimTypes.NameIdentifier)?.Value;

            return userId != null ? int.Parse(userId) : 0;
        }

        public string GetUsername()
        {
            return _httpContextAccessor.HttpContext?.User?
                .Identity?.Name ?? string.Empty;
        }
    }
}
