using System;
using System.Web.Mvc;
using TreasureGen.Common;
using TreasureGen.Common.Items;
using TreasureGen.Generators.Items.Magical;

namespace DNDGenSite.Controllers.Treasures
{
    public class RingController : TreasuresController
    {
        private MagicalItemGenerator ringGenerator;

        public RingController(MagicalItemGenerator ringGenerator)
        {
            this.ringGenerator = ringGenerator;
        }

        [HttpGet]
        public JsonResult Generate(String power)
        {
            var treasure = new Treasure();
            var item = GetRing(power);
            treasure.Items = new[] { item };

            return BuildJsonResult(treasure);
        }

        private Item GetRing(String power)
        {
            var item = ringGenerator.GenerateAtPower(power);

            while (item.ItemType != ItemTypeConstants.Ring)
                item = ringGenerator.GenerateAtPower(power);

            return item;
        }
    }
}