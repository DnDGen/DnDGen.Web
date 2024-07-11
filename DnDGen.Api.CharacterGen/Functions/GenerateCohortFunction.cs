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
    public class GenerateCohortFunction
    {
        private readonly ILeadershipGenerator _leadershipGenerator;
        private readonly ILogger _logger;

        public GenerateCohortFunction(ILoggerFactory loggerFactory, IDependencyFactory dependencyFactory)
        {
            _logger = loggerFactory.CreateLogger<GenerateCohortFunction>();
            _leadershipGenerator = dependencyFactory.Get<ILeadershipGenerator>();
        }

        [Function("GenerateCohortFunction")]
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
        public async Task<HttpResponseData> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "v1/cohort/score/{cohortScore}/generate")] HttpRequestData req,
            int cohortScore)
        {
            _logger.LogInformation("C# HTTP trigger function (GenerateCohortFunction.Run) processed a request.");

            var validatorResult = CohortValidator.GetValid(req);
            if (!validatorResult.Valid)
            {
                _logger.LogError($"Parameters are not a valid combination. Error: {validatorResult.Error}");

                var invalidResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                return invalidResponse;
            }

            var cohortSpec = validatorResult.CohortSpecifications;
            var cohort = _leadershipGenerator.GenerateCohort(cohortScore, cohortSpec.LeaderLevel, cohortSpec.LeaderAlignment, cohortSpec.LeaderClassName);

            var response = req.CreateResponse(HttpStatusCode.OK);

            if (cohort != null)
            {
                cohort.Skills = CharacterHelper.SortSkills(cohort.Skills);
                _logger.LogInformation($"Generated Cohort: {cohort.Summary}");
            }
            else
            {
                _logger.LogInformation("Generated Cohort: (None)");
            }

            await response.WriteAsJsonAsync(cohort);
            return response;
        }
    }
}
