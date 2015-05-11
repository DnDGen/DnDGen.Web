using System;
using D20Dice.Bootstrap;
using DNDGenSite.App_Start;
using EquipmentGen.Bootstrap;
using Ninject;
using NUnit.Framework;

namespace DNDGenSite.Tests.Integration
{
    [TestFixture]
    public abstract class IntegrationTests
    {
        private IKernel kernel;

        public IntegrationTests()
        {
            kernel = new StandardKernel();

            var equipmentGenModuleLoader = new EquipmentGenModuleLoader();
            equipmentGenModuleLoader.LoadModules(kernel);

            var d20DiceModuleLoader = new D20DiceModuleLoader();
            d20DiceModuleLoader.LoadModules(kernel);

            kernel.Load<WebModule>();

            kernel.Inject(this);
        }

        //INFO: The commented-out code below is for troubleshooting issues with the bindings and injecting,
        //since the SetUp fail message just says that the setup failed, instead of showing the specific ninject issue
        //Also, the SetupFixture provided by NUnit fires after Ninject, so it can't help here

        //[SetUp]
        //public void IntegrationTestsSetup()
        //{
        //    kernel = new StandardKernel();

        //    var equipmentGenModuleLoader = new EquipmentGenModuleLoader();
        //    equipmentGenModuleLoader.LoadModules(kernel);

        //    var d20DiceModuleLoader = new D20DiceModuleLoader();
        //    d20DiceModuleLoader.LoadModules(kernel);

        //    kernel.Inject(this);
        //}

        protected T GetNewInstanceOf<T>()
        {
            return kernel.Get<T>();
        }

        protected T GetNewInstanceOf<T>(String name)
        {
            return kernel.Get<T>(name);
        }
    }
}