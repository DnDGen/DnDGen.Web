using System.Web.Mvc;
using TreasureGen;
using TreasureGen.Items;
using TreasureGen.Items.Magical;

namespace DnDGen.Web.Controllers.Treasures
{
    public class PotionController : TreasuresController
    {
        private MagicalItemGenerator potionGenerator;

        public PotionController(MagicalItemGenerator potionGenerator)
        {
            this.potionGenerator = potionGenerator;
        }

        [HttpGet]
        public JsonResult Generate(string power)
        {
            var treasure = new Treasure();
            var item = GetPotion(power);
            treasure.Items = new[] { item };

            return BuildJsonResult(treasure);
        }

        private Item GetPotion(string power)
        {
            var item = potionGenerator.GenerateAtPower(power);

            while (item.ItemType != ItemTypeConstants.Potion)
                item = potionGenerator.GenerateAtPower(power);

            return item;
        }
    }
}