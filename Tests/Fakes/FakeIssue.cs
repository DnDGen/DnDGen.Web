using Octokit;
using System;

namespace DNDGenSite.Tests.Fakes
{
    public class FakeIssue : Issue
    {
        public String Title
        {
            get { return base.Title; }
            set { base.Title = value; }
        }

        public ItemState State
        {
            get { return base.State; }
            set { base.State = value; }
        }

        public Int32 Number
        {
            get { return base.Number; }
            set { base.Number = value; }
        }
    }
}
