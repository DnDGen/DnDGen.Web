using DnDGen.Web.Repositories;
using DnDGen.Web.Repositories.Domain;
using DnDGen.Web.Tests.Fakes;
using Moq;
using NUnit.Framework;
using Octokit;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DnDGen.Web.Tests.Unit.Repositories
{
    [TestFixture]
    public class GitHubErrorRepositoryTests
    {
        private ErrorRepository githubErrorRepository;
        private Mock<IGitHubClient> mockGitHubClient;
        private List<Issue> issues;

        [SetUp]
        public void Setup()
        {
            mockGitHubClient = new Mock<IGitHubClient>();
            githubErrorRepository = new GitHubErrorRepository(mockGitHubClient.Object);
            issues = new List<Issue>();

            mockGitHubClient.Setup(
                c =>
                    c.Issue.GetAllForRepository("DnDGen", "DnDGen.Web",
                        It.Is<RepositoryIssueRequest>(
                            r => r.Filter == IssueFilter.All && r.State == ItemStateFilter.All && r.Labels.Contains("bug"))))
                .Returns(Task.FromResult<IReadOnlyList<Issue>>(issues));

            mockGitHubClient.Setup(c => c.Issue.Create(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<NewIssue>()))
                .Returns(Task.FromResult(new Issue()));
            mockGitHubClient.Setup(c => c.Issue.Update(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<int>(), It.IsAny<IssueUpdate>()))
                .Returns(Task.FromResult(new Issue()));
            mockGitHubClient.Setup(c => c.Issue.Comment.Create(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<int>(), It.IsAny<string>()))
                .Returns(Task.FromResult(new IssueComment()));
        }

        [Test]
        public void CreateNewIssueIfNoneAlreadyThere()
        {
            githubErrorRepository.Report("title", "description");
            mockGitHubClient.Verify(c => c.Issue.Create(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<NewIssue>()), Times.Once);
            mockGitHubClient.Verify(c => c.Issue.Create("DnDGen", "DnDGen.Web", It.Is<NewIssue>(i => i.Body == "description" && i.Title == "title")), Times.Once);
        }

        [Test]
        public void CreateNewIssueIfMatchingIssueNotAlreadyThere()
        {
            AddFakeIssue("other title");

            githubErrorRepository.Report("title", "description");

            mockGitHubClient.Verify(c => c.Issue.Create(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<NewIssue>()), Times.Once);
            mockGitHubClient.Verify(c => c.Issue.Create("DnDGen", "DnDGen.Web", It.Is<NewIssue>(i => i.Body == "description" && i.Title == "title")), Times.Once);
        }

        private void AddFakeIssue(string title = "title", string description = "", ItemState state = ItemState.Closed, int number = 9266, params Label[] labels)
        {
            var issue = new FakeIssue(title, description, state, number, labels);
            issues.Add(issue);
        }

        [Test]
        public void NewIssuesAreLabeledAsBugs()
        {
            githubErrorRepository.Report("title", "description");
            mockGitHubClient.Verify(c => c.Issue.Create(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<NewIssue>()), Times.Once);
            mockGitHubClient.Verify(c => c.Issue.Create("DnDGen", "DnDGen.Web", It.Is<NewIssue>(i => i.Labels.Contains("bug"))), Times.Once);
        }

        [Test]
        public void IfIssueExists_DoNotCreateDuplicate()
        {
            AddFakeIssue();
            githubErrorRepository.Report("title", "description");
            mockGitHubClient.Verify(c => c.Issue.Create(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<NewIssue>()), Times.Never);
        }

        [Test]
        public void IfIssueExistsAndIsMarkedAsInvalid_DoNothing()
        {
            AddFakeIssue(labels: new[] { new Label(null, "invalid", string.Empty), new Label(null, "bug", string.Empty) });

            githubErrorRepository.Report("title", "description");

            mockGitHubClient.Verify(c => c.Issue.Update(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<int>(), It.IsAny<IssueUpdate>()), Times.Never);
        }

        [Test]
        public void IfIssueExistsAndIsClosed_Reopen()
        {
            AddFakeIssue(labels: new[] { new Label(null, "bug", string.Empty) });

            githubErrorRepository.Report("title", "description");

            mockGitHubClient.Verify(c => c.Issue.Update(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<int>(), It.IsAny<IssueUpdate>()), Times.Once);
            mockGitHubClient.Verify(c => c.Issue.Update("DnDGen", "DnDGen.Web", 9266, It.Is<IssueUpdate>(i => i.State == ItemState.Open)), Times.Once);
        }

        [Test]
        public void IfIssueExistsAndIsClosedWithNoLabels_Reopen()
        {
            AddFakeIssue();

            githubErrorRepository.Report("title", "description");

            mockGitHubClient.Verify(c => c.Issue.Update(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<int>(), It.IsAny<IssueUpdate>()), Times.Once);
            mockGitHubClient.Verify(c => c.Issue.Update("DnDGen", "DnDGen.Web", 9266, It.Is<IssueUpdate>(i => i.State == ItemState.Open)), Times.Once);
        }

        [Test]
        public void IfIssueExistsAndIsClosed_AddComment()
        {
            AddFakeIssue(labels: new[] { new Label(null, "bug", string.Empty) });

            githubErrorRepository.Report("title", "description");

            mockGitHubClient.Verify(c => c.Issue.Comment.Create(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<int>(), It.IsAny<string>()), Times.Once);
            mockGitHubClient.Verify(c => c.Issue.Comment.Create("DnDGen", "DnDGen.Web", 9266, "description"), Times.Once);
        }

        [Test]
        public void IfIssueExistsAndIsOpened_AddComment()
        {
            AddFakeIssue(state: ItemState.Open, labels: new[] { new Label(null, "bug", string.Empty) });

            githubErrorRepository.Report("title", "description");

            mockGitHubClient.Verify(c => c.Issue.Comment.Create(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<int>(), It.IsAny<string>()), Times.Once);
            mockGitHubClient.Verify(c => c.Issue.Comment.Create("DnDGen", "DnDGen.Web", 9266, "description"), Times.Once);
        }

        [Test]
        public void IfIssueExistsAndIsOpened_DoNotUpdateOpenClosedState()
        {
            AddFakeIssue(state: ItemState.Open, labels: new[] { new Label(null, "bug", string.Empty) });

            githubErrorRepository.Report("title", "description");
            mockGitHubClient.Verify(c => c.Issue.Update(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<int>(), It.IsAny<IssueUpdate>()), Times.Never);
        }
    }
}
