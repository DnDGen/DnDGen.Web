using CharacterGen.Abilities;
using CharacterGen.Characters;
using CharacterGen.Feats;
using CharacterGen.Leaders;
using CharacterGen.Magics;
using CharacterGen.Skills;
using DungeonGen;
using EncounterGen.Common;
using EncounterGen.Generators;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using NUnit.Framework;
using System;
using System.IO;
using System.Linq;
using TreasureGen;
using TreasureGen.Goods;
using TreasureGen.Items;
using TreasureGen.Items.Magical;

namespace DnDGen.Web.Tests.Unit.Models
{
    //INFO: These tests aren't as useful anymore
    //Web references outdated Nuget packages, so models from the APIs are different
    //Also, API models won't be referenced directly in C# code, so this structure might not be relevant
    //We will see once all packages are up-to-date
    [TestFixture]
    public class BindingTests
    {
        [Test]
        public void TreasureBinding()
        {
            var treasure = new Treasure();
            AssertJsonCorrect(treasure, "treasure");
        }

        private void AssertJsonCorrect<T>(T source, string fileTarget)
        {
            var expected = JsonConvert.SerializeObject(source);

            var path = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "..", "..", "..", "wwwroot", "mocks", $"{fileTarget}.json");
            var actual = File.ReadAllText(path);

            Assert.That(new JValue(actual).ToArray(), Is.EquivalentTo(new JValue(expected).ToArray()));
        }

        [Test]
        public void GoodBinding()
        {
            var good = new Good();
            AssertJsonCorrect(good, "good");
        }

        [Test]
        public void ItemBinding()
        {
            var item = new Item();
            AssertJsonCorrect(item, "item");
        }

        [Test]
        public void ArmorBinding()
        {
            var armor = new Armor();
            AssertJsonCorrect(armor, "armor");
        }

        [Test]
        public void WeaponBinding()
        {
            var weapon = new Weapon();
            AssertJsonCorrect(weapon, "weapon");
        }

        [Test]
        public void SpecialAbilityBinding()
        {
            var specialAbility = new SpecialAbility();
            AssertJsonCorrect(specialAbility, "specialAbility");
        }

        [Test]
        public void CharacterBinding()
        {
            var character = new Character();
            AssertJsonCorrect(character, "character");
        }

        [Test]
        public void FeatBinding()
        {
            var feat = new Feat();
            AssertJsonCorrect(feat, "feat");
        }

        [Test]
        public void SkillBinding()
        {
            var ability = new Ability(string.Empty);
            var skill = new Skill(string.Empty, ability, 0);
            AssertJsonCorrect(skill, "skill");
        }

        [Test]
        public void AbilityBinding()
        {
            var ability = new Ability(string.Empty);
            AssertJsonCorrect(ability, "ability");
        }

        [Test]
        public void SpellBinding()
        {
            var spell = new Spell();
            AssertJsonCorrect(spell, "spell");
        }

        [Test]
        public void SpellQuantityBinding()
        {
            var spellQuantity = new SpellQuantity();
            AssertJsonCorrect(spellQuantity, "spellQuantity");
        }

        [Test]
        public void LeadershipBinding()
        {
            var leadership = new Leadership();
            AssertJsonCorrect(leadership, "leadership");
        }

        [Test]
        public void EncounterBinding()
        {
            var encounter = new Encounter();
            AssertJsonCorrect(encounter, "encounter");
        }

        [Test]
        public void EncounterSpecificationBinding()
        {
            var encounterSpecifications = new EncounterSpecifications();
            AssertJsonCorrect(encounterSpecifications, "encounterSpecifications");
        }

        [Test]
        public void CreatureBinding()
        {
            var creature = new Creature();
            AssertJsonCorrect(creature, "creature");
        }

        [Test]
        public void DungeonAreaBinding()
        {
            var area = new Area();
            AssertJsonCorrect(area, "area");
        }

        [Test]
        public void PoolBinding()
        {
            var pool = new Pool();
            AssertJsonCorrect(pool, "pool");
        }

        [Test]
        public void TrapBinding()
        {
            var trap = new Trap();
            AssertJsonCorrect(trap, "trap");
        }

        [Test]
        public void DungeonTreasureBinding()
        {
            var dungeonTreasure = new DungeonTreasure();
            AssertJsonCorrect(dungeonTreasure, "dungeonTreasure");
        }
    }
}
