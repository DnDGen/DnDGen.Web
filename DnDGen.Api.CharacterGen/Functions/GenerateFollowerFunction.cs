using DnDGen.Api.CharacterGen.Dependencies;
using DnDGen.Api.CharacterGen.Helpers;
using DnDGen.Api.CharacterGen.Validators;
using DnDGen.CharacterGen.Characters;
using DnDGen.CharacterGen.Leaders;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using System.Net;
using System.Threading.Tasks;

namespace DnDGen.Api.CharacterGen.Functions
{
    public class GenerateFollowerFunction
    {
        private readonly ILeadershipGenerator _leadershipGenerator;
        private readonly ILogger _logger;

        public GenerateFollowerFunction(ILoggerFactory loggerFactory, IDependencyFactory dependencyFactory)
        {
            _logger = loggerFactory.CreateLogger<GenerateFollowerFunction>();
            _leadershipGenerator = dependencyFactory.Get<ILeadershipGenerator>();
        }

        [Function("GenerateFollowerFunction")]
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
        public async Task<HttpResponseData> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "v1/follower/level/{followerLevel}/generate")] HttpRequestData req,
            int followerLevel)
        {
            _logger.LogInformation("C# HTTP trigger function (GenerateFollowerFunction.Run) processed a request.");

            var validatorResult = FollowerValidator.GetValid(followerLevel, req);
            if (!validatorResult.Valid)
            {
                _logger.LogError($"Parameters are not a valid combination. Error: {validatorResult.Error}");

                var invalidResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                return invalidResponse;
            }

            var followerSpec = validatorResult.FollowerSpecifications;
            var follower = _leadershipGenerator.GenerateFollower(followerLevel, followerSpec.LeaderAlignment, followerSpec.LeaderClassName);

            follower.Skills = CharacterHelper.SortSkills(follower.Skills);

            _logger.LogInformation($"Generated Follower: {follower.Summary}");

            var response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(follower);
            return response;
        }
    }
}
