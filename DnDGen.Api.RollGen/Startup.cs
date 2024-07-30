using DnDGen.Api.RollGen.Dependencies;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace DnDGen.Api.RollGen
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
        }
    }
}
