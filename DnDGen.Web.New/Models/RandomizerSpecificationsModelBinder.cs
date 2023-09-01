using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace DnDGen.Web.New.Models
{
    public class RandomizerSpecificationsModelBinder : IModelBinder
    {
        public Task BindModelAsync(ModelBindingContext bindingContext)
        {
            if (bindingContext == null)
                throw new ArgumentNullException(nameof(bindingContext));

            var result = new RandomizerSpecifications
            {
                AlignmentRandomizerType = bindingContext.ValueProvider.GetValue("alignmentRandomizerType").FirstValue,
                SetAlignment = bindingContext.ValueProvider.GetValue("setAlignment").FirstValue,
                ClassNameRandomizerType = bindingContext.ValueProvider.GetValue("classNameRandomizerType").FirstValue,
                SetClassName = bindingContext.ValueProvider.GetValue("setClassName").FirstValue,
                LevelRandomizerType = bindingContext.ValueProvider.GetValue("levelRandomizerType").FirstValue,
                SetLevel = Convert.ToInt32(bindingContext.ValueProvider.GetValue("setLevel").FirstValue),
                BaseRaceRandomizerType = bindingContext.ValueProvider.GetValue("baseRaceRandomizerType").FirstValue,
                SetBaseRace = bindingContext.ValueProvider.GetValue("setBaseRace").FirstValue,
                MetaraceRandomizerType = bindingContext.ValueProvider.GetValue("metaraceRandomizerType").FirstValue,
                ForceMetarace = Convert.ToBoolean(bindingContext.ValueProvider.GetValue("forceMetarace").FirstValue),
                SetMetarace = bindingContext.ValueProvider.GetValue("setMetarace").FirstValue
            };

            bindingContext.Result = ModelBindingResult.Success(result);

            return Task.CompletedTask;
        }
    }
}
