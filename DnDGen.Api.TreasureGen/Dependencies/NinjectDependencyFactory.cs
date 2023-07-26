using DnDGen.TreasureGen.IoC;
using Ninject;

namespace DnDGen.Api.TreasureGen.Dependencies
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
            var treasureGenLoader = new TreasureGenModuleLoader();
            treasureGenLoader.LoadModules(kernel);
        }

        public T Get<T>()
        {
            return kernel.Get<T>();
        }
    }
}
