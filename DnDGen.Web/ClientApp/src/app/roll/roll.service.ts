import { Inject, Injectable } from '@angular/core';
import { type HttpClient, HttpParams } from '@angular/common/http';
import type { Observable } from 'rxjs';
import type { RollGenViewModel } from './rollgenViewModel.model';

@Injectable({
  providedIn: 'root',
})
export class RollService {
  private webBaseUrl: string;
  constructor(private http: HttpClient, @Inject('WEB_BASE_URL') baseUrl: string) {
    this.webBaseUrl = baseUrl;
  }
  
  public getViewModel(): Observable<RollGenViewModel> {
    var url = this.webBaseUrl + "roll/viewmodel";
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
