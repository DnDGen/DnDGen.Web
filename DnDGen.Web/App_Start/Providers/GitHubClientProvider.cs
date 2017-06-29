using Ninject.Activation;
using Octokit;
using System;

namespace DnDGen.Web.App_Start.Providers
{
    class GitHubClientProvider : Provider<IGitHubClient>
    {
        private const string EncryptedToken = "ae9fbb32fbfb3543e482e0ec8e6847524b73d345";

        protected override IGitHubClient CreateInstance(IContext context)
        {
            var productHeaderValue = new ProductHeaderValue("DnDGen");
            var githubClient = new GitHubClient(productHeaderValue);
            var token = DecryptToken(EncryptedToken);

            githubClient.Credentials = new Credentials(token);

            return githubClient;
        }

        private static string DecryptToken(string encryptedToken)
        {
            var charArray = encryptedToken.ToCharArray();
            Array.Reverse(charArray);
            return new string(charArray);
        }
    }
}