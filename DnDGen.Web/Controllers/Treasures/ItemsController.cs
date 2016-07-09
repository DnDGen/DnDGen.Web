using System;
using System.Web.Mvc;
using TreasureGen.Common;
using TreasureGen.Generators.Items;

namespace DnDGen.Web.Controllers.Treasures
{
    public class ItemsController : TreasuresController
    {
        private IItemsGenerator itemsGenerator;

        public ItemsController(IItemsGenerator itemsGenerator)
        {
            this.itemsGenerator = itemsGenerator;
        }

        [HttpGet]
        public JsonResult Generate(Int32 level)
        {
            var treasure = new Treasure();
            treasure.Items = itemsGenerator.GenerateAtLevel(level);

            return BuildJsonResult(treasure);
        }
    }
}