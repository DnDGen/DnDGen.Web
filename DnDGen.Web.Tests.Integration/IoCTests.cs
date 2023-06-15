using Microsoft.AspNetCore.Mvc;
using NUnit.Framework;
using System;
using System.Diagnostics;

namespace DnDGen.Web.Tests.Integration
{
    [TestFixture]
    public abstract class IoCTests : IntegrationTests
    {
        protected Stopwatch Stopwatch;

        private TimeSpan TimeLimit;

        [SetUp]
        public void IoCSetup()
        {
            TimeLimit = new TimeSpan(TimeSpan.TicksPerSecond);
            Stopwatch = new Stopwatch();

            Stopwatch.Reset();
        }

        [TearDown]
        public void IoCTearDown()
        {
            Stopwatch.Stop();
        }

        protected T InjectAndAssertDuration<T>()
        {
            Stopwatch.Restart();

            var instance = GetDependency<T>();
            Assert.That(Stopwatch.Elapsed, Is.AtMost(TimeLimit));

            return instance;
        }

        protected T InjectServiceAndAssertDuration<T>()
        {
            Stopwatch.Restart();

            var instance = GetService<T>();
            Assert.That(Stopwatch.Elapsed, Is.AtMost(TimeLimit));

            return instance;
        }

        protected T InjectControllerAndAssertDuration<T>()
            where T : Controller
        {
            //INFO: Check if the controller is already bound. If not, add it.
            var controller = GetService<T>();
            if (controller == null)
            {
                AddController<T>();
            }

            Stopwatch.Restart();

            var instance = GetService<T>();
            Assert.That(Stopwatch.Elapsed, Is.AtMost(TimeLimit));

            return instance;
        }
    }
}
