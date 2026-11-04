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

        private string[] _record;

        [OneTimeSetUp]
        public void Setup()
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
            Assert.That(columns, Is.EqualTo(["Lyric", "Sources"]));

            string[] sourcedLyrics = [.. table.Skip(1).SelectMany(row => row[0].Split("<br>"))];
            var lyrics = GetDistinctLyricLines();
            Assert.That(sourcedLyrics, Is.EqualTo(lyrics), "Each lyric line needs one Sources row, in the order it is first sung");
        }

        [Test]
        public void Sources_EveryQuotedPhraseIsStillInFile()
        {
            var repoRoot = GetRepoRoot();
            var missingPhrases = new List<string>();

            foreach (var row in GetTable(GetSection("Sources")).Skip(1))
            {
                foreach (var source in row[1].Split("<br>"))
                {
                    if (source.StartsWith("Not from source files"))
                        continue;

                    var fileNameMatch = BacktickPartialRegex().Match(source);
                    Assert.That(fileNameMatch.Success, Is.True, $"No source file in '{source}'");

                    var filePath = Path.Combine(repoRoot, fileNameMatch.Groups[1].Value);
                    Assert.That(File.Exists(filePath), Is.True, $"Source file '{filePath}' does not exist");

                    var content = WhitespacePartialRegex().Replace(File.ReadAllText(filePath), " ");
                    var citation = source[(fileNameMatch.Index + fileNameMatch.Length)..].Trim(':').Trim();
                    if (!content.Contains(citation))
                        missingPhrases.Add(source);
                }
            }

            Assert.That(missingPhrases, Is.Empty, "Source files changed under the song. Follow the Updating section of docs/theme-song/README.md");
        }

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

        [GeneratedRegex("`([^`]+)`")]
        private static partial Regex BacktickPartialRegex();

        private static string GetRepoRoot()
        {
            var dir = new DirectoryInfo(TestContext.CurrentContext.TestDirectory);

            while (dir != null && dir.GetFiles("*.sln").Length == 0)
                dir = dir.Parent;

            return dir?.FullName ?? string.Empty;
        }

    }
}
