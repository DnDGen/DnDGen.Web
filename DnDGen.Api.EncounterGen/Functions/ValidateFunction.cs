using DnDGen.Api.EncounterGen.Dependencies;
using DnDGen.Api.EncounterGen.Validators;
using DnDGen.EncounterGen.Generators;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using System.Net;

namespace DnDGen.Api.EncounterGen.Functions
{
    public class ValidateFunction
    {
        private readonly ILogger _logger;
        private readonly IEncounterVerifier _verifier;

        public ValidateFunction(ILoggerFactory loggerFactory, IDependencyFactory dependencyFactory)
        {
            _logger = loggerFactory.CreateLogger<ValidateFunction>();
            _verifier = dependencyFactory.Get<IEncounterVerifier>();
        }

        [Function("ValidateFunction")]
        [OpenApiOperation(operationId: "ValidateFunctionRun", tags: ["v1"],
            Summary = "Validate encounter parameters",
            Description = "Validate the parameter combination for encounter generation.")]
        [OpenApiParameter(name: "environment",
            In = ParameterLocation.Path,
            Required = true,
            Type = typeof(string),
            Description = "The environment of the encounter. Valid values: Aquatic, Civilized, Desert, Forest, Hill, Marsh, Mountain, Plains, Underground")]
        [OpenApiParameter(name: "level",
            In = ParameterLocation.Path,
            Required = true,
            Type = typeof(int),
            Description = "The target level of the encounter. Valid values: 1 <= L <= 30")]
        [OpenApiParameter(name: "temperature",
            In = ParameterLocation.Path,
            Required = true,
            Type = typeof(string),
            Description = "The temperature of the environment for the encounter. Valid values: Cold, Temperate, Warm")]
        [OpenApiParameter(name: "timeOfDay",
            In = ParameterLocation.Path,
            Required = true,
            Type = typeof(string),
            Description = "The time of day for the encounter. Valid values: Day, Night")]
        [OpenApiParameter(name: "allowAquatic",
            In = ParameterLocation.Query,
            Required = false,
            Type = typeof(bool),
            Description = "Whether to allow aquatic encounters. Defaults to false.")]
        [OpenApiParameter(name: "allowUnderground",
            In = ParameterLocation.Query,
            Required = false,
            Type = typeof(bool),
            Description = "Whether to allow underground encounters. Defaults to false")]
        [OpenApiParameter(name: "creatureTypeFilters",
            In = ParameterLocation.Query,
            Required = false,
            Type = typeof(string[]),
            Description = "The allowed creature types for the encounter. Providing all is the same as providing none. Valid values: Aberration, Animal, Construct, Dragon, Elemental, Fey, Giant, Humanoid, Magical Beast, Monstrous Humanoid, Ooze, Outsider, Plant, Undead, Vermin")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(bool),
            Description = "The OK response containing the validity of the parameter combination")]
        public async Task<HttpResponseData> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "v1/encounter/{temperature}/{environment}/{timeOfDay}/level/{level:int}/validate")] HttpRequestData req,
            string temperature, string environment, string timeOfDay, int level)
        {
            _logger.LogInformation("C# HTTP trigger function (ValidateFunction.Run) processed a request.");

            var spec = EncounterValidator.GetSpecifications(req, temperature, environment, timeOfDay, level);
            if (!spec.IsValid())
            {
                _logger.LogError($"Parameters are not a valid combination. Valid specification: {spec.Description}");

                var invalidResponse = req.CreateResponse(HttpStatusCode.OK);
                await invalidResponse.WriteAsJsonAsync(false);
                return invalidResponse;
            }

            var compatible = _verifier.ValidEncounterExists(spec);
            _logger.LogInformation($"Encounter Validity: {compatible}");

            var response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(compatible);
            return response;
        }
    }
}
