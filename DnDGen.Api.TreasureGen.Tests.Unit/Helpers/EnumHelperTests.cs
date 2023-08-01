using DnDGen.Api.TreasureGen.Helpers;
using DnDGen.Api.TreasureGen.Models;

namespace DnDGen.Api.TreasureGen.Tests.Unit.Helpers
{
    public class EnumHelperTests
    {
        [Test]
        public void GetDescription_ReturnsDescription()
        {
            var description = EnumHelper.GetDescription(ItemTypes.AlchemicalItem);
            Assert.That(description, Is.EqualTo("Alchemical Item"));
        }

        [Test]
        public void GetDescription_ReturnsEnumValue()
        {
            var description = EnumHelper.GetDescription(TreasureTypes.Treasure);
            Assert.That(description, Is.EqualTo("Treasure"));
        }
    }
}
