using DnDGen.TreasureGen.Items;

namespace DnDGen.Api.TreasureGen.Models.Legacy
{
    public class WeaponV1 : Weapon
    {
        public string DamageDescription => DamageSummary;
        public string CriticalDamageDescription => CriticalDamageSummary;
        public string SecondaryDamageDescription => SecondaryDamageSummary;
        public string SecondaryCriticalDamageDescription => SecondaryCriticalDamageSummary;
        public string ThreatRangeDescription => ThreatRangeSummary;
    }
}
