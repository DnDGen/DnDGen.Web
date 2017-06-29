using DnDGen.Web.Helpers;
using DnDGen.Web.Models;
using DungeonGen;
using EncounterGen.Generators;
using EventGen;
using System;
using System.Collections.Generic;
using System.Web.Mvc;

namespace DnDGen.Web.Controllers
{
    public class DungeonController : Controller
    {
        private readonly IDungeonGenerator dungeonGenerator;
        private readonly ClientIDManager clientIdManager;

        public DungeonController(IDungeonGenerator dungeonGenerator, ClientIDManager clientIdManager)
        {
            this.dungeonGenerator = dungeonGenerator;
            this.clientIdManager = clientIdManager;
        }

        [HttpGet]
        public ActionResult Index()
        {
            var model = new EncounterViewModel();
            return View(model);
        }

        [HttpGet]
        public JsonResult GenerateFromHall(Guid clientId, int dungeonLevel, EncounterSpecifications encounterSpecifications)
        {
            clientIdManager.SetClientID(clientId);

            var areas = dungeonGenerator.GenerateFromHall(dungeonLevel, encounterSpecifications);
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
                        character.Skills = CharacterHelper.SortSkills(character.Skills);
                    }
                }

                if (area.Contents.Pool != null && area.Contents.Pool.Encounter != null)
                {
                    foreach (var character in area.Contents.Pool.Encounter.Characters)
                    {
                        character.Skills = CharacterHelper.SortSkills(character.Skills);
                    }
                }
            }

            return areas;
        }

        [HttpGet]
        public JsonResult GenerateFromDoor(Guid clientId, int dungeonLevel, EncounterSpecifications encounterSpecifications)
        {
            clientIdManager.SetClientID(clientId);

            var areas = dungeonGenerator.GenerateFromDoor(dungeonLevel, encounterSpecifications);
            areas = SortCharacterTraits(areas);

            return Json(new { areas = areas }, JsonRequestBehavior.AllowGet);
        }
    }
}