using Octokit;
using System.Linq;
using System.Threading.Tasks;

namespace DnDGen.Web.Repositories.Domain
{
    public class GitHubErrorRepository : ErrorRepository
    {
        private readonly IGitHubClient githubClient;

        public GitHubErrorRepository(IGitHubClient githubClient)
        {
            this.githubClient = githubClient;
        }

        public async Task Report(string title, string description)
        {
            var issueRequest = new RepositoryIssueRequest();
            issueRequest.Filter = IssueFilter.All;
            issueRequest.State = ItemStateFilter.All;
            issueRequest.Labels.Add("bug");

            var issues = await githubClient.Issue.GetAllForRepository("DnDGen", "DnDGen.Web", issueRequest);
            var issueExists = issues.Any(i => i.Title == title);

            if (issueExists == false)
            {
                var newIssue = new NewIssue(title);
                newIssue.Labels.Add("bug");
                newIssue.Body = description;

                await githubClient.Issue.Create("DnDGen", "DnDGen.Web", newIssue);
                return;
            }

            var issue = issues.First(i => i.Title == title);
            var issueIsInvalid = issue.Labels.Any(l => l.Name == "invalid");

            if (issueIsInvalid)
                return;

            if (issue.State == ItemState.Closed)
            {
                var updatedIssue = issue.ToUpdate();
                updatedIssue.State = ItemState.Open;
                await githubClient.Issue.Update("DnDGen", "DnDGen.Web", issue.Number, updatedIssue);
            }

            await githubClient.Issue.Comment.Create("DnDGen", "DnDGen.Web", issue.Number, description);
        }
    }
}