using DnDGen.Api.TreasureGen.Dependencies;
using Microsoft.Extensions.DependencyInjection;

namespace DnDGen.Api.TreasureGen.Tests.Integration
{
    [TestFixture]
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Structure",
    "NUnit1032:An IDisposable field/property should be Disposed in a TearDown method",
    Justification = "The serviceProvider is not actually disposable")]
    public abstract class IntegrationTests
    {
        private IDependencyFactory dependencyFactory;
        private IServiceProvider serviceProvider;
        private IServiceCollection services;

        [OneTimeSetUp]
        public void IntegrationSetup()
        {
            dependencyFactory = new NinjectDependencyFactory();

            services = new ServiceCollection();
            Startup.ConfigureServices(services);

            serviceProvider = services.BuildServiceProvider();
        }

        protected T GetDependency<T>()
        {
            return dependencyFactory.Get<T>();
        }

        protected T GetService<T>()
        {
            return serviceProvider.GetService<T>();
        }
    }
}