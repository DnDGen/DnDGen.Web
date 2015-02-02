using System;
using System.Web.Mvc;
using EquipmentGen.Common;
using EquipmentGen.Common.Items;
using EquipmentGen.Generators.Interfaces.Items.Magical;

namespace DNDGenSite.Controllers.Treasures
{
    public class RingController : TreasuresController
    {
        private IMagicalItemGenerator ringGenerator;

        public RingController(IMagicalItemGenerator ringGenerator)
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