using DnDGen.RollGen.IoC;
using Ninject;

namespace DnDGen.Api.RollGen.Dependencies
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
            var rollGenLoader = new RollGenModuleLoader();
            rollGenLoader.LoadModules(kernel);
        }

        public T Get<T>()
        {
            return kernel.Get<T>();
        }
    }
}
