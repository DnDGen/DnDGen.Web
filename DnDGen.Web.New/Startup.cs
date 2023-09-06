using DnDGen.Web.New.IoC;
using System.Runtime.CompilerServices;

[assembly: InternalsVisibleTo("DnDGen.Web.Tests.Unit")]
[assembly: InternalsVisibleTo("DynamicProxyGenAssembly2")]
[assembly: InternalsVisibleTo("DnDGen.Web.Tests.Integration")]
namespace DnDGen.Web.New
{
    public class Startup
    {
        public static void ConfigureServices(IServiceCollection services)
        {
            services.AddSingleton<IDependencyFactory, NinjectDependencyFactory>();

            services.AddControllers();
        }
    }
}