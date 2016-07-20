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
        private IFilterVerifier filterVerifier;

        public EncounterController(IEncounterGenerator encounterGenerator, IFilterVerifier filterVerifier)
        {
            this.encounterGenerator = encounterGenerator;
            this.filterVerifier = filterVerifier;
        }

        [HttpGet]
        public ActionResult Index()
        {
            var model = new EncounterViewModel();
            model.Environments = new[]
            {
                EnvironmentConstants.Dungeon,
                EnvironmentConstants.CivilizedDay,
                EnvironmentConstants.CivilizedNight
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
        public JsonResult Generate(string environment, int level, IEnumerable<string> filters)
        {
            filters = filters ?? Enumerable.Empty<string>();

            var encounter = encounterGenerator.Generate(environment, level, filters.ToArray());

            foreach (var character in encounter.Characters)
            {
                character.Ability.Feats = character.Ability.Feats.OrderBy(f => f.Name);
                character.Ability.Skills = character.Ability.Skills.OrderBy(kvp => kvp.Key).ToDictionary(kvp => kvp.Key, kvp => kvp.Value);
            }

            return Json(new { encounter = encounter }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult Validate(string environment, int level, IEnumerable<string> filters)
        {
            filters = filters ?? Enumerable.Empty<string>();

            var isValid = filterVerifier.FiltersAreValid(environment, level, filters.ToArray());

            return Json(new { isValid = isValid }, JsonRequestBehavior.AllowGet);
        }
    }
}