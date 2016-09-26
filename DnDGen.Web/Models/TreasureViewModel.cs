using System.Collections.Generic;
using System.Linq;

namespace DnDGen.Web.Models
{
    public class TreasureViewModel
    {
        public IEnumerable<string> TreasureTypes { get; set; }
        public int MaxTreasureLevel { get; set; }
        public Dictionary<string, IEnumerable<string>> ItemPowers { get; set; }

        public TreasureViewModel()
        {
            TreasureTypes = Enumerable.Empty<string>();
            ItemPowers = new Dictionary<string, IEnumerable<string>>();
        }
    }
}