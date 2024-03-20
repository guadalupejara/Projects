using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Domain.ParentStudent;
using Sabio.Models.Domain.Users;
using Sabio.Models.Requests.Users;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace Sabio.Services.Interfaces
{
    public interface IUserService
    {
        bool ChangePassword(PasswordUpdateRequest userPassUpdate);
        bool ConfirmAccount(string token);
        int Create(UserAddRequest model);
        UserBase ForgotPassTokenRequest(string email);
        User FullUserMapper(IDataReader reader, out int index);
        InitialUser InitialUserMapper(IDataReader reader, ref int index);
        void InsertUserToken(int userId, TokenAddRequest tokenReq);
        Task<bool> LogInAsync(LogInAddRequest model);
        string ParentStudentAdd(int pId, int sId);
        void ParentStudentDelete(int pId, int sId);
        List<User> SelectAll();
        InitialUser SelectById(int id);
        void UpdateAvatar(string avatarUrl, int id);
        void ParentStudentConfirmUpdate(string relationshipId);
        Paged<ParentStudent> ParentStudentPaginate(int pageIndex, int pageSize);
        void UpdateUserInfo(BaseUserProfileUpdateRequest model, int userId);
        void UpdateUserStatus(int id, int statusId);
        List<ParentStudent> SelectByIsConfirmed(bool isConfirmedValue);
        public List<ParentStudentUsersTable> SelectByParentId(int Id);
        public List<ParentStudentUsersTable> SelectByStudentId(int Id);
        public void ParentStudentToken(InitialUser parentData, string studentEmail);
        public List<ParentStudentExpirationRequest> ById(int StudentId); //will fix in a min


    }
}