using DnDGen.Api.RollGen.Dependencies;
using DnDGen.Api.RollGen.Helpers;
using DnDGen.RollGen;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;

namespace DnDGen.Api.RollGen.Functions
{
    public class RollExpressionFunction
    {
        private readonly Dice dice;

        public RollExpressionFunction(IDependencyFactory dependencyFactory)
        {
            dice = dependencyFactory.Get<Dice>();
        }

        [FunctionName("RollExpressionFunction")]
        public Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "rollgen/v1/expression/roll")] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function (RollExpressionFunction.Run) processed a request.");

            var valid = QueryHelper.CheckParameters(req, log, "expression");
            if (!valid)
            {
                IActionResult badResult = new BadRequestResult();
                return Task.FromResult(badResult);
            }

            var expression = req.Query["expression"];

            var roll = dice.Roll(expression).AsSum();
            IActionResult result = new OkObjectResult(roll);

            log.LogInformation($"Rolled {expression} = {roll}");

            return Task.FromResult(result);
        }
    }
}
