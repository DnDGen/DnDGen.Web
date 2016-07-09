using System.Web.Mvc;
using TreasureGen.Common;
using TreasureGen.Generators.Items.Mundane;

namespace DnDGen.Web.Controllers.Treasures
{
    public class ToolController : TreasuresController
    {
        private MundaneItemGenerator toolGenerator;

        public ToolController(MundaneItemGenerator toolGenerator)
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