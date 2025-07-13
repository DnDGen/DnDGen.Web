using DnDGen.Api.CharacterGen.Dependencies;
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
    public class GenerateLeadershipFunction
    {
        private readonly ILeadershipGenerator _leadershipGenerator;
        private readonly ILogger _logger;

        public GenerateLeadershipFunction(ILoggerFactory loggerFactory, IDependencyFactory dependencyFactory)
        {
            _logger = loggerFactory.CreateLogger<GenerateLeadershipFunction>();
            _leadershipGenerator = dependencyFactory.Get<ILeadershipGenerator>();
        }

        [Function("GenerateLeadershipFunction")]
        [OpenApiOperation(operationId: "GenerateLeadershipFunctionRun", tags: ["v1"],
            Summary = "Generate leadership",
            Description = "Generate leadership characteristics for a leader at the given level.")]
        [OpenApiParameter(name: "level",
            In = ParameterLocation.Path,
            Required = true,
            Type = typeof(int),
            Description = "The level of the leader for whom the leadership is being generated. Valid values are 6 <= level <= 20.")]
        [OpenApiParameter(name: "leaderCharismaBonus",
            In = ParameterLocation.Query,
            Required = false,
            Type = typeof(int),
            Description = "The Charisma bonus of the leader. Defaults to 0.")]
        [OpenApiParameter(name: "leaderAnimal",
            In = ParameterLocation.Query,
            Required = false,
            Type = typeof(string),
            Description = "The animal companion or familiar of the leader. Defaults to none (empty).")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(Leadership),
            Description = "The OK response containing the generated leadership")]
        public async Task<HttpResponseData> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "v1/leadership/level/{level}/generate")] HttpRequestData req,
            int level)
        {
            _logger.LogInformation("C# HTTP trigger function (GenerateLeadershipFunction.Run) processed a request.");

            if (level < 6 || level > 20)
            {
                _logger.LogError($"Level {level} is not in the valid range. Valid: 6 <= level <= 20");

                var invalidResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                return invalidResponse;
            }

            var animal = req.Query["leaderAnimal"] ?? string.Empty;
            var validCharismaBonus = int.TryParse(req.Query["leaderCharismaBonus"], out var charismaBonus);

            if (!validCharismaBonus)
                charismaBonus = 0;

            var leadership = _leadershipGenerator.GenerateLeadership(level, charismaBonus, animal);

            _logger.LogInformation($"Generated Leadership: Score - {leadership.Score}; Modifiers - {string.Join(", ", leadership.LeadershipModifiers)}");

            var response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(leadership);
            return response;
        }
    }
}
