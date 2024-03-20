using System;
using System.Collections.Generic;
using System.IO;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Options;
using Newtonsoft.Json.Linq;
using Sabio.Models.AppSettings;
using Sabio.Models.Domain;
using Sabio.Models.Domain.Modules;
using Sabio.Models.Domain.ShareStories;
using Sabio.Models.Domain.Tasks;
using Sabio.Models.Domain.Users;
using Sabio.Models.Requests.Email;
using Sabio.Models.Requests.Users;
using Sabio.Services.Interfaces;
using sib_api_v3_sdk.Api;
using sib_api_v3_sdk.Client;
using sib_api_v3_sdk.Model;
using Task = System.Threading.Tasks.Task;

namespace Sabio.Services
{
    public class EmailService : IEmailService
    {
        private IWebHostEnvironment _environment;
        private AppKeys _appKeys;
        
        public EmailService(IWebHostEnvironment environment, IOptions<AppKeys> appKeys)
        {
            _environment = environment;
            _appKeys = appKeys.Value;
            
        }

        public async Task ContactUs(ContactUsRequest model)
        {

            SendSmtpEmailSender Email = new SendSmtpEmailSender(model.From, model.Email);

            string ToEmail = _appKeys.SenderEmail;
            string ToName = _appKeys.SenderName;
            SendSmtpEmailTo smtpEmailTo = new SendSmtpEmailTo(ToEmail, ToName);
            List<SendSmtpEmailTo> To = new List<SendSmtpEmailTo>();
            To.Add(smtpEmailTo);

            var sendSmtpEmail = new SendSmtpEmail(Email, To)
            {
                Subject = model.Subject,
                TextContent = model.Message,

            };
            await SendEmailAsync(sendSmtpEmail);

        }

        public async Task SendConfirm(UserAddRequest userModel, TokenAddRequest token)
        {
            SendSmtpEmailSender Email = new SendSmtpEmailSender(_appKeys.SenderName, _appKeys.SenderEmail);

            string userEmail = userModel.Email;
            string userName = userModel.FirstName + " " + userModel.LastName;
            SendSmtpEmailTo smtpEmailTo = new SendSmtpEmailTo(userEmail, userName);
            List<SendSmtpEmailTo> userSendList = new List<SendSmtpEmailTo>() { smtpEmailTo };

            var sendSmtpEmail = new SendSmtpEmail(Email, userSendList)
            {
                Subject = "Confirm your account at Resolvely.Ai",
                TextContent = LoadHtmlTemplate("confirmation.html", firstName: userModel.FirstName, token: token),
            };

            await SendEmailAsync(sendSmtpEmail);
        }

        public async Task SendRejectComment(rejectedShareStory model, InitialUser studentInfo)
        {
            SendSmtpEmailSender Email = new SendSmtpEmailSender(_appKeys.SenderName, _appKeys.SenderEmail);
            string userEmail = model.Story.Email;
            string userName = studentInfo.FirstName + " " + studentInfo.LastName;
            SendSmtpEmailTo smtpEmailTo = new SendSmtpEmailTo(userEmail, userName);
            List<SendSmtpEmailTo> userSendList = new List<SendSmtpEmailTo>() { smtpEmailTo };

            var sendSmtpEmail = new SendSmtpEmail(Email, userSendList)
            {
                Subject = "Your story: " + " " + model.Story.Name + " " + "  approval status has been updated.",
                TextContent = LoadHtmlTemplate("rejectStory.html", firstName: studentInfo.FirstName, lastName: studentInfo.LastName, userEmail: userEmail, comment:model.Comment, storyName: model.Story.Name),
            };

            await SendEmailAsync(sendSmtpEmail);
        }

        public async Task SendPassReset(UserBase userModel, TokenAddRequest token) 
        {
            SendSmtpEmailSender Email = new SendSmtpEmailSender(_appKeys.SenderName, _appKeys.SenderEmail);
            string userEmail = userModel.Email;
    
            SendSmtpEmailTo smtpEmailTo = new SendSmtpEmailTo(userEmail); 
            List<SendSmtpEmailTo> userSendList = new List<SendSmtpEmailTo>() { smtpEmailTo };

            var sendSmtpEmail = new SendSmtpEmail(Email, userSendList)
            {
                Subject = "Password Change Requested at Resolvely.Ai",
                TextContent = LoadHtmlTemplate("reset-password.html", token: token, userEmail: userModel.Email),
            };

            await SendEmailAsync(sendSmtpEmail);
        }

        public async Task ParentStudentEmail(InitialUser parent, InitialUser studentEmail, TokenAddRequest parentStudentToken)
        {
            SendSmtpEmailSender Email = new SendSmtpEmailSender(_appKeys.SenderName, _appKeys.SenderEmail);

            string userEmail = studentEmail.Email;
            string userName = studentEmail.FirstName + " " + studentEmail.LastName;

            SendSmtpEmailTo smtpEmailTo = new SendSmtpEmailTo(userEmail, userName);
            List<SendSmtpEmailTo> userSendList = new List<SendSmtpEmailTo>() { smtpEmailTo };

            var sendSmtpEmail = new SendSmtpEmail(Email, userSendList)
            {
                Subject = "Confirm your parent connection!",
                TextContent = LoadHtmlTemplate("ConfirmParent.html", firstName: parent.FirstName + " " + parent.LastName, lastName: null, moduleName: null,  moduleImage: null, token: parentStudentToken, userEmail)
            };
            await SendEmailAsync(sendSmtpEmail);

        }

        public async Task StudentModuleEmail(InitialUser userInfo, Module moduleInfo)
        {
            SendSmtpEmailSender email = new SendSmtpEmailSender(_appKeys.SenderName, _appKeys.SenderEmail);
            string userEmail = userInfo.Email;

            SendSmtpEmailTo smtpEmailTo = new SendSmtpEmailTo(userEmail);
            List<SendSmtpEmailTo> userSendList = new List<SendSmtpEmailTo>() { smtpEmailTo };

            var sendSmtpEmail = new SendSmtpEmail(email, userSendList)
            {
                Subject = "Module: " + moduleInfo.Title + " has been assigned to you.",
                TextContent = LoadHtmlTemplate("moduleAssigned.html", firstName:userInfo.FirstName, lastName:userInfo.LastName, moduleName:moduleInfo.Title, moduleImage:moduleInfo.ImageUrl, token: null, userEmail: userInfo.Email),
            };
            await SendEmailAsync(sendSmtpEmail);
        }
        private string LoadHtmlTemplate(string templateFileName, string firstName = null, string lastName = null, string moduleName = null, string moduleImage = null, TokenAddRequest token = null, string userEmail = null, string comment = null, string storyName= null)
        {
            try
            {
                string templatePath = Path.Combine(_environment.WebRootPath, "EmailTemplates", templateFileName);
                if (File.Exists(templatePath)) 
                {
                    if (templateFileName == "moduleAssigned.html")
                    {
                        string customScript = File.ReadAllText(templatePath).Replace("Name of Student", $"{firstName} {lastName}").Replace("ModuleName", moduleName).Replace("ModuleImage", moduleImage);
                        return customScript;
                    }
                    if (templateFileName == "rejectStory.html")
                    {
                        string customScript = File.ReadAllText(templatePath).Replace("Name of Student", $"{firstName} {lastName}").Replace("commentInput", comment).Replace("storyName", storyName); ;
                        return customScript;
                    }
                    if (token != null)
                    {
                        if (templateFileName == "confirmation.html" && token.TokenType == 1)
                        {
                            string customLink = $"{_appKeys.DomainUrl}/confirm?tokenId={token.TokenId}";
                            string customScript = File.ReadAllText(templatePath).Replace("Confirm-Link-Insert", customLink).Replace("Users-First-Name", firstName);

                            return customScript;
                        }
                        else if (templateFileName == "reset-password.html" && token.TokenType == 2)
                        {
                            string customLink = $"{_appKeys.DomainUrl}/changepassword?token={token.TokenId}&email={userEmail}";
                            string customScript = File.ReadAllText(templatePath).Replace("Confirm-Link-Insert", customLink);

                            return customScript;
                        }
                        else if (templateFileName == "ConfirmParent.html" && token.TokenType == 1)
                        {                                                  
                         
                            string customLink = $"{_appKeys.DomainUrl}/parentstudenttoken?token={token.TokenId}";                    

                            string customScript = File.ReadAllText(templatePath).Replace("Confirm-Link-Insert", customLink);
                                  
                            string parentName = customScript.Replace("parentData", firstName);

                            return parentName;
                        } 
                        else { throw new Exception("Token not recognized. Please try again."); };
                    }
                    else
                    { return File.ReadAllText(templatePath); }
                }
                else
                {
                    return string.Empty;
                }
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        private async Task SendEmailAsync(SendSmtpEmail email)
        {
            Configuration.Default.ApiKey["api-key"] = _appKeys.SendGridAppKey;
            var apiInstance = new TransactionalEmailsApi();
            CreateSmtpEmail result = await apiInstance.SendTransacEmailAsync(email); 
        }
    }
}
