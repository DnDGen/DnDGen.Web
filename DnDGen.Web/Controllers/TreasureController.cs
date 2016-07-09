using DnDGen.Web.Models;
using System;
using System.Collections.Generic;
using System.Web.Mvc;
using TreasureGen.Common.Items;
using TreasureGen.Generators;

namespace DnDGen.Web.Controllers
{
    public class TreasureController : Controller
    {
        private ITreasureGenerator treasureGenerator;

        public TreasureController(ITreasureGenerator treasureGenerator)
        {
            this.treasureGenerator = treasureGenerator;
        }

        [HttpGet]
        public ActionResult Index()
        {
            var model = new TreasureModel();

            model.MaxTreasureLevel = 20;
            model.MundaneItemTypes = new[] { ItemTypeConstants.AlchemicalItem, ItemTypeConstants.Tool };
            model.TreasureTypes = new[] { "Treasure", "Coin", "Goods", "Items" };

            var powers = GetPowers();
            model.PoweredItemTypes = powers.Keys;
            model.ItemPowers = powers.Values;

            return View(model);
        }

        private Dictionary<String, IEnumerable<String>> GetPowers()
        {
            var powers = new Dictionary<String, IEnumerable<String>>();
            powers[ItemTypeConstants.Armor] = new[]
            {
                PowerConstants.Mundane,
                PowerConstants.Minor,
                PowerConstants.Medium,
                PowerConstants.Major
            };

            powers[ItemTypeConstants.Potion] = new[]
            {
                PowerConstants.Minor,
                PowerConstants.Medium,
                PowerConstants.Major
            };

            powers[ItemTypeConstants.Ring] = new[]
            {
                PowerConstants.Minor,
                PowerConstants.Medium,
                PowerConstants.Major
            };

            powers[ItemTypeConstants.Rod] = new[]
            {
                PowerConstants.Medium,
                PowerConstants.Major
            };

            powers[ItemTypeConstants.Scroll] = new[]
            {
                PowerConstants.Minor,
                PowerConstants.Medium,
                PowerConstants.Major
            };

            powers[ItemTypeConstants.Staff] = new[]
            {
                PowerConstants.Medium,
                PowerConstants.Major
            };

            powers[ItemTypeConstants.Wand] = new[]
            {
                PowerConstants.Minor,
                PowerConstants.Medium,
                PowerConstants.Major
            };

            powers[ItemTypeConstants.Weapon] = new[]
            {
                PowerConstants.Mundane,
                PowerConstants.Minor,
                PowerConstants.Medium,
                PowerConstants.Major
            };

            powers[ItemTypeConstants.WondrousItem] = new[]
            {
                PowerConstants.Minor,
                PowerConstants.Medium,
                PowerConstants.Major
            };

            return powers;
        }

        [HttpGet]
        public JsonResult Generate(Int32 level)
        {
            var treasure = treasureGenerator.GenerateAtLevel(level);
            return Json(new { treasure = treasure }, JsonRequestBehavior.AllowGet);
        }
    }
}