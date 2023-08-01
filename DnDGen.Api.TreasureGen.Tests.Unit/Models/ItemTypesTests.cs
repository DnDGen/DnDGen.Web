using DnDGen.Api.TreasureGen.Helpers;
using DnDGen.Api.TreasureGen.Models;
using DnDGen.TreasureGen.Items;

namespace DnDGen.Api.TreasureGen.Tests.Unit.Models
{
    public class ItemTypesTests
    {
        [TestCase(ItemTypes.AlchemicalItem, ItemTypeConstants.AlchemicalItem)]
        [TestCase(ItemTypes.Armor, ItemTypeConstants.Armor)]
        [TestCase(ItemTypes.Potion, ItemTypeConstants.Potion)]
        [TestCase(ItemTypes.Ring, ItemTypeConstants.Ring)]
        [TestCase(ItemTypes.Rod, ItemTypeConstants.Rod)]
        [TestCase(ItemTypes.Scroll, ItemTypeConstants.Scroll)]
        [TestCase(ItemTypes.Staff, ItemTypeConstants.Staff)]
        [TestCase(ItemTypes.Tool, ItemTypeConstants.Tool)]
        [TestCase(ItemTypes.Wand, ItemTypeConstants.Wand)]
        [TestCase(ItemTypes.Weapon, ItemTypeConstants.Weapon)]
        [TestCase(ItemTypes.WondrousItem, ItemTypeConstants.WondrousItem)]
        public void EnumHasCorrectDescription(ItemTypes enumValue, string constantValue)
        {
            var description = EnumHelper.GetDescription(enumValue);
            Assert.That(description, Is.EqualTo(constantValue));
        }
    }
}
