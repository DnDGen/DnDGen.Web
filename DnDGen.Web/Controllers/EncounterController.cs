using DnDGen.Web.Models;
using EncounterGen.Common;
using EncounterGen.Generators;
using System.Linq;
using System.Web.Mvc;

namespace DnDGen.Web.Controllers
{
    public class EncounterController : Controller
    {
        private IEncounterGenerator encounterGenerator;

        public EncounterController(IEncounterGenerator encounterGenerator)
        {
            this.encounterGenerator = encounterGenerator;
        }

        [HttpGet]
        public ActionResult Index()
        {
            var model = new EncounterModel();
            model.Environments = new[] { EnvironmentConstants.Dungeon };

            return View(model);
        }

        [HttpGet]
        public JsonResult Generate(string environment, int level)
        {
            var encounter = encounterGenerator.Generate(environment, level);

            foreach (var character in encounter.Characters)
            {
                character.Ability.Feats = character.Ability.Feats.OrderBy(f => f.Name);
                character.Ability.Skills = character.Ability.Skills.OrderBy(kvp => kvp.Key).ToDictionary(kvp => kvp.Key, kvp => kvp.Value);
            }

            return Json(new { encounter = encounter }, JsonRequestBehavior.AllowGet);
        }
    }
}