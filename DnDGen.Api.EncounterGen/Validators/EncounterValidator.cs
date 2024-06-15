using DnDGen.EncounterGen.Generators;
using DnDGen.EncounterGen.Models;
using Microsoft.Azure.Functions.Worker.Http;

namespace DnDGen.Api.EncounterGen.Validators
{
    public static class EncounterValidator
    {
        public static (bool Valid, string Error, EncounterSpecifications EncounterSpecifications) GetValid(
            HttpRequestData request,
            string temperature,
            string environment,
            string timeOfDay,
            int level)
        {
            var spec = new EncounterSpecifications();

            var validAllowAquatic = bool.TryParse(request.Query["allowAquatic"], out var allowAquatic);
            var validAllowUnderground = bool.TryParse(request.Query["allowUnderground"], out var allowUnderground);
            var creatureTypeFilters = request.Query["creatureTypeFilters"]?.Split(',') ?? [];

            if (!validAllowAquatic)
                allowAquatic = false;

            if (!validAllowUnderground)
                allowUnderground = false;

            //TODO: Parse temperature to be case-insensitive
            //TODO: Parse time of day to be case-insensitive
            //TODO: Parse creature type filters to be case-insensitive

            spec.Environment = GetEnvironment(environment);
            spec.Temperature = temperature;
            spec.TimeOfDay = timeOfDay;
            spec.Level = level;
            spec.AllowAquatic = allowAquatic;
            spec.AllowUnderground = allowUnderground;
            spec.CreatureTypeFilters = creatureTypeFilters;

            //TODO: Check real temperature
            //TODO: Check real time of day
            //TODO: Check real creature type filters

            var valid = spec.IsValid();
            return (valid, string.Empty, spec);
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
    }
}
