using DnDGen.Api.Tests.Integration.Helpers;
using DnDGen.Api.TreasureGen.Functions;
using DnDGen.Api.TreasureGen.Models;
using DnDGen.TreasureGen.Items;
using DnDGen.TreasureGen.Items.Magical;
using DnDGen.TreasureGen.Items.Mundane;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using System.Collections;
using System.Net;
using System.Web;

namespace DnDGen.Api.TreasureGen.Tests.Integration.Functions
{
    public class ValidateRandomItemFunctionTests : IntegrationTests
    {
        private ValidateRandomItemFunction function;

        [SetUp]
        public void Setup()
        {
            var loggerFactory = new LoggerFactory();
            function = new ValidateRandomItemFunction(loggerFactory);
        }

        [TestCaseSource(nameof(RandomItemGenerationData))]
        public async Task ValidateRandomItem_ReturnsValidity(string itemType, string power, bool valid)
        {
            var url = GetUrl(itemType, power);
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.RunV1(request, itemType, power);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var validity = StreamHelper.Read<bool>(response.Body);
            Assert.That(validity, Is.EqualTo(valid));
        }

        private string GetUrl(string itemType, string power, string query = "")
        {
            var url = $"https://treasure.dndgen.com/api/v1/item/{itemType}/power/{power}/validate";
            if (query.Any())
                url += "?" + query.TrimStart('?');

            return url;
        }

        public static IEnumerable RandomItemGenerationData
        {
            get
            {
                yield return new TestCaseData("Building", PowerConstants.Mundane, false);
                yield return new TestCaseData("Building", PowerConstants.Minor, false);
                yield return new TestCaseData("Building", PowerConstants.Medium, false);
                yield return new TestCaseData("Building", PowerConstants.Major, false);

                yield return new TestCaseData(ItemTypeConstants.AlchemicalItem, "Omnipotent", false);
                yield return new TestCaseData(ItemTypeConstants.AlchemicalItem, PowerConstants.Mundane, false);
                yield return new TestCaseData(ItemTypeConstants.AlchemicalItem, PowerConstants.Minor, false);
                yield return new TestCaseData(ItemTypeConstants.AlchemicalItem, PowerConstants.Medium, false);
                yield return new TestCaseData(ItemTypeConstants.AlchemicalItem, PowerConstants.Major, false);

                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), "Omnipotent", false);
                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Mundane, true);
                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Mundane.ToUpper(), true);
                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Mundane.ToLower(), true);
                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Minor, false);
                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Medium, false);
                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Major, false);

                yield return new TestCaseData(((int)ItemTypes.AlchemicalItem).ToString(), "Omnipotent", false);
                yield return new TestCaseData(((int)ItemTypes.AlchemicalItem).ToString(), PowerConstants.Mundane, true);
                yield return new TestCaseData(((int)ItemTypes.AlchemicalItem).ToString(), PowerConstants.Minor, false);
                yield return new TestCaseData(((int)ItemTypes.AlchemicalItem).ToString(), PowerConstants.Medium, false);
                yield return new TestCaseData(((int)ItemTypes.AlchemicalItem).ToString(), PowerConstants.Major, false);

                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString().ToUpper(), "Omnipotent", false);
                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString().ToUpper(), PowerConstants.Mundane, true);
                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString().ToUpper(), PowerConstants.Minor, false);
                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString().ToUpper(), PowerConstants.Medium, false);
                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString().ToUpper(), PowerConstants.Major, false);

                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString().ToLower(), "Omnipotent", false);
                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString().ToLower(), PowerConstants.Mundane, true);
                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString().ToLower(), PowerConstants.Minor, false);
                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString().ToLower(), PowerConstants.Medium, false);
                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString().ToLower(), PowerConstants.Major, false);

                yield return new TestCaseData(ItemTypes.Armor.ToString(), "Omnipotent", false);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Mundane, true);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Mundane.ToUpper(), true);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Mundane.ToLower(), true);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Minor, true);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Minor.ToUpper(), true);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Minor.ToLower(), true);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, true);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium.ToUpper(), true);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium.ToLower(), true);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Major, true);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Major.ToUpper(), true);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Major.ToLower(), true);

                yield return new TestCaseData(((int)ItemTypes.Armor).ToString(), "Omnipotent", false);
                yield return new TestCaseData(((int)ItemTypes.Armor).ToString(), PowerConstants.Mundane, true);
                yield return new TestCaseData(((int)ItemTypes.Armor).ToString(), PowerConstants.Minor, true);
                yield return new TestCaseData(((int)ItemTypes.Armor).ToString(), PowerConstants.Medium, true);
                yield return new TestCaseData(((int)ItemTypes.Armor).ToString(), PowerConstants.Major, true);

                yield return new TestCaseData(ItemTypes.Armor.ToString().ToUpper(), "Omnipotent", false);
                yield return new TestCaseData(ItemTypes.Armor.ToString().ToUpper(), PowerConstants.Mundane, true);
                yield return new TestCaseData(ItemTypes.Armor.ToString().ToUpper(), PowerConstants.Minor, true);
                yield return new TestCaseData(ItemTypes.Armor.ToString().ToUpper(), PowerConstants.Medium, true);
                yield return new TestCaseData(ItemTypes.Armor.ToString().ToUpper(), PowerConstants.Major, true);

                yield return new TestCaseData(ItemTypes.Armor.ToString().ToLower(), "Omnipotent", false);
                yield return new TestCaseData(ItemTypes.Armor.ToString().ToLower(), PowerConstants.Mundane, true);
                yield return new TestCaseData(ItemTypes.Armor.ToString().ToLower(), PowerConstants.Minor, true);
                yield return new TestCaseData(ItemTypes.Armor.ToString().ToLower(), PowerConstants.Medium, true);
                yield return new TestCaseData(ItemTypes.Armor.ToString().ToLower(), PowerConstants.Major, true);

                yield return new TestCaseData(ItemTypes.Potion.ToString(), "Omnipotent", false);
                yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Mundane, false);
                yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Minor, true);
                yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Minor.ToUpper(), true);
                yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Minor.ToLower(), true);
                yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium, true);
                yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium.ToUpper(), true);
                yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium.ToLower(), true);
                yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Major, true);
                yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Major.ToUpper(), true);
                yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Major.ToLower(), true);

                yield return new TestCaseData(((int)ItemTypes.Potion).ToString(), "Omnipotent", false);
                yield return new TestCaseData(((int)ItemTypes.Potion).ToString(), PowerConstants.Mundane, false);
                yield return new TestCaseData(((int)ItemTypes.Potion).ToString(), PowerConstants.Minor, true);
                yield return new TestCaseData(((int)ItemTypes.Potion).ToString(), PowerConstants.Medium, true);
                yield return new TestCaseData(((int)ItemTypes.Potion).ToString(), PowerConstants.Major, true);

                yield return new TestCaseData(ItemTypes.Potion.ToString().ToUpper(), "Omnipotent", false);
                yield return new TestCaseData(ItemTypes.Potion.ToString().ToUpper(), PowerConstants.Mundane, false);
                yield return new TestCaseData(ItemTypes.Potion.ToString().ToUpper(), PowerConstants.Minor, true);
                yield return new TestCaseData(ItemTypes.Potion.ToString().ToUpper(), PowerConstants.Medium, true);
                yield return new TestCaseData(ItemTypes.Potion.ToString().ToUpper(), PowerConstants.Major, true);

                yield return new TestCaseData(ItemTypes.Potion.ToString().ToLower(), "Omnipotent", false);
                yield return new TestCaseData(ItemTypes.Potion.ToString().ToLower(), PowerConstants.Mundane, false);
                yield return new TestCaseData(ItemTypes.Potion.ToString().ToLower(), PowerConstants.Minor, true);
                yield return new TestCaseData(ItemTypes.Potion.ToString().ToLower(), PowerConstants.Medium, true);
                yield return new TestCaseData(ItemTypes.Potion.ToString().ToLower(), PowerConstants.Major, true);

                yield return new TestCaseData(ItemTypes.Ring.ToString(), "Omnipotent", false);
                yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Mundane, false);
                yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Minor, true);
                yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Minor.ToUpper(), true);
                yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Minor.ToLower(), true);
                yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Medium, true);
                yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Medium.ToUpper(), true);
                yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Medium.ToLower(), true);
                yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Major, true);
                yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Major.ToUpper(), true);
                yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Major.ToLower(), true);

                yield return new TestCaseData(((int)ItemTypes.Ring).ToString(), "Omnipotent", false);
                yield return new TestCaseData(((int)ItemTypes.Ring).ToString(), PowerConstants.Mundane, false);
                yield return new TestCaseData(((int)ItemTypes.Ring).ToString(), PowerConstants.Minor, true);
                yield return new TestCaseData(((int)ItemTypes.Ring).ToString(), PowerConstants.Medium, true);
                yield return new TestCaseData(((int)ItemTypes.Ring).ToString(), PowerConstants.Major, true);

                yield return new TestCaseData(ItemTypes.Ring.ToString().ToUpper(), "Omnipotent", false);
                yield return new TestCaseData(ItemTypes.Ring.ToString().ToUpper(), PowerConstants.Mundane, false);
                yield return new TestCaseData(ItemTypes.Ring.ToString().ToUpper(), PowerConstants.Minor, true);
                yield return new TestCaseData(ItemTypes.Ring.ToString().ToUpper(), PowerConstants.Medium, true);
                yield return new TestCaseData(ItemTypes.Ring.ToString().ToUpper(), PowerConstants.Major, true);

                yield return new TestCaseData(ItemTypes.Ring.ToString().ToLower(), "Omnipotent", false);
                yield return new TestCaseData(ItemTypes.Ring.ToString().ToLower(), PowerConstants.Mundane, false);
                yield return new TestCaseData(ItemTypes.Ring.ToString().ToLower(), PowerConstants.Minor, true);
                yield return new TestCaseData(ItemTypes.Ring.ToString().ToLower(), PowerConstants.Medium, true);
                yield return new TestCaseData(ItemTypes.Ring.ToString().ToLower(), PowerConstants.Major, true);

                yield return new TestCaseData(ItemTypes.Rod.ToString(), "Omnipotent", false);
                yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Mundane, false);
                yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Minor, false);
                yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Medium, true);
                yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Medium.ToUpper(), true);
                yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Medium.ToLower(), true);
                yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Major, true);
                yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Major.ToUpper(), true);
                yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Major.ToLower(), true);

                yield return new TestCaseData(((int)ItemTypes.Rod).ToString(), "Omnipotent", false);
                yield return new TestCaseData(((int)ItemTypes.Rod).ToString(), PowerConstants.Mundane, false);
                yield return new TestCaseData(((int)ItemTypes.Rod).ToString(), PowerConstants.Minor, false);
                yield return new TestCaseData(((int)ItemTypes.Rod).ToString(), PowerConstants.Medium, true);
                yield return new TestCaseData(((int)ItemTypes.Rod).ToString(), PowerConstants.Major, true);

                yield return new TestCaseData(ItemTypes.Rod.ToString().ToUpper(), "Omnipotent", false);
                yield return new TestCaseData(ItemTypes.Rod.ToString().ToUpper(), PowerConstants.Mundane, false);
                yield return new TestCaseData(ItemTypes.Rod.ToString().ToUpper(), PowerConstants.Minor, false);
                yield return new TestCaseData(ItemTypes.Rod.ToString().ToUpper(), PowerConstants.Medium, true);
                yield return new TestCaseData(ItemTypes.Rod.ToString().ToUpper(), PowerConstants.Major, true);

                yield return new TestCaseData(ItemTypes.Rod.ToString().ToLower(), "Omnipotent", false);
                yield return new TestCaseData(ItemTypes.Rod.ToString().ToLower(), PowerConstants.Mundane, false);
                yield return new TestCaseData(ItemTypes.Rod.ToString().ToLower(), PowerConstants.Minor, false);
                yield return new TestCaseData(ItemTypes.Rod.ToString().ToLower(), PowerConstants.Medium, true);
                yield return new TestCaseData(ItemTypes.Rod.ToString().ToLower(), PowerConstants.Major, true);

                yield return new TestCaseData(ItemTypes.Scroll.ToString(), "Omnipotent", false);
                yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Mundane, false);
                yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Minor, true);
                yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Minor.ToUpper(), true);
                yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Minor.ToLower(), true);
                yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Medium, true);
                yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Medium.ToUpper(), true);
                yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Medium.ToLower(), true);
                yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Major, true);
                yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Major.ToUpper(), true);
                yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Major.ToLower(), true);

                yield return new TestCaseData(((int)ItemTypes.Scroll).ToString(), "Omnipotent", false);
                yield return new TestCaseData(((int)ItemTypes.Scroll).ToString(), PowerConstants.Mundane, false);
                yield return new TestCaseData(((int)ItemTypes.Scroll).ToString(), PowerConstants.Minor, true);
                yield return new TestCaseData(((int)ItemTypes.Scroll).ToString(), PowerConstants.Medium, true);
                yield return new TestCaseData(((int)ItemTypes.Scroll).ToString(), PowerConstants.Major, true);

                yield return new TestCaseData(ItemTypes.Scroll.ToString().ToUpper(), "Omnipotent", false);
                yield return new TestCaseData(ItemTypes.Scroll.ToString().ToUpper(), PowerConstants.Mundane, false);
                yield return new TestCaseData(ItemTypes.Scroll.ToString().ToUpper(), PowerConstants.Minor, true);
                yield return new TestCaseData(ItemTypes.Scroll.ToString().ToUpper(), PowerConstants.Medium, true);
                yield return new TestCaseData(ItemTypes.Scroll.ToString().ToUpper(), PowerConstants.Major, true);

                yield return new TestCaseData(ItemTypes.Scroll.ToString().ToLower(), "Omnipotent", false);
                yield return new TestCaseData(ItemTypes.Scroll.ToString().ToLower(), PowerConstants.Mundane, false);
                yield return new TestCaseData(ItemTypes.Scroll.ToString().ToLower(), PowerConstants.Minor, true);
                yield return new TestCaseData(ItemTypes.Scroll.ToString().ToLower(), PowerConstants.Medium, true);
                yield return new TestCaseData(ItemTypes.Scroll.ToString().ToLower(), PowerConstants.Major, true);

                yield return new TestCaseData(ItemTypes.Staff.ToString(), "Omnipotent", false);
                yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Mundane, false);
                yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Minor, false);
                yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Medium, true);
                yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Medium.ToUpper(), true);
                yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Medium.ToLower(), true);
                yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Major, true);
                yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Major.ToUpper(), true);
                yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Major.ToLower(), true);

                yield return new TestCaseData(((int)ItemTypes.Staff).ToString(), "Omnipotent", false);
                yield return new TestCaseData(((int)ItemTypes.Staff).ToString(), PowerConstants.Mundane, false);
                yield return new TestCaseData(((int)ItemTypes.Staff).ToString(), PowerConstants.Minor, false);
                yield return new TestCaseData(((int)ItemTypes.Staff).ToString(), PowerConstants.Medium, true);
                yield return new TestCaseData(((int)ItemTypes.Staff).ToString(), PowerConstants.Major, true);

                yield return new TestCaseData(ItemTypes.Staff.ToString().ToUpper(), "Omnipotent", false);
                yield return new TestCaseData(ItemTypes.Staff.ToString().ToUpper(), PowerConstants.Mundane, false);
                yield return new TestCaseData(ItemTypes.Staff.ToString().ToUpper(), PowerConstants.Minor, false);
                yield return new TestCaseData(ItemTypes.Staff.ToString().ToUpper(), PowerConstants.Medium, true);
                yield return new TestCaseData(ItemTypes.Staff.ToString().ToUpper(), PowerConstants.Major, true);

                yield return new TestCaseData(ItemTypes.Staff.ToString().ToLower(), "Omnipotent", false);
                yield return new TestCaseData(ItemTypes.Staff.ToString().ToLower(), PowerConstants.Mundane, false);
                yield return new TestCaseData(ItemTypes.Staff.ToString().ToLower(), PowerConstants.Minor, false);
                yield return new TestCaseData(ItemTypes.Staff.ToString().ToLower(), PowerConstants.Medium, true);
                yield return new TestCaseData(ItemTypes.Staff.ToString().ToLower(), PowerConstants.Major, true);

                yield return new TestCaseData(ItemTypes.Tool.ToString(), "Omnipotent", false);
                yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Mundane, true);
                yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Mundane.ToUpper(), true);
                yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Mundane.ToLower(), true);
                yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Minor, false);
                yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Medium, false);
                yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Major, false);

                yield return new TestCaseData(((int)ItemTypes.Tool).ToString(), "Omnipotent", false);
                yield return new TestCaseData(((int)ItemTypes.Tool).ToString(), PowerConstants.Mundane, true);
                yield return new TestCaseData(((int)ItemTypes.Tool).ToString(), PowerConstants.Minor, false);
                yield return new TestCaseData(((int)ItemTypes.Tool).ToString(), PowerConstants.Medium, false);
                yield return new TestCaseData(((int)ItemTypes.Tool).ToString(), PowerConstants.Major, false);

                yield return new TestCaseData(ItemTypes.Tool.ToString().ToUpper(), "Omnipotent", false);
                yield return new TestCaseData(ItemTypes.Tool.ToString().ToUpper(), PowerConstants.Mundane, true);
                yield return new TestCaseData(ItemTypes.Tool.ToString().ToUpper(), PowerConstants.Minor, false);
                yield return new TestCaseData(ItemTypes.Tool.ToString().ToUpper(), PowerConstants.Medium, false);
                yield return new TestCaseData(ItemTypes.Tool.ToString().ToUpper(), PowerConstants.Major, false);

                yield return new TestCaseData(ItemTypes.Tool.ToString().ToLower(), "Omnipotent", false);
                yield return new TestCaseData(ItemTypes.Tool.ToString().ToLower(), PowerConstants.Mundane, true);
                yield return new TestCaseData(ItemTypes.Tool.ToString().ToLower(), PowerConstants.Minor, false);
                yield return new TestCaseData(ItemTypes.Tool.ToString().ToLower(), PowerConstants.Medium, false);
                yield return new TestCaseData(ItemTypes.Tool.ToString().ToLower(), PowerConstants.Major, false);

                yield return new TestCaseData(ItemTypes.Wand.ToString(), "Omnipotent", false);
                yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Mundane, false);
                yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Minor, true);
                yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Minor.ToUpper(), true);
                yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Minor.ToLower(), true);
                yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Medium, true);
                yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Medium.ToUpper(), true);
                yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Medium.ToLower(), true);
                yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Major, true);
                yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Major.ToUpper(), true);
                yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Major.ToLower(), true);

                yield return new TestCaseData(((int)ItemTypes.Wand).ToString(), "Omnipotent", false);
                yield return new TestCaseData(((int)ItemTypes.Wand).ToString(), PowerConstants.Mundane, false);
                yield return new TestCaseData(((int)ItemTypes.Wand).ToString(), PowerConstants.Minor, true);
                yield return new TestCaseData(((int)ItemTypes.Wand).ToString(), PowerConstants.Medium, true);
                yield return new TestCaseData(((int)ItemTypes.Wand).ToString(), PowerConstants.Major, true);

                yield return new TestCaseData(ItemTypes.Wand.ToString().ToUpper(), "Omnipotent", false);
                yield return new TestCaseData(ItemTypes.Wand.ToString().ToUpper(), PowerConstants.Mundane, false);
                yield return new TestCaseData(ItemTypes.Wand.ToString().ToUpper(), PowerConstants.Minor, true);
                yield return new TestCaseData(ItemTypes.Wand.ToString().ToUpper(), PowerConstants.Medium, true);
                yield return new TestCaseData(ItemTypes.Wand.ToString().ToUpper(), PowerConstants.Major, true);

                yield return new TestCaseData(ItemTypes.Wand.ToString().ToLower(), "Omnipotent", false);
                yield return new TestCaseData(ItemTypes.Wand.ToString().ToLower(), PowerConstants.Mundane, false);
                yield return new TestCaseData(ItemTypes.Wand.ToString().ToLower(), PowerConstants.Minor, true);
                yield return new TestCaseData(ItemTypes.Wand.ToString().ToLower(), PowerConstants.Medium, true);
                yield return new TestCaseData(ItemTypes.Wand.ToString().ToLower(), PowerConstants.Major, true);

                yield return new TestCaseData(ItemTypes.Weapon.ToString(), "Omnipotent", false);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Mundane, true);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Mundane.ToUpper(), true);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Mundane.ToLower(), true);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Minor, true);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Minor.ToUpper(), true);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Minor.ToLower(), true);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, true);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium.ToUpper(), true);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium.ToLower(), true);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Major, true);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Major.ToUpper(), true);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Major.ToLower(), true);

                yield return new TestCaseData(((int)ItemTypes.Weapon).ToString(), "Omnipotent", false);
                yield return new TestCaseData(((int)ItemTypes.Weapon).ToString(), PowerConstants.Mundane, true);
                yield return new TestCaseData(((int)ItemTypes.Weapon).ToString(), PowerConstants.Minor, true);
                yield return new TestCaseData(((int)ItemTypes.Weapon).ToString(), PowerConstants.Medium, true);
                yield return new TestCaseData(((int)ItemTypes.Weapon).ToString(), PowerConstants.Major, true);

                yield return new TestCaseData(ItemTypes.Weapon.ToString().ToUpper(), "Omnipotent", false);
                yield return new TestCaseData(ItemTypes.Weapon.ToString().ToUpper(), PowerConstants.Mundane, true);
                yield return new TestCaseData(ItemTypes.Weapon.ToString().ToUpper(), PowerConstants.Minor, true);
                yield return new TestCaseData(ItemTypes.Weapon.ToString().ToUpper(), PowerConstants.Medium, true);
                yield return new TestCaseData(ItemTypes.Weapon.ToString().ToUpper(), PowerConstants.Major, true);

                yield return new TestCaseData(ItemTypes.Weapon.ToString().ToLower(), "Omnipotent", false);
                yield return new TestCaseData(ItemTypes.Weapon.ToString().ToLower(), PowerConstants.Mundane, true);
                yield return new TestCaseData(ItemTypes.Weapon.ToString().ToLower(), PowerConstants.Minor, true);
                yield return new TestCaseData(ItemTypes.Weapon.ToString().ToLower(), PowerConstants.Medium, true);
                yield return new TestCaseData(ItemTypes.Weapon.ToString().ToLower(), PowerConstants.Major, true);

                yield return new TestCaseData(ItemTypeConstants.WondrousItem, "Omnipotent", false);
                yield return new TestCaseData(ItemTypeConstants.WondrousItem, PowerConstants.Mundane, false);
                yield return new TestCaseData(ItemTypeConstants.WondrousItem, PowerConstants.Minor, false);
                yield return new TestCaseData(ItemTypeConstants.WondrousItem, PowerConstants.Medium, false);
                yield return new TestCaseData(ItemTypeConstants.WondrousItem, PowerConstants.Major, false);

                yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), "Omnipotent", false);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Mundane, false);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Minor, true);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Minor.ToUpper(), true);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Minor.ToLower(), true);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Medium, true);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Medium.ToUpper(), true);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Medium.ToLower(), true);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Major, true);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Major.ToUpper(), true);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Major.ToLower(), true);

                yield return new TestCaseData(((int)ItemTypes.WondrousItem).ToString(), "Omnipotent", false);
                yield return new TestCaseData(((int)ItemTypes.WondrousItem).ToString(), PowerConstants.Mundane, false);
                yield return new TestCaseData(((int)ItemTypes.WondrousItem).ToString(), PowerConstants.Minor, true);
                yield return new TestCaseData(((int)ItemTypes.WondrousItem).ToString(), PowerConstants.Medium, true);
                yield return new TestCaseData(((int)ItemTypes.WondrousItem).ToString(), PowerConstants.Major, true);

                yield return new TestCaseData(ItemTypes.WondrousItem.ToString().ToUpper(), "Omnipotent", false);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString().ToUpper(), PowerConstants.Mundane, false);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString().ToUpper(), PowerConstants.Minor, true);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString().ToUpper(), PowerConstants.Medium, true);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString().ToUpper(), PowerConstants.Major, true);

                yield return new TestCaseData(ItemTypes.WondrousItem.ToString().ToLower(), "Omnipotent", false);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString().ToLower(), PowerConstants.Mundane, false);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString().ToLower(), PowerConstants.Minor, true);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString().ToLower(), PowerConstants.Medium, true);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString().ToLower(), PowerConstants.Major, true);
            }
        }

        [TestCaseSource(nameof(ItemGenerationData))]
        public async Task ValidateItem_ReturnsValidity(string itemTypeInput, string power, string name, bool valid)
        {
            var url = GetUrl(itemTypeInput, power, $"?name={HttpUtility.UrlEncode(name)}");
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.RunV1(request, itemTypeInput, power);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var validity = StreamHelper.Read<bool>(response.Body);
            Assert.That(validity, Is.EqualTo(valid));
        }

        public static IEnumerable ItemGenerationData
        {
            get
            {
                yield return new TestCaseData("Wrong Item Type", PowerConstants.Mundane, AlchemicalItemConstants.Acid, false);
                yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Mundane, AlchemicalItemConstants.Acid, false);
                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), "Wrong Power", AlchemicalItemConstants.Acid, false);
                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Medium, AlchemicalItemConstants.Acid, false);
                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Mundane, "Wrong Item", false);
                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Mundane, ToolConstants.ArtisansTools_Masterwork, false);
                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Mundane, AlchemicalItemConstants.Acid, true);
                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Mundane, AlchemicalItemConstants.Acid.ToUpper(), true);
                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Mundane, AlchemicalItemConstants.Acid.ToLower(), true);

                yield return new TestCaseData("Wrong Item Type", PowerConstants.Medium, ArmorConstants.AbsorbingShield, false);
                yield return new TestCaseData("Wrong Item Type", PowerConstants.Medium, ArmorConstants.BandedMail, false);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, ArmorConstants.AbsorbingShield, false);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, ArmorConstants.BandedMail, false);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), "Wrong Power", ArmorConstants.AbsorbingShield, false);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), "Wrong Power", ArmorConstants.BandedMail, false);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Mundane, ArmorConstants.AbsorbingShield, false);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Mundane, ArmorConstants.BandedMail, true);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Mundane, ArmorConstants.BandedMail.ToUpper(), true);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Mundane, ArmorConstants.BandedMail.ToLower(), true);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Mundane, ArmorConstants.PlateArmorOfTheDeep, false);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Mundane, ArmorConstants.PlateArmorOfTheDeep.ToLower(), false);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, "Wrong Item", false);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, "Wrong Item", false);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, WeaponConstants.Arrow, false);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, WeaponConstants.AssassinsDagger, false);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, ArmorConstants.AbsorbingShield, true);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, ArmorConstants.AbsorbingShield.ToUpper(), true);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, ArmorConstants.AbsorbingShield.ToLower(), true);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, ArmorConstants.BandedMail, true);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, ArmorConstants.BandedMail.ToUpper(), true);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, ArmorConstants.BandedMail.ToLower(), true);

                yield return new TestCaseData("Wrong Item Type", PowerConstants.Medium, PotionConstants.Aid, false);
                yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Medium, PotionConstants.Aid, false);
                yield return new TestCaseData(ItemTypes.Potion.ToString(), "Wrong Power", PotionConstants.Aid, false);
                yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Mundane, PotionConstants.Aid, false);
                yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium, "Wrong Item", false);
                yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium, RingConstants.AcidResistance_Greater, false);
                yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium, PotionConstants.Aid, true);
                yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium, PotionConstants.Aid.ToUpper(), true);
                yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium, PotionConstants.Aid.ToLower(), true);

                yield return new TestCaseData("Wrong Item Type", PowerConstants.Medium, RingConstants.AcidResistance_Greater, false);
                yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium, RingConstants.AcidResistance_Greater, false);
                yield return new TestCaseData(ItemTypes.Ring.ToString(), "Wrong Power", RingConstants.AcidResistance_Greater, false);
                yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Mundane, RingConstants.AcidResistance_Greater, false);
                yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Medium, "Wrong Item", false);
                yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Medium, PotionConstants.Aid, false);
                yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Medium, RingConstants.AcidResistance_Greater, true);
                yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Medium, RingConstants.AcidResistance_Greater.ToUpper(), true);
                yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Medium, RingConstants.AcidResistance_Greater.ToLower(), true);

                yield return new TestCaseData("Wrong Item Type", PowerConstants.Medium, RodConstants.Absorption, false);
                yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Medium, RodConstants.Absorption, false);
                yield return new TestCaseData(ItemTypes.Rod.ToString(), "Wrong Power", RodConstants.Absorption, false);
                yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Mundane, RodConstants.Absorption, false);
                yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Medium, "Wrong Item", false);
                yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Medium, StaffConstants.Abjuration, false);
                yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Medium, RodConstants.Absorption, true);
                yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Medium, RodConstants.Absorption.ToUpper(), true);
                yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Medium, RodConstants.Absorption.ToLower(), true);

                yield return new TestCaseData("Wrong Item Type", PowerConstants.Medium, "My Scroll", false);
                yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Medium, "My Scroll", true);
                yield return new TestCaseData(ItemTypes.Scroll.ToString(), "Wrong Power", "My Scroll", false);
                yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Mundane, "My Scroll", false);
                yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Medium, "Wrong Item", true);
                yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Medium, "My Wand", true);
                yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Medium, "My Scroll", true);

                yield return new TestCaseData("Wrong Item Type", PowerConstants.Medium, StaffConstants.Abjuration, false);
                yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Medium, StaffConstants.Abjuration, false);
                yield return new TestCaseData(ItemTypes.Staff.ToString(), "Wrong Power", StaffConstants.Abjuration, false);
                yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Mundane, StaffConstants.Abjuration, false);
                yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Medium, "Wrong Item", false);
                yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Medium, RodConstants.Absorption, false);
                yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Medium, StaffConstants.Abjuration, true);
                yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Medium, StaffConstants.Abjuration.ToUpper(), true);
                yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Medium, StaffConstants.Abjuration.ToLower(), true);

                yield return new TestCaseData("Wrong Item Type", PowerConstants.Mundane, ToolConstants.ArtisansTools_Masterwork, false);
                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Mundane, ToolConstants.ArtisansTools_Masterwork, false);
                yield return new TestCaseData(ItemTypes.Tool.ToString(), "Wrong Power", ToolConstants.ArtisansTools_Masterwork, false);
                yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Medium, ToolConstants.ArtisansTools_Masterwork, false);
                yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Mundane, "Wrong Item", false);
                yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Mundane, AlchemicalItemConstants.Acid, false);
                yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Mundane, ToolConstants.ArtisansTools_Masterwork, true);
                yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Mundane, ToolConstants.ArtisansTools_Masterwork.ToUpper(), true);
                yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Mundane, ToolConstants.ArtisansTools_Masterwork.ToLower(), true);

                yield return new TestCaseData("Wrong Item Type", PowerConstants.Medium, "My Wand", false);
                yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Medium, "My Wand", true);
                yield return new TestCaseData(ItemTypes.Wand.ToString(), "Wrong Power", "My Wand", false);
                yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Mundane, "My Wand", false);
                yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Medium, "Wrong Item", true);
                yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Medium, "My Scroll", true);
                yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Medium, "My Wand", true);

                yield return new TestCaseData("Wrong Item Type", PowerConstants.Medium, WeaponConstants.AssassinsDagger, false);
                yield return new TestCaseData("Wrong Item Type", PowerConstants.Medium, WeaponConstants.Arrow, false);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, WeaponConstants.AssassinsDagger, false);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, WeaponConstants.Arrow, false);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), "Wrong Power", WeaponConstants.AssassinsDagger, false);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), "Wrong Power", WeaponConstants.Arrow, false);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Mundane, WeaponConstants.AssassinsDagger, false);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Mundane, WeaponConstants.Arrow, true);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Mundane, WeaponConstants.Arrow.ToUpper(), true);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Mundane, WeaponConstants.Arrow.ToLower(), true);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Mundane, WeaponConstants.FrostBrand, false);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Mundane, WeaponConstants.FrostBrand.ToLower(), false);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, "Wrong Item", false);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, "Wrong Item", false);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, ArmorConstants.BandedMail, false);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, ArmorConstants.AbsorbingShield, false);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, WeaponConstants.AssassinsDagger, true);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, WeaponConstants.AssassinsDagger.ToUpper(), true);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, WeaponConstants.AssassinsDagger.ToLower(), true);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, WeaponConstants.Arrow, true);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, WeaponConstants.Arrow.ToUpper(), true);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, WeaponConstants.Arrow.ToLower(), true);

                yield return new TestCaseData("Wrong Item Type", PowerConstants.Medium, WondrousItemConstants.AmuletOfHealth, false);
                yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium, WondrousItemConstants.AmuletOfHealth, false);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), "Wrong Power", WondrousItemConstants.AmuletOfHealth, false);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Mundane, WondrousItemConstants.AmuletOfHealth, false);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Medium, "Wrong Item", false);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Medium, PotionConstants.Aid, false);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Medium, WondrousItemConstants.AmuletOfHealth, true);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Medium, WondrousItemConstants.AmuletOfHealth.ToUpper(), true);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Medium, WondrousItemConstants.AmuletOfHealth.ToLower(), true);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Medium, WondrousItemConstants.CloakOfArachnida, true);
            }
        }
    }
}