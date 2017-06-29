using CharacterGen.Leaders;
using DnDGen.Web.Helpers;
using EventGen;
using System;
using System.Web.Mvc;

namespace DnDGen.Web.Controllers.Characters
{
    public class LeadershipController : Controller
    {
        private readonly ILeadershipGenerator leadershipGenerator;
        private readonly ClientIDManager clientIdManager;

        public LeadershipController(ILeadershipGenerator leadershipGenerator, ClientIDManager clientIdManager)
        {
            this.leadershipGenerator = leadershipGenerator;
            this.clientIdManager = clientIdManager;
        }

        [HttpGet]
        public JsonResult Generate(Guid clientId, int leaderLevel, int leaderCharismaBonus, string leaderAnimal)
        {
            clientIdManager.SetClientID(clientId);

            var leadership = leadershipGenerator.GenerateLeadership(leaderLevel, leaderCharismaBonus, leaderAnimal);
            return Json(new { leadership = leadership }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult Cohort(Guid clientId, int cohortScore, int leaderLevel, string leaderAlignment, string leaderClass)
        {
            clientIdManager.SetClientID(clientId);

            var cohort = leadershipGenerator.GenerateCohort(cohortScore, leaderLevel, leaderAlignment, leaderClass);

            cohort.Skills = CharacterHelper.SortSkills(cohort.Skills);

            return Json(new { cohort = cohort }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult Follower(Guid clientId, int followerLevel, string leaderAlignment, string leaderClass)
        {
            clientIdManager.SetClientID(clientId);

            var follower = leadershipGenerator.GenerateFollower(followerLevel, leaderAlignment, leaderClass);

            follower.Skills = CharacterHelper.SortSkills(follower.Skills);

            return Json(new { follower = follower }, JsonRequestBehavior.AllowGet);
        }
    }
}