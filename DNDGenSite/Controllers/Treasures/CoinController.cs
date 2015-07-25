using System;
using System.Web.Mvc;
using TreasureGen.Common;
using TreasureGen.Generators.Coins;

namespace DNDGenSite.Controllers.Treasures
{
    public class CoinController : TreasuresController
    {
        private ICoinGenerator coinGenerator;

        public CoinController(ICoinGenerator coinGenerator)
        {
            this.coinGenerator = coinGenerator;
        }

        [HttpGet]
        public JsonResult Generate(Int32 level)
        {
            var treasure = new Treasure();
            treasure.Coin = coinGenerator.GenerateAtLevel(level);

            return BuildJsonResult(treasure);
        }
    }
}