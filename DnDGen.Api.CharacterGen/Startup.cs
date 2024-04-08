using DnDGen.Api.CharacterGen.Dependencies;
using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection;

[assembly: FunctionsStartup(typeof(DnDGen.Api.CharacterGen.Startup))]
namespace DnDGen.Api.CharacterGen
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
