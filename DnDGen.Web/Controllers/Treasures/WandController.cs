using System;
using System.Web.Mvc;
using TreasureGen.Common;
using TreasureGen.Common.Items;
using TreasureGen.Generators.Items.Magical;

namespace DnDGen.Web.Controllers.Treasures
{
    public class WandController : TreasuresController
    {
        private MagicalItemGenerator wandGenerator;

        public WandController(MagicalItemGenerator wandGenerator)
        {
            this.wandGenerator = wandGenerator;
        }

        [HttpGet]
        public JsonResult Generate(String power)
        {
            var treasure = new Treasure();
            var item = GetWand(power);
            treasure.Items = new[] { item };

            return BuildJsonResult(treasure);
        }

        private Item GetWand(String power)
        {
            var item = wandGenerator.GenerateAtPower(power);

            while (item.ItemType != ItemTypeConstants.Wand)
                item = wandGenerator.GenerateAtPower(power);

            return item;
        }
    }
}