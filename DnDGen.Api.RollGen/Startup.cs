using DnDGen.Api.RollGen.Dependencies;
using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection;

[assembly: FunctionsStartup(typeof(DnDGen.Api.RollGen.Startup))]
namespace DnDGen.Api.RollGen
{
    public class Startup : FunctionsStartup
    {
        public override void Configure(IFunctionsHostBuilder builder)
        {
            ConfigureServices(builder.Services);
        }

        public static void ConfigureServices(IServiceCollection services)
        {
            services.AddSingleton<IDependencyFactory, NinjectDependencyFactory>();
        }
    }
}
