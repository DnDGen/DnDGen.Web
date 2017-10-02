using CharacterGen.Verifiers;
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
        public JsonResult Verify(Guid clientId, string alignmentRandomizerType, string classNameRandomizerType, string levelRandomizerType, string baseRaceRandomizerType, string metaraceRandomizerType, string setAlignment = "", string setClassName = "", int setLevel = 0, bool allowLevelAdjustments = true, string setBaseRace = "", bool forceMetarace = false, string setMetarace = "")
        {
            clientIdManager.SetClientID(clientId);

            var alignmentRandomizer = randomizerRepository.GetAlignmentRandomizer(alignmentRandomizerType, setAlignment);
            var classNameRandomizer = randomizerRepository.GetClassNameRandomizer(classNameRandomizerType, setClassName);
            var levelRandomizer = randomizerRepository.GetLevelRandomizer(levelRandomizerType, setLevel, allowLevelAdjustments);
            var baseRaceRandomizer = randomizerRepository.GetBaseRaceRandomizer(baseRaceRandomizerType, setBaseRace);
            var metaraceRandomizer = randomizerRepository.GetMetaraceRandomizer(metaraceRandomizerType, forceMetarace, setMetarace);
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