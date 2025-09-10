using server.BO.User;
using server.DAO.User;

namespace server.BLL.User
{
    public class UserBLL
    {
        private readonly UserDAO _userDAO;

        public UserBLL(UserDAO userDAO)
        {
            _userDAO = userDAO;
        }

        public async Task<UserBO> GetUsersAsync(UserRequestBO request)
        {
            return await _userDAO.GetUsersAsync(request);
        }
    }
}
