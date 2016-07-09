using CharacterGen.Generators;
using System.Linq;
using System.Web.Mvc;

namespace DnDGen.Web.Controllers.Characters
{
    public class LeadershipController : Controller
    {
        private ILeadershipGenerator leadershipGenerator;

        public LeadershipController(ILeadershipGenerator leadershipGenerator)
        {
            this.leadershipGenerator = leadershipGenerator;
        }

        [HttpGet]
        public JsonResult Generate(int leaderLevel, int leaderCharismaBonus, string leaderAnimal)
        {
            var leadership = leadershipGenerator.GenerateLeadership(leaderLevel, leaderCharismaBonus, leaderAnimal);
            return Json(new { leadership = leadership }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult Cohort(int cohortScore, int leaderLevel, string leaderAlignment, string leaderClass)
        {
            var cohort = leadershipGenerator.GenerateCohort(cohortScore, leaderLevel, leaderAlignment, leaderClass);

            cohort.Ability.Feats = cohort.Ability.Feats.OrderBy(f => f.Name);
            cohort.Ability.Skills = cohort.Ability.Skills.OrderBy(kvp => kvp.Key).ToDictionary(kvp => kvp.Key, kvp => kvp.Value);

            return Json(new { cohort = cohort }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult Follower(int followerLevel, string leaderAlignment, string leaderClass)
        {
            var follower = leadershipGenerator.GenerateFollower(followerLevel, leaderAlignment, leaderClass);

            follower.Ability.Feats = follower.Ability.Feats.OrderBy(f => f.Name);
            follower.Ability.Skills = follower.Ability.Skills.OrderBy(kvp => kvp.Key).ToDictionary(kvp => kvp.Key, kvp => kvp.Value);

            return Json(new { follower = follower }, JsonRequestBehavior.AllowGet);
        }
    }
}