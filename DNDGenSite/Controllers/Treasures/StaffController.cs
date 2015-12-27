using System;
using System.Web.Mvc;
using TreasureGen.Common;
using TreasureGen.Common.Items;
using TreasureGen.Generators.Items.Magical;

namespace DNDGenSite.Controllers.Treasures
{
    public class StaffController : TreasuresController
    {
        private MagicalItemGenerator staffGenerator;

        public StaffController(MagicalItemGenerator staffGenerator)
        {
            this.staffGenerator = staffGenerator;
        }

        [HttpGet]
        public JsonResult Generate(String power)
        {
            var treasure = new Treasure();
            var item = GetStaff(power);
            treasure.Items = new[] { item };

            return BuildJsonResult(treasure);
        }

        private Item GetStaff(String power)
        {
            var item = staffGenerator.GenerateAtPower(power);

            while (item.ItemType != ItemTypeConstants.Staff)
                item = staffGenerator.GenerateAtPower(power);

            return item;
        }
    }
}