using DnDGen.TreasureGen.Items;
using Newtonsoft.Json;

namespace DnDGen.Api.TreasureGen.Models.Legacy
{
    public class WeaponV1 : Weapon
    {
        public string DamageDescription => DamageSummary;
        public string CriticalDamageDescription => CriticalDamageSummary;
        public string SecondaryDamageDescription => SecondaryDamageSummary;
        public string SecondaryCriticalDamageDescription => SecondaryCriticalDamageSummary;
        public string ThreatRangeDescription => ThreatRangeSummary;

        public static WeaponV1 From(Weapon weapon)
        {
            var serialized = JsonConvert.SerializeObject(weapon);
            return JsonConvert.DeserializeObject<WeaponV1>(serialized);
        }
    }
}
