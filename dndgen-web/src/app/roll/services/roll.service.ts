import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import type { Observable } from 'rxjs';
import type { RollGenViewModel } from '../models/rollgenViewModel.model';

@Injectable({
  providedIn: 'root',
})
export class RollService {
  constructor(private http: HttpClient) { }
  
  public getViewModel(): Observable<RollGenViewModel> {
    var url = "https://web.dndgen.com/api/v1/roll/viewmodel";
    return this.http.get<RollGenViewModel>(url);
  }

  public getRoll(quantity: number, die: number): Observable<number> {
    var url = "https://roll.dndgen.com/api/v2/" + quantity + "/d/" + die + "/roll";

    return this.http.get<number>(url);
  }

  public validateRoll(quantity: number, die: number): Observable<boolean> {
    var url = "https://roll.dndgen.com/api/v2/" + quantity + "/d/" + die + "/validate";

    return this.http.get<boolean>(url);
  }

  public getExpressionRoll(expression: string): Observable<number> {
    var url = 'https://roll.dndgen.com/api/v2/expression/roll';
    let params = new HttpParams().set('expression', expression);

    return this.http.get<number>(url, { params: params });
  }

  public validateExpression(expression: string): Observable<boolean> {
    var url = 'https://roll.dndgen.com/api/v2/expression/validate';
    let params = new HttpParams().set('expression', expression);

    return this.http.get<boolean>(url, { params: params });
  }
}
