using DnDGen.Api.CharacterGen.Models;
using Microsoft.Azure.Functions.Worker.Http;

namespace DnDGen.Api.CharacterGen.Validators
{
    public static class FollowerValidator
    {
        public static (bool Valid, string Error, FollowerSpecifications FollowerSpecifications) GetValid(int followerLevel, HttpRequestData request)
        {
            var leaderAlignment = request.Query["leaderAlignment"] ?? string.Empty;
            var leaderClassName = request.Query["leaderClassName"] ?? string.Empty;

            var spec = new FollowerSpecifications { FollowerLevel = followerLevel };
            spec.SetAlignment(leaderAlignment);
            spec.SetClassName(leaderClassName);

            var result = spec.IsValid();
            return (result.Valid, result.Error, spec);
        }
    }
}
