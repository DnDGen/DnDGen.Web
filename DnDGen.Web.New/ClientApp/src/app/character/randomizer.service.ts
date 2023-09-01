import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RandomizerService {
  private baseUrl: string;
  constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  public validate(
    clientId: string,
    alignmentRandomizerType: string,
    setAlignment: string,
    classNameRandomizerType: string,
    setClassName: string,
    levelRandomizerType: string,
    setLevel: number,
    allowLevelAdjustments: boolean,
    baseRaceRandomizerType: string,
    setBaseRace: string,
    metaraceRandomizerType: string,
    forceMetarace: boolean,
    setMetarace: string
  ): Observable<boolean> {
    var url = this.baseUrl + "character/randomizers/validate";
    let params = new HttpParams()
      .set('clientId', clientId)
      .set('alignmentRandomizerType', alignmentRandomizerType)
      .set('setAlignment', setAlignment)
      .set('classNameRandomizerType', classNameRandomizerType)
      .set('setClassName', setClassName)
      .set('levelRandomizerType', levelRandomizerType)
      .set('setLevel', setLevel)
      .set('allowLevelAdjustments', allowLevelAdjustments)
      .set('baseRaceRandomizerType', baseRaceRandomizerType)
      .set('setBaseRace', setBaseRace)
      .set('metaraceRandomizerType', metaraceRandomizerType)
      .set('forceMetarace', forceMetarace)
      .set('setMetarace', setMetarace);

    return this.http.get<boolean>(url, { params: params });
  }
}
