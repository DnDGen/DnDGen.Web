using CharacterGen.Bootstrap;
using DNDGenSite.App_Start;
using EncounterGen.Bootstrap;
using Ninject;
using NUnit.Framework;
using RollGen.Bootstrap;
using TreasureGen.Bootstrap;

namespace DNDGenSite.Tests.Integration
{
    [TestFixture]
    public abstract class IntegrationTests
    {
        private readonly IKernel kernel;

        protected IntegrationTests()
        {
            kernel = new StandardKernel();

            var rollGenModuleLoader = new RollGenModuleLoader();
            rollGenModuleLoader.LoadModules(kernel);

            var treasureGenModuleLoader = new TreasureGenModuleLoader();
            treasureGenModuleLoader.LoadModules(kernel);

            var characterGenLoader = new CharacterGenModuleLoader();
            characterGenLoader.LoadModules(kernel);

            var encounterGenLoader = new EncounterGenModuleLoader();
            encounterGenLoader.LoadModules(kernel);

            kernel.Load<WebModule>();
        }

        [SetUp]
        public void IntegrationTestsSetup()
        {
            kernel.Inject(this);
        }

        protected T GetNewInstanceOf<T>()
        {
            return kernel.Get<T>();
        }

        protected T GetNewInstanceOf<T>(string name)
        {
            return kernel.Get<T>(name);
        }
    }
}