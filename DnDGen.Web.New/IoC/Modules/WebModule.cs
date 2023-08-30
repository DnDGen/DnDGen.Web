using DnDGen.Web.New.Repositories;
using Ninject.Modules;

namespace DnDGen.Web.New.IoC.Modules
{
    public class WebModule : NinjectModule
    {
        public override void Load()
        {
            Bind<IRandomizerRepository>().To<RandomizerRepository>();
        }
    }
}