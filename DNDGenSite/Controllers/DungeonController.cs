using DungeonGen.Common;
using DungeonGen.Generators;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;

namespace DNDGenSite.Controllers
{
    public class DungeonController : Controller
    {
        private IDungeonGenerator dungeonGenerator;

        public DungeonController(IDungeonGenerator dungeonGenerator)
        {
            this.dungeonGenerator = dungeonGenerator;
        }

        [HttpGet]
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public JsonResult GenerateFromHall(int dungeonLevel, int partyLevel)
        {
            var areas = dungeonGenerator.GenerateFromHall(dungeonLevel, partyLevel);
            areas = SortCharacterTraits(areas);

            return Json(new { areas = areas }, JsonRequestBehavior.AllowGet);
        }

        private IEnumerable<Area> SortCharacterTraits(IEnumerable<Area> areas)
        {
            foreach (var area in areas)
            {
                foreach (var encounter in area.Contents.Encounters)
                {
                    foreach (var character in encounter.Characters)
                    {
                        character.Ability.Feats = character.Ability.Feats.OrderBy(f => f.Name);
                        character.Ability.Skills = character.Ability.Skills.OrderBy(kvp => kvp.Key).ToDictionary(kvp => kvp.Key, kvp => kvp.Value);
                    }
                }

                if (area.Contents.Pool != null && area.Contents.Pool.Encounter != null)
                {
                    foreach (var character in area.Contents.Pool.Encounter.Characters)
                    {
                        character.Ability.Feats = character.Ability.Feats.OrderBy(f => f.Name);
                        character.Ability.Skills = character.Ability.Skills.OrderBy(kvp => kvp.Key).ToDictionary(kvp => kvp.Key, kvp => kvp.Value);
                    }
                }
            }

            return areas;
        }

        [HttpGet]
        public JsonResult GenerateFromDoor(int dungeonLevel, int partyLevel)
        {
            var areas = dungeonGenerator.GenerateFromDoor(dungeonLevel, partyLevel);
            areas = SortCharacterTraits(areas);

            return Json(new { areas = areas }, JsonRequestBehavior.AllowGet);
        }
    }
}