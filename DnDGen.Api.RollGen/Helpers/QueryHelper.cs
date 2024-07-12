using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;

namespace DnDGen.Api.RollGen.Helpers
{
    public static class QueryHelper
    {
        public static bool CheckParameters(HttpRequestData request, ILogger logger, params string[] parameters)
        {
            foreach (var parameter in parameters)
            {
                var value = request.Query[parameter];
                if (string.IsNullOrEmpty(value))
                {
                    logger.LogError($"Query parameter '{parameter}' is missing");
                    return false;
                }
            }

            return true;
        }
    }
}
