using DnDGen.Web.App_Start;
using DnDGen.Web.Helpers;
using DnDGen.Web.Models;
using EncounterGen.Generators;
using EventGen;
using Microsoft.AspNetCore.Mvc;

namespace DnDGen.Web.Controllers
{
    public class EncounterController : Controller
    {
        private readonly IEncounterGenerator encounterGenerator;
        private readonly IEncounterVerifier encounterVerifier;
        private readonly ClientIDManager clientIdManager;

        public EncounterController(IDependencyFactory dependencyFactory)
        {
            encounterGenerator = dependencyFactory.Get<IEncounterGenerator>();
            encounterVerifier = dependencyFactory.Get<IEncounterVerifier>();
            clientIdManager = dependencyFactory.Get<ClientIDManager>();
        }

        [Route("Encounter")]
        [HttpGet]
        public ActionResult Index()
        {
            var model = new EncounterViewModel();
            return View(model);
        }

        [Route("Encounter/Generate")]
        [HttpGet]
        public JsonResult Generate(Guid clientId, [ModelBinder(BinderType = typeof(EncounterSpecificationsModelBinder))] EncounterSpecifications encounterSpecifications)
        {
            clientIdManager.SetClientID(clientId);

            var encounter = encounterGenerator.Generate(encounterSpecifications);

            foreach (var character in encounter.Characters)
            {
                character.Skills = CharacterHelper.SortSkills(character.Skills);
            }

            return Json(new { encounter = encounter });
        }

        [Route("Encounter/Validate")]
        [HttpGet]
        public JsonResult Validate(Guid clientId, [ModelBinder(BinderType = typeof(EncounterSpecificationsModelBinder))] EncounterSpecifications encounterSpecifications)
        {
            clientIdManager.SetClientID(clientId);
            var isValid = false;

            try
            {
                isValid = encounterVerifier.ValidEncounterExistsAtLevel(encounterSpecifications);
            }
            catch (Exception e)
            {
                var message = $"An error occurred while verifying the encounter specifications. Message: {e.Message}";
                return Json(new { isValid = false, error = message });
            }

            return Json(new { isValid = isValid });
        }
    }
}