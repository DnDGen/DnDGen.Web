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
                    new() { Roll = "92d66", Type = "slashing", Condition = "whenever" },
                    new() { Roll = "90d210", Type = "piercing", Condition = "sometimes" }],
                CriticalMultiplier = "x42",
                Damages = [new() { Roll = "1d600", Type = "bludgeoning", Condition = "occasionally" }, new() { Roll = "13d37", Type = "emotional", Condition = "often" }],
                IsMagical = true,
                ItemType = "weapon",
                Magic = new()
                {
                    Bonus = 1336,
                    Charges = 96,
                    Curse = "cursed with bad luck",
                    Intelligence = new()
                    {
                        Alignment = "neutral",
                        CharismaStat = 783,
                        Communication = ["telepathy", "speech"],
                        DedicatedPower = "detect magic",
                        Ego = 8245,
                        IntelligenceStat = 9,
                        Languages = ["Common", "Elvish"],
                        Personality = "curious",
                        Powers = ["light", "fireball"],
                        SpecialPurpose = "protect the wielder",
                        Senses = "darkvision, truesight",
                        WisdomStat = 22,
                    },
                    SpecialAbilities =
                    [
                        new()
                        {
                            Name = "Super Flaming",
                            AttributeRequirements = ["cannot be spherical", "shouldn't be red"],
                            BaseName = "flaming",
                            BonusEquivalent = 2022,
                            CriticalDamages = [
                                new() { Roll = "2d27", Type = "fire", Condition = "usually" },
                                new() { Roll = "2d12", Type = "electric", Condition = "rarely" }],
                            Damages = [new() { Roll = "20d25", Type = "sonic", Condition = "almost never" }, new() { Roll = "1d11", Type = "ice", Condition = "always" }],
                            Power = 10,
                        },
                        new()
                        {
                            Name = "Super Awesome",
                            AttributeRequirements = ["must be conical", "should be blue"],
                            BaseName = "awesome",
                            BonusEquivalent = 2015,
                            CriticalDamages = [
                                new() { Roll = "12d34", Type = "acid", Condition = "50/50" },
                                new() { Roll = "23d45", Type = "air", Condition = "blue moon" }],
                            Damages = [new() { Roll = "34d56", Type = "earth", Condition = "pigs fly" }, new() { Roll = "45d67", Type = "water", Condition = "right now" }],
                            Power = 5678,
                        },
                    ],
                },
                Name = "Test Weapon",
                Quantity = 6789,
                SecondaryCriticalDamages = [
                    new() { Roll = "78d90", Type = "cold", Condition = "manchmal" },
                    new() { Roll = "89d12", Type = "force", Condition = "in myth" }],
                SecondaryCriticalMultiplier = "x9012",
                SecondaryDamages = [new() { Roll = "1d23", Type = "lightning", Condition = "seldom" }, new() { Roll = "2d34", Type = "psychic", Condition = "already did" }],
                SecondaryHasAbilities = true,
                SecondaryMagicBonus = 345,
                Size = "large",
                ThreatRange = 456,
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
                Assert.That(weaponV1.CriticalMultiplier, Is.EqualTo("x42"));
                Assert.That(weaponV1.SecondaryCriticalMultiplier, Is.EqualTo("x9012"));
                Assert.That(weaponV1.Damages, Has.Count.EqualTo(2));
                Assert.That(weaponV1.Damages[0].Roll, Is.EqualTo("1d600"));
                Assert.That(weaponV1.Damages[0].Type, Is.EqualTo("bludgeoning"));
                Assert.That(weaponV1.Damages[0].Condition, Is.EqualTo("occasionally"));
                Assert.That(weaponV1.Damages[1].Roll, Is.EqualTo("13d37"));
                Assert.That(weaponV1.Damages[1].Type, Is.EqualTo("emotional"));
                Assert.That(weaponV1.Damages[1].Condition, Is.EqualTo("often"));
                Assert.That(weaponV1.CriticalDamages, Has.Count.EqualTo(2));
                Assert.That(weaponV1.CriticalDamages[0].Roll, Is.EqualTo("92d66"));
                Assert.That(weaponV1.CriticalDamages[0].Type, Is.EqualTo("slashing"));
                Assert.That(weaponV1.CriticalDamages[0].Condition, Is.EqualTo("whenever"));
                Assert.That(weaponV1.CriticalDamages[1].Roll, Is.EqualTo("90d210"));
                Assert.That(weaponV1.CriticalDamages[1].Type, Is.EqualTo("piercing"));
                Assert.That(weaponV1.CriticalDamages[1].Condition, Is.EqualTo("sometimes"));
                Assert.That(weaponV1.SecondaryDamages, Has.Count.EqualTo(2));
                Assert.That(weaponV1.SecondaryDamages[0].Roll, Is.EqualTo("1d23"));
                Assert.That(weaponV1.SecondaryDamages[0].Type, Is.EqualTo("lightning"));
                Assert.That(weaponV1.SecondaryDamages[0].Condition, Is.EqualTo("seldom"));
                Assert.That(weaponV1.SecondaryDamages[1].Roll, Is.EqualTo("2d34"));
                Assert.That(weaponV1.SecondaryDamages[1].Type, Is.EqualTo("psychic"));
                Assert.That(weaponV1.SecondaryDamages[1].Condition, Is.EqualTo("already did"));
                Assert.That(weaponV1.SecondaryCriticalDamages, Has.Count.EqualTo(2));
                Assert.That(weaponV1.SecondaryCriticalDamages[0].Roll, Is.EqualTo("78d90"));
                Assert.That(weaponV1.SecondaryCriticalDamages[0].Type, Is.EqualTo("cold"));
                Assert.That(weaponV1.SecondaryCriticalDamages[0].Condition, Is.EqualTo("manchmal"));
                Assert.That(weaponV1.SecondaryCriticalDamages[1].Roll, Is.EqualTo("89d12"));
                Assert.That(weaponV1.SecondaryCriticalDamages[1].Type, Is.EqualTo("force"));
                Assert.That(weaponV1.SecondaryCriticalDamages[1].Condition, Is.EqualTo("in myth"));
                Assert.That(weaponV1.ItemType, Is.EqualTo("weapon"));
                Assert.That(weaponV1.Magic.Bonus, Is.EqualTo(1336));
                Assert.That(weaponV1.Magic.Charges, Is.EqualTo(96));
                Assert.That(weaponV1.Magic.Curse, Is.EqualTo("cursed with bad luck"));
                Assert.That(weaponV1.Magic.Intelligence.Alignment, Is.EqualTo("neutral"));
                Assert.That(weaponV1.Magic.Intelligence.CharismaStat, Is.EqualTo(783));
                Assert.That(weaponV1.Magic.Intelligence.Communication, Is.EqualTo(["telepathy", "speech"]));
                Assert.That(weaponV1.Magic.Intelligence.DedicatedPower, Is.EqualTo("detect magic"));
                Assert.That(weaponV1.Magic.Intelligence.Ego, Is.EqualTo(8245));
                Assert.That(weaponV1.Magic.Intelligence.IntelligenceStat, Is.EqualTo(9));
                Assert.That(weaponV1.Magic.Intelligence.Languages, Is.EqualTo(["Common", "Elvish"]));
                Assert.That(weaponV1.Magic.Intelligence.Personality, Is.EqualTo("curious"));
                Assert.That(weaponV1.Magic.Intelligence.Powers, Is.EqualTo(["light", "fireball"]));
                Assert.That(weaponV1.Magic.Intelligence.Senses, Is.EqualTo("darkvision, truesight"));
                Assert.That(weaponV1.Magic.Intelligence.SpecialPurpose, Is.EqualTo("protect the wielder"));
                Assert.That(weaponV1.Magic.Intelligence.WisdomStat, Is.EqualTo(22));
                Assert.That(weaponV1.Quantity, Is.EqualTo(6789));
                Assert.That(weaponV1.SecondaryMagicBonus, Is.EqualTo(345));
                Assert.That(weaponV1.Size, Is.EqualTo("large"));
                Assert.That(weaponV1.ThreatRange, Is.EqualTo(456));
                Assert.That(weaponV1.Traits, Is.EqualTo(["versatile", "finesse"]));

                var specialAbilities = weaponV1.Magic.SpecialAbilities.ToArray();
                Assert.That(specialAbilities, Has.Length.EqualTo(2));
                Assert.That(specialAbilities[0].AttributeRequirements, Is.EqualTo(["cannot be spherical", "shouldn't be red"]));
                Assert.That(specialAbilities[0].BaseName, Is.EqualTo("flaming"));
                Assert.That(specialAbilities[0].BonusEquivalent, Is.EqualTo(2022));
                Assert.That(specialAbilities[0].Damages, Has.Count.EqualTo(2));
                Assert.That(specialAbilities[0].Damages[0].Roll, Is.EqualTo("20d25"));
                Assert.That(specialAbilities[0].Damages[0].Type, Is.EqualTo("sonic"));
                Assert.That(specialAbilities[0].Damages[0].Condition, Is.EqualTo("almost never"));
                Assert.That(specialAbilities[0].Damages[1].Roll, Is.EqualTo("1d11"));
                Assert.That(specialAbilities[0].Damages[1].Type, Is.EqualTo("ice"));
                Assert.That(specialAbilities[0].Damages[1].Condition, Is.EqualTo("always"));
                Assert.That(specialAbilities[0].CriticalDamages, Has.Count.EqualTo(2));
                Assert.That(specialAbilities[0].CriticalDamages[0].Roll, Is.EqualTo("2d27"));
                Assert.That(specialAbilities[0].CriticalDamages[0].Type, Is.EqualTo("fire"));
                Assert.That(specialAbilities[0].CriticalDamages[0].Condition, Is.EqualTo("usually"));
                Assert.That(specialAbilities[0].CriticalDamages[1].Roll, Is.EqualTo("2d12"));
                Assert.That(specialAbilities[0].CriticalDamages[1].Type, Is.EqualTo("electric"));
                Assert.That(specialAbilities[0].CriticalDamages[1].Condition, Is.EqualTo("rarely"));
                Assert.That(specialAbilities[0].Name, Is.EqualTo("Super Flaming"));
                Assert.That(specialAbilities[0].Power, Is.EqualTo(10));
                Assert.That(specialAbilities[1].AttributeRequirements, Is.EqualTo(["must be conical", "should be blue"]));
                Assert.That(specialAbilities[1].BaseName, Is.EqualTo("awesome"));
                Assert.That(specialAbilities[1].BonusEquivalent, Is.EqualTo(2015));
                Assert.That(specialAbilities[1].Damages, Has.Count.EqualTo(2));
                Assert.That(specialAbilities[1].Damages[0].Roll, Is.EqualTo("34d56"));
                Assert.That(specialAbilities[1].Damages[0].Type, Is.EqualTo("earth"));
                Assert.That(specialAbilities[1].Damages[0].Condition, Is.EqualTo("pigs fly"));
                Assert.That(specialAbilities[1].Damages[1].Roll, Is.EqualTo("45d67"));
                Assert.That(specialAbilities[1].Damages[1].Type, Is.EqualTo("water"));
                Assert.That(specialAbilities[1].Damages[1].Condition, Is.EqualTo("right now"));
                Assert.That(specialAbilities[1].CriticalDamages, Has.Count.EqualTo(2));
                Assert.That(specialAbilities[1].CriticalDamages[0].Roll, Is.EqualTo("12d34"));
                Assert.That(specialAbilities[1].CriticalDamages[0].Type, Is.EqualTo("acid"));
                Assert.That(specialAbilities[1].CriticalDamages[0].Condition, Is.EqualTo("50/50"));
                Assert.That(specialAbilities[1].CriticalDamages[1].Roll, Is.EqualTo("23d45"));
                Assert.That(specialAbilities[1].CriticalDamages[1].Type, Is.EqualTo("air"));
                Assert.That(specialAbilities[1].CriticalDamages[1].Condition, Is.EqualTo("blue moon"));
                Assert.That(specialAbilities[1].Name, Is.EqualTo("Super Awesome"));
                Assert.That(specialAbilities[1].Power, Is.EqualTo(5678));
            }
        }
    }
}
