using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain.ShareStories
{
    public class ShareStoryFile : ShareStory
    {
        public int FileId { get; set; }
        public string FileName { get; set; }
        public string Url { get; set; }
    }
}
