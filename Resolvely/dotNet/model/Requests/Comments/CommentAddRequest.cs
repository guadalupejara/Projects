using Sabio.Models.Domain.Users;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.Comments
{
    public class CommentAddRequest
    {
        public string Subject { get; set; }
        [Required]
        [StringLength(3000, MinimumLength = 2)]
        public string Text { get; set; }
        public int ParentId { get; set; }
        [Required]
        public int EntityId { get; set; }
        [Required]
        public int EntityTypeId { get; set; }
        [Required]
        public bool IsDeleted { get; set; }
    }
}
