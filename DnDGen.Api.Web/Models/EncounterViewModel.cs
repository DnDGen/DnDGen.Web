using DnDGen.EncounterGen.Generators;
using DnDGen.EncounterGen.Models;

namespace DnDGen.Api.Web.Models
{
    public class EncounterViewModel
    {
        public IEnumerable<string> Environments { get; set; }
        public IEnumerable<string> TimesOfDay { get; set; }
        public IEnumerable<string> Temperatures { get; set; }
        public IEnumerable<string> CreatureTypes { get; set; }
        public EncounterSpecifications Defaults { get; set; }

        public EncounterViewModel()
        {
            Environments =
            [
                EnvironmentConstants.Aquatic,
                EnvironmentConstants.Civilized,
                EnvironmentConstants.Desert,
                EnvironmentConstants.Forest,
                EnvironmentConstants.Hills,
                EnvironmentConstants.Marsh,
                EnvironmentConstants.Mountain,
                EnvironmentConstants.Plains,
                EnvironmentConstants.Underground,
            ];

            Temperatures =
            [
                EnvironmentConstants.Temperatures.Cold,
                EnvironmentConstants.Temperatures.Temperate,
                EnvironmentConstants.Temperatures.Warm
            ];

            TimesOfDay =
            [
                EnvironmentConstants.TimesOfDay.Day,
                EnvironmentConstants.TimesOfDay.Night
            ];

            CreatureTypes =
            [
                CreatureDataConstants.Types.Aberration,
                CreatureDataConstants.Types.Animal,
                CreatureDataConstants.Types.Construct,
                CreatureDataConstants.Types.Dragon,
                CreatureDataConstants.Types.Elemental,
                CreatureDataConstants.Types.Fey,
                CreatureDataConstants.Types.Giant,
                CreatureDataConstants.Types.Humanoid,
                CreatureDataConstants.Types.MagicalBeast,
                CreatureDataConstants.Types.MonstrousHumanoid,
                CreatureDataConstants.Types.Ooze,
                CreatureDataConstants.Types.Outsider,
                CreatureDataConstants.Types.Plant,
                CreatureDataConstants.Types.Undead,
                CreatureDataConstants.Types.Vermin
            ];

            Defaults = new EncounterSpecifications
            {
                Temperature = EnvironmentConstants.Temperatures.Temperate,
                Environment = EnvironmentConstants.Plains,
                TimeOfDay = EnvironmentConstants.TimesOfDay.Day,
                Level = 1
            };
        }
    }
}