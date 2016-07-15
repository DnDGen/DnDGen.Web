using System.Web.Mvc;
using TreasureGen;
using TreasureGen.Items;
using TreasureGen.Items.Magical;
using TreasureGen.Items.Mundane;

namespace DnDGen.Web.Controllers.Treasures
{
    public class ArmorController : TreasuresController
    {
        private MagicalItemGenerator magicalArmorGenerator;
        private MundaneItemGenerator mundaneArmorGenerator;

        public ArmorController(MagicalItemGenerator magicalArmorGenerator, MundaneItemGenerator mundaneArmorGenerator)
        {
            this.magicalArmorGenerator = magicalArmorGenerator;
            this.mundaneArmorGenerator = mundaneArmorGenerator;
        }

        [HttpGet]
        public JsonResult Generate(string power)
        {
            var item = GetArmor(power);
            var treasure = new Treasure();
            treasure.Items = new[] { item };

            return BuildJsonResult(treasure);
        }

        private Item GetArmor(string power)
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