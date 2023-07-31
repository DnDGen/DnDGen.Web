using DnDGen.Api.TreasureGen.Validators;
using DnDGen.TreasureGen.Items;

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
        public void Validate_ReturnsValidity(string itemType, string power, bool valid)
        {
            var isValid = ItemValidator.Validate(itemType, power);
            Assert.That(isValid, Is.EqualTo(valid));
        }
    }
}
