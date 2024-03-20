using Newtonsoft.Json;
using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain.ShareStories;
using Sabio.Models.Domain.Surveys;
using Sabio.Models.Domain.Users;
using Sabio.Models.Requests;
using Sabio.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services
{
    public class ShareStoryService : IShareStoryService
    {
        IDataProvider _data = null;
        private IUserService _user = null;
        private IEmailService _emailService =null;

        public ShareStoryService(IDataProvider data, IUserService user, IEmailService emailService)
        {
            _data = data;
            _user = user;
            _emailService = emailService;
        }

        public void Delete(int id)
        {
            string procName = "[dbo].[ShareStory_Delete_ById]";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection collection)
            {
                collection.AddWithValue("@Id", id);
            },
            returnParameters: null);
        }

        public int Add(ShareStoryAddRequest model)
        {
            int Id = 0;

            string procName = "[dbo].[ShareStory_Insert]";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection collection)
            { AddCommonParams(model, collection);
            
                DataTable batchStoryFilesTable = new DataTable();  
                batchStoryFilesTable.Columns.Add("FileId", typeof(int));

                if (model.BatchShareFiles != null)
                {
                    foreach (int fileId in model.BatchShareFiles)
                    {
                        batchStoryFilesTable.Rows.Add(fileId);
                    }
                }

                SqlParameter batchFilesParam = new SqlParameter("@BatchStoryFiles", SqlDbType.Structured);
                batchFilesParam.Value = batchStoryFilesTable;
                collection.Add(batchFilesParam);  


                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;

                collection.Add(idOut);

            }, returnParameters: delegate (SqlParameterCollection returnCollection)
            {
                object oId = returnCollection["@Id"].Value;

                int.TryParse(oId.ToString(), out Id);
            });
            return Id;
        }

        public ShareStory Get(int Id)
        {

            string procName = "[dbo].[ShareStory_Select_ById]";

            ShareStory story = null;

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", Id);
            },
            singleRecordMapper: delegate (IDataReader reader, short set)

            {
                int startingIndex = 0;

                story = MapSingleShareStory(reader, ref startingIndex);
            });
            return story;
        }

        public List<ShareStory> GetAll()
        {
            List<ShareStory> story = null;

            string procName = "[dbo].[ShareStory_SelectAll]";

            _data.ExecuteCmd(procName, inputParamMapper: null,
                singleRecordMapper: delegate (IDataReader reader, short set)
                {

                    int startingIndex = 0;

                    ShareStory anStory = MapSingleShareStory(reader, ref startingIndex);

                    if (story == null)
                    {
                        story = new List<ShareStory>(); 
                    }

                    story.Add(anStory); 

                });
            return story;
        }

        public List<ShareStoryFile> GetAllFiles()
        { 
            List<ShareStoryFile> storyList = null;

            string procName = "[dbo].[ShareStoryFiles_SelectAll]";

            _data.ExecuteCmd(procName, inputParamMapper: null,
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    int startingIndex = 0;
                    ShareStoryFile storyFile = new ShareStoryFile();

                    storyFile.Id = reader.GetSafeInt32(startingIndex++);
                    storyFile.Name = reader.GetSafeString(startingIndex++);
                    storyFile.Email = reader.GetSafeString(startingIndex++);
                    storyFile.Story = reader.GetSafeString(startingIndex++);
                    storyFile.CreatedBy = reader.GetSafeInt32(startingIndex++);
                    storyFile.IsApproved = reader.GetSafeBool(startingIndex++);
                    storyFile.ApprovedBy = reader.GetSafeInt32(startingIndex++);
                    storyFile.DateCreated = reader.GetDateTime(startingIndex++);
                    storyFile.FileId = reader.GetSafeInt32(startingIndex++);
                    storyFile.FileName = reader.GetSafeString(startingIndex++);
                    storyFile.Url = reader.GetSafeString(startingIndex++);

                    if (storyList == null)
                    {
                        storyList = new List<ShareStoryFile>();
                    }
                    storyList.Add(storyFile);
                });
            return storyList;
        }

        public Paged<ShareStory> SelectAllPaginated(int pageIndex, int pageSize, bool IsApproved)
        {

            string procName = "[dbo].[ShareStory_SelectAll_Paginated]";

            Paged<ShareStory> pagedList = null;
            List<ShareStory> list = null;
            int totalCount = 0;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection param)
            {
                param.AddWithValue("@PageIndex", pageIndex);
                param.AddWithValue("@PageSize", pageSize);
                param.AddWithValue("@IsApproved", IsApproved);
            },

                delegate (IDataReader reader, short set)
                {
                    int startingIndex = 0;

                    ShareStory story = MapSingleShareStory(reader, ref startingIndex);

                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(startingIndex++);
                    }

                    if (list == null)
                    {
                        list = new List<ShareStory>();
                    }

                    list.Add(story);
                });

            if (list != null)
            {
                pagedList = new Paged<ShareStory>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }

        public void Update(ShareStoryUpdateRequest model)
        {
            string procName = "[dbo].[ShareStory_Update]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection collection)
            {
                AddCommonParams(model, collection);
                collection.AddWithValue("@Id", model.Id);

                DataTable batchStoryFilesTable = new DataTable();  
                batchStoryFilesTable.Columns.Add("FileId", typeof(int));

                foreach (int fileId in model.BatchShareFiles)
                {
                    batchStoryFilesTable.Rows.Add(fileId);
                }

                SqlParameter batchFilesParam = new SqlParameter("@BatchStoryFiles", SqlDbType.Structured);
                batchFilesParam.Value = batchStoryFilesTable;
                collection.Add(batchFilesParam);  
            },
            returnParameters: null);
        }

        public void UpdateByIsApproved(ShareStoryUpdateRequest model)
        {
            string procName = "[dbo].[ShareStory_Update_isApproved]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection collection)
            {
                collection.AddWithValue("@Id", model.Id);
                collection.AddWithValue("@IsApproved", model.IsApproved);
                collection.AddWithValue("@ApprovedBy", model.ApprovedBy);
            },
            returnParameters: null);
            if (model.IsApproved == false) { 
            ShareStory story = Get(model.Id);
                rejectedShareStory rejectedStory = new rejectedShareStory
                {
                    Story = story,
                    Comment = model.Comment
                };
                rejectEmail(rejectedStory);
            }
        }
   
        public void rejectEmail(rejectedShareStory story)
        {
            InitialUser studentInfo = _user.SelectById(story.Story.CreatedBy);
            _emailService.SendRejectComment(story, studentInfo);
        }
        private static ShareStory MapSingleShareStory(IDataReader reader, ref int startingIndex)
        {
            ShareStory list = new ShareStory();
            //int startingIndex = 0;
            list.Id = reader.GetSafeInt32(startingIndex++);
            list.Name = reader.GetSafeString(startingIndex++);
            list.Email = reader.GetSafeString(startingIndex++);
            list.Story = reader.GetSafeString(startingIndex++);
            list.CreatedBy = reader.GetSafeInt32(startingIndex++);
            list.IsApproved = reader.GetSafeBoolNullable(startingIndex++);
            list.ApprovedBy = reader.GetSafeInt32(startingIndex++);
            list.DateCreated = reader.GetDateTime(startingIndex++);
            list.DateModified = reader.GetDateTime(startingIndex++);
            list.UserDataJson = reader.DeserializeObject<BaseUser>(startingIndex++);
            return list;
        }

        private static void AddCommonParams(ShareStoryAddRequest model, SqlParameterCollection collection)
        {
            collection.AddWithValue("@Name", model.Name);
            collection.AddWithValue("@Email", model.Email);
            collection.AddWithValue("@Story", model.Story);
            collection.AddWithValue("@CreatedBy", model.CreatedBy);
            collection.AddWithValue("@IsApproved", model.IsApproved);
            collection.AddWithValue("@ApprovedBy", model.ApprovedBy);
        }
        
    }

}
