using CharacterGen.Characters;
using DnDGen.Web.New.Helpers;
using DnDGen.Web.New.IoC;
using DnDGen.Web.New.Models;
using DnDGen.Web.New.Repositories;
using EventGen;
using Microsoft.AspNetCore.Mvc;

namespace DnDGen.Web.New.Controllers
{
    [ApiController]
    public class CharacterController : ControllerBase
    {
        private readonly IRandomizerRepository randomizerRepository;
        private readonly ICharacterGenerator characterGenerator;
        private readonly ClientIDManager clientIdManager;

        public CharacterController(IDependencyFactory dependencyFactory)
        {
            randomizerRepository = dependencyFactory.Get<IRandomizerRepository>();
            characterGenerator = dependencyFactory.Get<ICharacterGenerator>();
            clientIdManager = dependencyFactory.Get<ClientIDManager>();
        }

        [Route("character/viewmodel")]
        [HttpGet]
        public CharacterViewModel GetViewModel()
        {
            var model = new CharacterViewModel();
            return model;
        }

        [Route("Character/Generate")]
        [HttpGet]
        public Character Generate(Guid clientId, [ModelBinder(BinderType = typeof(CharacterSpecificationsModelBinder))] CharacterSpecifications characterSpecifications)
        {
            clientIdManager.SetClientID(clientId);

            var alignmentRandomizer = randomizerRepository.GetAlignmentRandomizer(characterSpecifications.AlignmentRandomizerType, characterSpecifications.SetAlignment);
            var classNameRandomizer = randomizerRepository.GetClassNameRandomizer(characterSpecifications.ClassNameRandomizerType, characterSpecifications.SetClassName);
            var levelRandomizer = randomizerRepository.GetLevelRandomizer(characterSpecifications.LevelRandomizerType, characterSpecifications.SetLevel);
            var baseRaceRandomizer = randomizerRepository.GetBaseRaceRandomizer(characterSpecifications.BaseRaceRandomizerType, characterSpecifications.SetBaseRace);
            var metaraceRandomizer = randomizerRepository.GetMetaraceRandomizer(
                characterSpecifications.MetaraceRandomizerType,
                characterSpecifications.ForceMetarace,
                characterSpecifications.SetMetarace);
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

            return character;
        }
    }
}