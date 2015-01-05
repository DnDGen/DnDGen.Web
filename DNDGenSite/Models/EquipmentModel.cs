using System;
using System.Collections.Generic;
using System.Linq;

namespace DNDGenSite.Models
{
    public class EquipmentModel
    {
        public IEnumerable<String> TreasureTypes { get; set; }
        public Int32 MaxTreasureLevel { get; set; }
        public IEnumerable<String> MundaneItemTypes { get; set; }
        public IEnumerable<String> PoweredItemTypes { get; set; }
        public IEnumerable<IEnumerable<String>> ItemPowers { get; set; }

        public EquipmentModel()
        {
            TreasureTypes = Enumerable.Empty<String>();
            MundaneItemTypes = Enumerable.Empty<String>();
            PoweredItemTypes = Enumerable.Empty<String>();
            ItemPowers = Enumerable.Empty<IEnumerable<String>>();
        }
    }
}