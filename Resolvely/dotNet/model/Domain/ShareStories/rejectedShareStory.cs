using Sabio.Models.Requests;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain.ShareStories
{
    public class rejectedShareStory
    {
        public string Comment { get; set; }
        public ShareStory Story { get; set; }
    }
}
