using DnDGen.Api.CharacterGen.Models;
using Microsoft.AspNetCore.Http;

namespace DnDGen.Api.CharacterGen.Validators
{
    public static class CohortValidator
    {
        public static (bool Valid, string Error, CohortSpecifications CohortSpecifications) GetValid(int leaderLevel, HttpRequest request)
        {
            //TODO: Get all the possible parameters from the request
            var spec = new CohortSpecifications { LeaderLevel = leaderLevel };

            var leaderAlignment = (string)request.Query["leaderAlignment"];
            var leaderClassName = (string)request.Query["leaderClassName"];

            spec.SetAlignment(leaderAlignment);
            spec.SetClassName(leaderClassName);

            var result = spec.IsValid();
            return (result.Valid, result.Error, spec);
        }
    }
}
