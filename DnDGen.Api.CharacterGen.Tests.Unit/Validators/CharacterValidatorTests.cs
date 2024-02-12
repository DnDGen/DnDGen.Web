using System.Collections;

namespace DnDGen.Api.TreasureGen.Tests.Unit.Validators
{
    public class CharacterValidatorTests
    {
        [TestCaseSource(nameof(RandomItemGenerationData))]
        public void GetValid_ReturnsValidity(string itemType, string power, bool valid)
        {
            var result = CharacterValidator.GetValid(itemType, power);
            Assert.That(result.Valid, Is.EqualTo(valid));
        }

        public static IEnumerable RandomItemGenerationData
        {
            get
            {
                yield return new TestCaseData("fake item type", "fake power", false);
                yield return new TestCaseData("fake item type", PowerConstants.Mundane, false);
                yield return new TestCaseData("fake item type", PowerConstants.Minor, false);
                yield return new TestCaseData("fake item type", PowerConstants.Medium, false);
                yield return new TestCaseData("fake item type", PowerConstants.Major, false);
                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), "fake power", false);
                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Mundane, true);
                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Minor, false);
                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Medium, false);
                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Major, false);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), "fake power", false);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Mundane, true);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Minor, true);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, true);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Major, true);
                yield return new TestCaseData(ItemTypes.Potion.ToString(), "fake power", false);
                yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Mundane, false);
                yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Minor, true);
                yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium, true);
                yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Major, true);
                yield return new TestCaseData(ItemTypes.Ring.ToString(), "fake power", false);
                yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Mundane, false);
                yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Minor, true);
                yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Medium, true);
                yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Major, true);
                yield return new TestCaseData(ItemTypes.Rod.ToString(), "fake power", false);
                yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Mundane, false);
                yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Minor, false);
                yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Medium, true);
                yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Major, true);
                yield return new TestCaseData(ItemTypes.Scroll.ToString(), "fake power", false);
                yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Mundane, false);
                yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Minor, true);
                yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Medium, true);
                yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Major, true);
                yield return new TestCaseData(ItemTypes.Staff.ToString(), "fake power", false);
                yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Mundane, false);
                yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Minor, false);
                yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Medium, true);
                yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Major, true);
                yield return new TestCaseData(ItemTypes.Tool.ToString(), "fake power", false);
                yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Mundane, true);
                yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Minor, false);
                yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Medium, false);
                yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Major, false);
                yield return new TestCaseData(ItemTypes.Wand.ToString(), "fake power", false);
                yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Mundane, false);
                yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Minor, true);
                yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Medium, true);
                yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Major, true);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), "fake power", false);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Mundane, true);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Minor, true);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, true);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Major, true);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), "fake power", false);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Mundane, false);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Minor, true);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Medium, true);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Major, true);
            }
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
                    yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Mundane, alchemicalItem, true);

                    yield return new TestCaseData("Wrong Item Type", PowerConstants.Mundane, alchemicalItem, false);
                    //yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Mundane, alchemicalItem, false);
                    yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Mundane, alchemicalItem, false);
                    yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Mundane, alchemicalItem, false);
                    yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Mundane, alchemicalItem, false);
                    yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Mundane, alchemicalItem, false);
                    //yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Mundane, alchemicalItem, false);
                    yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Mundane, alchemicalItem, false);
                    yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Mundane, alchemicalItem, false);
                    //yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Mundane, alchemicalItem, false);
                    yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Mundane, alchemicalItem, false);
                    yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Mundane, alchemicalItem, false);

                    yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), "Wrong Power", alchemicalItem, false);
                    //yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Mundane, alchemicalItem, false);
                    yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Minor, alchemicalItem, false);
                    yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Medium, alchemicalItem, false);
                    yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Major, alchemicalItem, false);
                }

                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Mundane, "Wrong Item", false);
                //yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Mundane, AlchemicalItemConstants.Acid, false);
                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Mundane, ArmorConstants.AbsorbingShield, false);
                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Mundane, ArmorConstants.BandedMail, false);
                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Mundane, PotionConstants.Aid, false);
                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Mundane, RingConstants.AcidResistance_Greater, false);
                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Mundane, RodConstants.Absorption, false);
                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Mundane, StaffConstants.Abjuration, false);
                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Mundane, ToolConstants.ArtisansTools_Masterwork, false);
                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Mundane, WeaponConstants.Arrow, false);
                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Mundane, WeaponConstants.AssassinsDagger, false);
                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Mundane, WondrousItemConstants.AmuletOfHealth, false);

                var armors = ArmorConstants.GetAllArmorsAndShields(false);
                foreach (var armor in armors)
                {
                    yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Mundane, armor, true);
                    yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Minor, armor, true);
                    yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, armor, true);
                    yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Major, armor, true);

                    yield return new TestCaseData("Wrong Item Type", PowerConstants.Medium, armor, false);
                    yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Medium, armor, false);
                    //yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, armor, false);
                    yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium, armor, false);
                    yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Medium, armor, false);
                    yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Medium, armor, false);
                    //yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Medium, armor, false);
                    yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Medium, armor, false);
                    yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Medium, armor, false);
                    //yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Medium, armor, false);
                    yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, armor, false);
                    yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Medium, armor, false);

                    yield return new TestCaseData(ItemTypes.Armor.ToString(), "Wrong Power", armor, false);
                    //yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Mundane, armor, false);
                    //yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Minor, armor, false);
                    //yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, armor, false);
                    //yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Major, armor, false);
                }

                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, "Wrong Item", false);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, AlchemicalItemConstants.Acid, false);
                //yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, ArmorConstants.AbsorbingShield, false);
                //yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, ArmorConstants.BandedMail, false);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, PotionConstants.Aid, false);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, RingConstants.AcidResistance_Greater, false);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, RodConstants.Absorption, false);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, StaffConstants.Abjuration, false);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, ToolConstants.ArtisansTools_Masterwork, false);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, WeaponConstants.Arrow, false);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, WeaponConstants.AssassinsDagger, false);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, WondrousItemConstants.AmuletOfHealth, false);

                var specificArmors = ArmorConstants.GetAllSpecificArmorsAndShields();
                foreach (var armor in specificArmors)
                {
                    yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Minor, armor, true);
                    yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, armor, true);
                    yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, armor.ToLower(), true);
                    yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, armor.ToUpper(), true);
                    yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Major, armor, true);

                    yield return new TestCaseData("Wrong Item Type", PowerConstants.Medium, armor, false);
                    yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Medium, armor, false);
                    //yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, armor, false);
                    yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium, armor, false);
                    yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Medium, armor, false);
                    yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Medium, armor, false);
                    //yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Medium, armor, false);
                    yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Medium, armor, false);
                    yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Medium, armor, false);
                    //yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Medium, armor, false);
                    yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, armor, false);
                    yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Medium, armor, false);

                    yield return new TestCaseData(ItemTypes.Armor.ToString(), "Wrong Power", armor, false);
                    yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Mundane, armor, false);
                    yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Mundane, armor.ToLower(), false);
                    yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Mundane, armor.ToUpper(), false);
                    //yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Minor, armor, false);
                    //yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, armor, false);
                    //yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Major, armor, false);
                }

                var potions = PotionConstants.GetAllPotions(false);
                foreach (var potion in potions)
                {
                    yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Minor, potion, true);
                    yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium, potion, true);
                    yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Major, potion, true);

                    yield return new TestCaseData("Wrong Item Type", PowerConstants.Medium, potion, false);
                    yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Medium, potion, false);
                    yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, potion, false);
                    //yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium, potion, false);
                    yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Medium, potion, false);
                    yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Medium, potion, false);
                    //yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Medium, potion, false);
                    yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Medium, potion, false);
                    yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Medium, potion, false);
                    //yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Medium, potion, false);
                    yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, potion, false);
                    yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Medium, potion, false);

                    yield return new TestCaseData(ItemTypes.Potion.ToString(), "Wrong Power", potion, false);
                    yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Mundane, potion, false);
                    //yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Minor, potion, false);
                    //yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium, potion, false);
                    //yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Major, potion, false);
                }

                yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium, "Wrong Item", false);
                yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium, AlchemicalItemConstants.Acid, false);
                yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium, ArmorConstants.AbsorbingShield, false);
                yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium, ArmorConstants.BandedMail, false);
                //yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium, PotionConstants.Aid, false);
                yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium, RingConstants.AcidResistance_Greater, false);
                yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium, RodConstants.Absorption, false);
                yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium, StaffConstants.Abjuration, false);
                yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium, ToolConstants.ArtisansTools_Masterwork, false);
                yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium, WeaponConstants.Arrow, false);
                yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium, WeaponConstants.AssassinsDagger, false);
                yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium, WondrousItemConstants.AmuletOfHealth, false);

                var rings = RingConstants.GetAllRings();
                foreach (var ring in rings)
                {
                    yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Minor, ring, true);
                    yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Medium, ring, true);
                    yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Major, ring, true);

                    yield return new TestCaseData("Wrong Item Type", PowerConstants.Medium, ring, false);
                    yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Medium, ring, false);
                    yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, ring, false);
                    yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium, ring, false);
                    //yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Medium, ring, false);
                    yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Medium, ring, false);
                    //yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Medium, ring, false);
                    yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Medium, ring, false);
                    yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Medium, ring, false);
                    //yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Medium, ring, false);
                    yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, ring, false);
                    yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Medium, ring, false);

                    yield return new TestCaseData(ItemTypes.Ring.ToString(), "Wrong Power", ring, false);
                    yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Mundane, ring, false);
                    //yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Minor, ring, false);
                    //yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Medium, ring, false);
                    //yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Major, ring, false);
                }

                yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Medium, "Wrong Item", false);
                yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Medium, AlchemicalItemConstants.Acid, false);
                yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Medium, ArmorConstants.AbsorbingShield, false);
                yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Medium, ArmorConstants.BandedMail, false);
                yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Medium, PotionConstants.Aid, false);
                //yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Medium, RingConstants.AcidResistance_Greater, false);
                yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Medium, RodConstants.Absorption, false);
                yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Medium, StaffConstants.Abjuration, false);
                yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Medium, ToolConstants.ArtisansTools_Masterwork, false);
                yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Medium, WeaponConstants.Arrow, false);
                yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Medium, WeaponConstants.AssassinsDagger, false);
                yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Medium, WondrousItemConstants.AmuletOfHealth, false);

                var rods = RodConstants.GetAllRods();
                foreach (var rod in rods)
                {
                    yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Medium, rod, true);
                    yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Major, rod, true);

                    yield return new TestCaseData("Wrong Item Type", PowerConstants.Medium, rod, false);
                    yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Medium, rod, false);
                    yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, rod, false);
                    yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium, rod, false);
                    yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Medium, rod, false);
                    //yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Medium, rod, false);
                    //yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Medium, rod, false);
                    yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Medium, rod, false);
                    yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Medium, rod, false);
                    //yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Medium, rod, false);
                    yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, rod, false);
                    yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Medium, rod, false);

                    yield return new TestCaseData(ItemTypes.Rod.ToString(), "Wrong Power", rod, false);
                    yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Mundane, rod, false);
                    yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Minor, rod, false);
                    //yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Medium, rod, false);
                    //yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Major, rod, false);
                }

                yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Medium, "Wrong Item", false);
                yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Medium, AlchemicalItemConstants.Acid, false);
                yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Medium, ArmorConstants.AbsorbingShield, false);
                yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Medium, ArmorConstants.BandedMail, false);
                yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Medium, PotionConstants.Aid, false);
                yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Medium, RingConstants.AcidResistance_Greater, false);
                //yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Medium, RodConstants.Absorption, false);
                yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Medium, StaffConstants.Abjuration, false);
                yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Medium, ToolConstants.ArtisansTools_Masterwork, false);
                yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Medium, WeaponConstants.Arrow, false);
                yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Medium, WeaponConstants.AssassinsDagger, false);
                yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Medium, WondrousItemConstants.AmuletOfHealth, false);

                yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Minor, "My Scroll", true);
                yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Medium, "My Scroll", true);
                yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Major, "My Scroll", true);

                yield return new TestCaseData("Wrong Item Type", PowerConstants.Medium, "My Scroll", false);
                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Medium, "My Scroll", false);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, "My Scroll", false);
                yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium, "My Scroll", false);
                yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Medium, "My Scroll", false);
                yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Medium, "My Scroll", false);
                //yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Medium, "My Scroll", false);
                yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Medium, "My Scroll", false);
                yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Medium, "My Scroll", false);
                //yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Medium, "My Scroll", false);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, "My Scroll", false);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Medium, "My Scroll", false);

                yield return new TestCaseData(ItemTypes.Scroll.ToString(), "Wrong Power", "My Scroll", false);
                yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Mundane, "My Scroll", false);
                //yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Minor, "My Scroll", false);
                //yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Medium, "My Scroll", false);
                //yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Major, "My Scroll", false);

                //INFO: Because any name can be used for a scroll, other item names will always be valid
                //yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Medium, "Wrong Item", false);
                //yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Medium, AlchemicalItemConstants.Acid, false);
                //yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Medium, ArmorConstants.AbsorbingShield, false);
                //yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Medium, ArmorConstants.BandedMail, false);
                //yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Medium, PotionConstants.Aid, false);
                //yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Medium, RingConstants.AcidResistance_Greater, false);
                //yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Medium, RodConstants.Absorption, false);
                //yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Medium, StaffConstants.Abjuration, false);
                //yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Medium, ToolConstants.ArtisansTools_Masterwork, false);
                //yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Medium, WeaponConstants.Arrow, false);
                //yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Medium, WeaponConstants.AssassinsDagger, false);
                //yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Medium, WondrousItemConstants.AmuletOfHealth, false);

                var staffs = StaffConstants.GetAllStaffs();
                foreach (var staff in staffs)
                {
                    yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Medium, staff, true);
                    yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Major, staff, true);

                    yield return new TestCaseData("Wrong Item Type", PowerConstants.Medium, staff, false);
                    yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Medium, staff, false);
                    yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, staff, false);
                    yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium, staff, false);
                    yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Medium, staff, false);
                    yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Medium, staff, false);
                    //yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Medium, staff, false);
                    //yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Medium, staff, false);
                    yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Medium, staff, false);
                    //yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Medium, staff, false);
                    yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, staff, false);
                    yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Medium, staff, false);

                    yield return new TestCaseData(ItemTypes.Staff.ToString(), "Wrong Power", staff, false);
                    yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Mundane, staff, false);
                    yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Minor, staff, false);
                    //yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Medium, staff, false);
                    //yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Major, staff, false);
                }

                yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Medium, "Wrong Item", false);
                yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Medium, AlchemicalItemConstants.Acid, false);
                yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Medium, ArmorConstants.AbsorbingShield, false);
                yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Medium, ArmorConstants.BandedMail, false);
                yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Medium, PotionConstants.Aid, false);
                yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Medium, RingConstants.AcidResistance_Greater, false);
                yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Medium, RodConstants.Absorption, false);
                //yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Medium, StaffConstants.Abjuration, false);
                yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Medium, ToolConstants.ArtisansTools_Masterwork, false);
                yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Medium, WeaponConstants.Arrow, false);
                yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Medium, WeaponConstants.AssassinsDagger, false);
                yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Medium, WondrousItemConstants.AmuletOfHealth, false);

                var tools = ToolConstants.GetAllTools();
                foreach (var tool in tools)
                {
                    yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Mundane, tool, true);

                    yield return new TestCaseData("Wrong Item Type", PowerConstants.Mundane, tool, false);
                    yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Mundane, tool, false);
                    yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Mundane, tool, false);
                    yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Mundane, tool, false);
                    yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Mundane, tool, false);
                    yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Mundane, tool, false);
                    //yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Mundane, tool, false);
                    yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Mundane, tool, false);
                    //yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Mundane, tool, false);
                    //yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Mundane, tool, false);
                    yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Mundane, tool, false);
                    yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Mundane, tool, false);

                    yield return new TestCaseData(ItemTypes.Tool.ToString(), "Wrong Power", tool, false);
                    //yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Mundane, tool, false);
                    yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Minor, tool, false);
                    yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Medium, tool, false);
                    yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Major, tool, false);
                }

                yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Mundane, "Wrong Item", false);
                yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Mundane, AlchemicalItemConstants.Acid, false);
                yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Mundane, ArmorConstants.AbsorbingShield, false);
                yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Mundane, ArmorConstants.BandedMail, false);
                yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Mundane, PotionConstants.Aid, false);
                yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Mundane, RingConstants.AcidResistance_Greater, false);
                yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Mundane, RodConstants.Absorption, false);
                yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Mundane, StaffConstants.Abjuration, false);
                //yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Mundane, ToolConstants.ArtisansTools_Masterwork, false);
                yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Mundane, WeaponConstants.Arrow, false);
                yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Mundane, WeaponConstants.AssassinsDagger, false);
                yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Mundane, WondrousItemConstants.AmuletOfHealth, false);

                yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Minor, "My Wand", true);
                yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Medium, "My Wand", true);
                yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Major, "My Wand", true);

                yield return new TestCaseData("Wrong Item Type", PowerConstants.Medium, "My Wand", false);
                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Medium, "My Wand", false);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, "My Wand", false);
                yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium, "My Wand", false);
                yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Medium, "My Wand", false);
                yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Medium, "My Wand", false);
                //yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Medium, "My Wand", false);
                yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Medium, "My Wand", false);
                yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Medium, "My Wand", false);
                //yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Medium, "My Wand", false);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, "My Wand", false);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Medium, "My Wand", false);

                yield return new TestCaseData(ItemTypes.Wand.ToString(), "Wrong Power", "My Wand", false);
                yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Mundane, "My Wand", false);
                //yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Minor, "My Wand", false);
                //yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Medium, "My Wand", false);
                //yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Major, "My Wand", false);

                //INFO: Because any name can be used for a wand, other item names will always be valid
                //yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Medium, "Wrong Item", false);
                //yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Medium, AlchemicalItemConstants.Acid, false);
                //yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Medium, ArmorConstants.AbsorbingShield, false);
                //yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Medium, ArmorConstants.BandedMail, false);
                //yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Medium, PotionConstants.Aid, false);
                //yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Medium, RingConstants.AcidResistance_Greater, false);
                //yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Medium, RodConstants.Absorption, false);
                //yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Medium, StaffConstants.Abjuration, false);
                //yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Medium, ToolConstants.ArtisansTools_Masterwork, false);
                //yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Medium, WeaponConstants.Arrow, false);
                //yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Medium, WeaponConstants.AssassinsDagger, false);
                //yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Medium, WondrousItemConstants.AmuletOfHealth, false);

                var weapons = WeaponConstants.GetAllWeapons(false, false);
                foreach (var weapon in weapons)
                {
                    yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Mundane, weapon, true);
                    yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Minor, weapon, true);
                    yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, weapon, true);
                    yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Major, weapon, true);

                    yield return new TestCaseData("Wrong Item Type", PowerConstants.Medium, weapon, false);
                    yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Medium, weapon, false);
                    yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, weapon, false);
                    yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium, weapon, false);
                    yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Medium, weapon, false);
                    yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Medium, weapon, false);
                    //yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Medium, weapon, false);
                    yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Medium, weapon, false);
                    yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Medium, weapon, false);
                    //yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Medium, weapon, false);
                    //yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, weapon, false);
                    yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Medium, weapon, false);

                    yield return new TestCaseData(ItemTypes.Weapon.ToString(), "Wrong Power", weapon, false);
                    //yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Mundane, weapon, false);
                    //yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Minor, weapon, false);
                    //yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, weapon, false);
                    //yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Major, weapon, false);
                }

                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, "Wrong Item", false);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, AlchemicalItemConstants.Acid, false);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, ArmorConstants.AbsorbingShield, false);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, ArmorConstants.BandedMail, false);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, PotionConstants.Aid, false);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, RingConstants.AcidResistance_Greater, false);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, RodConstants.Absorption, false);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, StaffConstants.Abjuration, false);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, ToolConstants.ArtisansTools_Masterwork, false);
                //yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, WeaponConstants.Arrow, false);
                //yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, WeaponConstants.AssassinsDagger, false);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, WondrousItemConstants.AmuletOfHealth, false);

                var specificWeapons = WeaponConstants.GetAllSpecific().Except(WeaponConstants.GetAllTemplates());
                foreach (var weapon in specificWeapons)
                {
                    yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Minor, weapon, true);
                    yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, weapon, true);
                    yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, weapon.ToUpper(), true);
                    yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, weapon.ToLower(), true);
                    yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Major, weapon, true);

                    yield return new TestCaseData("Wrong Item Type", PowerConstants.Medium, weapon, false);
                    yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Medium, weapon, false);
                    yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, weapon, false);
                    yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium, weapon, false);
                    yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Medium, weapon, false);
                    yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Medium, weapon, false);
                    //yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Medium, weapon, false);
                    yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Medium, weapon, false);
                    yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Medium, weapon, false);
                    //yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Medium, weapon, false);
                    //yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, weapon, false);
                    yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Medium, weapon, false);

                    yield return new TestCaseData(ItemTypes.Weapon.ToString(), "Wrong Power", weapon, false);
                    yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Mundane, weapon, false);
                    yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Mundane, weapon.ToLower(), false);
                    yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Mundane, weapon.ToUpper(), false);
                    //yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Minor, weapon, false);
                    //yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, weapon, false);
                    //yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Major, weapon, false);
                }

                var wondrousItems = WondrousItemConstants.GetAllWondrousItems();
                foreach (var wondrousItem in wondrousItems)
                {
                    yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Minor, wondrousItem, true);
                    yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Medium, wondrousItem, true);
                    yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Major, wondrousItem, true);

                    yield return new TestCaseData("Wrong Item Type", PowerConstants.Medium, wondrousItem, false);
                    yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Medium, wondrousItem, false);
                    yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, wondrousItem, false);
                    yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium, wondrousItem, false);
                    yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Medium, wondrousItem, false);
                    yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Medium, wondrousItem, false);
                    //yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Medium, wondrousItem, false);
                    yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Medium, wondrousItem, false);
                    yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Medium, wondrousItem, false);
                    //yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Medium, wondrousItem, false);
                    yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, wondrousItem, false);
                    //yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Medium, wondrousItem, false);

                    yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), "Wrong Power", wondrousItem, false);
                    yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Mundane, wondrousItem, false);
                    //yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Minor, wondrousItem, false);
                    //yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Medium, wondrousItem, false);
                    //yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Major, wondrousItem, false);
                }

                yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Medium, "Wrong Item", false);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Medium, AlchemicalItemConstants.Acid, false);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Medium, ArmorConstants.AbsorbingShield, false);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Medium, ArmorConstants.BandedMail, false);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Medium, PotionConstants.Aid, false);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Medium, RingConstants.AcidResistance_Greater, false);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Medium, RodConstants.Absorption, false);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Medium, StaffConstants.Abjuration, false);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Medium, ToolConstants.ArtisansTools_Masterwork, false);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Medium, WeaponConstants.Arrow, false);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Medium, WeaponConstants.AssassinsDagger, false);
                //yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Medium, WondrousItemConstants.AmuletOfHealth, false);
            }
        }

        [TestCaseSource(nameof(ItemTypeValidationData))]
        public void GetValid_ReturnsValidItemType(string itemType, string power, string expectedItemType)
        {
            var result = ItemValidator.GetValid(itemType, power);
            Assert.That(result.Valid, Is.True);
            Assert.That(result.ItemType, Is.EqualTo(expectedItemType));
            Assert.That(result.Power, Is.EqualTo(power));
            Assert.That(result.Name, Is.Null);
        }

        public static IEnumerable ItemTypeValidationData
        {
            get
            {
                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Mundane, ItemTypeConstants.AlchemicalItem);
                yield return new TestCaseData(((int)ItemTypes.AlchemicalItem).ToString(), PowerConstants.Mundane, ItemTypeConstants.AlchemicalItem);
                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString().ToUpper(), PowerConstants.Mundane, ItemTypeConstants.AlchemicalItem);
                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString().ToLower(), PowerConstants.Mundane, ItemTypeConstants.AlchemicalItem);

                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, ItemTypeConstants.Armor);
                yield return new TestCaseData(((int)ItemTypes.Armor).ToString(), PowerConstants.Medium, ItemTypeConstants.Armor);
                yield return new TestCaseData(ItemTypes.Armor.ToString().ToUpper(), PowerConstants.Medium, ItemTypeConstants.Armor);
                yield return new TestCaseData(ItemTypes.Armor.ToString().ToLower(), PowerConstants.Medium, ItemTypeConstants.Armor);

                yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium, ItemTypeConstants.Potion);
                yield return new TestCaseData(((int)ItemTypes.Potion).ToString(), PowerConstants.Medium, ItemTypeConstants.Potion);
                yield return new TestCaseData(ItemTypes.Potion.ToString().ToUpper(), PowerConstants.Medium, ItemTypeConstants.Potion);
                yield return new TestCaseData(ItemTypes.Potion.ToString().ToLower(), PowerConstants.Medium, ItemTypeConstants.Potion);

                yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Medium, ItemTypeConstants.Ring);
                yield return new TestCaseData(((int)ItemTypes.Ring).ToString(), PowerConstants.Medium, ItemTypeConstants.Ring);
                yield return new TestCaseData(ItemTypes.Ring.ToString().ToUpper(), PowerConstants.Medium, ItemTypeConstants.Ring);
                yield return new TestCaseData(ItemTypes.Ring.ToString().ToLower(), PowerConstants.Medium, ItemTypeConstants.Ring);

                yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Medium, ItemTypeConstants.Rod);
                yield return new TestCaseData(((int)ItemTypes.Rod).ToString(), PowerConstants.Medium, ItemTypeConstants.Rod);
                yield return new TestCaseData(ItemTypes.Rod.ToString().ToUpper(), PowerConstants.Medium, ItemTypeConstants.Rod);
                yield return new TestCaseData(ItemTypes.Rod.ToString().ToLower(), PowerConstants.Medium, ItemTypeConstants.Rod);

                yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Medium, ItemTypeConstants.Scroll);
                yield return new TestCaseData(((int)ItemTypes.Scroll).ToString(), PowerConstants.Medium, ItemTypeConstants.Scroll);
                yield return new TestCaseData(ItemTypes.Scroll.ToString().ToUpper(), PowerConstants.Medium, ItemTypeConstants.Scroll);
                yield return new TestCaseData(ItemTypes.Scroll.ToString().ToLower(), PowerConstants.Medium, ItemTypeConstants.Scroll);

                yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Medium, ItemTypeConstants.Staff);
                yield return new TestCaseData(((int)ItemTypes.Staff).ToString(), PowerConstants.Medium, ItemTypeConstants.Staff);
                yield return new TestCaseData(ItemTypes.Staff.ToString().ToUpper(), PowerConstants.Medium, ItemTypeConstants.Staff);
                yield return new TestCaseData(ItemTypes.Staff.ToString().ToLower(), PowerConstants.Medium, ItemTypeConstants.Staff);

                yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Mundane, ItemTypeConstants.Tool);
                yield return new TestCaseData(((int)ItemTypes.Tool).ToString(), PowerConstants.Mundane, ItemTypeConstants.Tool);
                yield return new TestCaseData(ItemTypes.Tool.ToString().ToUpper(), PowerConstants.Mundane, ItemTypeConstants.Tool);
                yield return new TestCaseData(ItemTypes.Tool.ToString().ToLower(), PowerConstants.Mundane, ItemTypeConstants.Tool);

                yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Medium, ItemTypeConstants.Wand);
                yield return new TestCaseData(((int)ItemTypes.Wand).ToString(), PowerConstants.Medium, ItemTypeConstants.Wand);
                yield return new TestCaseData(ItemTypes.Wand.ToString().ToUpper(), PowerConstants.Medium, ItemTypeConstants.Wand);
                yield return new TestCaseData(ItemTypes.Wand.ToString().ToLower(), PowerConstants.Medium, ItemTypeConstants.Wand);

                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, ItemTypeConstants.Weapon);
                yield return new TestCaseData(((int)ItemTypes.Weapon).ToString(), PowerConstants.Medium, ItemTypeConstants.Weapon);
                yield return new TestCaseData(ItemTypes.Weapon.ToString().ToUpper(), PowerConstants.Medium, ItemTypeConstants.Weapon);
                yield return new TestCaseData(ItemTypes.Weapon.ToString().ToLower(), PowerConstants.Medium, ItemTypeConstants.Weapon);

                yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Medium, ItemTypeConstants.WondrousItem);
                yield return new TestCaseData(((int)ItemTypes.WondrousItem).ToString(), PowerConstants.Medium, ItemTypeConstants.WondrousItem);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString().ToUpper(), PowerConstants.Medium, ItemTypeConstants.WondrousItem);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString().ToLower(), PowerConstants.Medium, ItemTypeConstants.WondrousItem);
            }
        }

        [TestCaseSource(nameof(PowerValidationData))]
        public void GetValid_ReturnsValidPower(string itemType, string power, string expectedPower)
        {
            var result = ItemValidator.GetValid(itemType, power);
            Assert.That(result.Valid, Is.True);
            Assert.That(result.ItemType, Is.EqualTo(itemType));
            Assert.That(result.Power, Is.EqualTo(expectedPower));
            Assert.That(result.Name, Is.Null);
        }

        public static IEnumerable PowerValidationData
        {
            get
            {
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Mundane, PowerConstants.Mundane);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Mundane.ToUpper(), PowerConstants.Mundane);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Mundane.ToLower(), PowerConstants.Mundane);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Minor, PowerConstants.Minor);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Minor.ToUpper(), PowerConstants.Minor);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Minor.ToLower(), PowerConstants.Minor);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, PowerConstants.Medium);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium.ToUpper(), PowerConstants.Medium);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium.ToLower(), PowerConstants.Medium);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Major, PowerConstants.Major);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Major.ToUpper(), PowerConstants.Major);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Major.ToLower(), PowerConstants.Major);
            }
        }

        [TestCaseSource(nameof(NameValidationData))]
        public void GetValid_ReturnsValidItemName(string itemType, string power, string name, string expectedItemType, string expectedName)
        {
            var result = ItemValidator.GetValid(itemType, power, name);
            Assert.That(result.Valid, Is.True);
            Assert.That(result.ItemType, Is.EqualTo(expectedItemType));
            Assert.That(result.Power, Is.EqualTo(power));
            Assert.That(result.Name, Is.EqualTo(expectedName));
        }

        public static IEnumerable NameValidationData
        {
            get
            {
                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Mundane, null,
                    ItemTypeConstants.AlchemicalItem, null);
                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Mundane, AlchemicalItemConstants.Acid,
                    ItemTypeConstants.AlchemicalItem, AlchemicalItemConstants.Acid);
                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Mundane, AlchemicalItemConstants.Acid.ToUpper(),
                    ItemTypeConstants.AlchemicalItem, AlchemicalItemConstants.Acid);
                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Mundane, AlchemicalItemConstants.Acid.ToLower(),
                    ItemTypeConstants.AlchemicalItem, AlchemicalItemConstants.Acid);

                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, null,
                    ItemTypeConstants.Armor, null);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, ArmorConstants.BandedMail,
                    ItemTypeConstants.Armor, ArmorConstants.BandedMail);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, ArmorConstants.BandedMail.ToUpper(),
                    ItemTypeConstants.Armor, ArmorConstants.BandedMail);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, ArmorConstants.BandedMail.ToLower(),
                    ItemTypeConstants.Armor, ArmorConstants.BandedMail);

                yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium, null,
                    ItemTypeConstants.Potion, null);
                yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium, PotionConstants.Aid,
                    ItemTypeConstants.Potion, PotionConstants.Aid);
                yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium, PotionConstants.Aid.ToUpper(),
                    ItemTypeConstants.Potion, PotionConstants.Aid);
                yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium, PotionConstants.Aid.ToLower(),
                    ItemTypeConstants.Potion, PotionConstants.Aid);

                yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Medium, null,
                    ItemTypeConstants.Ring, null);
                yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Medium, RingConstants.AcidResistance_Greater,
                    ItemTypeConstants.Ring, RingConstants.AcidResistance_Greater);
                yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Medium, RingConstants.AcidResistance_Greater.ToUpper(),
                    ItemTypeConstants.Ring, RingConstants.AcidResistance_Greater);
                yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Medium, RingConstants.AcidResistance_Greater.ToLower(),
                    ItemTypeConstants.Ring, RingConstants.AcidResistance_Greater);

                yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Medium, null,
                    ItemTypeConstants.Rod, null);
                yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Medium, RodConstants.Absorption,
                    ItemTypeConstants.Rod, RodConstants.Absorption);
                yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Medium, RodConstants.Absorption.ToUpper(),
                    ItemTypeConstants.Rod, RodConstants.Absorption);
                yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Medium, RodConstants.Absorption.ToLower(),
                    ItemTypeConstants.Rod, RodConstants.Absorption);

                yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Medium, null,
                    ItemTypeConstants.Scroll, null);
                yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Medium, "Scroll of Spells",
                    ItemTypeConstants.Scroll, "Scroll of Spells");
                yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Medium, "Scroll of Spells".ToUpper(),
                    ItemTypeConstants.Scroll, "SCROLL OF SPELLS");
                yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Medium, "Scroll of Spells".ToLower(),
                    ItemTypeConstants.Scroll, "scroll of spells");

                yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Medium, null,
                    ItemTypeConstants.Staff, null);
                yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Medium, StaffConstants.Abjuration,
                    ItemTypeConstants.Staff, StaffConstants.Abjuration);
                yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Medium, StaffConstants.Abjuration.ToUpper(),
                    ItemTypeConstants.Staff, StaffConstants.Abjuration);
                yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Medium, StaffConstants.Abjuration.ToLower(),
                    ItemTypeConstants.Staff, StaffConstants.Abjuration);

                yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Mundane, null,
                    ItemTypeConstants.Tool, null);
                yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Mundane, ToolConstants.ArtisansTools_Masterwork,
                    ItemTypeConstants.Tool, ToolConstants.ArtisansTools_Masterwork);
                yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Mundane, ToolConstants.ArtisansTools_Masterwork.ToUpper(),
                    ItemTypeConstants.Tool, ToolConstants.ArtisansTools_Masterwork);
                yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Mundane, ToolConstants.ArtisansTools_Masterwork.ToLower(),
                    ItemTypeConstants.Tool, ToolConstants.ArtisansTools_Masterwork);

                yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Medium, null,
                    ItemTypeConstants.Wand, null);
                yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Medium, "Wand of Spell",
                    ItemTypeConstants.Wand, "Wand of Spell");
                yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Medium, "Wand of Spell".ToUpper(),
                    ItemTypeConstants.Wand, "WAND OF SPELL");
                yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Medium, "Wand of Spell".ToLower(),
                    ItemTypeConstants.Wand, "wand of spell");

                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, null,
                    ItemTypeConstants.Weapon, null);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, WeaponConstants.Arrow,
                    ItemTypeConstants.Weapon, WeaponConstants.Arrow);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, WeaponConstants.Arrow.ToUpper(),
                    ItemTypeConstants.Weapon, WeaponConstants.Arrow);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, WeaponConstants.Arrow.ToLower(),
                    ItemTypeConstants.Weapon, WeaponConstants.Arrow);

                yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Medium, null,
                    ItemTypeConstants.WondrousItem, null);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Medium, WondrousItemConstants.AmuletOfHealth,
                    ItemTypeConstants.WondrousItem, WondrousItemConstants.AmuletOfHealth);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Medium, WondrousItemConstants.AmuletOfHealth.ToUpper(),
                    ItemTypeConstants.WondrousItem, WondrousItemConstants.AmuletOfHealth);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Medium, WondrousItemConstants.AmuletOfHealth.ToLower(),
                    ItemTypeConstants.WondrousItem, WondrousItemConstants.AmuletOfHealth);
            }
        }

        [TestCase("AlchemicalItem", "MUNDANE", null,
            ItemTypeConstants.AlchemicalItem, PowerConstants.Mundane, null)]
        [TestCase("wondrousitem", "Minor", "BAG OF HOLDING TYPE IV",
            ItemTypeConstants.WondrousItem, PowerConstants.Minor, WondrousItemConstants.BagOfHolding_IV)]
        [TestCase("WEAPON", "medium", "Halberd",
            ItemTypeConstants.Weapon, PowerConstants.Medium, WeaponConstants.Halberd)]
        [TestCase("1", "MAJOR", "full plate",
            ItemTypeConstants.Armor, PowerConstants.Major, ArmorConstants.FullPlate)]
        public void GetValid_ReturnsAllValidParameters(string itemType, string power, string name, string expectedItemType, string expectedPower, string expectedName)
        {
            var result = ItemValidator.GetValid(itemType, power, name);
            Assert.That(result.Valid, Is.True);
            Assert.That(result.ItemType, Is.EqualTo(expectedItemType));
            Assert.That(result.Power, Is.EqualTo(expectedPower));
            Assert.That(result.Name, Is.EqualTo(expectedName));
        }
    }
}
