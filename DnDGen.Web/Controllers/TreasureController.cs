using DnDGen.Web.Models;
using System.Collections.Generic;
using System.Web.Mvc;
using TreasureGen;
using TreasureGen.Coins;
using TreasureGen.Generators;
using TreasureGen.Goods;
using TreasureGen.Items;
using TreasureGen.Items.Magical;
using TreasureGen.Items.Mundane;

namespace DnDGen.Web.Controllers
{
    public class TreasureController : Controller
    {
        private ITreasureGenerator treasureGenerator;
        private IMundaneItemGeneratorRuntimeFactory mundaneItemGeneratorFactory;
        private IMagicalItemGeneratorRuntimeFactory magicalItemGeneratorFactory;
        private ICoinGenerator coinGenerator;
        private IGoodsGenerator goodsGenerator;
        private IItemsGenerator itemsGenerator;

        public TreasureController(ITreasureGenerator treasureGenerator, IMundaneItemGeneratorRuntimeFactory mundaneItemGeneratorFactory, IMagicalItemGeneratorRuntimeFactory magicalItemGeneratorFactory,
            ICoinGenerator coinGenerator, IGoodsGenerator goodsGenerator, IItemsGenerator itemsGenerator)
        {
            this.treasureGenerator = treasureGenerator;
            this.mundaneItemGeneratorFactory = mundaneItemGeneratorFactory;
            this.magicalItemGeneratorFactory = magicalItemGeneratorFactory;
            this.coinGenerator = coinGenerator;
            this.goodsGenerator = goodsGenerator;
            this.itemsGenerator = itemsGenerator;
        }

        [HttpGet]
        public ActionResult Index()
        {
            var model = new TreasureViewModel();

            model.MaxTreasureLevel = 20;
            model.TreasureTypes = new[] { "Treasure", "Coin", "Goods", "Items" };
            model.ItemPowers = GetPowers();

            return View(model);
        }

        private Dictionary<string, IEnumerable<string>> GetPowers()
        {
            var powers = new Dictionary<string, IEnumerable<string>>();
            powers[ItemTypeConstants.AlchemicalItem] = new[]
            {
                PowerConstants.Mundane
            };

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

            powers[ItemTypeConstants.Tool] = new[]
            {
                PowerConstants.Mundane
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
        public JsonResult Generate(string treasureType, int level)
        {
            var treasure = GetTreasure(treasureType, level);
            return Json(new { treasure = treasure }, JsonRequestBehavior.AllowGet);
        }

        private Treasure GetTreasure(string treasureType, int level)
        {
            if (treasureType == "Treasure")
                return treasureGenerator.GenerateAtLevel(level);

            var treasure = new Treasure();

            if (treasureType == "Coin")
                treasure.Coin = coinGenerator.GenerateAtLevel(level);
            else if (treasureType == "Goods")
                treasure.Goods = goodsGenerator.GenerateAtLevel(level);
            else if (treasureType == "Items")
                treasure.Items = itemsGenerator.GenerateAtLevel(level);

            return treasure;
        }

        [HttpGet]
        public JsonResult GenerateItem(string itemType, string power)
        {
            var item = GetItem(itemType, power);
            var treasure = new Treasure();
            treasure.Items = new[] { item };

            return Json(new { treasure = treasure }, JsonRequestBehavior.AllowGet);

        }

        private Item GetItem(string itemType, string power)
        {
            if (power == PowerConstants.Mundane)
            {
                var mundaneGenerator = mundaneItemGeneratorFactory.CreateGeneratorOf(itemType);
                return mundaneGenerator.Generate();
            }

            var magicalGenerator = magicalItemGeneratorFactory.CreateGeneratorOf(itemType);
            return magicalGenerator.GenerateAtPower(power);
        }
    }
}