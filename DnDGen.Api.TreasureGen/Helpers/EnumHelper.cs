using System.ComponentModel;
using System.Linq;

namespace DnDGen.Api.TreasureGen.Helpers
{
    public static class EnumHelper
    {
        public static string GetDescription<T>(T value)
        {
            var fi = value.GetType().GetField(value.ToString());
            var attributes = fi.GetCustomAttributes(typeof(DescriptionAttribute), false) as DescriptionAttribute[];

            if (attributes != null && attributes.Any())
            {
                return attributes.First().Description;
            }

            return value.ToString();
        }
    }
}
