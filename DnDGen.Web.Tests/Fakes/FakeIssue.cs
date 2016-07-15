using Octokit;
using System;

namespace DnDGen.Web.Tests.Fakes
{
    public class FakeIssue : Issue
    {
        public FakeIssue(string title, string body, ItemState state, int number, params Label[] labels)
            : base(null, null, null, null, number, state, title, body, null, null, labels, null, null, 0, null, null, new DateTimeOffset(), null, 0, false, null)
        {

        }
    }
}
