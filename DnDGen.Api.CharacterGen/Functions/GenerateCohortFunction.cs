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
    public class GenerateCohortFunction
    {
        private readonly ILeadershipGenerator leadershipGenerator;

        public GenerateCohortFunction(IDependencyFactory dependencyFactory)
        {
            leadershipGenerator = dependencyFactory.Get<ILeadershipGenerator>();
        }

        [FunctionName("GenerateCohortFunction")]
        [OpenApiOperation(operationId: "GenerateCohortFunctionRun", Summary = "Generate cohort",
            Description = "Generate a cohort with the given cohort score.")]
        [OpenApiParameter(name: "cohortScore", In = ParameterLocation.Path, Required = true, Type = typeof(int),
            Description = "The leadership score, adjusted to be cohort-specific, used to generate the cohort.")]
        [OpenApiParameter(name: "leaderLevel", In = ParameterLocation.Query, Required = true, Type = typeof(int),
            Description = "The level of the leader for whom the cohort is being generated. Valid values are 6 <= level <= 20.")]
        [OpenApiParameter(name: "leaderAlignment", In = ParameterLocation.Query, Required = true, Type = typeof(int),
            Description = "The alignment of the leader.")]
        [OpenApiParameter(name: "leaderClassName", In = ParameterLocation.Query, Required = true, Type = typeof(string),
            Description = "The class name of the leader.")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(Character),
            Description = "The OK response containing the generated cohort character")]
        public Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "v1/cohort/score/{cohortScore}/generate")] HttpRequest req,
            int cohortScore, ILogger log)
        {
            log.LogInformation("C# HTTP trigger function (GenerateCohortFunction.Run) processed a request.");

            var validatorResult = CohortValidator.GetValid(req);
            if (!validatorResult.Valid)
            {
                log.LogError($"Parameters are not a valid combination. Error: {validatorResult.Error}");
                IActionResult badResult = new BadRequestResult();
                return Task.FromResult(badResult);
            }

            var cohortSpec = validatorResult.CohortSpecifications;
            var cohort = leadershipGenerator.GenerateCohort(cohortScore, cohortSpec.LeaderLevel, cohortSpec.LeaderAlignment, cohortSpec.LeaderClassName);

            log.LogInformation($"Generated Cohort: {cohort?.Summary ?? "(None)"}");

            IActionResult result = new OkObjectResult(cohort);
            return Task.FromResult(result);
        }
    }
}
