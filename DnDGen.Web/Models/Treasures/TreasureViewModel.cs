using TreasureGen.Items;
using TreasureGen.Items.Magical;
using TreasureGen.Items.Mundane;

namespace DnDGen.Web.Models.Treasures
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
            Powers = new[]
            {
                PowerConstants.Mundane,
                PowerConstants.Minor,
                PowerConstants.Medium,
                PowerConstants.Major
            };
            ItemNames = GetNames();
        }

        private Dictionary<string, IEnumerable<string>> GetNames()
        {
            var names = new Dictionary<string, IEnumerable<string>>();
            names[ItemTypes.AlchemicalItem.ToString()] = AlchemicalItemConstants.GetAllAlchemicalItems();
            names[ItemTypes.Armor.ToString()] = ArmorConstants.GetAllArmors(true);
            names[ItemTypes.Potion.ToString()] = PotionConstants.GetAllPotions();
            names[ItemTypes.Ring.ToString()] = RingConstants.GetAllRings();
            names[ItemTypes.Rod.ToString()] = RodConstants.GetAllRods();
            names[ItemTypes.Scroll.ToString()] = new[] { "Scroll" };
            names[ItemTypes.Staff.ToString()] = StaffConstants.GetAllStaffs();
            names[ItemTypes.Tool.ToString()] = ToolConstants.GetAllTools();
            names[ItemTypes.Wand.ToString()] = new[] { "Wand of Spell" };
            names[ItemTypes.Weapon.ToString()] = WeaponConstants.GetAllWeapons();
            names[ItemTypes.WondrousItem.ToString()] = WondrousItemConstants.GetAllWondrousItems();

            return names;
        }

        private IEnumerable<ItemTypeViewModel> GetItemTypeViewModels()
        {
            return new[]
            {
                new ItemTypeViewModel { ItemType = ItemTypes.AlchemicalItem, DisplayName = ItemTypeConstants.AlchemicalItem },
                new ItemTypeViewModel { ItemType = ItemTypes.Armor, DisplayName = ItemTypeConstants.Armor },
                new ItemTypeViewModel { ItemType = ItemTypes.Potion, DisplayName = ItemTypeConstants.Potion },
                new ItemTypeViewModel { ItemType = ItemTypes.Ring, DisplayName = ItemTypeConstants.Ring },
                new ItemTypeViewModel { ItemType = ItemTypes.Rod, DisplayName = ItemTypeConstants.Rod },
                new ItemTypeViewModel { ItemType = ItemTypes.Scroll, DisplayName = ItemTypeConstants.Scroll },
                new ItemTypeViewModel { ItemType = ItemTypes.Staff, DisplayName = ItemTypeConstants.Staff },
                new ItemTypeViewModel { ItemType = ItemTypes.Tool, DisplayName = ItemTypeConstants.Tool },
                new ItemTypeViewModel { ItemType = ItemTypes.Wand, DisplayName = ItemTypeConstants.Wand },
                new ItemTypeViewModel { ItemType = ItemTypes.Weapon, DisplayName = ItemTypeConstants.Weapon },
                new ItemTypeViewModel { ItemType = ItemTypes.WondrousItem, DisplayName = ItemTypeConstants.WondrousItem },
            };
        }
    }
}