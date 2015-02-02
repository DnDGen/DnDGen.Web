using System.Web.Mvc;
using EquipmentGen.Common;
using EquipmentGen.Generators.Interfaces.Items.Mundane;

namespace DNDGenSite.Controllers.Treasures
{
    public class ToolController : TreasuresController
    {
        private IMundaneItemGenerator toolGenerator;

        public ToolController(IMundaneItemGenerator toolGenerator)
        {
            this.toolGenerator = toolGenerator;
        }

        [HttpGet]
        public JsonResult Generate()
        {
            var treasure = new Treasure();
            var item = toolGenerator.Generate();
            treasure.Items = new[] { item };

            return BuildJsonResult(treasure);
        }
    }
}