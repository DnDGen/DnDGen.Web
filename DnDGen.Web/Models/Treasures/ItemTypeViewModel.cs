namespace DnDGen.Web.Models.Treasures
{
    public class ItemTypeViewModel
    {
        public string ItemType { get; set; }
        public string DisplayName { get; set; }

        public ItemTypeViewModel()
        {
            ItemType = string.Empty;
            DisplayName = string.Empty;
        }
    }
}
