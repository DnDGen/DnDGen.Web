using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using NUnit.Framework;
using System;

namespace DnDGen.Web.Tests.Integration
{
    [TestFixture]
    public abstract class IntegrationTests
    {
        private IServiceProvider serviceProvider;
        private IServiceCollection services;

        [OneTimeSetUp]
        public void IntegrationSetup()
        {
            services = new ServiceCollection();
            services.AddControllersWithViews().AddNewtonsoftJson();

            serviceProvider = services.BuildServiceProvider();
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

        protected T GetController<T>()
            where T : Controller
        {
            var controller = serviceProvider.GetService<T>();
            if (controller == null)
            {
                AddController<T>();
                controller = serviceProvider.GetService<T>();
            }

            return controller;
        }
    }
}