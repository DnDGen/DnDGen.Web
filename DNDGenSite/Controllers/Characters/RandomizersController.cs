using CharacterGen.Generators.Verifiers;
using DNDGenSite.Repositories;
using System;
using System.Web.Mvc;

namespace DNDGenSite.Controllers.Characters
{
    public class RandomizersController : Controller
    {
        private IRandomizerRepository randomizerRepository;
        private IRandomizerVerifier randomizerVerifier;

        public RandomizersController(IRandomizerRepository randomizerRepository, IRandomizerVerifier characterGenerator)
        {
            this.randomizerRepository = randomizerRepository;
            this.randomizerVerifier = characterGenerator;
        }

        [HttpGet]
        public JsonResult Verify(String alignmentRandomizerType, String classNameRandomizerType, String levelRandomizerType, String baseRaceRandomizerType, String metaraceRandomizerType, String setAlignment = "", String setClassName = "", Int32 setLevel = 0, Boolean allowLevelAdjustments = true, String setBaseRace = "", Boolean forceMetarace = false, String setMetarace = "")
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