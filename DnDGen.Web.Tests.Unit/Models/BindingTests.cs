using CharacterGen;
using CharacterGen.Abilities.Feats;
using CharacterGen.Abilities.Skills;
using CharacterGen.Abilities.Stats;
using CharacterGen.Magics;
using DungeonGen;
using EncounterGen.Common;
using Newtonsoft.Json;
using NUnit.Framework;
using System;
using System.IO;
using System.Text.RegularExpressions;
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
            AssertJsonCorrect(treasure, "treasure");
        }

        private void AssertJsonCorrect(object source, string fileTarget)
        {
            var serialized = JsonConvert.SerializeObject(source);

            var path = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "..", "..", "Scripts", "mocks", $"{fileTarget}.json");
            var target = File.ReadAllText(path);
            //INFO: Removes whitespace from the file.  Whitespace is there for readability in file, but breaks the equality assertion
            target = Regex.Replace(target, @"\s+", "");
            target = target.Replace(@"""Full"":""""", @"""Full"":"" """);

            Assert.That(target, Is.EqualTo(serialized));
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
            var stat = new Stat(string.Empty);
            var skill = new Skill(string.Empty, stat, 0);
            AssertJsonCorrect(skill, "skill");
        }

        [Test]
        public void StatBinding()
        {
            var stat = new Stat(string.Empty);
            AssertJsonCorrect(stat, "stat");
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
