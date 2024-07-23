import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import type { Observable } from 'rxjs';
import type { TreasureGenViewModel } from '../models/treasuregenViewModel.model';
import type { Treasure } from '../models/treasure.model';
import type { Item } from '../models/item.model';

@Injectable({
  providedIn: 'root',
})
export class TreasureService {
  private webBaseUrl: string;
  constructor(private http: HttpClient, @Inject('WEB_BASE_URL') baseUrl: string) {
    this.webBaseUrl = baseUrl;
  }

  public getViewModel(): Observable<TreasureGenViewModel> {
    var url = this.webBaseUrl + "treasure/viewmodel";
    return this.http.get<TreasureGenViewModel>(url);
  }
  
  public getTreasure(treasureType: string, level: number): Observable<Treasure> {
    var url = "https://treasure.dndgen.com/api/v1/" + treasureType + "/level/" + level + "/generate";
    return this.http.get<Treasure>(url);
  }
  
  public validateTreasure(treasureType: string, level: number): Observable<boolean> {
    var url = "https://treasure.dndgen.com/api/v1/" + treasureType + "/level/" + level + "/validate";
    return this.http.get<boolean>(url);
  }

  public getItem(itemType: string, power: string, name: string | null): Observable<Item> {
    var url = "https://treasure.dndgen.com/api/v1/item/" + itemType + "/power/" + power + "/generate";

    if (!name) {
      return this.http.get<Item>(url);
    }

    let params = new HttpParams().set('name', name);
    return this.http.get<Item>(url, { params: params });
  }

  public validateItem(itemType: string, power: string, name: string | null): Observable<boolean> {
    var url = "https://treasure.dndgen.com/api/v1/item/" + itemType + "/power/" + power + "/validate";

    if (!name) {
      return this.http.get<boolean>(url);
    }

    let params = new HttpParams().set('name', name);
    return this.http.get<boolean>(url, { params: params });
  }
}
