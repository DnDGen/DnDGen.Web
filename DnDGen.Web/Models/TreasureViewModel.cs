using System.Collections.Generic;
using System.Linq;

namespace DnDGen.Web.Models
{
    public class TreasureViewModel
    {
        public IEnumerable<string> TreasureTypes { get; set; }
        public int MaxTreasureLevel { get; set; }
        public IEnumerable<string> MundaneItemTypes { get; set; }
        public IEnumerable<string> PoweredItemTypes { get; set; }
        public IEnumerable<IEnumerable<string>> ItemPowers { get; set; }

        public TreasureViewModel()
        {
            TreasureTypes = Enumerable.Empty<string>();
            MundaneItemTypes = Enumerable.Empty<string>();
            PoweredItemTypes = Enumerable.Empty<string>();
            ItemPowers = Enumerable.Empty<IEnumerable<string>>();
        }
    }
}