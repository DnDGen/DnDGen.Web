using DnDGen.Api.CharacterGen.Dependencies;
using Microsoft.Extensions.DependencyInjection;

namespace DnDGen.Api.CharacterGen.Tests.Integration
{
    [TestFixture]
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