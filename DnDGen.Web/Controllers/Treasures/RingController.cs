using System.Web.Mvc;
using TreasureGen;
using TreasureGen.Items;
using TreasureGen.Items.Magical;

namespace DnDGen.Web.Controllers.Treasures
{
    public class RingController : TreasuresController
    {
        private MagicalItemGenerator ringGenerator;

        public RingController(MagicalItemGenerator ringGenerator)
        {
            this.ringGenerator = ringGenerator;
        }

        [HttpGet]
        public JsonResult Generate(string power)
        {
            var treasure = new Treasure();
            var item = GetRing(power);
            treasure.Items = new[] { item };

            return BuildJsonResult(treasure);
        }

        private Item GetRing(string power)
        {
            var item = ringGenerator.GenerateAtPower(power);

            while (item.ItemType != ItemTypeConstants.Ring)
                item = ringGenerator.GenerateAtPower(power);

            return item;
        }
    }
}