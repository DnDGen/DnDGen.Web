using DnDGen.CharacterGen.IoC;
using Ninject;

namespace DnDGen.Api.CharacterGen.Dependencies
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
            var characterGenLoader = new CharacterGenModuleLoader();
            characterGenLoader.LoadModules(kernel);
        }

        public T Get<T>()
        {
            return kernel.Get<T>();
        }
    }
}
