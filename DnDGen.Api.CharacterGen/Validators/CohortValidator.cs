using DnDGen.Api.CharacterGen.Models;
using Microsoft.Azure.Functions.Worker.Http;

namespace DnDGen.Api.CharacterGen.Validators
{
    public static class CohortValidator
    {
        public static (bool Valid, string Error, CohortSpecifications CohortSpecifications) GetValid(HttpRequestData request)
        {
            var leaderAlignment = request.Query["leaderAlignment"] ?? string.Empty;
            var leaderClassName = request.Query["leaderClassName"] ?? string.Empty;
            var validLeaderLevel = int.TryParse(request.Query["leaderLevel"], out var leaderLevel);

            if (!validLeaderLevel)
                leaderLevel = 0;

            var spec = new CohortSpecifications { LeaderLevel = leaderLevel };
            spec.SetAlignment(leaderAlignment);
            spec.SetClassName(leaderClassName);

            var result = spec.IsValid();
            return (result.Valid, result.Error, spec);
        }
    }
}
