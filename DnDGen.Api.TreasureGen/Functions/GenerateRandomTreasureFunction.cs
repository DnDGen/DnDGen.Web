using DnDGen.Api.TreasureGen.Dependencies;
using DnDGen.Api.TreasureGen.Models;
using DnDGen.TreasureGen;
using DnDGen.TreasureGen.Coins;
using DnDGen.TreasureGen.Generators;
using DnDGen.TreasureGen.Goods;
using DnDGen.TreasureGen.Items;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using System;
using System.Net;
using System.Threading.Tasks;

namespace DnDGen.Api.TreasureGen.Functions
{
    public class GenerateRandomTreasureFunction
    {
        private readonly ITreasureGenerator _treasureGenerator;
        private readonly ICoinGenerator _coinGenerator;
        private readonly IGoodsGenerator _goodsGenerator;
        private readonly IItemsGenerator _itemsGenerator;
        private readonly ILogger _logger;

        public GenerateRandomTreasureFunction(ILoggerFactory loggerFactory, IDependencyFactory dependencyFactory)
        {
            _logger = loggerFactory.CreateLogger<GenerateRandomTreasureFunction>();
            _treasureGenerator = dependencyFactory.Get<ITreasureGenerator>();
            _coinGenerator = dependencyFactory.Get<ICoinGenerator>();
            _goodsGenerator = dependencyFactory.Get<IGoodsGenerator>();
            _itemsGenerator = dependencyFactory.Get<IItemsGenerator>();
        }

        [Function("GenerateRandomTreasureFunction")]
        [OpenApiOperation(operationId: "GenerateRandomTreasureFunctionRun", tags: ["v1"],
            Summary = "Generate random treasure",
            Description = "Generate random treasure at the specified level. Can narrow the treasure to coin, goods, or items.")]
        [OpenApiParameter(name: "treasureType",
            In = ParameterLocation.Path,
            Required = true,
            Type = typeof(TreasureTypes),
            Description = "The type of treasure to generate. Valid values: Treasure, Coin, Goods, Items")]
        [OpenApiParameter(name: "level",
            In = ParameterLocation.Path,
            Required = true,
            Type = typeof(int),
            Description = "The level at which to generate the treasure. Should be 1 <= level")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(Treasure),
            Description = "The OK response containing the generated treasure")]
        public async Task<HttpResponseData> RunV1(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "v1/{treasureType}/level/{level:int}/generate")] HttpRequestData req,
            string treasureType, int level)
        {
            _logger.LogInformation("C# HTTP trigger function (GenerateRandomTreasureFunction.RunV1) processed a request.");

            return await Run(req, treasureType, level);
        }

        private async Task<HttpResponseData> Run(HttpRequestData req, string treasureType, int level)
        {
            var validTreasureType = Enum.TryParse<TreasureTypes>(treasureType, true, out var validatedTreasureType);
            if (!validTreasureType)
            {
                _logger.LogError($"Parameter 'treasureType' of '{treasureType}' is not a valid Treasure Type. Should be one of: Treasure, Coin, Goods, Items");

                var invalidResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                return invalidResponse;
            }

            if (level < LevelLimits.Minimum)
            {
                _logger.LogError($"Parameter 'level' of '{level}' is not a valid level. Should be 1 <= level");

                var invalidResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                return invalidResponse;
            }

            var treasure = await GetTreasureAsync(validatedTreasureType, level);

            _logger.LogInformation($"Generated Treasure ({validatedTreasureType}) at level {level}");

            var response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteDnDGenModelAsJsonAsync(treasure);
            return response;
        }

        [Function("GenerateRandomTreasureFunctionV2")]
        [OpenApiOperation(operationId: "GenerateRandomTreasureFunctionRunV2", tags: ["v2"],
            Summary = "Generate random treasure",
            Description = "Generate random treasure at the specified level. Can narrow the treasure to coin, goods, or items.")]
        [OpenApiParameter(name: "treasureType",
            In = ParameterLocation.Path,
            Required = true,
            Type = typeof(TreasureTypes),
            Description = "The type of treasure to generate. Valid values: Treasure, Coin, Goods, Items")]
        [OpenApiParameter(name: "level",
            In = ParameterLocation.Path,
            Required = true,
            Type = typeof(int),
            Description = "The level at which to generate the treasure. Should be 1 <= level")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(Treasure),
            Description = "The OK response containing the generated treasure")]
        public async Task<HttpResponseData> RunV2(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "v2/{treasureType}/level/{level:int}/generate")] HttpRequestData req,
            string treasureType, int level)
        {
            _logger.LogInformation("C# HTTP trigger function (GenerateRandomTreasureFunction.RunV2) processed a request.");

            return await Run(req, treasureType, level);
        }

        private async Task<Treasure> GetTreasureAsync(TreasureTypes treasureType, int level)
        {
            if (treasureType == TreasureTypes.Treasure)
                return await _treasureGenerator.GenerateAtLevelAsync(level);

            var treasure = new Treasure();

            switch (treasureType)
            {
                case TreasureTypes.Coin: treasure.Coin = _coinGenerator.GenerateAtLevel(level); break;
                case TreasureTypes.Goods: treasure.Goods = await _goodsGenerator.GenerateAtLevelAsync(level); break;
                case TreasureTypes.Items: treasure.Items = await _itemsGenerator.GenerateRandomAtLevelAsync(level); break;
            }

            return treasure;
        }
    }
}
