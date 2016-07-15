using System.Web.Mvc;
using TreasureGen;
using TreasureGen.Items;
using TreasureGen.Items.Magical;
using TreasureGen.Items.Mundane;

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
        public JsonResult Generate(string power)
        {
            var item = GetWeapon(power);
            var treasure = new Treasure();
            treasure.Items = new[] { item };

            return BuildJsonResult(treasure);
        }

        private Item GetWeapon(string power)
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