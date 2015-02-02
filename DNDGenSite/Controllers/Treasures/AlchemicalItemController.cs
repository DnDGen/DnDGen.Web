using System.Web.Mvc;
using EquipmentGen.Common;
using EquipmentGen.Generators.Interfaces.Items.Mundane;

namespace DNDGenSite.Controllers.Treasures
{
    public class AlchemicalItemController : TreasuresController
    {
        private IMundaneItemGenerator alchemicalItemGenerator;

        public AlchemicalItemController(IMundaneItemGenerator alchemicalItemGenerator)
        {
            this.alchemicalItemGenerator = alchemicalItemGenerator;
        }

        [HttpGet]
        public JsonResult Generate()
        {
            var treasure = new Treasure();
            var item = alchemicalItemGenerator.Generate();
            treasure.Items = new[] { item };

            return BuildJsonResult(treasure);
        }
    }
}