using CharacterGen.Generators;
using System;
using System.Web.Mvc;

namespace DNDGenSite.Controllers.Characters
{
    public class LeadershipController : Controller
    {
        private ILeadershipGenerator leadershipGenerator;

        public LeadershipController(ILeadershipGenerator leadershipGenerator)
        {
            this.leadershipGenerator = leadershipGenerator;
        }

        [HttpGet]
        public JsonResult Generate(Int32 leaderLevel, Int32 leaderCharismaBonus, String leaderAnimal)
        {
            var leadership = leadershipGenerator.GenerateLeadership(leaderLevel, leaderCharismaBonus, leaderAnimal);
            return Json(new { leadership = leadership }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult Cohort(Int32 cohortScore, Int32 leaderLevel, String leaderAlignment)
        {
            var cohort = leadershipGenerator.GenerateCohort(cohortScore, leaderLevel, leaderAlignment);
            return Json(new { cohort = cohort }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult Follower(Int32 followerLevel, String leaderAlignment)
        {
            var follower = leadershipGenerator.GenerateFollower(followerLevel, leaderAlignment);
            return Json(new { follower = follower }, JsonRequestBehavior.AllowGet);
        }
    }
}