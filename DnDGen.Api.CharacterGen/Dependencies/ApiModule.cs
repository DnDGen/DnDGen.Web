using DnDGen.Api.CharacterGen.Repositories;
using Ninject.Modules;

namespace DnDGen.Api.CharacterGen.Dependencies
{
    public class ApiModule : NinjectModule
    {
        public override void Load()
        {
            Bind<IRandomizerRepository>().To<RandomizerRepository>();
        }
    }
}