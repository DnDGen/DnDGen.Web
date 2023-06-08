using Ninject;
using NUnit.Framework;

namespace DnDGen.Web.Tests.Integration
{
    [TestFixture]
    public abstract class IntegrationTests
    {
        private readonly IKernel kernel;

        protected IntegrationTests()
        {
            kernel = new StandardKernel(new NinjectSettings() { InjectNonPublic = true });

            Startup.RegisterServices(kernel);
        }

        protected T GetNewInstanceOf<T>()
        {
            return kernel.Get<T>();
        }
    }
}