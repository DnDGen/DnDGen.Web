using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;

namespace DnDGen.Web.Tests.Integration.Docs.ThemeSong
{
    internal partial class ThemeSongReadmeTests
    {
        private const int SunoTitleLimit = 80;
        private const int SunoStyleLimit = 1000;
        private const int SunoLyricsLimit = 5000;
        private const int SourceTableRowCount = 81;

        private string[] _record;

        [OneTimeSetUp]
        public void OneTimeSetup()
        {
            var path = Path.Combine(TestContext.CurrentContext.TestDirectory, "docs", "theme-song", "README.md");
            _record = File.ReadAllLines(path);
        }

        [Test]
        public void HasCorrectSectionsInOrder()
        {
            string[] sectionNames =
            [
                "Updating",
                "Title",
                "Style",
                "Lyrics",
                "Sources",
                "Suno Notes",
                "Album Art",
            ];
            var headings = GetLinesOutsideCodeBlocks(_record).Where(line => line.StartsWith("## "));
            Assert.That(headings, Is.EqualTo(sectionNames.Select(s => $"## {s}")));

            foreach (var sectionName in sectionNames)
            {
                var section = GetSection(sectionName);
                Assert.That(section, Is.Not.Empty, sectionName);
            }
        }

        [TestCase("Title", SunoTitleLimit)]
        [TestCase("Style", SunoStyleLimit)]
        [TestCase("Lyrics", SunoLyricsLimit)]
        public void SunoField_FitsSunoLimit(string field, int limit)
        {
            var block = GetCodeBlock(field);
            Assert.That(block, Has.Length.LessThanOrEqualTo(limit).And.Not.Empty);
        }

        [Test]
        public void Sources_HasCorrectTable()
        {
            var sources = GetSection("Sources");
            var table = GetTable(sources);
            string[] columns = table.FirstOrDefault() ?? [];
            Assert.That(columns, Is.EqualTo(["#", "Lyric", "Sources"]));

            int[] rowNumbers = [.. table.Skip(1).Select(row => Convert.ToInt32(row[0]))];
            Assert.That(rowNumbers, Has.Length.EqualTo(SourceTableRowCount).And.EqualTo(Enumerable.Range(1, SourceTableRowCount)));

            string[] sourcedLyrics = [.. table.Skip(1).SelectMany(row => row[1].Split("<br>"))];
            var lyrics = GetDistinctLyricLines();
            Assert.That(sourcedLyrics, Is.EqualTo(lyrics), "Each lyric line needs one Sources row, in the order it is first sung");
        }

        [TestCaseSource(nameof(SourcesRowNumbersTestCases))]
        public void Sources_CitationIsValid(int rowIndex)
        {
            var row = GetTable(GetSection("Sources"))[rowIndex];
            var sources = row[2].Split("<br>");

            foreach (var source in sources)
            {
                if (source.StartsWith("Not from source files"))
                    Assert.Pass($"Source '{source}' is not from a source file");

                Assert.That(source, Contains.Substring(":"), "Source is not properly formatted");

                var sections = source.Split("`:");
                Assert.That(sections, Has.Length.EqualTo(2), "Source is not properly formatted");
                var fileName = sections[0].Trim('`').Trim();
                var citation = sections[1].Trim();

                var repoRoot = GetRepoRoot();
                var filePath = Path.Combine(repoRoot, fileName);
                Assert.That(File.Exists(filePath), Is.True, $"Source file '{filePath}' does not exist");

                var rawContent = File.ReadAllText(filePath);
                var content = WhitespacePartialRegex().Replace(rawContent, " ");
                Assert.That(content, Contains.Substring(citation));
            }
        }

        public static IEnumerable SourcesRowNumbersTestCases => Enumerable.Range(1, SourceTableRowCount).Select(i => new TestCaseData(i));

        [Test]
        public void AlbumArt_LinksToTheSong()
        {
            var lines = GetLinesOutsideCodeBlocks(_record).ToArray();
            string[] coverLinks = [.. lines.Select(line => CoverPartialRegex().Match(line)).Where(m => m.Success).Select(m => m.Groups[1].Value)];
            string[] listenLinks = [.. lines.Select(line => ListenPartialRegex().Match(line)).Where(m => m.Success).Select(m => m.Groups[1].Value)];

            using (Assert.EnterMultipleScope())
            {
                Assert.That(listenLinks, Has.Exactly(1).Items.And.All.StartsWith("https://suno.com/s/"), "Listen on Suno needs one share link to the song");
                Assert.That(coverLinks, Is.EqualTo(listenLinks), "The cover needs to link to the same song as Listen on Suno");
            }
        }

        [Test]
        public void AlbumArt_ImageExists()
        {
            var path = Path.Combine(TestContext.CurrentContext.TestDirectory, "docs", "theme-song", "cover.png");
            Assert.That(path, Does.Exist);
        }

        private string[] GetDistinctLyricLines()
        {
            var lines = GetCodeBlock("Lyrics")
                .Split('\n')
                .Select(line => line.Trim())
                .Where(line => line.Length > 0)
                .Where(line => !line.StartsWith('['))
                .Distinct();

            return [.. lines];
        }

        private static IEnumerable<string> GetLinesOutsideCodeBlocks(IEnumerable<string> lines)
        {
            var inCodeBlock = false;

            foreach (var line in lines)
            {
                if (line.StartsWith("```"))
                    inCodeBlock = !inCodeBlock;
                else if (!inCodeBlock)
                    yield return line;
            }
        }

        private List<string> GetSection(string heading)
        {
            var section = new List<string>();
            var inSection = false;
            var inCodeBlock = false;

            foreach (var line in _record)
            {
                if (line.StartsWith("```"))
                    inCodeBlock = !inCodeBlock;

                if (!inCodeBlock && line.StartsWith("## "))
                    inSection = line == $"## {heading}";
                else if (inSection && (inCodeBlock || !string.IsNullOrWhiteSpace(line)))
                    section.Add(line);
            }

            return section;
        }

        private static List<string> GetCodeBlocks(List<string> section)
        {
            var blocks = new List<string>();
            List<string>? block = null;

            foreach (var line in section)
            {
                if (!line.StartsWith("```"))
                {
                    block?.Add(line);
                }
                else if (block == null)
                {
                    block = [];
                }
                else
                {
                    blocks.Add(string.Join("\n", block));
                    block = null;
                }
            }

            return blocks;
        }

        private string GetCodeBlock(string field)
        {
            var section = GetSection(field);
            var blocks = GetCodeBlocks(section);
            Assert.That(blocks, Has.Exactly(1).Items, $"## {field} needs exactly one code block");

            return blocks[0];
        }

        private static List<string[]> GetTable(List<string> section)
        {
            var cells = section
                .Where(line => line.StartsWith('|'))
                .Select(GetCells)
                .Where(cells => !cells.All(cell => CellPartialRegex().IsMatch(cell)))
                .ToList();

            return [.. cells];
        }

        private static string[] GetCells(string row)
        {
            var cells = row.Trim().Trim('|').Split('|').Select(cell => cell.Trim());
            return [.. cells];
        }

        [GeneratedRegex("^:?-+:?$")]
        private static partial Regex CellPartialRegex();

        [GeneratedRegex(@"\[!\[[^\]]*\]\(cover\.png\)\]\(([^)]+)\)")]
        private static partial Regex CoverPartialRegex();

        [GeneratedRegex(@"\*\*Listen on \[Suno\]\(([^)]+)\)\.\*\*")]
        private static partial Regex ListenPartialRegex();

        [GeneratedRegex(@"\s+")]
        private static partial Regex WhitespacePartialRegex();

        private static string GetRepoRoot()
        {
            var dir = new DirectoryInfo(TestContext.CurrentContext.TestDirectory);

            while (dir != null && dir.GetFiles("*.sln").Length == 0)
                dir = dir.Parent;

            return dir?.FullName ?? string.Empty;
        }

    }
}
