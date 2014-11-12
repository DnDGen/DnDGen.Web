using System;
using System.Web.Mvc;
using EquipmentGen.Common;
using EquipmentGen.Common.Items;
using EquipmentGen.Generators.Interfaces.Items.Magical;

namespace DNDGenSite.Controllers.Equipment
{
    public class WandController : EquipmentController
    {
        private IMagicalItemGenerator wandGenerator;

        public WandController(IMagicalItemGenerator wandGenerator)
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