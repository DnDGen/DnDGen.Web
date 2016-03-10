using Octokit;

namespace DNDGenSite.Tests.Fakes
{
    public class FakeIssue : Issue
    {
        public string Title
        {
            get { return base.Title; }
            set { base.Title = value; }
        }

        public ItemState State
        {
            get { return base.State; }
            set { base.State = value; }
        }

        public int Number
        {
            get { return base.Number; }
            set { base.Number = value; }
        }
    }
}
