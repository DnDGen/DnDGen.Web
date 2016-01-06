using Octokit;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace DNDGenSite.Repositories.Domain
{
    public class GitHubErrorRepository : ErrorRepository
    {
        private readonly IGitHubClient githubClient;

        public GitHubErrorRepository(IGitHubClient githubClient)
        {
            this.githubClient = githubClient;
        }

        public async Task Report(String title, String description)
        {
            var issueRequest = new RepositoryIssueRequest();
            issueRequest.Filter = IssueFilter.All;
            issueRequest.State = ItemState.All;
            issueRequest.Labels.Add("bug");

            var issues = await githubClient.Issue.GetAllForRepository("DnDGen", "DNDGenSite", issueRequest);
            var issueExists = issues.Any(i => i.Title == title);

            if (issueExists == false)
            {
                var newIssue = new NewIssue(title);
                newIssue.Labels.Add("bug");
                newIssue.Body = description;

                await githubClient.Issue.Create("DnDGen", "DNDGenSite", newIssue);
                return;
            }

            var issue = issues.First(i => i.Title == title);

            if (issue.State == ItemState.Closed)
            {
                var updatedIssue = issue.ToUpdate();
                updatedIssue.State = ItemState.Open;
                await githubClient.Issue.Update("DnDGen", "DNDGenSite", issue.Number, updatedIssue);
            }

            await githubClient.Issue.Comment.Create("DnDGen", "DNDGenSite", issue.Number, description);
        }
    }
}