using System;
using System.Web.Mvc;
using EquipmentGen.Common;
using EquipmentGen.Generators.Interfaces.Coins;

namespace DNDGenSite.Controllers.Equipment
{
    public class CoinController : EquipmentController
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