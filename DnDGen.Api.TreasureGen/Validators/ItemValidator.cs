using DnDGen.Api.TreasureGen.Helpers;
using DnDGen.Api.TreasureGen.Models;
using DnDGen.TreasureGen.Items;
using DnDGen.TreasureGen.Items.Magical;
using DnDGen.TreasureGen.Items.Mundane;
using System;
using System.Collections.Generic;
using System.Linq;

namespace DnDGen.Api.TreasureGen.Validators
{
    public static class ItemValidator
    {
        private static IEnumerable<string> Powers => [PowerConstants.Mundane, PowerConstants.Minor, PowerConstants.Medium, PowerConstants.Major];

        private static Dictionary<string, IEnumerable<string>> GetPowers() => new()
        {
            [ItemTypeConstants.AlchemicalItem] = [PowerConstants.Mundane],
            [ItemTypeConstants.Armor] = [PowerConstants.Mundane, PowerConstants.Minor, PowerConstants.Medium, PowerConstants.Major],
            [ItemTypeConstants.Potion] = [PowerConstants.Minor, PowerConstants.Medium, PowerConstants.Major],
            [ItemTypeConstants.Ring] = [PowerConstants.Minor, PowerConstants.Medium, PowerConstants.Major],
            [ItemTypeConstants.Rod] = [PowerConstants.Medium, PowerConstants.Major],
            [ItemTypeConstants.Scroll] = [PowerConstants.Minor, PowerConstants.Medium, PowerConstants.Major],
            [ItemTypeConstants.Staff] = [PowerConstants.Medium, PowerConstants.Major],
            [ItemTypeConstants.Tool] = [PowerConstants.Mundane],
            [ItemTypeConstants.Wand] = [PowerConstants.Minor, PowerConstants.Medium, PowerConstants.Major],
            [ItemTypeConstants.Weapon] = [PowerConstants.Mundane, PowerConstants.Minor, PowerConstants.Medium, PowerConstants.Major],
            [ItemTypeConstants.WondrousItem] = [PowerConstants.Minor, PowerConstants.Medium, PowerConstants.Major]
        };

        private static bool Validate(string itemType, string power)
        {
            var powers = GetPowers();

            return powers.ContainsKey(itemType) && powers[itemType].Contains(power);
        }

        private static IEnumerable<string> GetItemNames(string itemType, string power, string name)
        {
            switch (itemType)
            {
                case ItemTypeConstants.AlchemicalItem: return AlchemicalItemConstants.GetAllAlchemicalItems();
                case ItemTypeConstants.Armor:
                    var specificArmors = ArmorConstants.GetAllSpecificArmorsAndShields();
                    if (specificArmors.Select(n => n.ToLower()).Contains(name.ToLower()) && power == PowerConstants.Mundane)
                        return [];

                    return ArmorConstants.GetAllArmorsAndShields(true);
                case ItemTypeConstants.Potion: return PotionConstants.GetAllPotions(false);
                case ItemTypeConstants.Ring: return RingConstants.GetAllRings();
                case ItemTypeConstants.Rod: return RodConstants.GetAllRods();
                case ItemTypeConstants.Scroll: return [name];
                case ItemTypeConstants.Staff: return StaffConstants.GetAllStaffs();
                case ItemTypeConstants.Tool: return ToolConstants.GetAllTools();
                case ItemTypeConstants.Wand: return [name];
                case ItemTypeConstants.Weapon:
                    var specificWeapons = WeaponConstants.GetAllSpecific();
                    if (specificWeapons.Select(n => n.ToLower()).Contains(name.ToLower()) && power == PowerConstants.Mundane)
                        return [];

                    return WeaponConstants.GetAllWeapons(true, false);
                case ItemTypeConstants.WondrousItem: return WondrousItemConstants.GetAllWondrousItems();
                default: return [];
            }
        }

        public static (bool Valid, string ItemType, string Power, string Name) GetValid(string itemType, string power, string name = null)
        {
            var validatedPower = Powers.FirstOrDefault(p => p.Equals(power, StringComparison.CurrentCultureIgnoreCase));
            var valid = validatedPower != null;

            var validItemType = Enum.TryParse<ItemTypes>(itemType, true, out var validatedItemType);
            valid &= validItemType;

            if (!valid)
            {
                return (false, null, null, null);
            }

            var itemTypeDescription = EnumHelper.GetDescription(validatedItemType);
            valid &= Validate(itemTypeDescription, validatedPower);

            if (name == null)
            {
                return (valid, itemTypeDescription, validatedPower, null);
            }

            var items = GetItemNames(itemTypeDescription, validatedPower, name);
            var validatedName = items.FirstOrDefault(n => n.Equals(name, StringComparison.CurrentCultureIgnoreCase));
            valid &= validatedName != null;

            return (valid, itemTypeDescription, validatedPower, validatedName);
        }
    }
}
