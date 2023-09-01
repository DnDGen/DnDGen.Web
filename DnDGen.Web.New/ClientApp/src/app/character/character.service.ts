import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Character } from './character.model';
import { CharacterGenViewModel } from './charactergenViewModel.model';

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  private baseUrl: string;
  constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  public getViewModel(): Observable<CharacterGenViewModel> {
    var url = this.baseUrl + "character/viewmodel";
    return this.http.get<CharacterGenViewModel>(url);
  }

  public generate(
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
    setMetarace: string,
    abilitiesRandomizerType: string,
    setStrength: number,
    setConstitution: number,
    setDexterity: number,
    setIntelligence: number,
    setWisdom: number,
    setCharisma: number,
    allowAbilityAdjustments: boolean
  ): Observable<Character> {
    var url = this.baseUrl + "character/generate";
    let params = new HttpParams()
      .set('clientId', clientId)
      .set('alignmentRandomizerType', alignmentRandomizerType)
      .set('classNameRandomizerType', classNameRandomizerType)
      .set('levelRandomizerType', levelRandomizerType)
      .set('baseRaceRandomizerType', baseRaceRandomizerType)
      .set('metaraceRandomizerType', metaraceRandomizerType)
      .set('abilitiesRandomizerType', abilitiesRandomizerType)
      .set('setAlignment', setAlignment)
      .set('setClassName', setClassName)
      .set('setLevel', setLevel)
      .set('allowLevelAdjustments', allowLevelAdjustments)
      .set('setBaseRace', setBaseRace)
      .set('forceMetarace', forceMetarace)
      .set('setMetarace', setMetarace)
      .set('setStrength', setStrength)
      .set('setConstitution', setConstitution)
      .set('setDexterity', setDexterity)
      .set('setIntelligence', setIntelligence)
      .set('setWisdom', setWisdom)
      .set('setCharisma', setCharisma)
      .set('allowAbilityAdjustments', allowAbilityAdjustments);

    return this.http.get<Character>(url, { params: params });
  }
}
