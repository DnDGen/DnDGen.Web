using CharacterGen.Verifiers;
using DnDGen.Web.Repositories;
using System.Web.Mvc;

namespace DnDGen.Web.Controllers.Characters
{
    public class RandomizersController : Controller
    {
        private IRandomizerRepository randomizerRepository;
        private IRandomizerVerifier randomizerVerifier;

        public RandomizersController(IRandomizerRepository randomizerRepository, IRandomizerVerifier randomizerVerifier)
        {
            this.randomizerRepository = randomizerRepository;
            this.randomizerVerifier = randomizerVerifier;
        }

        [HttpGet]
        public JsonResult Verify(string alignmentRandomizerType, string classNameRandomizerType, string levelRandomizerType, string baseRaceRandomizerType, string metaraceRandomizerType, string setAlignment = "", string setClassName = "", int setLevel = 0, bool allowLevelAdjustments = true, string setBaseRace = "", bool forceMetarace = false, string setMetarace = "")
        {
            var alignmentRandomizer = randomizerRepository.GetAlignmentRandomizer(alignmentRandomizerType, setAlignment);
            var classNameRandomizer = randomizerRepository.GetClassNameRandomizer(classNameRandomizerType, setClassName);
            var levelRandomizer = randomizerRepository.GetLevelRandomizer(levelRandomizerType, setLevel, allowLevelAdjustments);
            var baseRaceRandomizer = randomizerRepository.GetBaseRaceRandomizer(baseRaceRandomizerType, setBaseRace);
            var metaraceRandomizer = randomizerRepository.GetMetaraceRandomizer(metaraceRandomizerType, forceMetarace, setMetarace);

            var compatible = randomizerVerifier.VerifyCompatibility(alignmentRandomizer, classNameRandomizer, levelRandomizer, baseRaceRandomizer, metaraceRandomizer);

            return Json(new { compatible = compatible }, JsonRequestBehavior.AllowGet);
        }
    }
}