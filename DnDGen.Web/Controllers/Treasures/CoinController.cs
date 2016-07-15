using System.Web.Mvc;
using TreasureGen;
using TreasureGen.Coins;

namespace DnDGen.Web.Controllers.Treasures
{
    public class CoinController : TreasuresController
    {
        private ICoinGenerator coinGenerator;

        public CoinController(ICoinGenerator coinGenerator)
        {
            this.coinGenerator = coinGenerator;
        }

        [HttpGet]
        public JsonResult Generate(int level)
        {
            var treasure = new Treasure();
            treasure.Coin = coinGenerator.GenerateAtLevel(level);

            return BuildJsonResult(treasure);
        }
    }
}