import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import type { Observable } from 'rxjs';
import type { TreasureGenViewModel } from '../models/treasuregenViewModel.model';
import type { Treasure } from '../models/treasure.model';
import type { Item } from '../models/item.model';
import { Weapon } from '../models/weapon.model';
import { Armor } from '../models/armor.model';

@Injectable({
  providedIn: 'root',
})
export class TreasureService {
  constructor(private http: HttpClient) {
  }

  public getViewModel(): Observable<TreasureGenViewModel> {
    var url = "https://web.dndgen.com/api/v1/treasure/viewmodel";
    return this.http.get<TreasureGenViewModel>(url);
  }
  
  public getTreasure(treasureType: string, level: number): Observable<Treasure> {
    var url = "https://treasure.dndgen.com/api/v2/" + treasureType + "/level/" + level + "/generate";
    return this.http.get<Treasure>(url);
  }
  
  public validateTreasure(treasureType: string, level: number): Observable<boolean> {
    var url = "https://treasure.dndgen.com/api/v2/" + treasureType + "/level/" + level + "/validate";
    return this.http.get<boolean>(url);
  }

  public getItem(itemType: string, power: string, name: string): Observable<Item> {
    var url = "https://treasure.dndgen.com/api/v2/item/" + itemType + "/power/" + power + "/generate";

    if (!name) {
      return this.http.get<Item | Weapon | Armor>(url);
    }

    let params = new HttpParams().set('name', name);
    return this.http.get<Item | Weapon | Armor>(url, { params: params });
  }

  public validateItem(itemType: string, power: string, name: string): Observable<boolean> {
    var url = "https://treasure.dndgen.com/api/v2/item/" + itemType + "/power/" + power + "/validate";

    if (!name) {
      return this.http.get<boolean>(url);
    }

    let params = new HttpParams().set('name', name);
    return this.http.get<boolean>(url, { params: params });
  }
}
