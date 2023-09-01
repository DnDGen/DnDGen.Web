using CharacterGen.Verifiers;
using DnDGen.Web.New.IoC;
using DnDGen.Web.New.Models;
using DnDGen.Web.New.Repositories;
using EventGen;
using Microsoft.AspNetCore.Mvc;

namespace DnDGen.Web.New.Controllers.Characters
{
    [ApiController]
    public class RandomizersController : ControllerBase
    {
        private readonly IRandomizerRepository randomizerRepository;
        private readonly IRandomizerVerifier randomizerVerifier;
        private readonly ClientIDManager clientIdManager;
        private readonly ILogger<RandomizersController> logger;

        public RandomizersController(IDependencyFactory dependencyFactory, ILogger<RandomizersController> logger)
        {
            randomizerRepository = dependencyFactory.Get<IRandomizerRepository>();
            randomizerVerifier = dependencyFactory.Get<IRandomizerVerifier>();
            clientIdManager = dependencyFactory.Get<ClientIDManager>();

            this.logger = logger;
        }

        [Route("Character/Randomizers/validate")]
        [HttpGet]
        public bool Validate(Guid clientId, [ModelBinder(BinderType = typeof(RandomizerSpecificationsModelBinder))] RandomizerSpecifications characterSpecifications)
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
                logger.LogError(message);
                return false;
            }

            return compatible;
        }
    }
}