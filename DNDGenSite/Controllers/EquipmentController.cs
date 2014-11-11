using System;
using System.Web.Mvc;
using EquipmentGen.Common;
using EquipmentGen.Generators.Interfaces;
using EquipmentGen.Generators.Interfaces.Coins;
using EquipmentGen.Generators.Interfaces.Goods;

namespace DNDGenSite.Controllers
{
    public class EquipmentController : Controller
    {
        private ITreasureGenerator treasureGenerator;
        private ICoinGenerator coinGenerator;
        private IGoodsGenerator goodsGenerator;

        public EquipmentController(ITreasureGenerator treasureGenerator, ICoinGenerator coinGenerator, IGoodsGenerator goodsGenerator)
        {
            this.treasureGenerator = treasureGenerator;
            this.coinGenerator = coinGenerator;
            this.goodsGenerator = goodsGenerator;
        }

        [HttpGet]
        public JsonResult Treasure(Int32 level)
        {
            var treasure = treasureGenerator.GenerateAtLevel(level);
            return BuildJsonResult(treasure);
        }

        [HttpGet]
        public JsonResult Coin(Int32 level)
        {
            var treasure = new Treasure();
            treasure.Coin = coinGenerator.GenerateAtLevel(level);

            return BuildJsonResult(treasure);
        }

        [HttpGet]
        public JsonResult Goods(Int32 level)
        {
            var treasure = new Treasure();
            treasure.Goods = goodsGenerator.GenerateAtLevel(level);

            return BuildJsonResult(treasure);
        }

        [HttpGet]
        public JsonResult Items()
        {
            throw new NotImplementedException();
        }

        [HttpGet]
        public JsonResult Item()
        {
            throw new NotImplementedException();
        }

        [HttpGet]
        public JsonResult AlchemicalItem()
        {
            throw new NotImplementedException();
        }

        [HttpGet]
        public JsonResult Armor()
        {
            throw new NotImplementedException();
        }

        [HttpGet]
        public JsonResult Potion()
        {
            throw new NotImplementedException();
        }

        [HttpGet]
        public JsonResult Ring()
        {
            throw new NotImplementedException();
        }

        [HttpGet]
        public JsonResult Rod()
        {
            throw new NotImplementedException();
        }

        [HttpGet]
        public JsonResult Scroll()
        {
            throw new NotImplementedException();
        }

        [HttpGet]
        public JsonResult Staff()
        {
            throw new NotImplementedException();
        }

        [HttpGet]
        public JsonResult Tool()
        {
            throw new NotImplementedException();
        }

        [HttpGet]
        public JsonResult Wand()
        {
            throw new NotImplementedException();
        }

        [HttpGet]
        public JsonResult Weapon()
        {
            throw new NotImplementedException();
        }

        [HttpGet]
        public JsonResult WondrousItem()
        {
            throw new NotImplementedException();
        }

        private JsonResult BuildJsonResult(Treasure treasure)
        {
            return Json(new { treasure = treasure }, JsonRequestBehavior.AllowGet);
        }
    }
}