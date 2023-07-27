﻿using Microsoft.AspNetCore.Http;

namespace DnDGen.Api.TreasureGen.Tests.Integration.Helpers
{
    public static class RequestHelper
    {
        public static HttpRequest BuildRequest(string queryString)
        {
            var httpContext = new DefaultHttpContext();
            httpContext.Request.Method = "GET";
            httpContext.Request.Scheme = "http";
            httpContext.Request.Host = new HostString("localhost");
            httpContext.Request.QueryString = new QueryString(queryString);

            return httpContext.Request;
        }
    }
}