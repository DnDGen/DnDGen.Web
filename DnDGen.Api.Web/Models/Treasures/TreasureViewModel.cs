using DnDGen.TreasureGen.Items;
using DnDGen.TreasureGen.Items.Magical;
using DnDGen.TreasureGen.Items.Mundane;

namespace DnDGen.Api.Web.Models.Treasures
{
    public class TreasureViewModel
    {
        public IEnumerable<string> TreasureTypes { get; set; }
        public int MaxTreasureLevel { get; set; }
        public IEnumerable<ItemTypeViewModel> ItemTypeViewModels { get; set; }
        public IEnumerable<string> Powers { get; set; }
        public Dictionary<string, IEnumerable<string>> ItemNames { get; set; }

        public TreasureViewModel()
        {
            MaxTreasureLevel = 100;
            TreasureTypes = Enum.GetNames<TreasureTypes>();
            ItemTypeViewModels = GetItemTypeViewModels();
            Powers =
            [
                PowerConstants.Mundane,
                PowerConstants.Minor,
                PowerConstants.Medium,
                PowerConstants.Major
            ];
            ItemNames = GetNames();
        }

        private Dictionary<string, IEnumerable<string>> GetNames()
        {
            var names = new Dictionary<string, IEnumerable<string>>
            {
                [ItemTypes.AlchemicalItem.ToString()] = AlchemicalItemConstants.GetAllAlchemicalItems().OrderBy(n => n),
                [ItemTypes.Armor.ToString()] = ArmorConstants.GetAllArmors(true).OrderBy(n => n),
                [ItemTypes.Potion.ToString()] = PotionConstants.GetAllPotions(false).OrderBy(n => n),
                [ItemTypes.Ring.ToString()] = RingConstants.GetAllRings().OrderBy(n => n),
                [ItemTypes.Rod.ToString()] = RodConstants.GetAllRods().OrderBy(n => n),
                [ItemTypes.Scroll.ToString()] = ["Scroll"],
                [ItemTypes.Staff.ToString()] = StaffConstants.GetAllStaffs().OrderBy(n => n),
                [ItemTypes.Tool.ToString()] = ToolConstants.GetAllTools().OrderBy(n => n),
                [ItemTypes.Wand.ToString()] = ["Wand of Spell"],
                [ItemTypes.Weapon.ToString()] = WeaponConstants.GetAllWeapons(true, false).OrderBy(n => n),
                [ItemTypes.WondrousItem.ToString()] = WondrousItemConstants.GetAllWondrousItems().OrderBy(n => n)
            };

            return names;
        }

        private IEnumerable<ItemTypeViewModel> GetItemTypeViewModels()
        {
            return
            [
                new ItemTypeViewModel { ItemType = ItemTypes.AlchemicalItem.ToString(), DisplayName = ItemTypeConstants.AlchemicalItem },
                new ItemTypeViewModel { ItemType = ItemTypes.Armor.ToString(), DisplayName = ItemTypeConstants.Armor },
                new ItemTypeViewModel { ItemType = ItemTypes.Potion.ToString(), DisplayName = ItemTypeConstants.Potion },
                new ItemTypeViewModel { ItemType = ItemTypes.Ring.ToString(), DisplayName = ItemTypeConstants.Ring },
                new ItemTypeViewModel { ItemType = ItemTypes.Rod.ToString(), DisplayName = ItemTypeConstants.Rod },
                new ItemTypeViewModel { ItemType = ItemTypes.Scroll.ToString(), DisplayName = ItemTypeConstants.Scroll },
                new ItemTypeViewModel { ItemType = ItemTypes.Staff.ToString(), DisplayName = ItemTypeConstants.Staff },
                new ItemTypeViewModel { ItemType = ItemTypes.Tool.ToString(), DisplayName = ItemTypeConstants.Tool },
                new ItemTypeViewModel { ItemType = ItemTypes.Wand.ToString(), DisplayName = ItemTypeConstants.Wand },
                new ItemTypeViewModel { ItemType = ItemTypes.Weapon.ToString(), DisplayName = ItemTypeConstants.Weapon },
                new ItemTypeViewModel { ItemType = ItemTypes.WondrousItem.ToString(), DisplayName = ItemTypeConstants.WondrousItem },
            ];
        }
    }
}