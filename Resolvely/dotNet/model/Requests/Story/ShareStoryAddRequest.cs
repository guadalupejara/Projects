using Sabio.Models.Domain.ShareStories;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests
{
    public class ShareStoryAddRequest
    {
        
        public string Name { get; set; }
        
        public string Email { get; set; }
        
        public string Story { get; set; }
        
        public int CreatedBy { get; set; }

        public bool? IsApproved { get; set; } = null;
        
        public int? ApprovedBy { get; set; } = null;

        public List<int> BatchShareFiles { get; set; }

    }
}
