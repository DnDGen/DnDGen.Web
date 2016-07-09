using System;
using System.Web.Mvc;
using TreasureGen.Common;
using TreasureGen.Common.Items;
using TreasureGen.Generators.Items.Magical;
using TreasureGen.Generators.Items.Mundane;

namespace DnDGen.Web.Controllers.Treasures
{
    public class WeaponController : TreasuresController
    {
        private MagicalItemGenerator magicalWeaponGenerator;
        private MundaneItemGenerator mundaneWeaponGenerator;

        public WeaponController(MagicalItemGenerator magicalWeaponGenerator, MundaneItemGenerator mundaneWeaponGenerator)
        {
            this.magicalWeaponGenerator = magicalWeaponGenerator;
            this.mundaneWeaponGenerator = mundaneWeaponGenerator;
        }

        [HttpGet]
        public JsonResult Generate(String power)
        {
            var item = GetWeapon(power);
            var treasure = new Treasure();
            treasure.Items = new[] { item };

            return BuildJsonResult(treasure);
        }

        private Item GetWeapon(String power)
        {
            if (power == PowerConstants.Mundane)
                return mundaneWeaponGenerator.Generate();

            var item = magicalWeaponGenerator.GenerateAtPower(power);

            while (item.ItemType != ItemTypeConstants.Weapon)
                item = magicalWeaponGenerator.GenerateAtPower(power);

            return item;
        }
    }
}