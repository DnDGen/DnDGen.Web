using DnDGen.Web.Repositories;
using DnDGen.Web.Repositories.Domain;
using Ninject.Modules;

namespace DnDGen.Web.App_Start.Modules
{
    public class WebModule : NinjectModule
    {
        public override void Load()
        {
            Bind<IRandomizerRepository>().To<RandomizerRepository>();
        }
    }
}