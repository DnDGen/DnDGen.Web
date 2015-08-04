using DNDGenSite.App_Start.Factories;
using DNDGenSite.Controllers.Treasures;
using DNDGenSite.Repositories;
using Ninject;
using Ninject.Modules;
using Octokit;
using TreasureGen.Common.Items;
using TreasureGen.Generators.Items.Magical;
using TreasureGen.Generators.Items.Mundane;

namespace DNDGenSite.App_Start
{
    public class WebModule : NinjectModule
    {
        public override void Load()
        {
            Bind<ArmorController>().ToMethod(c => new ArmorController(c.Kernel.Get<IMagicalItemGenerator>(ItemTypeConstants.Armor),
                c.Kernel.Get<IMundaneItemGenerator>(ItemTypeConstants.Armor)));
            Bind<PotionController>().ToMethod(c => new PotionController(c.Kernel.Get<IMagicalItemGenerator>(ItemTypeConstants.Potion)));
            Bind<RingController>().ToMethod(c => new RingController(c.Kernel.Get<IMagicalItemGenerator>(ItemTypeConstants.Ring)));
            Bind<RodController>().ToMethod(c => new RodController(c.Kernel.Get<IMagicalItemGenerator>(ItemTypeConstants.Rod)));
            Bind<ScrollController>().ToMethod(c => new ScrollController(c.Kernel.Get<IMagicalItemGenerator>(ItemTypeConstants.Scroll)));
            Bind<StaffController>().ToMethod(c => new StaffController(c.Kernel.Get<IMagicalItemGenerator>(ItemTypeConstants.Staff)));
            Bind<ToolController>().ToMethod(c => new ToolController(c.Kernel.Get<IMundaneItemGenerator>(ItemTypeConstants.Tool)));
            Bind<AlchemicalItemController>().ToMethod(c => new AlchemicalItemController(c.Kernel.Get<IMundaneItemGenerator>(ItemTypeConstants.AlchemicalItem)));
            Bind<WandController>().ToMethod(c => new WandController(c.Kernel.Get<IMagicalItemGenerator>(ItemTypeConstants.Wand)));
            Bind<WeaponController>().ToMethod(c => new WeaponController(c.Kernel.Get<IMagicalItemGenerator>(ItemTypeConstants.Weapon),
                c.Kernel.Get<IMundaneItemGenerator>(ItemTypeConstants.Weapon)));
            Bind<WondrousItemController>().ToMethod(c => new WondrousItemController(c.Kernel.Get<IMagicalItemGenerator>(ItemTypeConstants.WondrousItem)));
            Bind<IGitHubClient>().ToMethod(c => GitHubClientFactory.Create());
            Bind<ErrorRepository>().To<GitHubErrorRepository>();
        }
    }
}