using DnDGen.Web.Models;
using EncounterGen.Common;
using EncounterGen.Generators;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;

namespace DnDGen.Web.Controllers
{
    public class EncounterController : Controller
    {
        private IEncounterGenerator encounterGenerator;
        private IEncounterVerifier encounterVerifier;

        public EncounterController(IEncounterGenerator encounterGenerator, IEncounterVerifier encounterVerifier)
        {
            this.encounterGenerator = encounterGenerator;
            this.encounterVerifier = encounterVerifier;
        }

        [HttpGet]
        public ActionResult Index()
        {
            var model = new EncounterViewModel();
            model.Environments = new[]
            {
                EnvironmentConstants.Civilized,
                EnvironmentConstants.Desert,
                EnvironmentConstants.Dungeon,
                EnvironmentConstants.Forest,
                EnvironmentConstants.Hills,
                EnvironmentConstants.Marsh,
                EnvironmentConstants.Mountain,
                EnvironmentConstants.Plains
            };

            model.Temperatures = new[]
            {
                EnvironmentConstants.Temperatures.Cold,
                EnvironmentConstants.Temperatures.Temperate,
                EnvironmentConstants.Temperatures.Warm
            };

            model.TimesOfDay = new[]
            {
                EnvironmentConstants.TimesOfDay.Day,
                EnvironmentConstants.TimesOfDay.Night
            };

            model.CreatureTypes = new[]
            {
                CreatureConstants.Types.Aberration,
                CreatureConstants.Types.Animal,
                CreatureConstants.Types.Construct,
                CreatureConstants.Types.Dragon,
                CreatureConstants.Types.Elemental,
                CreatureConstants.Types.Fey,
                CreatureConstants.Types.Giant,
                CreatureConstants.Types.Humanoid,
                CreatureConstants.Types.MagicalBeast,
                CreatureConstants.Types.MonstrousHumanoid,
                CreatureConstants.Types.Ooze,
                CreatureConstants.Types.Outsider,
                CreatureConstants.Types.Plant,
                CreatureConstants.Types.Undead,
                CreatureConstants.Types.Vermin
            };

            return View(model);
        }

        [HttpGet]
        public JsonResult Generate(string environment, string temperature, string timeOfDay, int level, IEnumerable<string> filters)
        {
            filters = filters ?? Enumerable.Empty<string>();

            var encounter = encounterGenerator.Generate(environment, level, temperature, timeOfDay, filters.ToArray());

            foreach (var character in encounter.Characters)
            {
                character.Ability.Feats = character.Ability.Feats.OrderBy(f => f.Name);
                character.Ability.Skills = character.Ability.Skills.OrderBy(kvp => kvp.Key).ToDictionary(kvp => kvp.Key, kvp => kvp.Value);
            }

            return Json(new { encounter = encounter }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult Validate(string environment, string temperature, string timeOfDay, int level, IEnumerable<string> filters)
        {
            filters = filters ?? Enumerable.Empty<string>();

            var isValid = encounterVerifier.ValidEncounterExistsAtLevel(environment, level, temperature, timeOfDay, filters.ToArray());

            return Json(new { isValid = isValid }, JsonRequestBehavior.AllowGet);
        }
    }
}