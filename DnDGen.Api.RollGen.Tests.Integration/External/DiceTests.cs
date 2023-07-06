using DnDGen.RollGen;

namespace DnDGen.Api.RollGen.Tests.Integration.External
{
    public class DiceTests : IntegrationTests
    {
        private Dice dice;

        [SetUp]
        public void Setup()
        {
            dice = GetDependency<Dice>();
        }

        [TestCase(1, -1, false)]
        [TestCase(-1, 1, false)]
        [TestCase(1, 10_000, true)]
        [TestCase(1, 10_001, false)]
        [TestCase(10_000, 1, true)]
        [TestCase(10_001, 1, false)]
        [TestCase(10_000, 10_000, true)]
        [TestCase(10_001, 10_000, false)]
        [TestCase(10_001, 10_001, false)]
        [TestCase(16_500_000, 1, false)]
        [TestCase(16_500_001, 1, false)]
        public void BUG_IsValid_HandlesQuantityAndDie(int quantity, int die, bool valid)
        {
            var isValid = dice.Roll(quantity).d(die).IsValid();
            Assert.That(isValid, Is.EqualTo(valid));
        }
    }
}
