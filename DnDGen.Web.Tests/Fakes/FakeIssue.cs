using Octokit;

namespace DnDGen.Web.Tests.Fakes
{
    public class FakeIssue : Issue
    {
        public new string Title
        {
            get { return base.Title; }
            set { base.Title = value; }
        }

        public new ItemState State
        {
            get { return base.State; }
            set { base.State = value; }
        }

        public new int Number
        {
            get { return base.Number; }
            set { base.Number = value; }
        }
    }
}
