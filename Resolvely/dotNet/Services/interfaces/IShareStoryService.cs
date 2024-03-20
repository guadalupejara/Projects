using Sabio.Models;
using Sabio.Models.Domain.ShareStories;
using Sabio.Models.Requests;
using System.Collections.Generic;

namespace Sabio.Services
{
    public interface IShareStoryService
    {
        int Add(ShareStoryAddRequest model);
        void Delete(int id);
        ShareStory Get(int Id);
        List<ShareStory> GetAll();
        public List<ShareStoryFile> GetAllFiles();
        Paged<ShareStory> SelectAllPaginated(int pageIndex, int pageSize, bool IsApproved);
        void Update(ShareStoryUpdateRequest model);
        void UpdateByIsApproved(ShareStoryUpdateRequest model);

        public void rejectEmail(rejectedShareStory story);
    }
}
