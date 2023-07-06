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

namespace DnDGen.Api.RollGen.Functions
{
    public class ValidateRollFunction
    {
        private readonly Dice dice;

        public ValidateRollFunction(IDependencyFactory dependencyFactory)
        {
            dice = dependencyFactory.Get<Dice>();
        }

        [FunctionName("ValidateRollFunction")]
        public Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "rollgen/v1/roll/validate")] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function (ValidateRollFunction.Run) processed a request.");

            var validParameters = QueryHelper.CheckParameters(req, log, "quantity", "die");
            if (!validParameters)
            {
                IActionResult badResult = new BadRequestResult();
                return Task.FromResult(badResult);
            }

            var quantity = Convert.ToInt32(req.Query["quantity"]);
            var die = Convert.ToInt32(req.Query["die"]);

            var valid = dice.Roll(quantity).d(die).IsValid();
            IActionResult result = new OkObjectResult(valid);

            log.LogInformation($"Validated {quantity}d{die} = {valid}");

            return Task.FromResult(result);
        }
    }
}
