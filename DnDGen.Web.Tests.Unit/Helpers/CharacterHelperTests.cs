using CharacterGen.Abilities;
using CharacterGen.Characters;
using CharacterGen.Skills;
using DnDGen.Web.Helpers;
using NUnit.Framework;
using System.Linq;

namespace DnDGen.Web.Tests.Unit.Helpers
{
    [TestFixture]
    public class CharacterHelperTests
    {
        [Test]
        public void BUG_OrderAssertionWorks()
        {
            var strings = new[]
            {
                "aaaa",
                "kkkk",
                "zzzz",
            };

            Assert.That(strings, Is.Ordered);
        }

        [Test]
        public void BUG_OrderAssertionOfObjectWorks()
        {
            var characters = new[]
            {
                new Character { InterestingTrait = "aaaa" },
                new Character { InterestingTrait = "kkkk" },
                new Character { InterestingTrait = "zzzz" },
            };

            Assert.That(characters, Is.Ordered.By("InterestingTrait"));
        }

        [Test]
        public void BUG_OrderAssertionOfSkillNamesWorks()
        {
            var ability = new Ability("ability name");

            var skillNames = new[]
            {
                new Skill("aaaa", ability, int.MaxValue).Name,
                new Skill("kkkk", ability, int.MaxValue).Name,
                new Skill("zzzz", ability, int.MaxValue).Name,
            };

            Assert.That(skillNames, Is.All.Not.Null);
            Assert.That(skillNames, Contains.Item("aaaa"));
            Assert.That(skillNames, Contains.Item("kkkk"));
            Assert.That(skillNames, Contains.Item("zzzz"));
            Assert.That(skillNames, Is.Ordered);
        }

        [Test]
        public void BUG_OrderAssertionOfSkillsWorks()
        {
            var ability = new Ability("ability name");

            var skills = new[]
            {
                new Skill("aaaa", ability, int.MaxValue),
                new Skill("kkkk", ability, int.MaxValue),
                new Skill("zzzz", ability, int.MaxValue),
            };

            Assert.That(skills, Is.All.Not.Null);

            var skillNames = skills.Select(s => s.Name);
            Assert.That(skillNames, Is.All.Not.Null);
            Assert.That(skillNames, Contains.Item("aaaa"));
            Assert.That(skillNames, Contains.Item("kkkk"));
            Assert.That(skillNames, Contains.Item("zzzz"));

            Assert.That(skills, Is.Ordered.By("Name"));
        }

        [Test]
        public void BUG_OrderAssertionOfSkillsWithRanksWorks()
        {
            var skills = new[]
            {
                new Skill("aaaa", new Ability(string.Empty), 123456) { Ranks = 600 },
                new Skill("kkkk", new Ability(string.Empty), 123456) { Ranks = 1337 },
                new Skill("zzzz", new Ability(string.Empty), 123456) { Ranks = 42 },
            };

            Assert.That(skills, Is.Ordered.By("Name"));
        }

        [Test]
        public void SortBySkillName()
        {
            var skills = new[]
            {
                new Skill("zzzz", new Ability(string.Empty), 123456) { Ranks = 42 },
                new Skill("aaaa", new Ability(string.Empty), 123456) { Ranks = 600 },
                new Skill("kkkk", new Ability(string.Empty), 123456) { Ranks = 1337 },
            };

            var sortedSkills = CharacterHelper.SortSkills(skills);
            Assert.That(sortedSkills, Is.Ordered.By("Name"));
        }

        [Test]
        public void SortBySkillNameAndFocus()
        {
            var skills = new[]
            {
                new Skill("aaaa", new Ability(string.Empty), 123456, "ccccc") { Ranks = 600 },
                new Skill("aaaa", new Ability(string.Empty), 123456, "bbbbb") { Ranks = 1234 },
            };

            var sortedSkills = CharacterHelper.SortSkills(skills);
            Assert.That(sortedSkills, Is.Ordered.By("Focus"));
        }

        [Test]
        public void SortByMixOfSkillNameAndFocus()
        {
            var skills = new[]
            {
                new Skill("zzzz", new Ability(string.Empty), 123456) { Ranks = 42 },
                new Skill("aaaa", new Ability(string.Empty), 123456, "ccccc") { Ranks = 600 },
                new Skill("aaaa", new Ability(string.Empty), 123456, "bbbbb") { Ranks = 1234 },
                new Skill("kkkk", new Ability(string.Empty), 123456) { Ranks = 1337 },
            };

            var sortedSkills = CharacterHelper.SortSkills(skills);
            Assert.That(sortedSkills, Is.Ordered.By("Name").Then.By("Focus"));
        }
    }
}
