using DnDGen.Api.RollGen.Dependencies;
using DnDGen.Api.RollGen.Helpers;
using DnDGen.RollGen;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;

namespace DnDGen.Api.RollGen
{
    public class RollFunction
    {
        private readonly Dice dice;

        public RollFunction(IDependencyFactory dependencyFactory)
        {
            dice = dependencyFactory.Get<Dice>();
        }

        [FunctionName("RollFunction")]
        public Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", "/api/rollgen/v1/roll")] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function (RollFunction.Run) processed a request.");

            var valid = QueryHelper.CheckParameters(req, log, "quantity", "die");
            if (!valid)
            {
                IActionResult badResult = new BadRequestResult();
                return Task.FromResult(badResult);
            }

            var quantity = Convert.ToInt32(req.Query["quantity"]);
            var die = Convert.ToInt32(req.Query["die"]);

            var roll = dice.Roll(quantity).d(die).AsSum();
            IActionResult result = new OkObjectResult(roll);

            log.LogInformation($"Rolled {quantity}d{die} = {roll}");

            return Task.FromResult(result);
        }
    }
}
