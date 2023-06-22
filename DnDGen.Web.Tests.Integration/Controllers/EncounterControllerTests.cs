using DnDGen.Web.Controllers;
using NUnit.Framework;
using System;

namespace DnDGen.Web.Tests.Integration.Controllers
{
    [TestFixture]
    internal class EncounterControllerTests : IntegrationTests
    {
        private EncounterController controller;

        [SetUp]
        public void Setup()
        {
            controller = GetController<EncounterController>();
        }

        [TestCase("Forest", 1, "Temperate", "Day", true, true)]
        [TestCase("Forest", 1, "Cold", "Day", true, true)]
        [TestCase("Aquatic", 1, "Cold", "Day", false, false)]
        [TestCase("Aquatic", 1, "Cold", "Day", false, false, "Animal")]
        [TestCase("Aquatic", 2, "Cold", "Day", false, false)]
        [TestCase("Aquatic", 10, "Cold", "Day", false, false)]
        [TestCase("Aquatic", 20, "Cold", "Day", false, false)]
        [TestCase("Underground", 1, "Cold", "Day", false, false)]
        [TestCase("Plains", 1, "Cold", "Day", false, false)]
        [TestCase("Mountain", 1, "Cold", "Day", false, false)]
        [TestCase("Hills", 1, "Cold", "Day", false, false)]
        [TestCase("Desert", 1, "Cold", "Day", false, false)]
        [TestCase("Civilized", 1, "Cold", "Day", false, false)]
        public void BUG_EncounterGeneratesWithoutError(string environment,
            int level,
            string temperature,
            string timeOfDay,
            bool allowAquatic,
            bool allowUnderground,
            params string[] creatureTypes)
        {
            var clientId = Guid.NewGuid();
            var specs = new EncounterGen.Generators.EncounterSpecifications
            {
                Environment = environment,
                Level = level,
                Temperature = temperature,
                TimeOfDay = timeOfDay,
                AllowAquatic = allowAquatic,
                AllowUnderground = allowUnderground,
                CreatureTypeFilters = creatureTypes
            };

            var result = controller.Generate(clientId, specs);
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Value, Is.Not.Null);

            dynamic data = result.Value;
            Assert.That(data.encounter, Is.Not.Null);
        }

        [TestCase(true, "Aquatic", 1, "Cold", "Day", false, false)]
        [TestCase(true, "Aquatic", 1, "Temperate", "Day", false, false)]
        [TestCase(false, "Aquatic", 1, "Cold", "Day", false, false, "Aberration")]
        [TestCase(false, "Aquatic", 1, "Cold", "Day", false, false, "Aberration", "Vermin")]
        [TestCase(true, "Aquatic", 1, "Cold", "Day", false, false, "Animal")]
        [TestCase(true, "Aquatic", 1, "Cold", "Day", false, false, "Construct")]
        [TestCase(false, "Aquatic", 1, "Cold", "Day", false, false, "Dragon")]
        [TestCase(true, "Aquatic", 1, "Cold", "Day", false, false, "Elemental")]
        [TestCase(false, "Aquatic", 1, "Cold", "Day", false, false, "Fey")]
        [TestCase(false, "Aquatic", 1, "Cold", "Day", false, false, "Giant")]
        [TestCase(false, "Aquatic", 1, "Cold", "Day", false, false, "Humanoid")]
        [TestCase(true, "Aquatic", 1, "Cold", "Day", false, false, "Magical Beast")]
        [TestCase(false, "Aquatic", 1, "Cold", "Day", false, false, "Monstrous Humanoid")]
        [TestCase(false, "Aquatic", 1, "Cold", "Day", false, false, "Plant")]
        [TestCase(true, "Aquatic", 2, "Cold", "Day", false, false)]
        [TestCase(true, "Aquatic", 10, "Cold", "Day", false, false)]
        [TestCase(true, "Aquatic", 20, "Cold", "Day", false, false)]
        [TestCase(false, "Aquatic", 20, "Cold", "Day", false, false, "Vermin", "Animal", "Ooze")]
        [TestCase(true, "Civilized", 1, "Cold", "Day", false, false)]
        [TestCase(true, "Civilized", 1, "Temperate", "Day", false, false)]
        [TestCase(true, "Desert", 1, "Cold", "Day", false, false)]
        [TestCase(true, "Desert", 1, "Temperate", "Day", false, false)]
        [TestCase(true, "Forest", 1, "Cold", "Day", true, true)]
        [TestCase(true, "Forest", 1, "Temperate", "Day", true, true)]
        [TestCase(false, "Forest", 1, "Temperate", "Day", false, false, "Aberration")]
        [TestCase(true, "Forest", 1, "Temperate", "Day", false, false, "Animal")]
        [TestCase(true, "Forest", 1, "Temperate", "Day", false, false, "Construct")]
        [TestCase(true, "Forest", 1, "Temperate", "Day", false, false, "Dragon")]
        [TestCase(true, "Forest", 1, "Temperate", "Day", false, false, "Elemental")]
        [TestCase(false, "Forest", 1, "Temperate", "Day", false, false, "Fey")]
        [TestCase(false, "Forest", 1, "Temperate", "Day", false, false, "Giant")]
        [TestCase(true, "Forest", 1, "Temperate", "Day", false, false, "Humanoid")]
        [TestCase(true, "Forest", 1, "Temperate", "Day", false, false, "Magical Beast")]
        [TestCase(false, "Forest", 1, "Temperate", "Day", false, false, "Monstrous Humanoid")]
        [TestCase(false, "Forest", 1, "Temperate", "Day", false, false, "Ooze")]
        [TestCase(true, "Forest", 1, "Temperate", "Day", false, false, "Outsider")]
        [TestCase(false, "Forest", 1, "Temperate", "Day", false, false, "Plant")]
        [TestCase(true, "Forest", 1, "Temperate", "Day", false, false, "Undead")]
        [TestCase(true, "Forest", 1, "Temperate", "Day", false, false, "Vermin")]
        [TestCase(true, "Forest", 2, "Temperate", "Day", false, false, "Monstrous Humanoid")]
        [TestCase(true, "Forest", 3, "Temperate", "Day", false, false, "Fey")]
        [TestCase(true, "Forest", 3, "Temperate", "Day", false, false, "Plant")]
        [TestCase(true, "Hills", 1, "Cold", "Day", false, false)]
        [TestCase(true, "Hills", 1, "Temperate", "Day", false, false)]
        [TestCase(true, "Hills", 7, "Temperate", "Day", false, false, "Giant")]
        [TestCase(true, "Mountain", 1, "Cold", "Day", false, false)]
        [TestCase(true, "Mountain", 1, "Temperate", "Day", false, false)]
        [TestCase(true, "Plains", 1, "Cold", "Day", false, false)]
        [TestCase(true, "Plains", 1, "Temperate", "Day", false, false)]
        [TestCase(true, "Underground", 1, "Cold", "Day", false, false)]
        [TestCase(true, "Underground", 1, "Temperate", "Day", false, false)]
        [TestCase(true, "Underground", 7, "Temperate", "Day", false, false, "Aberration")]
        [TestCase(true, "Underground", 7, "Temperate", "Day", false, false, "Ooze")]
        public void BUG_EncounterValidatesWithoutError(bool valid,
            string environment,
            int level,
            string temperature,
            string timeOfDay,
            bool allowAquatic,
            bool allowUnderground,
            params string[] creatureTypes)
        {
            var clientId = Guid.NewGuid();
            var specs = new EncounterGen.Generators.EncounterSpecifications
            {
                Environment = environment,
                Level = level,
                Temperature = temperature,
                TimeOfDay = timeOfDay,
                AllowAquatic = allowAquatic,
                AllowUnderground = allowUnderground,
                CreatureTypeFilters = creatureTypes
            };

            var result = controller.Validate(clientId, specs);
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Value, Is.Not.Null);

            dynamic data = result.Value;
            Assert.That(data.isValid, Is.EqualTo(valid));
        }
    }
}
