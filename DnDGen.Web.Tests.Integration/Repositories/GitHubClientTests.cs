using Ninject;
using NUnit.Framework;
using Octokit;
using System;
using System.Collections.Generic;
using System.Linq;

namespace DnDGen.Web.Tests.Integration.Repositories
{
    [TestFixture]
    public class GitHubClientTests : IntegrationTests
    {
        [Inject]
        public IGitHubClient GitHubClient { get; set; }

        private RepositoryIssueRequest issueRequest;

        [SetUp]
        public void Setup()
        {
            issueRequest = new RepositoryIssueRequest();
            issueRequest.Filter = IssueFilter.All;
            issueRequest.State = ItemStateFilter.All;
            issueRequest.Labels.Add("automated-testing");
        }

        [Test]
        public void FilterByLabel()
        {
            var issuesTask = GitHubClient.Issue.GetAllForRepository("DnDGen", "DnDGen.Web", issueRequest);
            issuesTask.Wait();

            var issues = issuesTask.Result;
            var allForAutomatedTests = issues.All(i => i.Labels.Any(l => l.Name == "automated-testing"));
            Assert.That(allForAutomatedTests, Is.True);
        }

        [Test]
        public void CreateIssue()
        {
            var title = Guid.NewGuid().ToString();
            var newIssue = new NewIssue(title);
            newIssue.Labels.Add("automated-testing");
            newIssue.Body = "this is for automated testing";

            var newIssueTask = GitHubClient.Issue.Create("DnDGen", "DnDGen.Web", newIssue);
            newIssueTask.Wait();

            var issues = GetIssues();
            var issueCreated = issues.Any(i => i.Title == title);
            Assert.That(issueCreated, Is.True);

            var issue = issues.First(i => i.Title == title);
            var issueUpdate = issue.ToUpdate();
            issueUpdate.State = ItemState.Closed;

            var updateTask = GitHubClient.Issue.Update("DnDGen", "DnDGen.Web", issue.Number, issueUpdate);
            updateTask.Wait();
        }

        [Test]
        public void UpdateIssue()
        {
            var newBody = Guid.NewGuid().ToString();

            var issues = GetIssues();
            var issue = issues.First();
            var issueUpdate = issue.ToUpdate();
            issueUpdate.Body = newBody;

            var updateTask = GitHubClient.Issue.Update("DnDGen", "DnDGen.Web", issue.Number, issueUpdate);
            updateTask.Wait();

            issues = GetIssues();
            var issueUpdated = issues.Any(i => i.Body == newBody);
            Assert.That(issueUpdated, Is.True);
        }

        [Test]
        public void CreateIssueComment()
        {
            var newComment = Guid.NewGuid().ToString();

            var issues = GetIssues();
            var issue = issues.First();

            var newCommentTask = GitHubClient.Issue.Comment.Create("DnDGen", "DnDGen.Web", issue.Number, newComment);
            newCommentTask.Wait();

            var commentTask = GitHubClient.Issue.Comment.GetAllForIssue("DnDGen", "DnDGen.Web", issue.Number);
            commentTask.Wait();

            var comments = commentTask.Result;
            var newCommentAdded = comments.Any(c => c.Body == newComment);
            Assert.That(newCommentAdded, Is.True);
        }

        private IEnumerable<Issue> GetIssues()
        {
            var issuesTask = GitHubClient.Issue.GetAllForRepository("DnDGen", "DnDGen.Web", issueRequest);
            issuesTask.Wait();
            return issuesTask.Result;
        }
    }
}
