using System.Diagnostics;

namespace DnDGen.Api.RollGen.Tests.Integration
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

        protected T InjectDependencyAndAssertDuration<T>()
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
    }
}
