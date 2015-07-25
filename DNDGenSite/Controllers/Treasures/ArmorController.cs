using System;
using System.Web.Mvc;
using TreasureGen.Common;
using TreasureGen.Common.Items;
using TreasureGen.Generators.Items.Magical;
using TreasureGen.Generators.Items.Mundane;

namespace DNDGenSite.Controllers.Treasures
{
    public class ArmorController : TreasuresController
    {
        private IMagicalItemGenerator magicalArmorGenerator;
        private IMundaneItemGenerator mundaneArmorGenerator;

        public ArmorController(IMagicalItemGenerator magicalArmorGenerator, IMundaneItemGenerator mundaneArmorGenerator)
        {
            this.magicalArmorGenerator = magicalArmorGenerator;
            this.mundaneArmorGenerator = mundaneArmorGenerator;
        }

        [HttpGet]
        public JsonResult Generate(String power)
        {
            var item = GetArmor(power);
            var treasure = new Treasure();
            treasure.Items = new[] { item };

            return BuildJsonResult(treasure);
        }

        private Item GetArmor(String power)
        {
            if (power == PowerConstants.Mundane)
                return mundaneArmorGenerator.Generate();

            var item = magicalArmorGenerator.GenerateAtPower(power);

            while (item.ItemType != ItemTypeConstants.Armor)
                item = magicalArmorGenerator.GenerateAtPower(power);

            return item;
        }
    }
}