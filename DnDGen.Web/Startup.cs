﻿using DnDGen.Web.App_Start;
using System.Runtime.CompilerServices;

[assembly: InternalsVisibleTo("DnDGen.Web.Tests.Unit")]
[assembly: InternalsVisibleTo("DynamicProxyGenAssembly2")]
[assembly: InternalsVisibleTo("DnDGen.Web.Tests.Integration")]
namespace DnDGen.Web
{
    public class Startup
    {
        // This method gets called by the runtime. Use this method to add services to the container.
        public static void ConfigureServices(IServiceCollection services)
        {
            services.AddSingleton<IDependencyFactory, NinjectDependencyFactory>();

            services.AddControllersWithViews().AddNewtonsoftJson();
        }
    }
}