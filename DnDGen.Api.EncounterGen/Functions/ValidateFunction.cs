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

        public ValidateFunction(ILoggerFactory loggerFactory)
        {
            _logger = loggerFactory.CreateLogger<ValidateFunction>();
        }

        [Function("ValidateFunction")]
        [OpenApiOperation(operationId: "ValidateFunctionRun", Summary = "Validate encounter parameters",
            Description = "Validate the parameter combination for encounter generation.")]
        [OpenApiParameter(name: "environment", In = ParameterLocation.Path, Required = true, Type = typeof(string),
            Description = "The environment of the encounter. Valid values: Aquatic, Civilized, Desert, Hill, Marsh, Mountain, Plains, Underground")]
        [OpenApiParameter(name: "level", In = ParameterLocation.Path, Required = true, Type = typeof(int),
            Description = "The target level of the encounter. Valid values: 1 <= L <= 30")]
        [OpenApiParameter(name: "temperature", In = ParameterLocation.Path, Required = true, Type = typeof(string),
            Description = "The temperature of the environment for the encounter. Valid values: Cold, Temperate, Warm")]
        [OpenApiParameter(name: "timeOfDay", In = ParameterLocation.Path, Required = true, Type = typeof(string),
            Description = "The time of day for the encounter. Valid values: Day, Night")]
        [OpenApiParameter(name: "allowAquatic", In = ParameterLocation.Query, Required = false, Type = typeof(bool),
            Description = "Whether to allow aquatic encounters. Defaults to false.")]
        [OpenApiParameter(name: "allowUnderground", In = ParameterLocation.Query, Required = false, Type = typeof(bool),
            Description = "Whether to allow underground encounters. Defaults to false")]
        [OpenApiParameter(name: "creatureTypeFilters", In = ParameterLocation.Query, Required = false, Type = typeof(string[]),
            Description = "The allowed creature types for the encounter. Providing all is the same as providing none. Valid values: Aberration, Animal, Dragon, Elemental, Fey, Humanoid, Monstrous Humanoid, Ooze, Outsider, Undead, Vermin")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(bool),
            Description = "The OK response containing the validity of the parameter combination")]
        public HttpResponseData Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "v1/encounter/{temperature}/{environment}/{timeOfDay}/{level}/validate")] HttpRequestData req)
        {
            _logger.LogInformation("C# HTTP trigger function (ValidateFunction.Run) processed a request.");

            //var response = req.CreateResponse(HttpStatusCode.OK);
            //response.Headers.Add("Content-Type", "text/plain; charset=utf-8");

            //response.WriteString("Welcome to Azure Functions!");

            //return response;

            var validatorResult = EncounterValidator.GetValid(req);
            if (!validatorResult.Valid)
            {
                _logger.LogError($"Parameters are not a valid combination. Error: {validatorResult.Error}");

                IActionResult invalidResult = new OkObjectResult(validatorResult.Valid);
                return Task.FromResult(invalidResult);
            }

            var characterSpecifications = validatorResult.CharacterSpecifications;

            var alignmentRandomizer = randomizerRepository.GetAlignmentRandomizer(characterSpecifications.AlignmentRandomizerType, characterSpecifications.SetAlignment);
            var classNameRandomizer = randomizerRepository.GetClassNameRandomizer(characterSpecifications.ClassNameRandomizerType, characterSpecifications.SetClassName);
            var levelRandomizer = randomizerRepository.GetLevelRandomizer(characterSpecifications.LevelRandomizerType, characterSpecifications.SetLevel);
            var baseRaceRandomizer = randomizerRepository.GetBaseRaceRandomizer(characterSpecifications.BaseRaceRandomizerType, characterSpecifications.SetBaseRace);
            var metaraceRandomizer = randomizerRepository.GetMetaraceRandomizer(
                characterSpecifications.MetaraceRandomizerType,
                characterSpecifications.ForceMetarace,
                characterSpecifications.SetMetarace);

            var compatible = randomizerVerifier.VerifyCompatibility(alignmentRandomizer, classNameRandomizer, levelRandomizer, baseRaceRandomizer, metaraceRandomizer);
            _logger.LogInformation($"Randomizer Validity: {compatible}");

            var response = req.CreateResponse(HttpStatusCode.OK);
            response.WriteAsJsonAsync()
            return Task.FromResult(result);
        }
    }
}
