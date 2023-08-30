using CharacterGen.Verifiers;
using DnDGen.Web.New.IoC;
using DnDGen.Web.New.Models;
using DnDGen.Web.New.Repositories;
using EventGen;
using Microsoft.AspNetCore.Mvc;

namespace DnDGen.Web.New.Controllers.Characters
{
    public class RandomizersController : Controller
    {
        private readonly IRandomizerRepository randomizerRepository;
        private readonly IRandomizerVerifier randomizerVerifier;
        private readonly ClientIDManager clientIdManager;

        public RandomizersController(IDependencyFactory dependencyFactory)
        {
            randomizerRepository = dependencyFactory.Get<IRandomizerRepository>();
            randomizerVerifier = dependencyFactory.Get<IRandomizerVerifier>();
            clientIdManager = dependencyFactory.Get<ClientIDManager>();
        }

        [Route("Characters/Randomizers/Verify")]
        [HttpGet]
        public JsonResult Verify(Guid clientId, CharacterSpecifications characterSpecifications)
        {
            clientIdManager.SetClientID(clientId);

            var alignmentRandomizer = randomizerRepository.GetAlignmentRandomizer(characterSpecifications.AlignmentRandomizerType, characterSpecifications.SetAlignment);
            var classNameRandomizer = randomizerRepository.GetClassNameRandomizer(characterSpecifications.ClassNameRandomizerType, characterSpecifications.SetClassName);
            var levelRandomizer = randomizerRepository.GetLevelRandomizer(characterSpecifications.LevelRandomizerType, characterSpecifications.SetLevel);
            var baseRaceRandomizer = randomizerRepository.GetBaseRaceRandomizer(characterSpecifications.BaseRaceRandomizerType, characterSpecifications.SetBaseRace);
            var metaraceRandomizer = randomizerRepository.GetMetaraceRandomizer(characterSpecifications.MetaraceRandomizerType, characterSpecifications.ForceMetarace, characterSpecifications.SetMetarace);
            var compatible = false;

            try
            {
                compatible = randomizerVerifier.VerifyCompatibility(alignmentRandomizer, classNameRandomizer, levelRandomizer, baseRaceRandomizer, metaraceRandomizer);
            }
            catch (Exception e)
            {
                var message = $"An error occurred while verifying the randomizers. Message: {e.Message}";
                return Json(new { compatible = false, error = message });
            }

            return Json(new { compatible = compatible });
        }
    }
}