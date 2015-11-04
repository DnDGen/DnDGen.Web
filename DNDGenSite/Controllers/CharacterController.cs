using CharacterGen.Generators;
using DNDGenSite.Repositories;
using System;
using System.Web.Mvc;

namespace DNDGenSite.Controllers
{
    public class CharacterController : Controller
    {
        private IRandomizerRepository randomizerRepository;
        private ICharacterGenerator characterGenerator;

        public CharacterController(IRandomizerRepository randomizerRepository, ICharacterGenerator characterGenerator)
        {
            this.randomizerRepository = randomizerRepository;
            this.characterGenerator = characterGenerator;
        }

        [HttpGet]
        public JsonResult Generate(String alignmentRandomizerType, String classNameRandomizerType, String levelRandomizerType, String baseRaceRandomizerType, String metaraceRandomizerType, String statsRandomizerType, String setAlignment = "", String setClassName = "", Int32 setLevel = 0, String setBaseRace = "", Boolean forceMetarace = false, String setMetarace = "", Int32 setStrength = 0, Int32 setConstitution = 0, Int32 setDexterity = 0, Int32 setIntelligence = 0, Int32 setWisdom = 0, Int32 setCharisma = 0)
        {
            var alignmentRandomizer = randomizerRepository.GetAlignmentRandomizer(alignmentRandomizerType, setAlignment);
            var classNameRandomizer = randomizerRepository.GetClassNameRandomizer(classNameRandomizerType, setClassName);
            var levelRandomizer = randomizerRepository.GetLevelRandomizer(levelRandomizerType, setLevel);
            var baseRaceRandomizer = randomizerRepository.GetBaseRaceRandomizer(baseRaceRandomizerType, setBaseRace);
            var metaraceRandomizer = randomizerRepository.GetMetaraceRandomizer(metaraceRandomizerType, forceMetarace, setMetarace);
            var statsRandomizer = randomizerRepository.GetStatsRandomizer(statsRandomizerType, setStrength, setConstitution, setDexterity, setIntelligence, setWisdom, setCharisma);

            var character = characterGenerator.GenerateWith(alignmentRandomizer, classNameRandomizer, levelRandomizer, baseRaceRandomizer, metaraceRandomizer, statsRandomizer);

            return Json(new { character = character }, JsonRequestBehavior.AllowGet);
        }
    }
}