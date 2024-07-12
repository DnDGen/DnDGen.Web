using DnDGen.Api.RollGen.Dependencies;
using Microsoft.Extensions.DependencyInjection;

namespace DnDGen.Api.RollGen.Tests.Integration
{
    [TestFixture]
    public abstract class IntegrationTests
    {
        private IDependencyFactory dependencyFactory;
        protected IServiceProvider serviceProvider;

        [OneTimeSetUp]
        public void IntegrationSetup()
        {
            dependencyFactory = new NinjectDependencyFactory();

            var host = Startup.GetHost();
            serviceProvider = host.Services;
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