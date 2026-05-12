using DnDGen.Api.CreatureGen.Models;
using Microsoft.Azure.Functions.Worker.Http;

namespace DnDGen.Api.CreatureGen.Validators
{
    public static class CreatureValidator
    {
        public static (bool Valid, string Error, CreatureSpecifications? CreatureSpecifications) GetValid(string? creatureName, HttpRequestData request)
        {
            var spec = new CreatureSpecifications();

            var alignment = request.Query["alignment"];
            var creatureType = request.Query["creatureType"] ?? request.Query["type"];
            var cr = request.Query["challengeRating"] ?? request.Query["cr"];
            var templates = request.Query.GetValues("templates") ?? [];

            spec.SetCreature(creatureName);
            spec.SetTemplatesFilter(templates);
            spec.SetAlignmentFilter(alignment);
            spec.SetTypeFilter(creatureType);
            spec.SetChallengeRatingFilter(cr);

            var (Valid, Error) = spec.IsValid();
            return (Valid, Error, Valid ? spec : null);
        }
    }
}
