using DnDGen.Api.TreasureGen.Models.Legacy;

namespace DnDGen.Api.TreasureGen.Tests.Unit.Models.Legacy
{
    public class WeaponV1Tests
    {
        private WeaponV1 weapon;

        [SetUp]
        public void Setup()
        {
            weapon = new WeaponV1
            {
                Name = "Test Weapon",
            };
        }

        [Test]
        public void DamageDescription_IsDamageSummary()
        {
            weapon.Damages = [new() { Roll = "92d66", Type = "emotional" }, new() { Roll = "90d210", Type = "psychic", Condition = "sometimes" }];
            Assert.That(weapon.DamageDescription, Is.EqualTo(weapon.DamageSummary).And.EqualTo("92d66 emotional + 90d210 psychic (sometimes)"));
        }

        [Test]
        public void CriticalDamageDescription_IsCriticalDamageSummary()
        {
            weapon.CriticalDamages = [new() { Roll = "92d66", Type = "emotional" }, new() { Roll = "90d210", Type = "psychic", Condition = "sometimes" }];
            Assert.That(weapon.CriticalDamageDescription, Is.EqualTo(weapon.CriticalDamageSummary).And.EqualTo("92d66 emotional + 90d210 psychic (sometimes)"));
        }

        [Test]
        public void SecondaryDamageDescription_IsSecondaryDamageSummary()
        {
            weapon.SecondaryDamages = [new() { Roll = "92d66", Type = "emotional" }, new() { Roll = "90d210", Type = "psychic", Condition = "sometimes" }];
            Assert.That(weapon.SecondaryDamageDescription, Is.EqualTo(weapon.SecondaryDamageSummary).And.EqualTo("92d66 emotional + 90d210 psychic (sometimes)"));
        }

        [Test]
        public void SecondaryCriticalDamageDescription_IsSecondaryCriticalDamageSummary()
        {
            weapon.SecondaryCriticalDamages = [new() { Roll = "92d66", Type = "emotional" }, new() { Roll = "90d210", Type = "psychic", Condition = "sometimes" }];
            Assert.That(weapon.SecondaryCriticalDamageDescription, Is.EqualTo(weapon.SecondaryCriticalDamageSummary)
                .And.EqualTo("92d66 emotional + 90d210 psychic (sometimes)"));
        }

        [Test]
        public void ThreatRangeDescription_IsThreatRangeSummary()
        {
            weapon.ThreatRange = 3;
            Assert.That(weapon.ThreatRangeDescription, Is.EqualTo(weapon.ThreatRangeSummary).And.EqualTo("18-20"));
        }
    }
}
