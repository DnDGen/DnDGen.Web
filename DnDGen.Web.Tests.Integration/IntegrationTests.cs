using DnDGen.Web.App_Start;
using Microsoft.Extensions.DependencyInjection;
using NUnit.Framework;
using System;

namespace DnDGen.Web.Tests.Integration
{
    [TestFixture]
    public abstract class IntegrationTests
    {
        private readonly IDependencyFactory dependencyFactory;
        private readonly IServiceProvider serviceProvider;

        protected IntegrationTests()
        {
            dependencyFactory = new NinjectDependencyFactory();

            var services = new ServiceCollection();
            Startup.ConfigureServices(services);

            serviceProvider = services.BuildServiceProvider();
        }

        protected T GetNewInstanceOf<T>()
        {
            return dependencyFactory.Get<T>();
        }

        protected T GetService<T>()
        {
            return serviceProvider.GetService<T>();
        }
    }
}