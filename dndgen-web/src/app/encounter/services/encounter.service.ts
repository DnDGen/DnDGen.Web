import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EncounterGenViewModel } from '../models/encountergenViewModel.model';
import { Encounter } from '../models/encounter.model';

@Injectable({
  providedIn: 'root',
})
export class EncounterService {
  constructor(private http: HttpClient) {
  }

  public getViewModel(): Observable<EncounterGenViewModel> {
    var url = "https://web.dndgen.com/api/v1/encounter/viewmodel";
    return this.http.get<EncounterGenViewModel>(url);
  }

  public generate(
    environment: string, 
    temperature: string, 
    timeOfDay: string, 
    level: number, 
    filters: string[], 
    allowAquatic: boolean, 
    allowUnderground: boolean
  ): Observable<Encounter> {
    var url = `https://encounter.dndgen.com/api/v1/encounter/${temperature}/${environment}/${timeOfDay}/level/${level}/generate`;

    let params = this.getParameters(filters, allowAquatic, allowUnderground);

    return this.http.get<Encounter>(url, { params: params });
  }
  

  private getParameters(filters: string[], allowAquatic: boolean, allowUnderground: boolean): HttpParams {
    return new HttpParams({
      fromObject: {
        creatureTypeFilters: filters,
        allowAquatic: allowAquatic,
        allowUnderground: allowUnderground
      }
    });

    // return new HttpParams()
    //   .set('creatureTypeFilters', filters)
    //   .set('allowAquatic', allowAquatic)
    //   .set('allowUnderground', allowUnderground);
  }

  public validate(
    environment: string, 
    temperature: string, 
    timeOfDay: string, 
    level: number, 
    filters: string[], 
    allowAquatic: boolean, 
    allowUnderground: boolean
  ): Observable<boolean> {
    var url = `https://encounter.dndgen.com/api/v1/encounter/${temperature}/${environment}/${timeOfDay}/level/${level}/validate`;

    let params = this.getParameters(filters, allowAquatic, allowUnderground);

    return this.http.get<boolean>(url, { params: params });
  }
}
