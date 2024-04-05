using DnDGen.Api.CharacterGen.Models;
using Microsoft.AspNetCore.Http;

namespace DnDGen.Api.CharacterGen.Validators
{
    public static class FollowerValidator
    {
        public static (bool Valid, string Error, FollowerSpecifications FollowerSpecifications) GetValid(int followerLevel, HttpRequest request)
        {
            var leaderAlignment = (string)request.Query["leaderAlignment"];
            var leaderClassName = (string)request.Query["leaderClassName"];

            var spec = new FollowerSpecifications { FollowerLevel = followerLevel };
            spec.SetAlignment(leaderAlignment);
            spec.SetClassName(leaderClassName);

            var result = spec.IsValid();
            return (result.Valid, result.Error, spec);
        }
    }
}
