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

            var instance = GetNewInstanceOf<T>();
            Assert.That(Stopwatch.Elapsed, Is.AtMost(TimeLimit));

            return instance;
        }
    }
}
