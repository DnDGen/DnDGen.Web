using System.Collections.Generic;

namespace DnDGen.Web.Models
{
    public class EncounterViewModel
    {
        public IEnumerable<string> Environments { get; set; }
        public IEnumerable<string> TimesOfDay { get; set; }
        public IEnumerable<string> Temperatures { get; set; }
        public IEnumerable<string> CreatureTypes { get; set; }
    }
}