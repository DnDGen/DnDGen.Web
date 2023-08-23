import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class RollService {
  constructor(private http: HttpClient) {
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }

    // Return an observable with a user-facing error message.
    return null;
  }

  public getRoll(quantity: number, die: number) {
    var url = "https://roll.dndgen.com/api/v2/" + quantity + "/d/" + die + "/roll";
    //this.http.get<number>(url).subscribe(result => {
    //  return result;
    //}, error: handleError);

    return this.http.get<number>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  public validateRoll(quantity: number, die: number) {
    var url = "https://roll.dndgen.com/api/v2/" + quantity + "/d/" + die + "/validate";
    this.http.get(url).subscribe(result => {
      return result;
    }, error: handleError);
  }

  public getExpressionRoll(expression: string) {
    var url = 'https://roll.dndgen.com/api/v2/expression/roll';
    let params = new HttpParams().set('expression', expression);

    this.http.get(url, { params: params }).subscribe(result => {
      return result;
    }, error: handleError);
  }

  public validateExpression(expression: string) {
    var url = 'https://roll.dndgen.com/api/v2/expression/validate';
    let params = new HttpParams().set('expression', expression);

    this.http.get(url, { params: params }).subscribe(result => {
      return result;
    }, error: handleError);
  }
}
