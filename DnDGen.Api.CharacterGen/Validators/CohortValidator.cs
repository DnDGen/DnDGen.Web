﻿using DnDGen.Api.CharacterGen.Models;
using Microsoft.AspNetCore.Http;
using System;

namespace DnDGen.Api.CharacterGen.Validators
{
    public static class CohortValidator
    {
        public static (bool Valid, string Error, CohortSpecifications CohortSpecifications) GetValid(HttpRequest request)
        {
            var leaderAlignment = (string)request.Query["leaderAlignment"];
            var leaderClassName = (string)request.Query["leaderClassName"];
            var leaderLevel = Convert.ToInt32(request.Query["leaderLevel"]);

            var spec = new CohortSpecifications { LeaderLevel = leaderLevel };
            spec.SetAlignment(leaderAlignment);
            spec.SetClassName(leaderClassName);

            var result = spec.IsValid();
            return (result.Valid, result.Error, spec);
        }
    }
}
