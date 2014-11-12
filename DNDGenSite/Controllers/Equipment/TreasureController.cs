using System;
using System.Web.Mvc;
using EquipmentGen.Generators.Interfaces;

namespace DNDGenSite.Controllers.Equipment
{
    public class TreasureController : EquipmentController
    {
        private ITreasureGenerator treasureGenerator;

        public TreasureController(ITreasureGenerator treasureGenerator)
        {
            this.treasureGenerator = treasureGenerator;
        }

        [HttpGet]
        public JsonResult Generate(Int32 level)
        {
            var treasure = treasureGenerator.GenerateAtLevel(level);
            return BuildJsonResult(treasure);
        }
    }
}