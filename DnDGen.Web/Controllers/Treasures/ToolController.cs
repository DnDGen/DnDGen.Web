using System.Web.Mvc;
using TreasureGen;
using TreasureGen.Items.Mundane;

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