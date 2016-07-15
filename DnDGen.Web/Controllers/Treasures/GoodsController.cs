using System.Web.Mvc;
using TreasureGen;
using TreasureGen.Goods;

namespace DnDGen.Web.Controllers.Treasures
{
    public class GoodsController : TreasuresController
    {
        private IGoodsGenerator goodsGenerator;

        public GoodsController(IGoodsGenerator goodsGenerator)
        {
            this.goodsGenerator = goodsGenerator;
        }

        [HttpGet]
        public JsonResult Generate(int level)
        {
            var treasure = new Treasure();
            treasure.Goods = goodsGenerator.GenerateAtLevel(level);

            return BuildJsonResult(treasure);
        }
    }
}