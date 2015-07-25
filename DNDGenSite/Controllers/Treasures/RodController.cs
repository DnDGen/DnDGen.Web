using System;
using System.Web.Mvc;
using TreasureGen.Common;
using TreasureGen.Common.Items;
using TreasureGen.Generators.Items.Magical;

namespace DNDGenSite.Controllers.Treasures
{
    public class RodController : TreasuresController
    {
        private IMagicalItemGenerator rodGenerator;

        public RodController(IMagicalItemGenerator rodGenerator)
        {
            this.rodGenerator = rodGenerator;
        }

        [HttpGet]
        public JsonResult Generate(String power)
        {
            var treasure = new Treasure();
            var item = GetRod(power);
            treasure.Items = new[] { item };

            return BuildJsonResult(treasure);
        }

        private Item GetRod(String power)
        {
            var item = rodGenerator.GenerateAtPower(power);

            while (item.ItemType != ItemTypeConstants.Rod)
                item = rodGenerator.GenerateAtPower(power);

            return item;
        }
    }
}