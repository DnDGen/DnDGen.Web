using DnDGen.DungeonGen.IoC;
using Ninject;

namespace DnDGen.Api.DungeonGen.Dependencies
{
    public class NinjectDependencyFactory : IDependencyFactory
    {
        private readonly IKernel kernel;

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
            var dungeonGenLoader = new DungeonGenModuleLoader();
            dungeonGenLoader.LoadModules(kernel);
        }

        public T Get<T>()
        {
            return kernel.Get<T>();
        }
    }
}
