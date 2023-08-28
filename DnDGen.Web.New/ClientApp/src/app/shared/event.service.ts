import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GenEvent } from './genEvent.model';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private baseUrl: string;

  constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  public getClientId(): Observable<{ clientId: string }> {
    var url = this.baseUrl + "event/clientid";
    return this.http.get<{ clientId: string }>(url);
  }

  public getEvents(clientId: string): Observable<{ events: GenEvent[] }> {
    var url = this.baseUrl + "event/all?clientId=" + clientId;

    return this.http.get<{ events: GenEvent[] }>(url);
  }

  public clearEvents(clientId: string): void {
    var url = this.baseUrl + "event/clear";

    this.http.post(url, { clientId: clientId });
  }
}
