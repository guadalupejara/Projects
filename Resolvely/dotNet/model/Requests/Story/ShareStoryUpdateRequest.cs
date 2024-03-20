using Sabio.Models.Domain.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests
{
    public class ShareStoryUpdateRequest : ShareStoryAddRequest
    {
        public int Id { get; set; }
#nullable enable
        public string? Comment { get; set; }
#nullable restore
    }
}
