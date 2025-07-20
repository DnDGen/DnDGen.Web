using DnDGen.Api.TreasureGen.Models.Legacy;
using DnDGen.TreasureGen.Items;

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

        [Test]
        public void FromWeapon_ReturnsWeaponV1()
        {
            var weapon = new Weapon
            {
                Ammunition = "arrows",
                Attributes = ["keen", "vorpal"],
                BaseNames = ["longsword", "greatsword"],
                Contents = ["a small amount of blood", "a wand and a rabbit"],
                CriticalDamages = [
                    new() { Roll = "1d8", Type = "slashing", Condition = "whenever" },
                    new() { Roll = "2d7", Type = "piercing", Condition = "sometimes" }],
                CriticalMultiplier = "x2",
                Damages = [new() { Roll = "1d10", Type = "bludgeoning", Condition = "occasionally" }, new() { Roll = "2d9", Type = "emotional", Condition = "often" }],
                IsMagical = true,
                ItemType = "weapon",
                Magic = new()
                {
                    Bonus = 12,
                    Charges = 4,
                    Curse = "cursed with bad luck",
                    Intelligence = new()
                    {
                        Alignment = "neutral",
                        CharismaStat = 15,
                        Communication = ["telepathy", "speech"],
                        DedicatedPower = "detect magic",
                        Ego = 6,
                        IntelligenceStat = 18,
                        Languages = ["Common", "Elvish"],
                        Personality = "curious",
                        Powers = ["light", "fireball"],
                        SpecialPurpose = "protect the wielder",
                        Senses = "darkvision, truesight",
                        WisdomStat = 14,
                    },
                    SpecialAbilities =
                    [
                        new()
                        {
                            Name = "Super Flaming",
                            AttributeRequirements = ["Dexterity 13"],
                            BaseName = "flaming",
                            BonusEquivalent = 5,
                            CriticalDamages = [
                                new() { Roll = "2d6", Type = "fire", Condition = "usually" },
                                new() { Roll = "3d5", Type = "electric", Condition = "rarely" }],
                            Damages = [new() { Roll = "1d6", Type = "sonic", Condition = "almost never" }, new() { Roll = "2d5", Type = "ice", Condition = "always" }],
                            Power = 7,
                        },
                        new()
                        {
                            Name = "Super Awesome",
                            AttributeRequirements = ["Wisdom 14"],
                            BaseName = "awesome",
                            BonusEquivalent = 8,
                            CriticalDamages = [new() { Roll = "3d5", Type = "acid", Condition = "50/50" }, new() { Roll = "4d4", Type = "air", Condition = "blue moon" }],
                            Damages = [new() { Roll = "2d5", Type = "earth", Condition = "pigs fly" }, new() { Roll = "3d4", Type = "water", Condition = "right now" }],
                            Power = 9,
                        },
                    ],
                },
                Name = "Test Weapon",
                Quantity = 10,
                SecondaryCriticalDamages = [new() { Roll = "1d6", Type = "cold", Condition = "manchmal" }, new() { Roll = "2d4", Type = "force", Condition = "in myth" }],
                SecondaryCriticalMultiplier = "x3",
                SecondaryDamages = [new() { Roll = "1d8", Type = "lightning", Condition = "seldom" }, new() { Roll = "2d6", Type = "psychic", Condition = "already did" }],
                SecondaryHasAbilities = true,
                SecondaryMagicBonus = 11,
                Size = "large",
                ThreatRange = 3,
                Traits = ["versatile", "finesse"],
            };

            var weaponV1 = WeaponV1.From(weapon);
            Assert.That(weaponV1, Is.Not.Null);
            using (Assert.EnterMultipleScope())
            {
                Assert.That(weaponV1.Name, Is.EqualTo("Test Weapon"));
                Assert.That(weaponV1.SecondaryHasAbilities, Is.True);
                Assert.That(weaponV1.IsMagical, Is.True);
                Assert.That(weaponV1.Ammunition, Is.EqualTo("arrows"));
                Assert.That(weaponV1.Attributes, Is.EqualTo(["keen", "vorpal"]));
                Assert.That(weaponV1.BaseNames, Is.EqualTo(["longsword", "greatsword"]));
                Assert.That(weaponV1.Contents, Is.EqualTo(["a small amount of blood", "a wand and a rabbit"]));
                Assert.That(weaponV1.CriticalMultiplier, Is.EqualTo("x2"));
                Assert.That(weaponV1.SecondaryCriticalMultiplier, Is.EqualTo("x3"));
                Assert.That(weaponV1.Damages, Has.Count.EqualTo(2));
                Assert.That(weaponV1.Damages[0].Roll, Is.EqualTo("1d8"));
                Assert.That(weaponV1.Damages[0].Type, Is.EqualTo("slashing"));
                Assert.That(weaponV1.Damages[0].Condition, Is.EqualTo("whenever"));
                Assert.That(weaponV1.Damages[1].Roll, Is.EqualTo("2d7"));
                Assert.That(weaponV1.Damages[1].Type, Is.EqualTo("piercing"));
                Assert.That(weaponV1.Damages[1].Condition, Is.EqualTo("sometimes"));
                Assert.That(weaponV1.CriticalDamages, Has.Count.EqualTo(2));
                Assert.That(weaponV1.CriticalDamages[0].Roll, Is.EqualTo("1d10"));
                Assert.That(weaponV1.CriticalDamages[0].Type, Is.EqualTo("bludgeoning"));
                Assert.That(weaponV1.CriticalDamages[0].Condition, Is.EqualTo("occasionally"));
                Assert.That(weaponV1.CriticalDamages[1].Roll, Is.EqualTo("2d9"));
                Assert.That(weaponV1.CriticalDamages[1].Type, Is.EqualTo("emotional"));
                Assert.That(weaponV1.CriticalDamages[1].Condition, Is.EqualTo("often"));
                Assert.That(weaponV1.SecondaryDamages, Has.Count.EqualTo(2));
                Assert.That(weaponV1.SecondaryDamages[0].Roll, Is.EqualTo("1d8"));
                Assert.That(weaponV1.SecondaryDamages[0].Type, Is.EqualTo("lightning"));
                Assert.That(weaponV1.SecondaryDamages[0].Condition, Is.EqualTo("seldom"));
                Assert.That(weaponV1.SecondaryDamages[1].Roll, Is.EqualTo("2d6"));
                Assert.That(weaponV1.SecondaryDamages[1].Type, Is.EqualTo("psychic"));
                Assert.That(weaponV1.SecondaryDamages[1].Condition, Is.EqualTo("already did"));
                Assert.That(weaponV1.SecondaryCriticalDamages, Has.Count.EqualTo(2));
                Assert.That(weaponV1.SecondaryCriticalDamages[0].Roll, Is.EqualTo("1d6"));
                Assert.That(weaponV1.SecondaryCriticalDamages[0].Type, Is.EqualTo("cold"));
                Assert.That(weaponV1.SecondaryCriticalDamages[0].Condition, Is.EqualTo("manchmal"));
                Assert.That(weaponV1.SecondaryCriticalDamages[1].Roll, Is.EqualTo("2d4"));
                Assert.That(weaponV1.SecondaryCriticalDamages[1].Type, Is.EqualTo("force"));
                Assert.That(weaponV1.SecondaryCriticalDamages[1].Condition, Is.EqualTo("in myth"));
                Assert.That(weaponV1.ItemType, Is.EqualTo("weapon"));
                Assert.That(weaponV1.Magic.Bonus, Is.EqualTo(12));
                Assert.That(weaponV1.Magic.Charges, Is.EqualTo(4));
                Assert.That(weaponV1.Magic.Curse, Is.EqualTo("cursed with bad luck"));
                Assert.That(weaponV1.Magic.Intelligence.Alignment, Is.EqualTo("neutral"));
                Assert.That(weaponV1.Magic.Intelligence.CharismaStat, Is.EqualTo(15));
                Assert.That(weaponV1.Magic.Intelligence.Communication, Is.EqualTo(["telepathy", "speech"]));
                Assert.That(weaponV1.Magic.Intelligence.DedicatedPower, Is.EqualTo("neutral"));
                Assert.That(weaponV1.Magic.Intelligence.Alignment, Is.EqualTo("neutral"));
                Assert.That(weaponV1.Magic.Intelligence.Alignment, Is.EqualTo("neutral"));
                Assert.That(weaponV1.Magic.Intelligence.Alignment, Is.EqualTo("neutral"));
                Assert.That(weaponV1.Magic.Intelligence.Alignment, Is.EqualTo("neutral"));
                Assert.That(weaponV1.Magic.Intelligence.Alignment, Is.EqualTo("neutral"));
                Assert.That(weaponV1.Magic.Intelligence.Alignment, Is.EqualTo("neutral"));
                Assert.That(weaponV1.Magic.Intelligence.Alignment, Is.EqualTo("neutral"));
                Assert.That(weaponV1.Magic.Intelligence.Alignment, Is.EqualTo("neutral"));
                Assert.Fail("assert item intelligence");
                Assert.Fail("assert item special abilities");
                Assert.That(weaponV1.Quantity, Is.EqualTo(10));
                Assert.That(weaponV1.SecondaryMagicBonus, Is.EqualTo(11));
                Assert.That(weaponV1.Size, Is.EqualTo("large"));
                Assert.That(weaponV1.ThreatRange, Is.EqualTo(3));
                Assert.That(weaponV1.Traits, Is.EqualTo(["versatile", "finesse"]));
            }
        }
    }
}
