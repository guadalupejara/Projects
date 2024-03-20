using Newtonsoft.Json;
using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Domain.ParentStudent;
using Sabio.Models.Domain.Users;
using Sabio.Models.Requests.Users;
using Sabio.Services.Interfaces;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Reflection;
using System.Security.Cryptography;
using System.Threading.Tasks;

namespace Sabio.Services
{
    public class UserService : IUserService
    {
        private IAuthenticationService<int> _authenticationService;
        private IDataProvider _dataProvider;
        private ILookUpService _lookUpService;
        private IEmailService _emailService;


        public UserService(IAuthenticationService<int> authService
            , ILookUpService lookUpService
            , IDataProvider dataProvider
            , IEmailService emailService
            )
        {
            _lookUpService = lookUpService;
            _authenticationService = authService;
            _dataProvider = dataProvider;
            _emailService = emailService;
        }

        public async Task<bool> LogInAsync(LogInAddRequest model)
        {
            bool isSuccessful = false;

            IUserAuthData response = Get(model.Email, model.Password);



            if (response != null)
            {
                await _authenticationService.LogInAsync(response);
                isSuccessful = true;
            }

            return isSuccessful;
        }

        public int Create(UserAddRequest model)
        {
            int userId = 0;

            string password = model.Password;
            string salt = BCrypt.BCryptHelper.GenerateSalt();
            string hashedPassword = BCrypt.BCryptHelper.HashPassword(password, salt);

            TokenAddRequest newToken = new TokenAddRequest()
            {
                TokenId = Guid.NewGuid().ToString(),
                TokenType = 1
            };

            _dataProvider.ExecuteNonQuery(
                    storedProc: "[dbo].[Users_Insert]"
                    , inputParamMapper: paramCollection =>
                    {
                        paramCollection.AddWithValue("@Email", model.Email);
                        paramCollection.AddWithValue("@FirstName", model.FirstName);
                        paramCollection.AddWithValue("@LastName", model.LastName);
                        paramCollection.AddWithValue("@Mi", model.Mi);
                        paramCollection.AddWithValue("@AvatarUrl", model.AvatarUrl);
                        paramCollection.AddWithValue("@Password", hashedPassword);
                        paramCollection.AddWithValue("@Token", newToken.TokenId);
                        paramCollection.AddWithValue("@TokenType", newToken.TokenType);
                        paramCollection.AddWithValue("@RoleId", model.RoleId);
                        if (model.RoleId == 2 || model.RoleId == 1)
                        {
                            paramCollection.AddWithValue("@LevelTypeId", null);
                        }
                        else
                        {
                            paramCollection.AddWithValue("@LevelTypeId", model.LevelTypeId);
                        }

                        SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                        idOut.Direction = ParameterDirection.Output;

                        paramCollection.Add(idOut);
                    }
                    , returnParameters: returnCollection =>
                    {
                        object oId = returnCollection["@Id"].Value;
                        int.TryParse(oId.ToString(), out userId);
                    });

            _emailService.SendConfirm(model, newToken);

            return userId;
        }

        public UserBase ForgotPassTokenRequest(string email)
        {
            UserBase user = null;
            TokenAddRequest newToken = null;
            user = GetCurrentUserByEmail(email);

            if (user != null)
            {
                newToken = new TokenAddRequest()
                {
                    TokenId = Guid.NewGuid().ToString(),
                    TokenType = 2
                };

                InsertUserToken(user.Id, newToken);
                _emailService.SendPassReset(user, newToken);

            }
            return user;
        }

        public bool ChangePassword(PasswordUpdateRequest userPassUpdate)
        {
            TokenUpdateRequest tokenConfirm = ConfirmByToken(userPassUpdate.Token);
            bool result = false;

            if (tokenConfirm != null)
            {
                if (tokenConfirm.UserId != 0 && tokenConfirm.TokenType == 2)
                {
                    string password = userPassUpdate.Password;
                    string salt = BCrypt.BCryptHelper.GenerateSalt();
                    string hashedPassword = BCrypt.BCryptHelper.HashPassword(password, salt);

                    _dataProvider.ExecuteNonQuery(
                storedProc: "[dbo].[Users_UpdatePassword]"
                , inputParamMapper: paramCollection =>
                {
                    paramCollection.AddWithValue("@Id", tokenConfirm.UserId);
                    paramCollection.AddWithValue("@Password", hashedPassword);
                }
                , returnParameters: null);

                    DeleteUserToken(userPassUpdate.Token);
                    result = true;
                }
            }
            return result;
        }

        public void UpdateAvatar(string avatarUrl, int id)
        {
            _dataProvider.ExecuteNonQuery(storedProc: "[dbo].[Users_UpdateAvatar]", inputParamMapper: paramCollection =>
            {
                paramCollection.AddWithValue("@Id", id);
                paramCollection.AddWithValue("@AvatarUrl", avatarUrl);
            }, returnParameters: null);

            return;
        }

        public List<User> SelectAll()
        {
            List<User> userList = null;

            _dataProvider.ExecuteCmd(
                storedProc: "[dbo].[Users_SelectAll]"
                , inputParamMapper: null
                , singleRecordMapper: (reader, set) =>
                {
                    User user = null;
                    int index = 0;
                    user = FullUserMapper(reader, out index);

                    if (userList == null)
                    {
                        userList = new List<User>();
                    }

                    userList.Add(user);

                }
                , returnParameters: null);

            return userList;
        }

        public InitialUser SelectById(int id)
        {
            InitialUser user = null;

            _dataProvider.ExecuteCmd(
                storedProc: "[dbo].[Users_SelectById]"
                , inputParamMapper: (paramCollection) =>
                {
                    paramCollection.AddWithValue("@Id", id);
                }
                , singleRecordMapper: (reader, set) =>
                {
                    int index = 0;
                    user = InitialUserMapper(reader, ref index);
                }
                , returnParameters: null);

            return user;
        }

        public void InsertUserToken(int userId, TokenAddRequest tokenReq)
        {
            _dataProvider.ExecuteNonQuery(
                storedProc: "[dbo].[UserTokens_Insert]"
                , inputParamMapper: paramCollection =>
                {
                    paramCollection.AddWithValue("@Id", userId);
                    paramCollection.AddWithValue("@TokenType", tokenReq.TokenType);
                    paramCollection.AddWithValue("@Token", tokenReq.TokenId);
                }
                , returnParameters: null
                );

            return;
        }


        public bool ConfirmAccount(string token)
        {
            TokenUpdateRequest tokenConfirm = ConfirmByToken(token);

            if (tokenConfirm.UserId != 0 && tokenConfirm.TokenType == 1)
            {
                int statusId = 1;

                UpdateIsConfirmed(tokenConfirm.UserId);
                UpdateUserStatus(tokenConfirm.UserId, statusId);
                DeleteUserToken(tokenConfirm.TokenId);

                return true;
            }
            return false;
        }

        private UserBase GetCurrentUserByEmail(string email)
        {
            UserBase user = null;

            _dataProvider.ExecuteCmd(
                storedProc: "[dbo].[Users_SelectByEmail]"
                , inputParamMapper: paramCollection =>
                {
                    paramCollection.AddWithValue("@Email", email);
                }
                , singleRecordMapper: (reader, set) =>
                {
                    int index = 0;
                    user = new UserBase();
                    user.Id = reader.GetSafeInt32(index++);
                    user.Email = reader.GetSafeString(index++);
                    user.Role = reader.GetSafeString(index++);
                    user.TenantId = "Resolvely Tenant";
                    user.AvatarUrl = reader.GetSafeString(index++);
                }
                , returnParameters: null);

            return user;
        }

        public InitialUser InitialUserMapper(IDataReader reader, ref int index)
        {
            InitialUser user = new InitialUser();

            user.Id = reader.GetSafeInt32(index++);
            user.FirstName = reader.GetSafeString(index++);
            user.LastName = reader.GetSafeString(index++);
            user.Mi = reader.GetSafeString(index++);
            user.AvatarUrl = reader.GetSafeString(index++);
            user.Email = reader.GetSafeString(index++);
            user.Role = reader.GetSafeString(index++);

            return user;
        }

        public User FullUserMapper(IDataReader reader, out int index)
        {
            User user = new User() { Status = new LookUp() };
            index = 0;

            user.Id = reader.GetSafeInt32(index++);
            user.FirstName = reader.GetSafeString(index++);
            user.LastName = reader.GetSafeString(index++);
            user.Mi = reader.GetSafeString(index++);
            user.AvatarUrl = reader.GetSafeString(index++);
            user.Email = reader.GetSafeString(index++);
            user.IsConfirmed = reader.GetSafeBool(index++);
            user.Status = _lookUpService.MapSingleLookUp(reader, ref index);
            user.DateCreated = reader.GetSafeDateTime(index++);
            user.DateModified = reader.GetSafeDateTime(index++);
            user.Role = _lookUpService.MapSingleLookUp(reader, ref index);

            return user;
        }

        private void DeleteUserToken(string tokenId)
        {
            _dataProvider.ExecuteNonQuery(
                storedProc: "[dbo].[UserTokens_Delete_ByToken]"
                , inputParamMapper: paramCollection =>
                {
                    paramCollection.AddWithValue("@Token", tokenId);
                }
                , returnParameters: null
                );
            return;
        }

        private TokenUpdateRequest ConfirmByToken(string tokenIncoming)
        {
            TokenUpdateRequest tokenUpdateReq = null;

            _dataProvider.ExecuteCmd(
                 storedProc: "[dbo].[UserTokens_Select_ByToken]"
                 , inputParamMapper: paramCollection =>
                 {
                     paramCollection.AddWithValue("@Token", tokenIncoming);
                 }
                 , singleRecordMapper: (IDataReader reader, short set) =>
                 {
                     tokenUpdateReq = new TokenUpdateRequest();
                     int index = 1;

                     tokenUpdateReq.UserId = reader.GetSafeInt32(index++);
                     tokenUpdateReq.TokenType = reader.GetSafeInt32(index++);
                     tokenUpdateReq.TokenId = tokenIncoming;
                 }
                 , returnParameters: null
             );
            return tokenUpdateReq;
        }

        public void UpdateUserStatus(int id, int statusId)
        {
            _dataProvider.ExecuteNonQuery(
                storedProc: "[dbo].[Users_UpdateStatus]"
                , inputParamMapper: paramCollection =>
                {
                    paramCollection.AddWithValue("@Id", id);
                    paramCollection.AddWithValue("@StatusId", statusId);
                }
                , returnParameters: null);

            return;
        }

        private void UpdateIsConfirmed(int userId)
        {
            _dataProvider.ExecuteNonQuery(
            storedProc: "[dbo].[Users_Confirm]"
            , inputParamMapper: paramCollection =>
            {
                paramCollection.AddWithValue("@Id", userId);
            }
            , returnParameters: null);

            return;
        }
        public void UpdateUserInfo(BaseUserProfileUpdateRequest model, int userId)
        {
            string procName = "[dbo].[Users_Update]";
            _dataProvider.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Id", userId);
                col.AddWithValue("@FirstName", model.FirstName);
                col.AddWithValue("@LastName", model.LastName);
                col.AddWithValue("@Email", model.Email);
            });
        }

        private IUserAuthData Get(string email, string password)
        {
            string passwordFromDb = "";
            bool isConfirmed = false;
            UserBase user = null;

            _dataProvider.ExecuteCmd(
                storedProc: "[dbo].[Users_SelectPass_ByEmail]"
                , inputParamMapper: (paramCollection) =>
                {
                    paramCollection.AddWithValue("@Email", email);
                }
                , singleRecordMapper: (reader, set) =>
                {
                    passwordFromDb = reader.GetSafeString(0);
                    isConfirmed = reader.GetSafeBool(1);
                }
                , returnParameters: null);

            bool isValidCredentials = BCrypt.BCryptHelper.CheckPassword(password, passwordFromDb);

            if (isValidCredentials && isConfirmed)
            {
                user = GetCurrentUserByEmail(email);
            }
            else if (isValidCredentials && !isConfirmed)
            {
                throw new Exception("Email address not confirmed! Please check your email and try again.");
            }
            return user;
        }


        public void ParentStudentToken(InitialUser parentData, string studentEmail)
        {
            TokenAddRequest forParentStudent = new TokenAddRequest();
            UserBase student = GetCurrentUserByEmail(studentEmail);

            if (student == null)
            {
                throw new Exception("Student not found!");
            }
            else
            {
                InitialUser initialUser = SelectById(student.Id);
                int studentId = student.Id;
                string returnedGuid = ParentStudentAdd(parentData.Id, studentId);
                forParentStudent.TokenId = returnedGuid;
                forParentStudent.TokenType = 1;

                _emailService.ParentStudentEmail(parentData, initialUser, forParentStudent);
            }
        }
        public void ParentStudentConfirmUpdate(string relationshipId)
        {
            string procName = "[dbo].[ParentStudentUpdateByToken]";

            _dataProvider.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection collection)
            {
                collection.AddWithValue("@Token", relationshipId);

            }, returnParameters: null);
        }

        public void ParentStudentDelete(int pId, int sId)
        {
            string procName = "[dbo].[ParentStudent_Delete]";
            _dataProvider.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@ParentId", pId);
                col.AddWithValue("@StudentId", sId);
            }, returnParameters: null);
        }

        public string ParentStudentAdd(int pId, int sId)
        {
            string procName = "[dbo].[ParentStudent_Insert]";
            Guid newPSGuid = Guid.NewGuid();

            _dataProvider.ExecuteNonQuery(procName
            , inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@ParentId", pId);
                col.AddWithValue("@StudentId", sId);
                col.AddWithValue("@Token", newPSGuid);
            }, returnParameters: null);

            return newPSGuid.ToString();
        }

        public List<ParentStudentUsersTable> SelectByParentId(int Id)
        {
            List<ParentStudentUsersTable> list = null;
            string procName = "[dbo].[ParentStudent_SelectByParentId]";

            _dataProvider.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Id", Id);

            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {

                ParentStudentUsersTable parentStudent = MapSingleUser(reader);
                if (list == null)
                {
                    list = new List<ParentStudentUsersTable>();
                }
                list.Add(parentStudent);
            });
            return list;
        }

        public List<ParentStudentUsersTable> SelectByStudentId(int Id)
        {
            List<ParentStudentUsersTable> list = null;
            string procName = "[dbo].[ParentStudent_SelectByStudentId]";

            _dataProvider.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Id", Id);

            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {

                ParentStudentUsersTable parentStudent = MapSingleUser(reader);
                if (list == null)
                {
                    list = new List<ParentStudentUsersTable>();
                }
                list.Add(parentStudent);
            });
            return list;
        }

        public Paged<ParentStudent> ParentStudentPaginate(int pageIndex, int pageSize)
        {
            List<ParentStudent> list = new();
            int totalCount = 0;
            string procName = "[dbo].[ParentStudent_SelectAllPaginate]";

            _dataProvider.ExecuteCmd(procName, (SqlParameterCollection param) =>
            {
                param.AddWithValue("@PageIndex", pageIndex);
                param.AddWithValue("@PageSize", pageSize);
            },
                (IDataReader reader, short recordSetIndex) =>
                {
                    ParentStudent ps = ParentStudentUser(reader);
                    list.Add(ps);
                    totalCount = reader.GetSafeInt32(reader.FieldCount - 1);

                });
            if (totalCount == 0)
            {
                return null;
            }
            return new Paged<ParentStudent>(list, pageIndex, pageSize, totalCount);
        }

        public List<ParentStudent> SelectByIsConfirmed(bool isConfirmedValue)
        {
            string procName = "[dbo].[ParentStudent_SelectByIsConfirmed]";

            List<ParentStudent> parentStudentList = null;

            _dataProvider.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection collection)
            {
                collection.AddWithValue("@IsConfirmed", isConfirmedValue);
            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                ParentStudent parentAndStud = ParentStudentUser(reader);

                if (parentStudentList == null)
                {
                    parentStudentList = new List<ParentStudent>();
                }
                parentStudentList.Add(parentAndStud);
            });
            return parentStudentList;

        }


        public List<ParentStudentExpirationRequest> ById(int ParentId)
        {
            string procName = "[dbo].[ParentStudent_ById]";

            List<ParentStudentExpirationRequest> studentIdList = null;
            _dataProvider.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection collection)
            {
                collection.AddWithValue("@ParentId", ParentId);
            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {


                ParentStudentExpirationRequest Student = ParentStudentXp(reader);

                if (studentIdList == null)
                {
                    studentIdList = new List<ParentStudentExpirationRequest>();
                }

                studentIdList.Add(Student);

            });
            return studentIdList;
        }





        private static ParentStudent ParentStudentUser(IDataReader reader)
        {
            ParentStudent parentStudent = new ParentStudent();
            int startingIndex = 0;

            parentStudent.Parent = reader.DeserializeObject<BaseUser>(startingIndex++);

            parentStudent.Student = reader.DeserializeObject<BaseUser>(startingIndex++);

            parentStudent.IsConfirmed = reader.GetSafeBool(startingIndex++);

            return parentStudent;

        }

        private static ParentStudentUsersTable MapSingleUser(IDataReader reader)
        {
            ParentStudentUsersTable parentStudent = new ParentStudentUsersTable();
            int startingIndex = 0;

            parentStudent.FirstName = reader.GetSafeString(startingIndex++);

            parentStudent.LastName = reader.GetSafeString(startingIndex++);

            parentStudent.Email = reader.GetSafeString(startingIndex++);

            parentStudent.AvatarUrl = reader.GetSafeString(startingIndex++);

            parentStudent.Role = reader.GetSafeString(startingIndex++);

            return parentStudent;
        }




        private static ParentStudentExpirationRequest ParentStudentXp(IDataReader reader)
        {
            ParentStudentExpirationRequest student = new ParentStudentExpirationRequest();
            int startingIndex = 0;

            student.Id = reader.GetSafeInt32(startingIndex++);
            student.FirstName = reader.GetString(startingIndex++);
            student.LastName = reader.GetString(startingIndex++);
            student.Mi = reader.GetString(startingIndex++);
            student.AvatarUrl = reader.GetString(startingIndex++);
            student.ExpirationDate = reader.GetSafeDateTime(startingIndex++);
            student.IsConfirmed = reader.GetSafeBool(startingIndex++);
            return student;

        }



    }
}

