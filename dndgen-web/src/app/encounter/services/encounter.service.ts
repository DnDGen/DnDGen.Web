import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
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
    // HACK: In theory, passing empty values should fail and return quickly in the API
    // however, it tends to lag and time out after 10s
    // This seems exclusive to the URL parameters
    // So, we will validate them here
    if (!environment || !temperature || !timeOfDay) {
      throwError(() => new Error('Invalid environment, temperature, or time of day'));
    }

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
    // HACK: In theory, passing empty values should fail and return quickly in the API
    // however, it tends to lag and time out after 10s
    // This seems exclusive to the URL parameters
    // So, we will validate them here
    if (!environment || !temperature || !timeOfDay) {
      return of(false);
    }

    var url = `https://encounter.dndgen.com/api/v1/encounter/${temperature}/${environment}/${timeOfDay}/level/${level}/validate`;

    let params = this.getParameters(filters, allowAquatic, allowUnderground);

    return this.http.get<boolean>(url, { params: params });
  }
}
