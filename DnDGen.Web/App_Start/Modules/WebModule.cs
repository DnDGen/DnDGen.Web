using DnDGen.Web.App_Start.Providers;
using DnDGen.Web.Repositories;
using DnDGen.Web.Repositories.Domain;
using Ninject.Modules;
using Octokit;

namespace DnDGen.Web.App_Start.Modules
{
    public class WebModule : NinjectModule
    {
        public override void Load()
        {
            Bind<IGitHubClient>().ToProvider<GitHubClientProvider>();
            Bind<ErrorRepository>().To<GitHubErrorRepository>();
            Bind<IRandomizerRepository>().To<RandomizerRepository>();
        }
    }
}