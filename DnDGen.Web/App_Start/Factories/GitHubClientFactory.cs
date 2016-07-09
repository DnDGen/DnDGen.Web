using Octokit;
using System;

namespace DnDGen.Web.App_Start.Factories
{
    public static class GitHubClientFactory
    {
        private const String EncryptedToken = "ae9fbb32fbfb3543e482e0ec8e6847524b73d345";

        public static IGitHubClient Create()
        {
            var productHeaderValue = new ProductHeaderValue("DnDGen");
            var githubClient = new GitHubClient(productHeaderValue);
            var token = DecryptToken(EncryptedToken);

            githubClient.Credentials = new Credentials(token);

            return githubClient;
        }

        private static String DecryptToken(String encryptedToken)
        {
            var charArray = encryptedToken.ToCharArray();
            Array.Reverse(charArray);
            return new String(charArray);
        }
    }
}