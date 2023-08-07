using TreasureGen.Items;
using TreasureGen.Items.Magical;
using TreasureGen.Items.Mundane;

namespace DnDGen.Web.Models
{
    public class TreasureViewModel
    {
        public IEnumerable<string> TreasureTypes { get; set; }
        public IEnumerable<string> Powers { get; set; }
        public int MaxTreasureLevel { get; set; }
        public Dictionary<string, IEnumerable<string>> ItemNames { get; set; }

        public TreasureViewModel()
        {
            MaxTreasureLevel = 100;
            TreasureTypes = new[] { "Treasure", "Coin", "Goods", "Items" };
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
            names[ItemTypeConstants.AlchemicalItem] = AlchemicalItemConstants.GetAllAlchemicalItems();
            names[ItemTypeConstants.Armor] = ArmorConstants.GetAllArmors(true);
            names[ItemTypeConstants.Potion] = PotionConstants.GetAllPotions();
            names[ItemTypeConstants.Ring] = RingConstants.GetAllRings();
            names[ItemTypeConstants.Rod] = RodConstants.GetAllRods();
            names[ItemTypeConstants.Scroll] = new[] { "Scroll" };
            names[ItemTypeConstants.Staff] = StaffConstants.GetAllStaffs();
            names[ItemTypeConstants.Tool] = ToolConstants.GetAllTools();
            names[ItemTypeConstants.Wand] = new[] { "Wand" };
            names[ItemTypeConstants.Weapon] = WeaponConstants.GetAllWeapons();
            names[ItemTypeConstants.WondrousItem] = WondrousItemConstants.GetAllWondrousItems();

            return names;
        }
    }
}