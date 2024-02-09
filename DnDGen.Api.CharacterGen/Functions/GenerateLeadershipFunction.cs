using DnDGen.Api.CharacterGen.Dependencies;
using DnDGen.CharacterGen.Leaders;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using System;
using System.Net;
using System.Threading.Tasks;

namespace DnDGen.Api.CharacterGen.Functions
{
    public class GenerateLeadershipFunction
    {
        private readonly ILeadershipGenerator leadershipGenerator;

        public GenerateLeadershipFunction(IDependencyFactory dependencyFactory)
        {
            leadershipGenerator = dependencyFactory.Get<ILeadershipGenerator>();
        }

        [FunctionName("GenerateLeadershipFunction")]
        [OpenApiOperation(operationId: "GenerateLeadershipFunctionRun", Summary = "Generate leadership",
            Description = "Generate leadership characteristics for a leader at the given level.")]
        [OpenApiParameter(name: "level", In = ParameterLocation.Path, Required = true, Type = typeof(int),
            Description = "The level of the leader for whom the leadership is being generated. Valid values are 6 <= level <= 20.")]
        [OpenApiParameter(name: "leaderCharismaBonus", In = ParameterLocation.Query, Required = false, Type = typeof(int),
            Description = "The Charisma bonus of the leader. Defaults to 0.")]
        [OpenApiParameter(name: "leaderAnimal", In = ParameterLocation.Query, Required = false, Type = typeof(string),
            Description = "The animal companion or familiar of the leader. Defaults to none (empty).")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(Leadership),
            Description = "The OK response containing the generated leadership")]
        public Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "v1/leadership/level/{level}/generate")] HttpRequest req,
            int level, ILogger log)
        {
            log.LogInformation("C# HTTP trigger function (GenerateLeadershipFunction.Run) processed a request.");

            if (level < 6 || level > 20)
            {
                log.LogError($"Level {level} is not in the valid range. Valid: 6 <= level <= 20");
                IActionResult badResult = new BadRequestResult();
                return Task.FromResult(badResult);
            }

            var animal = (string)req.Query["leaderAnimal"];
            var charismaBonus = Convert.ToInt32(req.Query["leaderCharismaBonus"]);

            var leadership = leadershipGenerator.GenerateLeadership(level, charismaBonus, animal);

            log.LogInformation($"Generated Leadership: Score - {leadership.Score}; Modifiers - {string.Join(", ", leadership.LeadershipModifiers)}");

            IActionResult result = new OkObjectResult(leadership);
            return Task.FromResult(result);
        }
    }
}
