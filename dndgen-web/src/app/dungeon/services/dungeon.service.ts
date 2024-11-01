import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Area } from '../models/area.model';
import { DungeonGenViewModel } from '../models/dungeongenViewModel.model';

@Injectable({
  providedIn: 'root',
})
export class DungeonService {
  constructor(private http: HttpClient) {
  }

  public getViewModel(): Observable<DungeonGenViewModel> {
    var url = "https://web.dndgen.com/api/v1/dungeon/viewmodel";
    return this.http.get<DungeonGenViewModel>(url);
  }

  public generateAreasFromHall(
    dungeonLevel: number,
    environment: string, 
    temperature: string, 
    timeOfDay: string, 
    level: number, 
    filters: string[], 
    allowAquatic: boolean, 
    allowUnderground: boolean
  ): Observable<Area[]> {
    // HACK: In theory, passing empty values should fail and return quickly in the API
    // however, it tends to lag and time out after 10s
    // This seems exclusive to the URL parameters
    // So, we will validate them here
    if (!environment || !temperature || !timeOfDay) {
      throwError(() => new Error('Invalid environment, temperature, or time of day'));
    }

    var url = `https://dungeon.dndgen.com/api/v1/dungeon/level/${dungeonLevel}/hall/${temperature}/${environment}/${timeOfDay}/level/${level}/generate`;

    let params = this.getParameters(filters, allowAquatic, allowUnderground);

    return this.http.get<Area[]>(url, { params: params });
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

  public generateAreasFromDoor(
    dungeonLevel: number,
    environment: string, 
    temperature: string, 
    timeOfDay: string, 
    level: number, 
    filters: string[], 
    allowAquatic: boolean, 
    allowUnderground: boolean
  ): Observable<Area[]> {
    // HACK: In theory, passing empty values should fail and return quickly in the API
    // however, it tends to lag and time out after 10s
    // This seems exclusive to the URL parameters
    // So, we will validate them here
    if (!environment || !temperature || !timeOfDay) {
      throwError(() => new Error('Invalid environment, temperature, or time of day'));
    }

    var url = `https://dungeon.dndgen.com/api/v1/dungeon/level/${dungeonLevel}/door/${temperature}/${environment}/${timeOfDay}/level/${level}/generate`;

    let params = this.getParameters(filters, allowAquatic, allowUnderground);

    return this.http.get<Area[]>(url, { params: params });
  }
}
