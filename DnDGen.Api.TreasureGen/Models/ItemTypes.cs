using DnDGen.TreasureGen.Items;
using System.ComponentModel;

namespace DnDGen.Api.TreasureGen.Models
{
    public enum ItemTypes
    {
        [Description(ItemTypeConstants.AlchemicalItem)]
        AlchemicalItem,
        [Description(ItemTypeConstants.Armor)]
        Armor,
        [Description(ItemTypeConstants.Potion)]
        Potion,
        [Description(ItemTypeConstants.Ring)]
        Ring,
        [Description(ItemTypeConstants.Rod)]
        Rod,
        [Description(ItemTypeConstants.Scroll)]
        Scroll,
        [Description(ItemTypeConstants.Staff)]
        Staff,
        [Description(ItemTypeConstants.Tool)]
        Tool,
        [Description(ItemTypeConstants.Wand)]
        Wand,
        [Description(ItemTypeConstants.Weapon)]
        Weapon,
        [Description(ItemTypeConstants.WondrousItem)]
        WondrousItem,
    }
}
