import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Creature } from '../models/creature.model';
import { CreatureGenViewModel } from '../models/creaturegen-view-model.model';

@Injectable({
  providedIn: 'root',
})
export class CreatureService {
  constructor(private http: HttpClient) {
  }

  public getViewModel(): Observable<CreatureGenViewModel> {
    var url = "https://web.dndgen.com/api/v1/creature/viewmodel";
    return this.http.get<CreatureGenViewModel>(url);
  }

  public generateCreature(creatureName: string, templates: string[]): Observable<Creature> {
    var url = `https://creature.dndgen.com/api/v1/creature/${encodeURIComponent(creatureName)}/generate`;
    return this.http.get<Creature>(url, { params: this.getTemplateParams(templates) });
  }

  public validateCreature(creatureName: string, templates: string[]): Observable<boolean> {
    var url = `https://creature.dndgen.com/api/v1/creature/${encodeURIComponent(creatureName)}/validate`;
    return this.http.get<boolean>(url, { params: this.getTemplateParams(templates) });
  }

  public generateRandom(templates: string[], challengeRating: string, alignment: string, creatureType: string): Observable<Creature> {
    var url = "https://creature.dndgen.com/api/v1/creature/generate";
    return this.http.get<Creature>(url, { params: this.getRandomParams(templates, challengeRating, alignment, creatureType) });
  }

  public validateRandom(templates: string[], challengeRating: string, alignment: string, creatureType: string): Observable<boolean> {
    var url = "https://creature.dndgen.com/api/v1/creature/validate";
    return this.http.get<boolean>(url, { params: this.getRandomParams(templates, challengeRating, alignment, creatureType) });
  }

  private getTemplateParams(templates: string[]): HttpParams {
    let params = new HttpParams();
    templates.forEach(template => params = params.append('templates', template));
    return params;
  }

  private getRandomParams(templates: string[], challengeRating: string, alignment: string, creatureType: string): HttpParams {
    let params = this.getTemplateParams(templates);

    if (challengeRating)
      params = params.set('cr', challengeRating);

    if (alignment)
      params = params.set('alignment', alignment);

    if (creatureType)
      params = params.set('type', creatureType);

    return params;
  }
}
