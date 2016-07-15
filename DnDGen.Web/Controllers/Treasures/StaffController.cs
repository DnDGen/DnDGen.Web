using System.Web.Mvc;
using TreasureGen;
using TreasureGen.Items;
using TreasureGen.Items.Magical;

namespace DnDGen.Web.Controllers.Treasures
{
    public class StaffController : TreasuresController
    {
        private MagicalItemGenerator staffGenerator;

        public StaffController(MagicalItemGenerator staffGenerator)
        {
            this.staffGenerator = staffGenerator;
        }

        [HttpGet]
        public JsonResult Generate(string power)
        {
            var treasure = new Treasure();
            var item = GetStaff(power);
            treasure.Items = new[] { item };

            return BuildJsonResult(treasure);
        }

        private Item GetStaff(string power)
        {
            var item = staffGenerator.GenerateAtPower(power);

            while (item.ItemType != ItemTypeConstants.Staff)
                item = staffGenerator.GenerateAtPower(power);

            return item;
        }
    }
}