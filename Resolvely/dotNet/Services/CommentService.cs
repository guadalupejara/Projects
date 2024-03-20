using Newtonsoft.Json;
using Sabio.Data;
using Sabio.Data.Extensions;
using Sabio.Data.Providers;
using Sabio.Models.Domain.Comments;
using Sabio.Models.Domain.Users;
using Sabio.Models.Requests.Comments;
using Sabio.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace Sabio.Services
{
    public class CommentService : ICommentService
    {
        IDataProvider _data = null;

        public CommentService(IDataProvider data)
        {
            _data = data;
        }

        public List<Comment> GetByEntityId(int entityTypeId, int entityId)
        {
            string procName = "[dbo].[Comments_Select_ByEntityId]";
            Comment singleComment = null;
            List<Comment> commentList = null;
            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@EntityTypeId", entityTypeId);
                col.AddWithValue("@EntityId", entityId);

            }, singleRecordMapper: delegate (IDataReader reader, short set)

            {
                int startingIndex = 0;
                singleComment = new Comment();

                if (commentList == null)
                {
                    commentList = new List<Comment>();
                }

                singleComment.Id = reader.GetSafeInt32(startingIndex++);
                singleComment.Subject = reader.GetSafeString(startingIndex++);
                singleComment.Text = reader.GetSafeString(startingIndex++);
                singleComment.ParentId = reader.GetSafeInt32(startingIndex++);
                singleComment.EntityId = reader.GetSafeInt32(startingIndex++);
                singleComment.EntityTypeId = reader.GetSafeInt32(startingIndex++);
                singleComment.EntityName = reader.GetSafeString(startingIndex++);
                singleComment.CreatedBy = reader.DeserializeObject<BaseUser>(startingIndex++);
                singleComment.DateCreated = reader.GetSafeDateTime(startingIndex++);
                singleComment.DateModified = reader.GetSafeDateTime(startingIndex++);
                singleComment.Replies = reader.DeserializeObject<List<Reply>>(startingIndex++);



                commentList.Add(singleComment);


            });
            return commentList;

        }
        public int Add(CommentAddRequest model, int createdById, int parentId)
        {
            int id = 0;
            string procName = "[dbo].[Comments_Insert]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Subject", model.Subject);
                col.AddWithValue("@Text", model.Text);
                col.AddWithValue("@ParentId", parentId);
                col.AddWithValue("@EntityTypeId", model.EntityTypeId);
                col.AddWithValue("@EntityId", model.EntityId);
                col.AddWithValue("@CreatedBy", createdById);

                SqlParameter idOut = new SqlParameter("@Id", System.Data.SqlDbType.Int);

                idOut.Direction = ParameterDirection.Output;
                col.Add(idOut);
            },
            returnParameters: delegate (SqlParameterCollection returCol)
            {
                object oId = returCol["@Id"].Value;
                int.TryParse(oId.ToString(), out id);
            }
            );
            return id;
        }

        public void Update(CommentUpdateRequest model, int id)
        {
            string procName = "[dbo].[Comments_Update]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Id", id);
                col.AddWithValue("@Subject", model.Subject);
                col.AddWithValue("@Text", model.Text);
            });
        }

        public void Delete(int id)
        {
            string procName = "[dbo].[Comments_Delete_ById]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Id", id);
            });


        }

    }
}
