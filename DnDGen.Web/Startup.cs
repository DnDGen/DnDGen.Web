using CharacterGen.Domain.IoC;
using DnDGen.Core.IoC;
using DnDGen.Web.App_Start.Modules;
using DungeonGen.Domain.IoC;
using EncounterGen.Domain.IoC;
using EventGen.IoC;
using Microsoft.AspNetCore.Mvc.ViewFeatures.Buffers;
using MissingDIExtensions;
using Ninject;
using Ninject.Activation;
using Ninject.Infrastructure.Disposal;
using RollGen.Domain.IoC;
using System.Runtime.CompilerServices;
using TreasureGen.Domain.IoC;

[assembly: InternalsVisibleTo("DnDGen.Web.Tests.Unit")]
[assembly: InternalsVisibleTo("DynamicProxyGenAssembly2")]
[assembly: InternalsVisibleTo("DnDGen.Web.Tests.Integration")]
namespace DnDGen.Web
{
    public class Startup
    {
        private readonly AsyncLocal<Scope> scopeProvider = new AsyncLocal<Scope>();
        private IKernel kernel { get; set; }

        private object Resolve(Type type) => kernel.Get(type);
        private object RequestScope(IContext context) => scopeProvider.Value;

        public Startup(IWebHostEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();

            Configuration = builder.Build();
        }

        public IConfigurationRoot Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // Add framework services.
            services.AddMvc();

            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

            services.AddRequestScopingMiddleware(() => scopeProvider.Value = new Scope());
            services.AddCustomControllerActivation(Resolve);
            services.AddCustomViewComponentActivation(Resolve);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            kernel = RegisterApplicationComponents(app);

            app.UseExceptionHandler("/Error");
            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseRouting();

            //INFO: MVC Routes are configured in Program.cs
        }

        private IKernel RegisterApplicationComponents(IApplicationBuilder app)
        {
            kernel = new StandardKernel();

            // Register application services
            kernel.Bind(app.GetControllerTypes()).ToSelf().InScope(RequestScope);

            RegisterServices(kernel);

            // Cross-wire required framework services
            kernel.BindToMethod(app.GetRequestService<IViewBufferScope>);

            return kernel;
        }

        /// <summary>
        /// Load your modules or register your services here!
        /// </summary>
        /// <param name="kernel">The kernel.</param>
        public static void RegisterServices(IKernel kernel)
        {
            var rollGenLoader = new RollGenModuleLoader();
            rollGenLoader.LoadModules(kernel);

            var eventGenLoader = new EventGenModuleLoader();
            eventGenLoader.LoadModules(kernel);

            var coreLoader = new CoreModuleLoader();
            coreLoader.LoadModules(kernel);

            var treasureGenLoader = new TreasureGenModuleLoader();
            treasureGenLoader.LoadModules(kernel);

            var characterGenLoader = new CharacterGenModuleLoader();
            characterGenLoader.LoadModules(kernel);

            var encounterGenLoader = new EncounterGenModuleLoader();
            encounterGenLoader.LoadModules(kernel);

            var dungeonGenLoader = new DungeonGenModuleLoader();
            dungeonGenLoader.LoadModules(kernel);

            kernel.Load<WebModule>();
        }

        private sealed class Scope : DisposableObject { }
    }

    public static class BindingHelpers
    {
        public static void BindToMethod<T>(this IKernel config, Func<T> method) => config.Bind<T>().ToMethod(c => method());
    }

    public interface IUserService { }

    public class AspNetUserService : IUserService { }
}