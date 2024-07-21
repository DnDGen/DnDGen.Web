using DnDGen.RollGen;

namespace DnDGen.Api.Web.Models
{
    public class RollViewModel
    {
        public int QuantityLimit_Lower = 1;
        public int QuantityLimit_Upper = Limits.Quantity;
        public int DieLimit_Lower = 1;
        public int DieLimit_Upper = Limits.Die;
    }
}
