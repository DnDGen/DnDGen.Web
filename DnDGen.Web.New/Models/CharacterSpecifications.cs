namespace DnDGen.Web.New.Models
{
    public class CharacterSpecifications : RandomizerSpecifications
    {
        public string AbilitiesRandomizerType { get; set; }
        public int SetStrength { get; set; }
        public int SetConstitution { get; set; }
        public int SetDexterity { get; set; }
        public int SetIntelligence { get; set; }
        public int SetWisdom { get; set; }
        public int SetCharisma { get; set; }
        public bool AllowAbilityAdjustments { get; set; }
    }
}