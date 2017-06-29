using EncounterGen.Common;
using EncounterGen.Generators;
using System.Collections.Generic;
using System.Linq;

namespace DnDGen.Web.Models
{
    public class EncounterViewModel
    {
        public IEnumerable<string> Environments { get; set; }
        public IEnumerable<string> TimesOfDay { get; set; }
        public IEnumerable<string> Temperatures { get; set; }
        public IEnumerable<string> CreatureTypes { get; set; }
        public EncounterSpecifications EncounterSpecifications { get; set; }

        public EncounterViewModel()
        {
            Environments = new[]
            {
                EnvironmentConstants.Aquatic,
                EnvironmentConstants.Civilized,
                EnvironmentConstants.Desert,
                EnvironmentConstants.Forest,
                EnvironmentConstants.Hills,
                EnvironmentConstants.Marsh,
                EnvironmentConstants.Mountain,
                EnvironmentConstants.Plains,
                EnvironmentConstants.Underground,
            };

            Temperatures = new[]
            {
                EnvironmentConstants.Temperatures.Cold,
                EnvironmentConstants.Temperatures.Temperate,
                EnvironmentConstants.Temperatures.Warm
            };

            TimesOfDay = new[]
            {
                EnvironmentConstants.TimesOfDay.Day,
                EnvironmentConstants.TimesOfDay.Night
            };

            CreatureTypes = new[]
            {
                CreatureConstants.Types.Aberration,
                CreatureConstants.Types.Animal,
                CreatureConstants.Types.Construct,
                CreatureConstants.Types.Dragon,
                CreatureConstants.Types.Elemental,
                CreatureConstants.Types.Fey,
                CreatureConstants.Types.Giant,
                CreatureConstants.Types.Humanoid,
                CreatureConstants.Types.MagicalBeast,
                CreatureConstants.Types.MonstrousHumanoid,
                CreatureConstants.Types.Ooze,
                CreatureConstants.Types.Outsider,
                CreatureConstants.Types.Plant,
                CreatureConstants.Types.Undead,
                CreatureConstants.Types.Vermin
            };

            EncounterSpecifications = new EncounterSpecifications();
            EncounterSpecifications.Environment = Environments.First();
            EncounterSpecifications.Level = 1;
            EncounterSpecifications.Temperature = Temperatures.First();
            EncounterSpecifications.TimeOfDay = TimesOfDay.First();
        }
    }
}