using DnDGen.Core.Generators;
using DnDGen.Web.Models;
using EventGen;
using System;
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
        private readonly ITreasureGenerator treasureGenerator;
        private readonly JustInTimeFactory justInTimeFactory;
        private readonly ICoinGenerator coinGenerator;
        private readonly IGoodsGenerator goodsGenerator;
        private readonly IItemsGenerator itemsGenerator;
        private readonly ClientIDManager clientIdManager;

        public TreasureController(ITreasureGenerator treasureGenerator,
            JustInTimeFactory justInTimeFactory,
            ICoinGenerator coinGenerator,
            IGoodsGenerator goodsGenerator,
            IItemsGenerator itemsGenerator,
            ClientIDManager clientIdManager)
        {
            this.treasureGenerator = treasureGenerator;
            this.justInTimeFactory = justInTimeFactory;
            this.coinGenerator = coinGenerator;
            this.goodsGenerator = goodsGenerator;
            this.itemsGenerator = itemsGenerator;
            this.clientIdManager = clientIdManager;
        }

        [HttpGet]
        public ActionResult Index()
        {
            var model = new TreasureViewModel();
            return View(model);
        }

        [HttpGet]
        public JsonResult Generate(Guid clientId, string treasureType, int level)
        {
            clientIdManager.SetClientID(clientId);

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
        public JsonResult GenerateItem(Guid clientId, string itemType, string power)
        {
            clientIdManager.SetClientID(clientId);

            var item = GetItem(itemType, power);
            var treasure = new Treasure();
            treasure.Items = new[] { item };

            return Json(new { treasure = treasure }, JsonRequestBehavior.AllowGet);

        }

        private Item GetItem(string itemType, string power)
        {
            if (power == PowerConstants.Mundane)
            {
                var mundaneGenerator = justInTimeFactory.Build<MundaneItemGenerator>(itemType);
                return mundaneGenerator.Generate();
            }

            var magicalGenerator = justInTimeFactory.Build<MagicalItemGenerator>(itemType);
            return magicalGenerator.GenerateFrom(power);
        }
    }
}