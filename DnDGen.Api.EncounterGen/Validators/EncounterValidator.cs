using DnDGen.EncounterGen.Generators;
using DnDGen.EncounterGen.Models;
using Microsoft.Azure.Functions.Worker.Http;

namespace DnDGen.Api.EncounterGen.Validators
{
    public static class EncounterValidator
    {
        public static EncounterSpecifications GetSpecifications(
            HttpRequestData request,
            string temperature,
            string environment,
            string timeOfDay,
            int level)
        {
            var spec = new EncounterSpecifications();

            var validAllowAquatic = bool.TryParse(request.Query["allowAquatic"], out var allowAquatic);
            var validAllowUnderground = bool.TryParse(request.Query["allowUnderground"], out var allowUnderground);
            var creatureTypeFilters = request.Query.GetValues("creatureTypeFilters") ?? [];

            if (!validAllowAquatic)
            {
                allowAquatic = false;
            }

            if (!validAllowUnderground)
            {
                allowUnderground = false;
            }

            spec.Environment = GetEnvironment(environment);
            spec.Temperature = GetTemperature(temperature);
            spec.TimeOfDay = GetTimeOfDay(timeOfDay);
            spec.Level = level;
            spec.AllowAquatic = allowAquatic;
            spec.AllowUnderground = allowUnderground;
            spec.CreatureTypeFilters = GetCreatureTypeFilters(creatureTypeFilters);

            return spec;
        }

        private static string GetEnvironment(string environment)
        {
            var environments = new[]
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

            return environments.FirstOrDefault(e => e.Equals(environment, StringComparison.OrdinalIgnoreCase));
        }

        private static string GetTemperature(string temperature)
        {
            var temperatures = new[]
            {
                EnvironmentConstants.Temperatures.Temperate,
                EnvironmentConstants.Temperatures.Warm,
                EnvironmentConstants.Temperatures.Cold,
            };

            return temperatures.FirstOrDefault(t => t.Equals(temperature, StringComparison.OrdinalIgnoreCase));
        }

        private static string GetTimeOfDay(string timeOfDay)
        {
            var timesOfDay = new[]
            {
                EnvironmentConstants.TimesOfDay.Day,
                EnvironmentConstants.TimesOfDay.Night,
            };

            return timesOfDay.FirstOrDefault(t => t.Equals(timeOfDay, StringComparison.OrdinalIgnoreCase));
        }

        private static IEnumerable<string> GetCreatureTypeFilters(string[] filters)
        {
            var creatureTypes = new[]
            {
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
                CreatureDataConstants.Types.Vermin,
            };

            return creatureTypes.Where(ct => filters.Any(f => f.Equals(ct, StringComparison.OrdinalIgnoreCase)));
        }
    }
}
