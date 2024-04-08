using DnDGen.Api.CharacterGen.Helpers;
using DnDGen.CharacterGen.Abilities;
using DnDGen.CharacterGen.Skills;

namespace DnDGen.Api.CharacterGen.Tests.Unit.Helpers
{
    [TestFixture]
    public class CharacterHelperTests
    {
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
