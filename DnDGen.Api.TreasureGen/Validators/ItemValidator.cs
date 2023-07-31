using DnDGen.TreasureGen.Items;
using System.Collections.Generic;
using System.Linq;

namespace DnDGen.Api.TreasureGen.Validators
{
    public static class ItemValidator
    {
        private static Dictionary<string, IEnumerable<string>> GetPowers()
        {
            var powers = new Dictionary<string, IEnumerable<string>>();
            powers[ItemTypeConstants.AlchemicalItem] = new[]
            {
                PowerConstants.Mundane
            };

            powers[ItemTypeConstants.Armor] = new[]
            {
                PowerConstants.Mundane,
                PowerConstants.Minor,
                PowerConstants.Medium,
                PowerConstants.Major
            };

            powers[ItemTypeConstants.Potion] = new[]
            {
                PowerConstants.Minor,
                PowerConstants.Medium,
                PowerConstants.Major
            };

            powers[ItemTypeConstants.Ring] = new[]
            {
                PowerConstants.Minor,
                PowerConstants.Medium,
                PowerConstants.Major
            };

            powers[ItemTypeConstants.Rod] = new[]
            {
                PowerConstants.Medium,
                PowerConstants.Major
            };

            powers[ItemTypeConstants.Scroll] = new[]
            {
                PowerConstants.Minor,
                PowerConstants.Medium,
                PowerConstants.Major
            };

            powers[ItemTypeConstants.Staff] = new[]
            {
                PowerConstants.Medium,
                PowerConstants.Major
            };

            powers[ItemTypeConstants.Tool] = new[]
            {
                PowerConstants.Mundane
            };

            powers[ItemTypeConstants.Wand] = new[]
            {
                PowerConstants.Minor,
                PowerConstants.Medium,
                PowerConstants.Major
            };

            powers[ItemTypeConstants.Weapon] = new[]
            {
                PowerConstants.Mundane,
                PowerConstants.Minor,
                PowerConstants.Medium,
                PowerConstants.Major
            };

            powers[ItemTypeConstants.WondrousItem] = new[]
            {
                PowerConstants.Minor,
                PowerConstants.Medium,
                PowerConstants.Major
            };

            return powers;
        }

        public static bool Validate(string itemType, string power)
        {
            var powers = GetPowers();

            return powers.ContainsKey(itemType) && powers[itemType].Contains(power);
        }
    }
}
