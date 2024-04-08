using DnDGen.CharacterGen.Skills;
using System.Collections.Generic;
using System.Linq;

namespace DnDGen.Api.CharacterGen.Helpers
{
    public static class CharacterHelper
    {
        public static IEnumerable<Skill> SortSkills(IEnumerable<Skill> skills)
        {
            return skills.OrderBy(s => s.Name).ThenBy(s => s.Focus);
        }
    }
}