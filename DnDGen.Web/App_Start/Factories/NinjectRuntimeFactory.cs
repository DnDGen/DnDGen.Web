using Ninject;
using System;

namespace DnDGen.Web.App_Start.Factories
{
    public class NinjectRuntimeFactory : RuntimeFactory
    {
        private IKernel kernel;

        public NinjectRuntimeFactory(IKernel kernel)
        {
            this.kernel = kernel;
        }

        public T Create<T>()
        {
            return kernel.Get<T>();
        }

        public T Create<T>(String name)
        {
            return kernel.Get<T>(name);
        }
    }
}