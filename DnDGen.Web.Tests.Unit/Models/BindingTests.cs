using CharacterGen;
using CharacterGen.Abilities.Feats;
using CharacterGen.Abilities.Skills;
using CharacterGen.Abilities.Stats;
using CharacterGen.Magics;
using DungeonGen;
using EncounterGen.Common;
using NUnit.Framework;
using System.Collections.Generic;
using TreasureGen;
using TreasureGen.Goods;
using TreasureGen.Items;
using TreasureGen.Items.Magical;

namespace DnDGen.Web.Tests.Unit.Models
{
    [TestFixture]
    public class BindingTests
    {
        [Test]
        public void TreasureBinding()
        {
            var treasure = new Treasure();
            Assert.That(treasure.Coin.Currency, Is.InstanceOf<string>());
            Assert.That(treasure.Coin.Quantity, Is.InstanceOf<int>());
            Assert.That(treasure.Goods, Is.InstanceOf<IEnumerable<Good>>());
            Assert.That(treasure.Items, Is.InstanceOf<IEnumerable<Item>>());
        }

        [Test]
        public void GoodBinding()
        {
            var good = new Good();
            Assert.That(good.Description, Is.InstanceOf<string>());
            Assert.That(good.ValueInGold, Is.InstanceOf<int>());
        }

        [Test]
        public void ItemBinding()
        {
            var item = new Item();
            Assert.That(item.Contents, Is.InstanceOf<IEnumerable<string>>());
            Assert.That(item.IsMagical, Is.InstanceOf<bool>());
            Assert.That(item.Magic.Bonus, Is.InstanceOf<int>());
            Assert.That(item.Magic.Charges, Is.InstanceOf<int>());
            Assert.That(item.Magic.Curse, Is.InstanceOf<string>());
            Assert.That(item.Magic.Intelligence.Alignment, Is.InstanceOf<string>());
            Assert.That(item.Magic.Intelligence.CharismaStat, Is.InstanceOf<int>());
            Assert.That(item.Magic.Intelligence.Communication, Is.InstanceOf<IEnumerable<string>>());
            Assert.That(item.Magic.Intelligence.DedicatedPower, Is.InstanceOf<string>());
            Assert.That(item.Magic.Intelligence.Ego, Is.InstanceOf<int>());
            Assert.That(item.Magic.Intelligence.IntelligenceStat, Is.InstanceOf<int>());
            Assert.That(item.Magic.Intelligence.Languages, Is.InstanceOf<IEnumerable<string>>());
            Assert.That(item.Magic.Intelligence.Personality, Is.InstanceOf<string>());
            Assert.That(item.Magic.Intelligence.Powers, Is.InstanceOf<IEnumerable<string>>());
            Assert.That(item.Magic.Intelligence.Senses, Is.InstanceOf<string>());
            Assert.That(item.Magic.Intelligence.SpecialPurpose, Is.InstanceOf<string>());
            Assert.That(item.Magic.Intelligence.WisdomStat, Is.InstanceOf<int>());
            Assert.That(item.Magic.SpecialAbilities, Is.InstanceOf<IEnumerable<SpecialAbility>>());
            Assert.That(item.Name, Is.InstanceOf<string>());
            Assert.That(item.Quantity, Is.InstanceOf<int>());
            Assert.That(item.Traits, Is.InstanceOf<IEnumerable<string>>());
        }

        [Test]
        public void SpecialAbilityBinding()
        {
            var specialAbility = new SpecialAbility();
            Assert.That(specialAbility.Name, Is.InstanceOf<string>());
        }

        [Test]
        public void CharacterBinding()
        {
            var character = new Character();
            Assert.That(character.Ability.Feats, Is.InstanceOf<IEnumerable<Feat>>());
            Assert.That(character.Ability.Languages, Is.InstanceOf<IEnumerable<string>>());
            Assert.That(character.Ability.Skills, Is.InstanceOf<Dictionary<string, Skill>>());
            Assert.That(character.Ability.Stats, Is.InstanceOf<Dictionary<string, Stat>>());
            Assert.That(character.Alignment.Full, Is.InstanceOf<string>());
            Assert.That(character.Class.Level, Is.InstanceOf<int>());
            Assert.That(character.Class.Name, Is.InstanceOf<string>());
            Assert.That(character.Class.ProhibitedFields, Is.InstanceOf<IEnumerable<string>>());
            Assert.That(character.Class.SpecialistFields, Is.InstanceOf<IEnumerable<string>>());
            Assert.That(character.Combat.AdjustedDexterityBonus, Is.InstanceOf<int>());
            Assert.That(character.Combat.ArmorClass.CircumstantialBonus, Is.InstanceOf<bool>());
            Assert.That(character.Combat.ArmorClass.FlatFooted, Is.InstanceOf<int>());
            Assert.That(character.Combat.ArmorClass.Full, Is.InstanceOf<int>());
            Assert.That(character.Combat.ArmorClass.Touch, Is.InstanceOf<int>());
            Assert.That(character.Combat.BaseAttack.AllMeleeBonuses, Is.InstanceOf<IEnumerable<int>>());
            Assert.That(character.Combat.BaseAttack.AllRangedBonuses, Is.InstanceOf<IEnumerable<int>>());
            Assert.That(character.Combat.BaseAttack.CircumstantialBonus, Is.InstanceOf<bool>());
            Assert.That(character.Combat.HitPoints, Is.InstanceOf<int>());
            Assert.That(character.Combat.InitiativeBonus, Is.InstanceOf<int>());
            Assert.That(character.Combat.SavingThrows.CircumstantialBonus, Is.InstanceOf<bool>());
            Assert.That(character.Combat.SavingThrows.Fortitude, Is.InstanceOf<int>());
            Assert.That(character.Combat.SavingThrows.Reflex, Is.InstanceOf<int>());
            Assert.That(character.Combat.SavingThrows.Will, Is.InstanceOf<int>());

            //HACK: Ignoring these assertions, have not found a good way to assert types of null values
            //Assert.That(character.Equipment.Armor, Is.TypeOf<Item>());
            //Assert.That(character.Equipment.OffHand, Is.TypeOf<Item>());
            //Assert.That(character.Equipment.PrimaryHand, Is.TypeOf<Item>());

            Assert.That(character.Equipment.Treasure, Is.InstanceOf<Treasure>());
            Assert.That(character.InterestingTrait, Is.InstanceOf<string>());
            Assert.That(character.IsLeader, Is.InstanceOf<bool>());
            Assert.That(character.Magic.Animal, Is.InstanceOf<string>());
            Assert.That(character.Magic.ArcaneSpellFailure, Is.InstanceOf<int>());
            Assert.That(character.Magic.KnownSpells, Is.InstanceOf<IEnumerable<Spell>>());
            Assert.That(character.Magic.PreparedSpells, Is.InstanceOf<IEnumerable<Spell>>());
            Assert.That(character.Magic.SpellsPerDay, Is.InstanceOf<IEnumerable<SpellQuantity>>());
            Assert.That(character.Race.AerialSpeed, Is.InstanceOf<int>());
            Assert.That(character.Race.Age.Stage, Is.InstanceOf<string>());
            Assert.That(character.Race.Age.Years, Is.InstanceOf<int>());
            Assert.That(character.Race.BaseRace, Is.InstanceOf<string>());
            Assert.That(character.Race.Gender, Is.InstanceOf<string>());
            Assert.That(character.Race.HasWings, Is.InstanceOf<bool>());
            Assert.That(character.Race.HeightInInches, Is.InstanceOf<int>());
            Assert.That(character.Race.LandSpeed, Is.InstanceOf<int>());
            Assert.That(character.Race.Metarace, Is.InstanceOf<string>());
            Assert.That(character.Race.MetaraceSpecies, Is.InstanceOf<string>());
            Assert.That(character.Race.Size, Is.InstanceOf<string>());
            Assert.That(character.Race.WeightInPounds, Is.InstanceOf<int>());
        }

        [Test]
        public void FeatBinding()
        {
            var feat = new Feat();
            Assert.That(feat.Foci, Is.InstanceOf<IEnumerable<string>>());
            Assert.That(feat.Frequency.Quantity, Is.InstanceOf<int>());
            Assert.That(feat.Frequency.TimePeriod, Is.InstanceOf<string>());
            Assert.That(feat.Name, Is.InstanceOf<string>());
            Assert.That(feat.Power, Is.InstanceOf<int>());
        }

        [Test]
        public void SkillBinding()
        {
            var stat = new Stat(string.Empty);
            var skill = new Skill(string.Empty, stat, 0);
            Assert.That(skill.ArmorCheckPenalty, Is.InstanceOf<int>());

            //HACK: Ignoring, as can't assert type of null value
            //Assert.That(skill.BaseStat, Is.InstanceOf<Stat>());

            Assert.That(skill.Bonus, Is.InstanceOf<int>());
            Assert.That(skill.CircumstantialBonus, Is.InstanceOf<bool>());
            Assert.That(skill.ClassSkill, Is.InstanceOf<bool>());
            Assert.That(skill.EffectiveRanks, Is.InstanceOf<double>());
            Assert.That(skill.Ranks, Is.InstanceOf<int>());
        }

        [Test]
        public void StatBinding()
        {
            var stat = new Stat(string.Empty);
            Assert.That(stat.Bonus, Is.InstanceOf<int>());
            Assert.That(stat.Value, Is.InstanceOf<int>());
        }

        [Test]
        public void SpellBinding()
        {
            var spell = new Spell();
            Assert.That(spell.Level, Is.InstanceOf<int>());
            Assert.That(spell.Metamagic, Is.InstanceOf<IEnumerable<string>>());
            Assert.That(spell.Name, Is.InstanceOf<string>());
        }

        [Test]
        public void SpellQuantityBinding()
        {
            var spellQuantity = new SpellQuantity();
            Assert.That(spellQuantity.HasDomainSpell, Is.InstanceOf<bool>());
            Assert.That(spellQuantity.Level, Is.InstanceOf<int>());
            Assert.That(spellQuantity.Quantity, Is.InstanceOf<int>());
        }

        [Test]
        public void LeadershipBinding()
        {
            var leadership = new Leadership();
            Assert.That(leadership.CohortScore, Is.InstanceOf<int>());
            Assert.That(leadership.FollowerQuantities.Level1, Is.InstanceOf<int>());
            Assert.That(leadership.FollowerQuantities.Level2, Is.InstanceOf<int>());
            Assert.That(leadership.FollowerQuantities.Level3, Is.InstanceOf<int>());
            Assert.That(leadership.FollowerQuantities.Level4, Is.InstanceOf<int>());
            Assert.That(leadership.FollowerQuantities.Level5, Is.InstanceOf<int>());
            Assert.That(leadership.FollowerQuantities.Level6, Is.InstanceOf<int>());
            Assert.That(leadership.LeadershipModifiers, Is.InstanceOf<IEnumerable<string>>());
            Assert.That(leadership.Score, Is.InstanceOf<int>());
        }

        [Test]
        public void EncounterBinding()
        {
            var encounter = new Encounter();
            Assert.That(encounter.Characters, Is.InstanceOf<IEnumerable<Character>>());
            Assert.That(encounter.Creatures, Is.InstanceOf<IEnumerable<Creature>>());
            Assert.That(encounter.Treasures, Is.InstanceOf<IEnumerable<Treasure>>());
        }

        [Test]
        public void CreatureBinding()
        {
            var creature = new Creature();
            Assert.That(creature.Description, Is.InstanceOf<string>());
            Assert.That(creature.Name, Is.InstanceOf<string>());
            Assert.That(creature.Quantity, Is.InstanceOf<int>());
        }

        [Test]
        public void DungeonAreaBinding()
        {
            var area = new Area();
            Assert.That(area.Contents.Encounters, Is.InstanceOf<IEnumerable<Encounter>>());
            Assert.That(area.Contents.IsEmpty, Is.InstanceOf<bool>());
            Assert.That(area.Contents.Miscellaneous, Is.InstanceOf<IEnumerable<string>>());

            //HACK: Ignoring, as can't assert type of null value
            //Assert.That(area.Contents.Pool, Is.InstanceOf<Pool>());

            Assert.That(area.Contents.Traps, Is.InstanceOf<IEnumerable<Trap>>());
            Assert.That(area.Contents.Treasures, Is.InstanceOf<IEnumerable<DungeonTreasure>>());
            Assert.That(area.Descriptions, Is.InstanceOf<IEnumerable<string>>());
            Assert.That(area.Length, Is.InstanceOf<int>());
            Assert.That(area.Type, Is.InstanceOf<string>());
            Assert.That(area.Width, Is.InstanceOf<int>());
        }

        [Test]
        public void PoolBinding()
        {
            var pool = new Pool();

            //Hack: ignoring, as can't assert type of null value
            //Assert.That(pool.Encounter, Is.InstanceOf<Encounter>());

            Assert.That(pool.MagicPower, Is.InstanceOf<string>());

            //HACK: ignoring, as can't assert type of null value
            //Assert.That(pool.Treasure, Is.InstanceOf<DungeonTreasure>());
        }

        [Test]
        public void TrapBinding()
        {
            var trap = new Trap();
            Assert.That(trap.ChallengeRating, Is.InstanceOf<int>());
            Assert.That(trap.Name, Is.InstanceOf<string>());
            Assert.That(trap.DisableDeviceDC, Is.InstanceOf<int>());
            Assert.That(trap.SearchDC, Is.InstanceOf<int>());
            Assert.That(trap.Descriptions, Is.InstanceOf<IEnumerable<string>>());
        }

        [Test]
        public void DungeonTreasureBinding()
        {
            var dungeonTreasure = new DungeonTreasure();
            Assert.That(dungeonTreasure.Concealment, Is.InstanceOf<string>());
            Assert.That(dungeonTreasure.Container, Is.InstanceOf<string>());
            Assert.That(dungeonTreasure.Treasure, Is.InstanceOf<Treasure>());
        }
    }
}
