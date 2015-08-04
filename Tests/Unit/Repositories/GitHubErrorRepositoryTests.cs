using DNDGenSite.Repositories;
using DNDGenSite.Tests.Fakes;
using Moq;
using NUnit.Framework;
using Octokit;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DNDGenSite.Tests.Unit.Repositories
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
                    c.Issue.GetAllForRepository("DnDGen", "DNDGenSite",
                        It.Is<RepositoryIssueRequest>(
                            r => r.Filter == IssueFilter.All && r.State == ItemState.All && r.Labels.Contains("bug"))))
                .Returns(Task.FromResult<IReadOnlyList<Issue>>(issues));

            mockGitHubClient.Setup(c => c.Issue.Create(It.IsAny<String>(), It.IsAny<String>(), It.IsAny<NewIssue>()))
                .Returns(Task.FromResult(new Issue()));
            mockGitHubClient.Setup(c => c.Issue.Update(It.IsAny<String>(), It.IsAny<String>(), It.IsAny<Int32>(), It.IsAny<IssueUpdate>()))
                .Returns(Task.FromResult(new Issue()));
            mockGitHubClient.Setup(c => c.Issue.Comment.Create(It.IsAny<String>(), It.IsAny<String>(), It.IsAny<Int32>(), It.IsAny<String>()))
                .Returns(Task.FromResult(new IssueComment()));
        }

        [Test]
        public void CreateNewIssueIfNoneAlreadyThere()
        {
            githubErrorRepository.Report("title", "description");
            mockGitHubClient.Verify(c => c.Issue.Create(It.IsAny<String>(), It.IsAny<String>(), It.IsAny<NewIssue>()), Times.Once);
            mockGitHubClient.Verify(c => c.Issue.Create("DnDGen", "DNDGenSite", It.Is<NewIssue>(i => i.Body == "description" && i.Title == "title")), Times.Once);
        }

        [Test]
        public void CreateNewIssueIfMatchingIssueNotAlreadyThere()
        {
            issues.Add(new FakeIssue { Title = "other title" });

            githubErrorRepository.Report("title", "description");

            mockGitHubClient.Verify(c => c.Issue.Create(It.IsAny<String>(), It.IsAny<String>(), It.IsAny<NewIssue>()), Times.Once);
            mockGitHubClient.Verify(c => c.Issue.Create("DnDGen", "DNDGenSite", It.Is<NewIssue>(i => i.Body == "description" && i.Title == "title")), Times.Once);
        }

        [Test]
        public void NewIssuesAreLabeledAsBugs()
        {
            githubErrorRepository.Report("title", "description");
            mockGitHubClient.Verify(c => c.Issue.Create(It.IsAny<String>(), It.IsAny<String>(), It.IsAny<NewIssue>()), Times.Once);
            mockGitHubClient.Verify(c => c.Issue.Create("DnDGen", "DNDGenSite", It.Is<NewIssue>(i => i.Labels.Contains("bug"))), Times.Once);
        }

        [Test]
        public void IfIssueExists_DoNotCreateDuplicate()
        {
            issues.Add(new FakeIssue { Title = "title" });
            githubErrorRepository.Report("title", "description");
            mockGitHubClient.Verify(c => c.Issue.Create(It.IsAny<String>(), It.IsAny<String>(), It.IsAny<NewIssue>()), Times.Never);
        }

        [Test]
        public void IfIssueExistsAndIsClosed_Reopen()
        {
            issues.Add(new FakeIssue { Title = "title", State = ItemState.Closed, Number = 9266 });

            githubErrorRepository.Report("title", "description");

            mockGitHubClient.Verify(c => c.Issue.Update(It.IsAny<String>(), It.IsAny<String>(), It.IsAny<Int32>(), It.IsAny<IssueUpdate>()), Times.Once);
            mockGitHubClient.Verify(c => c.Issue.Update("DnDGen", "DNDGenSite", 9266, It.Is<IssueUpdate>(i => i.State == ItemState.Open)), Times.Once);
        }

        [Test]
        public void IfIssueExistsAndIsClosed_AddComment()
        {
            issues.Add(new FakeIssue { Title = "title", State = ItemState.Closed, Number = 9266 });

            githubErrorRepository.Report("title", "description");

            mockGitHubClient.Verify(c => c.Issue.Comment.Create(It.IsAny<String>(), It.IsAny<String>(), It.IsAny<Int32>(), It.IsAny<String>()), Times.Once);
            mockGitHubClient.Verify(c => c.Issue.Comment.Create("DnDGen", "DNDGenSite", 9266, "description"), Times.Once);
        }

        [Test]
        public void IfIssueExistsAndIsOpened_AddComment()
        {
            issues.Add(new FakeIssue { Title = "title", State = ItemState.Open, Number = 9266 });

            githubErrorRepository.Report("title", "description");

            mockGitHubClient.Verify(c => c.Issue.Comment.Create(It.IsAny<String>(), It.IsAny<String>(), It.IsAny<Int32>(), It.IsAny<String>()), Times.Once);
            mockGitHubClient.Verify(c => c.Issue.Comment.Create("DnDGen", "DNDGenSite", 9266, "description"), Times.Once);
        }

        [Test]
        public void IfIssueExistsAndIsOpened_DoNotUpdate()
        {
            issues.Add(new FakeIssue { Title = "title", State = ItemState.Open, Number = 9266 });
            githubErrorRepository.Report("title", "description");
            mockGitHubClient.Verify(c => c.Issue.Update(It.IsAny<String>(), It.IsAny<String>(), It.IsAny<Int32>(), It.IsAny<IssueUpdate>()), Times.Never);
        }
    }
}
