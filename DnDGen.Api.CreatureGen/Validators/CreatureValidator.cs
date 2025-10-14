using DnDGen.Api.CreatureGen.Models;
using Microsoft.Azure.Functions.Worker.Http;

namespace DnDGen.Api.CreatureGen.Validators
{
    public static class CreatureValidator
    {
        public static (bool Valid, string Error, CreatureSpecifications CharacterSpecifications) GetValid(HttpRequestData request)
        {
            var spec = new CreatureSpecifications();

            var validAsCharacter = bool.TryParse(request.Query["asCharacter"], out var asCharacter);
            var creature = request.Query["creature"];
            var alignment = request.Query["alignment"];
            var creatureType = request.Query["creatureType"];
            var challengeRating = request.Query["challengeRating"];
            var templates = request.Query["template"];

            if (!validAsCharacter)
                asCharacter = false;

            spec.AsCharacter = asCharacter;

            spec.SetCreature(creature);
            spec.SetAlignmentFilter(alignment);
            spec.SetTypeFilter(creatureType);
            spec.SetChallengeRatingFilter(challengeRating);
            spec.SetTemplatesFilter(templates);

            var (Valid, Error) = spec.IsValid();
            return (Valid, Error, spec);
        }
    }
}
