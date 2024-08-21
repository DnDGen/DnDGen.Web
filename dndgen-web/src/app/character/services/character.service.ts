import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Character } from '../models/character.model';
import { CharacterGenViewModel } from '../models/charactergenViewModel.model';

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  constructor(private http: HttpClient) {
  }

  public getViewModel(): Observable<CharacterGenViewModel> {
    var url = "https://web.dndgen.com/api/v1/character/viewmodel";
    return this.http.get<CharacterGenViewModel>(url);
  }

  public generate(
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
    var url = "https://character.dndgen.com/api/v1/character/generate";

    let params = new HttpParams()
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

  public validate(
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
    var url = "https://character.dndgen.com/api/v1/character/validate";

    let params = new HttpParams()
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
