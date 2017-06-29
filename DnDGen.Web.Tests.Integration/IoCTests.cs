using Ninject;
using NUnit.Framework;
using System.Diagnostics;

namespace DnDGen.Web.Tests.Integration
{
    [TestFixture]
    public abstract class IoCTests : IntegrationTests
    {
        [Inject]
        public Stopwatch Stopwatch { get; set; }

        private const int TimeLimitInMilliseconds = 200;

        [SetUp]
        public void IoCSetup()
        {
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
            Assert.That(Stopwatch.ElapsedMilliseconds, Is.AtMost(TimeLimitInMilliseconds));

            return instance;
        }
    }
}
