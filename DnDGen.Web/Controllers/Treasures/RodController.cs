using System.Web.Mvc;
using TreasureGen;
using TreasureGen.Items;
using TreasureGen.Items.Magical;

namespace DnDGen.Web.Controllers.Treasures
{
    public class RodController : TreasuresController
    {
        private MagicalItemGenerator rodGenerator;

        public RodController(MagicalItemGenerator rodGenerator)
        {
            this.rodGenerator = rodGenerator;
        }

        [HttpGet]
        public JsonResult Generate(string power)
        {
            var treasure = new Treasure();
            var item = GetRod(power);
            treasure.Items = new[] { item };

            return BuildJsonResult(treasure);
        }

        private Item GetRod(string power)
        {
            var item = rodGenerator.GenerateAtPower(power);

            while (item.ItemType != ItemTypeConstants.Rod)
                item = rodGenerator.GenerateAtPower(power);

            return item;
        }
    }
}