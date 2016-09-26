using DnDGen.Web.App_Start.Factories;
using DnDGen.Web.Repositories;
using DnDGen.Web.Repositories.Domain;
using Ninject.Modules;
using Octokit;

namespace DnDGen.Web.App_Start
{
    public class WebModule : NinjectModule
    {
        public override void Load()
        {
            Bind<IGitHubClient>().ToMethod(c => GitHubClientFactory.Create());
            Bind<ErrorRepository>().To<GitHubErrorRepository>();
            Bind<RuntimeFactory>().ToMethod(c => new NinjectRuntimeFactory(c.Kernel));
            Bind<IRandomizerRepository>().To<RandomizerRepository>();
        }
    }
}