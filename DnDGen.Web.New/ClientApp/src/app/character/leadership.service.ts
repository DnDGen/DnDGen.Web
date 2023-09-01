import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Character } from './character.model';
import { Leadership } from './leadership.model';

@Injectable({
  providedIn: 'root',
})
export class LeadershipService {
  private baseUrl: string;

  constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  public generate(clientId: string, leaderLevel: number, leaderCharismaBonus: number, leaderAnimal: string): Observable<Leadership> {
    var url = this.baseUrl + "character/leadership/generate";
    let params = new HttpParams()
      .set('clientId', clientId)
      .set('leaderLevel', leaderLevel)
      .set('leaderCharismaBonus', leaderCharismaBonus)
      .set('leaderAnimal', leaderAnimal);

    return this.http.get<Leadership>(url, { params: params });
  }

  public generateCohort(clientId: string, leaderLevel: number, cohortScore: number, leaderAlignment: string, leaderClass: string): Observable<Character> {
    var url = this.baseUrl + "character/cohort/generate";
    let params = new HttpParams()
      .set('clientId', clientId)
      .set('leaderLevel', leaderLevel)
      .set('cohortScore', cohortScore)
      .set('leaderAlignment', leaderAlignment)
      .set('leaderClass', leaderClass);

    return this.http.get<Character>(url, { params: params });
  }

  public generateFollower(clientId: string, followerLevel: number, leaderAlignment: string, leaderClass: string): Observable<Character> {
    var url = this.baseUrl + "character/follower/generate";
    let params = new HttpParams()
      .set('clientId', clientId)
      .set('followerLevel', followerLevel)
      .set('leaderAlignment', leaderAlignment)
      .set('leaderClass', leaderClass);

    return this.http.get<Character>(url, { params: params });
  }
}
