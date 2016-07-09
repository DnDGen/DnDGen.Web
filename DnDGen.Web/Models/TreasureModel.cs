using System;
using System.Collections.Generic;
using System.Linq;

namespace DnDGen.Web.Models
{
    public class TreasureModel
    {
        public IEnumerable<String> TreasureTypes { get; set; }
        public Int32 MaxTreasureLevel { get; set; }
        public IEnumerable<String> MundaneItemTypes { get; set; }
        public IEnumerable<String> PoweredItemTypes { get; set; }
        public IEnumerable<IEnumerable<String>> ItemPowers { get; set; }

        public TreasureModel()
        {
            TreasureTypes = Enumerable.Empty<String>();
            MundaneItemTypes = Enumerable.Empty<String>();
            PoweredItemTypes = Enumerable.Empty<String>();
            ItemPowers = Enumerable.Empty<IEnumerable<String>>();
        }
    }
}