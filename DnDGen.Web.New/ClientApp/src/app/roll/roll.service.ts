import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { LoggerService } from '../shared/logger.service';

@Injectable({
  providedIn: 'root',
})
export class RollService {
  constructor(private http: HttpClient, private logger: LoggerService) { }

  public getRoll(quantity: number, die: number): number | null {
    var url = "https://roll.dndgen.com/api/v2/" + quantity + "/d/" + die + "/roll";
    this.http.get<number>(url).subscribe({
      next: data => {
        return data;
      },
      error: error => {
        this.logger.logError(error.message);
        return null;
      }
    });

    return null;
  }

  public validateRoll(quantity: number, die: number): boolean | null {
    var url = "https://roll.dndgen.com/api/v2/" + quantity + "/d/" + die + "/validate";
    this.http.get<boolean>(url).subscribe({
      next: data => {
        return data;
      },
      error: error => {
        this.logger.logError(error.message);
        return null;
      }
    });

    return null;
  }

  public getExpressionRoll(expression: string): number | null {
    var url = 'https://roll.dndgen.com/api/v2/expression/roll';
    let params = new HttpParams().set('expression', expression);

    this.http.get<number>(url, { params: params }).subscribe({
      next: data => {
        return data;
      },
      error: error => {
        this.logger.logError(error.message);
        return null;
      }
    });

    return null;
  }

  public validateExpression(expression: string): boolean | null {
    var url = 'https://roll.dndgen.com/api/v2/expression/validate';
    let params = new HttpParams().set('expression', expression);

    this.http.get<boolean>(url, { params: params }).subscribe({
      next: data => {
        return data;
      },
      error: error => {
        this.logger.logError(error.message);
        return null;
      }
    });

    return null;
  }
}
