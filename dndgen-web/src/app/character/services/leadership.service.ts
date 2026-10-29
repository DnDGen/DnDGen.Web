import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Character } from '../models/character.model';
import { Leadership } from '../models/leadership.model';

@Injectable({
  providedIn: 'root',
})
export class LeadershipService {
  constructor(private http: HttpClient) {
  }

  public generate(leaderLevel: number, leaderCharismaBonus: number, leaderAnimal: string): Observable<Leadership> {
    var url = "https://character.dndgen.com/api/v1/leadership/level/" + leaderLevel + "/generate";

    let params = new HttpParams()
      .set('leaderCharismaBonus', leaderCharismaBonus)
      .set('leaderAnimal', leaderAnimal);

    return this.http.get<Leadership>(url, { params: params });
  }

  public generateCohort(leaderLevel: number, cohortScore: number, leaderAlignment: string, leaderClass: string): Observable<Character | null> {
    var url = "https://character.dndgen.com/api/v1/cohort/score/" + cohortScore + "/generate";

    let params = new HttpParams()
      .set('leaderLevel', leaderLevel)
      .set('leaderAlignment', leaderAlignment)
      .set('leaderClassName', leaderClass);

    return this.http.get<Character>(url, { params: params });
  }

  public generateFollower(followerLevel: number, leaderAlignment: string, leaderClass: string): Observable<Character> {
    var url = "https://character.dndgen.com/api/v1/follower/level/" + followerLevel + "/generate";

    let params = new HttpParams()
      .set('leaderAlignment', leaderAlignment)
      .set('leaderClassName', leaderClass);

    return this.http.get<Character>(url, { params: params });
  }
}
