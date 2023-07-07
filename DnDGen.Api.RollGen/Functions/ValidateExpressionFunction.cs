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
    public class ValidateExpressionFunction
    {
        private readonly Dice dice;

        public ValidateExpressionFunction(IDependencyFactory dependencyFactory)
        {
            dice = dependencyFactory.Get<Dice>();
        }

        [FunctionName("ValidateExpressionFunction")]
        public Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "rollgen/v1/expression/validate")] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function (ValidateExpressionFunction.Run) processed a request.");

            var validParameters = QueryHelper.CheckParameters(req, log, "expression");
            if (!validParameters)
            {
                IActionResult badResult = new BadRequestResult();
                return Task.FromResult(badResult);
            }

            var expression = req.Query["expression"];

            var valid = dice.Roll(expression).IsValid();
            IActionResult result = new OkObjectResult(valid);

            log.LogInformation($"Validated {expression} = {valid}");

            return Task.FromResult(result);
        }
    }
}
