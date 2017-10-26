using CharacterGen.Verifiers;
using DnDGen.Web.Models;
using DnDGen.Web.Repositories;
using EventGen;
using System;
using System.Web.Mvc;

namespace DnDGen.Web.Controllers.Characters
{
    public class RandomizersController : Controller
    {
        private readonly IRandomizerRepository randomizerRepository;
        private readonly IRandomizerVerifier randomizerVerifier;
        private readonly ClientIDManager clientIdManager;

        public RandomizersController(IRandomizerRepository randomizerRepository, IRandomizerVerifier randomizerVerifier, ClientIDManager clientIdManager)
        {
            this.randomizerRepository = randomizerRepository;
            this.randomizerVerifier = randomizerVerifier;
            this.clientIdManager = clientIdManager;
        }

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
            catch
            {

            }

            return Json(new { compatible = compatible }, JsonRequestBehavior.AllowGet);
        }
    }
}