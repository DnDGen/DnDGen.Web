using DnDGen.RollGen;

namespace DnDGen.Api.Web.Models
{
    public class RollViewModel
    {
        public int QuantityLimit_Lower { get; set; }
        public int QuantityLimit_Upper { get; set; }
        public int DieLimit_Lower { get; set; }
        public int DieLimit_Upper { get; set; }

        public RollViewModel()
        {
            QuantityLimit_Lower = 1;
            QuantityLimit_Upper = Limits.Quantity;
            DieLimit_Lower = 1;
            DieLimit_Upper = Limits.Die;
        }
    }
}
