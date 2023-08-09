using DnDGen.Api.TreasureGen.Validators;
using DnDGen.TreasureGen.Items;
using DnDGen.TreasureGen.Items.Magical;
using DnDGen.TreasureGen.Items.Mundane;
using System.Collections;

namespace DnDGen.Api.TreasureGen.Tests.Unit.Validators
{
    public class ItemValidatorTests
    {
        [TestCase("fake item type", "fake power", false)]
        [TestCase("fake item type", PowerConstants.Mundane, false)]
        [TestCase("fake item type", PowerConstants.Minor, false)]
        [TestCase("fake item type", PowerConstants.Medium, false)]
        [TestCase("fake item type", PowerConstants.Major, false)]
        [TestCase(ItemTypeConstants.AlchemicalItem, "fake power", false)]
        [TestCase(ItemTypeConstants.AlchemicalItem, PowerConstants.Mundane, true)]
        [TestCase(ItemTypeConstants.AlchemicalItem, PowerConstants.Minor, false)]
        [TestCase(ItemTypeConstants.AlchemicalItem, PowerConstants.Medium, false)]
        [TestCase(ItemTypeConstants.AlchemicalItem, PowerConstants.Major, false)]
        [TestCase(ItemTypeConstants.Armor, "fake power", false)]
        [TestCase(ItemTypeConstants.Armor, PowerConstants.Mundane, true)]
        [TestCase(ItemTypeConstants.Armor, PowerConstants.Minor, true)]
        [TestCase(ItemTypeConstants.Armor, PowerConstants.Medium, true)]
        [TestCase(ItemTypeConstants.Armor, PowerConstants.Major, true)]
        [TestCase(ItemTypeConstants.Potion, "fake power", false)]
        [TestCase(ItemTypeConstants.Potion, PowerConstants.Mundane, false)]
        [TestCase(ItemTypeConstants.Potion, PowerConstants.Minor, true)]
        [TestCase(ItemTypeConstants.Potion, PowerConstants.Medium, true)]
        [TestCase(ItemTypeConstants.Potion, PowerConstants.Major, true)]
        [TestCase(ItemTypeConstants.Ring, "fake power", false)]
        [TestCase(ItemTypeConstants.Ring, PowerConstants.Mundane, false)]
        [TestCase(ItemTypeConstants.Ring, PowerConstants.Minor, true)]
        [TestCase(ItemTypeConstants.Ring, PowerConstants.Medium, true)]
        [TestCase(ItemTypeConstants.Ring, PowerConstants.Major, true)]
        [TestCase(ItemTypeConstants.Rod, "fake power", false)]
        [TestCase(ItemTypeConstants.Rod, PowerConstants.Mundane, false)]
        [TestCase(ItemTypeConstants.Rod, PowerConstants.Minor, false)]
        [TestCase(ItemTypeConstants.Rod, PowerConstants.Medium, true)]
        [TestCase(ItemTypeConstants.Rod, PowerConstants.Major, true)]
        [TestCase(ItemTypeConstants.Scroll, "fake power", false)]
        [TestCase(ItemTypeConstants.Scroll, PowerConstants.Mundane, false)]
        [TestCase(ItemTypeConstants.Scroll, PowerConstants.Minor, true)]
        [TestCase(ItemTypeConstants.Scroll, PowerConstants.Medium, true)]
        [TestCase(ItemTypeConstants.Scroll, PowerConstants.Major, true)]
        [TestCase(ItemTypeConstants.Staff, "fake power", false)]
        [TestCase(ItemTypeConstants.Staff, PowerConstants.Mundane, false)]
        [TestCase(ItemTypeConstants.Staff, PowerConstants.Minor, false)]
        [TestCase(ItemTypeConstants.Staff, PowerConstants.Medium, true)]
        [TestCase(ItemTypeConstants.Staff, PowerConstants.Major, true)]
        [TestCase(ItemTypeConstants.Tool, "fake power", false)]
        [TestCase(ItemTypeConstants.Tool, PowerConstants.Mundane, true)]
        [TestCase(ItemTypeConstants.Tool, PowerConstants.Minor, false)]
        [TestCase(ItemTypeConstants.Tool, PowerConstants.Medium, false)]
        [TestCase(ItemTypeConstants.Tool, PowerConstants.Major, false)]
        [TestCase(ItemTypeConstants.Wand, "fake power", false)]
        [TestCase(ItemTypeConstants.Wand, PowerConstants.Mundane, false)]
        [TestCase(ItemTypeConstants.Wand, PowerConstants.Minor, true)]
        [TestCase(ItemTypeConstants.Wand, PowerConstants.Medium, true)]
        [TestCase(ItemTypeConstants.Wand, PowerConstants.Major, true)]
        [TestCase(ItemTypeConstants.Weapon, "fake power", false)]
        [TestCase(ItemTypeConstants.Weapon, PowerConstants.Mundane, true)]
        [TestCase(ItemTypeConstants.Weapon, PowerConstants.Minor, true)]
        [TestCase(ItemTypeConstants.Weapon, PowerConstants.Medium, true)]
        [TestCase(ItemTypeConstants.Weapon, PowerConstants.Major, true)]
        [TestCase(ItemTypeConstants.WondrousItem, "fake power", false)]
        [TestCase(ItemTypeConstants.WondrousItem, PowerConstants.Mundane, false)]
        [TestCase(ItemTypeConstants.WondrousItem, PowerConstants.Minor, true)]
        [TestCase(ItemTypeConstants.WondrousItem, PowerConstants.Medium, true)]
        [TestCase(ItemTypeConstants.WondrousItem, PowerConstants.Major, true)]
        public void GetValid_ReturnsValidity(string itemType, string power, bool valid)
        {
            var result = ItemValidator.GetValid(itemType, power);
            Assert.That(result.Valid, Is.EqualTo(valid));
        }

        [TestCaseSource(nameof(ItemGenerationData))]
        public void GetValid_ReturnsValidity_WithName(string itemType, string power, string name, bool valid)
        {
            var result = ItemValidator.GetValid(itemType, power, name);
            Assert.That(result.Valid, Is.EqualTo(valid));
        }

        public static IEnumerable ItemGenerationData
        {
            get
            {
                var alchemicalItems = AlchemicalItemConstants.GetAllAlchemicalItems();
                foreach (var alchemicalItem in alchemicalItems)
                {
                    yield return new TestCaseData(ItemTypeConstants.AlchemicalItem, PowerConstants.Mundane, alchemicalItem, true);

                    yield return new TestCaseData("Wrong Item Type", PowerConstants.Mundane, alchemicalItem, false);
                    //yield return new TestCaseData(ItemTypeConstants.AlchemicalItem, PowerConstants.Mundane, alchemicalItem, false);
                    yield return new TestCaseData(ItemTypeConstants.Armor, PowerConstants.Mundane, alchemicalItem, false);
                    yield return new TestCaseData(ItemTypeConstants.Potion, PowerConstants.Mundane, alchemicalItem, false);
                    yield return new TestCaseData(ItemTypeConstants.Ring, PowerConstants.Mundane, alchemicalItem, false);
                    yield return new TestCaseData(ItemTypeConstants.Rod, PowerConstants.Mundane, alchemicalItem, false);
                    //yield return new TestCaseData(ItemTypeConstants.Scroll, PowerConstants.Mundane, alchemicalItem, false);
                    yield return new TestCaseData(ItemTypeConstants.Staff, PowerConstants.Mundane, alchemicalItem, false);
                    yield return new TestCaseData(ItemTypeConstants.Tool, PowerConstants.Mundane, alchemicalItem, false);
                    //yield return new TestCaseData(ItemTypeConstants.Wand, PowerConstants.Mundane, alchemicalItem, false);
                    yield return new TestCaseData(ItemTypeConstants.Weapon, PowerConstants.Mundane, alchemicalItem, false);
                    yield return new TestCaseData(ItemTypeConstants.WondrousItem, PowerConstants.Mundane, alchemicalItem, false);

                    yield return new TestCaseData(ItemTypeConstants.AlchemicalItem, "Wrong Power", alchemicalItem, false);
                    //yield return new TestCaseData(ItemTypeConstants.AlchemicalItem, PowerConstants.Mundane, alchemicalItem, false);
                    yield return new TestCaseData(ItemTypeConstants.AlchemicalItem, PowerConstants.Minor, alchemicalItem, false);
                    yield return new TestCaseData(ItemTypeConstants.AlchemicalItem, PowerConstants.Medium, alchemicalItem, false);
                    yield return new TestCaseData(ItemTypeConstants.AlchemicalItem, PowerConstants.Major, alchemicalItem, false);
                }

                yield return new TestCaseData(ItemTypeConstants.AlchemicalItem, PowerConstants.Mundane, "Wrong Item", false);
                //yield return new TestCaseData(ItemTypeConstants.AlchemicalItem, PowerConstants.Mundane, AlchemicalItemConstants.Acid, false);
                yield return new TestCaseData(ItemTypeConstants.AlchemicalItem, PowerConstants.Mundane, ArmorConstants.AbsorbingShield, false);
                yield return new TestCaseData(ItemTypeConstants.AlchemicalItem, PowerConstants.Mundane, ArmorConstants.BandedMail, false);
                yield return new TestCaseData(ItemTypeConstants.AlchemicalItem, PowerConstants.Mundane, PotionConstants.Aid, false);
                yield return new TestCaseData(ItemTypeConstants.AlchemicalItem, PowerConstants.Mundane, RingConstants.AcidResistance_Greater, false);
                yield return new TestCaseData(ItemTypeConstants.AlchemicalItem, PowerConstants.Mundane, RodConstants.Absorption, false);
                yield return new TestCaseData(ItemTypeConstants.AlchemicalItem, PowerConstants.Mundane, StaffConstants.Abjuration, false);
                yield return new TestCaseData(ItemTypeConstants.AlchemicalItem, PowerConstants.Mundane, ToolConstants.ArtisansTools_Masterwork, false);
                yield return new TestCaseData(ItemTypeConstants.AlchemicalItem, PowerConstants.Mundane, WeaponConstants.Arrow, false);
                yield return new TestCaseData(ItemTypeConstants.AlchemicalItem, PowerConstants.Mundane, WeaponConstants.AssassinsDagger, false);
                yield return new TestCaseData(ItemTypeConstants.AlchemicalItem, PowerConstants.Mundane, WondrousItemConstants.AmuletOfHealth, false);

                var armors = ArmorConstants.GetAllArmorsAndShields(false);
                foreach (var armor in armors)
                {
                    yield return new TestCaseData(ItemTypeConstants.Armor, PowerConstants.Mundane, armor, true);
                    yield return new TestCaseData(ItemTypeConstants.Armor, PowerConstants.Minor, armor, true);
                    yield return new TestCaseData(ItemTypeConstants.Armor, PowerConstants.Medium, armor, true);
                    yield return new TestCaseData(ItemTypeConstants.Armor, PowerConstants.Major, armor, true);

                    yield return new TestCaseData("Wrong Item Type", PowerConstants.Medium, armor, false);
                    yield return new TestCaseData(ItemTypeConstants.AlchemicalItem, PowerConstants.Medium, armor, false);
                    //yield return new TestCaseData(ItemTypeConstants.Armor, PowerConstants.Medium, armor, false);
                    yield return new TestCaseData(ItemTypeConstants.Potion, PowerConstants.Medium, armor, false);
                    yield return new TestCaseData(ItemTypeConstants.Ring, PowerConstants.Medium, armor, false);
                    yield return new TestCaseData(ItemTypeConstants.Rod, PowerConstants.Medium, armor, false);
                    //yield return new TestCaseData(ItemTypeConstants.Scroll, PowerConstants.Medium, armor, false);
                    yield return new TestCaseData(ItemTypeConstants.Staff, PowerConstants.Medium, armor, false);
                    yield return new TestCaseData(ItemTypeConstants.Tool, PowerConstants.Medium, armor, false);
                    //yield return new TestCaseData(ItemTypeConstants.Wand, PowerConstants.Medium, armor, false);
                    yield return new TestCaseData(ItemTypeConstants.Weapon, PowerConstants.Medium, armor, false);
                    yield return new TestCaseData(ItemTypeConstants.WondrousItem, PowerConstants.Medium, armor, false);

                    yield return new TestCaseData(ItemTypeConstants.Armor, "Wrong Power", armor, false);
                    //yield return new TestCaseData(ItemTypeConstants.Armor, PowerConstants.Mundane, armor, false);
                    //yield return new TestCaseData(ItemTypeConstants.Armor, PowerConstants.Minor, armor, false);
                    //yield return new TestCaseData(ItemTypeConstants.Armor, PowerConstants.Medium, armor, false);
                    //yield return new TestCaseData(ItemTypeConstants.Armor, PowerConstants.Major, armor, false);
                }

                yield return new TestCaseData(ItemTypeConstants.Armor, PowerConstants.Medium, "Wrong Item", false);
                yield return new TestCaseData(ItemTypeConstants.Armor, PowerConstants.Medium, AlchemicalItemConstants.Acid, false);
                //yield return new TestCaseData(ItemTypeConstants.Armor, PowerConstants.Medium, ArmorConstants.AbsorbingShield, false);
                //yield return new TestCaseData(ItemTypeConstants.Armor, PowerConstants.Medium, ArmorConstants.BandedMail, false);
                yield return new TestCaseData(ItemTypeConstants.Armor, PowerConstants.Medium, PotionConstants.Aid, false);
                yield return new TestCaseData(ItemTypeConstants.Armor, PowerConstants.Medium, RingConstants.AcidResistance_Greater, false);
                yield return new TestCaseData(ItemTypeConstants.Armor, PowerConstants.Medium, RodConstants.Absorption, false);
                yield return new TestCaseData(ItemTypeConstants.Armor, PowerConstants.Medium, StaffConstants.Abjuration, false);
                yield return new TestCaseData(ItemTypeConstants.Armor, PowerConstants.Medium, ToolConstants.ArtisansTools_Masterwork, false);
                yield return new TestCaseData(ItemTypeConstants.Armor, PowerConstants.Medium, WeaponConstants.Arrow, false);
                yield return new TestCaseData(ItemTypeConstants.Armor, PowerConstants.Medium, WeaponConstants.AssassinsDagger, false);
                yield return new TestCaseData(ItemTypeConstants.Armor, PowerConstants.Medium, WondrousItemConstants.AmuletOfHealth, false);

                var specificArmors = ArmorConstants.GetAllSpecificArmorsAndShields();
                foreach (var armor in specificArmors)
                {
                    yield return new TestCaseData(ItemTypeConstants.Armor, PowerConstants.Minor, armor, true);
                    yield return new TestCaseData(ItemTypeConstants.Armor, PowerConstants.Medium, armor, true);
                    yield return new TestCaseData(ItemTypeConstants.Armor, PowerConstants.Major, armor, true);

                    yield return new TestCaseData("Wrong Item Type", PowerConstants.Medium, armor, false);
                    yield return new TestCaseData(ItemTypeConstants.AlchemicalItem, PowerConstants.Medium, armor, false);
                    //yield return new TestCaseData(ItemTypeConstants.Armor, PowerConstants.Medium, armor, false);
                    yield return new TestCaseData(ItemTypeConstants.Potion, PowerConstants.Medium, armor, false);
                    yield return new TestCaseData(ItemTypeConstants.Ring, PowerConstants.Medium, armor, false);
                    yield return new TestCaseData(ItemTypeConstants.Rod, PowerConstants.Medium, armor, false);
                    //yield return new TestCaseData(ItemTypeConstants.Scroll, PowerConstants.Medium, armor, false);
                    yield return new TestCaseData(ItemTypeConstants.Staff, PowerConstants.Medium, armor, false);
                    yield return new TestCaseData(ItemTypeConstants.Tool, PowerConstants.Medium, armor, false);
                    //yield return new TestCaseData(ItemTypeConstants.Wand, PowerConstants.Medium, armor, false);
                    yield return new TestCaseData(ItemTypeConstants.Weapon, PowerConstants.Medium, armor, false);
                    yield return new TestCaseData(ItemTypeConstants.WondrousItem, PowerConstants.Medium, armor, false);

                    yield return new TestCaseData(ItemTypeConstants.Armor, "Wrong Power", armor, false);
                    yield return new TestCaseData(ItemTypeConstants.Armor, PowerConstants.Mundane, armor, false);
                    //yield return new TestCaseData(ItemTypeConstants.Armor, PowerConstants.Minor, armor, false);
                    //yield return new TestCaseData(ItemTypeConstants.Armor, PowerConstants.Medium, armor, false);
                    //yield return new TestCaseData(ItemTypeConstants.Armor, PowerConstants.Major, armor, false);
                }

                var potions = PotionConstants.GetAllPotions(false);
                foreach (var potion in potions)
                {
                    yield return new TestCaseData(ItemTypeConstants.Potion, PowerConstants.Minor, potion, true);
                    yield return new TestCaseData(ItemTypeConstants.Potion, PowerConstants.Medium, potion, true);
                    yield return new TestCaseData(ItemTypeConstants.Potion, PowerConstants.Major, potion, true);

                    yield return new TestCaseData("Wrong Item Type", PowerConstants.Medium, potion, false);
                    yield return new TestCaseData(ItemTypeConstants.AlchemicalItem, PowerConstants.Medium, potion, false);
                    yield return new TestCaseData(ItemTypeConstants.Armor, PowerConstants.Medium, potion, false);
                    //yield return new TestCaseData(ItemTypeConstants.Potion, PowerConstants.Medium, potion, false);
                    yield return new TestCaseData(ItemTypeConstants.Ring, PowerConstants.Medium, potion, false);
                    yield return new TestCaseData(ItemTypeConstants.Rod, PowerConstants.Medium, potion, false);
                    //yield return new TestCaseData(ItemTypeConstants.Scroll, PowerConstants.Medium, potion, false);
                    yield return new TestCaseData(ItemTypeConstants.Staff, PowerConstants.Medium, potion, false);
                    yield return new TestCaseData(ItemTypeConstants.Tool, PowerConstants.Medium, potion, false);
                    //yield return new TestCaseData(ItemTypeConstants.Wand, PowerConstants.Medium, potion, false);
                    yield return new TestCaseData(ItemTypeConstants.Weapon, PowerConstants.Medium, potion, false);
                    yield return new TestCaseData(ItemTypeConstants.WondrousItem, PowerConstants.Medium, potion, false);

                    yield return new TestCaseData(ItemTypeConstants.Potion, "Wrong Power", potion, false);
                    yield return new TestCaseData(ItemTypeConstants.Potion, PowerConstants.Mundane, potion, false);
                    //yield return new TestCaseData(ItemTypeConstants.Potion, PowerConstants.Minor, potion, false);
                    //yield return new TestCaseData(ItemTypeConstants.Potion, PowerConstants.Medium, potion, false);
                    //yield return new TestCaseData(ItemTypeConstants.Potion, PowerConstants.Major, potion, false);
                }

                yield return new TestCaseData(ItemTypeConstants.Potion, PowerConstants.Medium, "Wrong Item", false);
                yield return new TestCaseData(ItemTypeConstants.Potion, PowerConstants.Medium, AlchemicalItemConstants.Acid, false);
                yield return new TestCaseData(ItemTypeConstants.Potion, PowerConstants.Medium, ArmorConstants.AbsorbingShield, false);
                yield return new TestCaseData(ItemTypeConstants.Potion, PowerConstants.Medium, ArmorConstants.BandedMail, false);
                //yield return new TestCaseData(ItemTypeConstants.Potion, PowerConstants.Medium, PotionConstants.Aid, false);
                yield return new TestCaseData(ItemTypeConstants.Potion, PowerConstants.Medium, RingConstants.AcidResistance_Greater, false);
                yield return new TestCaseData(ItemTypeConstants.Potion, PowerConstants.Medium, RodConstants.Absorption, false);
                yield return new TestCaseData(ItemTypeConstants.Potion, PowerConstants.Medium, StaffConstants.Abjuration, false);
                yield return new TestCaseData(ItemTypeConstants.Potion, PowerConstants.Medium, ToolConstants.ArtisansTools_Masterwork, false);
                yield return new TestCaseData(ItemTypeConstants.Potion, PowerConstants.Medium, WeaponConstants.Arrow, false);
                yield return new TestCaseData(ItemTypeConstants.Potion, PowerConstants.Medium, WeaponConstants.AssassinsDagger, false);
                yield return new TestCaseData(ItemTypeConstants.Potion, PowerConstants.Medium, WondrousItemConstants.AmuletOfHealth, false);

                var rings = RingConstants.GetAllRings();
                foreach (var ring in rings)
                {
                    yield return new TestCaseData(ItemTypeConstants.Ring, PowerConstants.Minor, ring, true);
                    yield return new TestCaseData(ItemTypeConstants.Ring, PowerConstants.Medium, ring, true);
                    yield return new TestCaseData(ItemTypeConstants.Ring, PowerConstants.Major, ring, true);

                    yield return new TestCaseData("Wrong Item Type", PowerConstants.Medium, ring, false);
                    yield return new TestCaseData(ItemTypeConstants.AlchemicalItem, PowerConstants.Medium, ring, false);
                    yield return new TestCaseData(ItemTypeConstants.Armor, PowerConstants.Medium, ring, false);
                    yield return new TestCaseData(ItemTypeConstants.Potion, PowerConstants.Medium, ring, false);
                    //yield return new TestCaseData(ItemTypeConstants.Ring, PowerConstants.Medium, ring, false);
                    yield return new TestCaseData(ItemTypeConstants.Rod, PowerConstants.Medium, ring, false);
                    //yield return new TestCaseData(ItemTypeConstants.Scroll, PowerConstants.Medium, ring, false);
                    yield return new TestCaseData(ItemTypeConstants.Staff, PowerConstants.Medium, ring, false);
                    yield return new TestCaseData(ItemTypeConstants.Tool, PowerConstants.Medium, ring, false);
                    //yield return new TestCaseData(ItemTypeConstants.Wand, PowerConstants.Medium, ring, false);
                    yield return new TestCaseData(ItemTypeConstants.Weapon, PowerConstants.Medium, ring, false);
                    yield return new TestCaseData(ItemTypeConstants.WondrousItem, PowerConstants.Medium, ring, false);

                    yield return new TestCaseData(ItemTypeConstants.Ring, "Wrong Power", ring, false);
                    yield return new TestCaseData(ItemTypeConstants.Ring, PowerConstants.Mundane, ring, false);
                    //yield return new TestCaseData(ItemTypeConstants.Ring, PowerConstants.Minor, ring, false);
                    //yield return new TestCaseData(ItemTypeConstants.Ring, PowerConstants.Medium, ring, false);
                    //yield return new TestCaseData(ItemTypeConstants.Ring, PowerConstants.Major, ring, false);
                }

                yield return new TestCaseData(ItemTypeConstants.Ring, PowerConstants.Medium, "Wrong Item", false);
                yield return new TestCaseData(ItemTypeConstants.Ring, PowerConstants.Medium, AlchemicalItemConstants.Acid, false);
                yield return new TestCaseData(ItemTypeConstants.Ring, PowerConstants.Medium, ArmorConstants.AbsorbingShield, false);
                yield return new TestCaseData(ItemTypeConstants.Ring, PowerConstants.Medium, ArmorConstants.BandedMail, false);
                yield return new TestCaseData(ItemTypeConstants.Ring, PowerConstants.Medium, PotionConstants.Aid, false);
                //yield return new TestCaseData(ItemTypeConstants.Ring, PowerConstants.Medium, RingConstants.AcidResistance_Greater, false);
                yield return new TestCaseData(ItemTypeConstants.Ring, PowerConstants.Medium, RodConstants.Absorption, false);
                yield return new TestCaseData(ItemTypeConstants.Ring, PowerConstants.Medium, StaffConstants.Abjuration, false);
                yield return new TestCaseData(ItemTypeConstants.Ring, PowerConstants.Medium, ToolConstants.ArtisansTools_Masterwork, false);
                yield return new TestCaseData(ItemTypeConstants.Ring, PowerConstants.Medium, WeaponConstants.Arrow, false);
                yield return new TestCaseData(ItemTypeConstants.Ring, PowerConstants.Medium, WeaponConstants.AssassinsDagger, false);
                yield return new TestCaseData(ItemTypeConstants.Ring, PowerConstants.Medium, WondrousItemConstants.AmuletOfHealth, false);

                var rods = RodConstants.GetAllRods();
                foreach (var rod in rods)
                {
                    yield return new TestCaseData(ItemTypeConstants.Rod, PowerConstants.Medium, rod, true);
                    yield return new TestCaseData(ItemTypeConstants.Rod, PowerConstants.Major, rod, true);

                    yield return new TestCaseData("Wrong Item Type", PowerConstants.Medium, rod, false);
                    yield return new TestCaseData(ItemTypeConstants.AlchemicalItem, PowerConstants.Medium, rod, false);
                    yield return new TestCaseData(ItemTypeConstants.Armor, PowerConstants.Medium, rod, false);
                    yield return new TestCaseData(ItemTypeConstants.Potion, PowerConstants.Medium, rod, false);
                    yield return new TestCaseData(ItemTypeConstants.Ring, PowerConstants.Medium, rod, false);
                    //yield return new TestCaseData(ItemTypeConstants.Rod, PowerConstants.Medium, rod, false);
                    //yield return new TestCaseData(ItemTypeConstants.Scroll, PowerConstants.Medium, rod, false);
                    yield return new TestCaseData(ItemTypeConstants.Staff, PowerConstants.Medium, rod, false);
                    yield return new TestCaseData(ItemTypeConstants.Tool, PowerConstants.Medium, rod, false);
                    //yield return new TestCaseData(ItemTypeConstants.Wand, PowerConstants.Medium, rod, false);
                    yield return new TestCaseData(ItemTypeConstants.Weapon, PowerConstants.Medium, rod, false);
                    yield return new TestCaseData(ItemTypeConstants.WondrousItem, PowerConstants.Medium, rod, false);

                    yield return new TestCaseData(ItemTypeConstants.Rod, "Wrong Power", rod, false);
                    yield return new TestCaseData(ItemTypeConstants.Rod, PowerConstants.Mundane, rod, false);
                    yield return new TestCaseData(ItemTypeConstants.Rod, PowerConstants.Minor, rod, false);
                    //yield return new TestCaseData(ItemTypeConstants.Rod, PowerConstants.Medium, rod, false);
                    //yield return new TestCaseData(ItemTypeConstants.Rod, PowerConstants.Major, rod, false);
                }

                yield return new TestCaseData(ItemTypeConstants.Rod, PowerConstants.Medium, "Wrong Item", false);
                yield return new TestCaseData(ItemTypeConstants.Rod, PowerConstants.Medium, AlchemicalItemConstants.Acid, false);
                yield return new TestCaseData(ItemTypeConstants.Rod, PowerConstants.Medium, ArmorConstants.AbsorbingShield, false);
                yield return new TestCaseData(ItemTypeConstants.Rod, PowerConstants.Medium, ArmorConstants.BandedMail, false);
                yield return new TestCaseData(ItemTypeConstants.Rod, PowerConstants.Medium, PotionConstants.Aid, false);
                yield return new TestCaseData(ItemTypeConstants.Rod, PowerConstants.Medium, RingConstants.AcidResistance_Greater, false);
                //yield return new TestCaseData(ItemTypeConstants.Rod, PowerConstants.Medium, RodConstants.Absorption, false);
                yield return new TestCaseData(ItemTypeConstants.Rod, PowerConstants.Medium, StaffConstants.Abjuration, false);
                yield return new TestCaseData(ItemTypeConstants.Rod, PowerConstants.Medium, ToolConstants.ArtisansTools_Masterwork, false);
                yield return new TestCaseData(ItemTypeConstants.Rod, PowerConstants.Medium, WeaponConstants.Arrow, false);
                yield return new TestCaseData(ItemTypeConstants.Rod, PowerConstants.Medium, WeaponConstants.AssassinsDagger, false);
                yield return new TestCaseData(ItemTypeConstants.Rod, PowerConstants.Medium, WondrousItemConstants.AmuletOfHealth, false);

                yield return new TestCaseData(ItemTypeConstants.Scroll, PowerConstants.Minor, "My Scroll", true);
                yield return new TestCaseData(ItemTypeConstants.Scroll, PowerConstants.Medium, "My Scroll", true);
                yield return new TestCaseData(ItemTypeConstants.Scroll, PowerConstants.Major, "My Scroll", true);

                yield return new TestCaseData("Wrong Item Type", PowerConstants.Medium, "My Scroll", false);
                yield return new TestCaseData(ItemTypeConstants.AlchemicalItem, PowerConstants.Medium, "My Scroll", false);
                yield return new TestCaseData(ItemTypeConstants.Armor, PowerConstants.Medium, "My Scroll", false);
                yield return new TestCaseData(ItemTypeConstants.Potion, PowerConstants.Medium, "My Scroll", false);
                yield return new TestCaseData(ItemTypeConstants.Ring, PowerConstants.Medium, "My Scroll", false);
                yield return new TestCaseData(ItemTypeConstants.Rod, PowerConstants.Medium, "My Scroll", false);
                //yield return new TestCaseData(ItemTypeConstants.Scroll, PowerConstants.Medium, "My Scroll", false);
                yield return new TestCaseData(ItemTypeConstants.Staff, PowerConstants.Medium, "My Scroll", false);
                yield return new TestCaseData(ItemTypeConstants.Tool, PowerConstants.Medium, "My Scroll", false);
                //yield return new TestCaseData(ItemTypeConstants.Wand, PowerConstants.Medium, "My Scroll", false);
                yield return new TestCaseData(ItemTypeConstants.Weapon, PowerConstants.Medium, "My Scroll", false);
                yield return new TestCaseData(ItemTypeConstants.WondrousItem, PowerConstants.Medium, "My Scroll", false);

                yield return new TestCaseData(ItemTypeConstants.Scroll, "Wrong Power", "My Scroll", false);
                yield return new TestCaseData(ItemTypeConstants.Scroll, PowerConstants.Mundane, "My Scroll", false);
                //yield return new TestCaseData(ItemTypeConstants.Scroll, PowerConstants.Minor, "My Scroll", false);
                //yield return new TestCaseData(ItemTypeConstants.Scroll, PowerConstants.Medium, "My Scroll", false);
                //yield return new TestCaseData(ItemTypeConstants.Scroll, PowerConstants.Major, "My Scroll", false);

                //INFO: Because any name can be used for a scroll, other item names will always be valid
                //yield return new TestCaseData(ItemTypeConstants.Scroll, PowerConstants.Medium, "Wrong Item", false);
                //yield return new TestCaseData(ItemTypeConstants.Scroll, PowerConstants.Medium, AlchemicalItemConstants.Acid, false);
                //yield return new TestCaseData(ItemTypeConstants.Scroll, PowerConstants.Medium, ArmorConstants.AbsorbingShield, false);
                //yield return new TestCaseData(ItemTypeConstants.Scroll, PowerConstants.Medium, ArmorConstants.BandedMail, false);
                //yield return new TestCaseData(ItemTypeConstants.Scroll, PowerConstants.Medium, PotionConstants.Aid, false);
                //yield return new TestCaseData(ItemTypeConstants.Scroll, PowerConstants.Medium, RingConstants.AcidResistance_Greater, false);
                //yield return new TestCaseData(ItemTypeConstants.Scroll, PowerConstants.Medium, RodConstants.Absorption, false);
                //yield return new TestCaseData(ItemTypeConstants.Scroll, PowerConstants.Medium, StaffConstants.Abjuration, false);
                //yield return new TestCaseData(ItemTypeConstants.Scroll, PowerConstants.Medium, ToolConstants.ArtisansTools_Masterwork, false);
                //yield return new TestCaseData(ItemTypeConstants.Scroll, PowerConstants.Medium, WeaponConstants.Arrow, false);
                //yield return new TestCaseData(ItemTypeConstants.Scroll, PowerConstants.Medium, WeaponConstants.AssassinsDagger, false);
                //yield return new TestCaseData(ItemTypeConstants.Scroll, PowerConstants.Medium, WondrousItemConstants.AmuletOfHealth, false);

                var staffs = StaffConstants.GetAllStaffs();
                foreach (var staff in staffs)
                {
                    yield return new TestCaseData(ItemTypeConstants.Staff, PowerConstants.Medium, staff, true);
                    yield return new TestCaseData(ItemTypeConstants.Staff, PowerConstants.Major, staff, true);

                    yield return new TestCaseData("Wrong Item Type", PowerConstants.Medium, staff, false);
                    yield return new TestCaseData(ItemTypeConstants.AlchemicalItem, PowerConstants.Medium, staff, false);
                    yield return new TestCaseData(ItemTypeConstants.Armor, PowerConstants.Medium, staff, false);
                    yield return new TestCaseData(ItemTypeConstants.Potion, PowerConstants.Medium, staff, false);
                    yield return new TestCaseData(ItemTypeConstants.Ring, PowerConstants.Medium, staff, false);
                    yield return new TestCaseData(ItemTypeConstants.Rod, PowerConstants.Medium, staff, false);
                    //yield return new TestCaseData(ItemTypeConstants.Scroll, PowerConstants.Medium, staff, false);
                    //yield return new TestCaseData(ItemTypeConstants.Staff, PowerConstants.Medium, staff, false);
                    yield return new TestCaseData(ItemTypeConstants.Tool, PowerConstants.Medium, staff, false);
                    //yield return new TestCaseData(ItemTypeConstants.Wand, PowerConstants.Medium, staff, false);
                    yield return new TestCaseData(ItemTypeConstants.Weapon, PowerConstants.Medium, staff, false);
                    yield return new TestCaseData(ItemTypeConstants.WondrousItem, PowerConstants.Medium, staff, false);

                    yield return new TestCaseData(ItemTypeConstants.Staff, "Wrong Power", staff, false);
                    yield return new TestCaseData(ItemTypeConstants.Staff, PowerConstants.Mundane, staff, false);
                    yield return new TestCaseData(ItemTypeConstants.Staff, PowerConstants.Minor, staff, false);
                    //yield return new TestCaseData(ItemTypeConstants.Staff, PowerConstants.Medium, staff, false);
                    //yield return new TestCaseData(ItemTypeConstants.Staff, PowerConstants.Major, staff, false);
                }

                yield return new TestCaseData(ItemTypeConstants.Staff, PowerConstants.Medium, "Wrong Item", false);
                yield return new TestCaseData(ItemTypeConstants.Staff, PowerConstants.Medium, AlchemicalItemConstants.Acid, false);
                yield return new TestCaseData(ItemTypeConstants.Staff, PowerConstants.Medium, ArmorConstants.AbsorbingShield, false);
                yield return new TestCaseData(ItemTypeConstants.Staff, PowerConstants.Medium, ArmorConstants.BandedMail, false);
                yield return new TestCaseData(ItemTypeConstants.Staff, PowerConstants.Medium, PotionConstants.Aid, false);
                yield return new TestCaseData(ItemTypeConstants.Staff, PowerConstants.Medium, RingConstants.AcidResistance_Greater, false);
                yield return new TestCaseData(ItemTypeConstants.Staff, PowerConstants.Medium, RodConstants.Absorption, false);
                //yield return new TestCaseData(ItemTypeConstants.Staff, PowerConstants.Medium, StaffConstants.Abjuration, false);
                yield return new TestCaseData(ItemTypeConstants.Staff, PowerConstants.Medium, ToolConstants.ArtisansTools_Masterwork, false);
                yield return new TestCaseData(ItemTypeConstants.Staff, PowerConstants.Medium, WeaponConstants.Arrow, false);
                yield return new TestCaseData(ItemTypeConstants.Staff, PowerConstants.Medium, WeaponConstants.AssassinsDagger, false);
                yield return new TestCaseData(ItemTypeConstants.Staff, PowerConstants.Medium, WondrousItemConstants.AmuletOfHealth, false);

                var tools = ToolConstants.GetAllTools();
                foreach (var tool in tools)
                {
                    yield return new TestCaseData(ItemTypeConstants.Tool, PowerConstants.Mundane, tool, true);

                    yield return new TestCaseData("Wrong Item Type", PowerConstants.Mundane, tool, false);
                    yield return new TestCaseData(ItemTypeConstants.AlchemicalItem, PowerConstants.Mundane, tool, false);
                    yield return new TestCaseData(ItemTypeConstants.Armor, PowerConstants.Mundane, tool, false);
                    yield return new TestCaseData(ItemTypeConstants.Potion, PowerConstants.Mundane, tool, false);
                    yield return new TestCaseData(ItemTypeConstants.Ring, PowerConstants.Mundane, tool, false);
                    yield return new TestCaseData(ItemTypeConstants.Rod, PowerConstants.Mundane, tool, false);
                    //yield return new TestCaseData(ItemTypeConstants.Scroll, PowerConstants.Mundane, tool, false);
                    yield return new TestCaseData(ItemTypeConstants.Staff, PowerConstants.Mundane, tool, false);
                    //yield return new TestCaseData(ItemTypeConstants.Tool, PowerConstants.Mundane, tool, false);
                    //yield return new TestCaseData(ItemTypeConstants.Wand, PowerConstants.Mundane, tool, false);
                    yield return new TestCaseData(ItemTypeConstants.Weapon, PowerConstants.Mundane, tool, false);
                    yield return new TestCaseData(ItemTypeConstants.WondrousItem, PowerConstants.Mundane, tool, false);

                    yield return new TestCaseData(ItemTypeConstants.Tool, "Wrong Power", tool, false);
                    //yield return new TestCaseData(ItemTypeConstants.Tool, PowerConstants.Mundane, tool, false);
                    yield return new TestCaseData(ItemTypeConstants.Tool, PowerConstants.Minor, tool, false);
                    yield return new TestCaseData(ItemTypeConstants.Tool, PowerConstants.Medium, tool, false);
                    yield return new TestCaseData(ItemTypeConstants.Tool, PowerConstants.Major, tool, false);
                }

                yield return new TestCaseData(ItemTypeConstants.Tool, PowerConstants.Mundane, "Wrong Item", false);
                yield return new TestCaseData(ItemTypeConstants.Tool, PowerConstants.Mundane, AlchemicalItemConstants.Acid, false);
                yield return new TestCaseData(ItemTypeConstants.Tool, PowerConstants.Mundane, ArmorConstants.AbsorbingShield, false);
                yield return new TestCaseData(ItemTypeConstants.Tool, PowerConstants.Mundane, ArmorConstants.BandedMail, false);
                yield return new TestCaseData(ItemTypeConstants.Tool, PowerConstants.Mundane, PotionConstants.Aid, false);
                yield return new TestCaseData(ItemTypeConstants.Tool, PowerConstants.Mundane, RingConstants.AcidResistance_Greater, false);
                yield return new TestCaseData(ItemTypeConstants.Tool, PowerConstants.Mundane, RodConstants.Absorption, false);
                yield return new TestCaseData(ItemTypeConstants.Tool, PowerConstants.Mundane, StaffConstants.Abjuration, false);
                //yield return new TestCaseData(ItemTypeConstants.Tool, PowerConstants.Mundane, ToolConstants.ArtisansTools_Masterwork, false);
                yield return new TestCaseData(ItemTypeConstants.Tool, PowerConstants.Mundane, WeaponConstants.Arrow, false);
                yield return new TestCaseData(ItemTypeConstants.Tool, PowerConstants.Mundane, WeaponConstants.AssassinsDagger, false);
                yield return new TestCaseData(ItemTypeConstants.Tool, PowerConstants.Mundane, WondrousItemConstants.AmuletOfHealth, false);

                yield return new TestCaseData(ItemTypeConstants.Wand, PowerConstants.Minor, "My Wand", true);
                yield return new TestCaseData(ItemTypeConstants.Wand, PowerConstants.Medium, "My Wand", true);
                yield return new TestCaseData(ItemTypeConstants.Wand, PowerConstants.Major, "My Wand", true);

                yield return new TestCaseData("Wrong Item Type", PowerConstants.Medium, "My Wand", false);
                yield return new TestCaseData(ItemTypeConstants.AlchemicalItem, PowerConstants.Medium, "My Wand", false);
                yield return new TestCaseData(ItemTypeConstants.Armor, PowerConstants.Medium, "My Wand", false);
                yield return new TestCaseData(ItemTypeConstants.Potion, PowerConstants.Medium, "My Wand", false);
                yield return new TestCaseData(ItemTypeConstants.Ring, PowerConstants.Medium, "My Wand", false);
                yield return new TestCaseData(ItemTypeConstants.Rod, PowerConstants.Medium, "My Wand", false);
                //yield return new TestCaseData(ItemTypeConstants.Scroll, PowerConstants.Medium, "My Wand", false);
                yield return new TestCaseData(ItemTypeConstants.Staff, PowerConstants.Medium, "My Wand", false);
                yield return new TestCaseData(ItemTypeConstants.Tool, PowerConstants.Medium, "My Wand", false);
                //yield return new TestCaseData(ItemTypeConstants.Wand, PowerConstants.Medium, "My Wand", false);
                yield return new TestCaseData(ItemTypeConstants.Weapon, PowerConstants.Medium, "My Wand", false);
                yield return new TestCaseData(ItemTypeConstants.WondrousItem, PowerConstants.Medium, "My Wand", false);

                yield return new TestCaseData(ItemTypeConstants.Wand, "Wrong Power", "My Wand", false);
                yield return new TestCaseData(ItemTypeConstants.Wand, PowerConstants.Mundane, "My Wand", false);
                //yield return new TestCaseData(ItemTypeConstants.Wand, PowerConstants.Minor, "My Wand", false);
                //yield return new TestCaseData(ItemTypeConstants.Wand, PowerConstants.Medium, "My Wand", false);
                //yield return new TestCaseData(ItemTypeConstants.Wand, PowerConstants.Major, "My Wand", false);

                //INFO: Because any name can be used for a wand, other item names will always be valid
                //yield return new TestCaseData(ItemTypeConstants.Wand, PowerConstants.Medium, "Wrong Item", false);
                //yield return new TestCaseData(ItemTypeConstants.Wand, PowerConstants.Medium, AlchemicalItemConstants.Acid, false);
                //yield return new TestCaseData(ItemTypeConstants.Wand, PowerConstants.Medium, ArmorConstants.AbsorbingShield, false);
                //yield return new TestCaseData(ItemTypeConstants.Wand, PowerConstants.Medium, ArmorConstants.BandedMail, false);
                //yield return new TestCaseData(ItemTypeConstants.Wand, PowerConstants.Medium, PotionConstants.Aid, false);
                //yield return new TestCaseData(ItemTypeConstants.Wand, PowerConstants.Medium, RingConstants.AcidResistance_Greater, false);
                //yield return new TestCaseData(ItemTypeConstants.Wand, PowerConstants.Medium, RodConstants.Absorption, false);
                //yield return new TestCaseData(ItemTypeConstants.Wand, PowerConstants.Medium, StaffConstants.Abjuration, false);
                //yield return new TestCaseData(ItemTypeConstants.Wand, PowerConstants.Medium, ToolConstants.ArtisansTools_Masterwork, false);
                //yield return new TestCaseData(ItemTypeConstants.Wand, PowerConstants.Medium, WeaponConstants.Arrow, false);
                //yield return new TestCaseData(ItemTypeConstants.Wand, PowerConstants.Medium, WeaponConstants.AssassinsDagger, false);
                //yield return new TestCaseData(ItemTypeConstants.Wand, PowerConstants.Medium, WondrousItemConstants.AmuletOfHealth, false);

                var weapons = WeaponConstants.GetAllWeapons(false, false);
                foreach (var weapon in weapons)
                {
                    yield return new TestCaseData(ItemTypeConstants.Weapon, PowerConstants.Mundane, weapon, true);
                    yield return new TestCaseData(ItemTypeConstants.Weapon, PowerConstants.Minor, weapon, true);
                    yield return new TestCaseData(ItemTypeConstants.Weapon, PowerConstants.Medium, weapon, true);
                    yield return new TestCaseData(ItemTypeConstants.Weapon, PowerConstants.Major, weapon, true);

                    yield return new TestCaseData("Wrong Item Type", PowerConstants.Medium, weapon, false);
                    yield return new TestCaseData(ItemTypeConstants.AlchemicalItem, PowerConstants.Medium, weapon, false);
                    yield return new TestCaseData(ItemTypeConstants.Armor, PowerConstants.Medium, weapon, false);
                    yield return new TestCaseData(ItemTypeConstants.Potion, PowerConstants.Medium, weapon, false);
                    yield return new TestCaseData(ItemTypeConstants.Ring, PowerConstants.Medium, weapon, false);
                    yield return new TestCaseData(ItemTypeConstants.Rod, PowerConstants.Medium, weapon, false);
                    //yield return new TestCaseData(ItemTypeConstants.Scroll, PowerConstants.Medium, weapon, false);
                    yield return new TestCaseData(ItemTypeConstants.Staff, PowerConstants.Medium, weapon, false);
                    yield return new TestCaseData(ItemTypeConstants.Tool, PowerConstants.Medium, weapon, false);
                    //yield return new TestCaseData(ItemTypeConstants.Wand, PowerConstants.Medium, weapon, false);
                    //yield return new TestCaseData(ItemTypeConstants.Weapon, PowerConstants.Medium, weapon, false);
                    yield return new TestCaseData(ItemTypeConstants.WondrousItem, PowerConstants.Medium, weapon, false);

                    yield return new TestCaseData(ItemTypeConstants.Weapon, "Wrong Power", weapon, false);
                    //yield return new TestCaseData(ItemTypeConstants.Weapon, PowerConstants.Mundane, weapon, false);
                    //yield return new TestCaseData(ItemTypeConstants.Weapon, PowerConstants.Minor, weapon, false);
                    //yield return new TestCaseData(ItemTypeConstants.Weapon, PowerConstants.Medium, weapon, false);
                    //yield return new TestCaseData(ItemTypeConstants.Weapon, PowerConstants.Major, weapon, false);
                }

                yield return new TestCaseData(ItemTypeConstants.Weapon, PowerConstants.Medium, "Wrong Item", false);
                yield return new TestCaseData(ItemTypeConstants.Weapon, PowerConstants.Medium, AlchemicalItemConstants.Acid, false);
                yield return new TestCaseData(ItemTypeConstants.Weapon, PowerConstants.Medium, ArmorConstants.AbsorbingShield, false);
                yield return new TestCaseData(ItemTypeConstants.Weapon, PowerConstants.Medium, ArmorConstants.BandedMail, false);
                yield return new TestCaseData(ItemTypeConstants.Weapon, PowerConstants.Medium, PotionConstants.Aid, false);
                yield return new TestCaseData(ItemTypeConstants.Weapon, PowerConstants.Medium, RingConstants.AcidResistance_Greater, false);
                yield return new TestCaseData(ItemTypeConstants.Weapon, PowerConstants.Medium, RodConstants.Absorption, false);
                yield return new TestCaseData(ItemTypeConstants.Weapon, PowerConstants.Medium, StaffConstants.Abjuration, false);
                yield return new TestCaseData(ItemTypeConstants.Weapon, PowerConstants.Medium, ToolConstants.ArtisansTools_Masterwork, false);
                //yield return new TestCaseData(ItemTypeConstants.Weapon, PowerConstants.Medium, WeaponConstants.Arrow, false);
                //yield return new TestCaseData(ItemTypeConstants.Weapon, PowerConstants.Medium, WeaponConstants.AssassinsDagger, false);
                yield return new TestCaseData(ItemTypeConstants.Weapon, PowerConstants.Medium, WondrousItemConstants.AmuletOfHealth, false);

                var specificWeapons = WeaponConstants.GetAllSpecific().Except(WeaponConstants.GetAllTemplates());
                foreach (var weapon in specificWeapons)
                {
                    yield return new TestCaseData(ItemTypeConstants.Weapon, PowerConstants.Minor, weapon, true);
                    yield return new TestCaseData(ItemTypeConstants.Weapon, PowerConstants.Medium, weapon, true);
                    yield return new TestCaseData(ItemTypeConstants.Weapon, PowerConstants.Major, weapon, true);

                    yield return new TestCaseData("Wrong Item Type", PowerConstants.Medium, weapon, false);
                    yield return new TestCaseData(ItemTypeConstants.AlchemicalItem, PowerConstants.Medium, weapon, false);
                    yield return new TestCaseData(ItemTypeConstants.Armor, PowerConstants.Medium, weapon, false);
                    yield return new TestCaseData(ItemTypeConstants.Potion, PowerConstants.Medium, weapon, false);
                    yield return new TestCaseData(ItemTypeConstants.Ring, PowerConstants.Medium, weapon, false);
                    yield return new TestCaseData(ItemTypeConstants.Rod, PowerConstants.Medium, weapon, false);
                    //yield return new TestCaseData(ItemTypeConstants.Scroll, PowerConstants.Medium, weapon, false);
                    yield return new TestCaseData(ItemTypeConstants.Staff, PowerConstants.Medium, weapon, false);
                    yield return new TestCaseData(ItemTypeConstants.Tool, PowerConstants.Medium, weapon, false);
                    //yield return new TestCaseData(ItemTypeConstants.Wand, PowerConstants.Medium, weapon, false);
                    //yield return new TestCaseData(ItemTypeConstants.Weapon, PowerConstants.Medium, weapon, false);
                    yield return new TestCaseData(ItemTypeConstants.WondrousItem, PowerConstants.Medium, weapon, false);

                    yield return new TestCaseData(ItemTypeConstants.Weapon, "Wrong Power", weapon, false);
                    yield return new TestCaseData(ItemTypeConstants.Weapon, PowerConstants.Mundane, weapon, false);
                    //yield return new TestCaseData(ItemTypeConstants.Weapon, PowerConstants.Minor, weapon, false);
                    //yield return new TestCaseData(ItemTypeConstants.Weapon, PowerConstants.Medium, weapon, false);
                    //yield return new TestCaseData(ItemTypeConstants.Weapon, PowerConstants.Major, weapon, false);
                }

                var wondrousItems = WondrousItemConstants.GetAllWondrousItems();
                foreach (var wondrousItem in wondrousItems)
                {
                    yield return new TestCaseData(ItemTypeConstants.WondrousItem, PowerConstants.Minor, wondrousItem, true);
                    yield return new TestCaseData(ItemTypeConstants.WondrousItem, PowerConstants.Medium, wondrousItem, true);
                    yield return new TestCaseData(ItemTypeConstants.WondrousItem, PowerConstants.Major, wondrousItem, true);

                    yield return new TestCaseData("Wrong Item Type", PowerConstants.Medium, wondrousItem, false);
                    yield return new TestCaseData(ItemTypeConstants.AlchemicalItem, PowerConstants.Medium, wondrousItem, false);
                    yield return new TestCaseData(ItemTypeConstants.Armor, PowerConstants.Medium, wondrousItem, false);
                    yield return new TestCaseData(ItemTypeConstants.Potion, PowerConstants.Medium, wondrousItem, false);
                    yield return new TestCaseData(ItemTypeConstants.Ring, PowerConstants.Medium, wondrousItem, false);
                    yield return new TestCaseData(ItemTypeConstants.Rod, PowerConstants.Medium, wondrousItem, false);
                    //yield return new TestCaseData(ItemTypeConstants.Scroll, PowerConstants.Medium, wondrousItem, false);
                    yield return new TestCaseData(ItemTypeConstants.Staff, PowerConstants.Medium, wondrousItem, false);
                    yield return new TestCaseData(ItemTypeConstants.Tool, PowerConstants.Medium, wondrousItem, false);
                    //yield return new TestCaseData(ItemTypeConstants.Wand, PowerConstants.Medium, wondrousItem, false);
                    yield return new TestCaseData(ItemTypeConstants.Weapon, PowerConstants.Medium, wondrousItem, false);
                    //yield return new TestCaseData(ItemTypeConstants.WondrousItem, PowerConstants.Medium, wondrousItem, false);

                    yield return new TestCaseData(ItemTypeConstants.WondrousItem, "Wrong Power", wondrousItem, false);
                    yield return new TestCaseData(ItemTypeConstants.WondrousItem, PowerConstants.Mundane, wondrousItem, false);
                    //yield return new TestCaseData(ItemTypeConstants.WondrousItem, PowerConstants.Minor, wondrousItem, false);
                    //yield return new TestCaseData(ItemTypeConstants.WondrousItem, PowerConstants.Medium, wondrousItem, false);
                    //yield return new TestCaseData(ItemTypeConstants.WondrousItem, PowerConstants.Major, wondrousItem, false);
                }

                yield return new TestCaseData(ItemTypeConstants.WondrousItem, PowerConstants.Medium, "Wrong Item", false);
                yield return new TestCaseData(ItemTypeConstants.WondrousItem, PowerConstants.Medium, AlchemicalItemConstants.Acid, false);
                yield return new TestCaseData(ItemTypeConstants.WondrousItem, PowerConstants.Medium, ArmorConstants.AbsorbingShield, false);
                yield return new TestCaseData(ItemTypeConstants.WondrousItem, PowerConstants.Medium, ArmorConstants.BandedMail, false);
                yield return new TestCaseData(ItemTypeConstants.WondrousItem, PowerConstants.Medium, PotionConstants.Aid, false);
                yield return new TestCaseData(ItemTypeConstants.WondrousItem, PowerConstants.Medium, RingConstants.AcidResistance_Greater, false);
                yield return new TestCaseData(ItemTypeConstants.WondrousItem, PowerConstants.Medium, RodConstants.Absorption, false);
                yield return new TestCaseData(ItemTypeConstants.WondrousItem, PowerConstants.Medium, StaffConstants.Abjuration, false);
                yield return new TestCaseData(ItemTypeConstants.WondrousItem, PowerConstants.Medium, ToolConstants.ArtisansTools_Masterwork, false);
                yield return new TestCaseData(ItemTypeConstants.WondrousItem, PowerConstants.Medium, WeaponConstants.Arrow, false);
                yield return new TestCaseData(ItemTypeConstants.WondrousItem, PowerConstants.Medium, WeaponConstants.AssassinsDagger, false);
                //yield return new TestCaseData(ItemTypeConstants.WondrousItem, PowerConstants.Medium, WondrousItemConstants.AmuletOfHealth, false);
            }
        }

        [Test]
        public void GetValid_ReturnsValidItemType()
        {
            Assert.Fail("not yet written. Test cases are variations on item types");
        }

        [Test]
        public void GetValid_ReturnsValidPower()
        {
            Assert.Fail("not yet written. Test cases are variations on powers");
        }

        [Test]
        public void GetValid_ReturnsValidItemName()
        {
            Assert.Fail("not yet written. Test cases are variations on names (including null/not set)");
        }
    }
}
