using System.Web.Mvc;
using TreasureGen;
using TreasureGen.Items.Mundane;

namespace DnDGen.Web.Controllers.Treasures
{
    public class AlchemicalItemController : TreasuresController
    {
        private MundaneItemGenerator alchemicalItemGenerator;

        public AlchemicalItemController(MundaneItemGenerator alchemicalItemGenerator)
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