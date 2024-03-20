using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models;
using Sabio.Models.Domain.ShareStories;
using Sabio.Models.Requests;
using Sabio.Services;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;
using System.Collections.Generic;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/sharestory")]
    [ApiController]
    public class ShareStoryApiController : BaseApiController
    {
        private IShareStoryService _service = null; 
        private IAuthenticationService<int> _authenticationService = null; 
        public ShareStoryApiController(
            IShareStoryService service,
            ILogger<ShareStoryApiController> logger,
            IAuthenticationService<int> authenticationService
            ) : base(logger)
        {
            _service = service; 
            _authenticationService = authenticationService;
        }
        
        [HttpDelete("{id:int}")]
        public ActionResult<SuccessResponse> Delete(int Id)
        {
            int aCode = 200;
            BaseResponse response = null;
            try
            {
                _service.Delete(Id);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(aCode, response);
        }

        [HttpGet("{id:int}")]
        public ActionResult<ItemResponse<ShareStory>> Get(int id)
        {
            int code = 200; 
            BaseResponse response = null;
            try
            {
                ShareStory story = _service.Get(id);
                if (story == null)
                {
                    code = 404;
                    response = new ErrorResponse("ShareStory not found.");
                }
                else
                {
                    response = new ItemResponse<ShareStory> { Item = story };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }

        [HttpGet] 
        public ActionResult<ItemsResponse<ShareStory>> GetAll() 

        {
            int code = 200;

            BaseResponse response = null;

            try
            {
                List<ShareStory> list = _service.GetAll();

                if (list == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resource not found.");
                }
                else
                {
                    response = new ItemsResponse<ShareStory> { Items = list };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }

        [HttpGet("files")]
        public ActionResult<ItemsResponse<ShareStoryFile>> GetAllFiles() 
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                List<ShareStoryFile> list = _service.GetAllFiles();

                if (list == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resource not found.");
                }
                else
                {
                    response = new ItemsResponse<ShareStoryFile> { Items = list };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }

        [HttpGet("paginate")]
        public ActionResult<ItemResponse<Paged<ShareStory>>> SelectAllPaginated(int pageIndex, int pageSize, bool IsApproved)
        {
            int acode = 200;
            BaseResponse response = null;
            try
            {
                Paged<ShareStory> pagedData = _service.SelectAllPaginated(pageIndex, pageSize, IsApproved);
                if (pagedData == null)
                {
                    acode = 404;
                    response = new ErrorResponse("Page data not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<ShareStory>> { Item = pagedData };
                };
            }
            catch (Exception ex)
            {
                acode = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(acode, response);
        }

        [HttpPost]
        public ActionResult<ItemResponse<int>> Create(ShareStoryAddRequest model)
        {
            int daCode = 201;
            int Id = _service.Add(model);
            ItemResponse<int> response = new ItemResponse<int> { Item = Id };
            return StatusCode(daCode, response);
        }

        [HttpPut("{id:int}")]
        public ActionResult<ItemResponse<int>> Update(ShareStoryUpdateRequest model)
        {
            int theCode = 200;
            _service.Update(model);
            SuccessResponse response = new SuccessResponse();
            return StatusCode(theCode, response);
        }

        [HttpPut("isApproved/{id:int}")]
        public ActionResult<ItemResponse<int>> UpdateByIsApproved(ShareStoryUpdateRequest model)
        {
            int theCode = 200;
            BaseResponse response = null;

            _service.UpdateByIsApproved(model);
            ShareStory story = _service.Get(model.Id);
            if (story == null)
            {
                theCode = 404;
                response = new ErrorResponse("ShareStory not found.");
            }
            else
            {
                response = new ItemResponse<ShareStory> { Item = story };
            }
           
            return StatusCode(theCode, response);
        }

    }
}
