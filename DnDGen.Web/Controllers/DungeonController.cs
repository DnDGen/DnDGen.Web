﻿using DnDGen.Web.App_Start;
using DnDGen.Web.Helpers;
using DnDGen.Web.Models;
using DungeonGen;
using EncounterGen.Generators;
using EventGen;
using Microsoft.AspNetCore.Mvc;

namespace DnDGen.Web.Controllers
{
    public class DungeonController : Controller
    {
        private readonly IDungeonGenerator dungeonGenerator;
        private readonly ClientIDManager clientIdManager;

        public DungeonController(IDependencyFactory dependencyFactory)
        {
            dungeonGenerator = dependencyFactory.Get<IDungeonGenerator>();
            clientIdManager = dependencyFactory.Get<ClientIDManager>();
        }

        [Route("Dungeon")]
        [HttpGet]
        public ActionResult Index()
        {
            var model = new EncounterViewModel();
            return View(model);
        }

        [Route("Dungeon/GenerateFromHall")]
        [HttpGet]
        public JsonResult GenerateFromHall(
            Guid clientId,
            int dungeonLevel,
            [ModelBinder(BinderType = typeof(EncounterSpecificationsModelBinder))] EncounterSpecifications encounterSpecifications)
        {
            clientIdManager.SetClientID(clientId);

            var areas = dungeonGenerator.GenerateFromHall(dungeonLevel, encounterSpecifications);
            areas = SortCharacterTraits(areas);

            return Json(new { areas = areas });
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

        [Route("Dungeon/GenerateFromDoor")]
        [HttpGet]
        public JsonResult GenerateFromDoor(
            Guid clientId,
            int dungeonLevel,
            [ModelBinder(BinderType = typeof(EncounterSpecificationsModelBinder))] EncounterSpecifications encounterSpecifications)
        {
            clientIdManager.SetClientID(clientId);

            var areas = dungeonGenerator.GenerateFromDoor(dungeonLevel, encounterSpecifications);
            areas = SortCharacterTraits(areas);

            return Json(new { areas = areas });
        }
    }
}