﻿using DnDGen.TreasureGen.Items;
using DnDGen.TreasureGen.Items.Magical;
using DnDGen.TreasureGen.Items.Mundane;
using DnDGen.Web.Models.Treasures;
using NUnit.Framework;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;

namespace DnDGen.Web.Tests.Unit.Models
{
    [TestFixture]
    public class TreasureViewModelTests
    {
        private TreasureViewModel model;

        [SetUp]
        public void Setup()
        {
            model = new TreasureViewModel();
        }

        [Test]
        public void ModelHasTreasureTypes()
        {
            Assert.That(model.TreasureTypes, Contains.Item("Treasure"));
            Assert.That(model.TreasureTypes, Contains.Item("Coin"));
            Assert.That(model.TreasureTypes, Contains.Item("Goods"));
            Assert.That(model.TreasureTypes, Contains.Item("Items"));
            Assert.That(model.TreasureTypes.Count(), Is.EqualTo(4));
        }

        [Test]
        public void ModelHasMaxLevel()
        {
            Assert.That(model.MaxTreasureLevel, Is.EqualTo(100));
        }

        [Test]
        public void ModelHasItemTypeViewModels()
        {
            Assert.That(model.ItemTypeViewModels.Count(), Is.EqualTo(11).And.EqualTo(Enum.GetValues<ItemTypes>().Count()));

            var viewModels = model.ItemTypeViewModels.ToArray();
            Assert.That(viewModels[0].ItemType, Is.EqualTo(ItemTypes.AlchemicalItem.ToString()).And.EqualTo(Enum.GetName(ItemTypes.AlchemicalItem)));
            Assert.That(viewModels[0].DisplayName, Is.EqualTo(ItemTypeConstants.AlchemicalItem));
            Assert.That(viewModels[1].ItemType, Is.EqualTo(ItemTypes.Armor.ToString()).And.EqualTo(Enum.GetName(ItemTypes.Armor)));
            Assert.That(viewModels[1].DisplayName, Is.EqualTo(ItemTypeConstants.Armor));
            Assert.That(viewModels[2].ItemType, Is.EqualTo(ItemTypes.Potion.ToString()).And.EqualTo(Enum.GetName(ItemTypes.Potion)));
            Assert.That(viewModels[2].DisplayName, Is.EqualTo(ItemTypeConstants.Potion));
            Assert.That(viewModels[3].ItemType, Is.EqualTo(ItemTypes.Ring.ToString()).And.EqualTo(Enum.GetName(ItemTypes.Ring)));
            Assert.That(viewModels[3].DisplayName, Is.EqualTo(ItemTypeConstants.Ring));
            Assert.That(viewModels[4].ItemType, Is.EqualTo(ItemTypes.Rod.ToString()).And.EqualTo(Enum.GetName(ItemTypes.Rod)));
            Assert.That(viewModels[4].DisplayName, Is.EqualTo(ItemTypeConstants.Rod));
            Assert.That(viewModels[5].ItemType, Is.EqualTo(ItemTypes.Scroll.ToString()).And.EqualTo(Enum.GetName(ItemTypes.Scroll)));
            Assert.That(viewModels[5].DisplayName, Is.EqualTo(ItemTypeConstants.Scroll));
            Assert.That(viewModels[6].ItemType, Is.EqualTo(ItemTypes.Staff.ToString()).And.EqualTo(Enum.GetName(ItemTypes.Staff)));
            Assert.That(viewModels[6].DisplayName, Is.EqualTo(ItemTypeConstants.Staff));
            Assert.That(viewModels[7].ItemType, Is.EqualTo(ItemTypes.Tool.ToString()).And.EqualTo(Enum.GetName(ItemTypes.Tool)));
            Assert.That(viewModels[7].DisplayName, Is.EqualTo(ItemTypeConstants.Tool));
            Assert.That(viewModels[8].ItemType, Is.EqualTo(ItemTypes.Wand.ToString()).And.EqualTo(Enum.GetName(ItemTypes.Wand)));
            Assert.That(viewModels[8].DisplayName, Is.EqualTo(ItemTypeConstants.Wand));
            Assert.That(viewModels[9].ItemType, Is.EqualTo(ItemTypes.Weapon.ToString()).And.EqualTo(Enum.GetName(ItemTypes.Weapon)));
            Assert.That(viewModels[9].DisplayName, Is.EqualTo(ItemTypeConstants.Weapon));
            Assert.That(viewModels[10].ItemType, Is.EqualTo(ItemTypes.WondrousItem.ToString()).And.EqualTo(Enum.GetName(ItemTypes.WondrousItem)));
            Assert.That(viewModels[10].DisplayName, Is.EqualTo(ItemTypeConstants.WondrousItem));
        }

        [Test]
        public void ModelHasPowers()
        {
            Assert.That(model.Powers, Contains.Item(PowerConstants.Mundane));
            Assert.That(model.Powers, Contains.Item(PowerConstants.Minor));
            Assert.That(model.Powers, Contains.Item(PowerConstants.Medium));
            Assert.That(model.Powers, Contains.Item(PowerConstants.Major));
            Assert.That(model.Powers.Count(), Is.EqualTo(4));
        }

        [TestCaseSource(nameof(ItemNamesData))]
        public void ModelHasItemNames(ItemTypes itemType, IEnumerable<string> names)
        {
            Assert.That(model.ItemNames.Count(), Is.EqualTo(11).And.EqualTo(Enum.GetValues<ItemTypes>().Length));
            Assert.That(model.ItemNames, Contains.Key(itemType.ToString())
                .And.ContainKey(Enum.GetName(itemType)));
            Assert.That(model.ItemNames[itemType.ToString()], Is.EquivalentTo(names));
            Assert.That(model.ItemNames[itemType.ToString()], Is.EqualTo(names.OrderBy(n => n)));
        }

        public static IEnumerable ItemNamesData
        {
            get
            {
                yield return new TestCaseData(ItemTypes.AlchemicalItem, AlchemicalItemConstants.GetAllAlchemicalItems());
                yield return new TestCaseData(ItemTypes.Armor, ArmorConstants.GetAllArmors(true));
                yield return new TestCaseData(ItemTypes.Potion, PotionConstants.GetAllPotions(false));
                yield return new TestCaseData(ItemTypes.Ring, RingConstants.GetAllRings());
                yield return new TestCaseData(ItemTypes.Rod, RodConstants.GetAllRods());
                yield return new TestCaseData(ItemTypes.Scroll, new[] { "Scroll" });
                yield return new TestCaseData(ItemTypes.Staff, StaffConstants.GetAllStaffs());
                yield return new TestCaseData(ItemTypes.Tool, ToolConstants.GetAllTools());
                yield return new TestCaseData(ItemTypes.Wand, new[] { "Wand of Spell" });
                yield return new TestCaseData(ItemTypes.Weapon, WeaponConstants.GetAllWeapons(true, false));
                yield return new TestCaseData(ItemTypes.WondrousItem, WondrousItemConstants.GetAllWondrousItems());
            }
        }
    }
}