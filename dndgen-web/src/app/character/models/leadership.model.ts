import { FollowerQuantities } from "./followerQuantities.model";

export class Leadership {
  constructor(
    public score: number,
    public leadershipModifiers: string[],
    public cohortScore: number = 0,
    public followerQuantities: FollowerQuantities = new FollowerQuantities()
  ) { }
}
