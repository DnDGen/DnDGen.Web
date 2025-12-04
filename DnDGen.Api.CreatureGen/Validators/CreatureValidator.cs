using DnDGen.Api.CreatureGen.Models;
using Microsoft.Azure.Functions.Worker.Http;

namespace DnDGen.Api.CreatureGen.Validators
{
    public static class CreatureValidator
    {
        public static (bool Valid, string Error, CreatureSpecifications CreatureSpecifications) GetValid(string creatureName, HttpRequestData request)
        {
            var spec = new CreatureSpecifications();

            var alignment = request.Query["alignment"];
            var templates = request.Query.GetValues("templates") ?? [];

            spec.SetCreature(creatureName);
            spec.SetAlignmentFilter(alignment);
            spec.SetTemplatesFilter(templates);

            var (Valid, Error) = spec.IsValid();
            return (Valid, Error, spec);
        }
    }
}
