using DNDGenSite.Controllers;
using Ninject.Modules;

namespace DNDGenSite.App_Start
{
    public class WebModule : NinjectModule
    {
        public override void Load()
        {
            Bind<DiceController>().ToSelf();
        }
    }
}