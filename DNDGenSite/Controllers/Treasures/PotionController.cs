using System;
using System.Web.Mvc;
using TreasureGen.Common;
using TreasureGen.Common.Items;
using TreasureGen.Generators.Items.Magical;

namespace DNDGenSite.Controllers.Treasures
{
    public class PotionController : TreasuresController
    {
        private IMagicalItemGenerator potionGenerator;

        public PotionController(IMagicalItemGenerator potionGenerator)
        {
            this.potionGenerator = potionGenerator;
        }

        [HttpGet]
        public JsonResult Generate(String power)
        {
            var treasure = new Treasure();
            var item = GetPotion(power);
            treasure.Items = new[] { item };

            return BuildJsonResult(treasure);
        }

        private Item GetPotion(String power)
        {
            var item = potionGenerator.GenerateAtPower(power);

            while (item.ItemType != ItemTypeConstants.Potion)
                item = potionGenerator.GenerateAtPower(power);

            return item;
        }
    }
}