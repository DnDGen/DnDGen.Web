using DnDGen.CharacterGen.Skills;

namespace DnDGen.Api.EncounterGen.Helpers
{
    public static class CharacterHelper
    {
        public static IEnumerable<Skill> SortSkills(IEnumerable<Skill> skills)
        {
            return skills.OrderBy(s => s.Name).ThenBy(s => s.Focus);
        }
    }
}