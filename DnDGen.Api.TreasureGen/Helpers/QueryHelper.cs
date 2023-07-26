using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace DnDGen.Api.TreasureGen.Helpers
{
    public static class QueryHelper
    {
        public static bool CheckParameters(HttpRequest request, ILogger logger, params string[] parameters)
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
