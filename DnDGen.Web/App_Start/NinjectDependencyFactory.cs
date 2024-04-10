using CharacterGen.Domain.IoC;
using DnDGen.Core.IoC;
using DungeonGen.Domain.IoC;
using EncounterGen.Domain.IoC;
using EventGen.IoC;
using Ninject;
using RollGen.Domain.IoC;
using TreasureGen.Domain.IoC;

namespace DnDGen.Web.App_Start
{
    public class NinjectDependencyFactory : IDependencyFactory
    {
        private IKernel kernel;

        public NinjectDependencyFactory()
        {
            kernel = new StandardKernel();

            RegisterServices();
        }

        /// <summary>
        /// Load your modules or register your services here!
        /// </summary>
        /// <param name="kernel">The kernel.</param>
        private void RegisterServices()
        {
            //HACK: Even though we use the API for this now, we need to load it for higher dependencies such as DungeonGen
            //Once all packages use the API, we can remove this dependency
            var rollGenLoader = new RollGenModuleLoader();
            rollGenLoader.LoadModules(kernel);

            var eventGenLoader = new EventGenModuleLoader();
            eventGenLoader.LoadModules(kernel);

            var coreLoader = new CoreModuleLoader();
            coreLoader.LoadModules(kernel);

            var treasureGenLoader = new TreasureGenModuleLoader();
            treasureGenLoader.LoadModules(kernel);

            var characterGenLoader = new CharacterGenModuleLoader();
            characterGenLoader.LoadModules(kernel);

            var encounterGenLoader = new EncounterGenModuleLoader();
            encounterGenLoader.LoadModules(kernel);

            var dungeonGenLoader = new DungeonGenModuleLoader();
            dungeonGenLoader.LoadModules(kernel);
        }

        public T Get<T>()
        {
            return kernel.Get<T>();
        }
    }
}
