using DnDGen.EncounterGen.Models;

namespace DnDGen.Api.Web.Models
{
    public class DungeonViewModel : EncounterViewModel
    {
        public DungeonViewModel()
            : base()
        {
            Defaults.Environment = EnvironmentConstants.Underground;
            Defaults.AllowUnderground = true;
        }
    }
}