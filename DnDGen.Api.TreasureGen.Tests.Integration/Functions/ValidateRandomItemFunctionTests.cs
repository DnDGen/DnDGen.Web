using DnDGen.Api.TreasureGen.Functions;
using DnDGen.Api.TreasureGen.Models;
using DnDGen.Api.TreasureGen.Tests.Integration.Helpers;
using DnDGen.TreasureGen.Items;
using DnDGen.TreasureGen.Items.Magical;
using DnDGen.TreasureGen.Items.Mundane;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Collections;
using System.Web;

namespace DnDGen.Api.TreasureGen.Tests.Integration.Functions
{
    public class ValidateRandomItemFunctionTests : IntegrationTests
    {
        private ValidateRandomItemFunction function;
        private ILogger logger;

        [SetUp]
        public void Setup()
        {
            function = new ValidateRandomItemFunction();

            var loggerFactory = new LoggerFactory();
            logger = loggerFactory.CreateLogger("Integration Test");
        }

        [TestCaseSource(nameof(RandomItemGenerationData))]
        public async Task ValidateRandomItem_ReturnsValidity(string itemType, string power, bool valid)
        {
            var request = RequestHelper.BuildRequest();
            var response = await function.Run(request, itemType, power, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.EqualTo(valid));
        }

        public static IEnumerable RandomItemGenerationData
        {
            get
            {
                yield return new TestCaseData("Building", PowerConstants.Mundane, false);
                yield return new TestCaseData("Building", PowerConstants.Minor, false);
                yield return new TestCaseData("Building", PowerConstants.Medium, false);
                yield return new TestCaseData("Building", PowerConstants.Major, false);

                yield return new TestCaseData(ItemTypeConstants.AlchemicalItem, "Omnipotent", false);
                yield return new TestCaseData(ItemTypeConstants.AlchemicalItem, PowerConstants.Mundane, false);
                yield return new TestCaseData(ItemTypeConstants.AlchemicalItem, PowerConstants.Minor, false);
                yield return new TestCaseData(ItemTypeConstants.AlchemicalItem, PowerConstants.Medium, false);
                yield return new TestCaseData(ItemTypeConstants.AlchemicalItem, PowerConstants.Major, false);

                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), "Omnipotent", false);
                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Mundane, true);
                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Minor, false);
                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Medium, false);
                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Major, false);

                yield return new TestCaseData(((int)ItemTypes.AlchemicalItem).ToString(), "Omnipotent", false);
                yield return new TestCaseData(((int)ItemTypes.AlchemicalItem).ToString(), PowerConstants.Mundane, true);
                yield return new TestCaseData(((int)ItemTypes.AlchemicalItem).ToString(), PowerConstants.Minor, false);
                yield return new TestCaseData(((int)ItemTypes.AlchemicalItem).ToString(), PowerConstants.Medium, false);
                yield return new TestCaseData(((int)ItemTypes.AlchemicalItem).ToString(), PowerConstants.Major, false);

                yield return new TestCaseData(ItemTypes.Armor.ToString(), "Omnipotent", false);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Mundane, true);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Minor, true);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, true);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Major, true);

                yield return new TestCaseData(((int)ItemTypes.Armor).ToString(), "Omnipotent", false);
                yield return new TestCaseData(((int)ItemTypes.Armor).ToString(), PowerConstants.Mundane, true);
                yield return new TestCaseData(((int)ItemTypes.Armor).ToString(), PowerConstants.Minor, true);
                yield return new TestCaseData(((int)ItemTypes.Armor).ToString(), PowerConstants.Medium, true);
                yield return new TestCaseData(((int)ItemTypes.Armor).ToString(), PowerConstants.Major, true);

                yield return new TestCaseData(ItemTypes.Potion.ToString(), "Omnipotent", false);
                yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Mundane, false);
                yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Minor, true);
                yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium, true);
                yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Major, true);

                yield return new TestCaseData(((int)ItemTypes.Potion).ToString(), "Omnipotent", false);
                yield return new TestCaseData(((int)ItemTypes.Potion).ToString(), PowerConstants.Mundane, false);
                yield return new TestCaseData(((int)ItemTypes.Potion).ToString(), PowerConstants.Minor, true);
                yield return new TestCaseData(((int)ItemTypes.Potion).ToString(), PowerConstants.Medium, true);
                yield return new TestCaseData(((int)ItemTypes.Potion).ToString(), PowerConstants.Major, true);

                yield return new TestCaseData(ItemTypes.Ring.ToString(), "Omnipotent", false);
                yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Mundane, false);
                yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Minor, true);
                yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Medium, true);
                yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Major, true);

                yield return new TestCaseData(((int)ItemTypes.Ring).ToString(), "Omnipotent", false);
                yield return new TestCaseData(((int)ItemTypes.Ring).ToString(), PowerConstants.Mundane, false);
                yield return new TestCaseData(((int)ItemTypes.Ring).ToString(), PowerConstants.Minor, true);
                yield return new TestCaseData(((int)ItemTypes.Ring).ToString(), PowerConstants.Medium, true);
                yield return new TestCaseData(((int)ItemTypes.Ring).ToString(), PowerConstants.Major, true);

                yield return new TestCaseData(ItemTypes.Rod.ToString(), "Omnipotent", false);
                yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Mundane, false);
                yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Minor, false);
                yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Medium, true);
                yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Major, true);

                yield return new TestCaseData(((int)ItemTypes.Rod).ToString(), "Omnipotent", false);
                yield return new TestCaseData(((int)ItemTypes.Rod).ToString(), PowerConstants.Mundane, false);
                yield return new TestCaseData(((int)ItemTypes.Rod).ToString(), PowerConstants.Minor, false);
                yield return new TestCaseData(((int)ItemTypes.Rod).ToString(), PowerConstants.Medium, true);
                yield return new TestCaseData(((int)ItemTypes.Rod).ToString(), PowerConstants.Major, true);

                yield return new TestCaseData(ItemTypes.Scroll.ToString(), "Omnipotent", false);
                yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Mundane, false);
                yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Minor, true);
                yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Medium, true);
                yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Major, true);

                yield return new TestCaseData(((int)ItemTypes.Scroll).ToString(), "Omnipotent", false);
                yield return new TestCaseData(((int)ItemTypes.Scroll).ToString(), PowerConstants.Mundane, false);
                yield return new TestCaseData(((int)ItemTypes.Scroll).ToString(), PowerConstants.Minor, true);
                yield return new TestCaseData(((int)ItemTypes.Scroll).ToString(), PowerConstants.Medium, true);
                yield return new TestCaseData(((int)ItemTypes.Scroll).ToString(), PowerConstants.Major, true);

                yield return new TestCaseData(ItemTypes.Staff.ToString(), "Omnipotent", false);
                yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Mundane, false);
                yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Minor, false);
                yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Medium, true);
                yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Major, true);

                yield return new TestCaseData(((int)ItemTypes.Staff).ToString(), "Omnipotent", false);
                yield return new TestCaseData(((int)ItemTypes.Staff).ToString(), PowerConstants.Mundane, false);
                yield return new TestCaseData(((int)ItemTypes.Staff).ToString(), PowerConstants.Minor, false);
                yield return new TestCaseData(((int)ItemTypes.Staff).ToString(), PowerConstants.Medium, true);
                yield return new TestCaseData(((int)ItemTypes.Staff).ToString(), PowerConstants.Major, true);

                yield return new TestCaseData(ItemTypes.Tool.ToString(), "Omnipotent", false);
                yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Mundane, true);
                yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Minor, false);
                yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Medium, false);
                yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Major, false);

                yield return new TestCaseData(((int)ItemTypes.Tool).ToString(), "Omnipotent", false);
                yield return new TestCaseData(((int)ItemTypes.Tool).ToString(), PowerConstants.Mundane, true);
                yield return new TestCaseData(((int)ItemTypes.Tool).ToString(), PowerConstants.Minor, false);
                yield return new TestCaseData(((int)ItemTypes.Tool).ToString(), PowerConstants.Medium, false);
                yield return new TestCaseData(((int)ItemTypes.Tool).ToString(), PowerConstants.Major, false);

                yield return new TestCaseData(ItemTypes.Wand.ToString(), "Omnipotent", false);
                yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Mundane, false);
                yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Minor, true);
                yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Medium, true);
                yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Major, true);

                yield return new TestCaseData(((int)ItemTypes.Wand).ToString(), "Omnipotent", false);
                yield return new TestCaseData(((int)ItemTypes.Wand).ToString(), PowerConstants.Mundane, false);
                yield return new TestCaseData(((int)ItemTypes.Wand).ToString(), PowerConstants.Minor, true);
                yield return new TestCaseData(((int)ItemTypes.Wand).ToString(), PowerConstants.Medium, true);
                yield return new TestCaseData(((int)ItemTypes.Wand).ToString(), PowerConstants.Major, true);

                yield return new TestCaseData(ItemTypes.Weapon.ToString(), "Omnipotent", false);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Mundane, true);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Minor, true);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, true);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Major, true);

                yield return new TestCaseData(((int)ItemTypes.Weapon).ToString(), "Omnipotent", false);
                yield return new TestCaseData(((int)ItemTypes.Weapon).ToString(), PowerConstants.Mundane, true);
                yield return new TestCaseData(((int)ItemTypes.Weapon).ToString(), PowerConstants.Minor, true);
                yield return new TestCaseData(((int)ItemTypes.Weapon).ToString(), PowerConstants.Medium, true);
                yield return new TestCaseData(((int)ItemTypes.Weapon).ToString(), PowerConstants.Major, true);

                yield return new TestCaseData(ItemTypeConstants.WondrousItem, "Omnipotent", false);
                yield return new TestCaseData(ItemTypeConstants.WondrousItem, PowerConstants.Mundane, false);
                yield return new TestCaseData(ItemTypeConstants.WondrousItem, PowerConstants.Minor, false);
                yield return new TestCaseData(ItemTypeConstants.WondrousItem, PowerConstants.Medium, false);
                yield return new TestCaseData(ItemTypeConstants.WondrousItem, PowerConstants.Major, false);

                yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), "Omnipotent", false);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Mundane, false);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Minor, true);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Medium, true);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Major, true);

                yield return new TestCaseData(((int)ItemTypes.WondrousItem).ToString(), "Omnipotent", false);
                yield return new TestCaseData(((int)ItemTypes.WondrousItem).ToString(), PowerConstants.Mundane, false);
                yield return new TestCaseData(((int)ItemTypes.WondrousItem).ToString(), PowerConstants.Minor, true);
                yield return new TestCaseData(((int)ItemTypes.WondrousItem).ToString(), PowerConstants.Medium, true);
                yield return new TestCaseData(((int)ItemTypes.WondrousItem).ToString(), PowerConstants.Major, true);
            }
        }

        [TestCaseSource(nameof(ItemGenerationData))]
        public async Task ValidateItem_ReturnsValidity(string itemTypeInput, string power, string name, bool valid)
        {
            var request = RequestHelper.BuildRequest($"?name={HttpUtility.UrlEncode(name)}");
            var response = await function.Run(request, itemTypeInput, power, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.EqualTo(valid));
        }

        public static IEnumerable ItemGenerationData
        {
            get
            {
                yield return new TestCaseData("Wrong Item Type", PowerConstants.Mundane, AlchemicalItemConstants.Acid, false);
                yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Mundane, AlchemicalItemConstants.Acid, false);
                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), "Wrong Power", AlchemicalItemConstants.Acid, false);
                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Medium, AlchemicalItemConstants.Acid, false);
                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Mundane, "Wrong Item", false);
                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Mundane, ToolConstants.ArtisansTools_Masterwork, false);
                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Mundane, AlchemicalItemConstants.Acid, true);

                yield return new TestCaseData("Wrong Item Type", PowerConstants.Medium, ArmorConstants.AbsorbingShield, false);
                yield return new TestCaseData("Wrong Item Type", PowerConstants.Medium, ArmorConstants.BandedMail, false);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, ArmorConstants.AbsorbingShield, false);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, ArmorConstants.BandedMail, false);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), "Wrong Power", ArmorConstants.AbsorbingShield, false);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), "Wrong Power", ArmorConstants.BandedMail, false);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Mundane, ArmorConstants.AbsorbingShield, false);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Mundane, ArmorConstants.BandedMail, true);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, "Wrong Item", false);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, "Wrong Item", false);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, WeaponConstants.Arrow, false);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, WeaponConstants.AssassinsDagger, false);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, ArmorConstants.AbsorbingShield, true);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, ArmorConstants.BandedMail, true);

                yield return new TestCaseData("Wrong Item Type", PowerConstants.Medium, PotionConstants.Aid, false);
                yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Medium, PotionConstants.Aid, false);
                yield return new TestCaseData(ItemTypes.Potion.ToString(), "Wrong Power", PotionConstants.Aid, false);
                yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Mundane, PotionConstants.Aid, false);
                yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium, "Wrong Item", false);
                yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium, RingConstants.AcidResistance_Greater, false);
                yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium, PotionConstants.Aid, true);

                yield return new TestCaseData("Wrong Item Type", PowerConstants.Medium, RingConstants.AcidResistance_Greater, false);
                yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium, RingConstants.AcidResistance_Greater, false);
                yield return new TestCaseData(ItemTypes.Ring.ToString(), "Wrong Power", RingConstants.AcidResistance_Greater, false);
                yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Mundane, RingConstants.AcidResistance_Greater, false);
                yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Medium, "Wrong Item", false);
                yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Medium, PotionConstants.Aid, false);
                yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Medium, RingConstants.AcidResistance_Greater, true);

                yield return new TestCaseData("Wrong Item Type", PowerConstants.Medium, RodConstants.Absorption, false);
                yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Medium, RodConstants.Absorption, false);
                yield return new TestCaseData(ItemTypes.Rod.ToString(), "Wrong Power", RodConstants.Absorption, false);
                yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Mundane, RodConstants.Absorption, false);
                yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Medium, "Wrong Item", false);
                yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Medium, StaffConstants.Abjuration, false);
                yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Medium, RodConstants.Absorption, true);

                yield return new TestCaseData("Wrong Item Type", PowerConstants.Medium, "My Scroll", false);
                yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Medium, "My Scroll", true);
                yield return new TestCaseData(ItemTypes.Scroll.ToString(), "Wrong Power", "My Scroll", false);
                yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Mundane, "My Scroll", false);
                yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Medium, "Wrong Item", true);
                yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Medium, "My Wand", true);
                yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Medium, "My Scroll", true);

                yield return new TestCaseData("Wrong Item Type", PowerConstants.Medium, StaffConstants.Abjuration, false);
                yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Medium, StaffConstants.Abjuration, false);
                yield return new TestCaseData(ItemTypes.Staff.ToString(), "Wrong Power", StaffConstants.Abjuration, false);
                yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Mundane, StaffConstants.Abjuration, false);
                yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Medium, "Wrong Item", false);
                yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Medium, RodConstants.Absorption, false);
                yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Medium, StaffConstants.Abjuration, true);

                yield return new TestCaseData("Wrong Item Type", PowerConstants.Mundane, ToolConstants.ArtisansTools_Masterwork, false);
                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Mundane, ToolConstants.ArtisansTools_Masterwork, false);
                yield return new TestCaseData(ItemTypes.Tool.ToString(), "Wrong Power", ToolConstants.ArtisansTools_Masterwork, false);
                yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Medium, ToolConstants.ArtisansTools_Masterwork, false);
                yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Mundane, "Wrong Item", false);
                yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Mundane, AlchemicalItemConstants.Acid, false);
                yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Mundane, ToolConstants.ArtisansTools_Masterwork, true);

                yield return new TestCaseData("Wrong Item Type", PowerConstants.Medium, "My Wand", false);
                yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Medium, "My Wand", true);
                yield return new TestCaseData(ItemTypes.Wand.ToString(), "Wrong Power", "My Wand", false);
                yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Mundane, "My Wand", false);
                yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Medium, "Wrong Item", true);
                yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Medium, "My Scroll", true);
                yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Medium, "My Wand", true);

                yield return new TestCaseData("Wrong Item Type", PowerConstants.Medium, WeaponConstants.AssassinsDagger, false);
                yield return new TestCaseData("Wrong Item Type", PowerConstants.Medium, WeaponConstants.Arrow, false);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, WeaponConstants.AssassinsDagger, false);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, WeaponConstants.Arrow, false);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), "Wrong Power", WeaponConstants.AssassinsDagger, false);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), "Wrong Power", WeaponConstants.Arrow, false);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Mundane, WeaponConstants.AssassinsDagger, false);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Mundane, WeaponConstants.Arrow, true);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, "Wrong Item", false);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, "Wrong Item", false);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, ArmorConstants.BandedMail, false);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, ArmorConstants.AbsorbingShield, false);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, WeaponConstants.AssassinsDagger, true);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, WeaponConstants.Arrow, true);

                yield return new TestCaseData("Wrong Item Type", PowerConstants.Medium, WondrousItemConstants.AmuletOfHealth, false);
                yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium, WondrousItemConstants.AmuletOfHealth, false);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), "Wrong Power", WondrousItemConstants.AmuletOfHealth, false);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Mundane, WondrousItemConstants.AmuletOfHealth, false);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Medium, "Wrong Item", false);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Medium, PotionConstants.Aid, false);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Medium, WondrousItemConstants.AmuletOfHealth, true);
            }
        }
    }
}