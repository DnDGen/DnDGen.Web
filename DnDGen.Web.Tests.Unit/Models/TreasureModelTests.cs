using DnDGen.Web.Models;
using NUnit.Framework;
using System.Linq;
using TreasureGen.Items;

namespace DnDGen.Web.Tests.Unit.Models
{
    [TestFixture]
    public class TreasureModelTests
    {
        private TreasureViewModel model;

        [SetUp]
        public void Setup()
        {
            model = new TreasureViewModel();
        }

        [Test]
        public void IndexHasMaxLevel()
        {
            Assert.That(model.MaxTreasureLevel, Is.EqualTo(30));
        }

        [TestCase(ItemTypeConstants.AlchemicalItem,
            PowerConstants.Mundane)]
        [TestCase(ItemTypeConstants.Armor,
            PowerConstants.Mundane,
            PowerConstants.Minor,
            PowerConstants.Medium,
            PowerConstants.Major)]
        [TestCase(ItemTypeConstants.Potion,
            PowerConstants.Minor,
            PowerConstants.Medium,
            PowerConstants.Major)]
        [TestCase(ItemTypeConstants.Ring,
            PowerConstants.Minor,
            PowerConstants.Medium,
            PowerConstants.Major)]
        [TestCase(ItemTypeConstants.Rod,
            PowerConstants.Medium,
            PowerConstants.Major)]
        [TestCase(ItemTypeConstants.Scroll,
            PowerConstants.Minor,
            PowerConstants.Medium,
            PowerConstants.Major)]
        [TestCase(ItemTypeConstants.Staff,
            PowerConstants.Medium,
            PowerConstants.Major)]
        [TestCase(ItemTypeConstants.Tool,
            PowerConstants.Mundane)]
        [TestCase(ItemTypeConstants.Wand,
            PowerConstants.Minor,
            PowerConstants.Medium,
            PowerConstants.Major)]
        [TestCase(ItemTypeConstants.Weapon,
            PowerConstants.Mundane,
            PowerConstants.Minor,
            PowerConstants.Medium,
            PowerConstants.Major)]
        [TestCase(ItemTypeConstants.WondrousItem,
            PowerConstants.Minor,
            PowerConstants.Medium,
            PowerConstants.Major)]
        public void IndexHasItemPowers(string itemType, params string[] powers)
        {
            Assert.That(model.ItemPowers.Keys, Contains.Item(itemType));
            Assert.That(model.ItemPowers[itemType], Is.EquivalentTo(powers));
        }

        [Test]
        public void IndexHasAllItemTypesInItemPowers()
        {
            Assert.That(model.ItemPowers.Count, Is.EqualTo(11));
        }

        [Test]
        public void IndexHasTreasureTypes()
        {
            Assert.That(model.TreasureTypes, Contains.Item("Treasure"));
            Assert.That(model.TreasureTypes, Contains.Item("Coin"));
            Assert.That(model.TreasureTypes, Contains.Item("Goods"));
            Assert.That(model.TreasureTypes, Contains.Item("Items"));
            Assert.That(model.TreasureTypes.Count(), Is.EqualTo(4));
        }
    }
}