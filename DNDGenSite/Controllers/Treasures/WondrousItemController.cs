using System;
using System.Web.Mvc;
using EquipmentGen.Common;
using EquipmentGen.Common.Items;
using EquipmentGen.Generators.Interfaces.Items.Magical;

namespace DNDGenSite.Controllers.Treasures
{
    public class WondrousItemController : TreasuresController
    {
        private IMagicalItemGenerator wondrousItemGenerator;

        public WondrousItemController(IMagicalItemGenerator wondrousItemGenerator)
        {
            this.wondrousItemGenerator = wondrousItemGenerator;
        }

        [HttpGet]
        public JsonResult Generate(String power)
        {
            var treasure = new Treasure();
            var item = GetWondrousItem(power);
            treasure.Items = new[] { item };

            return BuildJsonResult(treasure);
        }

        private Item GetWondrousItem(String power)
        {
            var item = wondrousItemGenerator.GenerateAtPower(power);

            while (item.ItemType != ItemTypeConstants.WondrousItem)
                item = wondrousItemGenerator.GenerateAtPower(power);

            return item;
        }
    }
}