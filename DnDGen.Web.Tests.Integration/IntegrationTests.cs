using DnDGen.Web.App_Start;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using NUnit.Framework;
using System;

namespace DnDGen.Web.Tests.Integration
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

        protected void AddController<T>()
            where T : Controller
        {
            services.AddTransient<T>();
            serviceProvider = services.BuildServiceProvider();
        }
    }
}