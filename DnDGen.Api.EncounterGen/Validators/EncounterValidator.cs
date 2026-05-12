using DnDGen.EncounterGen.Generators;
using DnDGen.EncounterGen.Models;
using Microsoft.Azure.Functions.Worker.Http;

namespace DnDGen.Api.EncounterGen.Validators
{
    public static class EncounterValidator
    {
        public static readonly IEnumerable<string> Temperatures = [
                EnvironmentConstants.Temperatures.Temperate,
                EnvironmentConstants.Temperatures.Warm,
                EnvironmentConstants.Temperatures.Cold];
        public static readonly IEnumerable<string> Environments = [
                EnvironmentConstants.Aquatic,
                EnvironmentConstants.Civilized,
                EnvironmentConstants.Desert,
                EnvironmentConstants.Forest,
                EnvironmentConstants.Hills,
                EnvironmentConstants.Marsh,
                EnvironmentConstants.Mountain,
                EnvironmentConstants.Plains,
                EnvironmentConstants.Underground];
        public static readonly IEnumerable<string> TimesOfDay = [
                EnvironmentConstants.TimesOfDay.Day,
                EnvironmentConstants.TimesOfDay.Night];
        public static readonly IEnumerable<string> CreatureTypeFilters = [
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
                CreatureDataConstants.Types.Vermin];

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

        private static string GetEnvironment(string environment) => Environments.FirstOrDefault(e => e.Equals(environment, StringComparison.OrdinalIgnoreCase)) ?? string.Empty;

        private static string GetTemperature(string temperature) => Temperatures.FirstOrDefault(t => t.Equals(temperature, StringComparison.OrdinalIgnoreCase)) ?? string.Empty;

        private static string GetTimeOfDay(string timeOfDay) => TimesOfDay.FirstOrDefault(t => t.Equals(timeOfDay, StringComparison.OrdinalIgnoreCase)) ?? string.Empty;

        private static IEnumerable<string> GetCreatureTypeFilters(IEnumerable<string> filters)
            => CreatureTypeFilters.Where(ct => filters.Any(f => f.Equals(ct, StringComparison.OrdinalIgnoreCase)));
    }
}
