using CharacterGen.Characters;
using DnDGen.Web.Helpers;
using DnDGen.Web.Models;
using DnDGen.Web.Repositories;
using EventGen;
using System;
using System.Web.Mvc;

namespace DnDGen.Web.Controllers
{
    public class CharacterController : Controller
    {
        private readonly IRandomizerRepository randomizerRepository;
        private readonly ICharacterGenerator characterGenerator;
        private readonly ClientIDManager clientIdManager;

        public CharacterController(IRandomizerRepository randomizerRepository, ICharacterGenerator characterGenerator, ClientIDManager clientIdManager)
        {
            this.randomizerRepository = randomizerRepository;
            this.characterGenerator = characterGenerator;
            this.clientIdManager = clientIdManager;
        }

        [HttpGet]
        public ActionResult Index()
        {
            var model = new CharacterViewModel();
            return View(model);
        }

        [HttpGet]
        public JsonResult Generate(Guid clientId, CharacterSpecifications characterSpecifications)
        {
            clientIdManager.SetClientID(clientId);

            var alignmentRandomizer = randomizerRepository.GetAlignmentRandomizer(characterSpecifications.AlignmentRandomizerType, characterSpecifications.SetAlignment);
            var classNameRandomizer = randomizerRepository.GetClassNameRandomizer(characterSpecifications.ClassNameRandomizerType, characterSpecifications.SetClassName);
            var levelRandomizer = randomizerRepository.GetLevelRandomizer(characterSpecifications.LevelRandomizerType, characterSpecifications.SetLevel, characterSpecifications.AllowLevelAdjustments);
            var baseRaceRandomizer = randomizerRepository.GetBaseRaceRandomizer(characterSpecifications.BaseRaceRandomizerType, characterSpecifications.SetBaseRace);
            var metaraceRandomizer = randomizerRepository.GetMetaraceRandomizer(characterSpecifications.MetaraceRandomizerType, characterSpecifications.ForceMetarace, characterSpecifications.SetMetarace);
            var abilitiesRandomizer = randomizerRepository.GetAbilitiesRandomizer(characterSpecifications.AbilitiesRandomizerType,
                characterSpecifications.SetStrength,
                characterSpecifications.SetConstitution,
                characterSpecifications.SetDexterity,
                characterSpecifications.SetIntelligence,
                characterSpecifications.SetWisdom,
                characterSpecifications.SetCharisma,
                characterSpecifications.AllowAbilityAdjustments);

            var character = characterGenerator.GenerateWith(alignmentRandomizer, classNameRandomizer, levelRandomizer, baseRaceRandomizer, metaraceRandomizer, abilitiesRandomizer);

            character.Skills = CharacterHelper.SortSkills(character.Skills);

            return Json(new { character = character }, JsonRequestBehavior.AllowGet);
        }
    }
}