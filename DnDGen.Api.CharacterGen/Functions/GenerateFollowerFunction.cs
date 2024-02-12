using DnDGen.Api.CharacterGen.Dependencies;
using DnDGen.Api.CharacterGen.Validators;
using DnDGen.CharacterGen.Characters;
using DnDGen.CharacterGen.Leaders;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using System.Net;
using System.Threading.Tasks;

namespace DnDGen.Api.CharacterGen.Functions
{
    public class GenerateFollowerFunction
    {
        private readonly ILeadershipGenerator leadershipGenerator;

        public GenerateFollowerFunction(IDependencyFactory dependencyFactory)
        {
            leadershipGenerator = dependencyFactory.Get<ILeadershipGenerator>();
        }

        [FunctionName("GenerateFollowerFunction")]
        [OpenApiOperation(operationId: "GenerateFollowerFunctionRun", Summary = "Generate cohort",
            Description = "Generate a follower at the given level.")]
        [OpenApiParameter(name: "followerLevel", In = ParameterLocation.Path, Required = true, Type = typeof(int),
            Description = "The level of the follower to generate. Valid values are 1 <= level <= 6.")]
        [OpenApiParameter(name: "leaderAlignment", In = ParameterLocation.Query, Required = true, Type = typeof(int),
            Description = "The alignment of the leader.")]
        [OpenApiParameter(name: "leaderClassName", In = ParameterLocation.Query, Required = true, Type = typeof(string),
            Description = "The class name of the leader.")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(Character),
            Description = "The OK response containing the generated cohort character")]
        public Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "v1/follower/level/{followerLevel}/generate")] HttpRequest req,
            int followerLevel, ILogger log)
        {
            log.LogInformation("C# HTTP trigger function (GenerateFollowerFunction.Run) processed a request.");

            var validatorResult = FollowerValidator.GetValid(followerLevel, req);
            if (!validatorResult.Valid)
            {
                log.LogError($"Parameters are not a valid combination. Error: {validatorResult.Error}");
                IActionResult badResult = new BadRequestResult();
                return Task.FromResult(badResult);
            }

            var followerSpec = validatorResult.CohortSpecifications;
            var follower = leadershipGenerator.GenerateFollower(followerLevel, followerSpec.LeaderAlignment, followerSpec.LeaderClassName);

            log.LogInformation($"Generated Follower: {follower.Summary}");

            IActionResult result = new OkObjectResult(follower);
            return Task.FromResult(result);
        }
    }
}
