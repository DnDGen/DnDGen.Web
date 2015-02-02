using System;
using System.Web.Mvc;
using EquipmentGen.Common;
using EquipmentGen.Generators.Interfaces.Goods;

namespace DNDGenSite.Controllers.Treasures
{
    public class GoodsController : TreasuresController
    {
        private IGoodsGenerator goodsGenerator;

        public GoodsController(IGoodsGenerator goodsGenerator)
        {
            this.goodsGenerator = goodsGenerator;
        }

        [HttpGet]
        public JsonResult Generate(Int32 level)
        {
            var treasure = new Treasure();
            treasure.Goods = goodsGenerator.GenerateAtLevel(level);

            return BuildJsonResult(treasure);
        }
    }
}