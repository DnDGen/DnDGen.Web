using DnDGen.Web.Models;
using DungeonGen;
using EncounterGen.Common;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;

namespace DnDGen.Web.Controllers
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
            var model = new DungeonViewModel();
            model.Temperatures = new[]
            {
                EnvironmentConstants.Temperatures.Cold,
                EnvironmentConstants.Temperatures.Temperate,
                EnvironmentConstants.Temperatures.Warm
            };

            return View(model);
        }

        [HttpGet]
        public JsonResult GenerateFromHall(int dungeonLevel, int partyLevel, string temperature)
        {
            var areas = dungeonGenerator.GenerateFromHall(dungeonLevel, partyLevel, temperature);
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
        public JsonResult GenerateFromDoor(int dungeonLevel, int partyLevel, string temperature)
        {
            var areas = dungeonGenerator.GenerateFromDoor(dungeonLevel, partyLevel, temperature);
            areas = SortCharacterTraits(areas);

            return Json(new { areas = areas }, JsonRequestBehavior.AllowGet);
        }
    }
}