using Microsoft.AspNetCore.Http;

namespace DnDGen.Api.CharacterGen.Tests.Unit.Helpers
{
    public static class RequestHelper
    {
        public static HttpRequest BuildRequest(string queryString = null)
        {
            var httpContext = new DefaultHttpContext();
            httpContext.Request.Method = "GET";
            httpContext.Request.Scheme = "http";
            httpContext.Request.Host = new HostString("localhost");

            if (queryString != null)
                httpContext.Request.QueryString = new QueryString(queryString);

            return httpContext.Request;
        }
    }
}
