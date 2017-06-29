using DnDGen.Web.App_Start.Factories;
using Ninject.Activation;

namespace DnDGen.Web.App_Start.Providers
{
    class JustInTimeFactoryProvider : Provider<JustInTimeFactory>
    {
        protected override JustInTimeFactory CreateInstance(IContext context)
        {
            return new NinjectJustInTimeFactory(context.Kernel);
        }
    }
}