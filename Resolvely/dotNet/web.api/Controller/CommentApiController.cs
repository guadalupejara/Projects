using Amazon.Runtime.Internal.Util;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models.Domain.Comments;
using Sabio.Models.Requests.Comments;
using Sabio.Services;
using Sabio.Services.Interfaces;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;
using System.Collections.Generic;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/comments")]
    [ApiController]
    public class CommentApiController : BaseApiController
    {
        private ICommentService _service = null;
        private IAuthenticationService<int> _authService = null;

        public CommentApiController(ICommentService service,
                                    ILogger<CommentApiController> logger,
                                    IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _authService = authService;
        }

        [HttpGet("{entitytypeid:int}/{entityid:int}")]
        public ActionResult<ItemResponse<Comment>> Get(int entityTypeId, int entityId)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {

                List<Comment> comment = _service.GetByEntityId(entityTypeId, entityId);
                if (comment == null)
                {
                    code = 404;
                    response = new ErrorResponse("No comment found.");
                }
                else
                {
                    response = new ItemResponse<List<Comment>> { Item = comment };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }

        [HttpPost("{parentId:int?}")]
        public ActionResult<ItemResponse<int>> Add(CommentAddRequest model, int parentId)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {

                int createdBy = _authService.GetCurrentUserId();
                int id = _service.Add(model, createdBy, parentId);
                response = new ItemResponse<int>() { Item = id };
            }
            catch (Exception ex)
            {
                code = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }

        [HttpPut("{id:int}")] //works
        public ActionResult<SuccessResponse> Update(CommentUpdateRequest model, int id)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                _service.Update(model, id);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse(ex.Message);

            }
            return StatusCode(code, response);
        }


        [HttpPut("deactivate/{id:int}")] // works
        public ActionResult<SuccessResponse> Delete(int id)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {

                _service.Delete(id);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }
    }
}
