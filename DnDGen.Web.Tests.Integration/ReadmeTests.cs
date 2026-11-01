using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;

namespace DnDGen.Web.Tests.Integration
{
    internal partial class ReadmeTests
    {
        private const string ThemeSongBadge = "[![Theme Song](https://img.shields.io/badge/theme_song-Suno-ff69b4)]";
        private const string RecordUrl = "https://github.com/DnDGen/DnDGen.Web/blob/main/docs/theme-song/README.md";

        private string[] _readme;

        [OneTimeSetUp]
        public void Setup()
        {
            var path = Path.Combine(TestContext.CurrentContext.TestDirectory, "README.md");
            _readme = File.ReadAllLines(path);
        }

        [Test]
        public void ThemeSong_HasBadgeBesideTheBuildBadge()
        {
            var buildBadgeLine = _readme.FirstOrDefault(line => line.StartsWith("[![Build Status]")) ?? string.Empty;
            Assert.That(buildBadgeLine, Does.Contain($" {ThemeSongBadge}(https://suno.com/s/"));
        }

        [Test]
        public void ThemeSong_HasSectionAtTheEnd()
        {
            var headings = GetLinesOutsideCodeBlocks(_readme).Where(line => line.StartsWith("## "));
            Assert.That(headings.LastOrDefault(), Is.EqualTo("## Theme Song"));
        }

        [Test]
        public void ThemeSong_LinksToTheRecord()
        {
            var links = GetLinks(_readme);
            Assert.That(links, Does.Contain(RecordUrl));

            var recordPath = Path.Combine(TestContext.CurrentContext.TestDirectory, "docs", "theme-song", "README.md");
            Assert.That(recordPath, Does.Exist);
        }

        [Test]
        public void ThemeSong_LinksToTheSameSongAsTheRecord()
        {
            var recordPath = Path.Combine(TestContext.CurrentContext.TestDirectory, "docs", "theme-song", "README.md");
            var record = File.ReadAllLines(recordPath);
            string[] recordSongs = [.. GetLinks(record).Where(IsSunoLink).Distinct()];
            string[] readmeSongs = [.. GetLinks(_readme).Where(IsSunoLink).Distinct()];

            Assert.That(recordSongs, Has.Exactly(1).Items, "The record needs to link to one song");
            Assert.That(readmeSongs, Is.EqualTo(recordSongs));
        }

        private static bool IsSunoLink(string link) => link.StartsWith("https://suno.com/");

        private static string[] GetLinks(IEnumerable<string> lines)
        {
            var links = GetLinesOutsideCodeBlocks(lines)
                .SelectMany(line => MarkdownLinkPartialRegex().Matches(line).Concat(HtmlLinkPartialRegex().Matches(line)))
                .Select(match => match.Groups[1].Value);

            return [.. links];
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

        [GeneratedRegex(@"\]\(([^)\s]+)\)")]
        private static partial Regex MarkdownLinkPartialRegex();

        [GeneratedRegex(@"(?:href|src)=""([^""]+)""")]
        private static partial Regex HtmlLinkPartialRegex();
    }
}
