using EncounterGen.Generators;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace DnDGen.Web.Models
{
    public class EncounterSpecificationsModelBinder : IModelBinder
    {
        public Task BindModelAsync(ModelBindingContext bindingContext)
        {
            if (bindingContext == null)
                throw new ArgumentNullException(nameof(bindingContext));

            var result = new EncounterSpecifications
            {
                Environment = bindingContext.ValueProvider.GetValue("environment").FirstValue,
                Level = Convert.ToInt32(bindingContext.ValueProvider.GetValue("level").FirstValue),
                Temperature = bindingContext.ValueProvider.GetValue("temperature").FirstValue,
                TimeOfDay = bindingContext.ValueProvider.GetValue("timeOfDay").FirstValue,
                AllowAquatic = Convert.ToBoolean(bindingContext.ValueProvider.GetValue("allowAquatic").FirstValue),
                AllowUnderground = Convert.ToBoolean(bindingContext.ValueProvider.GetValue("allowUnderground").FirstValue),
                CreatureTypeFilters = bindingContext.ValueProvider.GetValue("creatureTypeFilters"),
            };

            bindingContext.Result = ModelBindingResult.Success(result);

            return Task.CompletedTask;
        }
    }
}
