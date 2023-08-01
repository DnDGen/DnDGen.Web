using DnDGen.Api.TreasureGen.Dependencies;
using DnDGen.Api.TreasureGen.Models;
using DnDGen.TreasureGen;
using DnDGen.TreasureGen.Coins;
using DnDGen.TreasureGen.Generators;
using DnDGen.TreasureGen.Goods;
using DnDGen.TreasureGen.Items;
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

namespace DnDGen.Api.TreasureGen.Functions
{
    public class GenerateRandomTreasureFunction
    {
        private readonly ITreasureGenerator treasureGenerator;
        private readonly ICoinGenerator coinGenerator;
        private readonly IGoodsGenerator goodsGenerator;
        private readonly IItemsGenerator itemsGenerator;

        public GenerateRandomTreasureFunction(IDependencyFactory dependencyFactory)
        {
            treasureGenerator = dependencyFactory.Get<ITreasureGenerator>();
            coinGenerator = dependencyFactory.Get<ICoinGenerator>();
            goodsGenerator = dependencyFactory.Get<IGoodsGenerator>();
            itemsGenerator = dependencyFactory.Get<IItemsGenerator>();
        }

        [FunctionName("GenerateRandomTreasureFunction")]
        [OpenApiOperation(operationId: "GenerateRandomTreasureFunctionRun", Summary = "Generate random treasure",
            Description = "Generate random treasure at the specified level. Can narrow the treasure to coin, goods, or items.")]
        [OpenApiParameter(name: "treasureType", In = ParameterLocation.Path, Required = true, Type = typeof(TreasureTypes),
            Description = "The type of treasure to generate. Valid values: Treasure, Coin, Goods, Items")]
        [OpenApiParameter(name: "level", In = ParameterLocation.Path, Required = true, Type = typeof(int),
            Description = "The level at which to generate the treasure. Should be 1 <= L <= 100")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(Treasure),
            Description = "The OK response containing the generated treasure")]
        public async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "v1/{treasureType}/level/{level:int}/generate")] HttpRequest req,
            string treasureType, int level, ILogger log)
        {
            log.LogInformation("C# HTTP trigger function (GenerateRandomTreasureFunction.Run) processed a request.");

            var validTreasureType = Enum.TryParse<TreasureTypes>(treasureType, out var validatedTreasureType);
            if (!validTreasureType)
            {
                log.LogError($"Parameter 'treasureType' of '{treasureType}' is not a valid Treasure Type. Should be one of: Treasure, Coin, Goods, Items");
                IActionResult badResult = new BadRequestResult();
                return badResult;
            }

            if (level < LevelLimits.Minimum || level > LevelLimits.Maximum)
            {
                log.LogError($"Parameter 'level' of '{level}' is not a valid level. Should be 1 <= L <= 100");
                IActionResult badResult = new BadRequestResult();
                return badResult;
            }

            var treasure = await GetTreasureAsync(validatedTreasureType, level);
            IActionResult result = new OkObjectResult(treasure);

            log.LogInformation($"Generated Treasure ({validatedTreasureType}) at level {level}");

            return result;
        }

        private async Task<Treasure> GetTreasureAsync(TreasureTypes treasureType, int level)
        {
            if (treasureType == TreasureTypes.Treasure)
                return await treasureGenerator.GenerateAtLevelAsync(level);

            var treasure = new Treasure();

            switch (treasureType)
            {
                case TreasureTypes.Coin: treasure.Coin = coinGenerator.GenerateAtLevel(level); break;
                case TreasureTypes.Goods: treasure.Goods = await goodsGenerator.GenerateAtLevelAsync(level); break;
                case TreasureTypes.Items: treasure.Items = await itemsGenerator.GenerateRandomAtLevelAsync(level); break;
            }

            return treasure;
        }
    }
}
