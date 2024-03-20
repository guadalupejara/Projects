using Sabio.Models;
using Sabio.Models.Domain.Comments;
using Sabio.Models.Requests.Comments;
using System.Collections.Generic;

namespace Sabio.Services.Interfaces
{
    public interface ICommentService
    {
        List<Comment> GetByEntityId(int entityTypeId, int entityId);
        int Add(CommentAddRequest model, int createdById, int parentId);
        void Update(CommentUpdateRequest model, int id);
        void Delete(int id);
    }
}