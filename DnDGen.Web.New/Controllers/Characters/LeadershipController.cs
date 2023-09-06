using CharacterGen.Characters;
using CharacterGen.Leaders;
using DnDGen.Web.New.Helpers;
using DnDGen.Web.New.IoC;
using EventGen;
using Microsoft.AspNetCore.Mvc;

namespace DnDGen.Web.New.Controllers.Characters
{
    [ApiController]
    public class LeadershipController : ControllerBase
    {
        private readonly ILeadershipGenerator leadershipGenerator;
        private readonly ClientIDManager clientIdManager;

        public LeadershipController(IDependencyFactory dependencyFactory)
        {
            leadershipGenerator = dependencyFactory.Get<ILeadershipGenerator>();
            clientIdManager = dependencyFactory.Get<ClientIDManager>();
        }

        [Route("Character/Leadership/Generate")]
        [HttpGet]
        public Leadership Generate(Guid clientId, int leaderLevel, int leaderCharismaBonus, string? leaderAnimal)
        {
            clientIdManager.SetClientID(clientId);

            var leadership = leadershipGenerator.GenerateLeadership(leaderLevel, leaderCharismaBonus, leaderAnimal);
            return leadership;
        }

        [Route("Character/cohort/generate")]
        [HttpGet]
        public Character Cohort(Guid clientId, int cohortScore, int leaderLevel, string leaderAlignment, string leaderClass)
        {
            clientIdManager.SetClientID(clientId);

            var cohort = leadershipGenerator.GenerateCohort(cohortScore, leaderLevel, leaderAlignment, leaderClass);

            if (cohort != null)
            {
                cohort.Skills = CharacterHelper.SortSkills(cohort.Skills);
            }

            return cohort;
        }

        [Route("Character/Follower/generate")]
        [HttpGet]
        public Character Follower(Guid clientId, int followerLevel, string leaderAlignment, string leaderClass)
        {
            clientIdManager.SetClientID(clientId);

            var follower = leadershipGenerator.GenerateFollower(followerLevel, leaderAlignment, leaderClass);

            follower.Skills = CharacterHelper.SortSkills(follower.Skills);

            return follower;
        }
    }
}