[assembly: WebActivatorEx.PreApplicationStartMethod(typeof(DNDGenSite.App_Start.NinjectWebCommon), "Start")]
[assembly: WebActivatorEx.ApplicationShutdownMethodAttribute(typeof(DNDGenSite.App_Start.NinjectWebCommon), "Stop")]

namespace DNDGenSite.App_Start
{
    using System;
    using System.Web;
    using D20Dice.Bootstrap;
    using DNDGenSite.Controllers;
    using EquipmentGen.Bootstrap;
    using Microsoft.Web.Infrastructure.DynamicModuleHelper;
    using Ninject;
    using Ninject.Web.Common;

    public static class NinjectWebCommon
    {
        private static readonly Bootstrapper bootstrapper = new Bootstrapper();

        public static void Start()
        {
            DynamicModuleUtility.RegisterModule(typeof(OnePerRequestHttpModule));
            DynamicModuleUtility.RegisterModule(typeof(NinjectHttpModule));
            bootstrapper.Initialize(CreateKernel);
        }

        public static void Stop()
        {
            bootstrapper.ShutDown();
        }

        private static IKernel CreateKernel()
        {
            var kernel = new StandardKernel();
            try
            {
                kernel.Bind<Func<IKernel>>().ToMethod(ctx => () => new Bootstrapper().Kernel);
                kernel.Bind<IHttpModule>().To<HttpApplicationInitializationHttpModule>();

                RegisterServices(kernel);
                BindControllers(kernel);
                return kernel;
            }
            catch
            {
                kernel.Dispose();
                throw;
            }
        }

        private static void BindControllers(IKernel kernel)
        {
            kernel.Bind<DiceController>().ToSelf();
        }

        private static void RegisterServices(IKernel kernel)
        {
            var diceLoader = new D20DiceModuleLoader();
            diceLoader.LoadModules(kernel);

            var equipmentGenLoader = new EquipmentGenModuleLoader();
            equipmentGenLoader.LoadModules(kernel);
        }
    }
}