using DnDGen.Api.TreasureGen.Dependencies;
using DnDGen.Api.TreasureGen.Swagger;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Abstractions;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace DnDGen.Api.TreasureGen
{
    public static class Startup
    {
        public static IHost GetHost()
        {
            var host = new HostBuilder()
                .ConfigureFunctionsWorkerDefaults()
                .ConfigureServices(ConfigureServices)
                .Build();

            return host;
        }

        public static void ConfigureServices(IServiceCollection services)
        {
            services.ConfigureDndgenServices();
            services.AddSingleton<IDependencyFactory, NinjectDependencyFactory>();
            services.AddSingleton<IDocumentFilter, ItemV1OneOfDocumentFilter>();
            services.AddSingleton<IDocumentFilter, ItemV2OneOfDocumentFilter>();
        }
    }
}
