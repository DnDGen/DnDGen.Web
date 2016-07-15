using System.Web.Mvc;
using TreasureGen;
using TreasureGen.Items;
using TreasureGen.Items.Magical;

namespace DnDGen.Web.Controllers.Treasures
{
    public class ScrollController : TreasuresController
    {
        private MagicalItemGenerator scrollGenerator;

        public ScrollController(MagicalItemGenerator scrollGenerator)
        {
            this.scrollGenerator = scrollGenerator;
        }

        [HttpGet]
        public JsonResult Generate(string power)
        {
            var treasure = new Treasure();
            var item = GetScroll(power);
            treasure.Items = new[] { item };

            return BuildJsonResult(treasure);
        }

        private Item GetScroll(string power)
        {
            var item = scrollGenerator.GenerateAtPower(power);

            while (item.ItemType != ItemTypeConstants.Scroll)
                item = scrollGenerator.GenerateAtPower(power);

            return item;
        }
    }
}