using Sabio.Models.Domain;
using Sabio.Models.Domain.Modules;
using Sabio.Models.Domain.ShareStories;
using Sabio.Models.Domain.Users;
using Sabio.Models.Requests.Email;
using Sabio.Models.Requests.Users;
using System.Threading.Tasks;

namespace Sabio.Services.Interfaces
{
    public interface IEmailService
    {
        public Task ContactUs(ContactUsRequest model);
        Task SendConfirm(UserAddRequest userModel, TokenAddRequest token);
        Task SendPassReset(UserBase userModel, TokenAddRequest token);
        Task StudentModuleEmail(InitialUser userInfo, Module moduleInfo);
        Task ParentStudentEmail(InitialUser parent, InitialUser studentEmail, TokenAddRequest parentStudentToken);
        Task SendRejectComment(rejectedShareStory model, InitialUser studentInfo);
    }
}