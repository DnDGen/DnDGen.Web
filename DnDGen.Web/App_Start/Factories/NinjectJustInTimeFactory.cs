using Ninject;

namespace DnDGen.Web.App_Start.Factories
{
    public class NinjectJustInTimeFactory : JustInTimeFactory
    {
        private IKernel kernel;

        public NinjectJustInTimeFactory(IKernel kernel)
        {
            this.kernel = kernel;
        }

        public T Create<T>()
        {
            return kernel.Get<T>();
        }

        public T Create<T>(string name)
        {
            return kernel.Get<T>(name);
        }
    }
}